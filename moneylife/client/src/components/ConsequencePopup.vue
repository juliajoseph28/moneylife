<template>
  <div v-if="show" class="consequence-overlay">
    <div class="consequence-modal">
      
      <!-- Sad Penny -->
      <div class="penny-sad">
        <img src="@/assets/images/kids/pig.png" class="penny-image" alt="Penny" />
        <div class="sad-emoji">😢</div>
      </div>
      
      <!-- Consequence Content -->
      <div class="consequence-content">
        <div class="consequence-header">
          <span class="header-icon">⚠️</span>
          <h2 class="header-title">{{ consequence?.title }}</h2>
        </div>
        
        <div class="message-box">
          <p class="consequence-message">{{ consequence?.message }}</p>
        </div>
        
        <!-- What Happened -->
        <div class="effects-box">
          <h3>What happened:</h3>
          <ul class="effects-list">
            <li v-if="consequence?.id === 'missed_friend_party'">
              😢 Your friendship with Alex got weaker
            </li>
            <li v-if="consequence?.id === 'missed_friend_party'">
              💔 You feel sad about missing the party
            </li>
            <li v-if="consequence?.id === 'cant_help_shelter'">
              🐕 The shelter couldn't help as many animals
            </li>
            <li v-if="consequence?.id === 'item_sold_out'">
              📈 Your goal now costs MORE money!
            </li>
            <li v-if="consequence?.id === 'no_emergency_fund'">
              🚶 You have to walk everywhere now
            </li>
          </ul>
        </div>
        
        <!-- Lesson Box -->
        <div class="lesson-box">
          <div class="lesson-header">
            <span class="lesson-icon">💡</span>
            <span class="lesson-label">What We Can Learn</span>
          </div>
          <p class="lesson-text">{{ consequence?.lesson }}</p>
        </div>
        
        <!-- Next Time Tips -->
        <div class="tips-box">
          <h3>🎯 Try This Next Time:</h3>
          <div class="tip-items">
            <div class="tip-item">
              <span>✓</span>
              <span>Save a little bit every week</span>
            </div>
            <div class="tip-item">
              <span>✓</span>
              <span>Ask "Do I NEED this or WANT this?"</span>
            </div>
            <div class="tip-item">
              <span>✓</span>
              <span>Keep some money for surprises</span>
            </div>
          </div>
        </div>
        
        <!-- Continue Button -->
        <button class="btn-continue" @click="handleContinue">
          <span>I Understand - Let's Keep Going!</span>
        </button>
        
      </div>
      
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  consequence: Object
})

const emit = defineEmits(['continue'])

const handleContinue = () => {
  emit('continue')
}
</script>

<style scoped>
.consequence-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.consequence-modal {
  background: white;
  border-radius: 32px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 150px 1fr;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: shake 0.5s ease;
  border: 4px solid #FF6B6B;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* Penny Section */
.penny-sad {
  background: linear-gradient(180deg, #FFE0E0 0%, #FFC0C0 100%);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 28px 0 0 28px;
}

.penny-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  filter: grayscale(30%);
  animation: pennyWorry 1s ease-in-out infinite;
}

@keyframes pennyWorry {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.sad-emoji {
  font-size: 40px;
  margin-top: 12px;
}

/* Content Section */
.consequence-content {
  padding: 32px;
}

.consequence-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.header-icon {
  font-size: 36px;
}

.header-title {
  font-size: 24px;
  font-weight: 800;
  color: #FF6B6B;
  margin: 0;
  font-family: 'Comic Sans MS', cursive;
}

.message-box {
  background: #FFF8F0;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #FF6B6B;
}

.consequence-message {
  font-size: 16px;
  color: #2D3436;
  line-height: 1.6;
  margin: 0;
}

/* Effects Box */
.effects-box {
  background: #FFE8E8;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.effects-box h3 {
  font-size: 14px;
  font-weight: 700;
  color: #FF6B6B;
  margin: 0 0 12px;
}

.effects-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.effects-list li {
  font-size: 14px;
  color: #666;
  padding: 6px 0;
  border-bottom: 1px dashed #FFB0B0;
}

.effects-list li:last-child {
  border-bottom: none;
}

/* Lesson Box */
.lesson-box {
  background: linear-gradient(135deg, #E8FFF8 0%, #D0F5E8 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 2px solid #4ECDC4;
}

.lesson-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.lesson-icon {
  font-size: 24px;
}

.lesson-label {
  font-size: 16px;
  font-weight: 800;
  color: #4ECDC4;
}

.lesson-text {
  font-size: 15px;
  color: #2D3436;
  line-height: 1.6;
  margin: 0;
}

/* Tips Box */
.tips-box {
  background: #F8F8FF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.tips-box h3 {
  font-size: 14px;
  font-weight: 700;
  color: #667eea;
  margin: 0 0 12px;
}

.tip-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #2D3436;
}

.tip-item span:first-child {
  color: #4ECDC4;
  font-weight: bold;
}

/* Button */
.btn-continue {
  width: 100%;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 18px 24px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-continue:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(78, 205, 196, 0.4);
}

/* Responsive */
@media (max-width: 600px) {
  .consequence-modal {
    grid-template-columns: 1fr;
  }
  
  .penny-sad {
    border-radius: 28px 28px 0 0;
    padding: 20px;
    flex-direction: row;
    gap: 16px;
  }
  
  .penny-image {
    width: 60px;
    height: 60px;
  }
}
</style>