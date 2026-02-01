// src/data/scenarios.js

export const scenarios = [
  // Week 1 - Regular choice
  {
    id: 1,
    type: 'choice',
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

  // Week 2 - VALUE PICKER
  {
    id: 2,
    type: 'value-picker',
    emoji: '🎒',
    title: 'Which Backpack Would You Buy?',
    description: 'You need a new backpack for school. Let\'s find the best deal!',
    products: [
      {
        id: 'cheap',
        name: 'Cheap Bag',
        emoji: '🎒',
        price: 5,
        quality: 1,
        durability: '3 months',
        features: 'No pockets',
        isBestValue: false
      },
      {
        id: 'good',
        name: 'Good Bag',
        emoji: '🎒',
        price: 15,
        quality: 3,
        durability: '2 years',
        features: '4 pockets',
        isBestValue: true
      },
      {
        id: 'fancy',
        name: 'Fancy Bag',
        emoji: '👜',
        price: 40,
        quality: 5,
        durability: '5 years',
        features: '10 pockets',
        isBestValue: false
      }
    ]
  },

  // Week 3 - Regular choice
  {
    id: 3,
    type: 'choice',
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
        effects: { balance: 0, health: -5 },
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

  // Week 4 - DEAL DETECTOR (Fake Deal)
  {
    id: 4,
    type: 'deal-detector',
    emoji: '🎸',
    productName: 'Cool Guitar',
    description: 'You see a guitar on sale at the music store!',
    originalPrice: 100,
    salePrice: 75,
    salePercent: 25,
    storeName: 'Music MegaStore',
    realPrice: 60,
    otherStoreName: 'Guitar Center',
    otherStoreNote: 'Everyday price',
    onlinePrice: 55,
    onlineNote: 'Free shipping',
    lesson: 'Stores often show a fake "original price" to make the sale look better. ALWAYS compare prices at other stores and online before buying!'
  },

  // Week 5 - Regular choice
  {
    id: 5,
    type: 'choice',
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

  // Week 6 - VALUE PICKER
  {
    id: 6,
    type: 'value-picker',
    emoji: '👟',
    title: 'Time for New Shoes!',
    description: 'Your old shoes have holes. Which ones should you get?',
    products: [
      {
        id: 'cheap',
        name: 'Bargain Shoes',
        emoji: '👟',
        price: 8,
        quality: 1,
        durability: '2 months',
        features: 'Basic design',
        isBestValue: false
      },
      {
        id: 'good',
        name: 'Quality Sneakers',
        emoji: '👟',
        price: 25,
        quality: 4,
        durability: '1 year',
        features: 'Comfy + durable',
        isBestValue: true
      },
      {
        id: 'fancy',
        name: 'Designer Kicks',
        emoji: '👠',
        price: 80,
        quality: 5,
        durability: '3 years',
        features: 'Super stylish',
        isBestValue: false
      }
    ]
  },

  // Week 7 - Regular choice
  {
    id: 7,
    type: 'choice',
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

  // Week 8 - DEAL DETECTOR (Fake Deal)
  {
    id: 8,
    type: 'deal-detector',
    emoji: '👟',
    productName: 'Trendy Sneakers',
    description: 'Shoe store has a big "CLEARANCE" sign!',
    originalPrice: 120,
    salePrice: 89,
    salePercent: 26,
    storeName: 'Foot Palace',
    realPrice: 75,
    otherStoreName: 'Shoe Warehouse',
    otherStoreNote: 'Same exact shoes',
    onlinePrice: 70,
    onlineNote: 'With code SAVE10',
    lesson: '"Clearance" and "Sale" signs are designed to make you buy quickly without thinking. Take your time and compare prices - you might find the same thing cheaper elsewhere!'
  },

  // Week 9 - Regular choice
  {
    id: 9,
    type: 'choice',
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

  // Week 10 - VALUE PICKER
  {
    id: 10,
    type: 'value-picker',
    emoji: '🎧',
    title: 'Pick Your Headphones!',
    description: 'You want to listen to music. Which headphones are the best buy?',
    products: [
      {
        id: 'cheap',
        name: 'Dollar Store',
        emoji: '🎧',
        price: 3,
        quality: 1,
        durability: '1 month',
        features: 'Breaks easily',
        isBestValue: false
      },
      {
        id: 'good',
        name: 'Mid-Range',
        emoji: '🎧',
        price: 20,
        quality: 3,
        durability: '2 years',
        features: 'Good sound',
        isBestValue: true
      },
      {
        id: 'fancy',
        name: 'Pro Audio',
        emoji: '🎧',
        price: 100,
        quality: 5,
        durability: '5 years',
        features: 'Amazing sound',
        isBestValue: false
      }
    ]
  },

  // Week 11 - Regular choice
  {
    id: 11,
    type: 'choice',
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

  // Week 12 - DEAL DETECTOR (Real Deal!)
  {
    id: 12,
    type: 'deal-detector',
    emoji: '🎮',
    productName: 'Video Game Controller',
    description: 'Game store is having a weekend sale!',
    originalPrice: 60,
    salePrice: 35,
    salePercent: 42,
    storeName: 'GameStop',
    realPrice: 50,
    otherStoreName: 'Target',
    otherStoreNote: 'Regular price',
    onlinePrice: 45,
    onlineNote: 'Amazon price',
    lesson: 'Sometimes sales ARE real deals! This sale price of $35 is genuinely cheaper than everywhere else. The key is to ALWAYS check before assuming!'
  },

  // Week 13 - Regular choice
  {
    id: 13,
    type: 'choice',
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

  // Week 14 - VALUE PICKER
  {
    id: 14,
    type: 'value-picker',
    emoji: '🔋',
    title: 'Phone Charger Needed!',
    description: 'Your phone charger broke. Time for a new one!',
    products: [
      {
        id: 'cheap',
        name: 'Gas Station Cable',
        emoji: '🔌',
        price: 3,
        quality: 1,
        durability: '1 month',
        features: 'Slow charging',
        isBestValue: false
      },
      {
        id: 'good',
        name: 'Brand Cable',
        emoji: '🔋',
        price: 15,
        quality: 4,
        durability: '2 years',
        features: 'Fast charging',
        isBestValue: true
      },
      {
        id: 'fancy',
        name: 'Premium Wireless',
        emoji: '⚡',
        price: 50,
        quality: 5,
        durability: '5 years',
        features: 'Wireless + fast',
        isBestValue: false
      }
    ]
  },

  // Week 15 - Regular choice
  {
    id: 15,
    type: 'choice',
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
  },

  // Week 16 - DEAL DETECTOR (Fake Deal)
  {
    id: 16,
    type: 'deal-detector',
    emoji: '📱',
    productName: 'Phone Case',
    description: 'The mall kiosk is having a "GOING OUT OF BUSINESS" sale!',
    originalPrice: 40,
    salePrice: 25,
    salePercent: 38,
    storeName: 'Mall Kiosk',
    realPrice: 15,
    otherStoreName: 'Amazon',
    otherStoreNote: 'Same case, Prime shipping',
    onlinePrice: 12,
    onlineNote: 'eBay seller',
    lesson: '"Going out of business" sales are often fake! Some stores run these "sales" for months or even years. Always check online prices first - you\'ll usually find it cheaper!'
  }
]