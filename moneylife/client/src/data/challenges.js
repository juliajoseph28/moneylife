// src/data/challenges.js

export const challenges = [
  {
    id: 1,
    type: 'quiz',
    emoji: '🧠',
    title: 'Quick Quiz!',
    question: 'What does "saving" mean?',
    options: [
      { text: 'Spending all your money', correct: false },
      { text: 'Keeping money for later', correct: true },
      { text: 'Giving money away', correct: false }
    ],
    reward: 5,
    tip: 'Saving helps you buy bigger things later!'
  },
  {
    id: 2,
    type: 'quiz',
    emoji: '🤔',
    title: 'Think Fast!',
    question: "You found $10! What's the smartest choice?",
    options: [
      { text: 'Spend it all on candy', correct: false },
      { text: 'Save some, spend some', correct: true },
      { text: 'Hide it under your bed forever', correct: false }
    ],
    reward: 5,
    tip: 'Balance is key! Save some, spend some wisely.'
  },
  {
    id: 3,
    type: 'quiz',
    emoji: '🎯',
    title: 'Goal Check!',
    question: 'Why is having a savings goal helpful?',
    options: [
      { text: "It makes saving boring", correct: false },
      { text: 'It helps you stay motivated', correct: true },
      { text: "Goals don't matter", correct: false }
    ],
    reward: 10,
    tip: 'Goals give your money a purpose!'
  },
  {
    id: 4,
    type: 'quiz',
    emoji: '💳',
    title: 'Money Smarts!',
    question: 'What is a budget?',
    options: [
      { text: 'A plan for your money', correct: true },
      { text: 'A type of piggy bank', correct: false },
      { text: 'A way to get free stuff', correct: false }
    ],
    reward: 5,
    tip: 'A budget tells your money where to go!'
  },
  {
    id: 5,
    type: 'quiz',
    emoji: '🏦',
    title: 'Bank Basics!',
    question: 'What happens when you put money in a savings account?',
    options: [
      { text: 'It disappears', correct: false },
      { text: 'It stays safe and can grow', correct: true },
      { text: 'The bank spends it', correct: false }
    ],
    reward: 5,
    tip: 'Banks pay you interest for keeping money with them!'
  },
  {
    id: 6,
    type: 'scenario',
    emoji: '⚡',
    title: 'Emergency!',
    description: 'Oh no! Your bike got a flat tire. Repairs cost $15.',
    question: 'What do you learn from this?',
    options: [
      { text: 'Always have emergency savings!', correct: true },
      { text: 'Never ride bikes again', correct: false }
    ],
    reward: 0,
    penalty: 15,
    tip: 'Emergency funds help when unexpected things happen!'
  },
  {
    id: 7,
    type: 'bonus',
    emoji: '⭐',
    title: 'Bonus Round!',
    description: 'Grandma gave you $20 for helping her!',
    question: 'How will you split it?',
    options: [
      { text: 'Save $15, Spend $5', correct: true },
      { text: 'Spend it all now!', correct: false },
      { text: 'Save all $20', correct: true }
    ],
    reward: 20,
    tip: 'Balancing saving and spending is a great skill!'
  }
]

export const getRandomChallenge = () => {
  return challenges[Math.floor(Math.random() * challenges.length)]
}