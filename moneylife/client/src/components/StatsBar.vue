<template>
  <div class="stats-bar">
    <div class="stat-item balance">
      <div class="stat-icon-wrapper">
        <span class="stat-icon">🪙</span>
      </div>
      <div class="stat-content">
        <span class="stat-value">${{ gameState.balance }}</span>
        <span class="stat-label">My Money</span>
      </div>
    </div>
    
    <div class="stat-item goal">
      <div class="stat-icon-wrapper">
        <span class="stat-icon">🎯</span>
      </div>
      <div class="stat-content">
        <div class="progress-wrapper">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <span class="progress-text">{{ progressPercent }}%</span>
        </div>
        <span class="stat-label">To My Goal!</span>
      </div>
    </div>
    
    <div class="stat-item health">
      <div class="stat-icon-wrapper">
        <span class="stat-icon">❤️</span>
      </div>
      <div class="stat-content">
        <span class="stat-value" :class="healthClass">{{ gameState.health }}</span>
        <span class="stat-label">Happiness</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { gameState } from '@/stores/gameState'

const progressPercent = computed(() => {
  return Math.min(100, Math.round((gameState.balance / gameState.goal) * 100))
})

const healthClass = computed(() => {
  if (gameState.health >= 70) return 'good'
  if (gameState.health >= 40) return 'medium'
  return 'poor'
})
</script>

<style scoped>
.stats-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item {
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  border: 3px solid #E0E0E0;
  transition: transform 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-item.balance {
  border-color: #FFE66D;
  background: linear-gradient(135deg, #FFFDF0 0%, white 100%);
}

.stat-item.goal {
  border-color: #4ECDC4;
  background: linear-gradient(135deg, #F0FFFD 0%, white 100%);
}

.stat-item.health {
  border-color: #FF6B9D;
  background: linear-gradient(135deg, #FFF0F5 0%, white 100%);
}

.stat-icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.stat-icon {
  font-size: 24px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: #2D3436;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.stat-value.good { color: #4ECDC4; }
.stat-value.medium { color: #FFB347; }
.stat-value.poor { color: #FF6B6B; }

.stat-label {
  font-size: 11px;
  color: #888;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 12px;
  background: #E8E8E8;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ECDC4, #44A08D);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 800;
  color: #4ECDC4;
  min-width: 36px;
}
</style>