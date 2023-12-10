import AssignmentReviewModel from "../models/assignmentReview.js";
import UserReviewModel from "../models/userReview.js";

export default {
    updateAssignmentReview: async (data) => {
        const assignmentReview = await AssignmentReviewModel.findOneAndUpdate({studentGradeId: data.studentGradeId}, data, { upsert: true, new: true });

        // blank => insert

        // != blank => update
        const userReview = await UserReviewModel.findOneAndUpdate
    },
}