<!-- src/components/CreditCardStatementPopup.vue -->
<template>
  <div v-if="show" class="popup-overlay" @click.self="$emit('close')">
    <div class="popup-card">
      
      <!-- Header -->
      <div class="popup-header">
        <span class="header-icon">💳</span>
        <h2 class="header-title">Credit Card Statement</h2>
        <p class="header-subtitle">Time to pay your bill!</p>
      </div>

      <!-- Statement Summary -->
      <div class="statement-summary">
        <div class="summary-row total">
          <span class="summary-label">Total Balance Due</span>
          <span class="summary-value">${{ totalDebt.toFixed(2) }}</span>
        </div>
        <div class="summary-row" v-if="interestCharged > 0">
          <span class="summary-label">Interest Added ({{ interestRatePercent }}%)</span>
          <span class="summary-value interest">+${{ interestCharged.toFixed(2) }}</span>
        </div>
        <div class="summary-row minimum">
          <span class="summary-label">Minimum Payment</span>
          <span class="summary-value">${{ minimumPayment }}</span>
        </div>
      </div>

      <!-- Warning if missed payments -->
      <div v-if="missedPayments > 0" class="warning-box">
        <span class="warning-icon">⚠️</span>
        <div class="warning-content">
          <strong>{{ missedPayments }} Missed Payment{{ missedPayments > 1 ? 's' : '' }}!</strong>
          <p>Your credit score has dropped. Pay on time to rebuild it!</p>
        </div>
      </div>

      <!-- Credit Score Display -->
      <div class="credit-score-section">
        <span class="score-label">Your Credit Score</span>
        <div class="score-display" :class="scoreClass">
          <span class="score-value">{{ creditScore }}</span>
          <span class="score-rating">{{ scoreRating }}</span>
        </div>
      </div>

      <!-- Payment Options -->
      <div class="payment-section">
        <h3 class="section-title">💰 How do you want to pay?</h3>
        
        <!-- Available Funds -->
        <div class="funds-available">
          <div class="fund-item">
            <span class="fund-icon">💵</span>
            <span class="fund-label">My Money</span>
            <span class="fund-value">${{ balance }}</span>
          </div>
          <div class="fund-item">
            <span class="fund-icon">🛡️</span>
            <span class="fund-label">Emergency Fund</span>
            <span class="fund-value">${{ emergencyFund }}</span>
          </div>
        </div>

        <!-- Payment Sliders -->
        <div class="payment-sliders">
          <div class="slider-group">
            <div class="slider-header">
              <span>💵 From My Money</span>
              <span class="slider-value">${{ payFromBalance }}</span>
            </div>
            <input 
              type="range" 
              :min="0" 
              :max="maxFromBalance" 
              v-model.number="payFromBalance"
              class="payment-slider balance-slider"
            />
          </div>
          
          <div class="slider-group">
            <div class="slider-header">
              <span>🛡️ From Emergency Fund</span>
              <span class="slider-value">${{ payFromEmergency }}</span>
            </div>
            <input 
              type="range" 
              :min="0" 
              :max="maxFromEmergency" 
              v-model.number="payFromEmergency"
              class="payment-slider emergency-slider"
            />
            <p v-if="payFromEmergency > 0" class="emergency-warning">
              ⚠️ Using emergency fund for bills isn't ideal!
            </p>
          </div>
        </div>

        <!-- Payment Total -->
        <div class="payment-total">
          <span class="total-label">Total Payment:</span>
          <span class="total-value" :class="{ 'enough': totalPayment >= minimumPayment }">
            ${{ totalPayment }}
          </span>
          <span v-if="totalPayment < minimumPayment" class="total-warning">
            (Need at least ${{ minimumPayment }})
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button 
          class="btn btn-pay-full"
          @click="payFull"
          :disabled="!canPayFull"
        >
          <span class="btn-icon">✨</span>
          <span class="btn-text">Pay Full (${{ totalDebt.toFixed(2) }})</span>
        </button>
        
        <button 
          class="btn btn-pay-custom"
          @click="payCustom"
          :disabled="totalPayment < minimumPayment"
        >
          <span class="btn-icon">💳</span>
          <span class="btn-text">Pay ${{ totalPayment }}</span>
        </button>
        
        <button 
          class="btn btn-skip"
          @click="confirmSkip"
        >
          <span class="btn-icon">⏭️</span>
          <span class="btn-text">Skip Payment</span>
        </button>
      </div>

      <!-- Skip Confirmation -->
      <div v-if="showSkipConfirm" class="skip-confirm">
        <div class="skip-warning">
          <span class="skip-icon">🚨</span>
          <h4>Are you sure?</h4>
          <p>If you skip this payment:</p>
          <ul>
            <li>📈 <strong>+15% interest</strong> will be added to your balance</li>
            <li>📉 Your <strong>credit score will drop</strong> by 20 points</li>
            <li>😰 It gets <strong>harder to pay off</strong> over time</li>
          </ul>
        </div>
        <div class="skip-buttons">
          <button class="btn btn-cancel" @click="showSkipConfirm = false">
            Never mind, I'll pay
          </button>
          <button class="btn btn-confirm-skip" @click="skipPayment">
            Skip anyway 😬
          </button>
        </div>
      </div>

      <!-- Penny's Tip -->
      <div class="penny-tip">
        <img src="@/assets/images/kids/pig.png" class="penny-img" alt="Penny" />
        <div class="tip-content">
          <strong>Penny's Tip:</strong>
          <p>{{ currentTip }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { gameState } from '@/stores/gameState'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'paid', 'skipped'])

// State
const payFromBalance = ref(0)
const payFromEmergency = ref(0)
const showSkipConfirm = ref(false)

// Computed from gameState
const balance = computed(() => gameState.balance || 0)
const emergencyFund = computed(() => gameState.emergencyFund || 0)
const totalDebt = computed(() => gameState.creditCardDebt || 0)
const creditScore = computed(() => gameState.creditScore || 700)
const missedPayments = computed(() => gameState.missedPayments || 0)
const interestRatePercent = computed(() => Math.round((gameState.creditCardInterestRate || 0.18) * 100))

// Calculate interest charged this period
const interestCharged = computed(() => {
  if (totalDebt.value <= 0) return 0
  const monthlyRate = (gameState.creditCardInterestRate || 0.18) / 12
  return totalDebt.value * monthlyRate
})

const minimumPayment = computed(() => {
  return Math.min(totalDebt.value, Math.max(10, Math.round(totalDebt.value * 0.1)))
})

const totalPayment = computed(() => {
  return payFromBalance.value + payFromEmergency.value
})

const maxFromBalance = computed(() => {
  return Math.min(balance.value, totalDebt.value)
})

const maxFromEmergency = computed(() => {
  const remaining = totalDebt.value - payFromBalance.value
  return Math.min(emergencyFund.value, Math.max(0, remaining))
})

const canPayFull = computed(() => {
  return (balance.value + emergencyFund.value) >= totalDebt.value
})

// Credit Score Rating
const scoreClass = computed(() => {
  if (creditScore.value >= 750) return 'excellent'
  if (creditScore.value >= 650) return 'good'
  if (creditScore.value >= 550) return 'fair'
  return 'poor'
})

const scoreRating = computed(() => {
  if (creditScore.value >= 750) return 'Excellent'
  if (creditScore.value >= 650) return 'Good'
  if (creditScore.value >= 550) return 'Fair'
  return 'Poor'
})

// Tips
const tips = [
  "Always try to pay more than the minimum - interest adds up fast!",
  "Paying your full balance every month means no interest charges!",
  "Your credit score affects your future - protect it!",
  "Missing payments can haunt you for years. Pay what you can!",
  "A good credit score can save you thousands in the future!"
]

const currentTip = computed(() => {
  if (missedPayments.value > 0) {
    return "You've missed payments before. Try to pay at least the minimum to rebuild your credit!"
  }
  if (totalDebt.value > 100) {
    return "Your debt is getting high! Try to pay more than the minimum to avoid a debt spiral."
  }
  return tips[Math.floor(Math.random() * tips.length)]
})

// Reset sliders when popup opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Default to paying minimum from balance if possible
    payFromBalance.value = Math.min(balance.value, minimumPayment.value)
    payFromEmergency.value = 0
    showSkipConfirm.value = false
  }
})

// Methods
const payFull = () => {
  const totalOwed = totalDebt.value
  let fromBalance = Math.min(balance.value, totalOwed)
  let fromEmergency = totalOwed - fromBalance
  
  // Deduct from balance first
  gameState.balance -= fromBalance
  
  // Then from emergency fund if needed
  if (fromEmergency > 0) {
    gameState.emergencyFund -= fromEmergency
    gameState.emergencyFundUsed += fromEmergency
  }
  
  // Clear the debt
  gameState.creditCardDebt = 0
  gameState.missedPayments = 0
  
  // Boost credit score for paying in full
  gameState.creditScore = Math.min(850, gameState.creditScore + 10)
  
  // Track good decision
  gameState.teenGoodDecisions.push({
    type: 'paid_credit_card_full',
    amount: totalOwed,
    week: gameState.week
  })
  
  gameState.addSkill('responsibility', 5)
  gameState.addSkill('planning', 3)
  
  emit('paid', { amount: totalOwed, type: 'full' })
}

const payCustom = () => {
  const payment = totalPayment.value
  
  if (payment < minimumPayment.value) return
  
  // Deduct from balance
  gameState.balance -= payFromBalance.value
  
  // Deduct from emergency fund
  if (payFromEmergency.value > 0) {
    gameState.emergencyFund -= payFromEmergency.value
    gameState.emergencyFundUsed += payFromEmergency.value
  }
  
  // Reduce debt
  gameState.creditCardDebt = Math.max(0, gameState.creditCardDebt - payment)
  
  // Credit score improvement
  if (payment >= minimumPayment.value) {
    gameState.creditScore = Math.min(850, gameState.creditScore + 5)
    gameState.missedPayments = 0
  }
  
  // Track decision
  if (payment >= totalDebt.value * 0.5) {
    gameState.teenGoodDecisions.push({
      type: 'paid_credit_card_significant',
      amount: payment,
      week: gameState.week
    })
    gameState.addSkill('responsibility', 3)
  }
  
  emit('paid', { amount: payment, type: 'partial', remaining: gameState.creditCardDebt })
}

const confirmSkip = () => {
  showSkipConfirm.value = true
}

const skipPayment = () => {
  // Apply interest
  const interest = totalDebt.value * 0.15
  gameState.creditCardDebt += interest
  
  // Drop credit score
  gameState.creditScore = Math.max(300, gameState.creditScore - 20)
  gameState.missedPayments++
  
  // Track bad decision
  gameState.teenBadDecisions.push({
    type: 'missed_credit_payment',
    debt: gameState.creditCardDebt,
    interest: interest,
    week: gameState.week
  })
  
  gameState.addSkill('responsibility', -5)
  gameState.addSkill('planning', -3)
  
  emit('skipped', { 
    newDebt: gameState.creditCardDebt, 
    interestAdded: interest,
    newScore: gameState.creditScore 
  })
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.popup-card {
  background: white;
  border-radius: 32px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 4px solid #667eea;
  animation: popIn 0.3s ease;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.popup-header {
  text-align: center;
  margin-bottom: 24px;
}

.header-icon {
  font-size: 56px;
  display: block;
  margin-bottom: 8px;
}

.header-title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #2D3436;
  font-family: 'Comic Sans MS', cursive;
}

.header-subtitle {
  margin: 4px 0 0;
  color: #666;
  font-size: 16px;
}

.statement-summary {
  background: #F8F9FA;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #DDD;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 700;
}

.summary-row.total .summary-value {
  color: #FF6B6B;
  font-size: 24px;
}

.summary-row.minimum .summary-value {
  color: #667eea;
}

.summary-value.interest {
  color: #FF6B6B;
}

.warning-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #FFF3E0;
  border: 2px solid #FFB347;
  border-radius: 16px;
  margin-bottom: 20px;
}

.warning-icon {
  font-size: 32px;
}

.warning-content p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #666;
}

.credit-score-section {
  text-align: center;
  margin-bottom: 24px;
}

.score-label {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.score-display {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 32px;
  border-radius: 16px;
}

.score-display.excellent {
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border: 2px solid #4CAF50;
}

.score-display.good {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border: 2px solid #2196F3;
}

.score-display.fair {
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
  border: 2px solid #FF9800;
}

.score-display.poor {
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
  border: 2px solid #F44336;
}

.score-value {
  font-size: 36px;
  font-weight: 900;
  color: #2D3436;
}

.score-rating {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
}

.payment-section {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: #2D3436;
}

.funds-available {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.fund-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: #F8F9FA;
  border-radius: 12px;
}

.fund-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.fund-label {
  font-size: 12px;
  color: #666;
}

.fund-value {
  font-size: 18px;
  font-weight: 800;
  color: #4ECDC4;
}

.payment-sliders {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.slider-group {
  background: #F8F9FA;
  padding: 16px;
  border-radius: 12px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 600;
}

.slider-value {
  color: #667eea;
  font-weight: 800;
}

.payment-slider {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: #E0E0E0;
  border-radius: 4px;
  cursor: pointer;
}

.payment-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  background: #667eea;
  border-radius: 50%;
  cursor: grab;
}

.balance-slider::-webkit-slider-thumb {
  background: #4ECDC4;
}

.emergency-slider::-webkit-slider-thumb {
  background: #FF6B9D;
}

.emergency-warning {
  margin: 8px 0 0;
  font-size: 12px;
  color: #FF6B6B;
}

.payment-total {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

.total-label {
  font-size: 16px;
}

.total-value {
  font-size: 28px;
  font-weight: 900;
}

.total-value.enough {
  color: #90EE90;
}

.total-warning {
  font-size: 12px;
  opacity: 0.8;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-pay-full {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
}

.btn-pay-full:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.btn-pay-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-pay-custom:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-skip {
  background: #F5F5F5;
  color: #666;
  border: 2px solid #DDD;
}

.btn-skip:hover {
  background: #FFEBEE;
  border-color: #FF6B6B;
  color: #FF6B6B;
}

.btn-icon {
  font-size: 20px;
}

.skip-confirm {
  background: #FFEBEE;
  border: 2px solid #FF6B6B;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.skip-warning {
  text-align: center;
  margin-bottom: 16px;
}

.skip-icon {
  font-size: 40px;
}

.skip-warning h4 {
  margin: 8px 0;
  color: #FF6B6B;
}

.skip-warning ul {
  text-align: left;
  margin: 12px 0;
  padding-left: 20px;
}

.skip-warning li {
  margin: 8px 0;
  font-size: 14px;
}

.skip-buttons {
  display: flex;
  gap: 12px;
}

.btn-cancel {
  flex: 1;
  background: #4CAF50;
  color: white;
}

.btn-confirm-skip {
  flex: 1;
  background: #FF6B6B;
  color: white;
}

.penny-tip {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #FFF8E1;
  border: 2px solid #FFE66D;
  border-radius: 16px;
}

.penny-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.tip-content {
  flex: 1;
}

.tip-content strong {
  color: #FF6B9D;
}

.tip-content p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #666;
}

@media (max-width: 500px) {
  .popup-card {
    padding: 20px;
    border-radius: 24px;
  }
  
  .funds-available {
    flex-direction: column;
  }
  
  .skip-buttons {
    flex-direction: column;
  }
}
</style>