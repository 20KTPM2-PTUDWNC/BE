import AssignmentReviewModel from "../models/assignmentReview.js";
import UserReviewModel from "../models/userReview.js";
import * as _ from 'lodash';

export default {
    updateAssignmentReview: async (data) => {
        const assignmentReview = await AssignmentReviewModel.findOneAndUpdate({ studentGradeId: data.studentGradeId }, data, { upsert: true, new: true });

        // blank => insert
        const insertData = _.filter(
            data.userReview, function (d) {
                return !d._id;
            }
        );

        await UserReviewModel.create({...insertData, assignmentReviewId: assignmentReview._id});

        // != blank => update
        let updateData = _.differenceBy(data.userReview, insertData);
        await UserReviewModel.updateMany(updateData);
    },
}