<template>
  <div v-if="show" class="penny-help-overlay">
    <div class="penny-help-modal">
      
      <!-- Penny's Expression -->
      <div class="penny-section">
        <div class="penny-mood" :class="moodClass">
          <img src="@/assets/images/kids/pig.png" class="penny-image" alt="Penny" />
          <div class="mood-indicator">{{ moodEmoji }}</div>
        </div>
      </div>
      
      <!-- Message Section -->
      <div class="message-section">
        <div class="message-header">
          <span class="header-icon">{{ headerIcon }}</span>
          <h2 class="header-title">{{ headerTitle }}</h2>
        </div>
        
        <div class="message-bubble">
          <p class="penny-says">Penny says:</p>
          <p class="main-message">{{ mainMessage }}</p>
        </div>
        
        <!-- Teaching Tip -->
        <div class="teaching-tip">
          <div class="tip-header">
            <span class="tip-icon">💡</span>
            <span class="tip-label">Money Tip!</span>
          </div>
          <p class="tip-content">{{ teachingTip }}</p>
        </div>
        
        <!-- AI Personalized Feedback (if available) -->
        <div v-if="aiFeedback" class="ai-feedback">
          <div class="ai-header">
            <span class="ai-icon">🤖</span>
            <span class="ai-label">Smart Advice Just For You!</span>
          </div>
          <p class="ai-content">{{ aiFeedback }}</p>
        </div>
        
        <!-- Quick Quiz (optional teaching moment) -->
        <div v-if="showQuiz && quizQuestion" class="quick-quiz">
          <h3 class="quiz-title">🧠 Quick Think!</h3>
          <p class="quiz-question">{{ quizQuestion.question }}</p>
          
          <div class="quiz-options">
            <button
              v-for="option in quizQuestion.options"
              :key="option.id"
              class="quiz-option"
              :class="{ 
                correct: quizAnswered && option.correct,
                wrong: quizAnswered && selectedAnswer === option.id && !option.correct
              }"
              :disabled="quizAnswered"
              @click="answerQuiz(option)"
            >
              {{ option.text }}
            </button>
          </div>
          
          <p v-if="quizAnswered" class="quiz-result">
            {{ selectedAnswer && quizQuestion.options.find(o => o.id === selectedAnswer)?.correct 
               ? '🎉 Great job! You got it!' 
               : '💪 Good try! Now you know for next time!' }}
          </p>
        </div>
        
        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn-got-it" @click="handleClose">
            <span>{{ quizAnswered || !showQuiz ? "I've Got This! 💪" : "Let Me Try!" }}</span>
          </button>
          
          <button v-if="showHelpButton" class="btn-need-help" @click="getMoreHelp">
            <span>I Need More Help 🆘</span>
          </button>
        </div>
        
        <!-- Encouragement -->
        <div class="encouragement">
          <span class="encourage-stars">⭐</span>
          <p>{{ encouragement }}</p>
          <span class="encourage-stars">⭐</span>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { gameState } from '@/stores/gameState'

const props = defineProps({
  show: Boolean,
  situation: {
    type: String,
    default: 'struggling' // 'struggling', 'debt', 'low_happiness', 'spending_spree', 'great_job'
  }
})

const emit = defineEmits(['close', 'helped'])

const aiFeedback = ref(null)
const isLoadingAI = ref(false)
const showQuiz = ref(true)
const quizAnswered = ref(false)
const selectedAnswer = ref(null)

// Situation-based content
const situationContent = {
  debt: {
    moodClass: 'worried',
    moodEmoji: '😰',
    headerIcon: '💸',
    headerTitle: "Uh Oh! We're in the Red!",
    mainMessage: "Hey friend! I noticed your piggy bank is empty and you owe money. That's called being 'in debt'. But don't worry - we can fix this together!",
    teachingTip: "When you owe money, it's important to stop spending on things you don't NEED until you pay it back. Try to earn extra coins and avoid buying fun stuff for a little while!",
    encouragement: "Everyone makes mistakes with money. What matters is learning from them!",
    quiz: {
      question: "You owe $10 and get $8 allowance. What should you do?",
      options: [
        { id: 'a', text: 'Buy a $5 toy anyway', correct: false },
        { id: 'b', text: 'Pay back as much as you can first', correct: true },
        { id: 'c', text: 'Ignore it and hope it goes away', correct: false }
      ]
    }
  },
  low_balance: {
    moodClass: 'concerned',
    moodEmoji: '🤔',
    headerIcon: '🪙',
    headerTitle: 'Running Low on Coins!',
    mainMessage: "I see your savings are getting pretty low! That's okay - let's think about how to build them back up!",
    teachingTip: "When money gets low, ask yourself before buying anything: 'Do I NEED this or just WANT this?' Needs come first, wants can wait!",
    encouragement: "You're learning! Every money expert started just like you!",
    quiz: {
      question: "You have $5 left. Your friend invites you to the arcade ($8). What's smart?",
      options: [
        { id: 'a', text: 'Borrow money to go', correct: false },
        { id: 'b', text: 'Say maybe next time when I save more', correct: true },
        { id: 'c', text: 'Spend all $5 on snacks instead', correct: false }
      ]
    }
  },
  low_happiness: {
    moodClass: 'sad',
    moodEmoji: '😔',
    headerIcon: '❤️',
    headerTitle: 'Feeling a Bit Down?',
    mainMessage: "I notice your happiness is getting low. Saving money is great, but it's also important to enjoy life sometimes!",
    teachingTip: "Balance is key! It's okay to spend a little on fun things. Try to save 60% and use 40% for things that make you happy!",
    encouragement: "A happy saver is a better saver! Take care of yourself too!",
    quiz: {
      question: "What's the best way to be happy AND save money?",
      options: [
        { id: 'a', text: 'Never spend on anything fun', correct: false },
        { id: 'b', text: 'Save some and spend some - find balance!', correct: true },
        { id: 'c', text: 'Spend everything to be happy now', correct: false }
      ]
    }
  },
  spending_spree: {
    moodClass: 'surprised',
    moodEmoji: '😮',
    headerIcon: '🛍️',
    headerTitle: 'Whoa, Big Spender!',
    mainMessage: "Wow, you've been spending a lot! It's fun to buy things, but let's make sure we can still reach our goal!",
    teachingTip: "Before you buy something, try the '24-hour rule' - wait a day and see if you still want it. Many times, the feeling goes away!",
    encouragement: "Spending isn't bad - just be thoughtful about it!",
    quiz: {
      question: "You see a cool toy. You want it but don't need it. Best choice?",
      options: [
        { id: 'a', text: 'Buy it right away!', correct: false },
        { id: 'b', text: 'Wait and think about it first', correct: true },
        { id: 'c', text: 'Buy two of them!', correct: false }
      ]
    }
  },
  struggling: {
    moodClass: 'helpful',
    moodEmoji: '🤗',
    headerIcon: '💪',
    headerTitle: "Let's Figure This Out!",
    mainMessage: "I can see things are a bit tricky right now. That's totally normal! Learning about money takes practice.",
    teachingTip: "Here's a simple rule: When you get money, split it into 3 jars - SAVE (for goals), SPEND (for fun), and SHARE (for others). Start with saving the most!",
    encouragement: "You're doing better than you think! Keep going!",
    quiz: {
      question: "You get $10 allowance. What's a good way to split it?",
      options: [
        { id: 'a', text: 'Spend all $10 on candy', correct: false },
        { id: 'b', text: '$6 save, $3 spend, $1 share', correct: true },
        { id: 'c', text: "Don't know, just spend it randomly", correct: false }
      ]
    }
  },
  great_job: {
    moodClass: 'happy',
    moodEmoji: '🥳',
    headerIcon: '🌟',
    headerTitle: "You're Doing Amazing!",
    mainMessage: "WOW! Look at you go! You're making really smart money choices. I'm so proud of you!",
    teachingTip: "Keep doing what you're doing! You're learning that small, smart choices add up to big results over time!",
    encouragement: "You're a money superstar in the making!",
    quiz: null
  }
}

// Computed content based on situation
const content = computed(() => situationContent[props.situation] || situationContent.struggling)

const moodClass = computed(() => content.value.moodClass)
const moodEmoji = computed(() => content.value.moodEmoji)
const headerIcon = computed(() => content.value.headerIcon)
const headerTitle = computed(() => content.value.headerTitle)
const mainMessage = computed(() => content.value.mainMessage)
const teachingTip = computed(() => content.value.teachingTip)
const encouragement = computed(() => content.value.encouragement)
const quizQuestion = computed(() => content.value.quiz)
const showHelpButton = computed(() => props.situation !== 'great_job')

// Fetch AI personalized feedback
const fetchAIFeedback = async () => {
  isLoadingAI.value = true
  
  try {
    // Build context about the player's situation
    const context = {
      balance: gameState.balance,
      goal: gameState.goal,
      week: gameState.week,
      health: gameState.health,
      totalSaved: gameState.totalSaved,
      totalSpent: gameState.totalSpent,
      savingChoices: gameState.savingChoices,
      spendingChoices: gameState.spendingChoices,
      situation: props.situation
    }
    
    // Option 1: Use OpenAI API (you'd need to set up a backend)
    // const response = await fetch('/api/penny-advice', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(context)
    // })
    // const data = await response.json()
    // aiFeedback.value = data.advice
    
    // Option 2: Use pre-written personalized responses based on data
    aiFeedback.value = generatePersonalizedFeedback(context)
    
  } catch (error) {
    console.error('Failed to get AI feedback:', error)
    aiFeedback.value = null
  } finally {
    isLoadingAI.value = false
  }
}

// Generate personalized feedback based on game state
const generatePersonalizedFeedback = (context) => {
  const { balance, goal, totalSaved, totalSpent, savingChoices, spendingChoices, health, week } = context
  
  const savingRatio = savingChoices / (savingChoices + spendingChoices || 1)
  const progressPercent = (balance / goal) * 100
  
  let feedback = ''
  
  // Analyze spending vs saving pattern
  if (spendingChoices > savingChoices * 2) {
    feedback = `I noticed you've spent money ${spendingChoices} times but only saved ${savingChoices} times. Try to flip that around! For every time you spend, try to save twice!`
  } else if (balance < 0) {
    const debtAmount = Math.abs(balance)
    feedback = `You're $${debtAmount} in debt right now. Here's a plan: Skip the next ${Math.ceil(debtAmount / gameState.weeklyIncome)} fun purchases and use that money to get back to $0 first!`
  } else if (health < 30) {
    feedback = `Your happiness is only ${health}! Remember, it's okay to treat yourself sometimes. Maybe spend a little on something fun next week?`
  } else if (progressPercent > 50 && progressPercent < 100) {
    const remaining = goal - balance
    feedback = `Amazing! You're ${Math.round(progressPercent)}% of the way to your goal! Just $${remaining} more to go. You've got this!`
  } else if (totalSpent > totalSaved) {
    feedback = `You've spent $${totalSpent} but only saved $${totalSaved}. Let's try to make saving bigger than spending! Small changes make big differences!`
  } else {
    feedback = `In ${week} weeks, you've saved $${totalSaved}! That's an average of $${Math.round(totalSaved/week)} per week. Keep this up and you'll reach your goal!`
  }
  
  return feedback
}

// Quiz handling
const answerQuiz = (option) => {
  selectedAnswer.value = option.id
  quizAnswered.value = true
  
  // Award skill points for trying
  if (option.correct) {
    gameState.addSkill('planning', 3)
    gameState.correctAnswers++
  } else {
    gameState.addSkill('planning', 1) // Still reward for trying
  }
}

// Handle close
const handleClose = () => {
  emit('close')
  emit('helped')
  
  // Reset state
  quizAnswered.value = false
  selectedAnswer.value = null
  aiFeedback.value = null
}

// Get more help - could open a tips page or more detailed help
const getMoreHelp = () => {
  // For now, generate new AI feedback
  fetchAIFeedback()
}

// Fetch AI feedback when shown
watch(() => props.show, (newVal) => {
  if (newVal) {
    fetchAIFeedback()
    quizAnswered.value = false
    selectedAnswer.value = null
  }
})

onMounted(() => {
  if (props.show) {
    fetchAIFeedback()
  }
})
</script>

<style scoped>
.penny-help-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.penny-help-modal {
  background: white;
  border-radius: 32px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 200px 1fr;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalPop 0.4s ease;
}

@keyframes modalPop {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* Penny Section */
.penny-section {
  background: linear-gradient(180deg, #FFE8D6 0%, #FFDAB9 100%);
  padding: 40px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 32px 0 0 32px;
}

.penny-mood {
  position: relative;
  text-align: center;
}

.penny-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
  animation: pennyBounce 2s ease-in-out infinite;
}

.penny-mood.worried .penny-image {
  animation: pennyWorry 1s ease-in-out infinite;
}

.penny-mood.sad .penny-image {
  animation: pennySad 2s ease-in-out infinite;
}

.penny-mood.happy .penny-image {
  animation: pennyHappy 0.5s ease-in-out infinite;
}

@keyframes pennyBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pennyWorry {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

@keyframes pennySad {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

@keyframes pennyHappy {
  0%, 100% { transform: scale(1) rotate(-3deg); }
  50% { transform: scale(1.1) rotate(3deg); }
}

.mood-indicator {
  font-size: 40px;
  margin-top: 12px;
}

/* Message Section */
.message-section {
  padding: 32px;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.header-icon {
  font-size: 36px;
}

.header-title {
  font-size: 28px;
  font-weight: 800;
  color: #2D3436;
  margin: 0;
  font-family: 'Comic Sans MS', cursive;
}

.message-bubble {
  background: #FFF8F0;
  border-radius: 20px;
  padding: 20px 24px;
  margin-bottom: 20px;
  border-left: 5px solid #FFE66D;
}

.penny-says {
  font-size: 14px;
  color: #FF6B9D;
  font-weight: 700;
  margin: 0 0 8px;
}

.main-message {
  font-size: 16px;
  color: #2D3436;
  line-height: 1.6;
  margin: 0;
}

/* Teaching Tip */
.teaching-tip {
  background: linear-gradient(135deg, #E8FFF8 0%, #D0F5E8 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 2px solid #4ECDC4;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.tip-icon {
  font-size: 24px;
}

.tip-label {
  font-size: 16px;
  font-weight: 800;
  color: #4ECDC4;
}

.tip-content {
  font-size: 15px;
  color: #2D3436;
  line-height: 1.6;
  margin: 0;
}

/* AI Feedback */
.ai-feedback {
  background: linear-gradient(135deg, #F0F0FF 0%, #E8E8FF 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 2px solid #667eea;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.ai-icon {
  font-size: 24px;
}

.ai-label {
  font-size: 16px;
  font-weight: 800;
  color: #667eea;
}

.ai-content {
  font-size: 15px;
  color: #2D3436;
  line-height: 1.6;
  margin: 0;
}

/* Quick Quiz */
.quick-quiz {
  background: #FFF;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 3px solid #FFE66D;
}

.quiz-title {
  font-size: 18px;
  font-weight: 800;
  color: #2D3436;
  margin: 0 0 12px;
  text-align: center;
}

.quiz-question {
  font-size: 16px;
  color: #2D3436;
  text-align: center;
  margin: 0 0 16px;
  font-weight: 600;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quiz-option {
  background: white;
  border: 2px solid #E8E8E8;
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 14px;
  color: #2D3436;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.quiz-option:hover:not(:disabled) {
  border-color: #667eea;
  background: #F8F0FF;
}

.quiz-option.correct {
  border-color: #4ECDC4;
  background: #E8FFF8;
}

.quiz-option.wrong {
  border-color: #FF6B9D;
  background: #FFF0F5;
}

.quiz-option:disabled {
  cursor: default;
}

.quiz-result {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #4ECDC4;
  margin: 16px 0 0;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.btn-got-it {
  flex: 1;
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

.btn-got-it:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(78, 205, 196, 0.4);
}

.btn-need-help {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-need-help:hover {
  background: #F0F0FF;
}

/* Encouragement */
.encouragement {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  border-radius: 50px;
  padding: 14px 24px;
}

.encourage-stars {
  font-size: 20px;
}

.encouragement p {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #2D3436;
}

/* Responsive */
@media (max-width: 700px) {
  .penny-help-modal {
    grid-template-columns: 1fr;
  }
  
  .penny-section {
    border-radius: 32px 32px 0 0;
    padding: 24px;
  }
  
  .penny-image {
    width: 80px;
    height: 80px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>