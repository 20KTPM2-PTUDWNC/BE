import usersService from "../services/users.js";
import userClassModel from "../models/userClass.js";

const showMemberList = async(req, res, next) => {
    const classId = req.params.classId;
    const user = await userClassModel.find({classId: classId});

    if (user) {
        return res.status(200).json(user);
    } 
    else{
        res.status(400).json({message: `No class with id: ${classId} `});
    }
    
}

export {showMemberList};