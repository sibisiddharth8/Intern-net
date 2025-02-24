import React, { useState } from "react";

const DeveloperLink = ({ data }) => {
  const [hoveredDev, setHoveredDev] = useState(null);

  if (!data || !data.developers) return null; // Handle cases where data is missing

  return (
    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Designed and Developed by
      </p>
      <div className="flex items-center justify-center gap-2 mt-1 text-xs">
        {data.developers.map((dev, index) => (
          <span
            key={dev.name}
            className="relative"
            onMouseEnter={() => setHoveredDev(dev.name)}
            onMouseLeave={() => setHoveredDev(null)}
          >
            <a
              href={dev.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {dev.name}
            </a>
            {hoveredDev === dev.name && (
              <div className="w-16 h-16 absolute z-50 -top-20 left-1/2 transform -translate-x-1/2 p-0.5 overflow-hidden bg-white dark:bg-gray-700 rounded-full shadow-lg">
                <img
                  src={dev.imageSrc}
                  alt={dev.name}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
            )}
            {index < data.developers.length - 1 && (
              <span className="text-gray-500 dark:text-gray-400 mx-1">|</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DeveloperLink;
