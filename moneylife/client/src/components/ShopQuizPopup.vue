<template>
  <div v-if="show" class="quiz-overlay">
    <div class="quiz-card">
      
      <!-- Header -->
      <div class="quiz-header">
        <div class="header-icon">🛒</div>
        <h2 class="header-title">{{ quiz?.title || 'Shop Smart!' }}</h2>
        <p class="header-subtitle">Pick the best deal!</p>
      </div>
      
      <!-- Scenario -->
      <div class="scenario-box">
        <p class="scenario-text">{{ quiz?.scenario }}</p>
      </div>
      
      <!-- Options -->
      <div class="options-container">
        <button
          v-for="option in quiz?.options"
          :key="option.id"
          class="option-card"
          :class="{ 
            selected: selectedOption === option.id,
            correct: answered && option.isBest,
            wrong: answered && selectedOption === option.id && !option.isBest,
            disabled: answered
          }"
          :disabled="answered"
          @click="selectOption(option)"
        >
          <div class="option-header">
            <span class="option-name">{{ option.name }}</span>
            <span class="option-price">${{ option.price }}</span>
          </div>
          <p class="option-quality">{{ option.quality }}</p>
          
          <div v-if="answered && option.isBest" class="best-badge">
            ✓ BEST DEAL!
          </div>
        </button>
      </div>
      
      <!-- Result -->
      <div v-if="answered" class="result-container" :class="isCorrect ? 'correct' : 'wrong'">
        <div class="result-icon">{{ isCorrect ? '🎉' : '🤔' }}</div>
        <h3 class="result-title">{{ isCorrect ? 'Smart Shopper!' : 'Good Try!' }}</h3>
        <p class="result-tip">{{ quiz?.tip }}</p>
        
        <div v-if="isCorrect" class="savings-box">
          <span class="savings-icon">💰</span>
          <span class="savings-text">You saved ${{ quiz?.savings }}!</span>
        </div>
        
        <div class="skills-earned">
          <span class="skill-badge">📋 +5 Planning</span>
          <span v-if="isCorrect" class="skill-badge">⏰ +3 Patience</span>
        </div>
        
        <button class="btn-continue" @click="handleComplete">
          <span>Continue</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
      
      <!-- Penny Helper -->
      <div v-if="!answered" class="penny-helper">
        <img src="@/assets/images/kids/pig.png" class="penny-img" alt="Penny" />
        <div class="penny-speech">
          <p>Compare the prices and think about what you really need! 🤔</p>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: Boolean,
  quiz: Object
})

const emit = defineEmits(['complete'])

const answered = ref(false)
const selectedOption = ref(null)
const isCorrect = ref(false)

const selectOption = (option) => {
  if (answered.value) return
  
  selectedOption.value = option.id
  isCorrect.value = option.isBest
  answered.value = true
}

const handleComplete = () => {
  emit('complete', isCorrect.value, isCorrect.value ? props.quiz?.savings : 0)
  // Reset for next time
  answered.value = false
  selectedOption.value = null
  isCorrect.value = false
}
</script>

<style scoped>
.quiz-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.quiz-card {
  background: white;
  border-radius: 32px;
  padding: 0;
  max-width: 480px;
  width: 100%;
  border: 4px solid #4ECDC4;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: popIn 0.4s ease;
  overflow: hidden;
}

@keyframes popIn {
  0% { transform: scale(0.8) translateY(20px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

/* Header */
.quiz-header {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  padding: 24px;
  text-align: center;
}

.header-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.header-title {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: white;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.header-subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: rgba(255,255,255,0.9);
}

/* Scenario */
.scenario-box {
  padding: 20px 24px;
  background: #FFF8F0;
  border-bottom: 3px dashed #FFE66D;
}

.scenario-text {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2D3436;
  text-align: center;
  line-height: 1.5;
}

/* Options */
.options-container {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-card {
  background: white;
  border: 3px solid #E8E8E8;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
}

.option-card:hover:not(.disabled) {
  transform: translateY(-4px);
  border-color: #4ECDC4;
  box-shadow: 0 8px 24px rgba(78, 205, 196, 0.2);
}

.option-card.selected {
  border-color: #6C63FF;
  background: #F8F0FF;
}

.option-card.correct {
  border-color: #4ECDC4;
  background: linear-gradient(135deg, #E8FFF8 0%, #D0F5E8 100%);
}

.option-card.wrong {
  border-color: #FF6B9D;
  background: linear-gradient(135deg, #FFF0F5 0%, #FFE0E8 100%);
}

.option-card.disabled {
  cursor: default;
}

.option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.option-name {
  font-size: 16px;
  font-weight: 700;
  color: #2D3436;
}

.option-price {
  font-size: 20px;
  font-weight: 800;
  color: #FF6B9D;
  background: #FFF0F5;
  padding: 4px 12px;
  border-radius: 12px;
}

.option-quality {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.best-badge {
  position: absolute;
  top: -8px;
  right: 12px;
  background: #4ECDC4;
  color: white;
  font-size: 11px;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 12px;
}

/* Result */
.result-container {
  margin: 0 24px 24px;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-container.correct {
  background: linear-gradient(135deg, #E8FFF8 0%, #D0F5E8 100%);
  border: 3px solid #4ECDC4;
}

.result-container.wrong {
  background: linear-gradient(135deg, #FFF8F0 0%, #FFE8D6 100%);
  border: 3px solid #FFE66D;
}

.result-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.result-title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 800;
  color: #2D3436;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.result-tip {
  margin: 0 0 16px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.savings-box {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  padding: 12px 20px;
  border-radius: 20px;
  margin-bottom: 16px;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.savings-icon {
  font-size: 24px;
}

.savings-text {
  font-size: 18px;
  font-weight: 800;
  color: #2D3436;
}

.skills-earned {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.skill-badge {
  background: white;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  color: #6C63FF;
  border: 2px solid #6C63FF;
}

.btn-continue {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-continue:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(78, 205, 196, 0.4);
}

.btn-arrow {
  font-size: 20px;
}

/* Penny Helper */
.penny-helper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: #FFF8F0;
  border-top: 3px dashed #FFE66D;
}

.penny-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.penny-speech {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 10px 14px;
  border: 2px solid #FFE66D;
}

.penny-speech p {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #2D3436;
}
</style>