import "./feed.css";

import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../Redux/userSlice/userSlice";
import Swal from "sweetalert2";
import moment from "moment";

export default function Feed() {
  const navigate = useNavigate();
  const curntUser = useSelector((state) => state.user);
  const [posts, setPost] = useState([]);
  const [error, setError] = useState("");
  const [postIds, setPostId] = useState(null);
  const dispatch = useDispatch();
  const userId = curntUser?.user?._id;
  const [showComments, setShowComments] = useState(false);
  const [Comment, setComment] = useState("");
  useEffect(() => {
    getAllPost();
  }, []);

  const getAllPost = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2000/api/user/getPost"
      );
      setPost(response.data);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const handleDelete = (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Post!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:2000/api/user/deletePost/${postId}`)
          .then((response) => {
            setPost(response.data);
            dispatch(setPosts({ posts: response.data.posts }));
            navigate("/");
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          })
          .catch((error) => {
            if (error.response) {
              setError(error.response.data.message);
            } else {
              setError("Network error. Please try again later.");
            }
          });
      }
    });
  };

  const patchLike = async (postId) => {
    const response = await axios.patch(
      `http://localhost:2000/api/user/postsLike/${postId}`,
      {
        userId,
      }
    );
    setPost(response.data.updatePosts)
    dispatch(setPosts({ posts: response.data.updatePosts}));
  };

  const handleLike = (postId) => {
    // location.reload(); /// while updation problem
    patchLike(postId);
  };

  const toggleComments = (postId) => {
    setShowComments(!showComments);
    setComment("");
    setPostId(postId);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      text: Comment,
    };

    try {
      const response = await axios.patch(
        `http://localhost:2000/api/user/commentPost/${postIds}/${userId}`,
        data
      );
      dispatch(setPosts({ posts: response.data.populatedPost }));
    } catch (error) {
      setError("Failed to create post.");
    }
  };

  const handleDeleteComment = (postId, commentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this comment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `http://localhost:2000/api/user/deleteComment/${postId}/${commentId}`
          )
          .then((response) => {
            setPost(response.data.UpdatePosts);
            dispatch(setPosts({ posts: response.data.UpdatePosts}));

            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          })
          .catch((error) => {
            if (error.response) {
              setError(error.response.data.message);
            } else {
              setError("Network error. Please try again later.");
            }
          });
      }
    });
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
      {posts && posts?.map((post) => (
          <div key={post?._id} className="post">
            <div className="postWrapper">
              <div className="postTop">
                <div className="postTopLeft">
                  <Link to={`/profile/${post.author._id}`}>
                    <img
                      className="postProfileImg"
                      src={
                        post?.author?.profilePic
                          ? post?.author?.profilePic
                          : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                      }
                      alt=""
                    />
                  </Link>
                  <span className="postUsername">{post?.author?.userName}</span>
                  <span className="postDate">{format(post.createdAt)}</span>
                </div>
                <div className="postTopRight">
                  <Link to={`/editPost/${post?._id}`}>
                    {post?.author?._id === userId && (
                      <button className="editButton">Edit</button>
                    )}
                  </Link>
                  {post?.author?._id === userId && (
                    <button
                      className="editButton"
                      onClick={() => handleDelete(post?._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <div className="postCenter">
                <span className="postText">{post?.content}</span>
                <img className="postImg" src={post?.image} alt="" />
              </div>
              <div className="postBottom">
                <div className="item">
                  <button
                    className="like-button"
                    onClick={() =>
                      handleLike(post?._id, post?.likes.includes(userId))
                    }
                  >
                    {post?.likes?.includes(userId) ? "Unlike" : "Like"}
                  </button>
                  {post?.likes?.length === 1
                    ? " 1 Like"
                    : ` ${post?.likes?.length} Likes`}
                </div>
                <button
                  className="comment-button"
                  onClick={() => toggleComments(post._id)}
                >
                  {showComments ? "Hide Comments" : "Show Comments"}
                </button>
                {showComments && (
                  <div className="comments">
                    <div className="new-comment">
                      <form onSubmit={handleSubmit}>
                        <input
                          type="text"
                          required
                          placeholder="Add a comment..."
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <button className="add-comment-button" type="submit">
                          Add Comment
                        </button>
                      </form>
                    </div>
                    {post?.comments?.map((comment, index) => (
                      <div key={index} className="comment-container">
                        <img
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                          }}
                          src={post?.author?.profilePic}
                          alt="User"
                          className="user-image"
                        />
                        <div className="comment-content">
                          <span className="comment-author">
                            {post?.author?.userName}
                          </span>
                          <span className="comment-text">{comment?.text}</span>
                          <span className="comment-text">
                            {moment(comment.createdAt).fromNow()}
                          </span>
                        </div>
                        {comment.author === userId && (
                          <button
                            className="delete-comment-button"
                            onClick={() =>
                              handleDeleteComment(post._id, comment._id)
                            }
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && <div className="error_msg">{error}</div>}
    </div>
  );
}
