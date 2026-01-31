<template>
  <div class="skills-bar">
    <div class="skills-header">
      <span class="skills-title">My Skills</span>
      <span class="level-badge">{{ currentLevel.icon }} {{ currentLevel.name }}</span>
    </div>
    
    <div class="skills-grid">
      <div 
        v-for="(value, key) in gameState.skills" 
        :key="key"
        class="skill-item"
      >
        <div class="skill-icon">{{ getSkillIcon(key) }}</div>
        <div class="skill-info">
          <span class="skill-name">{{ getSkillName(key) }}</span>
          <div class="skill-bar">
            <div 
              class="skill-fill" 
              :style="{ width: value + '%', backgroundColor: getSkillColor(key) }"
            ></div>
          </div>
        </div>
        <span class="skill-value">{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { gameState, skillDefinitions, levels } from '@/stores/gameState'

const currentLevel = computed(() => {
  return levels.find(l => l.id === gameState.currentLevel) || levels[0]
})

const getSkillIcon = (key) => skillDefinitions[key]?.icon || '⭐'
const getSkillName = (key) => skillDefinitions[key]?.name || key
const getSkillColor = (key) => skillDefinitions[key]?.color || '#6C63FF'
</script>

<style scoped>
.skills-bar {
  background: white;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  border: 3px solid #6C63FF;
}

.skills-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.skills-title {
  font-size: 16px;
  font-weight: 800;
  color: #2D3436;
}

.level-badge {
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #FFF8F0;
  padding: 10px 12px;
  border-radius: 12px;
}

.skill-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.skill-info {
  flex: 1;
  min-width: 0;
}

.skill-name {
  font-size: 11px;
  font-weight: 700;
  color: #666;
  display: block;
  margin-bottom: 4px;
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
  font-size: 14px;
  font-weight: 800;
  color: #2D3436;
  min-width: 24px;
  text-align: right;
}
</style>