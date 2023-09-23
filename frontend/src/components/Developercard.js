import React from 'react';

const DeveloperCard = ({ name, contribution, image }) => {
  return (
    <div className="p-4 max-w-sm rounded overflow-hidden shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 bg-gray-800 border border-purple-500">
    <img className="w-full h-80 object-cover rounded-t border-purple-500" src={image} alt={`Photo of ${name}`} />
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">{name}</div>
      <p className="text-gray-700 text-base">{contribution}</p>
    </div>
  </div>
  );
};

export default DeveloperCard;
