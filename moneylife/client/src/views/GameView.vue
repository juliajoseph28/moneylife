<!-- src/views/GameView.vue -->
<template>
  <div class="game-view">
    
    <!-- Mascot Helper -->
    <div class="mascot-helper">
      <img src="@/assets/images/kids/pig.png" class="mascot-mini" alt="Penny" />
      <div class="speech-bubble mini">
        <p>Week {{ gameState.week }} - {{ currentLevel.icon }} {{ currentLevel.name }}</p>
      </div>
    </div>
    
    <!-- Stats Bar -->
    <StatsBar />
    
    <!-- Skills Bar (collapsible) -->
    <details class="skills-details">
      <summary class="skills-toggle">
        <span>📊 My Skills & Level</span>
        <span class="toggle-icon">▼</span>
      </summary>
      <SkillsBar />
    </details>
    
    <!-- Main Game Card -->
    <GameCard 
      v-if="currentScenario && !gameState.showChallenge && !gameState.showShopQuiz && !gameState.showLevelUp"
      :scenario="currentScenario"
      @choice="handleChoice"
      @next="handleNext"
    />
    
    <!-- Challenge Popup -->
    <ChallengePopup
      :show="gameState.showChallenge"
      :challenge="gameState.currentChallenge"
      @complete="handleChallengeComplete"
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { gameState, levels } from '@/stores/gameState'
import { scenarios } from '@/data/scenarios'
import StatsBar from '@/components/StatsBar.vue'
import SkillsBar from '@/components/SkillsBar.vue'
import GameCard from '@/components/GameCard.vue'
import ChallengePopup from '@/components/ChallengePopup.vue'
import ShopQuizPopup from '@/components/ShopQuizPopup.vue'
import LevelUpPopup from '@/components/LevelUpPopup.vue'
import BadgePopup from '@/components/BadgePopup.vue'

const router = useRouter()

// State
const showBadge = ref(false)
const earnedBadge = ref(null)
const scenarioIndex = ref(0)

// Current level
const currentLevel = computed(() => {
  return levels.find(l => l.id === gameState.currentLevel) || levels[0]
})

// Current scenario
const currentScenario = computed(() => {
  if (!scenarios || scenarios.length === 0) return null
  return scenarios[scenarioIndex.value % scenarios.length]
})

// Handle choice with skill effects
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
    
    // Add skills based on choice type
    if (choice.effects.skills) {
      Object.entries(choice.effects.skills).forEach(([skill, amount]) => {
        gameState.addSkill(skill, amount)
      })
    }
  }
}

// Handle moving to next week
const handleNext = () => {
  // Add weekly income
  gameState.balance += gameState.weeklyIncome
  gameState.addSkill('responsibility', 1) // Responsibility grows each week
  
  // Advance week
  gameState.week++
  
  // Check for level up first
  const leveledUp = gameState.checkLevelUp()
  if (leveledUp) return // Will show level up popup
  
  // Check for shop quiz (every 4 weeks)
  if (gameState.maybeShowShopQuiz()) return
  
  // Check for challenge (every 3 weeks)
  if (gameState.maybeShowChallenge()) return
  
  // Normal flow
  checkForBadges()
  advanceGame()
}

// Handle level up close
const handleLevelUpClose = () => {
  gameState.dismissLevelUp()
  checkForBadges()
  advanceGame()
}

// Handle challenge completion
const handleChallengeComplete = (wasCorrect) => {
  gameState.completeChallenge(wasCorrect)
  checkForBadges()
  advanceGame()
}

// Handle shop quiz completion
const handleShopQuizComplete = (wasCorrect, savedAmount) => {
  gameState.completeShopQuiz(wasCorrect, savedAmount)
  checkForBadges()
  advanceGame()
}

// Check for badges
const checkForBadges = () => {
  const newBadges = gameState.checkBadges()
  if (newBadges.length > 0) {
    earnedBadge.value = newBadges[0]
    showBadge.value = true
  }
}

// Advance game
const advanceGame = () => {
  if (gameState.health <= 0 || gameState.balance < -50) {
    router.push('/results')
    return
  }
  
  if (gameState.balance >= gameState.goal) {
    router.push('/results')
    return
  }
  
  if (gameState.week > 16) { // Extended to 16 weeks for more gameplay
    router.push('/results')
    return
  }
  
  scenarioIndex.value++
}
</script>

<style scoped>
.game-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF8F0 0%, #FFE8D6 50%, #FFDAB9 100%);
  padding: 20px;
  padding-bottom: 40px;
}

/* Mascot Helper */
.mascot-helper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.mascot-mini {
  width: 50px;
  height: 50px;
  object-fit: contain;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.speech-bubble.mini {
  background: white;
  border: 3px solid #FFE66D;
  border-radius: 16px;
  padding: 10px 16px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.speech-bubble.mini::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 8px;
  border-style: solid;
  border-color: transparent #FFE66D transparent transparent;
}

.speech-bubble.mini::after {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: transparent white transparent transparent;
}

.speech-bubble.mini p {
  margin: 0;
  color: #2D3436;
  font-weight: 600;
  font-size: 14px;
}

/* Skills Toggle */
.skills-details {
  margin-bottom: 16px;
}

.skills-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 3px solid #6C63FF;
  border-radius: 16px;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  color: #6C63FF;
  list-style: none;
  transition: all 0.2s ease;
}

.skills-toggle:hover {
  background: #F8F0FF;
}

.skills-details[open] .skills-toggle {
  border-radius: 16px 16px 0 0;
  border-bottom: none;
}

.skills-details[open] .skills-toggle .toggle-icon {
  transform: rotate(180deg);
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.skills-details > :not(summary) {
  border: 3px solid #6C63FF;
  border-top: none;
  border-radius: 0 0 16px 16px;
  margin-top: 0;
}
</style>