<template>
  <div v-if="show" class="gemini-chat-overlay">
    <div class="gemini-chat-modal">
      <!-- Header -->
      <div class="chat-header">
        <div class="chat-header-left">
          <img src="@/assets/images/kids/pig.png" class="penny-chat-avatar" alt="Penny" />
          <div class="chat-info">
            <h3 class="chat-title">Chat with Penny AI</h3>
            <p class="chat-subtitle">Your personal money mentor</p>
          </div>
        </div>
        <button class="chat-close-btn" @click="handleClose">
          <span>✕</span>
        </button>
      </div>

      <!-- Messages Area -->
      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message"
          :class="{ 'user-message': message.sender === 'user', 'penny-message': message.sender === 'penny' }"
        >
          <div class="message-avatar">
            <img
              v-if="message.sender === 'penny'"
              src="@/assets/images/kids/pig.png"
              alt="Penny"
            />
            <div v-else class="user-avatar">👤</div>
          </div>
          <div class="message-content">
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="isTyping" class="message penny-message">
          <div class="message-avatar">
            <img src="@/assets/images/kids/pig.png" alt="Penny" />
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <div class="input-container">
          <input
            v-model="currentMessage"
            @keypress.enter="sendMessage"
            placeholder="Ask Penny anything about money..."
            class="chat-input"
            :disabled="isTyping"
          />
          <button
            @click="sendMessage"
            class="send-btn"
            :disabled="!currentMessage.trim() || isTyping"
          >
            <span>📤</span>
          </button>
        </div>
        <div class="input-hint">
          <span>💡 Try asking: "How can I save more?" or "What should I do with my allowance?"</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { gameState } from '@/stores/gameState'

const props = defineProps({
  show: Boolean,
  initialContext: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const messages = ref([])
const currentMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)

// Initial welcome message
const welcomeMessage = {
  id: Date.now(),
  sender: 'penny',
  text: "Hi there! I'm Penny, your AI money mentor! 💰 I can help you with saving tips, spending advice, goal planning, and answering any money questions. What would you like to know?",
  timestamp: new Date()
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isTyping.value) return

  const userMessage = {
    id: Date.now(),
    sender: 'user',
    text: currentMessage.value.trim(),
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const messageToSend = currentMessage.value.trim()
  currentMessage.value = ''

  await scrollToBottom()

  // Show typing indicator
  isTyping.value = true

  try {
    // Call Gemini API
    const response = await callGeminiAPI(messageToSend)

    const pennyMessage = {
      id: Date.now(),
      sender: 'penny',
      text: response,
      timestamp: new Date()
    }

    messages.value.push(pennyMessage)
  } catch (error) {
    console.error('Gemini API error:', error)

    const errorMessage = {
      id: Date.now(),
      sender: 'penny',
      text: "Oops! I'm having trouble connecting right now. 😅 Try again in a moment, or ask me something else about money!",
      timestamp: new Date()
    }

    messages.value.push(errorMessage)
  } finally {
    isTyping.value = false
    await scrollToBottom()
  }
}

const callGeminiAPI = async (message) => {
  // Build context from current game state
  const context = {
    ageGroup: gameState.ageGroup,
    balance: gameState.balance,
    goal: gameState.goal,
    weeklyIncome: gameState.weeklyIncome,
    week: gameState.week,
    health: gameState.health,
    totalSaved: gameState.totalSaved,
    totalSpent: gameState.totalSpent,
    savingChoices: gameState.savingChoices,
    spendingChoices: gameState.spendingChoices,
    selectedGoal: gameState.selectedGoal?.name,
    selectedCharacter: gameState.selectedCharacter
  }

  const prompt = `You are Penny, a friendly AI money mentor for ${context.ageGroup === 'kids' ? 'kids aged 7-12' : 'teens aged 13-17'}.
Current player context:
- Age group: ${context.ageGroup}
- Current balance: $${context.balance}
- Goal: ${context.selectedGoal || 'Not set'} ($${context.goal})
- Weekly income: $${context.weeklyIncome}
- Current week: ${context.week}
- Happiness level: ${context.health}/100
- Total saved: $${context.totalSaved}
- Total spent: $${context.totalSpent}
- Saving choices: ${context.savingChoices}
- Spending choices: ${context.spendingChoices}

Additional context: ${props.initialContext}

IMPORTANT: Keep responses age-appropriate, fun, and educational. Use simple language, emojis, and be encouraging. Focus on teaching good money habits. Never give financial advice that could be harmful.

User question: ${message}

Respond as Penny would - friendly, helpful, and focused on money education.`

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.')
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text
    } else {
      throw new Error('Unexpected response format from Gemini API')
    }
  } catch (error) {
    console.error('Gemini API call failed:', error)
    throw error
  }
}

const handleClose = () => {
  emit('close')
}

// Initialize chat when shown
watch(() => props.show, async (newVal) => {
  if (newVal) {
    messages.value = [welcomeMessage]
    currentMessage.value = ''
    isTyping.value = false
    await nextTick()
    scrollToBottom()
  }
})

onMounted(async () => {
  if (props.show) {
    messages.value = [welcomeMessage]
    await scrollToBottom()
  }
})
</script>

<style scoped>
.gemini-chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.gemini-chat-modal {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  height: 80vh;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* Header */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #FFE8D6 0%, #FFDAB9 100%);
  border-bottom: 2px solid #FFE66D;
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.penny-chat-avatar {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.chat-info h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #2D3436;
  font-family: 'Comic Sans MS', cursive;
}

.chat-subtitle {
  margin: 0;
  font-size: 12px;
  color: #888;
}

.chat-close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.chat-close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.penny-message {
  align-self: flex-start;
}

.message-avatar {
  flex-shrink: 0;
}

.message-avatar img,
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: contain;
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.message-content {
  background: #FFF8F0;
  border-radius: 16px;
  padding: 12px 16px;
  position: relative;
  color: #2D3436; /* Explicit black text for Penny's messages */
}

.user-message .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ECDC4;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Input Area */
.chat-input-area {
  padding: 20px;
  background: #F8F8F8;
  border-top: 1px solid #E8E8E8;
}

.input-container {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #E8E8E8;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.chat-input:focus {
  border-color: #667eea;
}

.chat-input:disabled {
  background: #F0F0F0;
  cursor: not-allowed;
}

.send-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #CCC;
  cursor: not-allowed;
}

.input-hint {
  font-size: 12px;
  color: #888;
  text-align: center;
}

/* Responsive */
@media (max-width: 600px) {
  .gemini-chat-modal {
    height: 90vh;
    max-height: none;
  }

  .chat-messages {
    padding: 16px;
  }

  .chat-input-area {
    padding: 16px;
  }
}
</style>