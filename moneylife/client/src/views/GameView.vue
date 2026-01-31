<!-- src/views/GameView.vue -->
<template>
  <div class="game-view">
    <!-- Top Bar -->
    <div class="top-bar">
      <span class="week">Week {{ gameState.week }}</span>
      <span class="level">Level {{ gameState.level }}</span>
    </div>
    
    <!-- Stats Bar -->
    <StatsBar />
    
    <!-- Main Game Card -->
    <GameCard 
      v-if="currentScenario && !gameState.showChallenge"
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
import { gameState } from '@/stores/gameState'
import { scenarios } from '@/data/scenarios'
import StatsBar from '@/components/StatsBar.vue'
import GameCard from '@/components/GameCard.vue'
import ChallengePopup from '@/components/ChallengePopup.vue'
import BadgePopup from '@/components/BadgePopup.vue'

const router = useRouter()

// State
const showBadge = ref(false)
const earnedBadge = ref(null)
const scenarioIndex = ref(0)

// Current scenario
const currentScenario = computed(() => {
  if (!scenarios || scenarios.length === 0) return null
  return scenarios[scenarioIndex.value % scenarios.length]
})

// Handle when player makes a choice (but before seeing outcome)
const handleChoice = (choice) => {
  // Apply effects to game state
  if (choice.effects) {
    if (choice.effects.balance) {
      gameState.balance += choice.effects.balance
      if (choice.effects.balance > 0) {
        gameState.savingChoices++
        gameState.totalSaved += choice.effects.balance
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

// Handle moving to next week
const handleNext = () => {
  // Advance week
  gameState.week++
  
  // Level up every 5 weeks
  if (gameState.week % 5 === 0) {
    gameState.level++
  }
  
  // Maybe trigger a challenge
  const showingChallenge = gameState.maybeShowChallenge()
  
  if (!showingChallenge) {
    // Check for badges
    checkForBadges()
    
    // Advance game
    advanceGame()
  }
}

// Handle challenge completion
const handleChallengeComplete = (wasCorrect) => {
  gameState.completeChallenge(wasCorrect)
  checkForBadges()
  advanceGame()
}

// Check for newly earned badges
const checkForBadges = () => {
  const newBadges = gameState.checkBadges()
  if (newBadges.length > 0) {
    earnedBadge.value = newBadges[0]
    showBadge.value = true
  }
}

// Advance to next scenario or end game
const advanceGame = () => {
  // Check for game over conditions
  if (gameState.health <= 0 || gameState.balance < -50) {
    router.push('/results')
    return
  }
  
  // Check for win
  if (gameState.balance >= gameState.goal) {
    router.push('/results')
    return
  }
  
  // Check if played enough weeks
  if (gameState.week > 12) {
    router.push('/results')
    return
  }
  
  // Next scenario
  scenarioIndex.value++
}
</script>

<style scoped>
.game-view {
  min-height: 100vh;
  background: #1a1a2e;
  padding: 16px;
  padding-bottom: 40px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #16213e;
  border-radius: 12px;
  margin-bottom: 16px;
  color: #f1f5f9;
  font-weight: 600;
}
</style>