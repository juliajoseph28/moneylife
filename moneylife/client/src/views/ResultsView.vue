<template>
  <div class="results-view">
    
    <!-- Confetti -->
    <div v-if="isWinner" class="confetti-container">
      <div v-for="n in 30" :key="n" class="confetti" :style="confettiStyle(n)"></div>
    </div>
    
    <!-- Main Layout -->
    <div class="results-layout">
      
      <!-- Left Column: Achievement -->
      <div class="achievement-section">
        <div class="achievement-card" :class="isWinner ? 'winner' : 'progress'">
          <div class="trophy-icon">{{ isWinner ? '🏆' : '💪' }}</div>
          <h1 class="achievement-title">{{ isWinner ? 'Goal Reached!' : 'Great Progress!' }}</h1>
          <p class="achievement-subtitle">
            {{ isWinner ? 'You saved enough for your goal!' : 'Keep going to reach your goal!' }}
          </p>
          
          <div class="goal-display">
            <img :src="goalImage" class="goal-img" alt="Goal" />
            <div class="goal-info">
              <span class="goal-name">{{ gameState.selectedGoal?.name }}</span>
              <div class="goal-progress-bar">
                <div class="goal-progress-fill" :style="{ width: progressPercent + '%' }"></div>
              </div>
              <span class="goal-progress-text">${{ gameState.balance }} / ${{ gameState.goal }}</span>
            </div>
          </div>
          
          <div class="level-display">
            <span class="level-icon">{{ currentLevel.icon }}</span>
            <span class="level-name">{{ currentLevel.name }}</span>
          </div>
        </div>
      </div>
      
      <!-- Middle Column: Stats & Skills -->
      <div class="stats-section">
        <h2 class="section-title">📊 Your Stats</h2>
        
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">📅</span>
            <span class="stat-value">{{ gameState.week }}</span>
            <span class="stat-label">Weeks</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">💰</span>
            <span class="stat-value">${{ gameState.totalSaved }}</span>
            <span class="stat-label">Saved</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">🛍️</span>
            <span class="stat-value">${{ gameState.totalSpent }}</span>
            <span class="stat-label">Spent</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">😊</span>
            <span class="stat-value">{{ gameState.health }}</span>
            <span class="stat-label">Happiness</span>
          </div>
        </div>
        
        <h2 class="section-title">💪 Skills Learned</h2>
        
        <div class="skills-grid">
          <div v-for="(value, key) in gameState.skills" :key="key" class="skill-card">
            <span class="skill-icon">{{ getSkillIcon(key) }}</span>
            <div class="skill-info">
              <span class="skill-name">{{ getSkillName(key) }}</span>
              <div class="skill-bar">
                <div class="skill-fill" :style="{ width: value + '%', background: getSkillColor(key) }"></div>
              </div>
            </div>
            <span class="skill-value">{{ value }}</span>
          </div>
        </div>
      </div>
      
      <!-- Right Column: Badges & Actions -->
      <div class="badges-section">
        <h2 class="section-title">🏅 Badges</h2>
        
        <div class="badges-grid">
          <div 
            v-for="badge in gameState.badges" 
            :key="badge.id"
            class="badge-card"
            :class="{ unlocked: badge.unlocked, locked: !badge.unlocked }"
            @click="badge.unlocked && showBadgeDetail(badge)"
          >
            <span class="badge-emoji">{{ badge.unlocked ? badge.emoji : '🔒' }}</span>
            <span class="badge-name">{{ badge.name }}</span>
            <span v-if="badge.unlocked && badge.skill" class="badge-skill">+{{ badge.skill }}</span>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="action-buttons">
          <button v-if="isWinner" class="btn-primary" @click="continueToNextLevel">
            <span>Next Level</span>
            <span class="btn-icon">🚀</span>
          </button>
          
          <button v-else class="btn-primary" @click="keepPlaying">
            <span>Keep Playing</span>
            <span class="btn-icon">▶️</span>
          </button>
          
          <button class="btn-secondary" @click="chooseNewGoal">
            <span>New Goal</span>
          </button>
          
          <button class="btn-tertiary" @click="startOver">
            <span>Start Over</span>
          </button>
        </div>
      </div>
      
    </div>
    
    <!-- Badge Detail Modal -->
    <div v-if="selectedBadge" class="modal-overlay" @click="selectedBadge = null">
      <div class="badge-modal" @click.stop>
        <span class="modal-emoji">{{ selectedBadge.emoji }}</span>
        <h2>{{ selectedBadge.name }}</h2>
        <p class="modal-description">{{ selectedBadge.description }}</p>
        
        <div v-if="selectedBadge.skillLesson" class="skill-lesson">
          <h3>💡 What You Learned</h3>
          <p>{{ selectedBadge.skillLesson }}</p>
        </div>
        
        <button class="btn-close" @click="selectedBadge = null">Got It!</button>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { gameState, levels, skillDefinitions } from '@/stores/gameState'

import toyImage from '@/assets/images/kids/doll toy cartoon.png'
import artImage from '@/assets/images/kids/crayon box.png'
import gameImage from '@/assets/images/kids/game controler.png'

const router = useRouter()
const selectedBadge = ref(null)

// Computed
const isWinner = computed(() => gameState.balance >= gameState.goal)

const progressPercent = computed(() => {
  return Math.min(100, Math.round((gameState.balance / gameState.goal) * 100))
})

const currentLevel = computed(() => {
  return levels.find(l => l.id === gameState.currentLevel) || levels[0]
})

const nextLevel = computed(() => {
  return levels.find(l => l.id === gameState.currentLevel + 1) || null
})

const goalImage = computed(() => {
  const name = gameState.selectedGoal?.name?.toLowerCase() || ''
  if (name.includes('toy')) return toyImage
  if (name.includes('art')) return artImage
  if (name.includes('game')) return gameImage
  return toyImage
})

// Skill helpers
const getSkillIcon = (key) => skillDefinitions[key]?.icon || '⭐'
const getSkillName = (key) => skillDefinitions[key]?.name || key
const getSkillColor = (key) => skillDefinitions[key]?.color || '#667eea'

// Confetti
const confettiStyle = (n) => {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
  return {
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 3 + 's',
    backgroundColor: colors[n % colors.length]
  }
}

// Actions
const showBadgeDetail = (badge) => {
  selectedBadge.value = badge
}

const continueToNextLevel = () => {
  // Keep progress but set new harder goal
  const currentGoalCost = gameState.goal
  const newGoalCost = Math.round(currentGoalCost * 1.5) // 50% harder
  
  // Update goal
  gameState.goal = newGoalCost
  gameState.selectedGoal = {
    ...gameState.selectedGoal,
    cost: newGoalCost,
    name: getNextGoalName()
  }
  
  // Reset week counter but keep skills and balance surplus
  const surplus = gameState.balance - currentGoalCost
  gameState.balance = gameState.weeklyIncome + Math.max(0, surplus)
  gameState.week = 1
  gameState.totalSaved = 0
  gameState.totalSpent = 0
  
  // Check for level up
  gameState.checkLevelUp()
  
  router.push('/game')
}

const keepPlaying = () => {
  // Just go back to game without resetting
  router.push('/game')
}

const chooseNewGoal = () => {
  // Keep character and skills, but pick new goal
  gameState.balance = gameState.weeklyIncome
  gameState.week = 1
  gameState.totalSaved = 0
  gameState.totalSpent = 0
  router.push('/')
}

const startOver = () => {
  gameState.reset()
  router.push('/')
}

const getNextGoalName = () => {
  const goalProgression = [
    'Cool Toy', 'Art Set', 'Video Game', 
    'Skateboard', 'Tablet', 'Gaming Console',
    'Bike', 'Camera', 'Laptop'
  ]
  const currentIndex = goalProgression.findIndex(g => 
    g.toLowerCase() === gameState.selectedGoal?.name?.toLowerCase()
  )
  return goalProgression[Math.min(currentIndex + 1, goalProgression.length - 1)]
}
</script>

<style scoped>
.results-view {
  min-height: 100vh;
  background: #FAFBFC;
  padding: 40px;
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
  top: -20px;
  animation: fall 4s ease-out infinite;
}

@keyframes fall {
  to {
    top: 100vh;
    transform: rotate(720deg);
    opacity: 0;
  }
}

/* Main Layout */
.results-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  height: calc(100vh - 80px);
}

/* Achievement Section */
.achievement-section {
  display: flex;
  align-items: center;
}

.achievement-card {
  background: white;
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  width: 100%;
}

.achievement-card.winner {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.trophy-icon {
  font-size: 72px;
  margin-bottom: 16px;
}

.achievement-title {
  font-size: 32px;
  font-weight: 800;
  color: #2D3436;
  margin: 0 0 8px;
}

.achievement-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0 0 32px;
}

.goal-display {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
}

.goal-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.goal-info {
  flex: 1;
  text-align: left;
}

.goal-name {
  font-size: 18px;
  font-weight: 700;
  color: #2D3436;
  display: block;
  margin-bottom: 8px;
}

.goal-progress-bar {
  height: 12px;
  background: #E8E8E8;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.goal-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.goal-progress-text {
  font-size: 14px;
  font-weight: 700;
  color: #667eea;
}

.level-display {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 700;
}

.level-icon {
  font-size: 24px;
}

.level-name {
  font-size: 16px;
}

/* Stats Section */
.stats-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #2D3436;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.stat-icon {
  font-size: 28px;
  display: block;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #2D3436;
  display: block;
}

.stat-label {
  font-size: 13px;
  color: #888;
}

.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.skill-icon {
  font-size: 24px;
}

.skill-info {
  flex: 1;
}

.skill-name {
  font-size: 14px;
  font-weight: 600;
  color: #2D3436;
  display: block;
  margin-bottom: 6px;
}

.skill-bar {
  height: 8px;
  background: #E8E8E8;
  border-radius: 4px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.skill-value {
  font-size: 16px;
  font-weight: 800;
  color: #2D3436;
  min-width: 32px;
  text-align: right;
}

/* Badges Section */
.badges-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  flex: 1;
}

.badge-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.badge-card.unlocked:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
}

.badge-card.locked {
  opacity: 0.5;
  cursor: default;
}

.badge-emoji {
  font-size: 32px;
}

.badge-name {
  font-size: 11px;
  font-weight: 600;
  color: #2D3436;
}

.badge-skill {
  font-size: 10px;
  color: #667eea;
  background: #667eea15;
  padding: 2px 8px;
  border-radius: 10px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 18px 24px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
}

.btn-icon {
  font-size: 20px;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #667eea10;
}

.btn-tertiary {
  background: none;
  color: #888;
  border: none;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-tertiary:hover {
  color: #2D3436;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.badge-modal {
  background: white;
  border-radius: 24px;
  padding: 40px;
  max-width: 400px;
  text-align: center;
  animation: popIn 0.3s ease;
}

@keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-emoji {
  font-size: 72px;
  display: block;
  margin-bottom: 16px;
}

.badge-modal h2 {
  font-size: 24px;
  color: #2D3436;
  margin: 0 0 8px;
}

.modal-description {
  color: #666;
  margin: 0 0 24px;
}

.skill-lesson {
  background: #F8F9FA;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
}

.skill-lesson h3 {
  font-size: 14px;
  color: #667eea;
  margin: 0 0 8px;
}

.skill-lesson p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.btn-close {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 1200px) {
  .results-layout {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .achievement-section {
    order: 1;
  }
  
  .stats-section {
    order: 2;
  }
  
  .badges-section {
    order: 3;
  }
}
</style>