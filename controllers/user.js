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

const updateUserProfile = async (req, res, next) => {
    const userId = req.params.id;
    const user = await usersService.findUserById(userId);
    const { email, password, userFlag } = req.body;

    if (email || password || userFlag){
        return res.status(400).json({message: 'Can not update email or password or userFlag of user'});
    }

    if (!user){
        return res.status(400).json({message: `No user with id: ${userId} `});
    }

    const userUpdate = await User.findByIdAndUpdate({_id: user._id}, req.body,
        {
        new: true, 
        runValidators: true
        });

    res.status(200).json(userUpdate);
}
  

export {getUserProfile,updateUserProfile};
