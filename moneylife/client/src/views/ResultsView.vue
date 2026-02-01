<template>
  <div class="results-view">
    
    <!-- Confetti effect -->
    <div v-if="isWinner" class="confetti-container">
      <div v-for="n in 30" :key="n" class="confetti" :style="confettiStyle(n)"></div>
    </div>
    
    <div class="results-layout">
      
      <!-- COLUMN 1: BADGES (Left) -->
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
          </div>
        </div>
      </div>
      
      <!-- COLUMN 2: STATS & SKILLS (Middle) -->
      <div class="stats-section">
        <h2 class="section-title">📊 Your Stats</h2>
        
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">📅</span>
            <span class="stat-value">{{ gameState.week }}</span>
            <span class="stat-label">Weeks</span>
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
          <div v-for="(value, key) in gameState.skills" :key="key" class="skill-row">
            <span class="skill-icon">{{ getSkillIcon(key) }}</span>
            <div class="skill-main">
              <span class="skill-name">{{ getSkillName(key) }}</span>
              <div class="skill-progress-bg">
                <div class="skill-progress-fill" :style="{ width: value + '%', background: getSkillColor(key) }"></div>
              </div>
            </div>
            <span class="skill-number">{{ value }}</span>
          </div>
        </div>
      </div>

      <!-- COLUMN 3: ACHIEVEMENT & MAIN ACTIONS (Right) -->
      <div class="achievement-column">
        <div class="achievement-card" :class="{ 'winner-gradient': isWinner }">
          <div class="achievement-icon">{{ isWinner ? '🏆' : '💪' }}</div>
          <h1 class="achievement-title">{{ isWinner ? 'Goal Reached!' : 'Great Progress!' }}</h1>
          <p class="achievement-subtitle">Keep going to reach your goal!</p>
          
          <div class="goal-info-box">
            <img :src="goalImage" class="goal-img" />
            <div class="goal-progress-details">
              <span class="goal-name-text">{{ gameState.selectedGoal?.name }}</span>
              <div class="goal-bar-bg">
                <div class="goal-bar-fill" :style="{ width: progressPercent + '%' }"></div>
              </div>
              <span class="goal-status-text">${{ gameState.balance }} / ${{ gameState.goal }}</span>
            </div>
          </div>
          
          <div class="level-pill">
            <span class="level-icon">{{ currentLevel.icon }}</span>
            <span class="level-text">{{ currentLevel.name }}</span>
          </div>
        </div>

        <!-- MAIN ACTIONS (Now includes Start Over at bottom) -->
        <div class="main-actions">
          <button v-if="isWinner" class="btn-primary" @click="continueToNextLevel">Next Level 🚀</button>
          <button v-else class="btn-primary" @click="keepPlaying">Keep Playing ▶️</button>
          
          <button class="btn-secondary" @click="chooseNewGoal">New Goal</button>
          
          <button class="btn-tertiary" @click="startOver">Start Over</button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { gameState, levels, skillDefinitions } from '@/stores/gameState'

import toyImage from '@/assets/images/kids/dollToy.png'
import artImage from '@/assets/images/kids/crayonBox.png'
import gameImage from '@/assets/images/kids/gameController.png'
import podsImage from '@/assets/images/teens/airpods.png'
import ticketsImage from '@/assets/images/teens/tickets.png'
import game2Image from '@/assets/images/teens/gameController.png'

const router = useRouter()
const isWinner = computed(() => gameState.balance >= gameState.goal)
const progressPercent = computed(() => Math.min(100, Math.round((gameState.balance / gameState.goal) * 100)))
const currentLevel = computed(() => levels.find(l => l.id === gameState.currentLevel) || levels[0])

const goalImage = computed(() => {
  const name = gameState.selectedGoal?.name?.toLowerCase() || ''
  if (name.includes('toy')) return toyImage
  if (name.includes('art')) return artImage
  if (name.includes('game')) return gameImage
  if (name.includes('airpods')) return podsImage
  if (name.includes('tickets')) return ticketsImage
  return game2Image
})

const getSkillIcon = (key) => skillDefinitions[key]?.icon || '⭐'
const getSkillName = (key) => skillDefinitions[key]?.name || key
const getSkillColor = (key) => skillDefinitions[key]?.color || '#667eea'

const confettiStyle = (n) => ({
  left: Math.random() * 100 + '%',
  animationDelay: Math.random() * 3 + 's',
  backgroundColor: ['#667eea', '#764ba2', '#f093fb'][n % 3]
})

const keepPlaying = () => router.push('/game')
const chooseNewGoal = () => router.push('/')
const startOver = () => { gameState.reset(); router.push('/') }
const continueToNextLevel = () => { gameState.checkLevelUp(); router.push('/game') }
</script>

<style scoped>
.results-view {
  min-height: 100vh;
  background-color: #FAFBFC;
  padding: 40px;
  color: #000000;
}

.results-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.section-title { font-size: 20px; font-weight: 800; color: #000; margin-bottom: 24px; }

/* LEFT COLUMN: BADGES */
.badges-section { display: flex; flex-direction: column; }
.badges-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.badge-card {
  background: white; border-radius: 16px; padding: 16px; text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.badge-emoji { font-size: 32px; }
.badge-name { font-size: 11px; font-weight: 700; color: #000; }
.badge-card.locked { opacity: 0.5; }

/* MIDDLE COLUMN: STATS & SKILLS */
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 40px; }
.stat-card { background: white; border-radius: 20px; padding: 24px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.stat-icon { font-size: 28px; display: block; margin-bottom: 8px; }
.stat-value { font-size: 32px; font-weight: 800; color: #000; display: block; }
.stat-label { font-size: 14px; color: #000; font-weight: 600; }

.skills-grid { display: flex; flex-direction: column; gap: 12px; }
.skill-row { 
  display: flex; align-items: center; gap: 16px; background: white; 
  padding: 16px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
}
.skill-main { flex: 1; }
.skill-name { font-size: 14px; font-weight: 700; color: #000; margin-bottom: 6px; display: block; }
.skill-progress-bg { height: 8px; background: #EEE; border-radius: 4px; overflow: hidden; }
.skill-progress-fill { height: 100%; border-radius: 4px; }
.skill-number { font-size: 18px; font-weight: 800; color: #000; min-width: 30px; text-align: right; }

/* RIGHT COLUMN: ACHIEVEMENT CARD & ACTIONS */
.achievement-column { display: flex; flex-direction: column; gap: 24px; }
.achievement-card {
  background: white; border-radius: 24px; padding: 40px 32px; text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
}
.winner-gradient { background: linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%); }
.achievement-icon { font-size: 72px; margin-bottom: 16px; }
.achievement-title { font-size: 32px; font-weight: 900; color: #000; margin: 0; }
.achievement-subtitle { font-size: 16px; font-weight: 600; color: #000; margin-bottom: 32px; }

.goal-info-box {
  display: flex; align-items: center; gap: 20px; background: white; 
  padding: 20px; border-radius: 16px; text-align: left; margin-bottom: 24px;
}
.goal-img { width: 80px; height: 80px; object-fit: contain; }
.goal-progress-details { flex: 1; }
.goal-name-text { font-size: 18px; font-weight: 800; color: #000; }
.goal-bar-bg { height: 12px; background: #E8E8E8; border-radius: 6px; margin: 8px 0; overflow: hidden; }
.goal-bar-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); }
.goal-status-text { font-size: 14px; font-weight: 700; color: #000; }

.level-pill {
  display: inline-flex; align-items: center; gap: 8px; background: #000; 
  color: #FFF; padding: 12px 24px; border-radius: 30px; font-weight: 800;
}

/* ACTIONS */
.main-actions { display: flex; flex-direction: column; gap: 12px; text-align: center; }
.btn-primary { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; 
  border-radius: 14px; padding: 20px; font-size: 18px; font-weight: 800; cursor: pointer;
}
.btn-secondary { 
  background: white; color: #000; border: 3px solid #000; border-radius: 14px; 
  padding: 16px; font-size: 16px; font-weight: 800; cursor: pointer;
}
.btn-tertiary { 
  background: none; color: #000; border: none; cursor: pointer; 
  font-size: 14px; font-weight: 700; text-decoration: underline; margin-top: 8px;
}

/* Confetti */
.confetti-container { position: fixed; inset: 0; pointer-events: none; }
.confetti { position: absolute; width: 10px; height: 10px; top: -20px; animation: fall 4s linear infinite; }
@keyframes fall { to { top: 100vh; transform: rotate(360deg); } }
</style>