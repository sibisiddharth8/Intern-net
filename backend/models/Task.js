const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const CommentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  replies: [ReplySchema],
  createdAt: { type: Date, default: Date.now }
});

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  progress: [{
    intern: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'Not Started' },
    updatedAt: { type: Date },
    completedAt: { type: Date }
  }],
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
  editedOn: { type: Date } // Updated when task details change
});

module.exports = mongoose.model('Task', TaskSchema);
