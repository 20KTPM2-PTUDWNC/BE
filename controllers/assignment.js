import AssignmentReviewModel from "../models/assignmentReview.js";
import gradeService from "../services/grade.js";
import AssignmentModel from "../models/assignment.js";
import assignmentReviewService from "../services/assignmentReview.js";
import studentGradeService from "../services/studentGrade.js";
import Papa from "papaparse";
import fs from "fs";
import StudentGradeModel from "../models/studentGrade.js";
import userService from "../services/users.js";
import GradeStructureModel from "../models/grade.js";
import { Description, Title } from "../models/notification.js";
import NotificationModel from "../models/notification.js";
import UserClassModel, { UserRole } from "../models/userClass.js";

export const addAssignment = async (req, res, next) => {
  const gradeStructureId = req.params.gradeStructureId;
  const { name, scale, content } = req.body;

  if (!name || !scale || !content) {
    return res.status(400).json({ message: 'Invalid Grade Structure' });
  }

  const gradeStructure = await gradeService.findGradeById(gradeStructureId);

  if (gradeStructure) {
    // Calculate the total scale of existing assignments
    const existingAssignments = await AssignmentModel.find({ gradeStructureId: gradeStructureId });
    const totalExistingScale = existingAssignments.reduce((total, assignment) => total + assignment.scale, 0);

    // Check if adding the new assignment would exceed the gradeScale limit
    if (totalExistingScale + scale > gradeStructure.gradeScale) {
      return res.status(400).json({ message: 'Total scale exceeds gradeScale limit' });
    }

    // Create the new assignment object
    const newAssignment = {
      name: name,
      scale: scale,
      content: content,
      gradeStructureId: gradeStructureId
    };

    // Save the updated class in the database
    await AssignmentModel.create(newAssignment);

    return res.status(200).json({ message: "Assignment added successfully" });
  } else {
    res.status(400).json({ message: `No grade structure with id: ${gradeStructure}` });
  }
};


export const showAssignmentList = async (req, res, next) => {
  const gradeStructureId = req.params.gradeStructureId;
  const assignmentList = await AssignmentModel.find({ gradeStructureId: gradeStructureId });

  if (assignmentList) {
    return res.status(200).json(assignmentList);
  }
  else {
    res.status(400).json({ message: `No grade composition with id: ${gradeStructureId}` });
  }
}

export const reviewAssignment = async (req, res, next) => {
  const studentGradeId = req.params.studentGradeId;
  const { expectedGrade, userReview } = req.body;

  if (studentGradeId) {
    await assignmentReviewService.updateAssignmentReview({ expectedGrade, userReview, studentGradeId });

    const assignment = await StudentGradeModel.findOne({ _id: studentGradeId })
      .populate([
        { path: 'userId', select: 'id studentId' },
        {
          path: 'assignmentId', select: 'id name',
          populate: [
            { path: 'gradeStructureId', select: 'classId' }
          ]
        }
      ]);

    const userClass = await UserClassModel.findOne({ userId: userReview[0].userId, classId: assignment._doc.assignmentId._doc.gradeStructureId._doc.classId });

    // notification
    let notification = {
      title: Title.Review,
      description: Description.Review(assignment._doc.assignmentId._doc.name),
      url: `class/${assignment._doc.assignmentId._doc.gradeStructureId._doc.classId}/${assignment._doc.assignmentId._doc._id}`
    }

    // student => teacher
    if (userClass.userRole === UserRole.Student) {
      // find teacher
      let teachers = await UserClassModel.find({ userRole: UserRole.Teacher, classId: assignment._doc.assignmentId._doc.gradeStructureId._doc.classId });

      teachers = teachers.map((d) => ({
        ...notification,
        receiverId: d._doc._id
      }));

      await NotificationModel.insertMany(teachers);
    } else {
      notification = {
        ...notification,
        receiverId: assignment._doc.userId._doc._id
      }

      await NotificationModel.create(notification);
    }

    return res.status(200).json({ message: 'Successfully' });
  }

}

export const uploadGradeList = async (req, res) => {
  const assignmentId = req.params.assignmentId;
  const assignment = await AssignmentModel.findById({ _id: assignmentId });

  if (assignment) {
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
        const grade = result.data.grade;
        const email = result.data.email;

        const checkUser = await userService.findUserByEmail(email);

        if (!checkUser) {
          res.status(400).json({ message: `No student with email: ${email} ` });
        }

        const gradeData = {
          studentId: studentId,
          grade: grade,
          assignmentId: assignmentId,
          userId: checkUser._id
        };

        await studentGradeService.save(gradeData);

      },
      complete: function () {
        return res.status(200).json({ message: 'Uploading grade list successfully' });
      },
      error: function (error) {
        return res.status(400).json({ error: "CSV parsing error has occurred" });
      }
    });
  } else {
    res.status(400).json({ message: `No assignment with id: ${assignmentId} ` });
  }
};

export const markFinalDecision = async (req, res, next) => {
  const assignmentReviewId = req.params.assignmentReviewId;
  const { expectedGrade } = req.body;

  if (assignmentReviewId && expectedGrade) {
    const assignmentReview = await AssignmentReviewModel.findById(assignmentReviewId);

    await AssignmentReviewModel.findByIdAndUpdate({ _id: assignmentReviewId }, { expectedGrade, finalDecision: 1 });

    await StudentGradeModel.findByIdAndUpdate({ _id: assignmentReview.studentGradeId }, { grade: expectedGrade });

    const assignment = await StudentGradeModel.findOne({ _id: assignmentReview.studentGradeId })
      .populate([
        { path: 'userId', select: 'id studentId' },
        {
          path: 'assignmentId', select: 'id name',
          populate: [
            { path: 'gradeStructureId', select: 'classId' }
          ]
        }
      ]);

    // notification
    const notification = {
      title: Title.Final,
      description: Description.Final(assignment._doc.assignmentId._doc.name),
      url: `class/${assignment._doc.assignmentId._doc.gradeStructureId._doc.classId}/${assignment._doc.assignmentId._doc._id}`,
      receiverId: assignment._doc.userId._doc._id
    }

    await NotificationModel.create(notification);

    return res.status(200).json({ message: 'Successfully' });
  } else {
    return res.status(400).json({ message: 'Invalid fields' });
  }

}

export const assignmentReviews = async (req, res, next) => {
  const classId = req.params.classId;

  if (classId) {

    // find assignment
    GradeStructureModel.find({ classId }, '_id')
      .then((gradeStructureIds) => {
        const ids = gradeStructureIds.map((gradeStructure) => gradeStructure._id);

        return AssignmentModel.find({ gradeStructureId: { $in: ids } }, '_id');
      }).then((assignmentIds) => {
        const ids = assignmentIds.map((assignment) => assignment._id);

        return StudentGradeModel.find({ assignmentId: { $in: ids } }, '_id');
      })
      .then((studentGradeIds) => {
        const ids = studentGradeIds.map((sg) => sg._id);

        return AssignmentReviewModel.find({ studentGradeId: { $in: ids } }, { _id: 1, expectedGrade: 1, finalDecision: 1 })
          .populate({
            path: 'studentGradeId',
            select: 'id grade userId assignmentId',
            populate: [
              { path: 'userId', select: 'id name studentId' },
              { path: 'assignmentId', select: 'id name scale' }
            ]
          });
      })
      .then((assignmentReviews) => {
        return res.status(200).json(assignmentReviews);
      })
      .catch((err) => {
        return res.status(400).json({ message: 'Fail' });
      });

  } else {
    return res.status(400).json({ message: 'Invalid fields' });
  }

}