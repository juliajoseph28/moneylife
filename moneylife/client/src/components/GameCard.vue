<template>
  <div class="game-card">
    <!-- Question View -->
    <div v-if="!showOutcome" class="card question-card">
      <span class="card-emoji">{{ scenario.emoji }}</span>
      <h2 class="card-title">{{ scenario.title }}</h2>
      <p class="card-description">{{ scenario.description }}</p>
      <p class="card-prompt">"{{ scenario.prompt }}"</p>
      
      <div class="choices">
        <button
          v-for="choice in scenario.choices"
          :key="choice.id"
          @click="selectChoice(choice)"
          class="choice-btn"
        >
          <span class="choice-emoji">{{ choice.emoji }}</span>
          <span class="choice-text">{{ choice.text }}</span>
          <span class="choice-cost" :class="choice.cost > 0 ? 'negative' : 'neutral'">
            {{ choice.cost > 0 ? `-$${choice.cost}` : '$0' }}
          </span>
        </button>
      </div>
    </div>
    
    <!-- Outcome View -->
    <div v-else class="card outcome-card">
      <span class="outcome-icon">{{ outcomeIcon }}</span>
      <h2>{{ selectedChoice.outcome.title }}</h2>
      <p class="outcome-message">{{ selectedChoice.outcome.message }}</p>
      
      <div class="tip-box">
        <span class="tip-label">💡 MONEY TIP:</span>
        <p>{{ selectedChoice.outcome.tip }}</p>
      </div>
      
      <div class="effects">
        <span v-if="selectedChoice.effects.balance" class="effect">
          💰 {{ selectedChoice.effects.balance > 0 ? '+' : '' }}${{ selectedChoice.effects.balance }}
        </span>
        <span v-if="selectedChoice.effects.health" class="effect" :class="selectedChoice.effects.health > 0 ? 'positive' : 'negative'">
          ❤️ {{ selectedChoice.effects.health > 0 ? '+' : '' }}{{ selectedChoice.effects.health }}
        </span>
      </div>
      
      <button @click="nextWeek" class="btn-primary">
        ▶ NEXT WEEK
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
    case 'positive': return '✨'
    case 'negative': return '😬'
    case 'tradeoff': return '🤔'
    default: return '📝'
  }
})

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
.card {
  background: #16213e;
  border-radius: 20px;
  padding: 24px;
  text-align: center;
}

.card-emoji {
  font-size: 56px;
  display: block;
  margin-bottom: 16px;
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
}

.card-description {
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 12px;
}

.card-prompt {
  font-style: italic;
  font-size: 18px;
  margin-bottom: 24px;
  color: #f1f5f9;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.choice-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  background: rgba(255,255,255,0.05);
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  color: white;
}

.choice-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: #4ade80;
  transform: translateX(4px);
}

.choice-emoji {
  font-size: 24px;
}

.choice-text {
  flex: 1;
  font-weight: 500;
}

.choice-cost {
  font-weight: 700;
  font-size: 14px;
}

.choice-cost.negative {
  color: #f472b6;
}

.choice-cost.neutral {
  color: #94a3b8;
}

/* Outcome styles */
.outcome-icon {
  font-size: 56px;
  display: block;
  margin-bottom: 16px;
}

.outcome-message {
  font-size: 16px;
  margin-bottom: 20px;
  color: #f1f5f9;
}

.tip-box {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  text-align: left;
}

.tip-label {
  font-weight: 700;
  color: #fbbf24;
  display: block;
  margin-bottom: 8px;
}

.effects {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.effect {
  font-weight: 700;
  font-size: 16px;
}

.effect.positive {
  color: #4ade80;
}

.effect.negative {
  color: #ef4444;
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
}
</style>