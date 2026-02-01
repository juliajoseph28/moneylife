<template>
  <div v-if="show" class="challenge-overlay">
    <div class="challenge-card">
      
      <!-- Left Side: Question Info -->
      <div class="challenge-left">
        <!-- Header -->
        <div class="challenge-header">
          <div class="header-icon">🧠</div>
          <h2 class="header-title">Quiz Time!</h2>
          <p class="header-subtitle">Answer correctly to earn bonus coins!</p>
        </div>
        
        <!-- Question -->
        <div class="question-box">
          <span class="question-emoji">{{ challenge?.emoji || '🤔' }}</span>
          <p class="question-text">{{ challenge?.question }}</p>
        </div>
        
        <!-- Penny Helper -->
        <div class="penny-helper">
          <img src="@/assets/images/kids/pig.png" class="penny-img" alt="Penny" />
          <div class="penny-speech">
            <p v-if="!answered">Take your time and think! 🤔</p>
            <p v-else-if="isCorrect">You're so smart! 🌟</p>
            <p v-else>Don't worry, you'll get it next time! 💪</p>
          </div>
        </div>
      </div>
      
      <!-- Right Side: Options & Results -->
      <div class="challenge-right">
        <!-- Options -->
        <div v-if="!answered" class="options-container">
          <button
            v-for="option in challenge?.options"
            :key="option.id"
            class="option-btn"
            :class="{ 
              correct: answered && option.correct,
              wrong: answered && selectedOption === option.id && !option.correct,
              disabled: answered
            }"
            :disabled="answered"
            @click="selectOption(option)"
          >
            <span class="option-circle">
              <span v-if="answered && option.correct">✓</span>
              <span v-else-if="answered && selectedOption === option.id && !option.correct">✗</span>
            </span>
            <span class="option-text">{{ option.text }}</span>
          </button>
        </div>
        
        <!-- Result (shows after answering) -->
        <div v-if="answered" class="result-container" :class="isCorrect ? 'correct' : 'wrong'">
          <div class="result-icon">{{ isCorrect ? '🎉' : '😅' }}</div>
          <h3 class="result-title">{{ isCorrect ? 'Great Job!' : 'Not quite!' }}</h3>
          <p class="result-explanation">{{ challenge?.explanation }}</p>
          
          <div v-if="isCorrect" class="reward-box">
            <span class="reward-icon">🪙</span>
            <span class="reward-text">+${{ challenge?.reward }} bonus!</span>
          </div>
          
          <button class="btn-continue" @click="handleComplete">
            <span>Continue</span>
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: Boolean,
  challenge: Object
})

const emit = defineEmits(['complete'])

const answered = ref(false)
const selectedOption = ref(null)
const isCorrect = ref(false)

const selectOption = (option) => {
  if (answered.value) return
  
  selectedOption.value = option.id
  isCorrect.value = option.correct
  answered.value = true
}

const handleComplete = () => {
  emit('complete', isCorrect.value)
  // Reset for next time
  answered.value = false
  selectedOption.value = null
  isCorrect.value = false
}
</script>

<style scoped>
/* Overlay */
.challenge-overlay {
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

/* Card - Horizontal Layout */
.challenge-card {
  background: white;
  border-radius: 24px;
  max-width: 900px;
  width: 95%;
  max-height: 85vh;
  border: 4px solid #FFE66D;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: popIn 0.4s ease;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}

@keyframes popIn {
  0% { transform: scale(0.8) translateY(20px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

/* Left Side */
.challenge-left {
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #FFF8F0 0%, #FFE8D6 100%);
}

/* Right Side */
.challenge-right {
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
  background: white;
}

/* Header */
.challenge-header {
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  padding: 20px;
  text-align: center;
}

.header-icon {
  font-size: 36px;
  margin-bottom: 6px;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.header-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: white;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
  text-shadow: 2px 2px 0px rgba(0,0,0,0.1);
}

.header-subtitle {
  margin: 6px 0 0;
  font-size: 12px;
  color: rgba(255,255,255,0.9);
  font-weight: 600;
}

/* Question Box */
.question-box {
  padding: 24px;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.question-emoji {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

.question-text {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #2D3436;
  line-height: 1.4;
}

/* Options */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px 18px;
  background: white;
  border: 3px solid #E8E8E8;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.option-btn:hover:not(.disabled) {
  transform: translateX(8px);
  border-color: #6C63FF;
  background: #F8F0FF;
}

.option-btn.correct {
  border-color: #4ECDC4;
  background: linear-gradient(135deg, #E8FFF8 0%, #D0F5E8 100%);
}

.option-btn.wrong {
  border-color: #FF6B9D;
  background: linear-gradient(135deg, #FFF0F5 0%, #FFE0E8 100%);
}

.option-btn.disabled {
  cursor: default;
}

.option-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.option-btn.correct .option-circle {
  background: #4ECDC4;
  border-color: #4ECDC4;
  color: white;
}

.option-btn.wrong .option-circle {
  background: #FF6B9D;
  border-color: #FF6B9D;
  color: white;
}

.option-text {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #2D3436;
}

/* Result */
.result-container {
  padding: 20px;
  border-radius: 18px;
  text-align: center;
  animation: slideUp 0.4s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
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
  background: linear-gradient(135deg, #FFF0F5 0%, #FFE0E8 100%);
  border: 3px solid #FF6B9D;
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

.result-explanation {
  margin: 0 0 16px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* Reward Box */
.reward-box {
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

.reward-icon {
  font-size: 24px;
}

.reward-text {
  font-size: 18px;
  font-weight: 800;
  color: #2D3436;
}

/* Continue Button */
.btn-continue {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
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
  box-shadow: 0 8px 24px rgba(108, 99, 255, 0.4);
}

.btn-arrow {
  font-size: 20px;
}

/* Penny Helper */
.penny-helper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  margin: 16px;
  border-radius: 16px;
  border: 3px solid #FFE66D;
}

.penny-img {
  width: 45px;
  height: 45px;
  object-fit: contain;
  animation: wiggle 2s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.penny-speech {
  flex: 1;
  background: transparent;
  border-radius: 0;
  padding: 0;
  border: none;
}

.penny-speech p {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #2D3436;
}

/* Responsive */
@media (max-width: 900px) {
  .challenge-card {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
  
  .challenge-left {
    order: 1;
  }
  
  .challenge-right {
    order: 2;
  }
}

@media (max-height: 700px) {
  .challenge-header {
    padding: 16px;
  }
  
  .header-icon {
    font-size: 32px;
  }
  
  .header-title {
    font-size: 20px;
  }
  
  .question-box {
    padding: 16px;
  }
  
  .question-emoji {
    font-size: 40px;
  }
  
  .options-container {
    gap: 10px;
  }
  
  .option-btn {
    padding: 12px 14px;
  }
}
</style>