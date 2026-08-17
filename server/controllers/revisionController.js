import Revision from "../models/Revision.js";
import Question from "../models/Question.js";
import {
  getToday,
  addDays,
  getNextRevisionDate,
} from "../utils/revisionUtils.js";

export const getTodayRevisions = async (req, res) => {
  try {
    const today = getToday();

    const revisions = await Revision.find({
      userId: req.userId,
      status: "pending",
    })
      .populate("questionId")
      .sort({
        scheduledDate: 1,
      });

    const validRevisions = revisions.filter(
      (revision) => revision.questionId
    );

    const overdue = validRevisions.filter(
      (revision) =>
        revision.scheduledDate < today
    );

    const dueToday = validRevisions.filter(
      (revision) =>
        revision.scheduledDate === today
    );

    res.json({
      overdue,
      dueToday,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch revisions",
    });
  }
};

export const completeRevision = async (req, res) => {
  try {
    const revision = await Revision.findOne({
      _id: req.params.id,
      userId: req.userId,
      status: "pending",
    });

    if (!revision) {
      return res.status(404).json({
        message: "Revision not found",
      });
    }

    const question = await Question.findOne({
      _id: revision.questionId,
      userId: req.userId,
    });

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const today = getToday();

    revision.status = "completed";
    revision.completedDate = today;

    await revision.save();

    if (revision.revisionNumber < 5) {
      const nextRevisionNumber =
        revision.revisionNumber + 1;

      const nextScheduledDate =
        getNextRevisionDate(
          revision.solvedDate,
          nextRevisionNumber
        );

      const nextRevision = await Revision.create({
        userId: req.userId,
        questionId: revision.questionId,
        solvedDate: revision.solvedDate,
        revisionNumber: nextRevisionNumber,
        scheduledDate: nextScheduledDate,
        status: "pending",
      });

      return res.json({
        message: "Revision completed",
        revision,
        nextRevision,
      });
    }

    res.json({
      message: "Revision cycle completed",
      revision,
      nextRevision: null,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to complete revision",
    });
  }
};

export const forgotRevision = async (req, res) => {
  try {
    const revision = await Revision.findOne({
      _id: req.params.id,
      userId: req.userId,
      status: "pending",
    });

    if (!revision) {
      return res.status(404).json({
        message: "Revision not found",
      });
    }

    const tomorrow = addDays(getToday(), 1);

    revision.scheduledDate = tomorrow;

    await revision.save();

    res.json({
      message: "Revision rescheduled",
      revision,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to reschedule revision",
    });
  }
};