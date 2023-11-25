import userClassModel from '../models/userClass.js';
import userService from '../services/users.js';
import userModel from '../models/users.js';

const showMemberList = async(req, res, next) => {
    const classId = req.params.classId;
    const users = await userClassModel.find({classId: classId}).lean();
    let listTeacher = [];
    let listStudent = [];
    let listUser;

    for(let i = 0; i < users.length; i++){
        if (users[i].userRole === 1){
            const teacher = await userService.findUserById({_id: users[i].userId});
            listTeacher = [...listTeacher, teacher];
        }
        else{
            const student = await userService.findUserById({_id: users[i].userId});
            listStudent = [...listStudent, student];
        }
        listUser = {
            teachers: listTeacher,
            students: listStudent
        };
    }
    return res.status(200).json(listUser);
}
export {showMemberList};