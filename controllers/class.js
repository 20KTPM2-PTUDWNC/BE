import classesService from "../services/class.js";
import usersService from "../services/users.js";
import gradeService from "../services/grade.js";

const createClass = async(req, res, next) => {
    const {name, subject, room} = req.body;
    const authorId = req.user._id;
    const generateCode = Math.random().toString(20).substr(2, 6);

    if (!name || !subject || !room) {
        return res.status(400).json({message: 'Invalid Class'});
    }

    const newClass = {...req.body, authorId: authorId, code: generateCode};

    await classesService.save(newClass);

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

const showMemberList = async(req, res, next) => {
    const classId = req.params.id;
    const _class = await classesService.findClassById(classId);

    if (_class) {
        // Fetch the teacher details from the users service
        const teacher = await usersService.findUserById(_class.authorId);
        
        // Fetch the student details from the users service
        const students = await Promise.all(_class.studentList.map(studentId =>
            usersService.findUserById(studentId)
        ));

        const memberList = {
            teacher: teacher,
            students: students
        };

        return res.status(200).json(memberList);
    } else {
        res.status(400).json({ message: `No class with id: ${classId}` });
    }
}

const addGradeComposition  = async (req, res, next) => {
    const classId = req.params.id;
    const { name, gradeScale } = req.body;
  
    if (!name || !gradeScale) {
      return res.status(400).json({ message: 'Invalid Grade Structure' });
    }
  
    const _class = await classesService.findClassById(classId);
  
    if (_class) {
      // Create the new grade structure object
      const newGradeComposition = {
        name: name,
        gradeScale: gradeScale
      };
  
      // Add the new grade structure to the class
      _class.gradeStructures.push(newGradeComposition);
      
      // Save the updated class in the database
      await _class.save();
  
      return res.status(200).json({ message: "Grade structure added successfully" });
    } else {
      res.status(400).json({ message: `No class with id: ${classId}` });
    }
}

const showGradeStructure = async(req, res, next) =>{
    const classId = req.params.id;
    const _class = await classesService.findClassById(classId);

    if (_class){

        return res.status(200).json(_class.gradeStructures);
    }
    else {
        res.status(400).json({ message: `No class with id: ${classId}` });
      }
}

export {createClass, getAllClass, showClassDetail, showMemberList, addGradeComposition, showGradeStructure};