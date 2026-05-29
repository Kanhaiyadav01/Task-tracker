const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      default: null,  
    },
    duration: {
      type: Number,
      default: 0,      
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TimeLog', timeLogSchema);