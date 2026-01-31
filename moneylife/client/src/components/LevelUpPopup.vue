<template>
  <div v-if="show" class="levelup-overlay">
    <div class="levelup-card">
      
      <!-- Celebration -->
      <div class="celebration">
        <div class="confetti-mini" v-for="n in 20" :key="n" :style="confettiStyle(n)"></div>
      </div>
      
      <!-- Content -->
      <div class="levelup-content">
        <div class="level-icon">{{ level?.icon }}</div>
        <h2 class="levelup-title">LEVEL UP!</h2>
        <h3 class="level-name">{{ level?.name }}</h3>
        <p class="level-description">{{ level?.description }}</p>
        
        <!-- Unlocks -->
        <div class="unlocks-section">
          <h4 class="unlocks-title">🔓 New Places Unlocked!</h4>
          <div class="unlocks-list">
            <span v-for="place in level?.unlocks" :key="place" class="unlock-item">
              {{ getPlaceEmoji(place) }} {{ place }}
            </span>
          </div>
        </div>
        
        <!-- Bonus -->
        <div class="bonus-section">
          <div class="bonus-item">
            <span class="bonus-icon">💰</span>
            <span>+$5 Bonus!</span>
          </div>
          <div class="bonus-item">
            <span class="bonus-icon">📋</span>
            <span>+5 Planning Skill!</span>
          </div>
        </div>
        
        <!-- Penny -->
        <div class="penny-celebrate">
          <img src="@/assets/images/kids/pig.png" class="penny-img" alt="Penny" />
          <p>Wow! You're getting so good at this! 🌟</p>
        </div>
        
        <button class="btn-awesome" @click="$emit('close')">
          <span>Awesome!</span>
          <span>🎉</span>
        </button>
      </div>
      
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  level: Object
})

defineEmits(['close'])

const getPlaceEmoji = (place) => {
  const emojis = {
    'Home': '🏠',
    'Backyard': '🌳',
    'Park': '🏞️',
    "Friend's House": '🏡',
    'Mall': '🏬',
    'Arcade': '🎮',
    'Pet Store': '🐾',
    'Bank': '🏦',
    'Investment Club': '📈'
  }
  return emojis[place] || '📍'
}

const confettiStyle = (n) => {
  const colors = ['#FF6B9D', '#FFE66D', '#4ECDC4', '#6C63FF', '#FF8C42']
  return {
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 2 + 's',
    backgroundColor: colors[n % colors.length]
  }
}
</script>

<style scoped>
.levelup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}

.levelup-card {
  background: white;
  border-radius: 32px;
  max-width: 400px;
  width: 100%;
  border: 4px solid #FFE66D;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: popIn 0.5s ease;
  overflow: hidden;
  position: relative;
}

@keyframes popIn {
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  50% { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

/* Celebration confetti */
.celebration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 150px;
  overflow: hidden;
  pointer-events: none;
}

.confetti-mini {
  position: absolute;
  width: 8px;
  height: 8px;
  top: -10px;
  border-radius: 2px;
  animation: confettiFall 3s ease-in-out infinite;
}

@keyframes confettiFall {
  0% { top: -10px; opacity: 1; transform: rotate(0deg); }
  100% { top: 150px; opacity: 0; transform: rotate(360deg); }
}

/* Content */
.levelup-content {
  padding: 32px 24px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.level-icon {
  font-size: 72px;
  margin-bottom: 12px;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.levelup-title {
  margin: 0;
  font-size: 32px;
  font-weight: 900;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.level-name {
  margin: 8px 0;
  font-size: 24px;
  font-weight: 800;
  color: #2D3436;
}

.level-description {
  margin: 0 0 20px;
  font-size: 14px;
  color: #666;
}

/* Unlocks */
.unlocks-section {
  background: #F8F0FF;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.unlocks-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 700;
  color: #6C63FF;
}

.unlocks-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.unlock-item {
  background: white;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #2D3436;
  border: 2px solid #6C63FF;
}

/* Bonus */
.bonus-section {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.bonus-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #E8FFF8 0%, #D0F5E8 100%);
  padding: 10px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 700;
  color: #4ECDC4;
  border: 2px solid #4ECDC4;
}

.bonus-icon {
  font-size: 18px;
}

/* Penny */
.penny-celebrate {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #FFF8F0;
  border-radius: 16px;
  padding: 12px 16px;
  margin-bottom: 20px;
}

.penny-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  animation: wiggle 1s ease-in-out infinite;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}

.penny-celebrate p {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #2D3436;
  text-align: left;
}

/* Button */
.btn-awesome {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  color: #2D3436;
  border: none;
  border-radius: 20px;
  padding: 18px 32px;
  font-size: 20px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Comic Sans MS', 'Chalkboard', cursive;
}

.btn-awesome:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(255, 217, 61, 0.5);
}
</style>