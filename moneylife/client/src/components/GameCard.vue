<!-- src/components/GameCard.vue -->
<template>
  <div class="game-card">
    <!-- Question View -->
    <div v-if="!showOutcome" class="card question-card">
      <div class="card-layout">
        <!-- Left: Scenario Info -->
        <div class="scenario-section">
          <div class="scenario-header">
            <span class="week-badge">📅 Week {{ getCurrentWeek() }}</span>
            <span class="level-badge">⭐ Level {{ getCurrentLevel() }}</span>
          </div>
          
          <div class="scenario-emoji">{{ scenario.emoji }}</div>
          <h2 class="card-title">{{ scenario.title }}</h2>
          <p class="card-description">{{ scenario.description }}</p>
          <p class="card-prompt">"{{ scenario.prompt }}"</p>
        </div>
        
        <!-- Right: Choices -->
        <div class="choices-section">
          <h3 class="choices-title">What do you do?</h3>
          <div class="choices">
            <button
              v-for="choice in scenario.choices"
              :key="choice.id"
              @click="handleChoiceClick(choice)"
              class="choice-btn"
              :class="getChoiceClass(choice)"
            >
              <span class="choice-emoji">{{ choice.emoji }}</span>
              <div class="choice-content">
                <span class="choice-text">{{ choice.text }}</span>
                <span class="choice-effects">
                  <span v-if="choice.effects?.health" class="effect-tag health">
                    ❤️ {{ choice.effects.health > 0 ? '+' : '' }}{{ choice.effects.health }}
                  </span>
                  <!-- Show "Can't Afford" warning -->
                  <span v-if="!canAffordChoice(choice)" class="effect-tag cant-afford">
                    🚫 Need ${{ getAmountNeeded(choice) }} more
                  </span>
                </span>
              </div>
              <span class="choice-cost" :class="getCostClass(choice)">
                {{ formatCost(choice) }}
              </span>
            </button>
          </div>
          
          <!-- Current Balance Reminder -->
          <div class="balance-reminder">
            <span class="balance-icon">🪙</span>
            <span class="balance-text">Your balance: <strong>${{ currentBalance }}</strong></span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Outcome View -->
    <div v-else class="card outcome-card" :class="selectedChoice?.outcome?.type">
      <div class="outcome-layout">
        <!-- Left: Outcome -->
        <div class="outcome-main">
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
        </div>
        
        <!-- Right: Tip & Next -->
        <div class="outcome-side">
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
    </div>
    
        <!-- Penny Advice Popup (when can't afford) -->
    <PennyAdvice
      :show="showPennyAdvice"
      :item-name="attemptedChoice?.text || 'this item'"
      :item-cost="Math.abs(attemptedChoice?.effects?.balance || 0)"
      :current-balance="currentBalance"
      :weekly-income="weeklyIncome"
      :goal-name="goalName"
      :goal-cost="goalCost"
      @close="closePennyAdvice"
      @choose-different="closePennyAdvice"
      @open-chat="openChatFromAdvice"
    />
    
    <!-- Gemini Chatbox -->
    <GeminiChatbox
      :show="showGeminiChat"
      :initial-context="chatContext"
      @close="showGeminiChat = false"
    />
  </div>
</template>

<script setup>
import GeminiChatbox from '@/components/GeminiChatbox.vue'
import { ref, computed } from 'vue'
import { gameState } from '@/stores/gameState'
import PennyAdvice from '@/components/PennyAdvice.vue'

const props = defineProps({
  scenario: Object
})

const emit = defineEmits(['choice', 'next'])

const selectedChoice = ref(null)
const showOutcome = ref(false)
const showPennyAdvice = ref(false)
const attemptedChoice = ref(null)
const showGeminiChat = ref(false)
const chatContext = ref('')

// Get current game state values
const getCurrentWeek = () => gameState.week || 1
const getCurrentLevel = () => gameState.currentLevel || 1
const currentBalance = computed(() => gameState.balance || 0)
const weeklyIncome = computed(() => gameState.weeklyIncome || 5)
const goalName = computed(() => gameState.selectedGoal?.name || 'your prize')
const goalCost = computed(() => gameState.goal || 100)

const outcomeIcon = computed(() => {
  if (!selectedChoice.value) return '📝'
  switch (selectedChoice.value.outcome.type) {
    case 'positive': return '🌟'
    case 'negative': return '😅'
    case 'tradeoff': return '🤔'
    default: return '📝'
  }
})

// Check if user can afford a choice
const canAffordChoice = (choice) => {
  const cost = choice.effects?.balance || 0
  // If it's earning money (positive) or free, always affordable
  if (cost >= 0) return true
  // Check if they have enough to cover the cost
  return currentBalance.value >= Math.abs(cost)
}

// Get amount needed for a choice
const getAmountNeeded = (choice) => {
  const cost = Math.abs(choice.effects?.balance || 0)
  return Math.max(0, cost - currentBalance.value)
}

const getChoiceClass = (choice) => {
  const canAfford = canAffordChoice(choice)
  const balance = choice.effects?.balance || 0
  
  if (!canAfford) return 'cant-afford'
  if (balance > 0) return 'earns-money'
  if (balance < 0) return 'costs-money'
  return 'free-choice'
}

const getCostClass = (choice) => {
  if (!canAffordChoice(choice)) return 'unaffordable'
  if (choice.effects?.balance > 0) return 'positive'
  return ''
}

const formatCost = (choice) => {
  const amount = choice.effects?.balance || 0
  if (amount > 0) return `+$${amount}`
  if (amount < 0) return `-$${Math.abs(amount)}`
  return '$0'
}

// Handle choice click - check affordability first
const handleChoiceClick = (choice) => {
  if (!canAffordChoice(choice)) {
    // Can't afford - show Penny's advice!
    attemptedChoice.value = choice
    showPennyAdvice.value = true
    return
  }
  
  // Can afford - proceed with choice
  selectChoice(choice)
}
// Open Gemini chat with context about what they're struggling with
const openChatFromAdvice = () => {
  const choice = attemptedChoice.value
  const cost = Math.abs(choice?.effects?.balance || 0)
  const needed = cost - currentBalance.value
  
  chatContext.value = `The child tried to spend $${cost} on "${choice?.text}" but only has $${currentBalance.value}. They need $${needed} more. They're looking at the savings timeline but still need help understanding. Please explain in very simple, friendly language why they can't afford this right now and how saving works.`
  
  showPennyAdvice.value = false
  showGeminiChat.value = true
}
const selectChoice = (choice) => {
  selectedChoice.value = choice
  emit('choice', choice)
  setTimeout(() => {
    showOutcome.value = true
  }, 300)
}

const closePennyAdvice = () => {
  showPennyAdvice.value = false
  attemptedChoice.value = null
}

const nextWeek = () => {
  showOutcome.value = false
  selectedChoice.value = null
  emit('next')
}
</script>

<style scoped>
.game-card {
  width: 100%;
  max-width: 900px;
}

.card {
  background: white;
  border-radius: 32px;
  padding: 32px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.1);
  border: 4px solid #FFE66D;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* =====================
   QUESTION CARD LAYOUT
   ===================== */

.card-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

.scenario-section {
  text-align: center;
}

.scenario-header {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.week-badge, .level-badge {
  padding: 8px 16px;
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

.scenario-emoji {
  font-size: 80px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.card-title {
  font-size: 28px;
  font-weight: 800;
  color: #2D3436;
  margin: 0 0 12px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.card-description {
  font-size: 16px;
  color: #666;
  margin: 0 0 16px;
  line-height: 1.6;
}

.card-prompt {
  font-size: 18px;
  color: #6C63FF;
  font-weight: 700;
  font-style: italic;
  margin: 0;
  padding: 16px;
  background: #F8F0FF;
  border-radius: 16px;
}

/* Choices Section */
.choices-section {
  display: flex;
  flex-direction: column;
}

.choices-title {
  font-size: 18px;
  font-weight: 800;
  color: #2D3436;
  margin: 0 0 16px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

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

/* Can't Afford Styling */
.choice-btn.cant-afford {
  border-color: #DDD;
  background: #F5F5F5;
  opacity: 0.8;
}

.choice-btn.cant-afford:hover {
  transform: translateX(4px);
  border-color: #FF6B9D;
  background: linear-gradient(135deg, #FFF0F5 0%, #F5F5F5 100%);
}

.choice-btn.cant-afford .choice-emoji {
  filter: grayscale(50%);
}

.choice-emoji {
  font-size: 32px;
  flex-shrink: 0;
}

.choice-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.choice-text {
  font-size: 15px;
  font-weight: 600;
  color: #2D3436;
}

.choice-effects {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.effect-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 8px;
  background: #F8F8F8;
}

.effect-tag.cant-afford {
  background: #FFE0E0;
  color: #FF6B6B;
  font-weight: 600;
}

.choice-cost {
  font-size: 18px;
  font-weight: 800;
  color: #FF6B9D;
  padding: 8px 14px;
  background: #FFF0F5;
  border-radius: 12px;
  flex-shrink: 0;
}

.choice-cost.positive {
  color: #4ECDC4;
  background: #F0FFFD;
}

.choice-cost.unaffordable {
  color: #999;
  background: #EEE;
  text-decoration: line-through;
}

/* Balance Reminder */
.balance-reminder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #FFF8F0 0%, #FFE8D6 100%);
  border-radius: 16px;
  border: 2px solid #FFE66D;
}

.balance-icon {
  font-size: 20px;
}

.balance-text {
  font-size: 14px;
  color: #666;
}

.balance-text strong {
  color: #4ECDC4;
  font-size: 16px;
}

/* =====================
   OUTCOME CARD LAYOUT
   ===================== */

.outcome-card {
  text-align: left;
}

.outcome-card.positive {
  border-color: #4ECDC4;
}

.outcome-card.negative {
  border-color: #FF6B9D;
}

.outcome-card.tradeoff {
  border-color: #FFE66D;
}

.outcome-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

.outcome-main {
  text-align: center;
}

.outcome-icon {
  font-size: 72px;
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
  margin: 0 0 24px;
  line-height: 1.6;
}

.effects-display {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.effect-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
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

/* Outcome Side */
.outcome-side {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tip-box {
  background: white;
  border: 3px dashed #6C63FF;
  border-radius: 20px;
  padding: 20px;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.tip-icon {
  font-size: 28px;
}

.tip-label {
  font-size: 18px;
  font-weight: 800;
  color: #6C63FF;
}

.tip-text {
  margin: 0;
  font-size: 15px;
  color: #666;
  line-height: 1.6;
}

.btn-next {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 20px 32px;
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

/* =====================
   RESPONSIVE
   ===================== */

@media (max-width: 800px) {
  .card-layout,
  .outcome-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .scenario-emoji {
    font-size: 60px;
  }
  
  .card-title {
    font-size: 24px;
  }
}
</style>