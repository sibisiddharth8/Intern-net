// src/components/ActionConfirmModal.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ActionConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={onCancel}></div>
      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 relative">
          {/* Close Button */} 
          <button
            onClick={onCancel}
            className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
          >
            <FaTimes size={18} />
          </button>
          <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
          <p className="mb-6">{message}</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActionConfirmModal;
