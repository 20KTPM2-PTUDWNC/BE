import usersService from "../services/users.js";
import User from "../models/users.js";
import bcrypt from "bcryptjs";
import multer from "multer";

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
    const user = await usersService.findUserById(userId);

    if (!user) {
        return res.status(400).json({ message: `No user with id: ${userId} ` });
    }

    if (studentId) {
        const userUpdate = await User.findByIdAndUpdate({ _id: user._id }, { studentId },
            {
                new: true,
                runValidators: true
            });

        res.status(200).json(userUpdate);
    }
}