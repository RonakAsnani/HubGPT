import React, { useState } from "react";
import BackgroundImg from "../assert/game.gif";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const signup = (e) => {
    e.preventDefault()
    axios
      .post("http://127.0.0.1:8000/signup", {
        username: username,
        mobile: mobile,
        email: email,
        password: password,
      })
      .then(function (response) {
        alert("User registered successfully!")
        navigate("/login");
        console.log(response.config.data);
      })
      .catch(function (error) {
        alert(error.response.data.detail)
        // console.log(error.response.data.detail);
      });
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          margin: "0",
          padding: "0",
          top: 0,
          bottom: 0,
          backgroundImage: `url(${BackgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col justify-center items-center">
          <div class="absolute top-20 left-90 mr-64 mt-32">
            <h1 class="text-2xl font-bold text-green-500 shadow-lg">
              <div className="text-green">HubGPT</div>
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-start h-screen">
          <div className="w-full max-w-md mx-auto bg-gray-800 rounded p-6 shadow-lg ml-16">
            <h2 className="text-2xl font-bold mb-4">Signup</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block font-semibold mb-2">
                  Name:
                </label>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  id="username"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 border-purple-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block font-semibold mb-2">
                  Mobile No.
                </label>

                <input
                  onChange={(e) => setMobile(e.target.value)}
                  type="text"
                  id="username"
                  name="email"
                  placeholder="Enter your 10 digit phone no."
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 border-purple-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block font-semibold mb-2">
                  Email ID
                </label>

                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="username"
                  name="email"
                  placeholder="Enter your Email"
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 border-purple-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block font-semibold mb-2">
                  Password
                </label>

                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  name="email"
                  placeholder="******************"
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 border-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                onClick={signup}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded focus:outline-none focus:ring"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
