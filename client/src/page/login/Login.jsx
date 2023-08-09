import { useState } from "react";
import axios from "../../utils/axios";
import { userLogin } from "../../utils/constant";
import "./login.css";
import { useDispatch } from "react-redux";
import { setLogin } from "../../Redux/userSlice/userSlice";

import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(userLogin, data);
      dispatch(
        setLogin({ user: response.data.user, token: response.data.token })
      );
      navigate("/");
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
    <div className="main-container">
      <div className="form-div">
        <h1>LOGIN</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="">EMAIL</label>
            <input
              type="email"
              required
              placeholder="Enter Eamil"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="">PASSWORD</label>
            <input
              type="password"
              required
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Signup</button>
        </form>
        {error && <div className="error_msg">{error}</div>}

        <div>
          <Link to="/signup">
            <span>create account</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
