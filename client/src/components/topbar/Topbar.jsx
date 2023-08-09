import { Link } from "react-router-dom";

import "./topbar.css";
import { useSelector } from "react-redux";
const Topbar = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">OFF</span>
        </Link>
      </div>
      <div className="topbarCenter"></div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <span className="logo">{user?.user?.userName}</span>
        </div>
        <Link style={{ textDecoration: "none" }} to={`/profile/${user?.user?._id}`}>
          <img src={user?.user?.profilePic ? user?.user?.profilePic : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}  alt="" className="topbarImg" />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
