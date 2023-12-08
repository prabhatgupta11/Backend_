const express = require("express");
const pollRouter = express.Router();
const db = require("../models/index");

// Now you can access the Sequelize instance and models
const sequelize = db.sequelize;
const Poll = db.Poll;
const QuestionSet = db.QuestionSet;
const PollAnalytics=db.PollAnalytics
 
// Create a new poll with question sets
pollRouter.post("/createPolls/:userID", async (req, res) => {
  try {

    const {
      title,
      category,
      startDate,
      endDate,
      minReward,
      maxReward,
      questionSets,
    } = req.body;

    // Create a new poll
    const poll = await Poll.create({
      userID:req.params.userID,
      title,
      category,
      startDate,
      endDate,
      minReward,
      maxReward,
    });
  // Create a new PollAnalytics instance for the created poll
  const pollAnalytics = await PollAnalytics.create({
    pollId: poll.id,
    totalVotes: 0, // Initialize totalVotes to 0
    optionCounts: {}, // Initialize optionCounts to an empty object
  });

    const createdQuestionSets = await QuestionSet.bulkCreate(
      questionSets.map((set) => ({ ...set, pollId: poll.id }))
    );

    // Assuming you want to associate the question sets with the poll
    await poll.addQuestionSets(createdQuestionSets);

    res.status(201).json({ message: "Poll created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Endpoint for fetching all polls with analytics
pollRouter.get('/getAllPolls', async (req, res) => {
  try {
    const polls = await Poll.findAll({
      include: [
        {
          model: PollAnalytics,
          as: 'PollAnalyticss',
        },
      ],
    });

    res.status(200).json({ polls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint for updating a particular poll
pollRouter.put('/updatePolls/:pollId', async (req, res) => {
  try {
    const { pollId } = req.params;
 
    const { title, category, startDate, endDate, minReward, maxReward } = req.body;

    // Find the poll by id
    const pollToUpdate = await Poll.findByPk(pollId);


    // Update poll details if provided
    if (title) pollToUpdate.title = title;
    if (category) pollToUpdate.category = category;
    if (startDate) pollToUpdate.startDate = startDate;
    if (endDate) pollToUpdate.endDate = endDate;
    if (minReward) pollToUpdate.minReward = minReward;
    if (maxReward) pollToUpdate.maxReward = maxReward;

    // Save the updated poll
    await pollToUpdate.save();

    res.status(200).json({ message: 'Poll updated successfully', poll: pollToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//fetching user's Poll
// pollRouter.get('/polls/user/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Fetch polls along with associated questions for a specific user
//     const userPolls = await Poll.findAll({
//       where: { userId }, // Assuming userId is the field in the Poll model
//       include: [
//         {
//           model: QuestionSet,
//           as: 'QuestionSets',
//         },
//       ],
//     });

//     res.status(200).json(userPolls);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });
pollRouter.get('/polls/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user polls along with associated questions
    const userPolls = await Poll.findAll({
      where: { userId }, 
      include: [
        {
          model: QuestionSet,
          as: 'QuestionSets',
        },
      ],
    });

    // Check if the user has polls
    if (!userPolls || userPolls.length === 0) {
      return res.status(404).json({ message: 'User or polls not found' });
    }

    // Extract the first poll and its associated question sets
    const firstPoll = userPolls[0];

    if (!firstPoll.QuestionSets || firstPoll.QuestionSets.length === 0) {
      return res.status(404).json({ message: 'No questions found for the first poll' });
    }

    const questions = firstPoll.QuestionSets.map((questionSet) => ({
      pollId: firstPoll.id,
      questionSetId: questionSet.id,
      questionSetText: questionSet.questionText,
      options: questionSet.options,
    }));

    res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint for fetching user polls and serving questions one at a time
// pollRouter.get('/polls/user/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const startDate = "2023-01-01 00:00:00";
//     const endDate = "2023-10-31 00:00:00";

//     // Assume you have a User model with a proper association to Polls and QuestionSets
//     const user = await Poll.findAll({
//       where: { userId }, // Assuming userId is the field in the Poll model
//       include: [
//         {
//           model: QuestionSet,
//           as: 'QuestionSets',
//         },
//       ],
//     });

//     if (!user || user.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Filter polls based on date range if provided
//     const filteredPolls = startDate && endDate
//       ? user.filter(poll => poll.startDate >= startDate && poll.endDate <= endDate)
//       : user;

//     // Iterate through the polls and find the next unanswered question
//     let nextQuestion = null;

//     for (const poll of filteredPolls) {
//       const unansweredQuestion = poll.QuestionSets.find(
//         (qSet) => !user.votedQuestions.includes(qSet.id)
//       );

//       if (unansweredQuestion) {
//         nextQuestion = {
//           pollId: poll.id,
//           questionId: unansweredQuestion.id,
//           questionText: unansweredQuestion.questionText,
//           options: unansweredQuestion.options.map(option => ({ id: option.id, text: option.text })),
//         };
//         break;
//       }
//     }

//     if (!nextQuestion) {
//       return res.status(404).json({ message: 'No new polls exist' });
//     }

//     res.status(200).json({ nextQuestion });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// Endpoint for submitting a poll
pollRouter.post('/polls/submit/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { id, questionSetId, selectedOptionValue } = req.body;

    // Find the user and the specified poll
    const user = await db.User.findByPk(userId);
    
    const poll = await Poll.findByPk(id, {
      include: [
        {
          model: QuestionSet,
          as: 'QuestionSets',
        },
      ],
    });



    if (!user || !poll) {
      return res.status(404).json({ message: 'User or Poll not found' });
    }

    // Check if the question exists in the poll

    const questionSet = poll.QuestionSets.find((qSet) => qSet.id==questionSetId);
  

    if (!questionSet) {
      return res.status(404).json({ message: 'Question not found in the specified poll' });
    }

    // Check if the selected option exists in the question
    
    const selectedOption = questionSet.options.find((option)=>option === selectedOptionValue);


  

    if (!selectedOption) {
      return res.status(404).json({ message: 'Selected option not found in the specified question' });
    }

    // Check if the user has already answered this question
    const hasAnswered = user.votedQuestions.some((votedQuestion) => votedQuestion === questionSetId);

    if (hasAnswered) {
      return res.status(400).json({ message: 'User has already answered this question' });
    }

    // Update user's votedQuestions
    user.votedQuestions.push(questionSetId);
    await user.save();

    // Calculate a random reward within the specified range
    const reward = Math.floor(Math.random() * (poll.maxReward - poll.minReward + 1)) + poll.minReward;


// Fetch the PollAnalytics instance based on some condition 
const pollAnalyticsInstance = await PollAnalytics.findOne({ where: { pollId: id} });

if (pollAnalyticsInstance) {
  // Increment totalVotes by 1
  pollAnalyticsInstance.increment('totalVotes');
  // Increment the count for the selected option

const selectedOptionId = selectedOption;

pollAnalyticsInstance.optionCounts[selectedOptionId] = (pollAnalyticsInstance.optionCounts[selectedOptionId] || 0) + 1;

} else {
  console.log('PollAnalytics instance not found');
}
await pollAnalyticsInstance.save();

    res.status(200).json({ message: 'Poll submitted successfully', reward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint for fetching poll analytics for a particular poll
pollRouter.get('/polls/:pollId/analytics', async (req, res) => {
  try {
    const { pollId } = req.params;

    // Find the specified poll with analytics
    const poll = await PollAnalytics.findOne({where:{pollId}});

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.status(200).json({ pollAnalytics: poll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Endpoint for fetching overall poll analytics
pollRouter.get('/polls/analytics', async (req, res) => {
  try {
    // Find and aggregate statistics for all polls
    const overallAnalytics = await PollAnalytics.findAll();

    res.status(200).json({ overallAnalytics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = pollRouter;
