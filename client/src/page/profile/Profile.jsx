import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import "./profile.css";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  setFollowings,
  setNotFollowingUsers,
} from "../../Redux/userSlice/userSlice";
import Topbar from "../../components/topbar/Topbar";

const Profile = () => {
  const { id } = useParams();
  const currentUser = useSelector((state) => state.user);
  const currentUserId = currentUser?.user?._id;
  const [porfFollowings, setporfFollowings] = useState([]);
  const [profileUser, setProfileUser] = useState("");
  const [followClicked, setFollowClicked] = useState(false);
  const [unfollowClicked, setUnfollowClicked] = useState(false);
  const [Followers, setFollowers] = useState([]);
  const [count, setCount] = useState("");
  console.log(unfollowClicked);
  console.log(followClicked);

  const dispatch = useDispatch();

  const getNotFollowingUsers = async () => {
    try {
      const response = await axios(
        `http://localhost:2000/api/user/getNotFollowingUsers/${currentUserId}`
      );

      dispatch(setNotFollowingUsers({ notFollowingUsers: response.data }));
      setNotFollowingUsers(response.data);
    } catch (error) {
      console.log("getAllUsers error notfollwing: " + error);
    }
  };

  const getFollowings = async () => {
    try {
      const response = await axios(
        `http://localhost:2000/api/user/getFollowings/${currentUserId}`
      );
     

      dispatch(setFollowings({ followings: response.data }));
      setporfFollowings(response.data);
    } catch (error) {
      console.log("getAllUsers error: Follwings" + error);
    }
  };

  const handleFollow = async (userId) => {
    const response = await axios.put(
      `http://localhost:2000/api/user/follow/${userId}`,
      { currentUserId: currentUserId }
    );
    location.reload()
    setFollowers(response.data.updateUser);
    getNotFollowingUsers();
    getFollowings();

    const updatedFollowings = [...porfFollowings.Followings, response.data];
    setporfFollowings(updatedFollowings);
    setFollowClicked(true);
  };

  const handleUnfollow = async (userId) => {
    const response = await axios.put(
      `http://localhost:2000/api/user/unfollow/${userId}`,
      { currentUserId }
    );
    setFollowers(response.data.updateUser);
    getNotFollowingUsers();
    getFollowings();

    const updatedFollowings = porfFollowings.Followings.filter(
      (user) => user._id !== userId
    );

    setporfFollowings(updatedFollowings);

    setUnfollowClicked(true);
  };


  const getUser = async () => {
    try {
      const data = await axios.get(
        `http://localhost:2000/api/user/getOneUser/${id}`
      );
      setProfileUser(data.data);
      setFollowers(data.data.user);
      setporfFollowings(data.followings);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUser();
    postCount();
  }, [id]);

  useEffect(() => {
    getNotFollowingUsers();
    getFollowings();
  }, []);

  const postCount = async () => {
    try {
      const response = await axios(
        `http://localhost:2000/api/user/postCount/${currentUserId}`
      );
      setCount(response.data.postCount);
    } catch (error) {
      console.log("getAllUsers error: " + error);
    }
  };

  return (
    <>
      <Topbar />

      <div className="profile-container">
        <div className="profile-picture">
          <img
            src={
              profileUser?.user?.profilePic
                ? profileUser?.user?.profilePic
                : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
            }
            alt="Profile"
          />
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{profileUser?.user?.userName}</h2>
          <p className="profile-description">{profileUser?.user?.email}</p>
        </div>

        <div className="center">
          {currentUserId === profileUser?.user?._id && (
            <Link to={`/editProfile/${profileUser?.user?._id}`}>
              <button>Edit</button>
            </Link>
          )}
          {currentUserId !== profileUser?.user?._id &&
            Followers?.followers?.includes(currentUserId) && (
              <>
                <button
                  className="btnUnfollow"
                  onClick={() => handleUnfollow(profileUser?.user?._id)}
                >
                  Unfollow
                </button>
              </>
            )}
          {currentUserId !== profileUser?.user?._id &&
            !Followers?.followers?.includes(currentUserId) && (
              <>
                <button
                  className="btnfollow"
                  onClick={() => handleFollow(profileUser?.user?._id)}
                >
                  Follow
                </button>
              </>
            )}
        </div>
        <div className="left">
          <h4>{count} Posts</h4>
          <h4>{profileUser?.user?.followers?.length} Followers</h4>
          <h4>{profileUser?.user?.followings?.length} Following</h4>
        </div>
      </div>
    </>
  );
};

export default Profile;
