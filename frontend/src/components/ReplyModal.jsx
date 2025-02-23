// src/components/ReplyModal.jsx
import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import Notification from './Notification';

const ReplyModal = ({ isOpen, taskId, commentId, onClose, onReplySent }) => {
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      await axios.post(`/tasks/${taskId}/comments/${commentId}/reply`, { text: replyText });
      setNotification({ type: 'success', message: 'Reply sent successfully!' });
      setReplyText('');
      if (onReplySent) onReplySent();
      // Close the modal after a short delay
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setNotification({ type: 'error', message: 'Error sending reply' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={onClose}></div>
      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-4/5 md:w-xl">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Reply to Comment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none dark:bg-gray-700 dark:text-white"
              rows={4}
              placeholder="Type your reply here..."
              required
            ></textarea>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </form>
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ReplyModal;
