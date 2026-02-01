// src/stores/gameState.js
import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { badges } from '@/data/badges'

// ============================================
// LEVELS - Harder to reach
// ============================================

export const levels = [
  {
    id: 1,
    name: 'Backyard Beginner',
    icon: '🏡',
    description: 'Learning the basics at home!',
    requiredWeeks: 0,
    requiredSavings: 0,
    unlocks: ['Home', 'Backyard'],
    color: '#4ECDC4'
  },
  {
    id: 2,
    name: 'Neighborhood Explorer',
    icon: '🏘️',
    description: 'Exploring your neighborhood!',
    requiredWeeks: 6,
    requiredSavings: 15,
    unlocks: ['Park', 'Friend\'s House'],
    color: '#667eea'
  },
  {
    id: 3,
    name: 'Town Adventurer',
    icon: '🏙️',
    description: 'Discovering the town!',
    requiredWeeks: 12,
    requiredSavings: 40,
    unlocks: ['Mall', 'Arcade', 'Pet Store'],
    color: '#FF6B9D'
  },
  {
    id: 4,
    name: 'Money Master',
    icon: '🌟',
    description: 'You\'re a financial superstar!',
    requiredWeeks: 20,
    requiredSavings: 100,
    unlocks: ['Bank', 'Investment Club'],
    color: '#FFD93D'
  }
]

// ============================================
// SKILLS
// ============================================

export const skillDefinitions = {
  patience: { name: 'Patience', icon: '⏰', color: '#667eea', description: 'Waiting for good things!' },
  planning: { name: 'Planning', icon: '📋', color: '#4ECDC4', description: 'Thinking ahead!' },
  responsibility: { name: 'Responsibility', icon: '⭐', color: '#FF6B9D', description: 'Being dependable!' },
  generosity: { name: 'Generosity', icon: '💝', color: '#FFD93D', description: 'Sharing with others!' }
}

// ============================================
// NPC CHARACTERS
// ============================================

export const npcs = {
  bestFriend: {
    id: 'bestFriend',
    name: 'Alex',
    emoji: '👧',
    relationship: 50,
    description: 'Your best friend from school'
  },
  neighbor: {
    id: 'neighbor',
    name: 'Mr. Johnson',
    emoji: '👴',
    relationship: 50,
    description: 'The friendly neighbor who offers odd jobs'
  },
  shopkeeper: {
    id: 'shopkeeper',
    name: 'Mrs. Chen',
    emoji: '👩‍🦰',
    relationship: 50,
    description: 'Runs the corner store'
  },
  petShelter: {
    id: 'petShelter',
    name: 'Pet Shelter',
    emoji: '🐕',
    relationship: 50,
    description: 'Local animal shelter that needs help'
  }
}

// ============================================
// MAIN GAME STATE
// ============================================

export const gameState = reactive({
  // ============================================
  // BASIC STATS
  // ============================================
  balance: 0,
  week: 1,
  health: 50,
  goal: 100,
  weeklyIncome: 5,
  ageGroup: 'kids',
  
  // ============================================
  // FINANCIAL TRACKING
  // ============================================
  totalSaved: 0,
  totalSpent: 0,
  totalEarned: 0,
  savingChoices: 0,
  spendingChoices: 0,
  
  // ============================================
  // DEBT & CONSEQUENCES
  // ============================================
  inDebt: false,
  debtAmount: 0,
  badChoicesStreak: 0,
  goodChoicesStreak: 0,
  
  // ============================================
  // HAPPINESS TRACKING
  // ============================================
  highHappinessStreak: 0,
  stableHappinessStreak: 0,
  peakHappiness: 50,
  lowestHappiness: 50,
  happinessRecoveries: 0,
  wasLowHappiness: false,
  missedOpportunities: [],
  
  // ============================================
  // SKILLS
  // ============================================
  skills: {
    patience: 10,
    planning: 10,
    responsibility: 10,
    generosity: 10
  },
  
  // ============================================
  // NPC RELATIONSHIPS
  // ============================================
  npcRelationships: {
    bestFriend: 50,
    neighbor: 50,
    shopkeeper: 50,
    petShelter: 50
  },
  
  // ============================================
  // LOCKED CONTENT
  // ============================================
  lockedItems: [],
  unlockedMissions: [],
  lockedMissions: ['help_friend', 'pet_shelter_volunteer', 'neighborhood_sale'],
  
  // ============================================
  // STORY TRACKING
  // ============================================
  storyFlags: {
    helpedFriendBefore: false,
    donatedToShelter: false,
    earnedExtraMoney: false,
    boughtImpulsively: false,
    missedFriendEvent: false,
    learnedBudgeting: false
  },
  
  // ============================================
  // NEEDS VS WANTS
  // ============================================
  needsPurchased: 0,
  wantsPurchased: 0,
  
  // ============================================
  // LEVEL & PROGRESSION
  // ============================================
  currentLevel: 1,
  unlockedLocations: ['Home', 'Backyard'],
  
  // ============================================
  // CHALLENGES
  // ============================================
  challengesCompleted: 0,
  correctAnswers: 0,
  shopQuizzesCompleted: 0,
  shopQuizzesCorrect: 0,
  
  // ============================================
  // BADGES
  // ============================================
  badges: badges.map(b => ({ ...b })),
  
  // ============================================
  // POPUP STATES
  // ============================================
  currentChallenge: null,
  showChallenge: false,
  showShopQuiz: false,
  currentShopQuiz: null,
  showLevelUp: false,
  newLevel: null,
  showConsequence: false,
  currentConsequence: null,
  showPennyHelp: false,
  pennySituation: null,
  
  // ============================================
  // CHARACTER & GOAL
  // ============================================
  selectedCharacter: null,
  selectedGoal: null,
  
  // ============================================
  // TEEN-SPECIFIC FINANCIAL STATE
  // ============================================
  emergencyFund: 50,
  emergencyFundUsed: 0,
  emergencyFundWarningShown: false,
  creditCardDebt: 0,
  creditCardInterestRate: 0.18,
  creditCardMinPayment: 5,
  creditCardUsageCount: 0,
  missedPayments: 0,
  creditScore: 700,
  investmentPortfolio: 0,
  investmentReturns: 0,
  investmentRisk: 'low',
  teenBadDecisions: [],
  teenGoodDecisions: [],
  
  // ============================================
  // GETTERS
  // ============================================
  
  get progressPercent() {
    return Math.min(100, Math.max(0, Math.round((this.balance / this.goal) * 100)))
  },
  
  get canAfford() {
    return (amount) => this.balance >= amount
  },
  
  get isInDebt() {
    return this.balance < 0
  },
  
  get canProgressLevel() {
    if (this.balance < 0) return false
    const nextLevel = levels.find(l => l.id === this.currentLevel + 1)
    if (!nextLevel) return false
    return this.week >= nextLevel.requiredWeeks && 
           this.balance >= nextLevel.requiredSavings
  },
  
  get currentLevelData() {
    return levels.find(l => l.id === this.currentLevel) || levels[0]
  },
  
  // ============================================
  // METHODS
  // ============================================
  
  initializeGame(character, goal) {
    this.reset()
    this.selectedCharacter = character
    this.selectedGoal = goal
    this.goal = goal.cost
    
    if (character === 'helper') {
      this.weeklyIncome = 6
      this.skills.responsibility = 15
    } else if (character === 'saver') {
      this.weeklyIncome = 4
      this.skills.patience = 15
    } else if (character === 'part-timer') {
      this.weeklyIncome = 50
      this.skills.patience = 15
    } else if (character === 'freelancer') {
      this.weeklyIncome = 40
      this.skills.patience = 15
    }
    
    this.balance = this.weeklyIncome
    this.totalEarned = this.weeklyIncome
  },
  
  canSpend(amount) {
    return this.balance >= amount
  },
  
  spend(amount, isNeed = false) {
    if (amount > this.balance) {
      return {
        success: false,
        reason: 'not_enough_money',
        message: "You don't have enough money for this!"
      }
    }
    
    this.balance -= amount
    this.totalSpent += amount
    this.spendingChoices++
    
    if (isNeed) {
      this.needsPurchased++
    } else {
      this.wantsPurchased++
    }
    
    return { success: true }
  },
  
  earn(amount, source = 'allowance') {
    this.balance += amount
    this.totalEarned += amount
    this.totalSaved += amount
    this.savingChoices++
    
    if (source === 'chore' || source === 'job') {
      this.addSkill('responsibility', 3)
      this.storyFlags.earnedExtraMoney = true
    }
    
    return { success: true }
  },
  
  updateHappinessTracking() {
    if (this.health > this.peakHappiness) {
      this.peakHappiness = this.health
    }
    if (this.health < this.lowestHappiness) {
      this.lowestHappiness = this.health
    }
    
    if (this.health < 30) {
      this.wasLowHappiness = true
    }
    if (this.wasLowHappiness && this.health >= 70) {
      this.happinessRecoveries++
      this.wasLowHappiness = false
    }
  },
  
  updateWeeklyHappinessStreaks() {
    if (this.health >= 70) {
      this.highHappinessStreak++
    } else {
      this.highHappinessStreak = 0
    }
    
    if (this.health >= 40) {
      this.stableHappinessStreak++
    } else {
      this.stableHappinessStreak = 0
    }
  },
  
  save() {
    this.savingChoices++
    this.goodChoicesStreak++
    this.badChoicesStreak = 0
    this.addSkill('patience', 2)
    this.addSkill('planning', 1)
  },
  
  makeBadChoice() {
    this.badChoicesStreak++
    this.goodChoicesStreak = 0
    
    if (this.badChoicesStreak >= 3) {
      return this.triggerConsequence()
    }
    
    return null
  },
  
  triggerConsequence() {
    const consequences = [
      {
        id: 'missed_friend_party',
        title: "Uh Oh! You Can't Go!",
        message: "Your friend Alex is having a birthday party, but you spent all your money and can't afford a gift. You have to miss the party.",
        effect: () => {
          this.npcRelationships.bestFriend -= 15
          this.storyFlags.missedFriendEvent = true
          this.health -= 10
        },
        lesson: "When we spend all our money on wants, we might miss out on important things with friends."
      },
      {
        id: 'cant_help_shelter',
        title: "The Shelter Needed Help",
        message: "The pet shelter asked for donations to help sick puppies, but you don't have any money to give.",
        effect: () => {
          this.npcRelationships.petShelter -= 10
          this.lockedMissions.push('pet_shelter_volunteer')
        },
        lesson: "Saving money lets us help others when they need it."
      },
      {
        id: 'item_sold_out',
        title: "Oh No! It's Gone!",
        message: `The ${this.selectedGoal?.name || 'item'} you wanted went on sale, but you didn't have enough saved. Now it's sold out!`,
        effect: () => {
          this.missedOpportunities.push(this.selectedGoal?.name)
          this.goal = Math.round(this.goal * 1.2)
        },
        lesson: "When we don't save, we miss good deals. The things we want might cost more later!"
      },
      {
        id: 'no_emergency_fund',
        title: "Emergency! No Money!",
        message: "Your bike tire popped and you need $8 to fix it. But you spent all your money! Now you have to walk everywhere.",
        effect: () => {
          this.health -= 15
          this.addSkill('planning', -5)
        },
        lesson: "It's smart to keep some money saved for emergencies - unexpected things that happen!"
      }
    ]
    
    const consequence = consequences[Math.floor(Math.random() * consequences.length)]
    this.currentConsequence = consequence
    this.showConsequence = true
    this.badChoicesStreak = 0
    
    return consequence
  },
  
  applyConsequence() {
    if (this.currentConsequence?.effect) {
      this.currentConsequence.effect()
    }
    this.showConsequence = false
    this.currentConsequence = null
  },
  
  checkPennyHelp() {
    if (this.balance < 0) {
      this.pennySituation = 'debt'
      this.showPennyHelp = true
      return true
    }
    
    if (this.balance < this.weeklyIncome && this.week > 3) {
      this.pennySituation = 'low_balance'
      this.showPennyHelp = true
      return true
    }
    
    if (this.spendingChoices > this.savingChoices * 2 && this.week > 2) {
      this.pennySituation = 'spending_spree'
      this.showPennyHelp = true
      return true
    }
    
    if (this.health < 25) {
      this.pennySituation = 'low_happiness'
      this.showPennyHelp = true
      return true
    }
    
    if (this.badChoicesStreak >= 2) {
      this.pennySituation = 'struggling'
      this.showPennyHelp = true
      return true
    }
    
    return false
  },
  
  dismissPennyHelp() {
    this.showPennyHelp = false
    this.pennySituation = null
  },
  
  changeRelationship(npcId, amount) {
    if (this.npcRelationships[npcId] !== undefined) {
      this.npcRelationships[npcId] = Math.max(0, Math.min(100, this.npcRelationships[npcId] + amount))
    }
    this.updateMissionAvailability()
  },
  
  updateMissionAvailability() {
    if (this.npcRelationships.bestFriend >= 60 && !this.storyFlags.missedFriendEvent) {
      const index = this.lockedMissions.indexOf('help_friend')
      if (index > -1) {
        this.lockedMissions.splice(index, 1)
        this.unlockedMissions.push('help_friend')
      }
    }
    
    if (this.npcRelationships.petShelter >= 50 && this.balance >= 10) {
      const index = this.lockedMissions.indexOf('pet_shelter_volunteer')
      if (index > -1) {
        this.lockedMissions.splice(index, 1)
        this.unlockedMissions.push('pet_shelter_volunteer')
      }
    }
  },
  
  lockItem(itemName, reason) {
    if (!this.lockedItems.find(i => i.name === itemName)) {
      this.lockedItems.push({ name: itemName, reason, week: this.week })
    }
  },
  
  isItemLocked(itemName) {
    return this.lockedItems.some(i => i.name === itemName)
  },
  
  addSkill(skillName, amount) {
    if (this.skills[skillName] !== undefined) {
      this.skills[skillName] = Math.min(100, Math.max(0, this.skills[skillName] + amount))
    }
  },
  
  checkLevelUp() {
    if (this.balance < 0) {
      return false
    }
    
    for (let i = levels.length - 1; i >= 0; i--) {
      const level = levels[i]
      if (this.week >= level.requiredWeeks && 
          this.balance >= level.requiredSavings &&
          this.currentLevel < level.id) {
        
        this.currentLevel = level.id
        this.newLevel = level
        this.showLevelUp = true
        
        level.unlocks.forEach(loc => {
          if (!this.unlockedLocations.includes(loc)) {
            this.unlockedLocations.push(loc)
          }
        })
        
        this.balance += 3
        this.addSkill('planning', 5)
        
        return true
      }
    }
    return false
  },
  
  dismissLevelUp() {
    this.showLevelUp = false
    this.newLevel = null
  },
  
  maybeShowChallenge() {
    if (this.week > 1 && this.week % 4 === 0 && !this.showShopQuiz) {
      this.currentChallenge = getRandomChallenge()
      this.showChallenge = true
      return true
    }
    return false
  },
  
  completeChallenge(wasCorrect) {
    this.challengesCompleted++
    if (wasCorrect) {
      this.correctAnswers++
      if (this.currentChallenge?.reward) {
        this.earn(this.currentChallenge.reward, 'quiz')
      }
      this.addSkill('planning', 3)
    }
    this.showChallenge = false
    this.currentChallenge = null
  },
  
  maybeShowShopQuiz() {
    if (this.week > 1 && this.week % 5 === 0) {
      this.currentShopQuiz = getRandomShopQuiz()
      this.showShopQuiz = true
      return true
    }
    return false
  },
  
  completeShopQuiz(wasCorrect, savedAmount = 0) {
    this.shopQuizzesCompleted++
    if (wasCorrect) {
      this.shopQuizzesCorrect++
      if (savedAmount > 0) {
        this.earn(savedAmount, 'smart_shopping')
      }
      this.addSkill('planning', 5)
      this.addSkill('patience', 3)
    }
    this.showShopQuiz = false
    this.currentShopQuiz = null
  },
  
  checkBadges() {
    const newlyUnlocked = []
    this.badges.forEach(badge => {
      if (badge.unlocked) return
      let shouldUnlock = false
      
      switch (badge.id) {
        case 'first_save': shouldUnlock = this.savingChoices >= 1; break
        case 'quiz_master': shouldUnlock = this.correctAnswers >= 3; break
        case 'goal_reached': shouldUnlock = this.balance >= this.goal; break
        case 'week_5': shouldUnlock = this.week >= 5; break
        case 'balanced': shouldUnlock = this.health >= 50 && this.savingChoices >= 3; break
        case 'big_saver': shouldUnlock = this.totalSaved >= 30; break
        case 'shop_smart': shouldUnlock = this.shopQuizzesCorrect >= 2; break
        case 'skill_master': shouldUnlock = Object.values(this.skills).some(s => s >= 50); break
        case 'level_up': shouldUnlock = this.currentLevel >= 2; break
        case 'generous': shouldUnlock = this.storyFlags.donatedToShelter; break
        case 'good_friend': shouldUnlock = this.npcRelationships.bestFriend >= 80; break
        case 'no_debt': shouldUnlock = this.week >= 8 && this.balance >= 0 && !this.inDebt; break
        case 'joy_keeper': shouldUnlock = this.highHappinessStreak >= 3; break
        case 'resilient_spirit': shouldUnlock = this.happinessRecoveries >= 1; break
        case 'happy_saver': shouldUnlock = this.balance >= (this.goal * 0.5) && this.health >= 60; break
        case 'wellness_warrior': shouldUnlock = this.stableHappinessStreak >= 8; break
        case 'mood_master': shouldUnlock = this.happinessRecoveries >= 3; break
        case 'thriving': shouldUnlock = this.health >= 80 && this.highHappinessStreak >= 1; break
      }
      
      if (shouldUnlock) {
        badge.unlocked = true
        newlyUnlocked.push(badge)
        
        if (badge.skillKey === 'all') {
          Object.keys(this.skills).forEach(skill => {
            this.addSkill(skill, badge.skillAmount || 5)
          })
        } else if (badge.skillKey) {
          this.addSkill(badge.skillKey, badge.skillAmount || 5)
        }
      }
    })
    return newlyUnlocked
  },
  
  // ============================================
  // TEEN METHODS
  // ============================================
  
  useEmergencyFund(amount) {
    if (amount > this.emergencyFund) {
      return { 
        success: false, 
        reason: 'insufficient_funds',
        message: `You only have $${this.emergencyFund} in your emergency fund!`
      }
    }
    
    this.emergencyFund -= amount
    this.emergencyFundUsed += amount
    this.balance += amount
    
    this.teenBadDecisions.push({
      type: 'emergency_fund_used',
      amount: amount,
      week: this.week,
      remainingFund: this.emergencyFund
    })
    
    this.addSkill('responsibility', -3)
    this.addSkill('planning', -2)
    
    return { 
      success: true, 
      remaining: this.emergencyFund,
      message: `Used $${amount} from emergency fund. $${this.emergencyFund} remaining.`
    }
  },
  
  useCreditCard(amount) {
    this.creditCardDebt += amount
    this.creditCardUsageCount++
    this.balance += amount
    
    this.teenBadDecisions.push({
      type: 'credit_card_used',
      amount: amount,
      week: this.week,
      totalDebt: this.creditCardDebt
    })
    
    if (this.creditCardDebt > 100) {
      this.creditScore = Math.max(300, this.creditScore - 10)
    }
    
    this.addSkill('planning', -3)
    this.addSkill('patience', -2)
    
    return { 
      success: true, 
      newDebt: this.creditCardDebt,
      message: `Charged $${amount} to credit card. Total debt: $${this.creditCardDebt}`
    }
  },
  
  applyCreditCardInterest() {
    if (this.creditCardDebt > 0) {
      const monthlyRate = this.creditCardInterestRate / 12
      const weeklyRate = monthlyRate / 4
      const interest = Math.round(this.creditCardDebt * weeklyRate * 100) / 100
      this.creditCardDebt += interest
      this.creditCardDebt = Math.round(this.creditCardDebt * 100) / 100
      return interest
    }
    return 0
  },
  
  makeCreditCardPayment(amount) {
    const payment = Math.min(amount, this.creditCardDebt)
    this.creditCardDebt -= payment
    this.balance -= payment
    
    if (payment >= this.creditCardMinPayment) {
      this.creditScore = Math.min(850, this.creditScore + 5)
      this.missedPayments = 0
    }
    
    return { success: true, paid: payment, remaining: this.creditCardDebt }
  },
  
  checkMissedPayment() {
    if (this.creditCardDebt > 0 && this.balance < this.creditCardMinPayment) {
      this.missedPayments++
      this.creditScore = Math.max(300, this.creditScore - 20)
      return true
    }
    return false
  },
  
  triggerEmergencyEvent() {
    const emergencies = [
      { name: 'Phone screen cracked', cost: 30 },
      { name: 'Lost bus pass - need new one', cost: 15 },
      { name: 'School project supplies needed', cost: 20 },
      { name: 'Friend needs help with emergency', cost: 25 },
      { name: 'Bike repair needed', cost: 18 }
    ]
    
    const emergency = emergencies[Math.floor(Math.random() * emergencies.length)]
    
    if (this.emergencyFund >= emergency.cost) {
      return { 
        canHandle: true, 
        emergency,
        message: `Good thing you have your emergency fund! You can cover this.`
      }
    } else {
      return { 
        canHandle: false, 
        emergency,
        shortfall: emergency.cost - this.emergencyFund,
        message: `Uh oh! You don't have enough in your emergency fund. You'll need to use your credit card or miss out.`
      }
    }
  },
  
  // ============================================
  // RESET METHODS
  // ============================================
  
  resetTeenState() {
    this.emergencyFund = 50
    this.emergencyFundUsed = 0
    this.emergencyFundWarningShown = false
    this.creditCardDebt = 0
    this.creditCardUsageCount = 0
    this.missedPayments = 0
    this.creditScore = 700
    this.teenBadDecisions = []
    this.teenGoodDecisions = []
  },
  
  reset() {
    this.balance = 0
    this.week = 1
    this.health = 50
    this.goal = 100
    this.weeklyIncome = 5
    this.totalSaved = 0
    this.totalSpent = 0
    this.totalEarned = 0
    this.savingChoices = 0
    this.spendingChoices = 0
    this.inDebt = false
    this.debtAmount = 0
    this.badChoicesStreak = 0
    this.goodChoicesStreak = 0
    this.highHappinessStreak = 0
    this.stableHappinessStreak = 0
    this.peakHappiness = 50
    this.lowestHappiness = 50
    this.happinessRecoveries = 0
    this.wasLowHappiness = false
    this.missedOpportunities = []
    this.skills = { patience: 10, planning: 10, responsibility: 10, generosity: 10 }
    this.npcRelationships = { bestFriend: 50, neighbor: 50, shopkeeper: 50, petShelter: 50 }
    this.lockedItems = []
    this.unlockedMissions = []
    this.lockedMissions = ['help_friend', 'pet_shelter_volunteer', 'neighborhood_sale']
    this.storyFlags = {
      helpedFriendBefore: false,
      donatedToShelter: false,
      earnedExtraMoney: false,
      boughtImpulsively: false,
      missedFriendEvent: false,
      learnedBudgeting: false
    }
    this.needsPurchased = 0
    this.wantsPurchased = 0
    this.currentLevel = 1
    this.unlockedLocations = ['Home', 'Backyard']
    this.challengesCompleted = 0
    this.correctAnswers = 0
    this.shopQuizzesCompleted = 0
    this.shopQuizzesCorrect = 0
    this.badges = badges.map(b => ({ ...b, unlocked: false }))
    this.currentChallenge = null
    this.showChallenge = false
    this.showShopQuiz = false
    this.currentShopQuiz = null
    this.showLevelUp = false
    this.newLevel = null
    this.showConsequence = false
    this.currentConsequence = null
    this.showPennyHelp = false
    this.pennySituation = null
    this.selectedCharacter = null
    this.selectedGoal = null
    
    // Reset teen state
    this.resetTeenState()
  }
})

// ============================================
// CHALLENGE DATA
// ============================================

const challenges = [
  {
    id: 1,
    question: "You have $10. A toy costs $8 and lunch costs $5. What should you buy?",
    emoji: "🤔",
    options: [
      { id: 'a', text: 'The toy - it looks fun!', correct: false },
      { id: 'b', text: 'Lunch - I need to eat!', correct: true },
      { id: 'c', text: 'Both - I\'ll figure it out', correct: false }
    ],
    explanation: 'Needs (like food) always come before wants (like toys). You need $5 for lunch, which leaves $5 to save!',
    reward: 2
  },
  {
    id: 2,
    question: "What's the difference between a NEED and a WANT?",
    emoji: "🎯",
    options: [
      { id: 'a', text: 'Needs are boring, wants are fun', correct: false },
      { id: 'b', text: 'Needs keep us alive and safe, wants make us happy but we can wait', correct: true },
      { id: 'c', text: 'They\'re the same thing', correct: false }
    ],
    explanation: 'Needs are things we must have (food, clothes, shelter). Wants are nice to have but we can live without them!',
    reward: 2
  },
  {
    id: 3,
    question: "You get $5 allowance. Your friend wants you to buy candy ($3). What's smart?",
    emoji: "🍬",
    options: [
      { id: 'a', text: 'Buy candy to make my friend happy', correct: false },
      { id: 'b', text: 'Save my money - real friends don\'t need gifts every time', correct: true },
      { id: 'c', text: 'Borrow money from someone else', correct: false }
    ],
    explanation: 'Good friends don\'t expect you to spend money on them. It\'s okay to say no!',
    reward: 2
  },
  {
    id: 4,
    question: "You saved $20 for a game ($25). It goes on sale for $15! What do you do?",
    emoji: "🎮",
    options: [
      { id: 'a', text: 'Buy it now and save $5!', correct: true },
      { id: 'b', text: 'Wait for it to be free', correct: false },
      { id: 'c', text: 'Buy two since it\'s cheap', correct: false }
    ],
    explanation: 'Waiting for sales is smart! You saved up AND got a deal. The extra $5 stays in your savings!',
    reward: 3
  },
  {
    id: 5,
    question: "What happens if you spend ALL your money every week?",
    emoji: "💸",
    options: [
      { id: 'a', text: 'Nothing bad - I\'ll get more next week', correct: false },
      { id: 'b', text: 'I won\'t have money for emergencies or bigger goals', correct: true },
      { id: 'c', text: 'I\'ll be the happiest!', correct: false }
    ],
    explanation: 'If you spend everything, you can\'t save for big things or handle surprises. Always save some!',
    reward: 2
  }
]

export const getRandomChallenge = () => {
  return challenges[Math.floor(Math.random() * challenges.length)]
}

// ============================================
// SHOP QUIZ DATA
// ============================================

const shopQuizzes = [
  {
    id: 1,
    title: '🛒 Needs vs Wants!',
    scenario: 'You have $10. Which should you buy?',
    options: [
      { id: 'a', name: 'New notebook for school', price: 4, quality: 'You need this for homework!', isBest: true, isNeed: true },
      { id: 'b', name: 'Candy bar', price: 2, quality: 'Yummy but not necessary', isBest: false, isNeed: false },
      { id: 'c', name: 'Stickers', price: 5, quality: 'Fun but you don\'t need them', isBest: false, isNeed: false }
    ],
    correctId: 'a',
    savings: 3,
    tip: 'Needs come first! Buy what you NEED, then think about wants.'
  },
  {
    id: 2,
    title: '⏰ Wait or Buy Now?',
    scenario: 'A game costs $30 now or $20 next month. You have $25.',
    options: [
      { id: 'a', name: 'Buy now for $30', price: 30, quality: 'Can\'t afford it anyway!', isBest: false, isNeed: false },
      { id: 'b', name: 'Wait and save $10!', price: 20, quality: 'Smart! Save money AND get the game!', isBest: true, isNeed: false },
      { id: 'c', name: 'Borrow $5 from a friend', price: 30, quality: 'Now you owe someone!', isBest: false, isNeed: false }
    ],
    correctId: 'b',
    savings: 10,
    tip: 'Patience pays! Waiting for sales or saving up is ALWAYS better than borrowing.'
  },
  {
    id: 3,
    title: '🎁 Help a Friend?',
    scenario: 'Your friend\'s birthday is coming. You have $8 saved for your goal.',
    options: [
      { id: 'a', name: 'Expensive gift ($10)', price: 10, quality: 'You don\'t have enough!', isBest: false, isNeed: false },
      { id: 'b', name: 'Homemade card + small gift ($3)', price: 3, quality: 'Thoughtful AND affordable!', isBest: true, isNeed: false },
      { id: 'c', name: 'Skip the birthday', price: 0, quality: 'That\'s not very nice...', isBest: false, isNeed: false }
    ],
    correctId: 'b',
    savings: 5,
    tip: 'Thoughtful gifts don\'t have to be expensive! Homemade things show you care.'
  }
]

export const getRandomShopQuiz = () => {
  return shopQuizzes[Math.floor(Math.random() * shopQuizzes.length)]
}

// ============================================
// PINIA STORE
// ============================================

export const useGameStore = defineStore('game', {
  state: () => ({
    balance: 0,
    week: 1,
    level: 1,
    health: 50,
    goal: 100,
    weeklyIncome: 5,
    ageGroup: 'kids',
    totalSaved: 0,
    totalSpent: 0,
    savingChoices: 0,
    spendingChoices: 0,
    selectedCharacter: null,
    selectedGoal: null,
  }),
  
  actions: {
    initializeGame(character, goal) {
      this.reset()
      this.selectedCharacter = character
      this.selectedGoal = goal
      this.goal = goal.cost
      
      if (character === 'helper') {
        this.weeklyIncome = 6
      } else if (character === 'saver') {
        this.weeklyIncome = 4
      } else if (character === 'part-timer') {
        this.weeklyIncome = 50
      } else if (character === 'freelancer') {
        this.weeklyIncome = 40
      }

      
      this.balance = this.weeklyIncome
      gameState.initializeGame(character, goal)
    },
    
    reset() {
      this.balance = 0
      this.week = 1
      this.level = 1
      this.health = 50
      this.goal = 100
      this.weeklyIncome = 50
      this.totalSaved = 0
      this.totalSpent = 0
      this.savingChoices = 0
      this.spendingChoices = 0
      this.selectedCharacter = null
      this.selectedGoal = null
    }
  }
})