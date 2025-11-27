// backend/controllers/moodController.js
const Mood = require('../models/Mood');

// Helper to determine time of day if not sent from frontend
const getTimeOfDay = (date) => {
  const hour = date.getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
};

// @desc    Log a mood
// @route   POST /api/moods
exports.addMood = async (req, res) => {
  try {
    const { mood, score, timeOfDay, note } = req.body;

    // Use provided timeOfDay or calculate it
    const finalTimeOfDay = timeOfDay || getTimeOfDay(new Date());

    const newMood = new Mood({
      user: req.user.id, // Assumes you have auth middleware setting req.user
      mood,
      score,
      timeOfDay: finalTimeOfDay,
      note,
      date: new Date()
    });

    const savedMood = await newMood.save();
    res.status(201).json(savedMood);
  } catch (error) {
    console.error("Error adding mood:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get mood history (Daily & Weekly stats)
// @route   GET /api/moods/history
exports.getMoodHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    
    // 1. Get Today's Moods (For Daily Graph)
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const todaysMoods = await Mood.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ date: 1 });

    // 2. Get Last 7 Days Moods (For Weekly Graph)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyMoods = await Mood.find({
      user: userId,
      date: { $gte: oneWeekAgo }
    }).sort({ date: 1 });

    // 3. Generate "Short Discussion" / Insight
    let totalScore = 0;
    weeklyMoods.forEach(m => totalScore += m.score);
    const avgScore = weeklyMoods.length > 0 ? (totalScore / weeklyMoods.length) : 0;
    
    let insight = "Start tracking your mood to see insights here.";
    if (weeklyMoods.length > 0) {
        if (avgScore >= 4) insight = "You've had a generally positive week! Keep up the good vibes.";
        else if (avgScore >= 3) insight = "Your week has been balanced. Remember to take breaks.";
        else insight = "It looks like a tough week. Consider booking a session with our experts.";
    }

    res.json({
      today: todaysMoods,
      week: weeklyMoods,
      insight: insight
    });

  } catch (error) {
    console.error("Error fetching mood history:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};