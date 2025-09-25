import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkValidSignUpFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";
import "./SignUp.css"; // Importing CSS

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState("");
  const [isShow, setIsShow] = useState(false);
  const navigate = useNavigate();

  const signUpUser = (e) => {
    toast.loading("Wait until you SignUp");
    e.target.disabled = true;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    })
      .then((res) => res.json())
      .then((json) => {
        setLoad("");
        e.target.disabled = false;
        toast.dismiss();
        if (json.token) {
          navigate("/signin");
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

  const handleSignup = (e) => {
    if (firstName && lastName && email && password) {
      const validError = checkValidSignUpFrom(firstName, lastName, email, password);
      if (validError) {
        toast.error(validError);
        return;
      }
      setLoad("Loading...");
      signUpUser(e);
    } else {
      toast.error("Required: All Fields");
    }
  };

  return (
    <div className="signup-container">
      {/* Overlay */}
      <div className="overlay"></div>

      {/* Signup Card */}
      <div className="signup-card">
        <h2 className="signup-title">🚀 Create Your Account</h2>

        <form className="signup-form">
          <input
            className="input-field"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <input
            className="input-field"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <input
            className="input-field"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-container">
            <input
              className="input-field"
              type={isShow ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setIsShow(!isShow)}
              className="password-toggle"
            >
              {isShow ? <PiEyeClosedLight size={22} /> : <PiEye size={22} />}
            </span>
          </div>

          <button
            onClick={(e) => {
              handleSignup(e);
              e.preventDefault();
            }}
            className="submit-btn"
          >
            {load === "" ? "Sign Up" : load}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account?{" "}
          <Link to="/signin" className="signup-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
