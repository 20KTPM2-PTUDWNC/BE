import usersService from "../services/users.js";
import User, { UserFlag } from "../models/users.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import UserClassModel from "../models/userClass.js";
import StudentClassModel from "../models/studentClass.js";
import Papa from "papaparse";
import fs from "fs";
import studentClass from "../models/studentClass.js";
import NotificationModel, { Description, Title } from "../models/notification.js";
import StudentIdReviewModel from "../models/studentIdReview.js";
import StudentGradeModel from "../models/studentGrade.js";

export const getUserProfile = async (req, res, next) => {
    const userId = req.params.id;
    const user = await usersService.findUserById(userId);

    if (user) {
        return res.status(200).json(user);
    }
    else {
        return res.status(400).json({ message: `No user with id: ${userId} ` });
    }
};

export const updateUserProfile = async (req, res, next) => {
    const userId = req.params.id;
    const user = await usersService.findUserById(userId);
    const { userflag, _password } = req.body;
    let passwordEncrypt;
    let userUpdate;

    if (!user) {
        return res.status(400).json({ message: `No user with id: ${userId} ` });
    }

    if (_password) {
        passwordEncrypt = await bcrypt.hash(_password, 10);
    }

    if (user.userFlag === 0) {
        userUpdate = await User.findByIdAndUpdate({ _id: user._id }, { ...req.body, userFlag: userflag, password: passwordEncrypt },
            {
                new: true,
                runValidators: true
            });
    }
    else {
        userUpdate = await User.findByIdAndUpdate({ _id: user._id }, { ...req.body, userFlag: 1, password: passwordEncrypt },
            {
                new: true,
                runValidators: true
            });
    }
    res.status(200).json(userUpdate);
}

export const uploadPhoto = async (req, res) => {

    let fileName;

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./uploads");
        },
        filename: function (req, file, cb) {
            fileName = file.originalname;
            cb(null, file.originalname);
        },
    });

    const upload = multer({ storage: storage });
    upload.single("user-avatar")(req, res, async function (err) {
        const userId = req.params.id;
        let userUpdate;
        const user = await usersService.findUserById(userId);
        if (err) {
            next(err);
        } else {
            user.avatar = fileName;

            userUpdate = await User.findByIdAndUpdate({ _id: user._id }, { avatar: fileName });
        }
        res.status(200).json(user.avatar);
    });
};

export const mappingStudentId = async (req, res, next) => {
    const { studentId, userId } = req.body;

    if (!studentId || !userId) {
        return res.status(400).json({ message: 'Invalid fields' });
    }

    const user = await usersService.findUserById(userId);

    if (!user) {
        return res.status(400).json({ message: `No user with id: ${userId} ` });
    }

    if (await usersService.isStudentIdMapped(studentId, userId)) {
        const userUpdate = await User.findByIdAndUpdate({ _id: user._id }, { studentId },
            {
                new: true,
                runValidators: true
            });

        await StudentClassModel.updateMany({ studentId }, { userId });

        let userClass = await UserClassModel.find({ userId });

        userClass = userClass.map((d) => ({
            studentId,
            classId: d._doc.classId,
            name: user.name,
            userId
        }));

        const bulkOps = userClass.map(studentData => ({
            updateOne: {
                filter: { userId, classId: studentData.classId },
                update: { $set: studentData },
                upsert: true
            }
        }));

        await StudentClassModel.bulkWrite(bulkOps);

        await StudentGradeModel.updateMany({ userId }, { studentId });

        return res.status(200).json(userUpdate);
    } else {
        return res.status(400).json({ message: `Existed student mapped with studentId: ${studentId} ` });
    }
}

export const getAllUser = async (req, res, next) => {
    const users = await usersService.findAllUsers();
    const filteredUsers = users.filter(user => user.userFlag !== 0);
    return res.status(200).json(filteredUsers);
}

export const lockAccount = async (req, res, next) => {
    const userId = req.params.userId;
    await User.findByIdAndUpdate({ _id: userId }, { deleteAt: new Date() },
        {
            new: true,
            runValidators: true
        });
    return res.status(200).json({ message: 'Successfully' });
}

export const unmappingStudentId = async (req, res, next) => {
    const userId = req.params.userId;
    await User.findByIdAndUpdate({ _id: userId }, { studentId: null },
        {
            new: true,
            runValidators: true
        });

    await StudentClassModel.updateMany({ userId }, { studentId: null });
    await StudentGradeModel.updateMany({ userId }, { studentId: null });
    return res.status(200).json({ message: 'Successfully' });
}

export const mappingStudentIdByCsv = async (req, res, next) => {

    const filePath = req.file.path;

    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: "File not found" });
    }

    const readStream = fs.createReadStream(filePath);
    readStream.on('error', (err) => {
        res.status(500).json({ error: "Error reading the file" });
    });

    let parsedData = [];
    let sentResponse = false; // Biến kiểm soát để đảm bảo chỉ gửi một lần

    Papa.parse(readStream, {
        header: true,
        step: async function (result) {
            parsedData.push(result.data);

            const studentId = result.data.studentId;
            const name = result.data.name;
            const email = result.data.email;

            const existingStudent = await studentClass.findOne({ studentId: studentId });

            if (!existingStudent) {
                const checkStudent = await usersService.findUserByEmail(email);

                if (checkStudent) {
                    const userId = checkStudent._id;

                    if (await usersService.isStudentIdMapped(studentId, userId)) {
                        const userUpdate = await User.findByIdAndUpdate({ _id: userId }, { studentId },
                            {
                                new: true,
                                runValidators: true
                            });

                        await StudentClassModel.updateMany({ studentId }, { userId });

                        let userClass = await UserClassModel.find({ userId });

                        userClass = userClass.map((d) => ({
                            studentId,
                            name,
                            userId,
                            email
                        }));

                        const bulkOps = userClass.map(studentData => ({
                            updateOne: {
                                filter: { userId, classId: studentData.classId },
                                update: { $set: studentData },
                                upsert: true
                            }
                        }));

                        await StudentClassModel.bulkWrite(bulkOps);
                        await StudentGradeModel.updateMany({ userId }, { studentId });

                        if (!sentResponse) {
                            res.status(200).json({ message: 'Mapping student Ids by uploading Excel file successfully' });
                            sentResponse = true;
                        }
                    } else {
                        if (!sentResponse) {
                            res.status(400).json({ message: `Existed student mapped with studentId: ${studentId} ` });
                            sentResponse = true;
                        }
                    }
                }
            }
        },
        complete: function () {
            if (!sentResponse) {
                // Chỉ gửi dữ liệu đã phân tích một lần sau khi xử lý hoàn tất
                res.json(parsedData);
                sentResponse = true;
            }
        },
        error: function (error) {
            if (!sentResponse) {
                res.status(400).json({ error: "CSV parsing error has occurred" });
                sentResponse = true;
            }
        }
    });
}

export const notification = async (req, res, next) => {
    const userId = req.params.userId;

    const notification = await NotificationModel.find({ receiverId: userId }).sort({ "createdAt": -1 });

    return res.status(200).json(notification);
}

export const markNotification = async (req, res, next) => {
    const notificationId = req.params.notificationId;

    await NotificationModel.findByIdAndUpdate(notificationId, { mark: 1 });

    return res.status(200).json({ message: 'Successfully' });
}

export const reviewStudentId = async (req, res, next) => {
    const { text, sort, studentId, userId } = req.body;

    if (studentId && text && sort) {
        await usersService.updateStudentIdReview({ text, sort, userId, studentId });

        // get receiver
        const user = await User.findById(userId);
        const student = await User.findById(studentId);

        // notification
        let notification = {
            title: Title.StudentId
        }

        if (user.userFlag === UserFlag.Admin) {
            notification = {
                ...notification,
                description: Description.StudentId,
                receiverId: studentId,
                url: `user/${userId}`
            }

            await NotificationModel.create(notification);
        } else {
            let receiver = await User.find({ userFlag: UserFlag.Admin });

            receiver = receiver.map((d) => ({
                ...notification,
                description: Description.Admin(student.name),
                receiverId: d._doc._id,
                url: `admin/CSKH/${studentId}`
            }));

            await NotificationModel.insertMany(receiver);
        }

        return res.status(200).json({ message: 'Successfully' });
    }

    return res.status(400).json({ message: 'Fail' });
}

export const studentIdReviewDetail = async (req, res, next) => {
    const userId = req.params.userId;

    if (userId) {
        const studentIdReviews = await StudentIdReviewModel.find({ studentId: userId }, { _id: 1, text: 1, sort: 1 }).populate('userId', { _id: 1, name: 1 }).sort({ "sort": 1 });

        return res.status(200).json(studentIdReviews);
    }

    return res.status(400).json({ message: 'Fail' });
}

export const studentReviews = async (req, res, next) => {
    const groupedReviews = await StudentIdReviewModel.aggregate([
        {
            $group: {
                _id: '$studentId',
                reviews: { $push: '$$ROOT' }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        }
    ]);

    const populatedReviews = await Promise.all(groupedReviews.map(async (group) => {
        const userIds = group.reviews.map(review => review.userId);
        const users = await User.find({ _id: { $in: userIds } }, 'name');

        const populated = await Promise.all(group.reviews.map(async review => {
            const user = users.find(u => u._id.equals(review.userId));
            const populatedReview = {
                text: review.text,
                sort: review.sort,
                userId: { _id: user._id, name: user.name }
            };
            return populatedReview;
        }));

        return { user: { _id: group.user._id, name: group.user.name, studentId: group.user.name.studentId}, reviews: populated };
    }));

    return res.status(400).json(populatedReviews);
}