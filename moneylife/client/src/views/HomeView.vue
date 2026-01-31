<template>
  <div class="kids-home" :class="{ 'kids-mode': isKidsMode }">
    
    <!-- STEP 1: Welcome & Age -->
    <div v-if="currentStep === 'age'" class="step-container">
      
      <!-- Fun Header -->
      <div class="fun-header">
        <div class="floating-coins">
          <img src="@/assets/images/kids/gold coin.png" class="coin c1" alt="coin" />
          <img src="@/assets/images/kids/gold coin.png" class="coin c2" alt="coin" />
          <img src="@/assets/images/kids/gold coin.png" class="coin c3" alt="coin" />
        </div>
        <h1 class="game-logo">
          <span class="logo-money">Money</span>
          <span class="logo-life">Life!</span>
        </h1>
        <p class="tagline">Learn to save like a superstar!</p>
        <img src="@/assets/images/kids/gold star.png" class="tagline-star" alt="star" />
      </div>
      
      <!-- Mascot Welcome -->
      <div class="mascot-container">
        <div class="mascot-wrapper">
          <img 
            src="@/assets/images/kids/happy piggy.png" 
            class="mascot-image" 
            alt="Penny the Pig"
          />
          <div class="mascot-shadow"></div>
        </div>
        
        <div class="speech-bubble-wrapper">
          <div class="speech-bubble">
            <p class="bubble-text">
              <span class="wave">👋</span> Hiya friend! I'm <strong class="mascot-name">Penny!</strong>
            </p>
            <p class="bubble-text">Want to play a super fun money game with me?</p>
          </div>
        </div>
      </div>
      
      <!-- Age Selection -->
      <div class="age-section">
        <h2 class="section-question">How old are you?</h2>
        
        <div class="age-buttons">
          <button 
            v-for="age in ageGroups" 
            :key="age.id"
            class="age-btn"
            :class="{ 
              selected: selectedAge === age.id,
              'kids-style': age.id === 'kids',
              'tween-style': age.id === 'tweens',
              'teen-style': age.id === 'teens'
            }"
            @click="selectAge(age.id)"
          >
            <div class="age-icon">{{ age.emoji }}</div>
            <div class="age-numbers">{{ age.range }}</div>
            <img 
              v-if="selectedAge === age.id" 
              src="@/assets/images/kids/gold star.png" 
              class="age-star" 
              alt="selected"
            />
          </button>
        </div>
      </div>
      
      <!-- Safety Badge -->
      <div class="safety-badge">
        <div class="badge-icon">🛡️</div>
        <div class="badge-text">
          <strong>Super Safe!</strong>
          <span>We don't save any of your info!</span>
        </div>
      </div>
      
      <!-- Parent Tip (shows for kids) -->
      <div v-if="selectedAge === 'kids'" class="parent-tip">
        <div class="tip-character">👨‍👩‍👧</div>
        <p>Playing with a grown-up makes it even more fun!</p>
      </div>
      
      <!-- Continue Button -->
      <button 
        v-if="selectedAge"
        class="btn-big-fun"
        @click="nextStep"
      >
        <span class="btn-text">Let's Play!</span>
        <span class="btn-rocket">🚀</span>
      </button>
      
    </div>

    <!-- STEP 2: Character (Kids Version) -->
    <div v-if="currentStep === 'character' && selectedAge === 'kids'" class="step-container kids-character">
      
      <button class="back-btn-fun" @click="prevStep">
        <span>←</span> Go Back
      </button>
      
      <!-- Mascot -->
      <div class="mascot-mini">
        <img src="@/assets/images/kids/pig.png" class="mascot-small" alt="Penny" />
        <div class="speech-bubble small">
          <p>Pick who you want to be!</p>
        </div>
      </div>
      
      <h2 class="fun-title">Choose Your Character!</h2>
      
      <div class="character-cards-kids">
        <button
          v-for="char in kidsCharacters"
          :key="char.id"
          class="character-card-kid"
          :class="{ selected: selectedCharacter === char.id }"
          @click="selectCharacter(char.id)"
        >
          <div class="card-glow"></div>
          <div class="character-pic">{{ char.emoji }}</div>
          <h3 class="character-title">{{ char.name }}</h3>
          <p class="character-desc">{{ char.description }}</p>
          <div class="character-money">
            <img src="@/assets/images/kids/gold coin.png" class="money-coin-img" alt="coin" />
            <span class="money-amount">{{ char.income }}</span>
            <span class="money-label">every week!</span>
          </div>
          <div class="selected-badge" v-if="selectedCharacter === char.id">
            <img src="@/assets/images/kids/gold star.png" class="badge-star" alt="star" />
            PICKED!
          </div>
        </button>
      </div>
      
      <button 
        v-if="selectedCharacter"
        class="btn-big-fun"
        @click="nextStep"
      >
        <span class="btn-text">Next: Pick Your Prize!</span>
        <span class="btn-icon">🎁</span>
      </button>
      
    </div>

    <!-- STEP 3: Goal Selection (Kids Version) -->
    <div v-if="currentStep === 'goal' && selectedAge === 'kids'" class="step-container kids-goal">
      
      <button class="back-btn-fun" @click="prevStep">
        <span>←</span> Go Back
      </button>
      
      <!-- Mascot -->
      <div class="mascot-mini">
        <img src="@/assets/images/kids/pig.png" class="mascot-small" alt="Penny" />
        <div class="speech-bubble small">
          <p>What cool thing do you want?</p>
        </div>
      </div>
      
      <h2 class="fun-title">Pick Your Prize! 🏆</h2>
      
      <div class="prize-cards">
        <button
          v-for="goal in kidsGoals"
          :key="goal.name"
          class="prize-card"
          :class="{ selected: selectedGoal?.name === goal.name }"
          @click="selectGoal(goal)"
        >
          <div class="prize-glow" :style="{ background: goal.color }"></div>
          <img :src="goal.image" class="prize-image" :alt="goal.name" />
          <div class="prize-name">{{ goal.name }}</div>
          <div class="prize-cost">
            <img src="@/assets/images/kids/gold coin.png" class="cost-coin" alt="coin" />
            <span class="cost-amount">${{ goal.cost }}</span>
          </div>
          <div class="prize-time">
            <span>⏰</span> ~{{ calculateWeeks(goal.cost) }} weeks
          </div>
          <img 
            v-if="selectedGoal?.name === goal.name" 
            src="@/assets/images/kids/gold star.png" 
            class="selected-star-img" 
            alt="selected"
          />
        </button>
      </div>
      
      <button 
        v-if="selectedGoal"
        class="btn-big-fun rainbow"
        @click="nextStep"
      >
        <span class="btn-text">I Want This!</span>
        <span class="btn-sparkles">✨</span>
      </button>
      
    </div>

    <!-- STEP 4: How To Play (Kids Version) -->
    <div v-if="currentStep === 'tutorial' && selectedAge === 'kids'" class="step-container kids-tutorial">
      
      <div class="tutorial-box">
        <h2 class="tutorial-title">How To Play! 🎮</h2>
        
        <div class="tutorial-steps-kids">
          <div class="tut-step">
            <div class="step-num">1</div>
            <div class="step-icon">📅</div>
            <div class="step-text">Every week, <strong>stuff happens!</strong></div>
          </div>
          
          <div class="tut-arrow">↓</div>
          
          <div class="tut-step">
            <div class="step-num">2</div>
            <div class="step-icon">🤔</div>
            <div class="step-text">You decide: <strong>spend or save?</strong></div>
          </div>
          
          <div class="tut-arrow">↓</div>
          
          <div class="tut-step">
            <div class="step-num">3</div>
            <div class="step-icon">🎯</div>
            <div class="step-text">Save enough to <strong>get your prize!</strong></div>
          </div>
        </div>
        
        <div class="penny-tip">
          <img src="@/assets/images/kids/pig.png" class="tip-piggy" alt="Penny" />
          <div class="tip-bubble">
            <p>Don't worry! I'll help you the whole way! 💪</p>
          </div>
        </div>
        
        <button class="btn-start-game" @click="launchGame">
          <div class="btn-inner">
            <span class="start-text">START THE GAME!</span>
            <span class="start-icon">🎮</span>
          </div>
          <div class="btn-shine"></div>
        </button>
      </div>
      
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameState'

// Import images for goals
import toyImage from '@/assets/images/kids/doll toy cartoon.png'
import artImage from '@/assets/images/kids/crayon box.png'
import gameImage from '@/assets/images/kids/game controler.png'

const router = useRouter()
const store = useGameStore()

const currentStep = ref('age')
const selectedAge = ref(null)
const selectedCharacter = ref(null)
const selectedGoal = ref(null)

const isKidsMode = computed(() => selectedAge.value === 'kids')

const ageGroups = [
  { id: 'kids', range: '8-10', emoji: '🧒' },
  { id: 'tweens', range: '11-13', emoji: '🧑' },
  { id: 'teens', range: '14-16', emoji: '🧑‍🎓' }
]

const kidsCharacters = [
  { 
    id: 'helper', 
    name: 'Super Helper', 
    emoji: '🦸', 
    description: 'You help with chores and earn allowance!', 
    income: '$10'
  },
  { 
    id: 'saver', 
    name: 'Saving Star', 
    emoji: '⭐', 
    description: 'You find coins and save birthday money!', 
    income: '$8'
  }
]

const kidsGoals = [
  { name: 'Cool Toy', cost: 20, image: toyImage, color: '#FF6B9D' },
  { name: 'Art Set', cost: 25, image: artImage, color: '#4ECDC4' },
  { name: 'Video Game', cost: 35, image: gameImage, color: '#6C63FF' }
]

const calculateWeeks = (cost) => {
  const char = kidsCharacters.find(c => c.id === selectedCharacter.value)
  if (!char) return '?'
  const income = parseInt(char.income.replace(/\D/g, ''))
  return Math.ceil(cost / (income * 0.6))
}

const selectAge = (age) => {
  selectedAge.value = age
  selectedCharacter.value = null
  selectedGoal.value = null
}

const selectCharacter = (char) => {
  selectedCharacter.value = char
}

const selectGoal = (goal) => {
  selectedGoal.value = goal
}

const nextStep = () => {
  if (currentStep.value === 'age') currentStep.value = 'character'
  else if (currentStep.value === 'character') currentStep.value = 'goal'
  else if (currentStep.value === 'goal') currentStep.value = 'tutorial'
}

const prevStep = () => {
  if (currentStep.value === 'character') currentStep.value = 'age'
  else if (currentStep.value === 'goal') currentStep.value = 'character'
  else if (currentStep.value === 'tutorial') currentStep.value = 'goal'
}

const launchGame = () => {
  const char = kidsCharacters.find(c => c.id === selectedCharacter.value)
  const income = parseInt(char.income.replace(/\D/g, ''))
  
  store.ageGroup = selectedAge.value
  store.weeklyIncome = income
  store.initializeGame(selectedCharacter.value, selectedGoal.value)
  
  router.push('/game')
}
</script>

<style scoped>
/* =====================
   CREAM BACKGROUND BASE
   ===================== */

.kids-home {
  min-height: 100vh;
  background: #FFF8F0;
  padding: 20px;
  overflow-x: hidden;
}

.kids-home.kids-mode {
  background: linear-gradient(180deg, #FFF8F0 0%, #FFE8D6 50%, #FFDAB9 100%);
}

.step-container {
  max-width: 500px;
  margin: 0 auto;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* =====================
   FUN HEADER
   ===================== */

.fun-header {
  text-align: center;
  margin-bottom: 24px;
  position: relative;
}

.floating-coins {
  position: relative;
  height: 50px;
  margin-bottom: 8px;
}

.coin {
  position: absolute;
  width: 40px;
  height: 40px;
  animation: float 3s ease-in-out infinite;
}

.c1 { left: 25%; animation-delay: 0s; }
.c2 { left: 50%; transform: translateX(-50%); animation-delay: 0.5s; }
.c3 { right: 25%; animation-delay: 1s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(10deg); }
}

.game-logo {
  font-size: 48px;
  font-weight: 900;
  margin: 0;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.logo-money {
  color: #FF6B9D;
  text-shadow: 3px 3px 0px #FFB6C1;
}

.logo-life {
  color: #6C63FF;
  text-shadow: 3px 3px 0px #B8B5FF;
}

.tagline {
  font-size: 18px;
  color: #666;
  margin-top: 8px;
  font-weight: 600;
}

.tagline-star {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-left: 4px;
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* =====================
   MASCOT
   ===================== */

.mascot-container {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
}

.mascot-wrapper {
  position: relative;
  flex-shrink: 0;
}

.mascot-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
  animation: mascotBounce 2s ease-in-out infinite;
  filter: drop-shadow(0 8px 16px rgba(255, 107, 157, 0.3));
}

.mascot-small {
  width: 60px;
  height: 60px;
  object-fit: contain;
  animation: mascotBounce 2s ease-in-out infinite;
}

.tip-piggy {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

@keyframes mascotBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.mascot-shadow {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 16px;
  background: rgba(0,0,0,0.1);
  border-radius: 50%;
  animation: shadowPulse 2s ease-in-out infinite;
}

@keyframes shadowPulse {
  0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.2; }
  50% { transform: translateX(-50%) scale(0.8); opacity: 0.1; }
}

/* =====================
   SPEECH BUBBLE
   ===================== */

.speech-bubble-wrapper {
  flex: 1;
}

.speech-bubble {
  background: white;
  border-radius: 24px;
  padding: 16px 20px;
  position: relative;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  border: 4px solid #FFE66D;
}

.speech-bubble::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 24px;
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-right: 16px solid #FFE66D;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  left: -10px;
  top: 26px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 14px solid white;
}

.speech-bubble.small {
  padding: 12px 16px;
  border-radius: 16px;
  border-width: 3px;
}

.speech-bubble.small p {
  color: #2D3436;
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.bubble-text {
  margin: 4px 0;
  font-size: 17px;
  color: #2D3436;
  line-height: 1.5;
}

.wave {
  display: inline-block;
  animation: wave 1s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-20deg); }
}

.mascot-name {
  color: #FF6B9D;
  font-size: 22px;
}

/* =====================
   AGE SELECTION
   ===================== */

.age-section {
  text-align: center;
  margin-bottom: 24px;
}

.section-question {
  font-size: 28px;
  color: #2D3436;
  margin-bottom: 20px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.age-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.age-btn {
  background: white;
  border: 4px solid #E0E0E0;
  border-radius: 24px;
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 100px;
  position: relative;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
}

.age-btn:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}

.age-btn.selected {
  transform: translateY(-8px) scale(1.05);
}

.age-btn.kids-style.selected {
  border-color: #FF6B9D;
  background: #FFF0F5;
}

.age-btn.tween-style.selected {
  border-color: #4ECDC4;
  background: #F0FFFD;
}

.age-btn.teen-style.selected {
  border-color: #6C63FF;
  background: #F0F0FF;
}

.age-icon {
  font-size: 44px;
}

.age-numbers {
  font-size: 24px;
  font-weight: 800;
  color: #2D3436;
}

.age-star {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 32px;
  height: 32px;
  animation: spin 2s linear infinite;
}

/* =====================
   SAFETY BADGE
   ===================== */

.safety-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 20px;
  padding: 16px 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  border: 3px solid #4ECDC4;
}

.badge-icon {
  font-size: 36px;
}

.badge-text {
  display: flex;
  flex-direction: column;
}

.badge-text strong {
  color: #4ECDC4;
  font-size: 18px;
}

.badge-text span {
  color: #666;
  font-size: 14px;
}

/* =====================
   PARENT TIP
   ===================== */

.parent-tip {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 20px;
  padding: 16px 20px;
  margin-bottom: 20px;
  border-left: 6px solid #FFE66D;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.tip-character {
  font-size: 36px;
}

.parent-tip p {
  color: #2D3436;
  font-size: 16px;
  margin: 0;
  font-weight: 500;
}

/* =====================
   BIG FUN BUTTON
   ===================== */

.btn-big-fun {
  width: 100%;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  border: none;
  border-radius: 24px;
  padding: 22px 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(78, 205, 196, 0.4);
  position: relative;
  overflow: hidden;
}

.btn-big-fun:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(78, 205, 196, 0.5);
}

.btn-big-fun.rainbow {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFE66D 50%, #4ECDC4 100%);
  box-shadow: 0 8px 24px rgba(255, 107, 157, 0.4);
}

.btn-text {
  font-size: 24px;
  font-weight: 800;
  color: white;
  text-shadow: 2px 2px 0px rgba(0,0,0,0.15);
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.btn-rocket, .btn-icon, .btn-sparkles {
  font-size: 32px;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* =====================
   BACK BUTTON
   ===================== */

.back-btn-fun {
  background: white;
  border: 3px solid #E0E0E0;
  border-radius: 30px;
  padding: 12px 24px;
  color: #666;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.back-btn-fun:hover {
  background: #F8F8F8;
  border-color: #CCC;
}

/* =====================
   MASCOT MINI
   ===================== */

.mascot-mini {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

/* =====================
   FUN TITLE
   ===================== */

.fun-title {
  font-size: 32px;
  color: #2D3436;
  text-align: center;
  margin-bottom: 24px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

/* =====================
   CHARACTER CARDS (KIDS)
   ===================== */

.character-cards-kids {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.character-card-kid {
  background: white;
  border: 4px solid #E0E0E0;
  border-radius: 28px;
  padding: 24px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.character-card-kid:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 40px rgba(0,0,0,0.12);
}

.character-card-kid.selected {
  border-color: #FFE66D;
  background: #FFFDF0;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(180deg, #FFE66D 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.character-card-kid.selected .card-glow {
  opacity: 0.3;
}

.character-pic {
  font-size: 64px;
  margin-bottom: 12px;
  animation: characterFloat 3s ease-in-out infinite;
}

@keyframes characterFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.character-title {
  font-size: 22px;
  font-weight: 800;
  color: #2D3436;
  margin: 0 0 8px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.character-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px;
  line-height: 1.4;
}

.character-money {
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  border-radius: 16px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.money-coin-img {
  width: 24px;
  height: 24px;
}

.money-amount {
  font-size: 22px;
  font-weight: 800;
  color: #2D3436;
}

.money-label {
  font-size: 12px;
  color: #666;
}

.selected-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #FF6B9D;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  animation: pulse 1s ease-in-out infinite;
}

.badge-star {
  width: 16px;
  height: 16px;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* =====================
   PRIZE CARDS
   ===================== */

.prize-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.prize-card {
  background: white;
  border: 4px solid #E0E0E0;
  border-radius: 24px;
  padding: 20px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
}

.prize-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.12);
}

.prize-card.selected {
  border-color: #FFE66D;
  background: #FFFDF0;
}

.prize-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  opacity: 0.15;
  transition: opacity 0.3s ease;
}

.prize-card.selected .prize-glow {
  opacity: 0.3;
}

.prize-image {
  width: 70px;
  height: 70px;
  object-fit: contain;
  margin-bottom: 12px;
  animation: prizeShine 2s ease-in-out infinite;
}

@keyframes prizeShine {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.prize-name {
  font-size: 16px;
  font-weight: 700;
  color: #2D3436;
  margin-bottom: 8px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.prize-cost {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.cost-coin {
  width: 20px;
  height: 20px;
}

.cost-amount {
  font-size: 24px;
  font-weight: 800;
  color: #4ECDC4;
}

.prize-time {
  font-size: 11px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
}

.selected-star-img {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  animation: spin 2s linear infinite;
}

/* =====================
   TUTORIAL
   ===================== */

.kids-tutorial {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.tutorial-box {
  background: white;
  border-radius: 32px;
  padding: 36px 28px;
  text-align: center;
  box-shadow: 0 16px 48px rgba(0,0,0,0.12);
  max-width: 420px;
  border: 4px solid #FFE66D;
}

.tutorial-title {
  font-size: 36px;
  color: #6C63FF;
  margin-bottom: 28px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.tutorial-steps-kids {
  margin-bottom: 24px;
}

.tut-step {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #F8F9FA;
  border-radius: 20px;
  padding: 18px;
  margin-bottom: 8px;
}

.step-num {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  color: white;
  font-size: 22px;
  font-weight: 800;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-icon {
  font-size: 32px;
}

.step-text {
  flex: 1;
  text-align: left;
  font-size: 17px;
  color: #2D3436;
}

.tut-arrow {
  font-size: 28px;
  color: #6C63FF;
  margin: 8px 0;
}

.penny-tip {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #FFF0F5;
  border-radius: 20px;
  padding: 14px 18px;
  margin-bottom: 24px;
}

.tip-bubble {
  flex: 1;
}

.tip-bubble p {
  margin: 0;
  color: #FF6B9D;
  font-weight: 600;
  font-size: 16px;
}

/* =====================
   START GAME BUTTON
   ===================== */

.btn-start-game {
  width: 100%;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  border: none;
  border-radius: 24px;
  padding: 0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(108, 99, 255, 0.4);
  transition: all 0.3s ease;
}

.btn-start-game:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(108, 99, 255, 0.5);
}

.btn-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 22px 32px;
  position: relative;
  z-index: 1;
}

.start-text {
  font-size: 26px;
  font-weight: 800;
  color: white;
  text-shadow: 2px 2px 0px rgba(0,0,0,0.15);
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.start-icon {
  font-size: 36px;
  animation: bounce 1s ease-in-out infinite;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
  animation: shine 2s ease-in-out infinite;
}

@keyframes shine {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}
</style>