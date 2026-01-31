<template>
  <div class="stats-bar">
    <div class="stat-item">
      <span class="stat-icon">💰</span>
      <div class="stat-content">
        <span class="stat-value">${{ store.balance }}</span>
        <span class="stat-label">Balance</span>
      </div>
    </div>
    
    <div class="stat-item">
      <span class="stat-icon">🎯</span>
      <div class="stat-content">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: store.progressToGoal + '%' }"></div>
        </div>
        <span class="stat-label">{{ store.progressToGoal }}% to goal</span>
      </div>
    </div>
    
    <div class="stat-item">
      <span class="stat-icon">❤️</span>
      <div class="stat-content">
        <span class="stat-value" :class="healthClass">{{ store.financialHealth }}</span>
        <span class="stat-label">Health</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameState'

const store = useGameStore()

const healthClass = computed(() => {
  if (store.financialHealth >= 70) return 'good'
  if (store.financialHealth >= 40) return 'medium'
  return 'poor'
})
</script>

<style scoped>
.stats-bar {
  display: flex;
  justify-content: space-between;
  background: #16213e;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-icon {
  font-size: 24px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
}

.stat-value.good { color: #4ade80; }
.stat-value.medium { color: #fbbf24; }
.stat-value.poor { color: #ef4444; }

.stat-label {
  font-size: 11px;
  color: #94a3b8;
}

.progress-bar {
  width: 60px;
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4ade80;
  transition: width 0.5s ease;
}
</style>