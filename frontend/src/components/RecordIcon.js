import { ReactMediaRecorder } from "react-media-recorder";

function RecordIcon({ paramStop }) {
  return (
    
      <ReactMediaRecorder
        audio
        onStop={paramStop}
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <button
            className={`p-2 px-4 mx-2 rounded-md ${status=="recording"?"bg-red-400":"bg-[#7289da]"}`}
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
          >
          
           <i className="fa fa-microphone "></i>
          </button>
        )}
      />
    
  );
}

export default RecordIcon;
