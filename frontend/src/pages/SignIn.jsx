import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import { checkValidSignInFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";
import "./SignIn.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState("");
  const [isShow, setIsShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logInUser = (e) => {
    toast.loading("Signing in...");
    e.target.disabled = true;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((json) => {
        setLoad("");
        e.target.disabled = false;
        toast.dismiss();
        if (json.token) {
          localStorage.setItem("token", json.token);
          dispatch(addAuth(json.data));
          navigate("/");
          toast.success(json?.message);
        } else {
          toast.error(json?.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoad("");
        toast.dismiss();
        toast.error("Error : " + error.code);
        e.target.disabled = false;
      });
  };

  const handleLogin = (e) => {
    if (email && password) {
      const validError = checkValidSignInFrom(email, password);
      if (validError) {
        toast.error(validError);
        return;
      }
      setLoad("Loading...");
      logInUser(e);
    } else {
      toast.error("Required: All Fields");
    }
  };

  return (
    <div className="signin-page">
      {/* Overlay */}
      <div className="overlay"></div>

      {/* Card */}
      <div className="signin-card">
        <h2 className="signin-title">Welcome Back 👋</h2>
        <p className="signin-subtitle">
          Sign in to continue to <span>Campus Connect</span>
        </p>

        <form className="signin-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={isShow ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={() => setIsShow(!isShow)} className="eye-icon">
                {isShow ? <PiEyeClosedLight size={22} /> : <PiEye size={22} />}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogin(e);
            }}
            disabled={load !== ""}
          >
            {load === "" ? "Sign In" : load}
          </button>
        </form>

        <div className="signin-links">
          <Link to="#">Forgot Password?</Link>
          <Link to="/signup">Create an Account</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
