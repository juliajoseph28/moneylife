<!-- src/components/PennyAdviceTeen.vue -->
<template>
  <transition name="penny-pop">
    <div v-if="show" class="penny-overlay" @click.self="$emit('close')">
      <div class="penny-popup teen-version">
        
        <!-- Header -->
        <div class="popup-header">
          <div class="header-icon">💳</div>
          <h2 class="header-title">{{ title }}</h2>
        </div>
        
        <!-- Main Message -->
        <div class="message-section">
          <p class="main-message">{{ personalizedMessage }}</p>
          
          <!-- Financial Summary -->
          <div class="financial-summary">
            <div class="summary-item">
              <span class="summary-label">Item Cost:</span>
              <span class="summary-value cost">${{ itemCost }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Your Balance:</span>
              <span class="summary-value balance">${{ currentBalance }}</span>
            </div>
            <div class="summary-item highlight">
              <span class="summary-label">Short by:</span>
              <span class="summary-value short">${{ amountNeeded }}</span>
            </div>
          </div>
        </div>
        
        <!-- Options Section -->
        <div class="options-section">
          <h3 class="options-title">How do you want to handle this?</h3>
          
          <!-- Option 1: Credit Card -->
          <div 
            class="option-card credit-card"
            :class="{ 'selected': selectedOption === 'credit' }"
            @click="selectOption('credit')"
          >
            <div class="option-header">
              <span class="option-icon">💳</span>
              <span class="option-name">Use Credit Card</span>
              <span class="option-badge warning">Debt</span>
            </div>
            <div class="option-details">
              <p class="option-description">
                Borrow <strong>${{ amountNeeded }}</strong> now, pay back later with interest.
              </p>
              <div class="option-breakdown">
                <div class="breakdown-row">
                  <span>Amount borrowed:</span>
                  <span>${{ amountNeeded }}</span>
                </div>
                <div class="breakdown-row">
                  <span>Current debt:</span>
                  <span>${{ currentDebt }}</span>
                </div>
                <div class="breakdown-row highlight-bad">
                  <span>New total debt:</span>
                  <span>${{ projectedDebt }}</span>
                </div>
                <div class="breakdown-row interest">
                  <span>+ Interest (18% APR):</span>
                  <span>~${{ projectedInterest }}/month</span>
                </div>
              </div>
              <div class="warning-box">
                <span class="warning-icon">⚠️</span>
                <span>Debt grows over time! The longer you wait to pay, the more you owe.</span>
              </div>
            </div>
          </div>
          
          <!-- Option 2: Emergency Fund -->
          <div 
            class="option-card emergency-fund"
            :class="{ 
              'selected': selectedOption === 'emergency',
              'disabled': emergencyFund < amountNeeded 
            }"
            @click="emergencyFund >= amountNeeded && selectOption('emergency')"
          >
            <div class="option-header">
              <span class="option-icon">🏦</span>
              <span class="option-name">Use Emergency Fund</span>
              <span class="option-badge" :class="emergencyFund >= amountNeeded ? 'caution' : 'disabled'">
                ${{ emergencyFund }} available
              </span>
            </div>
            <div class="option-details">
              <p class="option-description" v-if="emergencyFund >= amountNeeded">
                Use <strong>${{ amountNeeded }}</strong> from your emergency savings.
              </p>
              <p class="option-description disabled-text" v-else>
                Not enough in emergency fund. You need ${{ amountNeeded }} but only have ${{ emergencyFund }}.
              </p>
              <div class="option-breakdown" v-if="emergencyFund >= amountNeeded">
                <div class="breakdown-row">
                  <span>Current fund:</span>
                  <span>${{ emergencyFund }}</span>
                </div>
                <div class="breakdown-row">
                  <span>Amount to use:</span>
                  <span>-${{ amountNeeded }}</span>
                </div>
                <div class="breakdown-row highlight-caution">
                  <span>Remaining fund:</span>
                  <span>${{ emergencyFund - amountNeeded }}</span>
                </div>
              </div>
              <div class="warning-box caution" v-if="emergencyFund >= amountNeeded">
                <span class="warning-icon">💡</span>
                <span>Emergency funds are for unexpected needs like car repairs or medical bills. Is "{{ itemName }}" really an emergency?</span>
              </div>
              <!-- Emergency Fund Progress Bar -->
              <div class="fund-progress" v-if="emergencyFund > 0">
                <div class="fund-bar">
                  <div 
                    class="fund-fill" 
                    :style="{ width: (emergencyFund / 50) * 100 + '%' }"
                    :class="{ 'low': emergencyFund < 20 }"
                  ></div>
                </div>
                <span class="fund-label">{{ Math.round((emergencyFund / 50) * 100) }}% of recommended $50</span>
              </div>
            </div>
          </div>
          
          <!-- Option 3: Save Up (Recommended) -->
          <div 
            class="option-card save-up recommended"
            :class="{ 'selected': selectedOption === 'save' }"
            @click="selectOption('save')"
          >
            <div class="option-header">
              <span class="option-icon">💪</span>
              <span class="option-name">I'll Save Up</span>
              <span class="option-badge recommended">Recommended</span>
            </div>
            <div class="option-details">
              <p class="option-description">
                Wait <strong>{{ weeksToAfford }} week{{ weeksToAfford !== 1 ? 's' : '' }}</strong> and buy it without debt or draining savings.
              </p>
              <div class="savings-timeline">
                <div 
                  v-for="(week, index) in savingsTimeline.slice(0, 4)" 
                  :key="index"
                  class="timeline-row"
                  :class="{ 'can-afford': week.canAfford }"
                >
                  <span class="week-label">{{ week.weekLabel }}</span>
                  <div class="week-bar">
                    <div 
                      class="week-fill" 
                      :style="{ width: Math.min(100, (week.total / itemCost) * 100) + '%' }"
                    ></div>
                  </div>
                  <span class="week-amount">${{ week.total }}</span>
                  <span v-if="week.canAfford && week.isFirst" class="afford-badge">✓ Can buy!</span>
                </div>
              </div>
              <div class="benefit-box">
                <span class="benefit-icon">🎯</span>
                <span>No debt, no dipping into emergency savings, and you'll feel great buying it!</span>
              </div>
            </div>
          </div>
          
          <!-- Option 4: Choose Something Else -->
          <button class="option-btn secondary" @click="$emit('choose-different')">
            🔄 Choose Something Else
          </button>
        </div>
        
        <!-- Action Button -->
        <div class="action-section" v-if="selectedOption">
          <button 
            class="confirm-btn"
            :class="confirmButtonClass"
            @click="confirmChoice"
          >
            {{ confirmButtonText }}
          </button>
          <p class="confirm-note">{{ confirmNote }}</p>
        </div>
        
        <!-- Penny's Tip -->
        <div class="penny-tip-section">
          <div class="tip-content">
            <img src="@/assets/images/kids/pig.png" class="penny-avatar" alt="Penny" />
            <div class="tip-bubble">
              <p><strong>💡 Penny's Tip:</strong> {{ currentTip }}</p>
            </div>
          </div>
        </div>
        
        <!-- Help Button -->
        <button @click="$emit('open-chat')" class="help-btn">
          🤖 Need more help? Chat with Penny AI 💬
        </button>
        
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  itemName: {
    type: String,
    default: 'this item'
  },
  itemCost: {
    type: Number,
    default: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  weeklyIncome: {
    type: Number,
    default: 15
  },
  emergencyFund: {
    type: Number,
    default: 50
  },
  currentDebt: {
    type: Number,
    default: 0
  },
  goalName: {
    type: String,
    default: 'your goal'
  },
  goalCost: {
    type: Number,
    default: 100
  }
})

const emit = defineEmits(['close', 'choose-different', 'open-chat', 'use-credit', 'use-emergency', 'save-up'])

const selectedOption = ref(null)

// Computed values
const amountNeeded = computed(() => {
  return Math.max(0, props.itemCost - props.currentBalance)
})

const weeksToAfford = computed(() => {
  if (amountNeeded.value <= 0) return 0
  return Math.ceil(amountNeeded.value / props.weeklyIncome)
})

const projectedDebt = computed(() => {
  return props.currentDebt + amountNeeded.value
})

const projectedInterest = computed(() => {
  const monthlyRate = 0.18 / 12
  return Math.round(projectedDebt.value * monthlyRate * 100) / 100
})

const title = computed(() => {
  const titles = [
    "Hold Up! Let's Think This Through 🤔",
    "Budget Check! ✋",
    "Money Decision Time 💭",
    "Let's Look at Your Options 📊"
  ]
  return titles[Math.floor(Math.random() * titles.length)]
})

const personalizedMessage = computed(() => {
  return `You want "${props.itemName}" for $${props.itemCost}, but you only have $${props.currentBalance}. You're $${amountNeeded.value} short. Here are your options:`
})

const savingsTimeline = computed(() => {
  const timeline = []
  let runningTotal = Math.max(0, props.currentBalance)
  let foundFirst = false
  
  timeline.push({
    weekLabel: 'Now',
    total: runningTotal,
    canAfford: runningTotal >= props.itemCost,
    isFirst: false
  })
  
  const maxWeeks = Math.min(weeksToAfford.value + 1, 6)
  
  for (let i = 1; i <= maxWeeks; i++) {
    runningTotal += props.weeklyIncome
    const canAfford = runningTotal >= props.itemCost
    const isFirst = canAfford && !foundFirst
    
    if (isFirst) foundFirst = true
    
    timeline.push({
      weekLabel: `Week ${i}`,
      total: runningTotal,
      canAfford: canAfford,
      isFirst: isFirst
    })
  }
  
  return timeline
})

const confirmButtonClass = computed(() => {
  switch (selectedOption.value) {
    case 'credit': return 'danger'
    case 'emergency': return 'caution'
    case 'save': return 'success'
    default: return ''
  }
})

const confirmButtonText = computed(() => {
  switch (selectedOption.value) {
    case 'credit': return '💳 Charge to Credit Card'
    case 'emergency': return '🏦 Use Emergency Fund'
    case 'save': return '💪 I\'ll Save Up!'
    default: return 'Select an option'
  }
})

const confirmNote = computed(() => {
  switch (selectedOption.value) {
    case 'credit': return 'You\'ll owe $' + projectedDebt.value + ' total on your credit card'
    case 'emergency': return 'You\'ll have $' + (props.emergencyFund - amountNeeded.value) + ' left for real emergencies'
    case 'save': return 'Smart choice! You\'ll own it debt-free in ' + weeksToAfford.value + ' week(s)'
    default: return ''
  }
})

const currentTip = computed(() => {
  const tips = [
    "Credit cards can be useful, but paying interest means you pay MORE than the original price!",
    "Emergency funds should be for real emergencies - like car repairs or medical bills, not wants.",
    "The best feeling? Buying something you saved for with ZERO debt!",
    "Every dollar of debt is a dollar (plus interest) you can't spend on other things.",
    "Rich people stay rich by avoiding unnecessary debt.",
    "Delayed gratification is a superpower - waiting makes getting things even sweeter!"
  ]
  return tips[Math.floor(Math.random() * tips.length)]
})

// Methods
const selectOption = (option) => {
  selectedOption.value = option
}

const confirmChoice = () => {
  switch (selectedOption.value) {
    case 'credit':
      emit('use-credit', amountNeeded.value)
      break
    case 'emergency':
      emit('use-emergency', amountNeeded.value)
      break
    case 'save':
      emit('save-up')
      emit('close')
      break
  }
}
</script>

<style scoped>
.penny-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.penny-popup.teen-version {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24px;
  padding: 28px;
  max-width: 560px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 2px solid #4a4a6a;
  color: #fff;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header */
.popup-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #4a4a6a;
}

.header-icon {
  font-size: 32px;
}

.header-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}

/* Message Section */
.message-section {
  margin-bottom: 24px;
}

.main-message {
  font-size: 15px;
  color: #b8b8d1;
  line-height: 1.6;
  margin: 0 0 16px;
}

.financial-summary {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.summary-item {
  flex: 1;
  min-width: 100px;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px 16px;
  border-radius: 12px;
  text-align: center;
}

.summary-item.highlight {
  background: rgba(255, 107, 107, 0.15);
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.summary-label {
  display: block;
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 20px;
  font-weight: 700;
}

.summary-value.cost { color: #ff6b9d; }
.summary-value.balance { color: #4ecdc4; }
.summary-value.short { color: #ff6b6b; }

/* Options Section */
.options-section {
  margin-bottom: 20px;
}

.options-title {
  font-size: 14px;
  font-weight: 600;
  color: #b8b8d1;
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.option-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid #3a3a5a;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-card:hover:not(.disabled) {
  border-color: #6c63ff;
  background: rgba(108, 99, 255, 0.1);
}

.option-card.selected {
  border-color: #6c63ff;
  background: rgba(108, 99, 255, 0.15);
}

.option-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.option-card.recommended {
  border-color: #4ecdc4;
}

.option-card.recommended:hover {
  border-color: #4ecdc4;
  background: rgba(78, 205, 196, 0.15);
}

.option-card.recommended.selected {
  background: rgba(78, 205, 196, 0.2);
}

/* Option Header */
.option-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.option-icon {
  font-size: 24px;
}

.option-name {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  flex: 1;
}

.option-badge {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.option-badge.warning {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.option-badge.caution {
  background: rgba(255, 183, 77, 0.2);
  color: #ffb74d;
}

.option-badge.disabled {
  background: rgba(150, 150, 150, 0.2);
  color: #999;
}

.option-badge.recommended {
  background: rgba(78, 205, 196, 0.2);
  color: #4ecdc4;
}

/* Option Details */
.option-details {
  padding-left: 34px;
}

.option-description {
  font-size: 14px;
  color: #b8b8d1;
  margin: 0 0 12px;
  line-height: 1.5;
}

.option-description.disabled-text {
  color: #666;
  font-style: italic;
}

.option-breakdown {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 6px 0;
  color: #999;
}

.breakdown-row span:last-child {
  color: #fff;
  font-weight: 600;
}

.breakdown-row.highlight-bad span:last-child {
  color: #ff6b6b;
}

.breakdown-row.highlight-caution span:last-child {
  color: #ffb74d;
}

.breakdown-row.interest {
  border-top: 1px dashed #3a3a5a;
  margin-top: 6px;
  padding-top: 10px;
  color: #ff6b6b;
}

.breakdown-row.interest span:last-child {
  color: #ff6b6b;
}

/* Warning/Benefit Boxes */
.warning-box, .benefit-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.5;
}

.warning-box {
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.2);
  color: #ff9999;
}

.warning-box.caution {
  background: rgba(255, 183, 77, 0.1);
  border: 1px solid rgba(255, 183, 77, 0.2);
  color: #ffcc80;
}

.benefit-box {
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid rgba(78, 205, 196, 0.2);
  color: #80deea;
}

.warning-icon, .benefit-icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* Emergency Fund Progress */
.fund-progress {
  margin-top: 12px;
}

.fund-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
}

.fund-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ecdc4, #44a08d);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.fund-fill.low {
  background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
}

.fund-label {
  font-size: 11px;
  color: #888;
}

/* Savings Timeline */
.savings-timeline {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.timeline-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.timeline-row.can-afford {
  background: rgba(78, 205, 196, 0.15);
  border: 1px solid rgba(78, 205, 196, 0.3);
}

.week-label {
  font-size: 12px;
  font-weight: 600;
  color: #888;
  min-width: 50px;
}

.week-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.week-fill {
  height: 100%;
  background: linear-gradient(90deg, #6c63ff, #a855f7);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.timeline-row.can-afford .week-fill {
  background: linear-gradient(90deg, #4ecdc4, #44a08d);
}

.week-amount {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  min-width: 40px;
  text-align: right;
}

.afford-badge {
  font-size: 11px;
  color: #4ecdc4;
  font-weight: 600;
}

/* Secondary Button */
.option-btn.secondary {
  width: 100%;
  background: transparent;
  border: 2px dashed #4a4a6a;
  color: #888;
  padding: 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-btn.secondary:hover {
  border-color: #6c63ff;
  color: #fff;
  background: rgba(108, 99, 255, 0.1);
}

/* Action Section */
.action-section {
  margin-bottom: 20px;
  text-align: center;
}

.confirm-btn {
  width: 100%;
  padding: 18px 32px;
  border: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn.danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  color: white;
}

.confirm-btn.caution {
  background: linear-gradient(135deg, #ffb74d 0%, #ff9800 100%);
  color: white;
}

.confirm-btn.success {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
}

.confirm-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.confirm-note {
  margin: 12px 0 0;
  font-size: 12px;
  color: #888;
}

/* Penny Tip Section */
.penny-tip-section {
  margin-bottom: 16px;
}

.tip-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.penny-avatar {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.tip-bubble {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid #3a3a5a;
}

.tip-bubble p {
  margin: 0;
  font-size: 13px;
  color: #b8b8d1;
  line-height: 1.5;
}

/* Help Button */
.help-btn {
  width: 100%;
  padding: 14px;
  background: transparent;
  border: 2px dashed #4a4a6a;
  border-radius: 12px;
  color: #888;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.help-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #6c63ff;
  color: #fff;
}

/* Transitions */
.penny-pop-enter-active,
.penny-pop-leave-active {
  transition: all 0.3s ease;
}

.penny-pop-enter-from,
.penny-pop-leave-to {
  opacity: 0;
}

.penny-pop-enter-from .penny-popup,
.penny-pop-leave-to .penny-popup {
  transform: scale(0.9) translateY(20px);
}

/* Responsive */
@media (max-width: 500px) {
  .penny-popup.teen-version {
    padding: 20px;
  }
  
  .financial-summary {
    flex-direction: column;
  }
  
  .option-details {
    padding-left: 0;
  }
}
</style>