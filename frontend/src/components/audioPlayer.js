import React, { useRef } from "react";

function AudioPlayer({ audioUrl, message }) {
    console.log(audioUrl)
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="flex flex-row justify-between">
      {message}
      <div className="bg-gray-700">
        <button
          style={{ position: "relative", bottom: "27px" }}
          className="play-button text-white rounded-full w-8 h-8 flex items-center justify-center"
          onClick={handlePlay}
        >
          <i className={`far fa-play-circle text-xl`}></i>
        </button>
        <audio src={audioUrl} ref={audioRef} />
      </div>
    </div>
  );
}

export default AudioPlayer;
