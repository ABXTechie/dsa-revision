import Question from "../models/Question.js";
import Revision from "../models/Revision.js";
import {
  getToday,
  getNextRevisionDate,
} from "../utils/revisionUtils.js";

export const solveQuestion = async (req, res) => {
  try {
    const {
      title,
      link,
      topic,
      difficulty,
    } = req.body;

    if (!title || !link || !topic || !difficulty) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const solvedDate = getToday();

    const existingQuestion = await Question.findOne({
      userId: req.userId,
      title: title.trim(),
      link: link.trim(),
    });

    if (existingQuestion) {
      const existingRevision = await Revision.findOne({
        userId: req.userId,
        questionId: existingQuestion._id,
        solvedDate,
      });

      if (existingRevision) {
        return res.status(409).json({
          message: "You already added this question today.",
        });
      }
    }

    const question = await Question.create({
      userId: req.userId,
      title: title.trim(),
      link: link.trim(),
      topic: topic.trim(),
      difficulty,
    });

    const revision = await Revision.create({
      userId: req.userId,
      questionId: question._id,
      solvedDate,
      revisionNumber: 1,
      scheduledDate: getNextRevisionDate(
        solvedDate,
        1
      ),
      status: "pending",
    });

    res.status(201).json({
      message: "Question added",
      question,
      revision,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add question",
    });
  }
};