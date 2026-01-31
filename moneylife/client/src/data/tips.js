// src/data/tips.js

export const tips = {
  saving: [
    "Saving even $1 a week adds up to $52 a year! 📈",
    "Pay yourself first - save before you spend! 💰",
    "A piggy bank is your money's cozy home! 🐷",
    "Saving is like planting seeds for future fun! 🌱",
    "The best time to start saving was yesterday. The second best time is now! ⏰",
    "Small savings today = big rewards tomorrow! 🎁"
  ],
  spending: [
    "Ask yourself: Do I need it or want it? 🤔",
    "Waiting 24 hours before buying helps avoid regrets! ⏰",
    "Compare prices - be a smart shopper! 🛒",
    "Spending on experiences with friends can be worth it! 👫",
    "It's okay to spend sometimes - just be mindful! 🧘",
    "Treats are fine, but don't let them eat your savings! 🍦"
  ],
  emergency: [
    "Unexpected things happen - that's why we save! 🆘",
    "Try to save 3 months of expenses for emergencies! 🏦",
    "An emergency fund is your financial superhero! 🦸",
    "Life throws curveballs - savings help you catch them! ⚾"
  ],
  general: [
    "Money is a tool - learn to use it wisely! 🔧",
    "Rich people save first, then spend what's left! 💎",
    "Every dollar has a job - give it one! 📋",
    "Being good with money is a superpower! 🦸‍♀️",
    "Financial literacy = life cheat codes! 🎮"
  ]
}

export const getRandomTip = (category) => {
  const categoryTips = tips[category] || tips.general
  return categoryTips[Math.floor(Math.random() * categoryTips.length)]
}