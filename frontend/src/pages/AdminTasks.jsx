import React, { useState, useEffect, useMemo } from 'react';
import axios from '../api/axiosInstance';
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSyncAlt,
  FaTasks,
  FaMoon,
  FaSun,
} from 'react-icons/fa';
import MultiSelect from '../components/MultiSelect';
import Notification from '../components/Notification';
import ActionConfirmModal from '../components/ActionConfirmModal';
import EditTaskModal from '../components/EditTaskModal';
import ReplyModal from '../components/ReplyModal';

const AdminTasks = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    internIds: [],
    dueDate: '',
  });
  const [internFilter, setInternFilter] = useState('All');
  const [taskFilter, setTaskFilter] = useState('');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State for Reply Modal
  const [replyModal, setReplyModal] = useState({
    isOpen: false,
    taskId: null,
    commentId: null,
  });

  // Fetch interns from backend
  const fetchInterns = async () => {
    try {
      const res = await axios.get('/interns');
      setInterns(res.data);
    } catch (err) {
      setNotification({ type: 'error', message: 'Error fetching interns' });
      console.error('Error fetching interns:', err);
    }
  };

  // Fetch tasks from backend
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      setNotification({ type: 'error', message: 'Error fetching tasks' });
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
    fetchTasks();
  }, []);

  // Compute distinct college names for the college filter dropdown
  const distinctColleges = useMemo(() => {
    const colleges = interns
      .map((intern) => intern.collegeName)
      .filter((college) => college && college.trim() !== '');
    return ['All', ...Array.from(new Set(colleges))];
  }, [interns]);

  // Filter interns based on selected college for task assignment
  const filteredInterns = useMemo(() => {
    if (internFilter === 'All') return interns;
    return interns.filter((intern) => intern.collegeName === internFilter);
  }, [interns, internFilter]);

  // Compute selected intern objects for display in the create task form
  const selectedInternsForDisplay = useMemo(() => {
    return interns.filter((intern) => newTask.internIds.includes(intern._id));
  }, [interns, newTask.internIds]);

  // Filter tasks by title or description based on the search filter
  const filteredTasks = useMemo(() => {
    if (!taskFilter.trim()) return tasks;
    return tasks.filter(
      (task) =>
        (task.title || '').toLowerCase().includes(taskFilter.toLowerCase()) ||
        (task.description || '').toLowerCase().includes(taskFilter.toLowerCase())
    );
  }, [tasks, taskFilter]);

  const createTask = async () => {
    try {
      await axios.post('/tasks', newTask);
      setNotification({ type: 'success', message: 'Task created successfully' });
      setNewTask({ title: '', description: '', internIds: [], dueDate: '' });
      fetchTasks();
    } catch (err) {
      setNotification({ type: 'error', message: 'Error creating task' });
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      setNotification({ type: 'success', message: 'Task deleted successfully' });
      fetchTasks();
    } catch (err) {
      setNotification({ type: 'error', message: 'Error deleting task' });
    }
  };

  // Open reply modal instead of using a prompt
  const openReplyModal = (taskId, commentId) => {
    setReplyModal({ isOpen: true, taskId, commentId });
  };

  const closeReplyModal = () => {
    setReplyModal({ isOpen: false, taskId: null, commentId: null });
  };

  return (
    // The outer container conditionally adds the "dark" class.
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <h2 className="text-3xl font-bold flex items-center mb-6">
            <FaTasks className="mr-2" /> Manage Tasks
          </h2>

          {/* Notification */}
          {notification && (
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          )}

          {/* Task Creation Form */}
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-2xl font-semibold flex items-center mb-4">
              <FaPlus className="mr-2" /> Create New Task
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {/* Title Field */}
              <div>
                <label className="block mb-1 text-sm font-medium">Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              {/* Description Field */}
              <div>
                <label className="block mb-1 text-sm font-medium">Description</label>
                <textarea
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                ></textarea>
              </div>
              {/* Due Date Field */}
              <div>
                <label className="block mb-1 text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              {/* College Filter for Assignment */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Select College for Assignment
                </label>
                <select
                  value={internFilter}
                  onChange={(e) => setInternFilter(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {distinctColleges.map((college, idx) => (
                    <option key={idx} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </div>
              {/* MultiSelect for Intern Assignment */}
              <div>
                <label className="block mb-1 text-sm font-medium">Assign to Interns</label>
                <MultiSelect
                  options={internFilter === 'All' ? interns : filteredInterns}
                  selectedOptions={newTask.internIds}
                  onChange={(selected) =>
                    setNewTask({ ...newTask, internIds: selected })
                  }
                />
                {/* (Optional) Display selected intern names */}
                {selectedInternsForDisplay.length > 0 && (
                  <div className="mt-2 text-sm">
                    Selected: {selectedInternsForDisplay.map((intern) => intern.name).join(', ')}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex justify-end">
              <button
                onClick={createTask}
                type="submit"
                className="mt-4 w-max flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition cursor-pointer"
              >
                <FaPlus className="mr-2" /> Create Task
              </button>
            </div>
          </div>

          {/* Task List */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Task List</h3>
            {/* Filter Input & Refresh Button */}
            <div className="flex items-center mb-6">
              <input
                type="text"
                placeholder="Type task title or description..."
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={fetchTasks}
                disabled={loading}
                className="flex items-center ml-4 text-sm text-gray-900 dark:text-white hover:text-blue-400 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSyncAlt className="mr-2 animate-spin" /> Refreshing...
                  </>
                ) : (
                  <>
                    <FaSyncAlt className="mr-2" /> Refresh
                  </>
                )}
              </button>
            </div>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white dark:bg-gray-800 p-4 rounded mb-4 shadow flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-1">{task.title}</h4>
                    <p className="mb-2">{task.description}</p>
                    {task.dueDate && (
                      <p className="text-sm mb-1">
                        <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    {task.editedOn && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Edited on: {new Date(task.editedOn).toLocaleString()}
                      </p>
                    )}
                    <div className="mt-2">
                      <h5 className="font-semibold text-sm">Assigned Interns &amp; Progress:</h5>
                      {task.progress.map((prog, idx) => (
                        <div key={idx} className="text-sm ml-2">
                          Intern: {task.assignedTo[idx]?.name || 'Unknown'} – Status: {prog.status}
                          {prog.updatedAt && (
                            <span> (Last updated: {new Date(prog.updatedAt).toLocaleString()})</span>
                          )}
                          {prog.completedAt && (
                            <span> (Completed: {new Date(prog.completedAt).toLocaleString()})</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <h5 className="font-semibold text-sm">Comments:</h5>
                      {task.comments.map((comment) => (
                        <div key={comment._id} className="border-t border-gray-500 mt-1 pt-1">
                          <p className="text-sm">
                            <strong>{comment.author?.name || 'Unknown'}</strong>: {comment.text}
                          </p>
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-4">
                              {comment.replies.map((reply) => (
                                <p key={reply._id} className="text-xs text-gray-400">
                                  <strong>{reply.author?.name || 'Unknown'}</strong>: {reply.text}
                                </p>
                              ))}
                            </div>
                          )}
                          <button
                            onClick={() => openReplyModal(task._id, comment._id)}
                            className="text-xs text-blue-400 mt-1 cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-4 md:mt-0">
                    <button
                      onClick={() => handleEditClick(task)}
                      className="flex items-center text-blue-400 hover:text-blue-600 transition cursor-pointer"
                    >
                      <FaEdit className="mr-1" /> <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={() =>
                        setConfirmAction({
                          action: () => deleteTask(task._id),
                          message: 'Are you sure you want to delete this task?',
                        })
                      }
                      className="flex items-center text-red-400 hover:text-red-600 transition cursor-pointer"
                    >
                      <FaTrash className="mr-1" /> <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No tasks found matching that filter.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Task Modal */}
      {isEditModalOpen && editingTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          task={editingTask}
          interns={interns}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={fetchTasks}
        />
      )}

      {/* Action Confirm Modal for deletion */}
      {confirmAction && (
        <ActionConfirmModal
          message={confirmAction.message}
          onConfirm={() => {
            confirmAction.action();
            setConfirmAction(null);
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {/* Reply Modal */}
      {replyModal.isOpen && (
        <ReplyModal
          isOpen={replyModal.isOpen}
          taskId={replyModal.taskId}
          commentId={replyModal.commentId}
          onClose={closeReplyModal}
          onReplySent={fetchTasks}
        />
      )}
    </div>
  );
};

export default AdminTasks;
