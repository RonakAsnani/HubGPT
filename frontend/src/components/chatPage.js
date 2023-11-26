import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MessageField from "./messageField";
import Sidebar from "./sidepanel";
import axios from "axios";

const ChatPage = () => {
  const navigate = useNavigate();
  const signOut = () => {
    localStorage.removeItem("DPAHub");
    navigate("/");
  };
  const [chatpos, setChatpos] = useState(false);
  const [chatid, setchatid] = useState(null);
  const [savechat, setsavechat] = useState(false);
  //const [activechat,setactivechat] = useState(null);
  const [chatList, setchatlist] = useState([]);
  const [newchat, setnewchat] = useState(false);
  const fetchOldChats = async () => {
    const authToken = localStorage.getItem("DPAHub");
    const res = await axios
      .get("https://hubgpt.onrender.com/sidebar/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json", // Set the content type to JSON
        },
      })
      .then((response) => {
        //console.log(response.data.days)
        setchatlist(response.data.days);
        setchatid(null);
      });
  };
  useEffect(() => {
    fetchOldChats();
  }, []);
  useEffect(() => {
    fetchOldChats();
  }, [savechat]);

  return (
    <div className="flex">
      <Sidebar
        fetcholdchats={fetchOldChats}
        chatid={chatid}
        setnewchat={setnewchat}
        signOut={signOut}
        setChatpos={setChatpos}
        chatpos={chatpos}
        setsavechat={setsavechat}
        setchatid={setchatid}
        chatList={chatList}
        setchatlist={setchatlist}
      />
      <MessageField
        newchat={newchat}
        setnewchat={setnewchat}
        chatpos={chatpos}
        chatid={chatid}
        setchatid={setchatid}
        setsavechat={setsavechat}
        savechat={savechat}
        chatList={chatList}
      />
    </div>
  );
};

export default ChatPage;
