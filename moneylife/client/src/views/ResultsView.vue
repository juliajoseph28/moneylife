<template>
  <div class="results-view">
    
    <!-- Confetti Animation -->
    <div v-if="isWinner" class="confetti-container">
      <div v-for="n in 50" :key="n" class="confetti" :style="confettiStyle(n)"></div>
    </div>
    
    <!-- Main Results Card -->
    <div class="results-card">
      
      <!-- Header -->
      <div class="results-header" :class="isWinner ? 'winner' : 'try-again'">
        <div class="header-emoji">{{ isWinner ? '🏆' : '💪' }}</div>
        <h1 class="header-title">{{ isWinner ? 'You Did It!' : 'Great Try!' }}</h1>
        <p class="header-subtitle">
          {{ isWinner ? 'You reached your savings goal!' : "You're learning great money skills!" }}
        </p>
      </div>
      
      <!-- Goal Achievement -->
      <div class="goal-section">
        <div class="goal-visual">
          <img :src="goalImage" class="goal-image" alt="Goal" />
          <div class="goal-status" :class="isWinner ? 'achieved' : 'in-progress'">
            {{ isWinner ? '✓ GOT IT!' : 'Keep Going!' }}
          </div>
        </div>
        <h2 class="goal-name">{{ gameState.selectedGoal?.name || 'Your Goal' }}</h2>
        <div class="goal-progress">
          <div class="progress-bar-large">
            <div class="progress-fill-large" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <span class="progress-text">${{ gameState.balance }} / ${{ gameState.goal }}</span>
        </div>
      </div>
      
      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-emoji">📅</span>
          <span class="stat-value">{{ gameState.week }}</span>
          <span class="stat-label">Weeks Played</span>
        </div>
        <div class="stat-card">
          <span class="stat-emoji">💰</span>
          <span class="stat-value">${{ gameState.totalSaved }}</span>
          <span class="stat-label">Total Saved</span>
        </div>
        <div class="stat-card">
          <span class="stat-emoji">🛍️</span>
          <span class="stat-value">${{ gameState.totalSpent }}</span>
          <span class="stat-label">Total Spent</span>
        </div>
        <div class="stat-card">
          <span class="stat-emoji">😊</span>
          <span class="stat-value">{{ gameState.health }}</span>
          <span class="stat-label">Happiness</span>
        </div>
      </div>
      
      <!-- Badges Earned -->
      <div class="badges-section">
        <h3 class="section-title">🏅 Badges Earned</h3>
        <div class="badges-grid">
          <div 
            v-for="badge in gameState.badges" 
            :key="badge.id"
            class="badge-item"
            :class="{ unlocked: badge.unlocked, locked: !badge.unlocked }"
          >
            <span class="badge-emoji">{{ badge.unlocked ? badge.emoji : '🔒' }}</span>
            <span class="badge-name">{{ badge.name }}</span>
          </div>
        </div>
      </div>
      
      <!-- Money Tips Learned -->
      <div class="tips-section">
        <h3 class="section-title">💡 What You Learned</h3>
        <div class="tips-list">
          <div class="tip-item" v-if="gameState.savingChoices > 0">
            <span class="tip-icon">✅</span>
            <span>Saving money helps you reach big goals!</span>
          </div>
          <div class="tip-item" v-if="gameState.spendingChoices > 0">
            <span class="tip-icon">✅</span>
            <span>It's okay to spend on things that make you happy sometimes!</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon">✅</span>
            <span>Every choice has a trade-off - that's how money works!</span>
          </div>
          <div class="tip-item" v-if="gameState.challengesCompleted > 0">
            <span class="tip-icon">✅</span>
            <span>You answered {{ gameState.correctAnswers }} money questions correctly!</span>
          </div>
        </div>
      </div>
      
      <!-- Penny's Message -->
      <div class="penny-message">
        <img src="@/assets/images/kids/pig.png" class="penny-large" alt="Penny" />
        <div class="message-bubble">
          <p v-if="isWinner">
            🎉 WOW! You're a money superstar! You saved enough for your {{ gameState.selectedGoal?.name }}! 
            I'm SO proud of you! Ready to try a bigger goal?
          </p>
          <p v-else>
            💪 Great job playing! You learned so much about money! 
            Want to try again and reach your goal this time? I believe in you!
          </p>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn-play-again" @click="playAgain">
          <span>🎮 Play Again</span>
        </button>
        <button class="btn-new-goal" @click="newGoal">
          <span>🎯 New Goal</span>
        </button>
        <button class="btn-share" @click="shareResults">
          <span>📤 Share</span>
        </button>
      </div>
      
    </div>
    
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { gameState } from '@/stores/gameState'

// Import goal images
import toyImage from '@/assets/images/kids/doll toy cartoon.png'
import artImage from '@/assets/images/kids/crayon box.png'
import gameImage from '@/assets/images/kids/game controler.png'

const router = useRouter()

const isWinner = computed(() => gameState.balance >= gameState.goal)

const progressPercent = computed(() => {
  return Math.min(100, Math.round((gameState.balance / gameState.goal) * 100))
})

const goalImage = computed(() => {
  const goalName = gameState.selectedGoal?.name?.toLowerCase() || ''
  if (goalName.includes('toy')) return toyImage
  if (goalName.includes('art')) return artImage
  if (goalName.includes('game')) return gameImage
  return toyImage // default
})

// Confetti random styles
const confettiStyle = (n) => {
  const colors = ['#FF6B9D', '#FFE66D', '#4ECDC4', '#6C63FF', '#FF8C42']
  return {
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 3 + 's',
    backgroundColor: colors[n % colors.length],
    transform: `rotate(${Math.random() * 360}deg)`
  }
}

const playAgain = () => {
  // Keep same character and goal, just reset progress
  const character = gameState.selectedCharacter
  const goal = gameState.selectedGoal
  gameState.reset()
  gameState.initializeGame(character, goal)
  router.push('/game')
}

const newGoal = () => {
  gameState.reset()
  router.push('/')
}

const shareResults = () => {
  // For demo purposes, show an alert
  const message = isWinner.value 
    ? `🏆 I saved $${gameState.balance} and reached my goal in MoneyLife!`
    : `💪 I'm learning about money in MoneyLife! Saved $${gameState.balance} so far!`
  
  if (navigator.share) {
    navigator.share({
      title: 'MoneyLife Results',
      text: message,
    })
  } else {
    alert('Share this: ' + message)
  }
}
</script>

<style scoped>
.results-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF8F0 0%, #FFE8D6 50%, #FFDAB9 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* Confetti */
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  animation: fall 4s ease-in-out infinite;
}

@keyframes fall {
  0% { 
    top: -10px; 
    opacity: 1;
    transform: translateX(0) rotate(0deg);
  }
  100% { 
    top: 100vh; 
    opacity: 0;
    transform: translateX(100px) rotate(720deg);
  }
}

/* Results Card */
.results-card {
  max-width: 500px;
  margin: 0 auto;
  background: white;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.12);
  border: 4px solid #FFE66D;
}

/* Header */
.results-header {
  padding: 32px 24px;
  text-align: center;
}

.results-header.winner {
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
}

.results-header.try-again {
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
}

.header-emoji {
  font-size: 72px;
  margin-bottom: 12px;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.header-title {
  margin: 0;
  font-size: 36px;
  font-weight: 800;
  color: #2D3436;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.results-header.try-again .header-title {
  color: white;
}

.header-subtitle {
  margin: 8px 0 0;
  font-size: 16px;
  color: #666;
}

.results-header.try-again .header-subtitle {
  color: rgba(255,255,255,0.9);
}

/* Goal Section */
.goal-section {
  padding: 24px;
  text-align: center;
  border-bottom: 3px dashed #FFE66D;
}

.goal-visual {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.goal-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.goal-status {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.goal-status.achieved {
  background: #4ECDC4;
  color: white;
}

.goal-status.in-progress {
  background: #FF6B9D;
  color: white;
}

.goal-name {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 800;
  color: #2D3436;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.goal-progress {
  max-width: 300px;
  margin: 0 auto;
}

.progress-bar-large {
  height: 20px;
  background: #E8E8E8;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill-large {
  height: 100%;
  background: linear-gradient(90deg, #4ECDC4, #44A08D);
  border-radius: 15px;
  transition: width 1s ease;
}

.progress-text {
  font-size: 18px;
  font-weight: 700;
  color: #4ECDC4;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 24px;
  border-bottom: 3px dashed #FFE66D;
}

.stat-card {
  background: #FFF8F0;
  border-radius: 20px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-emoji {
  font-size: 28px;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #2D3436;
}

.stat-label {
  font-size: 12px;
  color: #888;
  font-weight: 600;
}

/* Badges Section */
.badges-section {
  padding: 24px;
  border-bottom: 3px dashed #FFE66D;
}

.section-title {
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 800;
  color: #2D3436;
  text-align: center;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.badges-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  border-radius: 16px;
  min-width: 80px;
  transition: transform 0.2s ease;
}

.badge-item.unlocked {
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
}

.badge-item.locked {
  background: #E8E8E8;
  opacity: 0.6;
}

.badge-item.unlocked:hover {
  transform: scale(1.1);
}

.badge-emoji {
  font-size: 32px;
}

.badge-name {
  font-size: 10px;
  font-weight: 700;
  color: #2D3436;
  text-align: center;
}

/* Tips Section */
.tips-section {
  padding: 24px;
  border-bottom: 3px dashed #FFE66D;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #F0FFFD;
  border-radius: 12px;
  padding: 12px 16px;
  border: 2px solid #4ECDC4;
}

.tip-icon {
  font-size: 20px;
}

.tip-item span:last-child {
  font-size: 14px;
  color: #2D3436;
  font-weight: 500;
}

/* Penny Message */
.penny-message {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: #FFF8F0;
}

.penny-large {
  width: 80px;
  height: 80px;
  object-fit: contain;
  animation: wiggle 2s ease-in-out infinite;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.message-bubble {
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 16px;
  border: 3px solid #FFE66D;
  position: relative;
}

.message-bubble::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 20px;
  border-width: 10px;
  border-style: solid;
  border-color: transparent #FFE66D transparent transparent;
}

.message-bubble p {
  margin: 0;
  font-size: 15px;
  color: #2D3436;
  line-height: 1.6;
  font-weight: 500;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  padding: 24px;
}

.action-buttons button {
  flex: 1;
  padding: 16px 12px;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-play-again {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: white;
}

.btn-new-goal {
  background: linear-gradient(135deg, #6C63FF 0%, #5A54D4 100%);
  color: white;
}

.btn-share {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8C42 100%);
  color: white;
}

.action-buttons button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}
</style>