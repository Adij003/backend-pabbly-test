const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    title: { 
        type: String, 
        required: true,
        trim: true
    },
    description: { 
        type: String, 
        trim: true 
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: 'medium'
      },
      start_date: { 
        type: Date, 
        default: Date.now
    },
    due_date: { 
        type: Date, 
        required: true 
    },
    status: {
      type: String,
      enum: ["pending", "completed", 'in_progress'],
      default: "pending",
    },
   
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);