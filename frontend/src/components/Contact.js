import React, { useState } from "react";
import emailjs from "emailjs-com";
import BackgroundImg from "../assert/game.gif";
import Navbar from "./Navbar";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const serviceID = "service_u50247o"; // Replace with your EmailJS service ID
    const templateID = "template_zt3h7fa"; // Replace with your EmailJS template ID
    const userID = "yQbyNxwFYXat4yqAw"; // Replace with your EmailJS user ID
    // Prepare the data to send with EmailJS, including the sender's name and email

    const emailData = {
      ...formData,
      senderName: formData.name, // Add the sender's name as a separate field
      reply_to: formData.email, // Specify the sender's email as the "From" address
    };

    // Sending email using EmailJS

    emailjs
      .send(serviceID, templateID, emailData, userID)
      .then((response) => {
        console.log("Email sent:", response);
        alert("Your message has been sent successfully!");
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      })

      .catch((error) => {
        console.error("Error sending email:", error);

        alert(
          "An error occurred while sending the message. Please try again later."
        );
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
          <div className="w-full max-w-md mx-auto bg-gray-800 rounded p-6 shadow-lg ml-16 border-purple-500">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block font-semibold mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 border-purple-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block font-semibold mb-2">
                  Email:
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your Email ID"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 border-purple-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="message" className="block font-semibold mb-2">
                  Message:
                </label>

                <textarea
                  id="message"
                  name="message"
                  placeholder="Enter any suggestion or query"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-700 border-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
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

export default ContactForm;
