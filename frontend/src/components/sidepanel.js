// Sidebar.js
import React, { useEffect, useState } from 'react';
// import data from "./chatsdata.json";
import Chatbox from './chatobject';
import axios from 'axios';

const Sidebar = ({chatid,signOut,setChatpos, chatpos, setsavechat, setchatid, chatList, setchatlist,setnewchat, fetcholdchats}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [data,setdata] = useState([]);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        if(chatpos){
            setChatpos(false)
        }else{
            setChatpos(true)
        }
    };
    // useEffect(()=>{

    // },[chatList])


    return (
        <div className={`bg-[#1a202c] h-screen  flex flex-col  max-w-xs`}>
            <div className='flex  flex-row justify-between'>
                <div className={`px-4 py-2 mt-5 ml-2 text-white justify-between border-white border-solid flex flex-row ${!isOpen? "d-hidden":"border-1"} border-1 `}>
                    <button className='flex flex-row px-3 ' onClick={()=> setnewchat(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-0">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>New 
                    </button>
                    <button className='flex flex-row px-3' onClick={()=> setsavechat(true)}>
                        <i className='fa fa-save px-2'></i>
                    Save 
                    </button>
                    
                </div>
                {isOpen ? (
                    <div >
                    
                    <button
                        className="px-4 py-2 mt-5 ml-2 text-white bg-[#1a202c] rounded"
                        onClick={toggleSidebar}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>

                    </button>
                    <button style={{position:"relative",bottom:"7px"}} className='px-3 text-white bg-[#1a202c] rounded' onClick={signOut}><i className='fa fa-power-off'></i></button>
                    </div>
                ) : (
                    <div>
                   
                    <button
                        className="px-3 py-2 mt-5 ml-2 text-white bg-black rounded"
                        onClick={toggleSidebar} 
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>

                    </button>
                    <button style={{position:"relative",bottom:"6px"}}  className='px-3 mr-2 py-2 ml-2 bg-black bg-[#1a202c] rounded' onClick={signOut}><i className='fa fa-power-off'></i></button>
                    </div>

                )}
            </div>
            <div 
                className={`flex-1 pt-2 max-w-xs bg-[#4a5568] overflow-y-scroll sidebar-messages ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 ease-in-out ${chatpos ? 'hidden':''}`}
            >

                {chatList.map((day) => (
                    <div className='flex flex-col '>
                        <span className='pl-2 text-xs font-bold'>
                            {day.day}
                        </span>
                        {day.chats.map((chat) => (
                            <Chatbox
                            fetcholdchats={fetcholdchats}
                                chatid = {chatid}
                                setchatid={setchatid}
                                key={chat.conversation_id}
                                id={chat.conversation_id}
                                message={chat.message}
                            />
                        ))}
                    </div>
                ))}


            </div>
        </div>
    );
};

export default Sidebar;
