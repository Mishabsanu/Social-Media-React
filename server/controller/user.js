import { User } from "../models/user.js";
import * as utils from "../utils/error.js";
import bcrypt from "bcrypt";

const UserSignup = async (req, res) => {
  try {

    let { userName, email, password } = req.body;
    if (!userName) throw utils.createError(400, "user Name is required");
    if (!email) throw utils.createError(400, "email is required");
    if (!password) throw utils.createError(400, "password is required");
    userName = userName.trim().toLowerCase();
    email = email.trim().toLowerCase();
    password = password.trim();
    const NameExists = await User.findOne({
      userName: userName,
    });

    if (NameExists) {
      return res.status(400).json({ message: "user Name already exists" });
    }
    const caseSensitiveExists = await User.findOne({
      userName: {
        $regex: new RegExp("^" + userName + "$", "i"),
      },
    });

    if (caseSensitiveExists) {
      return res.status(400).json({ message: "user Name already exists" });
    }

    const user = await User.findOne({ email: email }).exec();
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);
    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(error.code || 500)
      .json({ error: error.error || "Oops something went wrong" });
  }
};

const UserLogin = async (req, res) => {
  try {

    let { email, password } = req.body;
    if (!email) throw utils.createError(400, "email is required");
    if (!password) throw utils.createError(400, "password is required");
    email = email.trim().toLowerCase();
    password = password.trim();
    const user = await User.findOne({ email: email }).exec();
    if (!user) return res.status(401).send({ message: "User is Not Exist" });

    const ValidPassword = await bcrypt.compare(password, user.password);
    if (!ValidPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const token = user.generateAuthToken();

    res.status(201).json({ user, token, message: "User login successfully" });

  } catch (error) {
    console.log(error);
    res
      .status(error.code || 500)
      .json({ error: error.error || "Oops something went wrong" });
  }
};

const editProfile = async (req, res) => {

  try {
    let userId = req.params.id;
    let { email, userName, profilePic } = req.body;
    if (!userName) throw utils.createError(400, "user Name is required");
    if (!email) throw utils.createError(400, "email is required");
    if (!profilePic) throw utils.createError(400, "profilePic is required");
    email = email.trim().toLowerCase();
    const update = await User.findOneAndUpdate(
      { _id: userId },
      {
        userName: userName,
        profilePic: profilePic,
        email: email,
      },
      { new: true }
    );

    res.status(201).json({ update, message: "User Profile Edit successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(error.code || 500)
      .json({ error: error.error || "Oops something went wrong" });
  }
};
const getAllUser = async (req, res) => {
  try {
    const user = await User.find().select("-password");
    if (!user)
      return res.status(500).json({ message: "didnt got users from database" });

    res.status(200).json({ message: "Success", user });
  } catch (error) {
    console.log(error);
    res
      .status(error.code || 500)
      .json({ error: error.error || "Oops something went wrong" });
  }
};
const getOneUser = async (req, res) => {

  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    res.status(200).json({ message: "Success", user });
  } catch (error) {
    console.log(error);
    res
      .status(error.code || 500)
      .json({ error: error.error || "Oops something went wrong" });
  }
};

const followUser = async (req, res) => {

  

  if (req.body.currentUserId != req.params.id) {
    try {
      const user = await User.findById(req.params.id);

      const currentUser = await User.findById(req.body.currentUserId);
      if (!user.followers.includes(req.body.currentUserId)) {
        await user?.updateOne({
          $push: { followers: req.body.currentUserId },
        });
      
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        const updateUser= await User.findById(req.body.currentUserId)
        res.status(200).json({message:"User has been followed",updateUser});
      } else {
        res.status(403).json("you already follow the user");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {

    res.status(403).json("You cant follow yourself");
  }
}


//Unfollow users
const unfollowUser = async (req, res) => {
  if (req.body.currentUserId != req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.currentUserId);
      if (user.followers.includes(req.body.currentUserId)) {
        await user.updateOne({
          $pull: { followers: req.body.currentUserId },
        });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
          const updateUser= await User.findById(req.body.currentUserId)
        res.status(200).json({message:"User has been unfollowed",updateUser});

      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cant unfollow yourself");
  }
};


// Not followings
const getNotFollowingUsers = async (req, res) => {
  try {
    const currentUserId = req.params.id;
    const currentUser = await User.findById(currentUserId);
    const notFollowingUsers = await User.find({
      _id: { $ne: currentUserId, $nin: currentUser.followings },
    });
    notFollowingUsers.reverse();
  
    res.status(200).json(notFollowingUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Followers
const getFollowers = async (req, res) => {
  try {
    const currentUserId = req.params.id;
    const currentUser = await User.findById(currentUserId);

    const Followers = await User.find({
      _id: { $ne: currentUserId, $in: currentUser.followers },
    });
    Followers.reverse();

    res.status(200).json(Followers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Followings
const getFollowings = async (req, res) => {
  try {
    const currentUserId = req.params.id;
    const currentUser = await User.findById(currentUserId);

    const Followings = await User.find({
      _id: { $ne: currentUserId, $in: currentUser.followings },
    });

    res.status(200).json(Followings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  UserSignup,
  UserLogin,
  editProfile,
  getAllUser,
  getFollowings,
  getFollowers,
  getNotFollowingUsers,
  getOneUser,
  unfollowUser,
  followUser,
};




