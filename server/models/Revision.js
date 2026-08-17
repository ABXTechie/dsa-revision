import mongoose from "mongoose";

const revisionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    solvedDate: {
      type: String,
      required: true,
    },

    revisionNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    scheduledDate: {
      type: String,
      required: true,
    },

    completedDate: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Revision", revisionSchema);