import { useState } from "react";
import axios from "../../utils/axios";
import { userSignup } from "../../utils/constant";
import "./signup.css";

import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      userName: userName,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(userSignup, data);
      console.log(response);

      navigate("/login");
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
  const validateName = (userName) => {
    const namePattern = /^[A-Za-z\s]+$/;
    return namePattern.test(userName);
  };
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  return (
    <div className="main-container">
      <div className="form-div">
        <h1>SIGNUP</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userName">NAME</label>
            <input
              type="text"
              id="userName"
              placeholder="Enter User Name"
              onChange={(e) => setUserName(e.target.value)}
              required
            />
              {!validateName(userName) && (
              <span className="error_msg">Invalid UserName</span>
            )}
          </div>
          <div>
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {!validateEmail(email) && (
              <span className="error_msg">Invalid email format</span>
            )}
          </div>
          <div>
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!validatePassword(password) && (
              <span className="error_msg">
                Password must be at least 6 characters{" "}
              </span>
            )}
          </div>
          <button type="submit">Signup</button>
        </form>
        <div>
        {error && <div className="error_msg">{error}</div>}
        </div>

        <div>
          <Link to="/login">
            <span>Already have account </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
