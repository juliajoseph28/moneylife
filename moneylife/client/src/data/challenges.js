const challenges = [
  {
    id: 1,
    question: "What's the best way to save money?",
    emoji: "🤔",
    options: [
      { id: 'a', text: 'Spend everything you earn', correct: false },
      { id: 'b', text: 'Save a portion of every allowance', correct: true },
      { id: 'c', text: 'Only save when you feel like it', correct: false }
    ],
    explanation: 'Saving a portion of every allowance builds good habits!',
    reward: 5
  },
  {
    id: 2,
    question: "What is a 'need' vs a 'want'?",
    emoji: "🛒",
    options: [
      { id: 'a', text: 'Needs are things required to live, wants are extras', correct: true },
      { id: 'b', text: 'They are the same thing', correct: false },
      { id: 'c', text: 'Wants are more important than needs', correct: false }
    ],
    explanation: 'Needs are essentials like food and shelter. Wants are nice-to-haves!',
    reward: 5
  },
  {
    id: 3,
    question: "Why is it good to wait before buying something expensive?",
    emoji: "⏰",
    options: [
      { id: 'a', text: "It's not good, buy it immediately", correct: false },
      { id: 'b', text: 'You might realize you don\'t really need it', correct: true },
      { id: 'c', text: 'Things never go on sale', correct: false }
    ],
    explanation: 'Waiting helps you avoid impulse purchases you might regret!',
    reward: 5
  },
  {
    id: 4,
    question: "What's a budget?",
    emoji: "📊",
    options: [
      { id: 'a', text: 'A plan for how to spend and save your money', correct: true },
      { id: 'b', text: 'A type of piggy bank', correct: false },
      { id: 'c', text: 'A credit card', correct: false }
    ],
    explanation: 'A budget helps you track where your money goes!',
    reward: 5
  },
  {
    id: 5,
    question: "What does 'paying yourself first' mean?",
    emoji: "💵",
    options: [
      { id: 'a', text: 'Buying yourself treats before anything else', correct: false },
      { id: 'b', text: 'Saving money before spending on other things', correct: true },
      { id: 'c', text: 'Getting paid at your job', correct: false }
    ],
    explanation: 'Put money into savings first, then spend what\'s left!',
    reward: 5
  }
]

export const getRandomChallenge = () => {
  const randomIndex = Math.floor(Math.random() * challenges.length)
  return challenges[randomIndex]
}

export default challenges