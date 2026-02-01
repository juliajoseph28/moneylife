<!-- src/components/PennyAdvice.vue -->
<template>
  <transition name="penny-pop">
    <div v-if="show" class="penny-overlay" @click.self="$emit('close')">
      <div class="penny-popup">
        
        <!-- Penny Header -->
        <div class="penny-header">
          <img src="@/assets/images/kids/pig.png" class="penny-image" alt="Penny" />
          <div class="speech-indicator">💬</div>
        </div>
        
        <!-- Main Message -->
        <div class="penny-message">
          <h2 class="message-title">{{ title }}</h2>
          <p class="message-text">{{ personalizedMessage }}</p>
        </div>
        
        <!-- Money Growth Visualization -->
        <div class="growth-section">
          <h3 class="growth-title">🌱 Watch Your Money Grow!</h3>
          <p class="growth-subtitle">If you save ${{ weeklyIncome }} every week:</p>
          
          <div class="growth-timeline">
            <div 
              v-for="(week, index) in savingsTimeline" 
              :key="index"
              class="timeline-row"
              :class="{ 'highlight': week.canAfford }"
            >
              <span class="week-label">{{ week.weekLabel }}:</span>
              <div class="coins-display">
                <span v-for="n in Math.min(week.coins, 10)" :key="n" class="coin">💵</span>
                <span v-if="week.coins > 10" class="more-coins">...</span>
              </div>
              <span class="amount">${{ week.total }}</span>
              <span v-if="week.canAfford && week.isFirst" class="afford-badge">✅ Can afford!</span>
            </div>
          </div>
          
          <!-- Goal Message -->
          <div class="goal-message" :class="goalMessageType">
            <span class="goal-icon">{{ goalIcon }}</span>
            <p>{{ goalMessage }}</p>
          </div>
        </div>
        
        <!-- Encouragement -->
        <div class="encouragement">
          <p class="tip">💡 <strong>Penny's Tip:</strong> {{ tip }}</p>
        </div>
        
        <!-- Action Buttons -->
        <div class="action-buttons">
          <button @click="$emit('close')" class="got-it-btn">
            Got it! I'll save up! 💪
          </button>
          <button @click="$emit('choose-different')" class="different-btn">
            Choose Something Else 🔄
          </button>
        </div>
        
        <!-- Need More Help Button -->
        <button @click="$emit('open-chat')" class="help-btn">
          🐷 Need more help? Ask Penny AI 💬
        </button>
        
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

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
    default: 5
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

defineEmits(['close', 'choose-different', 'open-chat'])

const amountNeeded = computed(() => {
  return Math.max(0, props.itemCost - props.currentBalance)
})

const weeksToAfford = computed(() => {
  if (amountNeeded.value <= 0) return 0
  return Math.ceil(amountNeeded.value / props.weeklyIncome)
})

const title = computed(() => {
  const titles = [
    "Oops! Not Enough Coins! 🪙",
    "Hold On a Second! ✋",
    "Let's Think About This! 🤔",
    "Wait! I Have an Idea! 💡",
    "Hmm, Let's Do Some Math! 🧮"
  ]
  return titles[Math.floor(Math.random() * titles.length)]
})

const personalizedMessage = computed(() => {
  const { itemName, itemCost, currentBalance } = props
  const needed = amountNeeded.value
  
  const messages = [
    `You want "${itemName}" for $${itemCost}, but you only have $${currentBalance}. You need $${needed} more!`,
    `"${itemName}" costs $${itemCost}. With $${currentBalance} in your pocket, you're $${needed} short. But don't worry - I have a plan!`,
    `Uh oh! "${itemName}" is $${itemCost} and you have $${currentBalance}. That's $${needed} more than you have right now.`,
    `I know "${itemName}" sounds fun! It's $${itemCost}, but you've got $${currentBalance}. Let's figure out how to save that extra $${needed}!`
  ]
  
  return messages[Math.floor(Math.random() * messages.length)]
})

const savingsTimeline = computed(() => {
  const timeline = []
  const income = props.weeklyIncome
  let runningTotal = Math.max(0, props.currentBalance)
  let foundFirst = false
  
  timeline.push({
    weekLabel: 'Now',
    coins: Math.floor(runningTotal / 2),
    total: runningTotal,
    canAfford: runningTotal >= props.itemCost,
    isFirst: false
  })
  
  const maxWeeks = Math.min(weeksToAfford.value + 2, 8)
  
  for (let i = 1; i <= maxWeeks; i++) {
    runningTotal += income
    const canAfford = runningTotal >= props.itemCost
    const isFirst = canAfford && !foundFirst
    
    if (isFirst) foundFirst = true
    
    timeline.push({
      weekLabel: `Week ${i}`,
      coins: Math.floor(runningTotal / 2),
      total: runningTotal,
      canAfford: canAfford,
      isFirst: isFirst
    })
  }
  
  return timeline
})

const goalMessage = computed(() => {
  const weeks = weeksToAfford.value
  const { itemName, goalName, goalCost, currentBalance, weeklyIncome } = props
  
  if (weeks === 0) {
    return `Wait, you CAN afford this! You have $${currentBalance}!`
  } else if (weeks === 1) {
    return `Just ONE more week of saving and "${itemName}" is yours! So close!`
  } else if (weeks <= 3) {
    return `In just ${weeks} weeks, you'll have enough for "${itemName}"! That's not long at all! 🎯`
  } else if (weeks <= 6) {
    return `${weeks} weeks of patience and "${itemName}" will be yours! Plus, you might find it on sale! ⏰`
  } else {
    const weeksToGoal = Math.ceil((goalCost - Math.max(0, currentBalance)) / weeklyIncome)
    if (weeksToGoal < weeks) {
      return `Hmm, this would take ${weeks} weeks... but "${goalName}" is only ${weeksToGoal} weeks away! Maybe focus on your goal first? 🤔`
    }
    return `This would take ${weeks} weeks. That's a while! Maybe save for something smaller first, or find a cheaper option?`
  }
})

const goalMessageType = computed(() => {
  const weeks = weeksToAfford.value
  if (weeks <= 2) return 'positive'
  if (weeks <= 5) return 'neutral'
  return 'warning'
})

const goalIcon = computed(() => {
  const weeks = weeksToAfford.value
  if (weeks <= 2) return '🎯'
  if (weeks <= 5) return '⏰'
  return '🤔'
})

const tip = computed(() => {
  const tips = [
    "Every time you don't spend, your future self says THANK YOU!",
    "Saving is like planting seeds - watch your money garden grow! 🌱",
    "The best things in life are worth waiting for!",
    "Smart savers become happy buyers later!",
    "You can't buy everything, but you CAN save for what matters most!",
    "Patience is your money superpower! ⚡",
    "A dollar saved today is a dollar plus more tomorrow!",
    "Rich people got rich by NOT spending all their money!",
    "Waiting for things makes them even more exciting when you get them!",
    "Your piggy bank is cheering for you! 🐷"
  ]
  return tips[Math.floor(Math.random() * tips.length)]
})
</script>

<style scoped>
.penny-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.penny-popup {
  background: linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 100%);
  border-radius: 32px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 4px solid #FFE66D;
  position: relative;
  animation: popIn 0.4s ease;
}

@keyframes popIn {
  0% { transform: scale(0.8) translateY(20px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

.penny-header {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
}

.penny-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  animation: pennyBounce 2s ease-in-out infinite;
}

@keyframes pennyBounce {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

.speech-indicator {
  position: absolute;
  top: 0;
  right: 30%;
  font-size: 28px;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.penny-message {
  text-align: center;
  margin-bottom: 24px;
}

.message-title {
  font-size: 24px;
  font-weight: 800;
  color: #FF6B9D;
  margin: 0 0 12px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.message-text {
  font-size: 16px;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.growth-section {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  border: 3px dashed #4ECDC4;
}

.growth-title {
  font-size: 20px;
  font-weight: 800;
  color: #2D3436;
  margin: 0 0 4px;
  text-align: center;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.growth-subtitle {
  font-size: 14px;
  color: #888;
  margin: 0 0 16px;
  text-align: center;
}

.growth-timeline {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timeline-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #F8F8F8;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.timeline-row.highlight {
  background: linear-gradient(135deg, #E8FFF8 0%, #D0F5E8 100%);
  border: 2px solid #4ECDC4;
  transform: scale(1.02);
}

.week-label {
  font-size: 13px;
  font-weight: 700;
  color: #666;
  min-width: 55px;
}

.coins-display {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  align-items: center;
}

.coin {
  font-size: 14px;
}

.more-coins {
  font-size: 12px;
  color: #888;
  margin-left: 2px;
}

.amount {
  font-size: 16px;
  font-weight: 800;
  color: #4ECDC4;
  min-width: 45px;
  text-align: right;
}

.afford-badge {
  font-size: 11px;
  font-weight: 700;
  color: white;
  background: #4ECDC4;
  padding: 4px 10px;
  border-radius: 10px;
  white-space: nowrap;
}

.goal-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  margin-top: 16px;
}

.goal-message.positive {
  background: #E8FFF8;
  border: 2px solid #4ECDC4;
}

.goal-message.neutral {
  background: #FFF8E8;
  border: 2px solid #FFE66D;
}

.goal-message.warning {
  background: #FFF0F5;
  border: 2px solid #FFB6C1;
}

.goal-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.goal-message p {
  margin: 0;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  font-weight: 500;
}

.encouragement {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
}

.tip {
  margin: 0;
  color: white;
  font-size: 14px;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.got-it-btn {
  width: 100%;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 18px 32px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.got-it-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(78, 205, 196, 0.4);
}

.different-btn {
  width: 100%;
  background: white;
  color: #667eea;
  border: 3px solid #667eea;
  border-radius: 20px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.different-btn:hover {
  background: #F0F0FF;
  transform: translateY(-2px);
}

.help-btn {
  width: 100%;
  margin-top: 16px;
  padding: 14px 24px;
  background: #FFF8F0;
  border: 2px dashed #FFE66D;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.help-btn:hover {
  background: #FFE66D;
  color: #2D3436;
  border-style: solid;
}

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
  transform: scale(0.8) translateY(20px);
}

@media (max-width: 500px) {
  .penny-popup {
    padding: 24px 20px;
  }
  
  .penny-image {
    width: 80px;
    height: 80px;
  }
  
  .message-title {
    font-size: 20px;
  }
  
  .timeline-row {
    padding: 8px 10px;
  }
  
  .week-label {
    min-width: 45px;
    font-size: 12px;
  }
}
</style> 