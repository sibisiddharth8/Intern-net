import React, { useState } from 'react';

const DeveloperLink = ({ name, href, imageSrc }) => {
  const [hover, setHover] = useState(false);

  return (
    <span
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {name}
      </a>
      {hover && (
        <div className="w-full absolute z-50 -top-20 left-1/2 transform -translate-x-1/2 p-0.5 overflow-hidden bg-white dark:bg-gray-700 rounded-full shadow-lg">
          <img src={imageSrc} alt={name} className="object-contain rounded-full" />
        </div>
      )}
    </span>
  );
};

export default DeveloperLink;
