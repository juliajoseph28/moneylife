// src/stores/gameState.js
import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { getRandomChallenge } from '@/data/challenges'
import { badges } from '@/data/badges'

// ============================================
// LEVELS & PROGRESSION SYSTEM
// ============================================

export const levels = [
  {
    id: 1,
    name: 'Backyard Beginner',
    icon: '🏡',
    description: 'Learning the basics at home!',
    requiredWeeks: 0,
    unlocks: ['Home', 'Backyard'],
    color: '#4ECDC4'
  },
  {
    id: 2,
    name: 'Neighborhood Explorer',
    icon: '🏘️',
    description: 'Exploring your neighborhood!',
    requiredWeeks: 4,
    unlocks: ['Park', 'Friend\'s House'],
    color: '#6C63FF'
  },
  {
    id: 3,
    name: 'Town Adventurer',
    icon: '🏙️',
    description: 'Discovering the town!',
    requiredWeeks: 8,
    unlocks: ['Mall', 'Arcade', 'Pet Store'],
    color: '#FF6B9D'
  },
  {
    id: 4,
    name: 'Money Master',
    icon: '🌟',
    description: 'You\'re a financial superstar!',
    requiredWeeks: 12,
    unlocks: ['Bank', 'Investment Club'],
    color: '#FFD93D'
  }
]

// ============================================
// SKILLS SYSTEM
// ============================================

export const skillDefinitions = {
  patience: {
    name: 'Patience',
    icon: '⏰',
    color: '#6C63FF',
    description: 'Waiting for good things!'
  },
  planning: {
    name: 'Planning',
    icon: '📋',
    color: '#4ECDC4',
    description: 'Thinking ahead!'
  },
  responsibility: {
    name: 'Responsibility',
    icon: '⭐',
    color: '#FF6B9D',
    description: 'Being dependable!'
  },
  generosity: {
    name: 'Generosity',
    icon: '💝',
    color: '#FFD93D',
    description: 'Sharing with others!'
  }
}

// ============================================
// MAIN GAME STATE
// ============================================

export const gameState = reactive({
  // Basic stats
  balance: 50,
  week: 1,
  health: 50,
  goal: 100,
  weeklyIncome: 10,
  ageGroup: 'kids',
  totalSaved: 0,
  totalSpent: 0,
  savingChoices: 0,
  spendingChoices: 0,
// Add to the gameState reactive object:
  generousChoices: 0,
  thoughtfulSpending: 0,

  // Skills (0-100 each)
  skills: {
    patience: 20,
    planning: 20,
    responsibility: 20,
    generosity: 20
  },
  
  // Level & Progression
  currentLevel: 1,
  unlockedLocations: ['Home', 'Backyard'],
  totalXP: 0,
  
  // Challenges & Quizzes
  challengesCompleted: 0,
  correctAnswers: 0,
  shopQuizzesCompleted: 0,
  shopQuizzesCorrect: 0,
  
  // Badges
  badges: badges.map(b => ({ ...b })),
  
  // Current states
  currentChallenge: null,
  showChallenge: false,
  showShopQuiz: false,
  currentShopQuiz: null,
  showLevelUp: false,
  newLevel: null,
  
  // Character & Goal
  selectedCharacter: null,
  selectedGoal: null,
  
  // Computed-like getters
  get progressPercent() {
    return Math.min(100, Math.round((this.balance / this.goal) * 100))
  },
  
  get currentLevelData() {
    return levels.find(l => l.id === this.currentLevel) || levels[0]
  },
  
  get nextLevelData() {
    return levels.find(l => l.id === this.currentLevel + 1) || null
  },
  
  get xpToNextLevel() {
    const next = this.nextLevelData
    if (!next) return 0
    return next.requiredWeeks - this.week
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
      this.weeklyIncome = 10
      this.skills.responsibility = 30 // Helpers start with more responsibility
    } else if (character === 'saver') {
      this.weeklyIncome = 8
      this.skills.patience = 30 // Savers start with more patience
    }
    
    this.balance = this.weeklyIncome
  },
  
  // Add skill points
  addSkill(skillName, amount) {
    if (this.skills[skillName] !== undefined) {
      this.skills[skillName] = Math.min(100, Math.max(0, this.skills[skillName] + amount))
    }
  },
  
  // Check for level up
  checkLevelUp() {
    for (let i = levels.length - 1; i >= 0; i--) {
      const level = levels[i]
      if (this.week >= level.requiredWeeks && this.currentLevel < level.id) {
        this.currentLevel = level.id
        this.newLevel = level
        this.showLevelUp = true
        
        // Unlock new locations
        level.unlocks.forEach(loc => {
          if (!this.unlockedLocations.includes(loc)) {
            this.unlockedLocations.push(loc)
          }
        })
        
        // Bonus for leveling up
        this.balance += 5
        this.addSkill('planning', 5)
        
        return true
      }
    }
    return false
  },
  
  // Maybe show shop quiz (every 4 weeks)
  maybeShowShopQuiz() {
    if (this.week > 1 && this.week % 4 === 0) {
      this.currentShopQuiz = getRandomShopQuiz()
      this.showShopQuiz = true
      return true
    }
    return false
  },
  
  // Complete shop quiz
  completeShopQuiz(wasCorrect, savedAmount = 0) {
    this.shopQuizzesCompleted++
    if (wasCorrect) {
      this.shopQuizzesCorrect++
      this.balance += savedAmount
      this.addSkill('planning', 5)
      this.addSkill('patience', 3)
    }
    this.showShopQuiz = false
    this.currentShopQuiz = null
  },
  
  // Dismiss level up popup
  dismissLevelUp() {
    this.showLevelUp = false
    this.newLevel = null
  },
  
  maybeShowChallenge() {
    if (this.week > 1 && this.week % 3 === 0 && !this.showShopQuiz) {
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
        this.balance += this.currentChallenge.reward
      }
      this.addSkill('planning', 3)
    }
    this.showChallenge = false
    this.currentChallenge = null
  },
  
  checkBadges() {
  const newlyUnlocked = []
  this.badges.forEach(badge => {
    if (badge.unlocked) return
    let shouldUnlock = false
    
    switch (badge.id) {
      case 'first_save': 
        shouldUnlock = this.savingChoices >= 1
        break
      case 'quiz_master': 
        shouldUnlock = this.correctAnswers >= 3
        break
      case 'goal_reached': 
        shouldUnlock = this.balance >= this.goal
        break
      case 'week_5': 
        shouldUnlock = this.week >= 5
        break
      case 'balanced': 
        shouldUnlock = this.health >= 40 && this.savingChoices >= 3
        break
      case 'big_saver': 
        shouldUnlock = this.balance >= 50
        break
      case 'shop_smart': 
        shouldUnlock = this.shopQuizzesCorrect >= 2
        break
      case 'skill_master': 
        shouldUnlock = Object.values(this.skills).some(s => s >= 50)
        break
      case 'level_up': 
        shouldUnlock = this.currentLevel >= 2
        break
      case 'generous':
        shouldUnlock = this.generousChoices >= 1
        break
      case 'wise_spender':
        shouldUnlock = this.thoughtfulSpending >= 5
        break
      case 'money_master':
        shouldUnlock = this.currentLevel >= 4
        break
    }
    
    if (shouldUnlock) {
      badge.unlocked = true
      newlyUnlocked.push(badge)
      
      // Award skill points for unlocking badge
      if (badge.skillKey === 'all') {
        Object.keys(this.skills).forEach(skill => {
          this.addSkill(skill, badge.skillAmount)
        })
      } else if (badge.skillKey) {
        this.addSkill(badge.skillKey, badge.skillAmount)
      }
    }
  })
  return newlyUnlocked
},
  
  reset() {
    this.balance = 50
    this.week = 1
    this.health = 50
    this.goal = 100
    this.weeklyIncome = 10
    this.totalSaved = 0
    this.totalSpent = 0
    this.savingChoices = 0
    this.spendingChoices = 0
    this.generousChoices = 0
    this.thoughtfulSpending = 0
    this.skills = {
      patience: 20,
      planning: 20,
      responsibility: 20,
      generosity: 20
    }
    this.currentLevel = 1
    this.unlockedLocations = ['Home', 'Backyard']
    this.totalXP = 0
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
    this.selectedCharacter = null
    this.selectedGoal = null
  }
})

// ============================================
// SHOP QUIZ DATA
// ============================================

const shopQuizzes = [
  {
    id: 1,
    title: '🛒 Shop Smart Challenge!',
    scenario: 'You need to buy a notebook for school. Which is the best deal?',
    options: [
      { id: 'a', name: 'Fancy Notebook', price: 8, quality: 'Pretty but expensive', isBest: false },
      { id: 'b', name: 'Basic Notebook', price: 3, quality: 'Simple but works great', isBest: true },
      { id: 'c', name: 'Designer Notebook', price: 15, quality: 'Cool brand but pricey', isBest: false }
    ],
    correctId: 'b',
    savings: 5,
    tip: 'Sometimes the simple choice is the smartest! You saved $5!'
  },
  {
    id: 2,
    title: '🍎 Snack Time Deal!',
    scenario: 'You want an after-school snack. Which should you pick?',
    options: [
      { id: 'a', name: 'Vending Machine Chips', price: 2, quality: 'Quick but costs more', isBest: false },
      { id: 'b', name: 'Snack from Home', price: 0, quality: 'Free and just as yummy!', isBest: true },
      { id: 'c', name: 'Convenience Store Candy', price: 3, quality: 'Tasty but expensive', isBest: false }
    ],
    correctId: 'b',
    savings: 2,
    tip: 'Bringing snacks from home saves money every day!'
  },
  {
    id: 3,
    title: '🎮 Game Time!',
    scenario: 'You want to play a new video game. Best choice?',
    options: [
      { id: 'a', name: 'Buy New ($60)', price: 60, quality: 'Brand new, full price', isBest: false },
      { id: 'b', name: 'Wait for Sale ($30)', price: 30, quality: 'Same game, half price!', isBest: true },
      { id: 'c', name: 'Buy Used ($40)', price: 40, quality: 'Pre-owned, decent price', isBest: false }
    ],
    correctId: 'b',
    savings: 30,
    tip: 'Patience pays off! Waiting for sales can save you 50%!'
  },
  {
    id: 4,
    title: '👕 Clothes Shopping!',
    scenario: 'You need a new t-shirt. Which is smartest?',
    options: [
      { id: 'a', name: 'Brand Name Shirt', price: 25, quality: 'Cool logo, high price', isBest: false },
      { id: 'b', name: 'Sale Rack Shirt', price: 8, quality: 'Nice shirt, great price!', isBest: true },
      { id: 'c', name: 'Designer Shirt', price: 40, quality: 'Fancy but way too much', isBest: false }
    ],
    correctId: 'b',
    savings: 17,
    tip: 'The sale rack has hidden treasures! Brand names aren\'t everything.'
  },
  {
    id: 5,
    title: '🎬 Movie Night!',
    scenario: 'You want to watch a movie with friends. Best option?',
    options: [
      { id: 'a', name: 'Theater + Snacks', price: 25, quality: 'Fun but expensive', isBest: false },
      { id: 'b', name: 'Home Movie Night', price: 3, quality: 'Popcorn at home, same fun!', isBest: true },
      { id: 'c', name: 'Theater Only', price: 15, quality: 'No snacks, still pricey', isBest: false }
    ],
    correctId: 'b',
    savings: 22,
    tip: 'Home movie nights are just as fun and way cheaper!'
  },
  {
    id: 6,
    title: '🎁 Birthday Gift!',
    scenario: 'Your friend\'s birthday is coming. What do you do?',
    options: [
      { id: 'a', name: 'Expensive Store Gift', price: 30, quality: 'Nice but pricey', isBest: false },
      { id: 'b', name: 'Handmade Card + Small Gift', price: 10, quality: 'Thoughtful and personal!', isBest: true },
      { id: 'c', name: 'Last-Minute Gift Card', price: 20, quality: 'Easy but less personal', isBest: false }
    ],
    correctId: 'b',
    savings: 20,
    tip: 'Thoughtful gifts mean more than expensive ones!'
  }
]

export const getRandomShopQuiz = () => {
  const randomIndex = Math.floor(Math.random() * shopQuizzes.length)
  return shopQuizzes[randomIndex]
}

// ============================================
// PINIA STORE (for compatibility)
// ============================================

export const useGameStore = defineStore('game', {
  state: () => ({
    balance: 50,
    week: 1,
    level: 1,
    health: 50,
    goal: 100,
    weeklyIncome: 10,
    ageGroup: 'kids',
    totalSaved: 0,
    totalSpent: 0,
    savingChoices: 0,
    spendingChoices: 0,
    selectedCharacter: null,
    selectedGoal: null,
  }),
  
  getters: {
    progressPercent: (state) => {
      return Math.min(100, Math.round((state.balance / state.goal) * 100))
    }
  },
  
  actions: {
    initializeGame(character, goal) {
      this.reset()
      this.selectedCharacter = character
      this.selectedGoal = goal
      this.goal = goal.cost
      
      if (character === 'helper') {
        this.weeklyIncome = 10
      } else if (character === 'saver') {
        this.weeklyIncome = 8
      }
      
      this.balance = this.weeklyIncome
      
      // Sync with reactive gameState
      gameState.initializeGame(character, goal)
    },
    
    reset() {
      this.balance = 50
      this.week = 1
      this.level = 1
      this.health = 50
      this.goal = 100
      this.weeklyIncome = 10
      this.totalSaved = 0
      this.totalSpent = 0
      this.savingChoices = 0
      this.spendingChoices = 0
      this.selectedCharacter = null
      this.selectedGoal = null
    }
  }
})