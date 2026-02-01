// src/data/scenariosTeen.js

export const scenariosTeen = [
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

  {
    id: 2,
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
          message: "You enjoyed watching others play. Sometimes that's just as fun!",
          tip: 'Watching gameplay helps you decide if a game is worth buying!'
        }
      }
    ]
  },

  {
    id: 3,
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

  {
    id: 4,
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

  {
    id: 5,
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

  {
    id: 6,
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
          tip: "$7 × 3 times a week = $84/month! That's $1,000 a year on boba!"
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
    id: 7,
    type: 'choice',
    emoji: '🎤',
    title: "CONCERT TICKETS",
    description: "Your favorite artist is coming to town! Tickets are selling fast.",
    prompt: "Tickets are $45. Your friend already bought theirs.",
    choices: [
      { 
        id: 'a',
        emoji: '🎉',
        text: "Buy the ticket! YOLO!", 
        cost: 45,
        effects: { balance: -45, health: 15 },
        outcome: {
          type: 'tradeoff',
          title: 'Amazing concert!',
          message: 'Best night ever! Worth every penny... but your savings took a hit.',
          tip: 'Live experiences create lasting memories. Budget for what matters to you!'
        }
      },
      { 
        id: 'b',
        emoji: '💰',
        text: "Skip it and save", 
        cost: 0,
        effects: { balance: 0, health: -5 },
        outcome: {
          type: 'negative',
          title: 'Saved money, but...',
          message: 'Smart choice for your savings, but you felt a bit left out.',
          tip: "It's okay to miss some events. There will be other concerts!"
        }
      },
      { 
        id: 'c',
        emoji: '🧹',
        text: "Earn the money with extra chores", 
        cost: 25,
        effects: { balance: -25, health: 10 },
        outcome: {
          type: 'positive',
          title: 'Hustle mode!',
          message: 'You earned part of it yourself and still had fun!',
          tip: 'Working for what you want makes it more rewarding!'
        }
      }
    ]
  },

  {
    id: 8,
    type: 'choice',
    emoji: '👟',
    title: "SNEAKER DROP",
    description: "Those limited edition sneakers you wanted just dropped! They're selling out fast.",
    prompt: "They're $120 but reselling for $200 already.",
    choices: [
      { 
        id: 'a',
        emoji: '😍',
        text: "Buy them to wear!", 
        cost: 120,
        effects: { balance: -120, health: 10 },
        outcome: {
          type: 'tradeoff',
          title: 'Fresh kicks!',
          message: 'You look awesome, but that was a big chunk of savings.',
          tip: 'Hype fades, but money gone is gone. Think before impulse buying!'
        }
      },
      { 
        id: 'b',
        emoji: '📈',
        text: "Buy and resell for profit", 
        cost: 0,
        effects: { balance: 80, health: 5 },
        outcome: {
          type: 'positive',
          title: 'Nice hustle!',
          message: "You made $80 profit. That's entrepreneurial thinking!",
          tip: 'Flipping items can be a real side hustle. Research before you invest!'
        }
      },
      { 
        id: 'c',
        emoji: '👋',
        text: "Pass on them", 
        cost: 0,
        effects: { balance: 0, health: -3 },
        outcome: {
          type: 'positive',
          title: 'Discipline!',
          message: "The hype will fade but your savings won't.",
          tip: 'FOMO is expensive. Most "must-haves" are forgotten in a month!'
        }
      }
    ]
  },

  {
    id: 9,
    type: 'choice',
    emoji: '📺',
    title: "STREAMING SERVICES",
    description: "You're paying for 3 streaming services totaling $33/month. That's a lot!",
    prompt: "Your friend offers to share their family plan for $5/month.",
    choices: [
      { 
        id: 'a',
        emoji: '🎬',
        text: "Keep all my subscriptions", 
        cost: 33,
        effects: { balance: -33, health: 5 },
        outcome: {
          type: 'tradeoff',
          title: 'All the content!',
          message: 'You have access to everything, but that adds up over time!',
          tip: '$33/month = $396/year! Could you really watch it all?'
        }
      },
      { 
        id: 'b',
        emoji: '🤝',
        text: "Switch to shared plan", 
        cost: 5,
        effects: { balance: -5, health: 3 },
        outcome: {
          type: 'positive',
          title: 'Smart!',
          message: 'You saved $28 this month and still have plenty to watch!',
          tip: 'Sharing subscriptions is totally normal. Everyone does it!'
        }
      },
      { 
        id: 'c',
        emoji: '📱',
        text: "Cancel all and use free options", 
        cost: 0,
        effects: { balance: 0, health: -5 },
        outcome: {
          type: 'tradeoff',
          title: 'Maximum savings!',
          message: 'You saved big, though you might miss some shows...',
          tip: 'YouTube and free tiers have tons of content. Try it for a month!'
        }
      }
    ]
  },

  {
    id: 10,
    type: 'choice',
    emoji: '🍽️',
    title: "GROUP DINNER",
    description: "Your friends want to go to a fancy restaurant for end-of-semester celebration.",
    prompt: "The bill will probably be around $35 per person.",
    choices: [
      { 
        id: 'a',
        emoji: '🥂',
        text: "Go and enjoy it!", 
        cost: 35,
        effects: { balance: -35, health: 12 },
        outcome: {
          type: 'tradeoff',
          title: 'Great memories!',
          message: "Great memories with friends! A bit pricey but sometimes that's okay.",
          tip: 'Special occasions deserve celebration. Just dont make every meal "special"!'
        }
      },
      { 
        id: 'b',
        emoji: '🍕',
        text: "Suggest a cheaper place", 
        cost: 15,
        effects: { balance: -15, health: 10 },
        outcome: {
          type: 'positive',
          title: 'Good compromise!',
          message: 'You still hung out and saved $20!',
          tip: "True friends don't care WHERE you hang out, just THAT you hang out!"
        }
      },
      { 
        id: 'c',
        emoji: '🏠',
        text: "Say you're busy", 
        cost: 0,
        effects: { balance: 0, health: -8 },
        outcome: {
          type: 'negative',
          title: 'Missed out...',
          message: 'Money saved, but you missed bonding time with friends.',
          tip: "Social connections matter. Find a balance that works for you!"
        }
      }
    ]
  },

  {
    id: 11,
    type: 'choice',
    emoji: '📱',
    title: "PHONE UPGRADE",
    description: "Your phone works fine but the new model just came out. It's so tempting!",
    prompt: "Parents will pay half if you pay $400.",
    choices: [
      { 
        id: 'a',
        emoji: '📸',
        text: "Upgrade now!", 
        cost: 400,
        effects: { balance: -400, health: 8 },
        outcome: {
          type: 'negative',
          title: 'Shiny new phone!',
          message: 'Cool phone! But that wiped out most of your savings...',
          tip: 'Phones are designed to make you want upgrades. Last years model works fine!'
        }
      },
      { 
        id: 'b',
        emoji: '🤔',
        text: "Wait for next year", 
        cost: 0,
        effects: { balance: 0, health: 0 },
        outcome: {
          type: 'positive',
          title: 'Patient choice!',
          message: 'Your current phone still works great!',
          tip: 'Phones lose value fast. Wait until yours actually needs replacing!'
        }
      },
      { 
        id: 'c',
        emoji: '♻️',
        text: "Get last year's model refurbished", 
        cost: 150,
        effects: { balance: -150, health: 5 },
        outcome: {
          type: 'positive',
          title: 'Smart upgrade!',
          message: 'Still an upgrade, but at a much better price!',
          tip: 'Refurbished phones are often 50% cheaper and work perfectly!'
        }
      }
    ]
  },

  {
    id: 12,
    type: 'choice',
    emoji: '💪',
    title: "GYM MEMBERSHIP",
    description: "A new gym opened nearby. It looks really nice and your friend joined.",
    prompt: "Membership is $30/month, or you could workout at home for free.",
    choices: [
      { 
        id: 'a',
        emoji: '🏋️',
        text: "Join the gym!", 
        cost: 30,
        effects: { balance: -30, health: 15 },
        outcome: {
          type: 'tradeoff',
          title: 'Gains incoming!',
          message: 'Great for your health! The investment is worth it IF you actually go!',
          tip: '$30/month = $360/year. Make sure youll use it at least 3x per week!'
        }
      },
      { 
        id: 'b',
        emoji: '🏠',
        text: "Workout at home", 
        cost: 0,
        effects: { balance: 0, health: 10 },
        outcome: {
          type: 'positive',
          title: 'Free fitness!',
          message: 'YouTube workouts are free and effective! Discipline is the real workout.',
          tip: 'You dont need a gym to get fit. Consistency beats equipment!'
        }
      },
      { 
        id: 'c',
        emoji: '🤔',
        text: "Try their free week first", 
        cost: 0,
        effects: { balance: 0, health: 5 },
        outcome: {
          type: 'positive',
          title: 'Smart!',
          message: 'Test it before committing your money.',
          tip: 'Always try before you buy! Most gyms offer free trials.'
        }
      }
    ]
  },

  {
    id: 13,
    type: 'choice',
    emoji: '🤝',
    title: "FRIEND NEEDS HELP",
    description: "Your close friend is short $25 for something important and asks to borrow money.",
    prompt: "They promise to pay you back next week.",
    choices: [
      { 
        id: 'a',
        emoji: '💝',
        text: "Lend them the money", 
        cost: 25,
        effects: { balance: -25, health: 8 },
        outcome: {
          type: 'tradeoff',
          title: 'Great friend!',
          message: "You're a great friend! Hopefully they pay you back.",
          tip: 'Only lend what you can afford to lose. Friendships > money.'
        }
      },
      { 
        id: 'b',
        emoji: '🤔',
        text: "Offer to lend half", 
        cost: 12,
        effects: { balance: -12, health: 5 },
        outcome: {
          type: 'positive',
          title: 'Good compromise!',
          message: 'Helpful but cautious. A good middle ground!',
          tip: 'Partial help is still help. Set boundaries while being kind.'
        }
      },
      { 
        id: 'c',
        emoji: '😅',
        text: "Explain you're saving for something", 
        cost: 0,
        effects: { balance: 0, health: -5 },
        outcome: {
          type: 'tradeoff',
          title: 'Boundaries set',
          message: "It's okay to say no. Your financial goals matter too.",
          tip: 'Real friends understand when you cant help financially.'
        }
      }
    ]
  },

  {
    id: 14,
    type: 'choice',
    emoji: '🍕',
    title: "FOOD DELIVERY",
    description: "It's late, you're hungry, and that delivery app is calling your name.",
    prompt: "Food at home exists but seems boring. Delivery would be $22.",
    choices: [
      { 
        id: 'a',
        emoji: '📱',
        text: "Treat yourself! Order it!", 
        cost: 22,
        effects: { balance: -22, health: 3 },
        outcome: {
          type: 'tradeoff',
          title: 'Delicious!',
          message: 'Yummy! But delivery fees and tips add up fast.',
          tip: '$22 for one meal! Delivery fees can be 30% of your order.'
        }
      },
      { 
        id: 'b',
        emoji: '🍳',
        text: "Make something at home", 
        cost: 0,
        effects: { balance: 0, health: 5 },
        outcome: {
          type: 'positive',
          title: 'Chef mode!',
          message: 'You saved money AND learned a life skill.',
          tip: 'Learning to cook is one of the best money-saving skills!'
        }
      },
      { 
        id: 'c',
        emoji: '🚶',
        text: "Order but pick it up yourself", 
        cost: 12,
        effects: { balance: -12, health: 3 },
        outcome: {
          type: 'positive',
          title: 'Good compromise!',
          message: 'Saved on delivery fees!',
          tip: 'Pickup saves $5-10 on every order. Worth the walk!'
        }
      }
    ]
  },

  {
    id: 15,
    type: 'choice',
    emoji: '☕',
    title: "COFFEE HABIT",
    description: "You've been buying coffee every morning before school. It's becoming a habit.",
    prompt: "$5 coffee × 5 days = $25/week. That's $100/month!",
    choices: [
      { 
        id: 'a',
        emoji: '☕',
        text: "Keep buying, I need it!", 
        cost: 25,
        effects: { balance: -25, health: 5 },
        outcome: {
          type: 'negative',
          title: 'Caffeine fix!',
          message: 'Tasty but expensive habit!',
          tip: '$100/month = $1,200/year on coffee. Thats a vacation!'
        }
      },
      { 
        id: 'b',
        emoji: '🏠',
        text: "Make coffee at home", 
        cost: 0,
        effects: { balance: 0, health: 5 },
        outcome: {
          type: 'positive',
          title: 'Barista mode!',
          message: 'Homemade coffee saves so much money!',
          tip: 'A $20 coffee maker pays for itself in 4 days!'
        }
      },
      { 
        id: 'c',
        emoji: '📅',
        text: "Only Fridays as a treat", 
        cost: 5,
        effects: { balance: -5, health: 5 },
        outcome: {
          type: 'positive',
          title: 'Smart balance!',
          message: 'You still get your treat but save $80/month!',
          tip: 'Making something a treat makes it more special AND cheaper!'
        }
      }
    ]
  },

  {
    id: 16,
    type: 'choice',
    emoji: '🎧',
    title: "BROKEN HEADPHONES",
    description: "Your headphones finally died. You need new ones for school.",
    prompt: "Basic earbuds $15, Nice headphones $40, Premium $120.",
    choices: [
      { 
        id: 'a',
        emoji: '💎',
        text: "Premium - treat yourself!", 
        cost: 120,
        effects: { balance: -120, health: 10 },
        outcome: {
          type: 'tradeoff',
          title: 'Amazing sound!',
          message: 'These sound incredible! But that was a lot of money...',
          tip: 'Premium doesnt always mean best value. Mid-range often hits the sweet spot!'
        }
      },
      { 
        id: 'b',
        emoji: '👍',
        text: "Nice headphones - good balance", 
        cost: 40,
        effects: { balance: -40, health: 5 },
        outcome: {
          type: 'positive',
          title: 'Good choice!',
          message: 'Good quality without breaking the bank!',
          tip: 'The middle option is often the best value!'
        }
      },
      { 
        id: 'c',
        emoji: '💰',
        text: "Basic earbuds - save money", 
        cost: 15,
        effects: { balance: -15, health: 0 },
        outcome: {
          type: 'tradeoff',
          title: 'Budget pick!',
          message: 'They work! Though they might not last as long.',
          tip: 'Sometimes cheap = replace often. Consider cost per year!'
        }
      }
    ]
  },

  {
    id: 17,
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
          tip: "Budgeting for fun is important. All saving and no play isn't healthy!"
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

  {
    id: 18,
    type: 'choice',
    emoji: '🎪',
    title: "SCHOOL CARNIVAL",
    description: "The school carnival is this weekend! All your friends are going.",
    prompt: "Entry is free but games/food usually cost $30-40 total.",
    choices: [
      { 
        id: 'a',
        emoji: '🎡',
        text: "Go all out! ($40)", 
        cost: 40,
        effects: { balance: -40, health: 15 },
        outcome: {
          type: 'tradeoff',
          title: 'Best carnival ever!',
          message: 'So much fun! You tried everything and won a prize!',
          tip: 'Set a budget BEFORE events and stick to it!'
        }
      },
      { 
        id: 'b',
        emoji: '🎯',
        text: "Set a $20 limit", 
        cost: 20,
        effects: { balance: -20, health: 12 },
        outcome: {
          type: 'positive',
          title: 'Smart fun!',
          message: 'You had a great time and stayed in budget!',
          tip: 'Having a limit makes you choose what REALLY matters to you!'
        }
      },
      { 
        id: 'c',
        emoji: '👀',
        text: "Just hang out, don't spend", 
        cost: 0,
        effects: { balance: 0, health: 5 },
        outcome: {
          type: 'tradeoff',
          title: 'Free fun!',
          message: 'You hung out with friends without spending. Social but frugal!',
          tip: 'You dont have to spend money to have fun with friends!'
        }
      }
    ]
  },

  {
    id: 19,
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
          tip: "Function over fashion saves money. Your phone doesn't care how it looks!"
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
    id: 20,
    type: 'choice',
    emoji: '💻',
    title: "ONLINE COURSE",
    description: "There's an online course that could help you learn video editing. It costs $50.",
    prompt: "It could help you start a side hustle...",
    choices: [
      { 
        id: 'a',
        emoji: '🎓',
        text: "Invest in myself!", 
        cost: 50,
        effects: { balance: -50, health: 5 },
        outcome: {
          type: 'positive',
          title: 'Level up!',
          message: 'Great investment! Skills can lead to more earning potential later.',
          tip: 'Education that leads to income is always worth it!'
        }
      },
      { 
        id: 'b',
        emoji: '📚',
        text: "Find free resources instead", 
        cost: 0,
        effects: { balance: 0, health: 3 },
        outcome: {
          type: 'positive',
          title: 'Resourceful!',
          message: 'Free learning is everywhere if you look!',
          tip: 'YouTube tutorials and free courses can teach you almost anything!'
        }
      },
      { 
        id: 'c',
        emoji: '🏷️',
        text: "Wait for a sale", 
        cost: 0,
        effects: { balance: 0, health: 0 },
        outcome: {
          type: 'positive',
          title: 'Patient shopper!',
          message: 'Many courses go on sale regularly.',
          tip: 'Sign up for email lists - courses often go 50-90% off!'
        }
      }
    ]
  }
]