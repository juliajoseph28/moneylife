// src/stores/gameState.js
import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'

// ============================================
// OPTION 1: Direct reactive export (for new code)
// ============================================
import { getRandomChallenge } from '@/data/challenges'
import { badges } from '@/data/badges'

export const gameState = reactive({
  balance: 50,
  week: 1,
  level: 1,
  health: 50,
  goal: 100,
  totalSaved: 0,
  totalSpent: 0,
  savingChoices: 0,
  spendingChoices: 0,
  challengesCompleted: 0,
  correctAnswers: 0,
  badges: badges.map(b => ({ ...b })),
  currentChallenge: null,
  showChallenge: false,
  
  get progressPercent() {
    return Math.min(100, Math.round((this.balance / this.goal) * 100))
  },
  
  maybeShowChallenge() {
    if (this.week > 1 && this.week % 3 === 0) {
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
        case 'first_save': shouldUnlock = this.savingChoices >= 1; break
        case 'quiz_master': shouldUnlock = this.correctAnswers >= 3; break
        case 'goal_reached': shouldUnlock = this.balance >= this.goal; break
        case 'week_5': shouldUnlock = this.week >= 5; break
        case 'balanced': shouldUnlock = this.health >= 40 && this.savingChoices >= 3; break
        case 'big_saver': shouldUnlock = this.balance >= 50; break
      }
      if (shouldUnlock) {
        badge.unlocked = true
        newlyUnlocked.push(badge)
      }
    })
    return newlyUnlocked
  },
  
  reset() {
    this.balance = 50
    this.week = 1
    this.level = 1
    this.health = 50
    this.totalSaved = 0
    this.totalSpent = 0
    this.savingChoices = 0
    this.spendingChoices = 0
    this.challengesCompleted = 0
    this.correctAnswers = 0
    this.badges = badges.map(b => ({ ...b, unlocked: false }))
    this.currentChallenge = null
    this.showChallenge = false
  }
})

// ============================================
// OPTION 2: Pinia store (for existing code)
// ============================================
export const useGameStore = defineStore('game', {
  state: () => ({
    balance: 50,
    week: 1,
    level: 1,
    health: 50,
    goal: 100,
    totalSaved: 0,
    totalSpent: 0,
    savingChoices: 0,
    spendingChoices: 0,
  }),
  
  getters: {
    progressPercent: (state) => {
      return Math.min(100, Math.round((state.balance / state.goal) * 100))
    }
  },
  
  actions: {
    updateBalance(amount) {
      this.balance += amount
      if (amount > 0) {
        this.totalSaved += amount
        this.savingChoices++
      } else {
        this.totalSpent += Math.abs(amount)
        this.spendingChoices++
      }
    },
    
    updateHealth(amount) {
      this.health = Math.max(0, Math.min(100, this.health + amount))
    },
    
    nextWeek() {
      this.week++
      if (this.week % 5 === 0) {
        this.level++
      }
    },
    
    reset() {
      this.balance = 50
      this.week = 1
      this.level = 1
      this.health = 50
      this.totalSaved = 0
      this.totalSpent = 0
      this.savingChoices = 0
      this.spendingChoices = 0
    }
  }
})