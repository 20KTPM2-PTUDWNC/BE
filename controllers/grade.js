import classesService from "../services/class.js";
import gradeService from "../services/grade.js";
import studentClassService from "../services/studentClass.js";
import studentGradeService from "../services/studentGrade.js";
import GradeModel from "../models/grade.js";
import AssignmentModel from "../models/assignment.js";
import StudentGradeModel from "../models/studentGrade.js";
import NotificationModel, { Description, Title } from "../models/notification.js";
import UsersModel from "../models/users.js";
import UserClassModel, {UserRole} from "../models/userClass.js";

export const addGradeComposition = async (req, res, next) => {
    const classId = req.params.classId;
    const { name, gradeScale } = req.body;

    if (!name || !gradeScale) {
        return res.status(400).json({ message: 'Invalid Grade Structure' });
    }

    try {
        const _class = await classesService.findClassById(classId);

        if (!_class) {
            return res.status(400).json({ message: `No class with id: ${classId}` });
        }

        const listGrade = await GradeModel.find({ classId: classId });
        const countGrade = listGrade.length;

        // Kiểm tra tổng gradeScale
        const totalGradeScale = listGrade.reduce((total, grade) => total + grade.gradeScale, 0);
        const proposedTotal = totalGradeScale + gradeScale;

        if (proposedTotal > 100) {
            return res.status(400).json({ message: 'Total gradeScale exceeds 100%' });
        }

        const position = countGrade + 1;

        // Create the new grade structure object
        const newGradeComposition = {
            name: name,
            gradeScale: gradeScale,
            classId: classId,
            sort: position
        };

        // Save the updated class in the database
        await gradeService.save(newGradeComposition);

        // Notification
        let notification = {
            title: Title.NewGradeStructure,
            description: Description.NewGradeStructure(name)
        };

        // Find students and teachers in the class
        let classMembers = await UserClassModel.find({ classId: classId });

        // Exclude the user who created the GradeStructure (assuming it's a teacher)
        const creatorId = req.user._id; // Adjust this based on your authentication setup
        classMembers = classMembers.filter(member => member.userId.toString() !== creatorId);

        // Separate notifications for students and teachers
        const studentNotifications = classMembers
            .filter(member => member.userRole === UserRole.Student)
            .map(student => ({
                ...notification,
                receiverId: student._doc.userId,
                url: `class/${classId}`
            }));

        const teacherNotifications = classMembers
            .filter(member => member.userRole === UserRole.Teacher)
            .map(teacher => ({
                ...notification,
                receiverId: teacher._doc.userId,
                url: `class/${classId}`
            }));

        await NotificationModel.insertMany([...studentNotifications, ...teacherNotifications]);

        return res.status(200).json(studentNotifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const showGradeStructure = async (req, res, next) => {
    const classId = req.params.classId;
    const gradeComposition = await GradeModel.find({ classId: classId });

    if (gradeComposition) {
        return res.status(200).json(gradeComposition);
    }
    else {
        res.status(400).json({ message: `No class with id: ${classId}` });
    }
}

export const updateGradeComposition = async (req, res, next) => {
    const classId = req.params.classId;
    const gradeCompositionId = req.params.gradeCompositionId;
    const { name, gradeScale } = req.body;

    if (!name || !gradeScale) {
        return res.status(400).json({ message: 'Invalid Grade Structure' });
    }

    const gradeComposition = await GradeModel.findOne({ _id: gradeCompositionId, classId: classId });

    if (gradeComposition) {
        // Find the grade composition to update
        const updateGradeComposition = await GradeModel.findByIdAndUpdate({ _id: gradeCompositionId, classId: classId }, { name: name, gradeScale: gradeScale });
        return res.status(200).json(updateGradeComposition);
    }
    else {
        return res.status(400).json({ message: `No grade composition with id: ${gradeCompositionId}` });
    }
}

export const deleteGradeComposition = async (req, res, next) => {
    const classId = req.params.classId;
    const gradeCompositionId = req.params.gradeCompositionId;

    const gradeComposition = await GradeModel.findOne({ _id: gradeCompositionId, classId: classId });

    if (gradeComposition) {
        await GradeModel.findByIdAndDelete({ _id: gradeCompositionId, classId: classId });
        return res.status(200).json({ message: `Delete grade composition with id: ${gradeCompositionId} successfully` });
    }
    else {
        return res.status(400).json({ message: `No grade composition with id: ${gradeCompositionId}` });
    }
}

export const arrangeGradeComposition = async (req, res, next) => {
    const classId = req.params.classId;
    const gradeCompositionId = req.params.gradeCompositionId;
    const newPosition = req.params.position;

    const gradeComposition = await GradeModel.findOne({ _id: gradeCompositionId, classId: classId });
    const _class = await GradeModel.find({ classId: classId });

    if (gradeComposition) {
        const oldPosition = gradeComposition.sort;

        // Update the target grade composition's position
        await GradeModel.findByIdAndUpdate(
            { _id: gradeCompositionId, classId: classId },
            { sort: newPosition }
        );

        // Adjust positions of other grade compositions
        for (let i = 0; i < _class.length; i++) {
            if (_class[i]._id.toString() !== gradeCompositionId) {
                if (_class[i].sort > oldPosition && _class[i].sort <= newPosition) {
                    await GradeModel.findByIdAndUpdate(
                        { _id: _class[i]._id, classId: classId },
                        { sort: _class[i].sort - 1 }
                    );
                } else if (_class[i].sort < oldPosition && _class[i].sort >= newPosition) {
                    await GradeModel.findByIdAndUpdate(
                        { _id: _class[i]._id, classId: classId },
                        { sort: _class[i].sort + 1 }
                    );
                }
            }
        }

        return res.status(200).json({ message: 'Grade structure updated successfully' });
    } else {
        return res.status(400).json({ message: `No grade composition with id: ${gradeCompositionId}` });
    }
}

export const exportStudentList = async (req, res, next) => {
    const classId = req.params.classId;

    const students = await studentClassService.findAllStudentInClass(classId);

    if (students) {
        return res.status(200).json(students);
    } else {
        res.status(400).json({ message: `No list students with id: ${classId}` });
    }
}

export const exportGradeList = async (req, res, next) => {
    const assignmentId = req.params.assignmentId;

    const grades = await studentGradeService.findGradeAnAssignment(assignmentId);

    if (grades) {
        return res.status(200).json(grades);
    } else {
        res.status(400).json({ message: `No assignment with id: ${assignmentId}` });
    }
}

export const studentGrade = async (req, res, next) => {
    const { assignmentId, userId, grade, mark } = req.body;

    if (!assignmentId || !userId || !grade) {
        res.status(400).json({ message: 'Invalid fields' });
    }

    const user = await UsersModel.findById(userId);

    const assignment = await AssignmentModel.findById(assignmentId).populate({ path: 'gradeStructureId', select: 'classId' });

    if (user && assignment) {
        const studentGrade = await studentGradeService.updateStudentGrade({ assignmentId, userId: userId, studentId: user.studentId, grade, mark });

        // notification
        const notification = {
            title: Title.Grade,
            description: Description.Grade(assignment.name),
            url: `class/${assignment._doc.gradeStructureId._doc.classId}/${assignmentId}`,
            receiverId: userId
        }

        await NotificationModel.create(notification);

        return res.status(200).json(studentGrade);
    } else {
        const message = user ? `No user with id: ${userId} ` : `No assignment with id: ${assignmentId} `;
        return res.status(400).json({ message });
    }
}

export const getStudentGrade = async (req, res, next) => {
    const assignmentId = req.params.assignmentId;
    const userId = req.params.userId;

    if (!assignmentId) {
        res.status(400).json({ message: 'Invalid fields' });
    }

    const assignment = await AssignmentModel.findById(assignmentId);

    if (assignment) {
        const studentGrade = await studentGradeService.findStudentGrade(assignmentId, userId);
        return res.status(200).json(studentGrade);
    }
    res.status(400).json({ message: `No assignment with id: ${assignmentId}` });
}

export const exportGradeBoard = async (req, res, next) => {
    const classId = req.params.classId;

    try {
        // Lấy thông tin về Grade Structure từ cơ sở dữ liệu
        const _class = await classesService.findClassById(classId);

        if (!_class) {
            return res.status(400).json({ message: `No class with id: ${classId}` });
        }

        // Lấy danh sách Grade Compositions cho Grade Structure
        const gradeCompositions = await GradeModel.find({ classId: classId });

        // Tạo một Grade Board object
        const gradeBoard = {
            gradeCompositions: [],
        };

        // Duyệt qua danh sách Grade Compositions và lấy thông tin Assignment
        for (const composition of gradeCompositions) {
            const assignments = await AssignmentModel.find({ gradeStructureId: composition._id });

            const gradeComposition = {
                id: composition._id,
                name: composition.name,
                gradeScale: composition.gradeScale,
                assignments: assignments.map(assignment => ({
                    id: assignment._id,
                    name: assignment.name,
                    scale: assignment.scale,
                })),
            };

            gradeBoard.gradeCompositions.push(gradeComposition);
        }

        // Trả về Grade Board
        res.status(200).json({ gradeBoard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const showGradeById = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const studentGrades = await StudentGradeModel.find({ userId: userId });

        if (!studentGrades || studentGrades.length === 0) {
            return res.status(400).json({ message: `No student with id: ${userId}` });
        }

        const assignmentsInfo = await Promise.all(
            studentGrades.map(async (grade) => {
                const assignment = await AssignmentModel.findById(grade.assignmentId);
                if (assignment && grade.mark === 1) {
                    const gradeComposition = await GradeModel.findById({ _id: assignment.gradeStructureId });
                    if (gradeComposition) {
                        return {
                            gradeCompositionName: gradeComposition.name,
                            assignmentName: assignment.name,
                            grade: grade.grade
                        };
                    }
                }
                return null;
            })
        );

        return res.status(200).json(assignmentsInfo.filter(assignment => assignment !== null));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const showStudentGradeByTeacher = async (req, res, next) => {
    try {
        const classId = req.params.classId;

        // Lấy danh sách sinh viên trong lớp, bao gồm cả tên và mã số sinh viên của học sinh
        const studentsInClass = await UserClassModel.find({ classId, userRole: 0 })
            .populate('userId', '_id name studentId'); // Thêm studentId để lấy thông tin mã số sinh viên (nếu có)

        const userIdList = studentsInClass.map((userClass) => userClass.userId);

        // Lấy điểm số của sinh viên trong các bài tập
        const studentGrades = await StudentGradeModel.find({ userId: { $in: userIdList } })
            .populate('userId', '_id name studentId') // Điều chỉnh trường để phù hợp với User model
            .populate('assignmentId', 'name grade scale') // Điều chỉnh các trường để phù hợp với Assigment model
            .select('studentId userId assignmentId grade');

        // Tổ chức dữ liệu theo cấu trúc mới
        const studentInfoList = [];

        // Lặp qua danh sách sinh viên
        for (const student of studentsInClass) {
            const studentInfo = {
                userId: {
                    _id: student.userId._id,
                    name: student.userId.name,
                    studentId: student.userId.studentId || null, // Kiểm tra và hiển thị mã số sinh viên (nếu có)
                },
                assignments: [],
                total: 0, // Tổng điểm của sinh viên
            };

            // Lặp qua danh sách điểm số để lấy thông tin về bài tập và điểm số của sinh viên
            for (const studentGrade of studentGrades) {
                if (studentGrade.userId._id.toString() === student.userId._id.toString()) {
                    const assignmentScale = studentGrade.assignmentId.scale || 1; // Lấy scale của assignment (nếu có, mặc định là 1)
                    const weightedGrade = studentGrade.grade * ( assignmentScale / 100 ); // Tính điểm nhân với scale
                    studentInfo.assignments.push({
                        name: studentGrade.assignmentId.name,
                        grade: weightedGrade,
                        scale: assignmentScale,
                    });
                    studentInfo.total += weightedGrade; // Cộng điểm vào tổng
                }
            }

            studentInfoList.push(studentInfo);
        }

        // Trả về dữ liệu theo cấu trúc mới
        return res.status(200).json(studentInfoList);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};





