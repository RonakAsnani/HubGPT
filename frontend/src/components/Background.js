// import Video from "react-video";
import BackgroundImg from "../assert/game.gif";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import React, { useState, useEffect } from "react";

let currentIndex = 0;
const Typewriter = ({ text, speed, onComplete }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let interval;

    const animateText = () => {
      if (currentIndex < text.length - 1) {
        setDisplayText((prevText) => {
          return prevText + text[currentIndex];
        });
        currentIndex++;
      } else {
        clearInterval(interval);
        onComplete();
      }
    };

    interval = setInterval(animateText, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return <span>{displayText}</span>;
};

function Background() {
  const [showSecondText, setShowSecondText] = useState(false);
  const handleTypewriterComplete = () => {
    setShowSecondText(true);
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
          <div class="absolute top-0 left-0 mt-24 ml-16 w-60">
            <h1 class="text-6xl font-bold text-white shadow-lg">
              <Typewriter
                text="Wgelcome to the Hub of AI:"
                speed={150}
                onComplete={handleTypewriterComplete}
              />
            </h1>
          </div>
        </div>
        {showSecondText && (
          <div className="flex flex-col justify-center items-center">
            <div class="absolute top-20 left-90 mr-64 mt-32">
              <h1 class="text-2xl font-bold text-green-500 shadow-lg">
                <div className="text-green text-center">HubGPT</div>
              </h1>
              <div className="flex">
                {
                  !localStorage.getItem('DPAHub') ? <><Link to="/login">
                  <button className="ml-8 mr-4 mt-4 hover:bg-gray-400 text-white font-bold py-3 px-4 rounded-md small shadow-lg border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 border-purple-500 text-sm">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="mt-4 hover:bg-gray-400 text-white font-bold py-3 px-4 rounded-mg small shadow-lg mb-4 mr-6 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 border-purple-500 text-sm">
                    Sign Up
                  </button>
                </Link></> : 
                <Link to="/chat">
                <button className="ml-8 mr-4 mt-4 hover:bg-gray-400 text-white font-bold py-3 px-4 rounded-md small shadow-lg border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 border-purple-500 text-sm">
                    Go to Chats
                  </button>    
                  </Link>           
                }
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-start h-screen"></div>
      </div>
    </>
  );
}

export default Background;
