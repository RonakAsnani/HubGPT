import React, { useState } from "react";
import { useNavigate } from "react-router";
import { fetchToken, setToken } from "../Auth";
import BackgroundImg from "../assert/game.gif";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";

const Login = (props) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if ((username == "") & (password == "")) {
      return;
    } else {
      axios
        .post("https://hubgpt.onrender.com/login", {
          username: username,
          password: password,
        })
        .then(function (response) {
          console.log(response.data.token, "response.data.token");
          if (response.data.token) {
            setToken(response.data.token);
            navigate("/chat");
          } else {
            console.log(response);
          }
        })
        .catch(function (error) {
          console.log(error, "error");
        });
    }
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
        <div>
          {fetchToken() ? (
            <p>You are logged in!</p>
          ) : (
            <>
              <div className="flex flex-col justify-center items-center">
                <div class="absolute top-20 left-90 mr-64 mt-32">
                  <h1 class="text-2xl font-bold text-green-500 shadow-lg">
                    <div className="text-green">HubGPT</div>
                  </h1>
                </div>
              </div>
              <div className="flex items-center justify-start h-screen">
                <div className="w-full max-w-md mx-auto bg-gray-800 rounded p-6 shadow-lg ml-16">
                  <h2 className="text-2xl font-bold mb-4">Login</h2>
                  <form>
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block font-semibold mb-2"
                      >
                        User Name:
                      </label>
                      <input
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        id="username"
                        name="name"
                        placeholder="Enter your username"
                        className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 border-purple-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block font-semibold mb-2"
                      >
                        Password:
                      </label>

                      <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="******************"
                        className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 border-purple-500"
                        required
                      />
                    </div>
                    <Link>
                      <button
                        onClick={login}
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded focus:outline-none focus:ring"
                      >
                        Sign In
                      </button>
                    </Link>
                  </form>
                  <br></br>
                  Username: Ronak, Password: 1234
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
