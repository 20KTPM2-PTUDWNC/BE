import classesService from "../services/class.js";
import userClassModel from "../models/userClass.js";
import mongoose from "mongoose";

const createClass = async(req, res, next) => {
    const {name, subject, room} = req.body;
    const authorId = req.user._id;
    const generateCode = Math.random().toString(20).substr(2, 6);

    if (!name || !subject) {
        return res.status(400).json({message: 'Invalid Class'});
    }

    const newClass = {...req.body, authorId: authorId, code: generateCode};
    const createdClass = await classesService.save(newClass);

    const teacher = {userId: authorId, classId: createdClass._id, userRole: 1};
    await userClassModel.create(teacher);

    res.status(200).json({message: "Create new class successfully"});

}

const getAllClass = async(req, res, next) => {
    const classes = await classesService.findAllClasses();

    if (classes){
        return res.status(200).json(classes);
    }
    else{
        res.status(400).json({message: "No class"});
    }
}

const getAllClassById = async(req, res, next) => {
    const userId = req.user._id;

    const listClass = await userClassModel.find({userId: userId});
    let listClassInfor = [];

    if (userId){
        for(let i = 0; i < listClass.length; i++){
            const _class = await classesService.findClassById({_id: listClass[i].classId});
            listClassInfor = [...listClassInfor, _class];
        }    
        return res.status(200).json(listClassInfor);
    }
    else{
        res.status(400).json({message: "No user"});
    }
}

const showClassDetail = async(req, res, next) => {
    const classId = req.params.id;
    const _class = await classesService.findClassById(classId);

    if (_class){
        return res.status(200).json(_class);
    }
    else{
        res.status(400).json({message: `No class with id: ${classId} `});
    }
}

export {createClass, getAllClass, showClassDetail, getAllClassById};