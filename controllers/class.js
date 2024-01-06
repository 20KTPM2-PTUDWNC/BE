import classesService from "../services/class.js";
import userClassService from "../services/userClass.js";
import usersService from "../services/users.js";
import userClassModel from "../models/userClass.js";
import jwt from "jsonwebtoken";
import { transporter } from "../config/email.js";
import ClassModel from "../models/class.js";
import Papa from "papaparse";
import fs from "fs";
import studentClassService from "../services/studentClass.js";
import StudentGradeModel from "../models/studentGrade.js";
import _ from "lodash";

export const createClass = async (req, res, next) => {
    const { name, subject } = req.body;
    const authorId = req.user._id;
    const generateCode = Math.random().toString(20).substr(2, 6);

    if (!name || !subject) {
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

export const getAllClassById = async (req, res, next) => {
    const userId = req.user._id;

    const listClass = await userClassModel.find({ userId: userId });
    let listClassInfor = [];

    if (userId) {
        for (let i = 0; i < listClass.length; i++) {
            const _class = await classesService.findClassById({ _id: listClass[i].classId });
            listClassInfor = [...listClassInfor, _class];
        }
        return res.status(200).json(listClassInfor);
    }
    else {
        res.status(400).json({ message: "No user" });
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

        const invitation = {
            classId,
            email,
            role
        }

        const accessToken = jwt.sign(JSON.stringify(invitation), process.env.SECRET_KEY);

        let link = `${process.env.FRONTEND_DOMAIN}/#/signup/${accessToken}`;

        if (user) {
            const check = await userClassService.checkStudentInClass(classId, user.id);
            if (check) {
                return res.status(422).json({ message: `User was in class ${classId}` })
            }

            link = `${process.env.FRONTEND_DOMAIN}/#/class/${classId}`;

            await userClassService.save({ userId: user.id, classId: _class.id, userRole: role });

            if (role == 0) {
                // studentClass
                const studentClass = {
                    classId,
                    studentId: user.studentId,
                    userId: user.id,
                    name: user.name
                }
                await studentClassService.updateStudentClass(studentClass);
            }
        }

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

    if (_class && _class.status == 0) {

        const user = await usersService.findUserById(userId);

        if (user) {
            const check = await userClassService.checkStudentInClass(_class.id, userId);
            if (check) {
                return res.status(422).json({ message: `User was in class ${_class.id}` })
            }

            const data = {
                classId: tokenEncrypt.classId,
                userRole: tokenEncrypt.role,
                userId
            }

            const userClass = await userClassService.save(data);

            // studentClass
            if (tokenEncrypt.role == 0) {
                const studentClass = {
                    classId: tokenEncrypt.classId,
                    studentId: user.studentId,
                    userId,
                    name: user.name
                }
                await studentClassService.updateStudentClass(studentClass);
            }

            return res.status(200).json({ id: userClass.id });
        } else {
            return res.status(400).json({ message: `No user with id: ${userId} ` });
        }
    }
    else {
        return res.status(400).json({ message: `No class with id: ${tokenEncrypt.classId} ` });
    }
}

export const joinClass = async (req, res, next) => {
    const { code, userId } = req.body;

    if (!code | !userId) {
        return res.status(400).json({ message: `Invalid field` });
    }

    const _class = await classesService.findClassByCode(code);

    if (_class && _class.status == 0) {

        const user = await usersService.findUserById(userId);

        if (user) {
            const check = await userClassService.checkStudentInClass(_class.id, userId);
            if (check) {
                return res.status(422).json({ message: `User was in class ${_class.id}` })
            }

            const userClass = await userClassService.save({ userId, classId: _class.id, role: 0 });

            // studentClass
            const studentClass = {
                classId: _class.id,
                studentId: user.studentId,
                userId,
                name: user.name
            }
            await studentClassService.updateStudentClass(studentClass);

            return res.status(200).json({ id: userClass.id });
        } else {
            return res.status(400).json({ message: `No user with id: ${userId} ` });
        }
    }
    else {
        return res.status(400).json({ message: `No class with code: ${code} ` });
    }
}

export const activeClass = async (req, res, next) => {
    const classId = req.params.classId;
    const status = req.body.status;

    const _class = await classesService.findClassById(classId);

    if (_class) {
        await ClassModel.findByIdAndUpdate({ _id: classId }, { status },
            {
                new: true,
                runValidators: true
            });
        return res.status(200).json({ message: 'Successfully' });
    }
    else {
        res.status(400).json({ message: `No class with id: ${classId} ` });
    }
}

export const uploadStudentList = async (req, res) => {
    const classId = req.params.classId;
    const _class = await classesService.findClassById(classId);

    if (_class) {
        const filePath = req.file.path;

        if (!fs.existsSync(filePath)) {
            return res.status(400).json({ error: "File not found" });
        }

        const readStream = fs.createReadStream(filePath);
        readStream.on('error', (err) => {
            return res.status(500).json({ error: "Error reading the file" });
        });

        let parsedData = [];

        Papa.parse(readStream, {
            header: true,
            step: async function (result) {
                parsedData.push(result.data);

                const studentId = result.data.studentId;
                const name = result.data.name;

                const existingStudent = await studentClassService.findByStudentIdAndClassId(studentId, classId)
                if (!existingStudent) {
                    const studentData = {
                        studentId: studentId,
                        name: name,
                        classId: classId, // Associate the student with the class
                    };
                    await studentClassService.save(studentData);
                }

                const checkUserExist = await usersService.findUserByStudentId(studentId);
                console.log(checkUserExist);
                if (checkUserExist){
                    const checkUserClassExist = await userClassService.checkStudentInClass(classId, checkUserExist._id);
                    if (!checkUserClassExist){
                        const data = { userId: checkUserExist._id, classId: classId, userRole: 1 };
                        await userClassService.save(data);
                    }
                }
            },
            complete: function () {
                return res.status(200).json({ message: 'Uploading student list successfully' });
            },
            error: function (error) {
                return res.status(400).json({ error: "CSV parsing error has occurred" });
            }
        });
    } else {
        res.status(400).json({ message: `No class with id: ${classId} ` });
    }
};

export const showStudentList = async (req, res, next) => {
    const classId = req.params.classId;
    const _class = await studentClassService.findAllStudentInClass(classId);

    if (_class) {
        return res.status(200).json(_class);
    }
    else {
        res.status(400).json({ message: `No class with id: ${classId} ` });
    }
}

export const studentNoGrade = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        const assignmentId = req.params.assignmentId;

        const _class = await classesService.findClassById(classId);

        if (!_class) {
            return res.status(400).json({ message: `No class with id: ${classId}` });
        }

        const studentListInClass = await userClassModel.find({ classId, userRole: 0 });

        const gradesForAssignment = await StudentGradeModel.find({ assignmentId: assignmentId });

        const gradedStudentIds = gradesForAssignment.map(student => student.userId.toString());
        
        const studentsWithoutGrade = studentListInClass.filter(student => !gradedStudentIds.includes(student.userId.toString()));

        const studentsWithStudentId = await Promise.all(studentsWithoutGrade.map(async student => {
            const _student = await usersService.findUserById(student.userId);
            return { ...student.toObject(), studentId: _student.studentId };
        }));
        
        res.status(200).json({
            studentListInClass: studentListInClass,
            gradedStudentIds: gradedStudentIds,
            studentsWithoutGrade: studentsWithStudentId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


