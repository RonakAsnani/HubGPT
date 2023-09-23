import React, { useState, useRef, useEffect } from "react";
import RecordIcon from "./RecordIcon";
import axios from "axios";
import "../componentStyles/messagefield.css";
import AudioPlayer from "./audioPlayer";
// import {useHistory} from 'react-router-dom'
import {useLocation} from 'react-router-dom';
const MessageField = ({ chatpos, chatid,setchatid , setsavechat, savechat, chatList, newchat, setnewchat}) => {
  // const history = useHistory();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [dbmessages, setdbmessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function ConvertBlobToUrl(data) {
    const blob = new Blob([data], { type: "audio/mpeg" });
    const rachelblobUrl = window.URL.createObjectURL(blob);
    return rachelblobUrl;
  }
  const [bloburl, setbloburl] = useState("");
  // const inputRef = useRef(null);
  const checkPressed = async (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  const handleStop = async (mediaBlobUrl) => {
    setIsLoading(true);
    setbloburl(mediaBlobUrl);
    try {
      const response = await fetch(mediaBlobUrl);
      const raw_data = await response.blob();
      const form = new FormData();
      form.append("file", raw_data, "myrecord.wav");
      // // const botMessage = response.data.response;

      // const binary_file = res.data;
      // const rachelUrl = ConvertBlobToUrl(binary_file);

      var textval = "hello";
      const textRes = await axios
        .post("http://127.0.0.1:8000/convert-audio-to-text/", form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        })
        .then((response) => {
          textval = response.data
        });
      const message = textval;
      setMessages([
        ...messages,
        { text: message, sender: "user" }
      ]);
      if (message) {
        //   setMessages([...messages]);
        try {
          // GET OPENAI RESPONSE
          const response = await axios.get(`http://127.0.0.1:8000/${message}`);
    
          // TEXT RESPONSE
          const botMessage = response.data.response;
          // AUDIO RESPONSE
        //  console.log(botMessage,"openai");
          setIsLoading(false);
          var audioOutput;
          const audioResponse = await axios
            .post(
              "http://127.0.0.1:8000/convert-text-to-audio",
              { text: botMessage },
              {
                headers: { "Content-Type": "audio/mpeg" },
                responseType: "arraybuffer",
              }
            )
            .then((response) => {
              audioOutput = ConvertBlobToUrl(response.data);
            })
            .catch((error) => console.log(error));
          //console.log(audioOutput);
          setMessages([
            ...messages,
            {
              message: (
                <AudioPlayer message={textval} audioUrl={mediaBlobUrl} user={true}/>
              ),
              sender_type: "user",
            },
            {
              message: (
                <AudioPlayer message={botMessage} audioUrl={audioOutput} user={false}/>
              ),
              sender_type: "bot",
            },
          ]);
          setdbmessages([
            ...dbmessages,
            {
              sender_type: "user",
              message: textval,
              message_type: "audio",
            },
            {
              sender_type: "bot",
              message: botMessage,
              message_type: "audio",
            },
          ]);
        } catch (error) {
          // setMessages([...messages, { text: message, sender: "user" }]);
          console.error("Error sending message:", error);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  // to play audio

  // WHEN A TEXT MESSAGE IS SENT
  const sendMessage = async () => {
    setIsLoading(true);
    const message = document.getElementById("text-input-gpt").value.trim();
    if (message) {
      //   setMessages([...messages]);
        setMessages([
          ...messages,
          { text: message, sender: "user" }
        ]);
      try {
        // GET OPENAI RESPONSE
        const response = await axios.get(`http://127.0.0.1:8000/${message}`);
       // console.log(response);
        // TEXT RESPONSE
        const botMessage = response.data.response;
        // AUDIO RESPONSE
        //console.log(botMessage);   
        var audioOutput;
        const audioResponse = await axios
          .post(
            "http://127.0.0.1:8000/convert-text-to-audio",
            { text: botMessage },
            {
              headers: { "Content-Type": "audio/mpeg" },
              responseType: "arraybuffer",
            }
          )
          .then((response) => {
            audioOutput = ConvertBlobToUrl(response.data);
          })
          .catch((error) => console.log(error));
       // console.log(audioOutput);
       setIsLoading(false);

        setMessages([
          ...messages,
          { message: message, sender_type: "user" },
          {
            message: (
              <AudioPlayer message={botMessage} audioUrl={audioOutput} user={false}/>
            ),
            sender_type: "bot",
          },
        ]);
        setdbmessages([
          ...dbmessages,
          {
            sender_type: "user",
            message: message,
            message_type: "text",
          },
          {
            sender_type: "bot",
            message: botMessage,
            message_type: "text",
          },
        ]);
      } catch (error) {
        // setMessages([...messages, { text: message, sender: "user" }]);
        console.error("Error sending message:", error);
      }
      document.getElementById("text-input-gpt").value = "";
    }
  };

  const sendApiRequest = async () => {
    try {
      // Replace with your actual API endpoint and request configuration
      if(chatid == null){
        const authToken = localStorage.getItem("DPAHub")
     // console.log(dbmessages,authToken);
      const response = await axios.post("http://127.0.0.1:8000/add_chats",dbmessages,{
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json', // Set the content type to JSON
        },
      })
     // console.log(response)
      //setchatid(response.data.conversation_id)
      //return response.data.conversation_id;
      }else{
        const authToken = localStorage.getItem("DPAHub")
        //console.log(dbmessages,authToken);
        
        const url = `http://127.0.0.1:8000/update_chats/${chatid}`;
        const response = await axios.put(url,dbmessages,{
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json', // Set the content type to JSON
          },
        }).then(()=>{
         // console.log(chatid)
        })
       // console.log(response)
        //setchatid(null)
      }
      
    } catch (error) {
      console.error('Error sending API request:', error);
    }
  };
  // useEffect(()=> {
  //   if(chatid == 0){
  //     console.log("new chat")
  //     const id = sendApiRequest();
  //     setchatid(id);

  //   }
  //   if(dbmessages.length%6 == 0){
  //     console.log(dbmessages)
  //     sendApiRequest();
  //   }
    
  // },[dbmessages])

  useEffect(()=> {
    if(savechat == true){
      setsavechat(false)
      sendApiRequest();
      setMessages([]);
      setdbmessages([]);
    }
  },[savechat])
  const getchatlist = async () =>{
    if(chatid !== null){
      const authToken = localStorage.getItem("DPAHub")
    const res = await axios.get(`http://127.0.0.1:8000/conversations/${chatid}`,{
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json', // Set the content type to JSON
      },
    }).then((response)=>{
      //console.log(response)
      setMessages(response.data.chats)
      setdbmessages(response.data.chats)
    })
    }else{
      setMessages([]);
      setdbmessages([]);
    }
    
  }
  useEffect(()=>{
   // setMessages(chatList[chatid])
   //console.log(chatid)
   getchatlist();
   
  },[chatid])

  useEffect(()=>{
    setnewchat(false);
    setMessages([])
    setdbmessages([])
    setchatid(null)
  },[newchat])

  return (
    <div
      style={{ maxHeight: "100vh" }}
      className={`flex flex-col items-stretch justify-between min-h-screen flex-1 ${
        chatpos ? "mr-20" : ""
      }`}
    >
      {messages.length == 0 ? (
        <div className="chat-header bg-gray-700 text-white text-center rounded-t-md">
          <h1 className="text-lg font-semibold">
            Hub-GPT{" "}
            <span className="bg-[#7289da] py-2 px-2 rounded-lg">Plus</span>
          </h1>
        </div>
      ) : (
        <div
          style={{ maxHeight: "90%" }}
          className="chat-container  rounded-md flex-grow"
        >
          <div
            style={{ height: "99%" }}
            className="chat-messages overflow-y-scroll p-2 text-left "
            id="chat-messages"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message px-3 ${
                  message.sender_type === "bot"
                    ? "border-l-4 border-blue-500 bg-gray-700 flex flex-row justify-between"
                    : "border-l-4 border-green-500 bg-gray-800"
                } p-2 rounded-lg my-1 ${
                  message.sender_type === "user" ? "self-end" : "self-start"
                }`}
              >
                <div className="flex-1">
                  <i
                    className={` ${
                      message.sender_type === "bot"
                        ? "fa-solid fa-robot px-3"
                        : "px-4 fa-solid fa-user"
                    }`}
                  ></i>
                  {message.message}
                </div>
                {message.sender_type == "bot" ? (
                  <div className="float-right">
                    {/* <i className="far fa-play-circle"></i> */}
                    <i className="fa-solid fa-paste ml-1"></i>
                    <i className="fa-regular fa-thumbs-up ml-2"></i>
                    <i className="fa-regular fa-thumbs-down ml-2"></i>
                  </div>
                ) : (<></>
                  // <div className="float-right" style={{position:"relative",bottom:"22px",right:"3px"}}>
                  // <i className="far fa-play-circle"></i>
                  // </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={`chat-input flex items-center p-2 rounded-b-md bg-gray-800 `}
      >
        <input
          id="text-input-gpt"
          onKeyDown={checkPressed}
          type="text"
          // ref={inputRef}
          className="flex-1 py-1 px-2 border rounded-md mr-2 bg-gray-700 focus:outline-none"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 text-white rounded-md bg-[#7289da]  focus:outline-none "
        >
          {isLoading ? <i class="fa fa-spinner fa-spin"></i> : 'Send'}
        </button>

        {isLoading ?  <button className="px-4 py-2 text-white rounded-md bg-[#7289da]  focus:outline-none ">
                        <i class="fa fa-spinner fa-spin"></i>
                      </button>
                      :
                      <RecordIcon paramStop={handleStop} />
        }      
        {console.log("HELL")}
      </div>
    </div>
  );
};

export default MessageField;
