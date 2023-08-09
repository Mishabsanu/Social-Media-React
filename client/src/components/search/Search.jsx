import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { setPosts } from "../../Redux/userSlice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { format } from "timeago.js";
import './search.css'
const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");


  const searchPost = async (query) => {
    const response = await axios.get(
      `http://localhost:2000/api/user/searchPost?query=${query}`
    );

    setSearchResults(response.data);
  };

  useEffect(() => {
    searchPost(query);
  }, [query]);
  const curntUser = useSelector((state) => state.user);

  const [posts, setPost] = useState([]);
  console.log(posts);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

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
  const userId = curntUser?.user?._id;
  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:2000/api/user/likePost/${postId}/${userId}`
      );
      setPost((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, like: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await axios.get(
        `http://localhost:2000/api/user/deletePost/${postId}`
      );
      setPost(response.data);
      dispatch(setPosts({ posts: response.data.posts }));
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

  return (
    <div className="profile searchMain">
      <div className="profileContainer">
        <div className="uInfo">
          <div className="search-Main">
            <h1 className="text">Search</h1>
            <div className="search">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="search-input"
              />
            </div>
          </div>

          {searchResults &&
            searchResults?.posts?.map((post) => {
              return (
                <div key={post?._id} className="feed">
                  <div className="feedWrapper">
                    <div className="post">
                      <div className="postWrapper">
                        <div className="postTop">
                          <div className="postTopLeft">
                            <Link to={`/profile/${post?.author?._id}`}>
                              <img
                                className="postProfileImg"
                                src={post?.author?.profilePic}
                                alt=""
                              />
                            </Link>
                            <span className="postUsername">
                              {post?.author?.userName}
                            </span>
                            <span className="postDate">
                              {format(new Date(post.createdAt), "PPP")}
                            </span>
                          </div>
                          <div className="postTopRight">
                            <Link to={`/editPost/${post?._id}`}>
                              {post?.author?._id === userId && (
                                <button className="editButton">Edit</button>
                              )}
                            </Link>
                            {post?.author?._id === userId && (
                              <button
                                className="editButton deleteButton"
                                onClick={() => handleDelete(post?._id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="postCenter">
                          <span className="postText">{post?.content}</span>
                          {post?.image && (
                            <img className="postImg" src={post?.image} alt="" />
                          )}
                        </div>
                        <div className="postBottom">
                          <div className="postBottomLeft">
                            <button
                              className="likeIcon"
                              onClick={() => handleLike(post?._id)}
                            >
                              Like
                            </button>
                            <span className="postLikeCounter">
                              {post?.like?.length}{" "}
                              {post?.like?.length === 1 ? "person" : "people"}{" "}
                              like it
                            </span>
                          </div>
                          <div className="postBottomRight">
                            <span className="postCommentText">
                              {post?.comment?.length} comments
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {error && <div className="error_msg">{error}</div>}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Search;
