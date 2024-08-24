const mongoose = require("mongoose");

const TaskModel = mongoose.model(
  "Task",
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
      },
      title: {
        type: String,
        minlenght: 3,
        maxlength: 255,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      dueDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "IN_PROGRESS"],
        default: "PENDING",
      },
    },
    { timestamps: true }
  )
);

module.exports = TaskModel;
