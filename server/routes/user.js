import express from "express";

import {
  UserLogin,
  UserSignup,
  editProfile,
  getAllUser,
  getNotFollowingUsers,
  getFollowers,
  getFollowings,
  getOneUser,
  followUser,
  unfollowUser,
} from "../controller/user.js";
import {
  PostsAdd,
  getUserPost,
  EditPost,
  DeletePost,
  searchPost,
  likePost,
  Postcount,
  commentPost,
  deletComment,
} from "../controller/post.js";


const router = express.Router();

router.post("/signup", UserSignup);
router.post("/login", UserLogin);
router.post("/editProfile/:id", editProfile);

router.post("/PostsAdd/:id", PostsAdd);
router.get("/getPost", getUserPost);
router.get("/getAllUser", getAllUser);
router.get("/getOneUser/:id", getOneUser);
router.post("/editPost/:id", EditPost);
router.delete("/deletePost/:id", DeletePost);
router.get("/searchPost", searchPost);
router.patch("/postsLike/:id", likePost);


router.get("/getNotFollowingUsers/:id", getNotFollowingUsers);
router.get("/getFollowers/:id", getFollowers);
router.get("/getFollowings/:id", getFollowings);

router.put("/follow/:id", followUser);
router.put("/unfollow/:id", unfollowUser);

router.get("/Postcount/:id",Postcount);

router.patch("/commentPost/:postIds/:userId",commentPost);
router.delete("/deleteComment/:postId/:commentId",deletComment);


export default router;
