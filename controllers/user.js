import usersService from "../services/users.js";
import User from "../models/users.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import UserClassModel from "../models/userClass.js";
import StudentClassModel from "../models/studentClass.js";
import studentClass from "../models/studentClass.js";

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

        await StudentClassModel.updateMany({studentId}, {userId});

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

        return res.status(200).json(userUpdate);
    } else {
        return res.status(400).json({ message: `Existed student mapped with studentId: ${studentId} ` });
    }
}

export const getAllUser = async (req, res, next) => {
    const users = await usersService.findAllUsers();
    return res.status(200).json(users);
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
    
    await StudentClassModel.updateMany({userId}, {studentId: null});
    return res.status(200).json({ message: 'Successfully' });
}