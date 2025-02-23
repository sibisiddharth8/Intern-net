import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { FaComment, FaPaperPlane } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';

const InternDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [notification, setNotification] = useState(null);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateProgress = async (taskId, status) => {
    try {
      await axios.put(`/tasks/${taskId}/progress`, { status });
      setNotification({ type: 'success', message: 'Progress updated successfully!' });
      fetchTasks();
    } catch (err) {
      setNotification({ type: 'error', message: 'Error updating progress' });
    }
  };

  const addComment = async (taskId) => {
    const text = commentInputs[taskId];
    if (!text || text.trim() === '') return;
    try {
      await axios.post(`/tasks/${taskId}/comments`, { text });
      setNotification({ type: 'success', message: 'Comment added successfully!' });
      setCommentInputs(prev => ({ ...prev, [taskId]: '' }));
      fetchTasks();
    } catch (err) {
      setNotification({ type: 'error', message: 'Error adding comment' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar type="intern" />
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Tasks</h2>
        <div className="space-y-6">
          {tasks.map(task => (
            <div
              key={task._id}
              className="bg-white dark:bg-gray-800 p-6 rounded shadow text-gray-900 dark:text-white"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <h3 className="text-xl font-bold">{task.title}</h3>
                <div className="mt-2 md:mt-0">
                  <label className="block text-sm mb-1">Update Progress:</label>
                  <select
                    defaultValue="Not Started"
                    onChange={e => updateProgress(task._id, e.target.value)}
                    className="p-2 bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>
              <p className="mt-2">{task.description}</p>
              {task.dueDate && (
                <p className="mt-2 text-sm">
                  <span className="font-medium">Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              {task.editedOn && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Edited on: {new Date(task.editedOn).toLocaleString()}
                </p>
              )}
              <div className="mt-4">
                <h4 className="font-semibold text-lg">Comments</h4>
                <div className="space-y-2 mt-2">
                  {task.comments.map(comment => (
                    <div key={comment._id} className="border-t border-gray-300 dark:border-gray-600 pt-2">
                      <p className="text-sm">
                        <strong>{comment.author?.name || 'Unknown'}</strong>: {comment.text}
                      </p>
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-4 space-y-1">
                          {comment.replies.map(reply => (
                            <p key={reply._id} className="text-xs text-gray-500 dark:text-gray-400">
                              <strong>{reply.author?.name || 'Unknown'}</strong>: {reply.text}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex mt-4">
                  <input
                    type="text"
                    placeholder="Add comment"
                    value={commentInputs[task._id] || ''}
                    onChange={e =>
                      setCommentInputs(prev => ({ ...prev, [task._id]: e.target.value }))
                    }
                    className="p-2 bg-gray-200 dark:bg-gray-700 rounded flex-1 text-gray-900 dark:text-white focus:outline-none"
                  />
                  <button
                    onClick={() => addComment(task._id)}
                    className="ml-2 text-white bg-blue-500 hover:bg-blue-700 p-2 rounded flex items-center cursor-pointer"
                  >
                    {commentInputs[task._id] && commentInputs[task._id].trim() !== '' ? (
                      <FaPaperPlane />
                    ) : (
                      <FaComment />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No tasks available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternDashboard;
