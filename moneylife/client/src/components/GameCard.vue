<template>
  <div class="game-card">
    <!-- Question View -->
    <div v-if="!showOutcome" class="card question-card">
      <div class="card-badges">
        <span class="badge week-badge">📅 Week {{ $parent?.gameState?.week || '1' }}</span>
        <span class="badge level-badge">⭐ Level {{ $parent?.gameState?.level || '1' }}</span>
      </div>
      
      <div class="scenario-emoji">{{ scenario.emoji }}</div>
      <h2 class="card-title">{{ scenario.title }}</h2>
      <p class="card-description">{{ scenario.description }}</p>
      <p class="card-prompt">"{{ scenario.prompt }}"</p>
      
      <div class="choices">
        <button
          v-for="choice in scenario.choices"
          :key="choice.id"
          @click="selectChoice(choice)"
          class="choice-btn"
          :class="getChoiceClass(choice)"
        >
          <span class="choice-emoji">{{ choice.emoji }}</span>
          <span class="choice-text">{{ choice.text }}</span>
          <span class="choice-cost" :class="{ positive: choice.effects?.balance > 0 }">
            {{ formatCost(choice) }}
          </span>
        </button>
      </div>
    </div>
    
    <!-- Outcome View -->
    <div v-else class="card outcome-card" :class="selectedChoice?.outcome?.type">
      <div class="outcome-icon">{{ outcomeIcon }}</div>
      <h2 class="outcome-title">{{ selectedChoice.outcome.title }}</h2>
      <p class="outcome-message">{{ selectedChoice.outcome.message }}</p>
      
      <div class="effects-display">
        <div v-if="selectedChoice.effects.balance" class="effect-item" :class="selectedChoice.effects.balance > 0 ? 'positive' : 'negative'">
          <span class="effect-icon">💰</span>
          <span class="effect-value">{{ selectedChoice.effects.balance > 0 ? '+' : '' }}${{ selectedChoice.effects.balance }}</span>
        </div>
        <div v-if="selectedChoice.effects.health" class="effect-item" :class="selectedChoice.effects.health > 0 ? 'positive' : 'negative'">
          <span class="effect-icon">❤️</span>
          <span class="effect-value">{{ selectedChoice.effects.health > 0 ? '+' : '' }}{{ selectedChoice.effects.health }}</span>
        </div>
      </div>
      
      <div class="tip-box">
        <div class="tip-header">
          <span class="tip-icon">💡</span>
          <span class="tip-label">Money Tip!</span>
        </div>
        <p class="tip-text">{{ selectedChoice.outcome.tip }}</p>
      </div>
      
      <button @click="nextWeek" class="btn-next">
        <span>Next Week</span>
        <span class="btn-arrow">→</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  scenario: Object
})

const emit = defineEmits(['choice', 'next'])

const selectedChoice = ref(null)
const showOutcome = ref(false)

const outcomeIcon = computed(() => {
  if (!selectedChoice.value) return '📝'
  switch (selectedChoice.value.outcome.type) {
    case 'positive': return '🌟'
    case 'negative': return '😅'
    case 'tradeoff': return '🤔'
    default: return '📝'
  }
})

const getChoiceClass = (choice) => {
  if (choice.effects?.balance > 0) return 'earns-money'
  if (choice.effects?.balance < 0) return 'costs-money'
  return 'free-choice'
}

const formatCost = (choice) => {
  const amount = choice.effects?.balance || 0
  if (amount > 0) return `+$${amount}`
  if (amount < 0) return `-$${Math.abs(amount)}`
  return '$0'
}

const selectChoice = (choice) => {
  selectedChoice.value = choice
  emit('choice', choice)
  setTimeout(() => {
    showOutcome.value = true
  }, 300)
}

const nextWeek = () => {
  showOutcome.value = false
  selectedChoice.value = null
  emit('next')
}
</script>

<style scoped>
.game-card {
  max-width: 500px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 32px;
  padding: 28px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  border: 4px solid #FFE66D;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Card Badges */
.card-badges {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.badge {
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
}

.week-badge {
  background: linear-gradient(135deg, #6C63FF 0%, #5A54D4 100%);
  color: white;
}

.level-badge {
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  color: #2D3436;
}

/* Scenario Content */
.scenario-emoji {
  font-size: 72px;
  text-align: center;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.card-title {
  font-size: 26px;
  font-weight: 800;
  color: #2D3436;
  text-align: center;
  margin: 0 0 12px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.card-description {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin: 0 0 12px;
  line-height: 1.6;
}

.card-prompt {
  font-size: 18px;
  color: #6C63FF;
  text-align: center;
  font-weight: 700;
  font-style: italic;
  margin: 0 0 24px;
  padding: 12px;
  background: #F8F0FF;
  border-radius: 16px;
}

/* Choices */
.choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.choice-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 18px 20px;
  background: white;
  border: 3px solid #E8E8E8;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.choice-btn:hover {
  transform: translateX(8px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.choice-btn.costs-money {
  border-color: #FFB6C1;
}

.choice-btn.costs-money:hover {
  border-color: #FF6B9D;
  background: linear-gradient(135deg, #FFF0F5 0%, white 100%);
}

.choice-btn.free-choice {
  border-color: #B8E6B8;
}

.choice-btn.free-choice:hover {
  border-color: #4ECDC4;
  background: linear-gradient(135deg, #F0FFFD 0%, white 100%);
}

.choice-btn.earns-money {
  border-color: #FFE66D;
}

.choice-btn.earns-money:hover {
  border-color: #FFD93D;
  background: linear-gradient(135deg, #FFFDF0 0%, white 100%);
}

.choice-emoji {
  font-size: 32px;
  flex-shrink: 0;
}

.choice-text {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #2D3436;
}

.choice-cost {
  font-size: 18px;
  font-weight: 800;
  color: #FF6B9D;
  padding: 6px 12px;
  background: #FFF0F5;
  border-radius: 12px;
}

.choice-cost.positive {
  color: #4ECDC4;
  background: #F0FFFD;
}

/* Outcome Card */
.outcome-card {
  text-align: center;
}

.outcome-card.positive {
  border-color: #4ECDC4;
  background: linear-gradient(135deg, #F0FFFD 0%, white 100%);
}

.outcome-card.negative {
  border-color: #FF6B9D;
  background: linear-gradient(135deg, #FFF0F5 0%, white 100%);
}

.outcome-card.tradeoff {
  border-color: #FFE66D;
  background: linear-gradient(135deg, #FFFDF0 0%, white 100%);
}

.outcome-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: pop 0.5s ease;
}

@keyframes pop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.outcome-title {
  font-size: 28px;
  font-weight: 800;
  color: #2D3436;
  margin: 0 0 12px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.outcome-message {
  font-size: 16px;
  color: #666;
  margin: 0 0 20px;
  line-height: 1.6;
}

/* Effects Display */
.effects-display {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.effect-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 16px;
  font-weight: 700;
}

.effect-item.positive {
  background: #E8FFF8;
  color: #4ECDC4;
}

.effect-item.negative {
  background: #FFF0F5;
  color: #FF6B9D;
}

.effect-icon {
  font-size: 20px;
}

.effect-value {
  font-size: 18px;
}

/* Tip Box */
.tip-box {
  background: white;
  border: 3px dashed #6C63FF;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.tip-icon {
  font-size: 24px;
}

.tip-label {
  font-size: 16px;
  font-weight: 800;
  color: #6C63FF;
}

.tip-text {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* Next Button */
.btn-next {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 18px 32px;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.btn-next:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(108, 99, 255, 0.4);
}

.btn-arrow {
  font-size: 24px;
  animation: bounceRight 1s ease-in-out infinite;
}

@keyframes bounceRight {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}
</style> 