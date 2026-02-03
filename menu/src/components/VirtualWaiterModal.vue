<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import { Send, Mic, X, MessageSquare } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

const messages = ref([
  { id: 1, text: '¡Hola! Bienvenido a Bambú Lomas. 🌿 Soy tu mesero virtual. Puedo tomar tu orden, recomendarte platillos o responder tus dudas sobre el menú. ¿Qué te gustaría pedir hoy?', isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
]);

const inputValue = ref('');
const messagesContainer = ref(null);
const isRecording = ref(false);
const isLoading = ref(false);

// Generate or retrieve session ID for conversation context
const sessionId = ref(localStorage.getItem('bambu_chat_session_id'));
if (!sessionId.value) {
  sessionId.value = crypto.randomUUID();
  localStorage.setItem('bambu_chat_session_id', sessionId.value);
}

// Configuration
// TODO: Replace with your actual n8n webhook URL or use .env variable
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://bambu-cloud.app.n8n.cloud/webhook-test/crear-orden';

const sendMessage = async () => {
  if (!inputValue.value.trim() || isLoading.value) return;
  
  const userText = inputValue.value;
  
  // Add user message
  messages.value.push({
    id: Date.now(),
    text: userText,
    isUser: true,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  
  inputValue.value = '';
  isLoading.value = true;
  scrollToBottom();

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: sessionId.value,
        message: userText,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error('Error connecting to waiter');

    const data = await response.json();
    
    // Assumes n8n returns object with { output: "Bot response text" } or { text: "..." }
    const botText = data.output || data.text || data.message || "Lo siento, tuve un problema procesando tu orden.";

    messages.value.push({
      id: Date.now() + 1,
      text: botText,
      isUser: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

  } catch (error) {
    console.error('Chat Error:', error);
    messages.value.push({
      id: Date.now() + 1,
      text: "Lo siento, no pude conectar con el servidor en este momento. Por favor intenta de nuevo o llama a un mesero humano.",
      isUser: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const toggleRecording = () => {
  isRecording.value = !isRecording.value;
  // TODO: Implement actual recording logic
};

// watch(() => props.isOpen, (newVal) => {
//   if (newVal) {
//     scrollToBottom();
//   }
// });
</script>

<template>
  <Transition name="slide-up">
    <div v-if="isOpen" class="chat-window">
      <!-- Header -->
      <div class="chat-header">
        <div class="header-info">
          <div class="avatar">
            <MessageSquare :size="20" color="white" />
          </div>
          <div>
            <h3 class="chat-title">Mesero Virtual</h3>
            <span class="status-indicator">En línea</span>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <X :size="20" />
        </button>
      </div>

      <!-- Messages Area -->
      <div class="messages-area" ref="messagesContainer">
        <div 
          v-for="msg in messages" 
          :key="msg.id" 
          class="message-bubble"
          :class="{ 'user-message': msg.isUser, 'bot-message': !msg.isUser }"
        >
          <div class="bubble-content">
            <p>{{ msg.text }}</p>
            <span class="message-time">{{ msg.time }}</span>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="message-bubble bot-message">
          <div class="bubble-content typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <input 
          v-model="inputValue" 
          type="text" 
          placeholder="Escribe tu pedido..."
          @keyup.enter="sendMessage"
          class="chat-input"
        />
        
        <div class="action-buttons">
          <button 
            class="action-btn mic-btn" 
            :class="{ 'recording': isRecording }"
            @click="toggleRecording"
            aria-label="Grabar audio"
          >
            <Mic :size="20" :color="isRecording ? '#ef4444' : '#6b7280'" />
          </button>
          
          <button 
            class="action-btn send-btn" 
            @click="sendMessage"
            :disabled="!inputValue.trim()"
            aria-label="Enviar"
          >
            <Send :size="20" color="white" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
  
  <!-- Backyard/Overlay for mobile if needed, though window style is requested. 
       Let's add a backdrop only for mobile to help focus? 
       For now, let's keep it as a floating window. -->
</template>

<style scoped>
.chat-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  max-width: 90vw;
  height: 600px;
  max-height: 80vh;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

/* Header */
.chat-header {
  padding: 1rem;
  background-color: var(--color-brand, #376167);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.status-indicator {
  font-size: 0.75rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-indicator::before {
  content: '';
  display: block;
  width: 6px;
  height: 6px;
  background-color: #4ade80; /* Green */
  border-radius: 50%;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  opacity: 0.8;
  cursor: pointer;
  padding: 4px;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

/* Messages */
.messages-area {
  flex: 1;
  background-color: #f7f9f9;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-bubble {
  display: flex;
  width: 100%;
}

.message-bubble.user-message {
  justify-content: flex-end;
}

.bubble-content {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 12px;
  position: relative;
  font-size: 0.95rem;
  line-height: 1.4;
}

.bot-message .bubble-content {
  background-color: white;
  color: #1a1a1a;
  border-top-left-radius: 2px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.user-message .bubble-content {
  background-color: var(--color-brand, #376167);
  color: white;
  border-top-right-radius: 2px;
}

.message-time {
  display: block;
  font-size: 0.65rem;
  margin-top: 4px;
  opacity: 0.7;
  text-align: right;
}

/* Input Area */
.input-area {
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-input {
  flex: 1;
  padding: 12px;
  border-radius: 24px;
  border: 1px solid #e5e5e5;
  outline: none;
  font-size: 0.95rem;
  transition: border-color 0.2s;
  background-color: #f9fafb;
  color: #1a1a1a;
}

.chat-input:focus {
  border-color: var(--color-brand, #376167);
  background-color: white;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, background-color 0.2s;
}

.action-btn:active {
  transform: scale(0.95);
}

.mic-btn {
  background-color: #f3f4f6;
}

.mic-btn.recording {
  background-color: #fee2e2;
  animation: pulse 1.5s infinite;
}

.send-btn {
  background-color: var(--color-brand, #376167);
  color: white;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .chat-window {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh; /* 100dvh handled by safe areas usually */
    height: 100dvh;
    max-width: none;
    max-height: none;
    border-radius: 0;
    bottom: auto;
    right: auto;
  }
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px !important;
  align-items: center;
  min-height: 40px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background-color: #cbd5e1;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1);
  }
}
</style>
