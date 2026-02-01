<!-- src/views/GameView.vue -->
<template>
  <div class="game-view">
    
    <!-- Top Header Bar -->
    <header class="game-header">
      <div class="header-left">
        <img src="@/assets/images/kids/pig.png" class="header-mascot" alt="Penny" />
        <div class="header-info">
          <h1 class="game-title">MoneyLife</h1>
          <p class="header-subtitle">{{ currentLevel.icon }} {{ currentLevel.name }}</p>
        </div>
      </div>
      
      <div class="header-stats">
        <div class="header-stat">
          <span class="stat-icon">📅</span>
          <span class="stat-text">Week {{ gameState.week }}</span>
        </div>
        <div class="header-stat" :class="{ 'danger': gameState.balance < 0 }">
          <span class="stat-icon">🪙</span>
          <span class="stat-text">${{ gameState.balance }}</span>
        </div>
        <div class="header-stat">
          <span class="stat-icon">🎯</span>
          <span class="stat-text">{{ progressPercent }}% to goal</span>
        </div>
        <div class="header-stat" :class="{ 'warning': gameState.health < 30 }">
          <span class="stat-icon">❤️</span>
          <span class="stat-text">{{ gameState.health }} HP</span>
        </div>
      </div>
    </header>
    
    <!-- Main Game Layout -->
    <div class="game-layout">
      
      <!-- Left Sidebar - Stats & Skills -->
      <aside class="sidebar left-sidebar">
        <div class="sidebar-card">
          <h3 class="sidebar-title">💰 My Money</h3>
          <div class="money-display">
            <span class="money-amount" :class="{ 'negative': gameState.balance < 0 }">
              ${{ gameState.balance }}
            </span>
            <span class="money-goal">Goal: ${{ gameState.goal }}</span>
          </div>
          <div class="progress-container">
            <div class="progress-bar-large">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <span class="progress-label">{{ progressPercent }}% saved!</span>
          </div>
        </div>
        
        <div class="sidebar-card">
          <h3 class="sidebar-title">📊 My Skills</h3>
          <div class="skills-list">
            <div v-for="(value, key) in gameState.skills" :key="key" class="skill-row">
              <span class="skill-icon">{{ getSkillIcon(key) }}</span>
              <span class="skill-name">{{ getSkillName(key) }}</span>
              <div class="skill-bar-mini">
                <div class="skill-fill-mini" :style="{ width: value + '%', background: getSkillColor(key) }"></div>
              </div>
              <span class="skill-value">{{ value }}</span>
            </div>
          </div>
        </div>
        
        <div class="sidebar-card">
          <h3 class="sidebar-title">🏅 Badges</h3>
          <div class="badges-mini">
            <span 
              v-for="badge in gameState.badges.slice(0, 6)" 
              :key="badge.id"
              class="badge-mini"
              :class="{ unlocked: badge.unlocked }"
              :title="badge.name"
            >
              {{ badge.unlocked ? badge.emoji : '🔒' }}
            </span>
          </div>
        </div>
      </aside>
      
      <!-- Center - Main Game Area -->
      <main class="main-content">
        <!-- Regular Choice Card -->
        <GameCard 
          v-if="currentScenario && (!currentScenario.type || currentScenario.type === 'choice') && !gameState.showChallenge && !gameState.showShopQuiz && !gameState.showLevelUp"
          :scenario="currentScenario"
          @choice="handleChoice"
          @next="handleNext"
        />
        
        <!-- Value Picker Card -->
        <ValuePickerCard
          v-else-if="currentScenario && currentScenario.type === 'value-picker' && !gameState.showChallenge && !gameState.showShopQuiz && !gameState.showLevelUp"
          :scenario="currentScenario"
          @complete="handleValuePickerComplete"
          @skip="handleNext"
        />
        
        <!-- Deal Detector Card -->
        <DealDetectorCard
          v-else-if="currentScenario && currentScenario.type === 'deal-detector' && !gameState.showChallenge && !gameState.showShopQuiz && !gameState.showLevelUp"
          :scenario="currentScenario"
          @complete="handleDealDetectorComplete"
        />
        
        <!-- Empty state -->
        <div v-else-if="!gameState.showChallenge && !gameState.showShopQuiz && !gameState.showLevelUp" class="loading-state">
          <span class="loading-emoji">🎮</span>
          <p>Loading next scenario...</p>
        </div>
      </main>
      
      <!-- Right Sidebar - Goal & Progress -->
      <aside class="sidebar right-sidebar">
        <div class="sidebar-card goal-card">
          <h3 class="sidebar-title">🎯 My Goal</h3>
          <div class="goal-display">
            <img :src="goalImage" class="goal-image" alt="Goal" />
            <span class="goal-name">{{ gameState.selectedGoal?.name || 'Your Prize' }}</span>
            <span class="goal-cost">${{ gameState.goal }}</span>
          </div>
          <div class="goal-countdown">
            <span v-if="weeksToGoal > 0">~{{ weeksToGoal }} weeks to go!</span>
            <span v-else class="goal-ready">🎉 Ready to buy!</span>
          </div>
        </div>
        
        <div class="sidebar-card">
          <h3 class="sidebar-title">📈 This Week</h3>
          <div class="weekly-stats">
            <div class="weekly-stat">
              <span class="weekly-label">Income</span>
              <span class="weekly-value positive">+${{ gameState.weeklyIncome }}</span>
            </div>
            <div class="weekly-stat">
              <span class="weekly-label">Spent</span>
              <span class="weekly-value negative">${{ gameState.totalSpent }}</span>
            </div>
          </div>
        </div>
        
        <div class="sidebar-card">
          <h3 class="sidebar-title">💬 Penny Says</h3>
          <div class="penny-tip">
            <img src="@/assets/images/kids/pig.png" class="penny-mini" alt="Penny" />
            <p class="tip-text">{{ currentTip }}</p>
          </div>
        </div>
      </aside>
      
    </div>
    
    <!-- ============================================ -->
    <!-- ALL POPUPS GO HERE -->
    <!-- ============================================ -->
    <!-- Add this with your other popups in the template -->

    <!-- Credit Card Statement Popup (every 4 weeks when there's debt) -->
    <CreditCardStatementPopup
    :show="gameState.showCreditCardStatement"
    @close="handleCreditCardStatementClose"
    @paid="handleCreditCardPaid"
    @skipped="handleCreditCardSkipped"
    />
    <!-- Challenge Popup -->
    <ChallengePopup
      :show="gameState.showChallenge"
      :challenge="gameState.currentChallenge"
      @complete="handleChallengeComplete"
    />
    
    <!-- Gemini Chatbox -->
    <GeminiChatbox
      :show="showGeminiChat"
      :initial-context="chatContext"
      @close="showGeminiChat = false"
    />
    
    <!-- Shop Quiz Popup -->
    <ShopQuizPopup
      :show="gameState.showShopQuiz"
      :quiz="gameState.currentShopQuiz"
      @complete="handleShopQuizComplete"
    />
    
    <!-- Level Up Popup -->
    <LevelUpPopup
      :show="gameState.showLevelUp"
      :level="gameState.newLevel"
      @close="handleLevelUpClose"
    />
    
    <!-- Badge Popup -->
    <BadgePopup
      :show="showBadge"
      :badge="earnedBadge"
      @close="showBadge = false"
    />
    
    <!-- Penny Help Popup -->
    <PennyHelp
      :show="showPennyHelp"
      :situation="currentSituation"
      @close="handlePennyHelpClose"
      @helped="handlePennyHelped"
    />
    
  </div>
</template>

<script setup>
// Add this import with your other component imports
import CreditCardStatementPopup from '@/components/CreditCardStatementPopup.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { gameState, levels, skillDefinitions } from '@/stores/gameState'
import { scenarios } from '@/data/scenarios'

// ============================================
// COMPONENT IMPORTS
// ============================================
import GameCard from '@/components/GameCard.vue'
import ValuePickerCard from '@/components/ValuePickerCard.vue'
import DealDetectorCard from '@/components/DealDetectorCard.vue'
import ChallengePopup from '@/components/ChallengePopup.vue'
import ShopQuizPopup from '@/components/ShopQuizPopup.vue'
import LevelUpPopup from '@/components/LevelUpPopup.vue'
import BadgePopup from '@/components/BadgePopup.vue'
import PennyHelp from '@/components/PennyHelp.vue'
import GeminiChatbox from '@/components/GeminiChatbox.vue'
// ============================================
// CREDIT CARD STATEMENT HANDLERS
// ============================================

const handleCreditCardStatementClose = () => {
  gameState.dismissCreditCardStatement()
}

const handleCreditCardPaid = (result) => {
  console.log('💳 Credit card payment made:', result)
  
  // Show feedback based on payment type
  if (result.type === 'full') {
    // Could show a success toast/notification
    console.log('🎉 Paid in full! No interest charges.')
  } else if (result.type === 'partial') {
    console.log(`💰 Paid $${result.amount}. Remaining: $${result.remaining}`)
  }
  
  gameState.dismissCreditCardStatement()
  
  // Check for any badges related to credit management
  checkForBadges()
}

const handleCreditCardSkipped = (result) => {
  console.log('⚠️ Credit card payment skipped:', result)
  console.log(`New debt: $${result.newDebt} (Interest added: $${result.interestAdded})`)
  console.log(`Credit score dropped to: ${result.newScore}`)
  
  gameState.dismissCreditCardStatement()
  
  // Maybe show a warning notification here
  // showNotification('Payment Missed!', 'Your debt grew and credit score dropped.', 'warning')
}
// ============================================
// IMAGE IMPORTS
// ============================================
import toyImage from '@/assets/images/kids/dollToy.png'
import artImage from '@/assets/images/kids/crayonBox.png'
import gameImage from '@/assets/images/kids/gameController.png'

const router = useRouter()

// ============================================
// STATE / REFS
// ============================================
const showBadge = ref(false)
const earnedBadge = ref(null)
const scenarioIndex = ref(0)
const showGeminiChat = ref(false)
const chatContext = ref('')
const showPennyHelp = ref(false)
const currentSituation = ref('struggling')
const lastHelpWeek = ref(0)

// ============================================
// COMPUTED PROPERTIES
// ============================================
const pennyTips = [
  "Save a little each week and watch it grow! 🌱",
  "Think before you spend - do you really need it? 🤔",
  "Every dollar saved is a step closer to your goal! 💪",
  "It's okay to treat yourself sometimes! 😊",
  "Patience is a superpower for saving money! ⏰",
  "Smart shoppers compare prices first! 🛒",
  "Your future self will thank you for saving! 🌟"
]

const currentTip = computed(() => {
  return pennyTips[gameState.week % pennyTips.length]
})

const currentLevel = computed(() => {
  return levels.find(l => l.id === gameState.currentLevel) || levels[0]
})

const progressPercent = computed(() => {
  return Math.min(100, Math.max(0, Math.round((gameState.balance / gameState.goal) * 100)))
})

const weeksToGoal = computed(() => {
  const remaining = gameState.goal - gameState.balance
  if (remaining <= 0) return 0
  const weeklyNet = gameState.weeklyIncome * 0.6
  return Math.ceil(remaining / weeklyNet)
})

const goalImage = computed(() => {
  const goalName = gameState.selectedGoal?.name?.toLowerCase() || ''
  if (goalName.includes('toy')) return toyImage
  if (goalName.includes('art')) return artImage
  if (goalName.includes('game')) return gameImage
  return toyImage
})

const currentScenario = computed(() => {
  if (!scenarios || scenarios.length === 0) return null
  return scenarios[scenarioIndex.value % scenarios.length]
})

// =======================================================
// ==========
// HELPER FUNCTIONS
// ============================================
const getSkillIcon = (key) => skillDefinitions[key]?.icon || '⭐'
const getSkillName = (key) => skillDefinitions[key]?.name || key
const getSkillColor = (key) => skillDefinitions[key]?.color || '#6C63FF'

// ============================================
// PENNY HELP DETECTION
// ============================================
const detectSituation = () => {
  const { balance, goal, health, totalSaved, totalSpent, savingChoices, spendingChoices, week } = gameState
  
  if (balance < 0) {
    return { situation: 'debt', shouldShow: true }
  }
  
  if (balance > 0 && balance < gameState.weeklyIncome * 0.3 && week > 2) {
    return { situation: 'low_balance', shouldShow: true }
  }
  
  if (health < 25) {
    return { situation: 'low_happiness', shouldShow: true }
  }
  
  if (totalSpent > totalSaved * 3 && spendingChoices > 3) {
    return { situation: 'spending_spree', shouldShow: true }
  }
  
  const issues = []
  if (balance < goal * 0.1 && week > 3) issues.push('low_progress')
  if (spendingChoices > savingChoices && week > 2) issues.push('more_spending')
  if (health < 40) issues.push('low_happiness')
  
  if (issues.length >= 2) {
    return { situation: 'struggling', shouldShow: true }
  }
  
  if (balance >= goal * 0.5 && health >= 60 && savingChoices >= spendingChoices) {
    return { situation: 'great_job', shouldShow: Math.random() < 0.2 }
  }
  
  return { situation: null, shouldShow: false }
}

const shouldCheckForHelp = () => {
  if (gameState.week - lastHelpWeek.value < 2) return false
  if (gameState.balance < 0) return true
  if (gameState.health < 20) return true
  if (gameState.week % 3 === 0) return true
  return false
}

const checkForPennyHelp = () => {
  if (gameState.showChallenge || gameState.showShopQuiz || gameState.showLevelUp || showBadge.value) {
    return
  }
  
  if (!shouldCheckForHelp()) return
  
  const detection = detectSituation()
  
  if (detection.shouldShow && detection.situation) {
    currentSituation.value = detection.situation
    showPennyHelp.value = true
    lastHelpWeek.value = gameState.week
  }
}

// ============================================
// EVENT HANDLERS
// ============================================
const handleChoice = (choice) => {
  if (choice.effects) {
    if (choice.effects.balance) {
      gameState.balance += choice.effects.balance
      if (choice.effects.balance > 0) {
        gameState.savingChoices++
        gameState.totalSaved += choice.effects.balance
        gameState.addSkill('patience', 3)
        gameState.addSkill('planning', 2)
      } else {
        gameState.spendingChoices++
        gameState.totalSpent += Math.abs(choice.effects.balance)
      }
    }
    if (choice.effects.health) {
      gameState.health += choice.effects.health
      gameState.health = Math.max(0, Math.min(100, gameState.health))
    }
  }
}

const handleNext = () => {
  // Add biweekly income
  if (gameState.week % 2 === 0) {
    gameState.balance += gameState.weeklyIncome
    
    // Grow investments if any
    if (gameState.investmentPortfolio > 0) {
      const growth = Math.round(gameState.investmentPortfolio * 0.02) // 2% growth
      gameState.investmentPortfolio += growth
      gameState.investmentReturns += growth
    }
  }
  
  gameState.addSkill('responsibility', 1)
  gameState.week++
  
  // Check for level up first
  if (gameState.checkLevelUp && gameState.checkLevelUp()) {
    return // Stop here, level up popup will show
  }
  
  // =============================================
  // CHECK FOR CREDIT CARD STATEMENT (ADD THIS!)
  // =============================================
  if (gameState.maybeShowCreditCardStatement()) {
    return // Stop here, credit card popup will show
  }
  
  // Check for shop quiz
  if (gameState.maybeShowShopQuiz && gameState.maybeShowShopQuiz()) {
    return
  }
  
  // Check for random challenge
  if (gameState.maybeShowChallenge && gameState.maybeShowChallenge()) {
    return
  }
  
  // Check for badges
  if (typeof checkForBadges === 'function') {
    checkForBadges()
  }
  
  // Check if Penny should help
  if (typeof checkForPennyHelp === 'function') {
    checkForPennyHelp()
  }
  
  // Continue game
  if (typeof advanceGame === 'function') {
    advanceGame()
  }
}

const handleLevelUpClose = () => {
  gameState.dismissLevelUp()
  checkForBadges()
  advanceGame()
}

const handleChallengeComplete = (wasCorrect) => {
  gameState.completeChallenge(wasCorrect)
  checkForBadges()
  advanceGame()
}

const handleShopQuizComplete = (wasCorrect, savedAmount) => {
  gameState.completeShopQuiz(wasCorrect, savedAmount)
  checkForBadges()
  advanceGame()
}

const handlePennyHelpClose = () => {
  showPennyHelp.value = false
}

const handlePennyHelped = () => {
  gameState.addSkill('planning', 2)
}

// ============================================
// VALUE PICKER HANDLER
// ============================================
const handleValuePickerComplete = (result) => {
  checkForBadges()
  advanceGame()
}

// ============================================
// DEAL DETECTOR HANDLER
// ============================================
const handleDealDetectorComplete = (result) => {
  checkForBadges()
  advanceGame()
}

// ============================================
// BADGE & GAME PROGRESSION
// ============================================
const checkForBadges = () => {
  const newBadges = gameState.checkBadges()
  if (newBadges.length > 0) {
    earnedBadge.value = newBadges[0]
    showBadge.value = true
  }
}

const advanceGame = () => {
  if (gameState.health <= 0) {
    router.push('/results')
    return
  }
  
  if (gameState.balance < -50) {
    router.push('/results')
    return
  }
  
  if (gameState.balance >= gameState.goal) {
    router.push('/results')
    return
  }
  
  if (gameState.week > 16) {
    router.push('/results')
    return
  }
  
  scenarioIndex.value++
}
</script>

<style scoped>
/* =====================
   BASE LAYOUT
   ===================== */
.game-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #87CEEB 0%, #E0F4FF 40%, #98D8AA 100%);
  display: flex;
  flex-direction: column;
}

/* =====================
   HEADER
   ===================== */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: white;
  border-bottom: 4px solid #FFE66D;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-mascot {
  width: 50px;
  height: 50px;
  object-fit: contain;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.game-title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #FF6B9D 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Comic Sans MS', cursive;
}

.header-subtitle {
  margin: 0;
  font-size: 14px;
  color: #888;
  font-weight: 600;
}

.header-stats {
  display: flex;
  gap: 20px;
}

.header-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #FFF8F0;
  padding: 10px 18px;
  border-radius: 20px;
  border: 2px solid #FFE66D;
  transition: all 0.3s ease;
}

.header-stat.danger {
  background: #FFE0E0;
  border-color: #FF6B6B;
  animation: pulse 1s ease-in-out infinite;
}

.header-stat.warning {
  background: #FFF3E0;
  border-color: #FFB347;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.stat-icon {
  font-size: 20px;
}

.stat-text {
  font-size: 15px;
  font-weight: 700;
  color: #2D3436;
}

/* =====================
   MAIN LAYOUT
   ===================== */
.game-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 24px;
  padding: 24px 32px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

/* =====================
   SIDEBARS
   ===================== */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: white;
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 3px solid #E8E8E8;
}

.sidebar-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 800;
  color: #2D3436;
  font-family: 'Comic Sans MS', cursive;
}

/* Money Display */
.money-display {
  text-align: center;
  margin-bottom: 16px;
}

.money-amount {
  display: block;
  font-size: 36px;
  font-weight: 900;
  color: #4ECDC4;
  font-family: 'Comic Sans MS', cursive;
}

.money-amount.negative {
  color: #FF6B6B;
}

.money-goal {
  font-size: 14px;
  color: #888;
}

.progress-container {
  text-align: center;
}

.progress-bar-large {
  height: 16px;
  background: #E8E8E8;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ECDC4, #44A08D);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-label {
  font-size: 13px;
  font-weight: 700;
  color: #4ECDC4;
}

/* Skills List */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.skill-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.skill-name {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  width: 70px;
}

.skill-bar-mini {
  flex: 1;
  height: 8px;
  background: #E8E8E8;
  border-radius: 4px;
  overflow: hidden;
}

.skill-fill-mini {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.skill-value {
  font-size: 12px;
  font-weight: 800;
  color: #2D3436;
  width: 24px;
  text-align: right;
}

/* Badges Mini */
.badges-mini {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge-mini {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: #F8F8F8;
  border-radius: 10px;
  transition: transform 0.2s ease;
}

.badge-mini.unlocked {
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
}

.badge-mini.unlocked:hover {
  transform: scale(1.15);
}

/* Goal Card */
.goal-card {
  border-color: #FFE66D;
  background: linear-gradient(135deg, #FFFDF0 0%, white 100%);
}

.goal-display {
  text-align: center;
  padding: 16px 0;
}

.goal-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 12px;
}

.goal-name {
  display: block;
  font-size: 18px;
  font-weight: 800;
  color: #2D3436;
  margin-bottom: 4px;
}

.goal-cost {
  font-size: 24px;
  font-weight: 900;
  color: #FF6B9D;
}

.goal-countdown {
  text-align: center;
  padding: 12px;
  background: #FFF8F0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #888;
}

.goal-ready {
  color: #4ECDC4;
}

/* Weekly Stats */
.weekly-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.weekly-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #FFF8F0;
  border-radius: 12px;
}

.weekly-label {
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

.weekly-value {
  font-size: 16px;
  font-weight: 800;
  color: #2D3436;
}

.weekly-value.positive {
  color: #4ECDC4;
}

.weekly-value.negative {
  color: #FF6B9D;
}

/* Penny Tip */
.penny-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.penny-mini {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
}

.tip-text {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  font-style: italic;
}

/* =====================
   MAIN CONTENT
   ===================== */
.main-content {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.loading-state {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.loading-emoji {
  font-size: 64px;
  display: block;
  margin-bottom: 16px;
  animation: pulse 1s ease-in-out infinite;
}

.loading-state p {
  color: #888;
  font-size: 16px;
}

/* =====================
   RESPONSIVE
   ===================== */
@media (max-width: 1200px) {
  .game-layout {
    grid-template-columns: 1fr;
    max-width: 600px;
  }
  
  .sidebar {
    display: none;
  }
  
  .header-stats {
    display: none;
  }
}

@media (max-width: 768px) {
  .game-header {
    padding: 12px 16px;
  }
  
  .game-title {
    font-size: 20px;
  }
  
  .game-layout {
    padding: 16px;
  }
}
</style>