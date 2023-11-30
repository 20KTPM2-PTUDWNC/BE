import classesService from "../services/class.js";
import userClassService from "../services/userClass.js";
import usersService from "../services/users.js";
import userClassModel from "../models/userClass.js";
import jwt from "jsonwebtoken";
import { transporter } from "../config/email.js"

export const createClass = async (req, res, next) => {
    const { name, subject, room } = req.body;
    const authorId = req.user._id;
    const generateCode = Math.random().toString(20).substr(2, 6);

    if (!name || !subject || !room) {
        return res.status(400).json({ message: 'Invalid Class' });
    }

    const newClass = { ...req.body, authorId: authorId, code: generateCode };
    const createdClass = await classesService.save(newClass);

    const teacher = { userId: authorId, classId: createdClass._id, userRole: 1 };
    await userClassModel.create(teacher);

    res.status(200).json({ message: "Create new class successfully" });

}

export const getAllClass = async (req, res, next) => {
    const classes = await classesService.findAllClasses();

    if (classes) {
        return res.status(200).json(classes);
    }
    else {
        res.status(400).json({ message: "No class" });
    }
}

export const showClassDetail = async (req, res, next) => {
    const classId = req.params.id;
    const _class = await classesService.findClassById(classId);

    if (_class) {
        return res.status(200).json(_class);
    }
    else {
        res.status(400).json({ message: `No class with id: ${classId} ` });
    }
}

export const createInvitationLink = async (req, res, next) => {
    const { classId, role } = req.body;

    const _class = await classesService.findClassById(classId);

    if (_class) {

        const invitation = {
            classId,
            role
        }

        const accessToken = jwt.sign(JSON.stringify(invitation), process.env.SECRET_KEY);

        const link = `${process.env.FRONTEND_DOMAIN}/#/acceptInvitation/${accessToken}`;

        return res.status(200).json({ link });
    }
    else {
        return res.status(400).json({ message: `No class with id: ${classId} ` });
    }
}

export const invitationByEmail = async (req, res, next) => {
    const { classId, email, role } = req.body;

    const _class = await classesService.findClassById(classId);

    if (_class) {

        // Kiểm tra đã join class
        const user = await usersService.findUserByEmail(email);

        if (user) {
            const check = await userClassService.checkStudentInClass(classId, user.id);
            if (check) {
                return res.status(422).json({ message: `User was in class ${classId}` })
            }
        }

        const invitation = {
            classId,
            email,
            role
        }

        const accessToken = jwt.sign(JSON.stringify(invitation), process.env.SECRET_KEY);

        const link = `${process.env.FRONTEND_DOMAIN}/#/acceptInvitation/${accessToken}`;

        const mailOptions = {
            from: process.env.MAILER_USER,
            to: email,
            subject: `Invitation to join class ${_class.name}`,
            text: `Click this link to join class:\n${link}`
        };

        let info = await transporter.sendMail(mailOptions);
        if (!info) {
            return res.status(400).json({ message: `Send email fail` })
        }

        return res.status(200).json({ message: `Had sent` });
    }
    else {
        return res.status(400).json({ message: `No class with id: ${classId} ` });
    }
}

export const acceptInvitation = async (req, res, next) => {
    const { token, userId } = req.body;

    if (!token | !userId) {
        return res.status(400).json({ message: `Invalid field` });
    }

    const tokenEncrypt = jwt.verify(token, process.env.SECRET_KEY);

    const _class = await classesService.findClassById(tokenEncrypt.classId);

    if (_class) {

        const check = await userClassService.checkStudentInClass(_class.id, userId);
        if (check) {
            return res.status(422).json({ message: `User was in class ${_class.id}` })
        }

        const data = {
            classId: tokenEncrypt.classId,
            role: tokenEncrypt.role,
            userId
        }

        const userClass = await userClassService.save(data);

        return res.status(200).json({ id: userClass.id });
    }
    else {
        return res.status(400).json({ message: `No class with id: ${classId} ` });
    }
}

export const joinClass = async (req, res, next) => {
    const { code, userId } = req.body;

    if (!code | !userId) {
        return res.status(400).json({ message: `Invalid field` });
    }

    const _class = await classesService.findClassByCode(code);

    if (_class) {

        const check = await userClassService.checkStudentInClass(_class.id, userId);
        if (check) {
            return res.status(422).json({ message: `User was in class ${_class.id}` })
        }

        const userClass = await userClassService.save({ userId, classId: _class.id, role: 0 });

        return res.status(200).json({ id: userClass.id });
    }
    else {
        return res.status(400).json({ message: `No class with id: ${classId} ` });
    }
}