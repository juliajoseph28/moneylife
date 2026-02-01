<template>
  <div class="home-wrapper">
    
    <!-- LEFT SIDE: Decorative / Animated -->
    <div class="left-panel">
      <div class="decoration-scene">
        <!-- Floating Elements -->
        <div class="floating-elements">
          <img src="@/assets/images/kids/gold coin.png" class="float-coin c1" alt="" />
          <img src="@/assets/images/kids/gold coin.png" class="float-coin c2" alt="" />
          <img src="@/assets/images/kids/gold coin.png" class="float-coin c3" alt="" />
          <img src="@/assets/images/kids/gold star.png" class="float-star s1" alt="" />
          <img src="@/assets/images/kids/gold star.png" class="float-star s2" alt="" />
          <span class="float-emoji e1">💰</span>
          <span class="float-emoji e2">🎯</span>
          <span class="float-emoji e3">🏆</span>
        </div>
        
        <!-- Main Mascot -->
        <div class="mascot-scene">
          <img src="@/assets/images/kids/happy piggy.png" class="main-mascot" alt="Penny" />
          <div class="mascot-glow"></div>
        </div>
        
        <!-- What You'll Learn -->
        <div class="learn-preview">
          <h3 class="learn-title">What You'll Learn</h3>
          <div class="learn-cards">
            <div class="learn-card">
              <span class="learn-icon">💰</span>
              <span class="learn-text">Saving</span>
            </div>
            <div class="learn-card">
              <span class="learn-icon">🛒</span>
              <span class="learn-text">Smart Shopping</span>
            </div>
            <div class="learn-card">
              <span class="learn-icon">🎯</span>
              <span class="learn-text">Setting Goals</span>
            </div>
            <div class="learn-card">
              <span class="learn-icon">💪</span>
              <span class="learn-text">Earning Money</span>
            </div>
          </div>
        </div>
        
        <!-- Fun Fact -->
        <div class="fun-fact">
          <span class="fact-icon">💡</span>
          <p class="fact-text">{{ currentFact }}</p>
        </div>
      </div>
    </div>
    
    <!-- RIGHT SIDE: Main Content -->
    <div class="right-panel">
      <div class="content-wrapper">
        
        <!-- STEP 1: Welcome & Age -->
        <div v-if="currentStep === 'age'" class="step-content">
          
          <!-- Header -->
          <div class="content-header">
            <h1 class="logo-title">
              <span class="logo-money">Money</span><span class="logo-life">Life!</span>
            </h1>
            <p class="tagline">Learn to save like a superstar! ⭐</p>
          </div>
          
          <!-- Speech Bubble -->
          <div class="welcome-bubble">
            <div class="bubble-arrow"></div>
            <p class="bubble-text">
              <span class="wave">👋</span> Hiya friend! I'm <strong class="mascot-name">Penny!</strong>
            </p>
            <p class="bubble-text">Ready to play a super fun money game with me?</p>
          </div>
          
          <!-- Age Selection -->
          <div class="age-section">
            <h2 class="section-title">How old are you?</h2>
            
            <div class="age-options">
              <button 
                v-for="age in ageGroups" 
                :key="age.id"
                class="age-card"
                :class="{ 
                  selected: selectedAge === age.id,
                  'kids-style': age.id === 'kids',
                  'teen-style': age.id === 'teens'
                }"
                @click="selectAge(age.id)"
              >
                <div class="age-emoji">{{ age.emoji }}</div>
                <div class="age-range">{{ age.range }}</div>
                <div class="age-label">{{ age.label }}</div>
                <img 
                  v-if="selectedAge === age.id" 
                  src="@/assets/images/kids/gold star.png" 
                  class="selected-star" 
                  alt=""
                />
              </button>
            </div>
          </div>
          
          <!-- Info Cards Row -->
          <div class="info-row">
            <div class="info-card safety">
              <span class="info-icon">🛡️</span>
              <div class="info-text">
                <strong>Super Safe!</strong>
                <span>We don't save any of your info</span>
              </div>
            </div>
            
            <div v-if="selectedAge === 'kids'" class="info-card parent">
              <span class="info-icon">👨‍👩‍👧</span>
              <div class="info-text">
                <strong>Pro Tip!</strong>
                <span>Playing with a grown-up is more fun!</span>
              </div>
            </div>
          </div>
          
          <!-- Continue Button -->
          <button 
            v-if="selectedAge"
            class="btn-continue"
            @click="nextStep"
          >
            <span class="btn-text">Let's Play!</span>
            <span class="btn-icon">🚀</span>
          </button>
          
          <!-- Journey Preview -->
          <div class="journey-preview">
            <h3 class="journey-title">Your Adventure Awaits!</h3>
            <div class="journey-path">
              <div class="journey-step">
                <span class="journey-icon">🏡</span>
                <span class="journey-label">Backyard</span>
              </div>
              <div class="journey-arrow">→</div>
              <div class="journey-step">
                <span class="journey-icon">🏘️</span>
                <span class="journey-label">Neighborhood</span>
              </div>
              <div class="journey-arrow">→</div>
              <div class="journey-step">
                <span class="journey-icon">🏙️</span>
                <span class="journey-label">Town</span>
              </div>
              <div class="journey-arrow">→</div>
              <div class="journey-step">
                <span class="journey-icon">🌟</span>
                <span class="journey-label">Money Master!</span>
              </div>
            </div>
          </div>
          
        </div>

        <!-- STEP 2: Character Selection -->
        <div v-if="currentStep === 'character'" class="step-content">
          
          <button class="back-btn" @click="prevStep">
            <span>←</span> Back
          </button>
          
          <div class="content-header">
            <h1 class="step-title">Choose Your Character!</h1>
            <p class="step-subtitle">Who do you want to be?</p>
          </div>
          
          <div class="character-grid">
            <button
              v-for="char in characters"
              :key="char.id"
              class="character-card"
              :class="{ selected: selectedCharacter === char.id }"
              @click="selectCharacter(char.id)"
            >
              <div class="char-glow" v-if="selectedCharacter === char.id"></div>
              <div class="char-emoji">{{ char.emoji }}</div>
              <h3 class="char-name">{{ char.name }}</h3>
              <p class="char-desc">{{ char.description }}</p>
              <div class="char-income">
                <img src="@/assets/images/kids/gold coin.png" class="income-coin" alt="" />
                <span class="income-amount">{{ char.income }}</span>
                <span class="income-label">/ week</span>
              </div>
              <div v-if="selectedCharacter === char.id" class="selected-badge">
                ⭐ PICKED!
              </div>
            </button>
          </div>
          
          <button 
            v-if="selectedCharacter"
            class="btn-continue"
            @click="nextStep"
          >
            <span class="btn-text">Choose My Goal!</span>
            <span class="btn-icon">🎯</span>
          </button>
          
        </div>

        <!-- STEP 3: Goal Selection -->
        <div v-if="currentStep === 'goal'" class="step-content">
          
          <button class="back-btn" @click="prevStep">
            <span>←</span> Back
          </button>
          
          <div class="content-header">
            <h1 class="step-title">Pick Your Prize! 🏆</h1>
            <p class="step-subtitle">What are you saving for?</p>
          </div>
          
          <div class="goal-grid">
            <button
              v-for="goal in goals"
              :key="goal.name"
              class="goal-card"
              :class="{ selected: selectedGoal?.name === goal.name }"
              @click="selectGoal(goal)"
            >
              <div class="goal-glow" :style="{ background: goal.color }" v-if="selectedGoal?.name === goal.name"></div>
              <img :src="goal.image" class="goal-image" :alt="goal.name" />
              <h3 class="goal-name">{{ goal.name }}</h3>
              <div class="goal-price">
                <img src="@/assets/images/kids/gold coin.png" class="price-coin" alt="" />
                <span class="price-amount">${{ goal.cost }}</span>
              </div>
              <div class="goal-time">⏰ ~{{ calculateWeeks(goal.cost) }} weeks</div>
              <img 
                v-if="selectedGoal?.name === goal.name" 
                src="@/assets/images/kids/gold star.png" 
                class="goal-star" 
                alt=""
              />
            </button>
          </div>
          
          <button 
            v-if="selectedGoal"
            class="btn-continue rainbow"
            @click="nextStep"
          >
            <span class="btn-text">I Want This!</span>
            <span class="btn-icon">✨</span>
          </button>
          
        </div>

        <!-- STEP 4: Tutorial -->
        <div v-if="currentStep === 'tutorial'" class="step-content tutorial-step">
          
          <div class="tutorial-card">
            <h1 class="tutorial-title">How To Play! 🎮</h1>
            
            <div class="tutorial-steps">
              <div class="tut-step">
                <div class="step-number">1</div>
                <div class="step-icon">📅</div>
                <div class="step-content">
                  <strong>Every week, stuff happens!</strong>
                  <span>You'll face fun money decisions</span>
                </div>
              </div>
              
              <div class="tut-step">
                <div class="step-number">2</div>
                <div class="step-icon">🤔</div>
                <div class="step-content">
                  <strong>You decide: spend or save?</strong>
                  <span>Each choice affects your money & happiness</span>
                </div>
              </div>
              
              <div class="tut-step">
                <div class="step-number">3</div>
                <div class="step-icon">🎯</div>
                <div class="step-content">
                  <strong>Save enough to get your prize!</strong>
                  <span>Reach your goal and WIN!</span>
                </div>
              </div>
            </div>
            
            <div class="penny-encouragement">
              <img src="@/assets/images/kids/pig.png" class="penny-small" alt="Penny" />
              <div class="encouragement-bubble">
                <p>Don't worry! I'll help you the whole way! 💪</p>
              </div>
            </div>
            
            <button class="btn-start" @click="launchGame">
              <span class="btn-text">START THE GAME!</span>
              <span class="btn-icon">🎮</span>
              <div class="btn-shine"></div>
            </button>
          </div>
          
        </div>
        
      </div>
    </div>
    
    <!-- Badges Preview (Bottom Bar) -->
    <div class="badges-bar">
      <span class="badges-label">🏅 Badges you can earn:</span>
      <div class="badges-preview">
        <span class="badge-item" title="First Saver">🌟</span>
        <span class="badge-item" title="Quiz Master">🧠</span>
        <span class="badge-item" title="Goal Getter">🏆</span>
        <span class="badge-item" title="Shop Smart">🛒</span>
        <span class="badge-item" title="Skill Builder">💪</span>
        <span class="badge-item" title="Level Up">🚀</span>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameState'

// Import images
import toyImage from '@/assets/images/kids/doll toy cartoon.png'
import artImage from '@/assets/images/kids/crayon box.png'
import gameImage from '@/assets/images/kids/game controler.png'

const router = useRouter()
const store = useGameStore()

const currentStep = ref('age')
const selectedAge = ref(null)
const selectedCharacter = ref(null)
const selectedGoal = ref(null)

// Fun facts that rotate
const funFacts = [
  "The first coins were made over 2,600 years ago! 🪙",
  "Kids who save early often become great with money! 💰",
  "A piggy bank is called that because of old clay jars! 🐷",
  "Saving just $1 a day = $365 a year! 📅",
  "The word 'bank' comes from the Italian word 'banca'! 🏦"
]

const currentFactIndex = ref(0)
const currentFact = computed(() => funFacts[currentFactIndex.value])

// Rotate facts
onMounted(() => {
  setInterval(() => {
    currentFactIndex.value = (currentFactIndex.value + 1) % funFacts.length
  }, 5000)
})

const ageGroups = [
  { id: 'kids', range: '7-12', emoji: '🧒', label: 'Kids' },
  { id: 'teens', range: '13-17', emoji: '🧑', label: 'Teens' },
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

const teenCharacters = [
  { 
    id: 'part-timer', 
    name: 'Part-Time Worker', 
    emoji: '🛍️', 
    description: 'You work at a store and earn weekly pay!', 
    income: '$50'
  },
  { 
    id: 'freelancer', 
    name: 'Freelance Star', 
    emoji: '💻', 
    description: 'You do gigs online and save your earnings!', 
    income: '$40'
  }
]

const teenGoals = [
  { name: 'New Phone', cost: 200, image: toyImage, color: '#FF6B9D' }, // Using same image for now
  { name: 'Gaming Setup', cost: 300, image: gameImage, color: '#4ECDC4' },
  { name: 'Concert Tickets', cost: 150, image: artImage, color: '#6C63FF' }
]

const characters = computed(() => selectedAge.value === 'kids' ? kidsCharacters : teenCharacters)
const goals = computed(() => selectedAge.value === 'kids' ? kidsGoals : teenGoals)

const calculateWeeks = (cost) => {
  const char = characters.value.find(c => c.id === selectedCharacter.value)
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
  const char = characters.value.find(c => c.id === selectedCharacter.value)
  const income = parseInt(char.income.replace(/\D/g, ''))
  
  store.ageGroup = selectedAge.value
  store.weeklyIncome = income
  store.initializeGame(selectedCharacter.value, selectedGoal.value)
  
  if (selectedAge.value === 'teens') {
    router.push('/game-teen')
  } else {
    router.push('/game')
  }
}
</script>

<style scoped>
/* =====================
   BASE LAYOUT
   ===================== */

.home-wrapper {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 45% 55%;
  grid-template-rows: 1fr auto;
  background: linear-gradient(135deg, #FFF8F0 0%, #FFE8D6 100%);
}

/* =====================
   LEFT PANEL
   ===================== */

.left-panel {
  background: linear-gradient(135deg, #FFE8D6 0%, #FFDAB9 100%);
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  grid-row: 1 / 2;
}

.decoration-scene {
  position: relative;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

/* Floating Elements */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px; /* Limit the height so they only float at the top */
  pointer-events: none;
  z-index: 1; /* Behind the content */
  overflow: hidden;
}

.float-coin {
  position: absolute;
  width: 35px;
  height: 35px;
  animation: floatAround 6s ease-in-out infinite;
  opacity: 0.7;
}

.c1 { top: 5%; left: 5%; animation-delay: 0s; }
.c2 { top: 10%; right: 10%; animation-delay: 2s; }
.c3 { top: 20%; left: 15%; animation-delay: 4s; }

.float-star {
  position: absolute;
  width: 25px;
  height: 25px;
  animation: twinkle 3s ease-in-out infinite;
  opacity: 0.7;
}

.s1 { top: 8%; right: 20%; animation-delay: 1s; }
.s2 { top: 15%; right: 5%; animation-delay: 2.5s; }

.float-emoji {
  position: absolute;
  font-size: 28px;
  animation: floatAround 8s ease-in-out infinite;
  opacity: 0.6;
}

.e1 { top: 3%; right: 25%; animation-delay: 1s; }
.e2 { top: 12%; left: 3%; animation-delay: 3s; }
.e3 { top: 18%; right: 8%; animation-delay: 5s; }

@keyframes floatAround {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(10deg); }
  50% { transform: translateY(-10px) rotate(-5deg); }
  75% { transform: translateY(-25px) rotate(5deg); }
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
  50% { opacity: 0.6; transform: scale(0.8) rotate(180deg); }
}

/* Mascot Scene */
.mascot-scene {
  position: relative;
  z-index: 10;
}

.main-mascot {
  width: 200px;
  height: 200px;
  object-fit: contain;
  animation: mascotBounce 3s ease-in-out infinite;
  filter: drop-shadow(0 20px 40px rgba(255, 107, 157, 0.3));
}

@keyframes mascotBounce {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

.mascot-glow {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 40px;
  background: radial-gradient(ellipse, rgba(255, 107, 157, 0.3) 0%, transparent 70%);
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.8; transform: translateX(-50%) scale(1.1); }
}

/* What You'll Learn */
.learn-preview {
  background: white;
  border-radius: 24px;
  padding: 24px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  position: relative;
  z-index: 10; /* Above the floating elements */
}

.learn-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 800;
  color: #2D3436;
  text-align: center;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.learn-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.learn-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #FFF8F0;
  border-radius: 12px;
  border: 2px solid #FFE66D;
}

.learn-icon {
  font-size: 24px;
}

.learn-text {
  font-size: 14px;
  font-weight: 700;
  color: #2D3436;
}

/* Fun Fact */
.fun-fact {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  width: 100%;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  border-left: 4px solid #6C63FF;
  position: relative;
  z-index: 10; /* Above the floating elements */
}

.fact-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.fact-text {
  margin: 0;
  font-size: 14px;
  color: #666;
  font-style: italic;
  line-height: 1.5;
}

/* =====================
   RIGHT PANEL
   ===================== */

.right-panel {
  padding: 40px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-row: 1 / 2;
  overflow-y: auto;
}

.content-wrapper {
  width: 100%;
  max-width: 600px;
}

.step-content {
  animation: slideIn 0.4s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Header */
.content-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-title {
  font-size: 56px;
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
  color: #888;
  margin: 8px 0 0;
}

.step-title {
  font-size: 36px;
  font-weight: 800;
  color: #2D3436;
  margin: 0;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.step-subtitle {
  font-size: 16px;
  color: #888;
  margin: 8px 0 0;
}

/* Welcome Bubble */
.welcome-bubble {
  background: white;
  border-radius: 24px;
  padding: 20px 24px;
  margin-bottom: 32px;
  position: relative;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  border: 3px solid #FFE66D;
}

.bubble-arrow {
  position: absolute;
  left: -16px;
  top: 30px;
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-right: 16px solid #FFE66D;
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

/* Age Section */
.age-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 28px;
  font-weight: 800;
  color: #2D3436;
  text-align: center;
  margin: 0 0 20px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.age-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.age-card {
  background: white;
  border: 4px solid #E0E0E0;
  border-radius: 24px;
  padding: 24px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.age-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}

.age-card.selected.kids-style {
  border-color: #FF6B9D;
  background: #FFF0F5;
}

.age-card.selected.teen-style {
  border-color: #6C63FF;
  background: #F0F0FF;
}

.age-emoji {
  font-size: 48px;
}

.age-range {
  font-size: 28px;
  font-weight: 900;
  color: #2D3436;
}

.age-label {
  font-size: 14px;
  color: #888;
  font-weight: 600;
}

.selected-star {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 36px;
  height: 36px;
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Info Row */
.info-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.info-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.info-card.safety {
  border: 3px solid #4ECDC4;
}

.info-card.parent {
  border: 3px solid #FFE66D;
}

.info-icon {
  font-size: 32px;
}

.info-text {
  display: flex;
  flex-direction: column;
}

.info-text strong {
  font-size: 14px;
  color: #2D3436;
}

.info-text span {
  font-size: 12px;
  color: #888;
}

/* Continue Button */
.btn-continue {
  width: 100%;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  border: none;
  border-radius: 20px;
  padding: 20px 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(78, 205, 196, 0.4);
  margin-bottom: 32px;
}

.btn-continue:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(78, 205, 196, 0.5);
}

.btn-continue.rainbow {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFE66D 50%, #4ECDC4 100%);
}

.btn-text {
  font-size: 22px;
  font-weight: 800;
  color: white;
  text-shadow: 2px 2px 0px rgba(0,0,0,0.1);
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.btn-icon {
  font-size: 28px;
}

/* Journey Preview */
.journey-preview {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.journey-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 800;
  color: #2D3436;
  text-align: center;
}

.journey-path {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.journey-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.journey-icon {
  font-size: 28px;
}

.journey-label {
  font-size: 11px;
  font-weight: 700;
  color: #666;
}

.journey-arrow {
  font-size: 20px;
  color: #CCC;
}

/* Back Button */
.back-btn {
  background: white;
  border: 3px solid #E0E0E0;
  border-radius: 30px;
  padding: 10px 20px;
  color: #666;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #F8F8F8;
  border-color: #CCC;
}

/* Character Grid */
.character-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.character-card {
  background: white;
  border: 4px solid #E0E0E0;
  border-radius: 28px;
  padding: 28px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.character-card:hover {
  transform: translateY(-8px);
}

.character-card.selected {
  border-color: #FFE66D;
  background: #FFFDF0;
}

.char-emoji {
  font-size: 72px;
  margin-bottom: 12px;
}

.char-name {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 800;
  color: #2D3436;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.char-desc {
  margin: 0 0 16px;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.char-income {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  padding: 10px 18px;
  border-radius: 16px;
}

.income-coin {
  width: 24px;
  height: 24px;
}

.income-amount {
  font-size: 22px;
  font-weight: 800;
  color: #2D3436;
}

.income-label {
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
}

/* Goal Grid */
.goal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.goal-card {
  background: white;
  border: 4px solid #E0E0E0;
  border-radius: 24px;
  padding: 20px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
}

.goal-card:hover {
  transform: translateY(-8px);
}

.goal-card.selected {
  border-color: #FFE66D;
  background: #FFFDF0;
}

.goal-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 12px;
}

.goal-name {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 800;
  color: #2D3436;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.goal-price {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.price-coin {
  width: 20px;
  height: 20px;
}

.price-amount {
  font-size: 24px;
  font-weight: 800;
  color: #4ECDC4;
}

.goal-time {
  font-size: 12px;
  color: #999;
}

.goal-star {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  animation: spin 2s linear infinite;
}

/* Tutorial */
.tutorial-step {
  display: flex;
  justify-content: center;
}

.tutorial-card {
  background: white;
  border-radius: 32px;
  padding: 40px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.12);
  border: 4px solid #FFE66D;
  text-align: center;
  max-width: 500px;
}

.tutorial-title {
  font-size: 36px;
  color: #6C63FF;
  margin: 0 0 32px;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.tutorial-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.tut-step {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #FFF8F0;
  border-radius: 16px;
  padding: 16px 20px;
  text-align: left;
}

.step-number {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  color: white;
  font-size: 18px;
  font-weight: 800;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.step-content {
  display: flex;
  flex-direction: column;
}

.step-content strong {
  font-size: 15px;
  color: #2D3436;
}

.step-content span {
  font-size: 13px;
  color: #888;
}

.penny-encouragement {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #FFF0F5;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
}

.penny-small {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.encouragement-bubble p {
  margin: 0;
  font-size: 15px;
  color: #FF6B9D;
  font-weight: 600;
}

.btn-start {
  width: 100%;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  border: none;
  border-radius: 20px;
  padding: 22px 32px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(108, 99, 255, 0.4);
  transition: all 0.3s ease;
}

.btn-start:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(108, 99, 255, 0.5);
}

.btn-start .btn-text {
  font-size: 24px;
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

/* =====================
   BADGES BAR
   ===================== */

.badges-bar {
  grid-column: 1 / -1;
  background: white;
  border-top: 4px solid #FFE66D;
  padding: 16px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.badges-label {
  font-size: 14px;
  font-weight: 700;
  color: #888;
}

.badges-preview {
  display: flex;
  gap: 12px;
}

.badge-item {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: linear-gradient(135deg, #F8F8F8 0%, #E8E8E8 100%);
  border-radius: 12px;
  opacity: 0.6;
  transition: all 0.3s ease;
  cursor: pointer;
}

.badge-item:hover {
  opacity: 1;
  transform: scale(1.15);
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
}

/* =====================
   RESPONSIVE
   ===================== */

@media (max-width: 1024px) {
  .home-wrapper {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
  
  .left-panel {
    display: none;
  }
  
  .right-panel {
    padding: 24px;
  }
  
  .logo-title {
    font-size: 42px;
  }
  
  .age-options {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  .character-grid {
    gap: 16px;
  }
  
  .goal-grid {
    gap: 12px;
  }
}

@media (max-width: 600px) {
  .age-options {
    grid-template-columns: 1fr;
  }
  
  .character-grid {
    grid-template-columns: 1fr;
  }
  
  .goal-grid {
    grid-template-columns: 1fr;
  }
  
  .info-row {
    flex-direction: column;
  }
  
  .badges-bar {
    flex-direction: column;
    gap: 12px;
  }
}
</style>