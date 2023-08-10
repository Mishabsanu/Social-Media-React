import { useEffect, useState } from "react";
import "./rightbar.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setFollowers,
  setFollowings,
  setNotFollowingUsers,
} from "../../Redux/userSlice/userSlice";


const Rightbar = () => {
  const [user, setUser] = useState([]);
  console.log(user, "user");
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const currentUserId = currentUser?.user?._id;
  const [error, setError] = useState("");
  const [followClicked, setFollowClicked] = useState(false);
  const [unfollowClicked, setUnfollowClicked] = useState(false);
  console.log(unfollowClicked);
  console.log(error);
  console.log(followClicked);
  const Followings = useSelector((state) => state.followings);
  const notFollowingUsers = useSelector((state) => state.notFollowingUsers);
  const Followers = useSelector((state) => state.followers);
  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2000/api/user/getAllUser"
      );
      setUser(response.data.user);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.error);
      }
    }
  };
  const handleFollow = async (userId) => {
    const response = await axios.put(
      `http://localhost:2000/api/user/follow/${userId}`,
      { currentUserId }
    );

    getNotFollowingUsers();
    getFollowings();

    const updatedFollowings = [...Followings.Followings, response.data];
    dispatch(setFollowings({ Followings: updatedFollowings }));

    setFollowClicked(true);
  };
  const getFollowings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2000/api/user/getFollowings/${currentUserId}`
      );
      dispatch(setFollowings({ followings: response.data }));
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.error);
      }
    }
  };

  const getFollowers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2000/api/user/getFollowers/${currentUserId}`
      );

      dispatch(setFollowers({ followers: response.data }));
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.error);
      }
    }
  };
  useEffect(() => {
    getNotFollowingUsers();
    getFollowings();
    getFollowers();
  }, []);

  const getNotFollowingUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2000/api/user/getNotFollowingUsers/${currentUserId}`
      );

      dispatch(setNotFollowingUsers({ notFollowingUsers: response.data }));
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.error);
      }
    }
  };
  const handleUnfollow = async (userId) => {

    try {
    const response = await axios.put(
      `http://localhost:2000/api/user/unfollow/${userId}`,
      { currentUserId }
    );
    console.log(response, "handleUnfollow");

    getNotFollowingUsers();
    getFollowings();

    const updatedFollowings = Followings.Followings.filter(
      (user) => user._id !== userId
    );
    dispatch(setFollowings({ Followings: updatedFollowings }));

    setUnfollowClicked(true);
  } catch (error) {
    console.log(error);
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status <= 500
    ) {
      setError(error.response.data.error);
    }
  }
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <h6>You might Know..</h6>
        <ul className="sidebarList">
          {notFollowingUsers?.map((user) => (
            <li key={user?._id} className="sidebarListItem">
              <div className="">
                <img className="postImgs" src={user?.profilePic} alt="" />
                <h3>{user?.userName}</h3>
                <button onClick={() => handleFollow(user._id)}>Follow</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="sidebarWrapper">
          <h6>Followers..</h6>
          <ul className="sidebarList">
            {Followers?.map((user) => (
              <li key={user?._id} className="sidebarListItem">
                <div className="">
                  <img className="postImgs" src={user?.profilePic} alt="" />
                  <h3>{user?.userName}</h3>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="sidebarWrapper">
          <h6>Followings..</h6>
          <ul className="sidebarList">
            {Followings?.map((user) => (
              <li key={user?._id} className="sidebarListItem">
                <div className="">
                  <img className="postImgs" src={user?.profilePic} alt="" />
                  <h3>{user?.userName}</h3>
                  <button onClick={() => handleUnfollow(user?._id)}>
                    Unfollow
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
