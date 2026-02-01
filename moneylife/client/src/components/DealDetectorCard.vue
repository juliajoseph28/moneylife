<!-- src/components/DealDetectorCard.vue -->
<template>
  <div class="deal-detector-card">
    <div class="card">
      <!-- Header -->
      <div class="card-header">
        <div class="scenario-header">
          <span class="week-badge">📅 Week {{ week }}</span>
          <span class="type-badge">🔍 Deal Detective</span>
        </div>
        <div class="title-section">
          <span class="title-emoji">🏷️</span>
          <h2 class="card-title">Is This REALLY a Good Deal?</h2>
          <p class="card-description">{{ scenario.description }}</p>
        </div>
      </div>

      <!-- The "Deal" Display -->
      <div class="deal-showcase">
        <div class="deal-card" :class="{ 'revealed': hasAnswered }">
          <!-- Sale Tag -->
          <div class="sale-tag">
            <span class="sale-text">SALE!</span>
            <span class="sale-percent">{{ scenario.salePercent }}% OFF</span>
          </div>

          <!-- Product -->
          <div class="product-display">
            <span class="product-emoji">{{ scenario.emoji }}</span>
            <h3 class="product-name">{{ scenario.productName }}</h3>
          </div>

          <!-- Price Display -->
          <div class="price-display">
            <div class="original-price">
              <span class="price-label">Was:</span>
              <span class="price-crossed">${{ scenario.originalPrice }}</span>
            </div>
            <div class="sale-price">
              <span class="price-label">NOW:</span>
              <span class="price-big">${{ scenario.salePrice }}</span>
            </div>
            <div class="savings-claim">
              <span class="savings-text">🎉 "SAVE ${{ scenario.originalPrice - scenario.salePrice }}!!!"</span>
            </div>
          </div>

          <!-- Store branding -->
          <div class="store-name">
            <span>{{ scenario.storeName || 'MegaMart' }}</span>
          </div>
        </div>

        <!-- The Hidden Truth -->
        <div class="truth-reveal" :class="{ 'visible': showTruth || hasAnswered }">
          <div class="truth-icon">🔍</div>
          <p class="truth-intro">But wait... let's investigate!</p>
          
          <div class="comparison-box">
            <div class="comparison-item other-store">
              <span class="store-label">{{ scenario.otherStoreName || 'Other Store' }}:</span>
              <span class="store-price">${{ scenario.realPrice }}</span>
              <span class="store-note">{{ scenario.otherStoreNote || 'Regular price, no sale' }}</span>
            </div>
            
            <div class="comparison-item online" v-if="scenario.onlinePrice">
              <span class="store-label">Online:</span>
              <span class="store-price">${{ scenario.onlinePrice }}</span>
              <span class="store-note">{{ scenario.onlineNote || 'Free shipping' }}</span>
            </div>
          </div>

          <div class="truth-question">
            <span class="question-icon">🤔</span>
            <span class="question-text">Is the "sale" really saving you money?</span>
          </div>
        </div>
      </div>

      <!-- Answer Buttons -->
      <div class="answer-section" v-if="!hasAnswered">
        <button @click="showTruth = true" class="investigate-btn" v-if="!showTruth">
          <span class="btn-icon">🔍</span>
          <span>Investigate First</span>
        </button>

        <div class="answer-buttons" v-if="showTruth">
          <button 
            @click="submitAnswer(true)" 
            class="answer-btn real-deal"
          >
            <span class="btn-emoji">✅</span>
            <span class="btn-text">Real Deal!</span>
            <span class="btn-subtext">This sale saves money</span>
          </button>
          
          <button 
            @click="submitAnswer(false)" 
            class="answer-btn fake-deal"
          >
            <span class="btn-emoji">❌</span>
            <span class="btn-text">Fake Deal!</span>
            <span class="btn-subtext">It's not really cheaper</span>
          </button>
        </div>
      </div>

      <!-- Result Display -->
      <div class="result-section" v-if="hasAnswered">
        <div class="result-card" :class="isCorrect ? 'correct' : 'incorrect'">
          <div class="result-icon">{{ isCorrect ? '🎉' : '😮' }}</div>
          <h3 class="result-title">{{ isCorrect ? 'Great Detective Work!' : 'Tricky, Right?' }}</h3>
          <p class="result-message">{{ resultMessage }}</p>
          
          <!-- Math Breakdown -->
          <div class="math-breakdown">
            <h4 class="breakdown-title">📊 Let's Do The Math:</h4>
            <div class="breakdown-items">
              <div class="breakdown-row">
                <span class="breakdown-label">"Sale" Price:</span>
                <span class="breakdown-value">${{ scenario.salePrice }}</span>
              </div>
              <div class="breakdown-row highlight">
                <span class="breakdown-label">Real Best Price:</span>
                <span class="breakdown-value best">${{ realBestPrice }}</span>
              </div>
              <div class="breakdown-row" :class="actualSavings >= 0 ? 'savings' : 'loss'">
                <span class="breakdown-label">{{ actualSavings >= 0 ? 'Actual Savings:' : 'You\'d OVERPAY:' }}</span>
                <span class="breakdown-value">{{ actualSavings >= 0 ? '' : '+' }}${{ Math.abs(actualSavings) }}</span>
              </div>
            </div>
          </div>

          <!-- Lesson -->
          <div class="lesson-box">
            <span class="lesson-icon">💡</span>
            <p class="lesson-text">{{ scenario.lesson }}</p>
          </div>

          <!-- Skill/Reward -->
          <div class="reward-display">
            <div class="reward-item" v-if="isCorrect">
              <span class="reward-icon">📊</span>
              <span class="reward-text">+5 Planning Skill</span>
            </div>
            <div class="reward-item" v-if="isCorrect">
              <span class="reward-icon">🪙</span>
              <span class="reward-text">+$2 Bonus</span>
            </div>
          </div>
        </div>

        <button @click="continueGame" class="continue-btn">
          Continue →
        </button>
      </div>

      <!-- Balance Reminder -->
      <div class="balance-reminder" v-if="!hasAnswered">
        <span class="balance-icon">🪙</span>
        <span class="balance-text">Your balance: <strong>${{ currentBalance }}</strong></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gameState } from '@/stores/gameState'

const props = defineProps({
  scenario: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['complete'])

// State
const showTruth = ref(false)
const hasAnswered = ref(false)
const userAnswer = ref(null)
const isCorrect = ref(false)

// Computed
const week = computed(() => gameState.week || 1)
const currentBalance = computed(() => gameState.balance || 0)

const realBestPrice = computed(() => {
  const prices = [props.scenario.realPrice]
  if (props.scenario.onlinePrice) {
    prices.push(props.scenario.onlinePrice)
  }
  return Math.min(...prices)
})

const actualSavings = computed(() => {
  // Positive = sale is actually cheaper than best alternative
  // Negative = sale is MORE expensive than best alternative
  return realBestPrice.value - props.scenario.salePrice
})

const isRealDeal = computed(() => {
  // It's a real deal if the sale price is actually cheaper than alternatives
  return props.scenario.salePrice < realBestPrice.value
})

const resultMessage = computed(() => {
  if (isCorrect.value) {
    if (isRealDeal.value) {
      return `You spotted a real deal! The sale price of $${props.scenario.salePrice} IS cheaper than the $${realBestPrice.value} elsewhere. Smart shopping!`
    } else {
      return `You caught the fake sale! Even with "${props.scenario.salePercent}% off," you'd pay $${props.scenario.salePrice} when you could get it for $${realBestPrice.value} elsewhere. That's $${Math.abs(actualSavings.value)} MORE!`
    }
  } else {
    if (isRealDeal.value) {
      return `This one was actually a real deal! The sale price of $${props.scenario.salePrice} really is cheaper than $${realBestPrice.value} at other stores.`
    } else {
      return `This was a sneaky fake sale! The "original price" of $${props.scenario.originalPrice} was inflated. The real price elsewhere is only $${realBestPrice.value}!`
    }
  }
})

// Methods
const submitAnswer = (answeredRealDeal) => {
  userAnswer.value = answeredRealDeal
  hasAnswered.value = true
  
  // Check if correct
  isCorrect.value = (answeredRealDeal === isRealDeal.value)
  
  // Apply rewards/effects
  if (isCorrect.value) {
    gameState.addSkill('planning', 5)
    gameState.addSkill('patience', 3)
    gameState.balance += 2 // Small bonus for being smart
    
    gameState.teenGoodDecisions?.push({
      type: 'spotted_fake_deal',
      item: props.scenario.productName,
      week: gameState.week
    })
  } else {
    gameState.addSkill('planning', 2) // Still learn something
  }
}

const continueGame = () => {
  emit('complete', {
    correct: isCorrect.value,
    wasRealDeal: isRealDeal.value
  })
}
</script>

<style scoped>
.deal-detector-card {
  width: 100%;
  max-width: 700px;
}

.card {
  background: white;
  border-radius: 32px;
  padding: 32px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.1);
  border: 4px solid #FF6B9D;
}

/* Header */
.card-header {
  text-align: center;
  margin-bottom: 24px;
}

.scenario-header {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.week-badge, .type-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
}

.week-badge {
  background: linear-gradient(135deg, #6C63FF 0%, #5A54D4 100%);
  color: white;
}

.type-badge {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8E8E 100%);
  color: white;
}

.title-section {
  text-align: center;
}

.title-emoji {
  font-size: 48px;
  display: block;
  margin-bottom: 8px;
}

.card-title {
  font-size: 26px;
  font-weight: 800;
  color: #2D3436;
  margin: 0 0 8px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.card-description {
  font-size: 15px;
  color: #666;
  margin: 0;
}

/* Deal Showcase */
.deal-showcase {
  margin-bottom: 24px;
}

.deal-card {
  background: linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%);
  border: 3px solid #FF6B9D;
  border-radius: 24px;
  padding: 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
}

/* Sale Tag */
.sale-tag {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #FF0000 0%, #FF4444 100%);
  color: white;
  padding: 12px 20px;
  border-radius: 0 20px 0 20px;
  transform: rotate(5deg);
  box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3);
}

.sale-text {
  display: block;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1px;
}

.sale-percent {
  display: block;
  font-size: 18px;
  font-weight: 900;
}

/* Product Display */
.product-display {
  margin: 20px 0;
}

.product-emoji {
  font-size: 72px;
  display: block;
  margin-bottom: 12px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.product-name {
  font-size: 24px;
  font-weight: 800;
  color: #2D3436;
  margin: 0;
}

/* Price Display */
.price-display {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin: 16px 0;
}

.original-price {
  margin-bottom: 8px;
}

.price-label {
  font-size: 14px;
  color: #888;
  margin-right: 8px;
}

.price-crossed {
  font-size: 24px;
  color: #999;
  text-decoration: line-through;
  font-weight: 700;
}

.sale-price {
  margin-bottom: 12px;
}

.price-big {
  font-size: 48px;
  font-weight: 900;
  color: #FF0000;
  text-shadow: 2px 2px 0 #FFE0E0;
}

.savings-claim {
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  border-radius: 12px;
  padding: 10px 16px;
  display: inline-block;
}

.savings-text {
  font-size: 16px;
  font-weight: 800;
  color: #2D3436;
}

.store-name {
  margin-top: 16px;
  font-size: 12px;
  color: #888;
  font-style: italic;
}

/* Truth Reveal */
.truth-reveal {
  background: linear-gradient(135deg, #E8F4FF 0%, #D6EBFF 100%);
  border: 3px dashed #4A90D9;
  border-radius: 20px;
  padding: 20px;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.5s ease;
}

.truth-reveal.visible {
  opacity: 1;
  max-height: 500px;
  margin-top: 16px;
}

.truth-icon {
  font-size: 40px;
  margin-bottom: 8px;
}

.truth-intro {
  font-size: 16px;
  font-weight: 700;
  color: #2D3436;
  margin: 0 0 16px;
}

.comparison-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.comparison-item {
  background: white;
  border-radius: 12px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.comparison-item.other-store {
  border: 2px solid #4ECDC4;
}

.comparison-item.online {
  border: 2px solid #667eea;
}

.store-label {
  font-size: 14px;
  font-weight: 700;
  color: #666;
}

.store-price {
  font-size: 24px;
  font-weight: 900;
  color: #4ECDC4;
}

.store-note {
  font-size: 12px;
  color: #888;
  font-style: italic;
  margin-left: auto;
}

.truth-question {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  background: white;
  border-radius: 12px;
}

.question-icon {
  font-size: 24px;
}

.question-text {
  font-size: 15px;
  font-weight: 700;
  color: #2D3436;
}

/* Answer Section */
.answer-section {
  margin-bottom: 20px;
}

.investigate-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 32px;
  background: linear-gradient(135deg, #4A90D9 0%, #357ABD 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.investigate-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(74, 144, 217, 0.4);
}

.btn-icon {
  font-size: 24px;
}

.answer-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.answer-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 20px;
  border: 3px solid #E8E8E8;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.answer-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.answer-btn.real-deal:hover {
  border-color: #4ECDC4;
  background: linear-gradient(135deg, #E8FFF8 0%, white 100%);
}

.answer-btn.fake-deal:hover {
  border-color: #FF6B6B;
  background: linear-gradient(135deg, #FFF0F0 0%, white 100%);
}

.btn-emoji {
  font-size: 40px;
}

.btn-text {
  font-size: 18px;
  font-weight: 800;
  color: #2D3436;
}

.btn-subtext {
  font-size: 12px;
  color: #888;
}

/* Result Section */
.result-section {
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-card {
  border-radius: 24px;
  padding: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.result-card.correct {
  background: linear-gradient(135deg, #E8FFF8 0%, #D0F5E8 100%);
  border: 3px solid #4ECDC4;
}

.result-card.incorrect {
  background: linear-gradient(135deg, #FFF8E8 0%, #FFE8D0 100%);
  border: 3px solid #FFB347;
}

.result-icon {
  font-size: 56px;
  margin-bottom: 12px;
}

.result-title {
  font-size: 24px;
  font-weight: 800;
  color: #2D3436;
  margin: 0 0 12px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.result-message {
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  margin: 0 0 20px;
}

/* Math Breakdown */
.math-breakdown {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  text-align: left;
}

.breakdown-title {
  font-size: 16px;
  font-weight: 800;
  color: #2D3436;
  margin: 0 0 12px;
}

.breakdown-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  background: #F8F8F8;
  border-radius: 10px;
}

.breakdown-row.highlight {
  background: #E8FFF8;
  border: 2px solid #4ECDC4;
}

.breakdown-row.savings {
  background: #E8FFF8;
}

.breakdown-row.loss {
  background: #FFE8E8;
}

.breakdown-label {
  font-size: 14px;
  color: #666;
}

.breakdown-value {
  font-size: 16px;
  font-weight: 800;
  color: #2D3436;
}

.breakdown-value.best {
  color: #4ECDC4;
}

/* Lesson Box */
.lesson-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #FFF8E8;
  border-radius: 16px;
  border: 2px solid #FFE66D;
  text-align: left;
  margin-bottom: 16px;
}

.lesson-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.lesson-text {
  margin: 0;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}

/* Reward Display */
.reward-display {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #E8FFF8 0%, #D0F5E8 100%);
  border-radius: 12px;
  border: 2px solid #4ECDC4;
}

.reward-icon {
  font-size: 18px;
}

.reward-text {
  font-size: 14px;
  font-weight: 700;
  color: #4ECDC4;
}

/* Continue Button */
.continue-btn {
  width: 100%;
  padding: 18px 32px;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
  transition: all 0.3s ease;
}

.continue-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(108, 99, 255, 0.4);
}

/* Balance Reminder */
.balance-reminder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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

/* Responsive */
@media (max-width: 500px) {
  .card {
    padding: 20px;
  }
  
  .answer-buttons {
    grid-template-columns: 1fr;
  }
  
  .price-big {
    font-size: 36px;
  }
}
</style>