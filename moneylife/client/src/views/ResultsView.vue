<template>
  <div class="results-container">
    <h1>📊 Your Financial Report</h1>
    
    <div class="report-card card">
      <div class="grade-section">
        <span class="grade">{{ grade.emoji }}</span>
        <span class="grade-letter">{{ grade.letter }}</span>
      </div>
      
      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-value">{{ store.currentWeek }}</span>
          <span class="stat-label">Weeks Played</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">${{ store.savings }}</span>
          <span class="stat-label">Total Saved</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">{{ store.financialHealth }}</span>
          <span class="stat-label">Final Health</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">{{ smartChoices }}/{{ store.choiceHistory.length }}</span>
          <span class="stat-label">Smart Choices</span>
        </div>
      </div>
    </div>
    
    <div class="lessons-card card">
      <h2>💡 What You Learned</h2>
      <ul>
        <li>✅ How to save toward a goal</li>
        <li>✅ Making tradeoffs between wants and needs</li>
        <li>✅ The power of saying "not right now"</li>
      </ul>
    </div>
    
    <button @click="playAgain" class="btn-primary">
      🔄 Play Again
    </button>
    
    <button @click="goHome" class="btn-secondary">
      🏠 Back to Home
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameState'

const router = useRouter()
const store = useGameStore()

const grade = computed(() => {
  const health = store.financialHealth
  if (health >= 80) return { letter: 'A', emoji: '🌟' }
  if (health >= 70) return { letter: 'B', emoji: '✨' }
  if (health >= 60) return { letter: 'C', emoji: '👍' }
  if (health >= 50) return { letter: 'D', emoji: '📈' }
  return { letter: 'F', emoji: '💪' }
})

const smartChoices = computed(() => {
  return store.choiceHistory.filter(c => c.effects.health > 0).length
})

const playAgain = () => {
  store.resetGame()
  router.push('/')
}

const goHome = () => {
  store.resetGame()
  router.push('/')
}
</script>

<style scoped>
.results-container {
  min-height: 100vh;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  font-size: 28px;
  margin-bottom: 24px;
  color: #4ade80;
}

.card {
  background: #16213e;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
}

.grade-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.grade {
  font-size: 64px;
}

.grade-letter {
  font-size: 48px;
  font-weight: 800;
  color: #4ade80;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-box {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 16px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #4ade80;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
}

.lessons-card h2 {
  margin-bottom: 16px;
  font-size: 20px;
}

.lessons-card ul {
  list-style: none;
  text-align: left;
}

.lessons-card li {
  padding: 8px 0;
  font-size: 16px;
}

.btn-primary {
  background: #4ade80;
  color: black;
  font-weight: bold;
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  margin-bottom: 12px;
}

.btn-secondary {
  background: transparent;
  border: 2px solid rgba(255,255,255,0.2);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}
</style>