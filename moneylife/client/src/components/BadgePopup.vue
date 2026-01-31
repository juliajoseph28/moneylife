<!-- src/components/BadgePopup.vue -->
<template>
  <transition name="badge-pop">
    <div v-if="show" class="badge-overlay" @click.self="$emit('close')">
      <div class="badge-popup">
        <div class="confetti">🎊</div>
        <div class="badge-icon">{{ badge?.emoji }}</div>
        <h2>Badge Unlocked!</h2>
        <h3>{{ badge?.name }}</h3>
        <p>{{ badge?.description }}</p>
        <button @click="$emit('close')" class="awesome-btn">
          Awesome! 🎉
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  badge: Object
})
defineEmits(['close'])
</script>

<style scoped>
.badge-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 20px;
}

.badge-popup {
  background: linear-gradient(135deg, #1e293b, #334155);
  border: 3px solid #fbbf24;
  padding: 40px 32px;
  border-radius: 24px;
  text-align: center;
  max-width: 340px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.confetti {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 2rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.badge-icon {
  font-size: 5rem;
  margin-bottom: 16px;
  animation: badge-bounce 0.6s ease;
}

@keyframes badge-bounce {
  0% { transform: scale(0) rotate(-180deg); }
  60% { transform: scale(1.2) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); }
}

h2 {
  color: #fbbf24;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

h3 {
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 12px;
}

p {
  color: #94a3b8;
  font-size: 1rem;
  margin-bottom: 24px;
}

.awesome-btn {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #1a1a2e;
  border: none;
  padding: 14px 36px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.awesome-btn:hover {
  transform: scale(1.05);
}

/* Transition */
.badge-pop-enter-active,
.badge-pop-leave-active {
  transition: all 0.4s ease;
}

.badge-pop-enter-from,
.badge-pop-leave-to {
  opacity: 0;
}

.badge-pop-enter-from .badge-popup,
.badge-pop-leave-to .badge-popup {
  transform: scale(0.5) rotate(-20deg);
}
</style>