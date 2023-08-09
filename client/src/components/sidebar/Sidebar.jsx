import "./sidebar.css";
import { setLogout } from "../../Redux/userSlice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
          <Link style={{ textDecoration: "none" }} to='/postAdd'>
            <span className="sidebarListItemText">POST</span>
          </Link>
          </li>
          <li className="sidebarListItem">
          <Link to="/search" style={{ textDecoration: "none" }}>
            <span className="sidebarListItemText">SEARCH</span>
          </Link>
          </li>
          <li className="sidebarListItem">
          <Link style={{ textDecoration: "none" }} to={`/profile/${user?.user?._id}`}>
            <span className="sidebarListItemText">PROFILE</span>
          </Link>
          </li>
        </ul>
        <div className="item">
      {user ? (
        <div>
    
          <button onClick={() => dispatch(setLogout())}>Log Out</button>
        </div>
      ) : (
        <button>
          <Link style={{ textDecoration: "none" }}  className="Link" to="/login">
            Login
          </Link>
        </button>
      )}
    </div>
      
      </div>
    </div>
  );
};

export default Sidebar;
