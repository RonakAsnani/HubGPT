import axios from "axios";

const Chatbox = (props) => {
    const deletechat = async () => {
        const url = `http://localhost:8000/conversations/${props.id}`;
        const authToken = localStorage.getItem("DPAHub")
        const res = await axios.delete(url,{
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json', // Set the content type to JSON
            },
          })
          props.fetcholdchats();
        }
    return (
        <div className=" flex flex-row m-2 p-2 border-b border-gray-300 justify-between bg-[#4a5568] box-border cursor-[pointer]" >
            <div onClick={()=>props.setchatid(props.id)} className="flex items-center">
            <i class="fa-solid fa-message mr-2"></i>
                {/* {data.days[props.dayNumber][props.key]["question"]} */}
                {props.message}
            </div>
            <div>
                <button onClick={deletechat}>
                <i class="fa-solid fa-trash"></i>
                </button>


            </div>
        </div>

    )
}

export default Chatbox;