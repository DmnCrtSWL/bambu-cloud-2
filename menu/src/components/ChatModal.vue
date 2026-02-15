<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { X, Send, MessageSquare } from 'lucide-vue-next';

const props = defineProps({
  isOpen: { type: Boolean, default: false }
});

const emit = defineEmits(['close']);

const messages = ref([]);
const inputMessage = ref('');
const isLoading = ref(false);
const messagesContainer = ref(null);
const webhookUrl = 'https://dmncrt.app.n8n.cloud/webhook/tomar-orden';

// Generate unique session ID (persists during page session, new on reload)
const sessionId = ref('');

onMounted(() => {
  // Generate session ID using timestamp + random number for uniqueness
  sessionId.value = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  console.log('Chat session initialized:', sessionId.value);
});

// Scroll to bottom when new messages arrive
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

watch(() => messages.value.length, () => {
  scrollToBottom();
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Add welcome message when chat opens for the first time
    if (messages.value.length === 0) {
      messages.value.push({
        id: Date.now(),
        text: '¡Hola! ¿En qué puedo ayudarte hoy?',
        sender: 'bot',
        timestamp: new Date()
      });
    }
    scrollToBottom();
  }
});

const sendMessage = async () => {
  const text = inputMessage.value.trim();
  if (!text || isLoading.value) return;

  // Add user message to chat
  const userMessage = {
    id: Date.now(),
    text: text,
    sender: 'user',
    timestamp: new Date()
  };
  messages.value.push(userMessage);
  inputMessage.value = '';
  isLoading.value = true;

  try {
    // Send to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: text,
        sessionId: sessionId.value,
        timestamp: new Date().toISOString(),
        source: 'menu-chat'
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        text: data.response || data.message || 'Mensaje recibido. Te responderemos pronto.',
        sender: 'bot',
        timestamp: new Date()
      };
      messages.value.push(botMessage);
    } else {
      throw new Error('Error al enviar mensaje');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Add error message
    const errorMessage = {
      id: Date.now() + 1,
      text: 'Lo siento, hubo un error al enviar tu mensaje. Por favor intenta de nuevo.',
      sender: 'bot',
      timestamp: new Date(),
      isError: true
    };
    messages.value.push(errorMessage);
  } finally {
    isLoading.value = false;
  }
};

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

const handleClose = () => {
  emit('close');
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('es-MX', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
</script>

<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
      <div class="chat-modal">
        <!-- Header -->
        <div class="chat-header">
          <div class="header-title">
            <MessageSquare :size="24" color="var(--color-brand)" stroke-width="2" />
            <h2>Conversación</h2>
          </div>
          <button class="close-btn" @click="handleClose" aria-label="Cerrar">
            <X :size="24" stroke-width="2" />
          </button>
        </div>

        <!-- Messages Area -->
        <div ref="messagesContainer" class="messages-container">
          <div 
            v-for="msg in messages" 
            :key="msg.id" 
            class="message-wrapper"
            :class="msg.sender"
          >
            <div class="message" :class="{ 'error-message': msg.isError }">
              <p class="message-text">{{ msg.text }}</p>
              <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
            </div>
          </div>

          <!-- Loading indicator -->
          <div v-if="isLoading" class="message-wrapper bot">
            <div class="message loading-message">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="input-container">
          <textarea
            v-model="inputMessage"
            class="message-input"
            placeholder="Escribe un mensaje..."
            rows="1"
            @keydown="handleKeydown"
            :disabled="isLoading"
          ></textarea>
          <button 
            class="send-btn" 
            @click="sendMessage"
            :disabled="!inputMessage.trim() || isLoading"
            aria-label="Enviar mensaje"
          >
            <Send :size="20" stroke-width="2" />
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 0;
}

.chat-modal {
  background: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  flex-shrink: 0;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-title h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  color: #6b7280;
}

.close-btn:hover {
  background-color: #f3f4f6;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.message-wrapper.user {
  justify-content: flex-end;
}

.message-wrapper.bot {
  justify-content: flex-start;
}

.message {
  max-width: 75%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  word-wrap: break-word;
}

.message-wrapper.user .message {
  background-color: var(--color-brand);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message-wrapper.bot .message {
  background-color: white;
  color: #1f2937;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 0.25rem;
}

.error-message {
  background-color: #fee2e2 !important;
  border-color: #fca5a5 !important;
  color: #991b1b !important;
}

.message-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
  white-space: pre-wrap;
}

.message-time {
  font-size: 0.7rem;
  opacity: 0.7;
  align-self: flex-end;
}

.loading-message {
  background-color: white;
  border: 1px solid #e5e7eb;
  padding: 1rem;
}

.typing-indicator {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-brand);
  opacity: 0.4;
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
    opacity: 0.4;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-10px);
  }
}

.input-container {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: white;
  flex-shrink: 0;
}

.message-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 1.5rem;
  font-size: 0.95rem;
  resize: none;
  font-family: inherit;
  max-height: 120px;
  transition: border-color 0.2s;
}

.message-input:focus {
  outline: none;
  border-color: var(--color-brand);
}

.message-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.send-btn {
  background-color: var(--color-brand);
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background-color: #2d6b75;
  transform: scale(1.05);
}

.send-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.send-btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

/* Desktop styles */
@media (min-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .chat-modal {
    max-width: 500px;
    max-height: 700px;
    height: 90vh;
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .chat-header {
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
  }
}

/* Modal animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .chat-modal,
.modal-fade-leave-active .chat-modal {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .chat-modal {
  transform: scale(0.9) translateY(20px);
}

.modal-fade-leave-to .chat-modal {
  transform: scale(0.9) translateY(20px);
}
</style>
