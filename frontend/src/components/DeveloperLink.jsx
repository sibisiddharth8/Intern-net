import React from "react";

const DeveloperLink = ({ data }) => {
  if (!data || !data.developers) return null; // Handle missing data

  return (
    <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        Designed and Developed by
      </p>
      <div className="flex items-center text-xs">
        {data.developers.map((dev, index) => (
          <React.Fragment key={dev.name}>
            <span className="relative group px-2">
              <a
                href={dev.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {dev.name}
              </a>
              <div className="w-16 h-16 absolute z-50 -top-20 left-1/2 transform -translate-x-1/2 p-0.5 overflow-hidden bg-white dark:bg-gray-700 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none">
                <img
                  src={dev.imageSrc}
                  alt={dev.name}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
            </span>
            {index < data.developers.length - 1 && (
              <span className="text-gray-500 dark:text-gray-400">|</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DeveloperLink;
