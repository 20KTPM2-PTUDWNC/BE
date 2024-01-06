import AssignmentReviewModel from "../models/assignmentReview.js";
import UserReviewModel from "../models/userReview.js";
import * as _ from 'lodash';

export default {
    updateAssignmentReview: async (data) => {
        const assignmentReview = await AssignmentReviewModel.findOneAndUpdate({ studentGradeId: data.studentGradeId }, data, { upsert: true, new: true });

        data.userReview = data.userReview.map((d) => ({
            ...d,
            assignmentReviewId: assignmentReview.id
        }))

        if (data.userReview.length > 0) {
            await UserReviewModel.create(data.userReview);
        }
    },
}