<!-- src/components/TipPopup.vue -->
<template>
  <transition name="slide-up">
    <div v-if="show" class="tip-overlay" @click.self="$emit('close')">
      <div class="tip-popup">
        <div class="tip-icon">💡</div>
        <div class="tip-content">
          <h4>Money Tip!</h4>
          <p>{{ tip }}</p>
        </div>
        <button @click="$emit('close')" class="got-it-btn">
          Got it! 👍
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  tip: String
})
defineEmits(['close'])
</script>

<style scoped>
.tip-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.tip-popup {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #1a1a2e;
  padding: 20px 24px;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 -10px 40px rgba(251, 191, 36, 0.3);
}

.tip-icon {
  font-size: 2.5rem;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.tip-content {
  text-align: center;
}

.tip-content h4 {
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.tip-content p {
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.5;
}

.got-it-btn {
  background: #1a1a2e;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.got-it-btn:hover {
  background: #2d2d4a;
  transform: scale(1.05);
}

/* Transition animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>