<!-- src/components/ValuePickerCard.vue -->
<template>
  <div class="value-picker-card">
    <div class="card">
      <!-- Header -->
      <div class="card-header">
        <div class="scenario-header">
          <span class="week-badge">📅 Week {{ week }}</span>
          <span class="type-badge">🛒 Smart Shopping</span>
        </div>
        <div class="title-section">
          <span class="title-emoji">{{ scenario.emoji || '🎒' }}</span>
          <h2 class="card-title">{{ scenario.title }}</h2>
          <p class="card-description">{{ scenario.description }}</p>
        </div>
      </div>

      <!-- Product Options -->
      <div class="products-grid">
        <div 
          v-for="product in scenario.products" 
          :key="product.id"
          class="product-card"
          :class="{ 
            'selected': selectedProduct?.id === product.id,
            'best-value': product.isBestValue,
            'cant-afford': !canAfford(product.price)
          }"
          @click="selectProduct(product)"
        >
          <!-- Price Tag -->
          <div class="price-tag" :class="getPriceClass(product.price)">
            <span class="price-icon">💰</span>
            <span class="price-amount">${{ product.price }}</span>
          </div>

          <!-- Product Image/Emoji -->
          <div class="product-visual">
            <span class="product-emoji">{{ product.emoji }}</span>
            <span class="product-name">{{ product.name }}</span>
          </div>

          <!-- Quality Stars -->
          <div class="quality-section">
            <div class="stars">
              <span v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= product.quality }">
                {{ n <= product.quality ? '⭐' : '☆' }}
              </span>
            </div>
            <span class="quality-label">Quality</span>
          </div>

          <!-- Stats -->
          <div class="product-stats">
            <div class="stat-row">
              <span class="stat-icon">⏰</span>
              <span class="stat-label">Lasts:</span>
              <span class="stat-value">{{ product.durability }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-icon">✨</span>
              <span class="stat-label">Features:</span>
              <span class="stat-value">{{ product.features }}</span>
            </div>
            <div class="stat-row highlight">
              <span class="stat-icon">📊</span>
              <span class="stat-label">Cost/Year:</span>
              <span class="stat-value" :class="getCostPerYearClass(product)">${{ calculateCostPerYear(product) }}</span>
            </div>
          </div>

          <!-- Best Value Badge -->
          <div v-if="product.isBestValue" class="best-value-badge">
            👑 Best Value!
          </div>

          <!-- Can't Afford Warning -->
          <div v-if="!canAfford(product.price)" class="cant-afford-overlay">
            <span class="cant-afford-icon">🚫</span>
            <span class="cant-afford-text">Need ${{ product.price - currentBalance }} more</span>
          </div>
        </div>
      </div>

      <!-- Cost Comparison Visualization -->
      <div class="cost-comparison" v-if="selectedProduct">
        <h3 class="comparison-title">📊 Let's Compare Over Time!</h3>
        <div class="comparison-chart">
          <div 
            v-for="product in scenario.products" 
            :key="'chart-' + product.id"
            class="chart-bar-container"
          >
            <span class="chart-label">{{ product.name }}</span>
            <div class="chart-bar-wrapper">
              <div 
                class="chart-bar" 
                :style="{ width: getBarWidth(product) + '%' }"
                :class="{ 'best': product.isBestValue, 'selected': selectedProduct?.id === product.id }"
              >
                <span class="bar-value">${{ calculateTotalCost(product) }}</span>
              </div>
            </div>
            <span class="chart-duration">over {{ getComparisonYears() }} years</span>
          </div>
        </div>
        <p class="comparison-insight">
          💡 <strong>{{ getComparisonInsight() }}</strong>
        </p>
      </div>

      <!-- Balance Reminder -->
      <div class="balance-reminder">
        <span class="balance-icon">🪙</span>
        <span class="balance-text">Your balance: <strong>${{ currentBalance }}</strong></span>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button 
          v-if="selectedProduct && canAfford(selectedProduct.price)"
          @click="confirmPurchase"
          class="confirm-btn"
          :class="{ 'best-choice': selectedProduct.isBestValue }"
        >
          <span>Buy {{ selectedProduct.name }} for ${{ selectedProduct.price }}</span>
          <span class="btn-emoji">🛒</span>
        </button>
        
        <button 
          v-else-if="selectedProduct && !canAfford(selectedProduct.price)"
          @click="showSaveAdvice"
          class="save-btn"
        >
          <span>I need to save more! 💪</span>
        </button>

        <button @click="skipPurchase" class="skip-btn">
          Skip for now 🤔
        </button>
      </div>
    </div>

    <!-- Outcome Popup -->
    <div v-if="showOutcome" class="outcome-overlay" @click.self="closeOutcome">
      <div class="outcome-popup" :class="outcomeType">
        <div class="outcome-icon">{{ outcomeEmoji }}</div>
        <h2 class="outcome-title">{{ outcomeTitle }}</h2>
        <p class="outcome-message">{{ outcomeMessage }}</p>
        
        <div class="outcome-effects">
          <div v-if="balanceChange" class="effect-item" :class="balanceChange > 0 ? 'positive' : 'negative'">
            <span class="effect-icon">💰</span>
            <span class="effect-value">{{ balanceChange > 0 ? '+' : '' }}${{ balanceChange }}</span>
          </div>
          <div v-if="skillChange" class="effect-item positive">
            <span class="effect-icon">📊</span>
            <span class="effect-value">+{{ skillChange }} Planning</span>
          </div>
        </div>

        <div class="lesson-box">
          <span class="lesson-icon">💡</span>
          <p class="lesson-text">{{ lessonText }}</p>
        </div>

        <button @click="closeOutcome" class="next-btn">
          Continue →
        </button>
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

const emit = defineEmits(['complete', 'skip'])

// State
const selectedProduct = ref(null)
const showOutcome = ref(false)
const outcomeType = ref('neutral')
const outcomeEmoji = ref('📦')
const outcomeTitle = ref('')
const outcomeMessage = ref('')
const balanceChange = ref(0)
const skillChange = ref(0)
const lessonText = ref('')

// Computed
const week = computed(() => gameState.week || 1)
const currentBalance = computed(() => gameState.balance || 0)

// Methods
const canAfford = (price) => currentBalance.value >= price

const getPriceClass = (price) => {
  const maxPrice = Math.max(...props.scenario.products.map(p => p.price))
  const minPrice = Math.min(...props.scenario.products.map(p => p.price))
  
  if (price === minPrice) return 'cheap'
  if (price === maxPrice) return 'expensive'
  return 'medium'
}

const getCostPerYearClass = (product) => {
  const costPerYear = calculateCostPerYear(product)
  const allCosts = props.scenario.products.map(p => calculateCostPerYear(p))
  const minCost = Math.min(...allCosts)
  
  if (costPerYear === minCost) return 'best-cost'
  return ''
}

const calculateCostPerYear = (product) => {
  const years = parseDurability(product.durability)
  if (years === 0) return product.price
  return Math.round((product.price / years) * 100) / 100
}

const parseDurability = (durability) => {
  // Parse strings like "3 months", "2 years", "5 yrs"
  const lower = durability.toLowerCase()
  const match = lower.match(/(\d+)\s*(month|mo|year|yr|yrs|months)/i)
  
  if (!match) return 1
  
  const num = parseInt(match[1])
  const unit = match[2].toLowerCase()
  
  if (unit.includes('month') || unit === 'mo') {
    return num / 12
  }
  return num
}

const getComparisonYears = () => {
  const maxYears = Math.max(...props.scenario.products.map(p => parseDurability(p.durability)))
  return Math.ceil(maxYears)
}

const calculateTotalCost = (product) => {
  const years = getComparisonYears()
  const productYears = parseDurability(product.durability)
  const replacements = Math.ceil(years / productYears)
  return product.price * replacements
}

const getBarWidth = (product) => {
  const allCosts = props.scenario.products.map(p => calculateTotalCost(p))
  const maxCost = Math.max(...allCosts)
  return (calculateTotalCost(product) / maxCost) * 100
}

const getComparisonInsight = () => {
  if (!selectedProduct.value) return ''
  
  const selected = selectedProduct.value
  const bestValue = props.scenario.products.find(p => p.isBestValue)
  
  if (selected.isBestValue) {
    return `Great choice! The ${selected.name} costs less per year and lasts longer!`
  }
  
  const selectedTotal = calculateTotalCost(selected)
  const bestTotal = calculateTotalCost(bestValue)
  const difference = selectedTotal - bestTotal
  
  if (difference > 0) {
    return `The ${selected.name} seems cheap, but you'd spend $${difference} MORE over ${getComparisonYears()} years because you'd need to replace it!`
  }
  
  return `Compare the cost over time to find the best deal!`
}

const selectProduct = (product) => {
  if (!canAfford(product.price) && selectedProduct.value?.id !== product.id) {
    // Still allow selection to show the comparison, but they can't buy
  }
  selectedProduct.value = product
}

const confirmPurchase = () => {
  if (!selectedProduct.value || !canAfford(selectedProduct.value.price)) return
  
  const product = selectedProduct.value
  
  // Apply effects
  gameState.balance -= product.price
  balanceChange.value = -product.price
  
  if (product.isBestValue) {
    // Chose the best value - reward!
    outcomeType.value = 'positive'
    outcomeEmoji.value = '🌟'
    outcomeTitle.value = 'Smart Shopper!'
    outcomeMessage.value = `You bought the ${product.name}! It costs more upfront, but you'll save money in the long run because it lasts longer.`
    lessonText.value = 'Sometimes spending a bit more now saves A LOT more later. This is called "value" - getting the most for your money over time!'
    
    gameState.addSkill('planning', 5)
    gameState.addSkill('patience', 3)
    skillChange.value = 5
    
    gameState.teenGoodDecisions?.push({
      type: 'chose_best_value',
      item: product.name,
      week: gameState.week
    })
  } else if (parseDurability(product.durability) < 1) {
    // Chose the cheapest/worst option
    outcomeType.value = 'negative'
    outcomeEmoji.value = '😅'
    outcomeTitle.value = 'Hmm, Let\'s Think About This...'
    outcomeMessage.value = `You bought the ${product.name} for $${product.price}. It's cheap now, but it won't last long. You might need to buy another one soon!`
    lessonText.value = '"Cheap" doesn\'t always mean "good deal." If something breaks quickly, you end up spending MORE money replacing it!'
    
    gameState.addSkill('planning', 1)
    skillChange.value = 1
  } else {
    // Chose middle option
    outcomeType.value = 'neutral'
    outcomeEmoji.value = '👍'
    outcomeTitle.value = 'Not Bad!'
    outcomeMessage.value = `You bought the ${product.name}! It's a decent choice, but there might have been a better value.`
    lessonText.value = 'Always compare how long things last AND how much they cost. The best "value" gives you the most use for your money!'
    
    gameState.addSkill('planning', 3)
    skillChange.value = 3
  }
  
  showOutcome.value = true
}

const showSaveAdvice = () => {
  emit('show-penny-advice', {
    itemName: selectedProduct.value?.name,
    itemCost: selectedProduct.value?.price
  })
}

const skipPurchase = () => {
  outcomeType.value = 'neutral'
  outcomeEmoji.value = '🤔'
  outcomeTitle.value = 'Taking Your Time'
  outcomeMessage.value = 'You decided to skip this purchase for now. Sometimes waiting is smart!'
  lessonText.value = 'It\'s okay to wait and think before buying. You can always save up for the better option!'
  balanceChange.value = 0
  skillChange.value = 2
  
  gameState.addSkill('patience', 2)
  showOutcome.value = true
}

const closeOutcome = () => {
  showOutcome.value = false
  emit('complete', {
    purchased: selectedProduct.value,
    skipped: !selectedProduct.value || !canAfford(selectedProduct.value?.price)
  })
}
</script>

<style scoped>
.value-picker-card {
  width: 100%;
  max-width: 900px;
}

.card {
  background: white;
  border-radius: 32px;
  padding: 32px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.1);
  border: 4px solid #FFE66D;
}

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
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: white;
}

.title-section {
  text-align: center;
}

.title-emoji {
  font-size: 64px;
  display: block;
  margin-bottom: 12px;
}

.card-title {
  font-size: 28px;
  font-weight: 800;
  color: #2D3436;
  margin: 0 0 8px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.card-description {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.product-card {
  background: #FAFAFA;
  border: 3px solid #E8E8E8;
  border-radius: 24px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.product-card.selected {
  border-color: #6C63FF;
  background: linear-gradient(135deg, #F8F0FF 0%, white 100%);
  box-shadow: 0 8px 32px rgba(108, 99, 255, 0.2);
}

.product-card.best-value {
  border-color: #4ECDC4;
}

.product-card.best-value.selected {
  background: linear-gradient(135deg, #E8FFF8 0%, white 100%);
  border-color: #4ECDC4;
}

.product-card.cant-afford {
  opacity: 0.7;
}

/* Price Tag */
.price-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 12px;
}

.price-tag.cheap {
  background: #E8FFF8;
  color: #4ECDC4;
}

.price-tag.medium {
  background: #FFF8E8;
  color: #FFB347;
}

.price-tag.expensive {
  background: #FFF0F5;
  color: #FF6B9D;
}

.price-icon {
  font-size: 16px;
}

/* Product Visual */
.product-visual {
  margin-bottom: 16px;
}

.product-emoji {
  font-size: 48px;
  display: block;
  margin-bottom: 8px;
}

.product-name {
  font-size: 16px;
  font-weight: 700;
  color: #2D3436;
}

/* Quality Stars */
.quality-section {
  margin-bottom: 16px;
}

.stars {
  display: flex;
  justify-content: center;
  gap: 2px;
  margin-bottom: 4px;
}

.star {
  font-size: 18px;
  color: #DDD;
}

.star.filled {
  color: #FFD700;
}

.quality-label {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Product Stats */
.product-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: white;
  border-radius: 12px;
  font-size: 13px;
}

.stat-row.highlight {
  background: #F8F0FF;
  border: 2px solid #E8E0FF;
}

.stat-icon {
  font-size: 14px;
}

.stat-label {
  color: #888;
  flex-shrink: 0;
}

.stat-value {
  font-weight: 700;
  color: #2D3436;
  margin-left: auto;
}

.stat-value.best-cost {
  color: #4ECDC4;
}

/* Best Value Badge */
.best-value-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
  transform: rotate(12deg);
}

/* Can't Afford Overlay */
.cant-afford-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}

.cant-afford-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.cant-afford-text {
  font-size: 14px;
  font-weight: 600;
  color: #FF6B6B;
}

/* Cost Comparison */
.cost-comparison {
  background: #F8F8FF;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  border: 2px dashed #6C63FF;
}

.comparison-title {
  font-size: 18px;
  font-weight: 800;
  color: #2D3436;
  margin: 0 0 16px;
  text-align: center;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.comparison-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chart-label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  min-width: 80px;
}

.chart-bar-wrapper {
  flex: 1;
  height: 32px;
  background: #E8E8E8;
  border-radius: 16px;
  overflow: hidden;
}

.chart-bar {
  height: 100%;
  background: linear-gradient(90deg, #FF6B9D 0%, #FFB6C1 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  transition: width 0.5s ease;
}

.chart-bar.best {
  background: linear-gradient(90deg, #4ECDC4 0%, #88E5DC 100%);
}

.chart-bar.selected {
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.3);
}

.bar-value {
  font-size: 12px;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.chart-duration {
  font-size: 10px;
  color: #888;
  min-width: 70px;
}

.comparison-insight {
  margin: 16px 0 0;
  padding: 12px 16px;
  background: white;
  border-radius: 12px;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
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
  margin-bottom: 20px;
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

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.confirm-btn, .save-btn, .skip-btn {
  width: 100%;
  padding: 18px 32px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.confirm-btn {
  background: linear-gradient(135deg, #6C63FF 0%, #5A54D4 100%);
  color: white;
  border: none;
}

.confirm-btn.best-choice {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
}

.confirm-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(108, 99, 255, 0.3);
}

.save-btn {
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  color: #2D3436;
  border: none;
}

.skip-btn {
  background: white;
  color: #888;
  border: 3px solid #E8E8E8;
}

.skip-btn:hover {
  border-color: #6C63FF;
  color: #6C63FF;
}

.btn-emoji {
  font-size: 20px;
}

/* Outcome Popup */
.outcome-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.outcome-popup {
  background: white;
  border-radius: 32px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  animation: popIn 0.4s ease;
}

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.outcome-popup.positive {
  border: 4px solid #4ECDC4;
}

.outcome-popup.negative {
  border: 4px solid #FF6B9D;
}

.outcome-popup.neutral {
  border: 4px solid #FFE66D;
}

.outcome-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.outcome-title {
  font-size: 24px;
  font-weight: 800;
  color: #2D3436;
  margin: 0 0 12px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.outcome-message {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px;
}

.outcome-effects {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.effect-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
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

.lesson-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #FFF8E8;
  border-radius: 16px;
  border: 2px solid #FFE66D;
  text-align: left;
  margin-bottom: 20px;
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

.next-btn {
  width: 100%;
  padding: 16px 32px;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.next-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(108, 99, 255, 0.3);
}

/* Responsive */
@media (max-width: 700px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .card {
    padding: 20px;
  }
}
</style>