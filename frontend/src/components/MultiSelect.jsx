import React from 'react';

const MultiSelect = ({ options, selectedOptions, onChange }) => {
  const handleSelect = (value) => {
    if (selectedOptions.includes(value)) {
      onChange(selectedOptions.filter(opt => opt !== value));
    } else {
      onChange([...selectedOptions, value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(option => {
        const isSelected = selectedOptions.includes(option._id);
        return (
          <button
            key={option._id}
            type="button"
            onClick={() => handleSelect(option._id)}
            aria-pressed={isSelected}
            className={`px-4 py-2 rounded border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400
              ${isSelected 
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
          >
            {option.name}
          </button>
        );
      })}
    </div>
  );
};

export default MultiSelect;
