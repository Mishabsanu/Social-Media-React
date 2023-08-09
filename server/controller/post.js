import { Post } from "../models/post.js";
import { User } from "../models/user.js";
import * as utils from "../utils/error.js";

const PostsAdd = async (req, res) => {
  try {
    const id = req.params.id;
    const { content, image } = req.body;

    if (!content) throw utils.createError(400, "Content is required");
    if (!image) throw utils.createError(400, "Image is required");

    const newPost = new Post({
      content: content,
      author: id,
      image: image,
      likes: [],
    });
    const savedPost = await newPost.save();
    const populatedPost = await Post.findById(savedPost._id)
      .populate("author", "userName profilePic")
      .exec();
    res.status(201).json({ populatedPost });
  } catch (error) {
    console.error(error);
    res
      .status(error.code || 500)
      .json({ error: error.message || "Oops, something went wrong" });
  }
};

const EditPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content, image } = req.body;
    const update = await Post.findOneAndUpdate(
      { _id: postId },
      { content: content, image: image },
      { new: true }
    );

    if (!update) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ update, message: "Post edited successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(error.code || 500)
      .json({ error: error.error || "Oops, something went wrong" });
  }
};

const getUserPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "userName profilePic")

      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const DeletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Post.deleteOne({ _id: Object(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const searchPost = async (req, res) => {
  const searchQuery = req.query.query;

  try {
    const posts = await Post.find({
      content: { $regex: searchQuery, $options: "i" },
    }).populate("author", "userName profilePic");

    res.status(200).json({ message: "Success", posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const Postcount = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate the post count for the user
    const postCount = await Post.countDocuments({ author: userId });
    res.json({ postCount });
  } catch (error) {
    console.error("Error fetching user post counts:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
// Like Post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const isLiked = post.likes.includes(req.body.userId);

    if (isLiked) {
      post.likes.pull(req.body.userId);
    } else {
      post.likes.push(req.body.userId);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { likes: post.likes },
      { new: true }
    );
    const populatedPost = await Post.findById(updatedPost._id)
      .populate("author", "userName profilePic")
      .exec();

    res.status(200).json({ message: "like update ", populatedPost });
  } catch (err) {
    console.log("likepost error =>", err);
    res.status(500).json({ message: err.message });
  }
};
// Comment Post
const commentPost = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.postIds);
    post.comments.unshift({
      text: text,
      author: req.params.userId,
      isDelete: false,
    });
    const savedPost = await post.save();

    const populatedPost = await Post.findById(savedPost._id)
      .populate("author", "userName profilePic")
      .populate({
        path: "comments",
        populate: { path: "author", select: "userName profilePic" },
        options: { sort: { createdAt: -1 } },
      })
      .exec();

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const deletComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    post.comments.splice(commentIndex, 1);
    await post.save();
    const updatedPost = await Post.findById(postId);
    res
      .status(200)
      .json({ message: "Comment deleted successfully", updatedPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  PostsAdd,
  DeletePost,
  EditPost,
  getUserPost,
  searchPost,
  likePost,
  Postcount,
  commentPost,
  deletComment,
};
