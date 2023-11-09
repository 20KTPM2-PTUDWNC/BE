import usersService from "../services/users.js";
import User from "../models/users.js";

const getUserProfile = async (req, res, next) => { 
  const userId = req.params.id;
  const user = await usersService.findUserById(userId);

    if (user) {
      return res.status(200).json(user);
    }
    else{
        return res.status(400).json({message: `No user with id: ${userId} `});
    }
};

export {getUserProfile};
