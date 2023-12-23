import mongoose from 'mongoose';

export const Title = {
    Grade: 'New grade',
    Review: 'New review',
    Final: 'Final grade'
}

export const Description = {
    Grade: (params) => `You just got the score for the assignment ${params}`,
    Review: (params) => `You have a review of the assignment ${params}`,
    Final: (params) => `Your teacher makes the final decision on the ${params} assignment grade`,
}

export const Url = {
    Grade: (params) => `You just got the score for the assignment ${params}`,
    Review: (params) => `You have a review of the assignment ${params}`,
    Final: (params) => `Your teacher makes the final decision on the ${params} assignment grade`,
}

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    receiverId: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    mark: {
        type: Number,
        require: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    deleteAt: {
        type: Date,
        default: null
    }
},
    { timestamps: true });

export default mongoose.model('Notification', notificationSchema, 'notification');
