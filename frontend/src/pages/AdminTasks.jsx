import React, { useState, useEffect, useMemo } from 'react';
import axios from '../api/axiosInstance';
import { FaPlus, FaEdit, FaTrash, FaTasks } from 'react-icons/fa';
import MultiSelect from '../components/MultiSelect';

const AdminTasks = () => {
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    internIds: [],
    dueDate: ''
  });
  const [internFilter, setInternFilter] = useState('All');
  const [taskFilter, setTaskFilter] = useState('');

  // Fetch interns and tasks from backend
  const fetchInterns = async () => {
    try {
      const res = await axios.get('/interns');
      setInterns(res.data);
    } catch (err) {
      console.error('Error fetching interns:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchInterns();
    fetchTasks();
  }, []);

  // Compute distinct college names for dropdown filter
  const distinctColleges = useMemo(() => {
    const colleges = interns
      .map(intern => intern.collegeName)
      .filter(college => college && college.trim() !== '');
    return ['All', ...Array.from(new Set(colleges))];
  }, [interns]);

  // Filter interns based on selected college for assignment
  const filteredInterns = useMemo(() => {
    if (internFilter === 'All') return interns;
    return interns.filter(intern => intern.collegeName === internFilter);
  }, [interns, internFilter]);

  // Filter tasks by title or description
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
      alert('Task created');
      setNewTask({ title: '', description: '', internIds: [], dueDate: '' });
      fetchTasks();
    } catch (err) {
      alert('Error creating task');
    }
  };

  const editTask = async (task) => {
    const newTitle = prompt('Enter new title:', task.title);
    if (!newTitle) return;
    const newDescription = prompt('Enter new description:', task.description);
    const newDueDate = prompt(
      'Enter new due date (YYYY-MM-DD):',
      task.dueDate ? task.dueDate.substring(0, 10) : ''
    );
    try {
      await axios.put(`/tasks/${task._id}`, {
        title: newTitle,
        description: newDescription,
        dueDate: newDueDate
      });
      alert('Task updated');
      fetchTasks();
    } catch (err) {
      alert('Error updating task');
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`/tasks/${taskId}`);
      alert('Task deleted');
      fetchTasks();
    } catch (err) {
      alert('Error deleting task');
    }
  };

  const replyToComment = async (taskId, commentId) => {
    const replyText = prompt('Enter your reply:');
    if (!replyText) return;
    try {
      await axios.post(`/tasks/${taskId}/comments/${commentId}/reply`, { text: replyText });
      alert('Reply sent');
      fetchTasks();
    } catch (err) {
      alert('Error replying to comment');
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <h2 className="text-3xl font-bold flex items-center mb-6">
          <FaTasks className="mr-2" /> Manage Tasks
        </h2>

        {/* Task Creation Form */}
        <div className="mb-8 p-6 bg-gray-800 rounded shadow">
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
                className="p-2 w-full bg-gray-700 rounded focus:outline-none"
              />
            </div>
            {/* Description Field */}
            <div>
              <label className="block mb-1 text-sm font-medium">Description</label>
              <textarea
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="p-2 w-full bg-gray-700 rounded focus:outline-none"
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
                className="p-2 w-full bg-gray-700 rounded focus:outline-none"
              />
            </div>
            {/* College Filter for Assignment */}
            <div>
              <label className="block mb-1 text-sm font-medium">Select College for Assignment</label>
              <select
                value={internFilter}
                onChange={(e) => setInternFilter(e.target.value)}
                className="p-2 w-full bg-gray-700 rounded focus:outline-none"
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
                onChange={(selected) => setNewTask({ ...newTask, internIds: selected })}
              />
            </div>
          </div>
          <button
            onClick={createTask}
            className="flex items-center justify-center mt-4  bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <FaPlus className="mr-2" /> Create Task
          </button>
        </div>

        {/* Task Filter Input */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Filter Tasks</label>
          <input
            type="text"
            placeholder="Type task title or description..."
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            className="p-2 w-full bg-gray-700 rounded focus:outline-none"
          />
        </div>

        {/* Task List */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Task List</h3>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-800 p-4 rounded mb-4 shadow flex flex-col md:flex-row md:items-center md:justify-between"
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
                    <p className="text-xs text-gray-400 mb-1">
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
                      <div key={comment._id} className="border-t border-gray-600 mt-1 pt-1">
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
                          onClick={() => replyToComment(task._id, comment._id)}
                          className="text-xs text-blue-400 mt-1"
                        >
                          Reply
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <button
                    onClick={() => editTask(task)}
                    className="flex items-center text-blue-400 hover:text-blue-600 transition"
                  >
                    <FaEdit className="mr-1" /> <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="flex items-center text-red-400 hover:text-red-600 transition"
                  >
                    <FaTrash className="mr-1" /> <span className="text-sm">Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No tasks found matching that filter.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTasks;
