import BackgroundImg from "../assert/game.gif";
import Navbar from "./Navbar";
import DeveloperCard from "./Developercard";
import React, { useEffect, useState } from 'react';
import ronak from '../assert/ronak.png'
import ved from '../assert/ved.png'
import dhrutik from '../assert/dhrutik.png'
import vipin from '../assert/vipin.png'
import pranav from '../assert/pranav.png'

const developers = [
    {
      name: 'Ved Thakur',
      contribution: 'Full Stack Developer, Product Manager',
      image: ved, // Replace with the actual image URL for John Doe
    },
    {
      name: 'Ronak Asnani',
      contribution: 'Full Stack Developer, Team Leader',
      image: ronak, // Replace with the actual image URL for Jane Smith
    },
    {
        name: 'Vipin Chaudhary',
        contribution: 'Full Stack Developer, Director',
        image: vipin, // Replace with the actual image URL for Jane Smith
      },
      {
        name: 'Pranav Dherange',
        contribution: 'Full Stack Developer,Managing Director',
        image: pranav, // Replace with the actual image URL for Jane Smith
      },
      {
        name: 'Dhrutik Patel',
        contribution: 'Full Stack Developer, Chief Tech Officer',
        image: dhrutik, // Replace with the actual image URL for Jane Smith
      },
    // Add more developers here...
  ];

const Developer = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
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
        {/* <div className="flex flex-col justify-center items-center">
          <div class="absolute top-20 left-90 mr-64 mt-32">
            <h1 class="text-2xl font-bold text-green-500 shadow-lg">
              <div className="text-green">HubGPT</div>
            </h1>
          </div>
        </div> */}
        <div className="flex items-center justify-centre h-screen"></div>
        <div
          className={`absolute top-10 left-10 container mx-auto py-8 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1 className="text-3xl font-bold text-purple-500 shadow-lg mb-4">Meet Our Team</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {developers.map((developer, index) => (
              <DeveloperCard key={index} {...developer} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Developer;
