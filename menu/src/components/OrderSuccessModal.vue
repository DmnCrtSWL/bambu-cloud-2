<script setup>
import { Activity, X } from 'lucide-vue-next';
import AppButton from './AppButton.vue';
import { ref } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  orderInfo: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);
const isCopied = ref(false);

const copyToClipboard = async (text) => {
  try {
    // Try modern API first
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
    } else {
        // Fallback for mobile/non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed"; // Avoid scrolling to bottom
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback verify failed', err);
        }
        document.body.removeChild(textArea);
    }

    // Success Feedback
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);

  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

const handleWhatsApp = () => {
    // 1. Open WA
    const message = `Hola, envío mi comprobante de pago del pedido #${props.orderInfo.id}`;
    window.open(`https://wa.me/525513973872?text=${encodeURIComponent(message)}`, '_blank');
    
    // 2. Close Modal (redirect)
    emit('close');
};

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div v-if="show" class="success-modal-overlay" @click.self="handleClose">
    <div class="success-modal">
      <button class="close-btn" @click="handleClose">
        <X :size="24" />
      </button>
      
      <h2>¡Gracias por tu pedido!</h2>
      
      <!-- Order Summary -->
      <div class="order-summary-box">
        <div class="order-row">
          <span>Orden:</span>
          <strong>#{{ orderInfo.id }}</strong>
        </div>
        <div class="order-row">
          <span>Cliente:</span>
          <strong>{{ orderInfo.name }}</strong>
        </div>
        <div class="order-row">
          <span>Hora:</span>
          <strong>{{ orderInfo.time }}</strong>
        </div>
      </div>

      <!-- Logic: Cash / Terminal -->
      <div v-if="orderInfo.paymentMethod === 'efectivo' || orderInfo.paymentMethod === 'terminal'" class="modal-content-section">
        <p class="instruction-text">Tu pedido ha sido confirmado. Estamos preparándolo.</p>
        
        <AppButton variant="primary" :block="true" @click="handleClose">
          Aceptar
        </AppButton>
      </div>

      <!-- Logic: Transfer -->
      <div v-else-if="orderInfo.paymentMethod === 'transferencia'" class="modal-content-section">
        <p class="instruction-text">
          Tu pedido está <strong>pendiente de pago</strong>.<br>
          Por favor realiza la transferencia:
        </p>
        
        <div class="bank-card compact-text">
          <div class="bank-row">
            <span class="bank-label">Banco:</span>
            <span class="bank-value">Inbursa</span>
          </div>
          
          <div class="bank-row">
            <span class="bank-label">A nombre de:</span>
            <span class="bank-value">Erika del Carmen Sánchez Ruíz</span>
          </div>
          
          <!-- Card Number Row -->
          <div class="bank-row has-copy">
            <div class="card-number-group">
              <span class="bank-label">No. de tarjeta:</span>
              <span class="bank-value highlight card-num">4658285602997169</span>
            </div>
            <button 
              class="copy-text-btn" 
              :class="{ 'copied': isCopied }"
              @click="copyToClipboard('4658285602997169')"
            >
              {{ isCopied ? 'Copiado' : 'Copiar' }}
            </button>
          </div>
        </div>

        <p class="instruction-subtext">Al terminar, envía tu comprobante:</p>
        
        <AppButton variant="whatsapp" :block="true" @click="handleWhatsApp">
          <template #icon>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </template>
          Enviar Comprobante
        </AppButton>
      </div>

    </div>
  </div>
</template>

<style scoped>
.success-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.success-modal {
  background: white;
  width: 100%;
  max-width: 400px;
  border-radius: 24px;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af; /* Gray-400 */
  padding: 4px;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  color: #4b5563; /* Gray-600 */
  background-color: #f3f4f6;
}

.success-icon-wrapper {
  margin: 0 auto;
}

.success-modal h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.order-summary-box {
  background-color: #f3f4f6;
  border-radius: 12px;
  padding: 1rem;
}

.order-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.order-row span { color: #6b7280; }
.order-row strong { color: #1a1a1a; }

.instruction-text {
  font-size: 1rem;
  color: #374151;
  line-height: 1.5;
  margin: 0 0 20px 0; /* Space below text (before button) */
}

.instruction-subtext {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #6b7280;
}

/* Bank Details */
.bank-card {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.75rem; /* Reduced padding */
  margin-top: 1rem;
  text-align: left;
}

.compact-text .bank-label,
.compact-text .bank-value {
  font-size: 12px;
}

.compact-text .highlight {
  font-size: 13px;
}

.bank-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
}

.bank-row:last-child {
  margin-bottom: 0;
}

.bank-row.has-copy {
  flex-direction: row;
  align-items: center; /* Center align items vertically */
  justify-content: space-between;
}

.card-number-group {
    display: flex;
    flex-direction: column;
}

.bank-label {
  font-size: 10px;
  color: #6b7280;
  margin-bottom: 2px;
}

.bank-value {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 10px;
  word-break: break-all;
}

/* Card Number on new line style */
.card-num {
    display: block;
    margin-top: 1px;
}

.highlight {
  color: var(--color-brand);
  font-family: monospace;
}

.copy-text-btn {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-brand);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  margin-left: 10px;
  transition: background 0.2s;
}

.copy-text-btn:active {
  background-color: #e5e7eb;
  transform: translateY(1px);
}

.copy-text-btn.copied {
  background-color: #fcd34d; /* Amber/Yellow for success */
  color: #78350f; /* Dark amber text */
  border-color: #fbbf24;
}
</style>
