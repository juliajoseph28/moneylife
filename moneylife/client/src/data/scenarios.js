// src/data/scenarios.js

export const scenarios = [
  {
    id: 1,
    emoji: '🎂',
    title: "FRIEND'S BIRTHDAY",
    description: "Your best friend is turning 15! They're having dinner at a restaurant.",
    prompt: "Wanna come? It's $25",
    choices: [
      { 
        id: 'a',
        emoji: '😊',
        text: "Yes! I'll go", 
        cost: 25,
        effects: { balance: -25, health: 10 },
        outcome: {
          type: 'tradeoff',
          title: 'Great time!',
          message: 'You had an amazing time with your friend. Memories are priceless!',
          tip: 'Spending on experiences with friends can be worth it - just budget for it!'
        }
      },
      { 
        id: 'b',
        emoji: '🎁',
        text: "I'll send a gift instead", 
        cost: 10,
        effects: { balance: -10, health: 5 },
        outcome: {
          type: 'positive',
          title: 'Thoughtful choice!',
          message: 'Your friend loved the gift! You showed you care while being smart with money.',
          tip: 'A thoughtful $10 gift can mean as much as an expensive one!'
        }
      },
      { 
        id: 'c',
        emoji: '🥲',
        text: "Can't make it this time", 
        cost: 0,
        effects: { balance: 0, health: -5 },
        outcome: {
          type: 'negative',
          title: 'Saved money, but...',
          message: 'You saved money, but felt a bit left out seeing the photos.',
          tip: "It's okay to skip sometimes, but don't miss every special moment!"
        }
      }
    ]
  },
  {
    id: 2,
    emoji: '🎮',
    title: "NEW VIDEO GAME",
    description: "That game you've been waiting for just came out! Everyone's playing it.",
    prompt: "It costs $60. What do you do?",
    choices: [
      { 
        id: 'a',
        emoji: '🤩',
        text: "Buy it now!", 
        cost: 60,
        effects: { balance: -60, health: 15 },
        outcome: {
          type: 'tradeoff',
          title: 'Game on!',
          message: "You're having a blast, but your wallet felt that one!",
          tip: 'New games drop in price after a few months. Patience can save you $20-30!'
        }
      },
      { 
        id: 'b',
        emoji: '⏰',
        text: "Wait for a sale", 
        cost: 0,
        effects: { balance: 0, health: 0 },
        outcome: {
          type: 'positive',
          title: 'Smart move!',
          message: 'You decided to wait. Games usually go on sale within a few months!',
          tip: 'The "wait for sale" strategy can save you hundreds per year on games!'
        }
      },
      { 
        id: 'c',
        emoji: '📺',
        text: "Watch streamers play it", 
        cost: 0,
        effects: { balance: 0, health: 5 },
        outcome: {
          type: 'positive',
          title: 'Free entertainment!',
          message: 'You enjoyed watching others play. Sometimes that\'s just as fun!',
          tip: 'Watching gameplay helps you decide if a game is worth buying!'
        }
      }
    ]
  },
  {
    id: 3,
    emoji: '🍕',
    title: "PIZZA NIGHT",
    description: "Your friends are ordering pizza for movie night at Jake's house.",
    prompt: "Chip in $8 for pizza?",
    choices: [
      { 
        id: 'a',
        emoji: '🍕',
        text: "Yes, pizza time!", 
        cost: 8,
        effects: { balance: -8, health: 10 },
        outcome: {
          type: 'positive',
          title: 'Yummy!',
          message: 'Nothing beats pizza with friends. Worth every penny!',
          tip: 'Small spending on social time is important for happiness!'
        }
      },
      { 
        id: 'b',
        emoji: '🏠',
        text: "I'll eat at home first", 
        cost: 0,
        effects: { balance: 0, health: 5 },
        outcome: {
          type: 'positive',
          title: 'Budget hack!',
          message: 'You ate at home and still hung out with friends. Smart!',
          tip: 'Eating before going out is a classic money-saving trick!'
        }
      }
    ]
  },
  {
    id: 4,
    emoji: '👟',
    title: "COOL SNEAKERS",
    description: "You see amazing sneakers at the mall. All your friends have them.",
    prompt: "They cost $85. Your old shoes are fine though...",
    choices: [
      { 
        id: 'a',
        emoji: '💸',
        text: "Gotta have them!", 
        cost: 85,
        effects: { balance: -85, health: 10 },
        outcome: {
          type: 'tradeoff',
          title: 'Fresh kicks!',
          message: 'You look great, but that was a big chunk of your savings!',
          tip: 'Ask yourself: "Do I NEED this or WANT this?" Wants can wait!'
        }
      },
      { 
        id: 'b',
        emoji: '📸',
        text: "Take a pic, save up", 
        cost: 0,
        effects: { balance: 0, health: 0 },
        outcome: {
          type: 'positive',
          title: 'Wish list!',
          message: 'You added them to your wish list. Maybe for your birthday?',
          tip: 'Creating a wish list helps you prioritize what you really want!'
        }
      },
      { 
        id: 'c',
        emoji: '🚶',
        text: "My shoes are fine", 
        cost: 0,
        effects: { balance: 0, health: 0 },
        outcome: {
          type: 'positive',
          title: 'Confident choice!',
          message: "You realized you don't need new shoes to be cool!",
          tip: "True style is confidence, not expensive clothes!"
        }
      }
    ]
  },
  {
    id: 5,
    emoji: '💼',
    title: "EXTRA CHORES",
    description: "Mom offers to pay you for helping clean out the garage this weekend.",
    prompt: "It's 2 hours of work for $15. What do you say?",
    choices: [
      { 
        id: 'a',
        emoji: '💪',
        text: "Let's do it!", 
        cost: 0,
        effects: { balance: 15, health: -5 },
        outcome: {
          type: 'positive',
          title: 'Cha-ching!',
          message: 'Hard work paid off! You earned $15 and Mom is super happy.',
          tip: 'Extra income opportunities are everywhere. Always say yes when you can!'
        }
      },
      { 
        id: 'b',
        emoji: '😴',
        text: "Not today, I'm tired", 
        cost: 0,
        effects: { balance: 0, health: 5 },
        outcome: {
          type: 'tradeoff',
          title: 'Rest day',
          message: 'You relaxed instead. Sometimes rest is important too.',
          tip: 'Balance is key, but remember: money missed is money lost!'
        }
      }
    ]
  },
  {
    id: 6,
    emoji: '🎬',
    title: "MOVIE PREMIERE",
    description: "The new Marvel movie is out! Your whole friend group is going tonight.",
    prompt: "Tickets are $15. Popcorn combo is $12 extra.",
    choices: [
      { 
        id: 'a',
        emoji: '🍿',
        text: "Full experience! ($27)", 
        cost: 27,
        effects: { balance: -27, health: 15 },
        outcome: {
          type: 'tradeoff',
          title: 'Movie magic!',
          message: 'Amazing movie, amazing snacks, amazing time! But pricey...',
          tip: 'Movie theater snacks are marked up 400%! Sneak in your own (shhh).'
        }
      },
      { 
        id: 'b',
        emoji: '🎟️',
        text: "Just the movie ($15)", 
        cost: 15,
        effects: { balance: -15, health: 10 },
        outcome: {
          type: 'positive',
          title: 'Smart movie-goer!',
          message: 'Great movie! You skipped overpriced snacks.',
          tip: 'Eating before the movies saves $10-15 every time!'
        }
      },
      { 
        id: 'c',
        emoji: '📱',
        text: "I'll wait for streaming", 
        cost: 0,
        effects: { balance: 0, health: -5 },
        outcome: {
          type: 'negative',
          title: 'FOMO alert!',
          message: "You saved money but couldn't join the group chat about it...",
          tip: "Some experiences are worth paying for. Choose wisely!"
        }
      }
    ]
  },
  {
    id: 7,
    emoji: '📱',
    title: "CRACKED CASE",
    description: "Your phone case is cracked and barely protecting your phone.",
    prompt: "Basic case $10, Designer case $35. Which one?",
    choices: [
      { 
        id: 'a',
        emoji: '✨',
        text: "Designer case!", 
        cost: 35,
        effects: { balance: -35, health: 5 },
        outcome: {
          type: 'tradeoff',
          title: 'Looking fancy!',
          message: 'Your phone looks amazing! Though $35 for plastic...',
          tip: "Brand names cost more but don't always mean better quality!"
        }
      },
      { 
        id: 'b',
        emoji: '👍',
        text: "Basic case works", 
        cost: 10,
        effects: { balance: -10, health: 0 },
        outcome: {
          type: 'positive',
          title: 'Practical choice!',
          message: 'Phone is protected, wallet is happy. Win-win!',
          tip: 'Function over fashion saves money. Your phone doesn\'t care how it looks!'
        }
      },
      { 
        id: 'c',
        emoji: '🤷',
        text: "Keep the cracked one", 
        cost: 0,
        effects: { balance: 0, health: -10 },
        outcome: {
          type: 'negative',
          title: 'Risky move...',
          message: 'You saved $10 but now your $800 phone is at risk!',
          tip: 'Sometimes spending a little prevents losing a lot!'
        }
      }
    ]
  },
  {
    id: 8,
    emoji: '🎸',
    title: "GUITAR LESSONS",
    description: "The community center is offering guitar lessons. You've always wanted to learn!",
    prompt: "Monthly fee is $40. Worth it?",
    choices: [
      { 
        id: 'a',
        emoji: '🎵',
        text: "Sign me up!", 
        cost: 40,
        effects: { balance: -40, health: 20 },
        outcome: {
          type: 'positive',
          title: 'Rock star in training!',
          message: "You're learning a skill that lasts forever!",
          tip: 'Investing in skills and education always pays off long-term!'
        }
      },
      { 
        id: 'b',
        emoji: '📺',
        text: "Learn from YouTube", 
        cost: 0,
        effects: { balance: 0, health: 10 },
        outcome: {
          type: 'positive',
          title: 'DIY learner!',
          message: 'Free tutorials can teach you a lot! Self-discipline is key.',
          tip: 'YouTube University is free! Use it for learning new skills.'
        }
      },
      { 
        id: 'c',
        emoji: '⏳',
        text: "Maybe next month", 
        cost: 0,
        effects: { balance: 0, health: 0 },
        outcome: {
          type: 'negative',
          title: 'Postponed dreams',
          message: '"Next month" often becomes "never". Just saying!',
          tip: "Don't delay things that make you happy. Time is also valuable!"
        }
      }
    ]
  },
  {
    id: 9,
    emoji: '🧋',
    title: "BOBA CRAVING",
    description: "You walk past the boba shop and it smells amazing. You have boba stuff at home though.",
    prompt: "Large boba is $7. Get one?",
    choices: [
      { 
        id: 'a',
        emoji: '🤤',
        text: "Treat myself!", 
        cost: 7,
        effects: { balance: -7, health: 5 },
        outcome: {
          type: 'tradeoff',
          title: 'Sipping happiness!',
          message: 'So delicious! But $7 bobas add up fast...',
          tip: '$7 × 3 times a week = $84/month! That\'s $1,000 a year on boba!'
        }
      },
      { 
        id: 'b',
        emoji: '🏠',
        text: "Make it at home", 
        cost: 0,
        effects: { balance: 0, health: 5 },
        outcome: {
          type: 'positive',
          title: 'Home barista!',
          message: 'Your homemade boba hit the spot! And it was basically free.',
          tip: 'Learning to make your favorites at home saves hundreds per year!'
        }
      }
    ]
  },
  {
    id: 10,
    emoji: '🎰',
    title: "ARCADE DAY",
    description: "There's a new arcade in town and everyone's going this weekend!",
    prompt: "$20 for unlimited play. Join the fun?",
    choices: [
      { 
        id: 'a',
        emoji: '🕹️',
        text: "Let's gooo!", 
        cost: 20,
        effects: { balance: -20, health: 15 },
        outcome: {
          type: 'positive',
          title: 'High score!',
          message: 'Best day ever! You and your friends had a blast.',
          tip: 'Budgeting for fun is important. All saving and no play isn\'t healthy!'
        }
      },
      { 
        id: 'b',
        emoji: '🏠',
        text: "Game at home instead", 
        cost: 0,
        effects: { balance: 0, health: 5 },
        outcome: {
          type: 'tradeoff',
          title: 'Couch gaming',
          message: 'You played games at home. Fun, but you missed the group hangout.',
          tip: 'Free alternatives exist, but social experiences have their own value!'
        }
      }
    ]
  }
]