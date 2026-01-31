<!-- src/components/ChallengePopup.vue -->
<template>
  <transition name="pop">
    <div v-if="show" class="challenge-overlay">
      <div class="challenge-card">
        <!-- Header -->
        <div class="challenge-header" :class="challenge?.type">
          <span class="challenge-emoji">{{ challenge?.emoji }}</span>
          <h2>{{ challenge?.title }}</h2>
        </div>

        <!-- Content -->
        <div class="challenge-body">
          <p v-if="challenge?.description" class="description">
            {{ challenge.description }}
          </p>
          <p class="question">{{ challenge?.question }}</p>

          <!-- Options -->
          <div class="options">
            <button
              v-for="(option, index) in challenge?.options"
              :key="index"
              @click="selectAnswer(option)"
              :class="{ 
                selected: selectedAnswer === option,
                correct: showResult && option.correct,
                wrong: showResult && selectedAnswer === option && !option.correct
              }"
              :disabled="showResult"
              class="option-btn"
            >
              <span class="option-icon">
                {{ showResult ? (option.correct ? '✅' : (selectedAnswer === option ? '❌' : '')) : '○' }}
              </span>
              {{ option.text }}
            </button>
          </div>

          <!-- Result -->
          <transition name="fade">
            <div v-if="showResult" class="result">
              <div v-if="selectedAnswer?.correct" class="correct-result">
                <span class="result-emoji">🎉</span>
                <span>Correct!</span>
                <span v-if="challenge?.reward" class="reward">+${{ challenge.reward }}</span>
              </div>
              <div v-else class="wrong-result">
                <span class="result-emoji">😅</span>
                <span>Not quite!</span>
              </div>
              <div class="tip-box">
                <span class="tip-icon">💡</span>
                <p>{{ challenge?.tip }}</p>
              </div>
            </div>
          </transition>
        </div>

        <!-- Continue Button -->
        <button 
          v-if="showResult" 
          @click="handleComplete"
          class="continue-btn"
        >
          Continue Playing! 🎮
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  challenge: Object
})

const emit = defineEmits(['complete'])

const selectedAnswer = ref(null)
const showResult = ref(false)

// Reset when a new challenge appears
watch(() => props.show, (newVal) => {
  if (newVal) {
    selectedAnswer.value = null
    showResult.value = false
  }
})

const selectAnswer = (option) => {
  if (showResult.value) return
  selectedAnswer.value = option
  showResult.value = true
}

const handleComplete = () => {
  emit('complete', selectedAnswer.value?.correct || false)
  selectedAnswer.value = null
  showResult.value = false
}
</script>

<style scoped>
.challenge-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.challenge-card {
  background: #1e293b;
  border-radius: 24px;
  max-width: 420px;
  width: 100%;
  overflow: hidden;
}

.challenge-header {
  padding: 28px 24px;
  text-align: center;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
}

.challenge-header.bonus {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.challenge-header.scenario {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.challenge-emoji {
  font-size: 3.5rem;
  display: block;
  margin-bottom: 12px;
  animation: wiggle 0.5s ease;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

.challenge-header h2 {
  color: white;
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
}

.challenge-body {
  padding: 24px;
}

.description {
  color: #94a3b8;
  margin-bottom: 16px;
  text-align: center;
  font-size: 1rem;
  line-height: 1.5;
}

.question {
  color: white;
  font-size: 1.15rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-btn {
  background: #334155;
  border: 2px solid #475569;
  color: white;
  padding: 16px 20px;
  border-radius: 14px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}

.option-btn:hover:not(:disabled) {
  background: #475569;
  border-color: #8b5cf6;
  transform: translateX(4px);
}

.option-btn:disabled {
  cursor: default;
}

.option-btn.correct {
  background: rgba(34, 197, 94, 0.2);
  border-color: #22c55e;
}

.option-btn.wrong {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
}

.option-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.result {
  margin-top: 24px;
  text-align: center;
}

.correct-result,
.wrong-result {
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.correct-result {
  color: #22c55e;
}

.wrong-result {
  color: #ef4444;
}

.result-emoji {
  font-size: 2rem;
}

.reward {
  background: #22c55e;
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 1rem;
}

.tip-box {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #1a1a2e;
  padding: 16px;
  border-radius: 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  text-align: left;
}

.tip-box .tip-icon {
  font-size: 1.5rem;
}

.tip-box p {
  margin: 0;
  font-weight: 500;
  line-height: 1.4;
}

.continue-btn {
  width: 100%;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: white;
  border: none;
  padding: 18px;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.continue-btn:hover {
  opacity: 0.9;
}

/* Transitions */
.pop-enter-active,
.pop-leave-active {
  transition: all 0.3s ease;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
}

.pop-enter-from .challenge-card,
.pop-leave-to .challenge-card {
  transform: scale(0.8);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>