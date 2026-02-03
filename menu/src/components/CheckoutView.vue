<script setup>
import { 
  ArrowLeft, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  User, 
  FileText,
  Clock,
  Banknote,
  Smartphone,
  Globe,
  Landmark
} from 'lucide-vue-next';
import { ref, computed } from 'vue';
import OrderSuccessModal from './OrderSuccessModal.vue';

const props = defineProps({
  cartItems: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['back', 'submit-order']);

const form = ref({
  name: '',
  phonePrefix: '+52',
  phone: '',
  email: '',
  deliveryTime: '',
  deliveryLocation: '',
  customLocation: '',
  paymentMethod: 'efectivo',
  generalNotes: ''
});

const countryCodes = [
  { code: '+52', flag: '🇲🇽', label: 'MX' },
  { code: '+1', flag: '🇺🇸', label: 'USA' },
  { code: '+86', flag: '🇨🇳', label: 'CN' },
  { code: '+34', flag: '🇪🇸', label: 'ES' },
  { code: '+57', flag: '🇨🇴', label: 'CO' },
  { code: '+54', flag: '🇦🇷', label: 'AR' },
  { code: '+81', flag: '🇯🇵', label: 'JP' }
];

// Delivery Locations
const deliveryLocations = [
  'Barra',
  'Ludoteca',
  'Torniquetes Telcel',
  'Royal Canin',
  'Carso Infraestructura',
  'Torniquetes City Market',
  'Otro (Especificar)'
];

// Initial delivery time suggestion (next 20 min block, rounded to 10)
const getMinTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 20); // Minimum 20 mins from now
  // Round to next 10 min
  const minutes = Math.ceil(now.getMinutes() / 10) * 10;
  now.setMinutes(minutes);
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};
const minTime = ref(getMinTime());
// Set default time to min time
form.value.deliveryTime = minTime.value;

// Set default time to min time
form.value.deliveryTime = minTime.value;

const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const orderInfo = ref({});

const handleOrderComplete = () => {
    const orderData = {
        ...form.value,
        ...orderInfo.value
    };
    emit('submit-order', orderData);
};

const submitOrder = async () => {


  // Validate basic fields
  if (!form.value.name || !form.value.phone || !form.value.deliveryLocation || !form.value.deliveryTime) {
    alert('Por favor completa los campos obligatorios');
    return;
  }
  
  if (form.value.phone.length !== 10 || isNaN(form.value.phone)) {
    alert('El número de teléfono debe tener 10 dígitos numéricos');
    return;
  }

  if (form.value.deliveryLocation === 'Otro (Especificar)' && !form.value.customLocation) {
    alert('Por favor especifica el lugar de entrega');
    return;
  }

  isSubmitting.value = true;
  
  // Construct Payload
  const items = props.cartItems.map(item => {
    // Transform options object to array of strings "Option: Choice"
    // Handle cases where option value is object { label, price } or just string
    const variations = Object.entries(item.options || {}).map(([key, value]) => {
         const valStr = (value && typeof value === 'object' && value.label) ? value.label : value;
         return `${key}: ${valStr}`; 
    });
    
    return {
        id: item.id, // matches menu_item_id
        name: item.title,
        quantity: item.quantity,
        price: item.price,
        variations: variations,
        note: item.notes || '' 
    };
  });

  // console.log('Items prepared for checkout:', items);
 
   const payload = {
     customerName: form.value.name,
     customerPhone: `${form.value.phonePrefix} ${form.value.phone}`,
     location: form.value.deliveryLocation === 'Otro (Especificar)' ? form.value.customLocation : form.value.deliveryLocation,
     paymentMethod: form.value.paymentMethod,
     deliveryTime: form.value.deliveryTime,
     items: items,
     generalNote: form.value.generalNotes,
     total: props.total
   };
 
   try {
     let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
     apiUrl = apiUrl.replace(/\/$/, '');
     
     const response = await fetch(`${apiUrl}/api/orders`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
     });

    if (response.ok) {
        const resData = await response.json();
        
        // Populate Success Modal Info
        orderInfo.value = {
            id: resData.id,
            name: form.value.name,
            time: resData.time,
            total: props.total,
            paymentMethod: form.value.paymentMethod
        };
        
        // Show Success
        showSuccessModal.value = true;
    } else {
        const err = await response.json();
        console.error('Order Error:', err);
        alert('Hubo un error al crear la orden. Por favor intenta de nuevo.');
    }
  } catch (e) {
      console.error('Network Error:', e);
      alert('Error de conexión con el servidor.');
  } finally {
      isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="checkout-container">
    <header class="checkout-header">
      <button class="back-btn" @click="$emit('back')">
        <ArrowLeft :size="24" />
      </button>
      <img src="/logo-bambu.png" alt="Bambu" class="checkout-logo" />
    </header>

    <div class="checkout-scroll-area">
    <div class="checkout-content">
      
      <!-- 1. Resumen -->
      <section class="card summary-card">
        <div class="card-header">
          <ShoppingBag class="card-icon" :size="20" />
          <h2>Resumen del Pedido</h2>
        </div>
        <div class="summary-details">
          <p class="summary-count">{{ cartItems.length }} artículos</p>
          <p class="summary-total">Total: <span>${{ total.toFixed(2) }}</span></p>
        </div>
        <!-- Optional: Preview items toggle? Keeping it simple as requested -->
      </section>

      <!-- 2. Contacto -->
      <section class="card">
        <div class="card-header">
          <User class="card-icon" :size="20" />
          <h2>Contacto</h2>
        </div>
        <div class="form-group">
          <label>Nombre *</label>
          <input type="text" v-model="form.name" placeholder="Tu nombre completo" required>
        </div>
        
        <div class="form-group">
          <label>Teléfono *</label>
          <div class="phone-row">
            <div class="country-select-wrapper">
              <select v-model="form.phonePrefix" class="country-select">
                <option v-for="c in countryCodes" :key="c.code" :value="c.code">
                  {{ c.flag }} {{ c.code }}
                </option>
              </select>
            </div>
            <input 
              type="tel" 
              v-model="form.phone" 
              placeholder="10 dígitos" 
              maxlength="10"
              class="phone-input"
              required
            >
          </div>
        </div>

        <div class="form-group">
          <label>Correo</label>
          <input type="email" v-model="form.email" placeholder="ejemplo@correo.com">
        </div>
      </section>

      <!-- 3. Entrega -->
      <section class="card">
        <div class="card-header">
          <MapPin class="card-icon" :size="20" />
          <h2>Entrega</h2>
        </div>
        <div class="form-group">
          <label><Clock :size="16" style="margin-right:6px; display:inline; position:relative; top:2px;" /> Hora deseada *</label>
          <div class="time-input-container">
            <input 
              type="time" 
              v-model="form.deliveryTime" 
              class="elegant-time-input" 
              required
              step="600"
              :min="minTime"
            >
          </div>
        </div>
        
        <div class="form-group">
          <label>Lugar de Entrega *</label>
          <div class="location-pills">
            <button 
              v-for="loc in deliveryLocations" 
              :key="loc"
              type="button"
              class="location-pill"
              :class="{ active: form.deliveryLocation === loc }"
              @click="form.deliveryLocation = loc"
            >
              {{ loc }}
            </button>
          </div>
        </div>
        
        <div v-if="form.deliveryLocation === 'Otro (Especificar)'" class="form-group slide-down">
          <textarea v-model="form.customLocation" rows="2" placeholder="Describe exactamente dónde..."></textarea>
        </div>
      </section>

      <section class="card">
        <div class="card-header">
          <CreditCard class="card-icon" :size="20" />
          <h2>Forma de Pago</h2>
        </div>
        <div class="payment-grid">
          <label class="payment-card" :class="{ active: form.paymentMethod === 'efectivo' }">
            <input type="radio" value="efectivo" v-model="form.paymentMethod">
            <Banknote :size="32" class="payment-icon" />
            <span>Efectivo</span>
          </label>
          
          <label class="payment-card" :class="{ active: form.paymentMethod === 'terminal' }">
            <input type="radio" value="terminal" v-model="form.paymentMethod">
            <CreditCard :size="32" class="payment-icon" />
            <span>Terminal</span>
          </label>
          
          <label class="payment-card" :class="{ active: form.paymentMethod === 'transferencia' }">
            <input type="radio" value="transferencia" v-model="form.paymentMethod">
            <Smartphone :size="32" class="payment-icon" />
            <span>Transferencia</span>
          </label>
        </div>
      </section>

      <!-- 5. Notas Generales -->
      <section class="card">
        <div class="card-header">
          <FileText class="card-icon" :size="20" />
          <h2>Notas del Pedido</h2>
        </div>
        <div class="form-group">
          <textarea 
            v-model="form.generalNotes" 
            rows="3" 
            placeholder="Comentarios generales para el pedido (servilletas extra, etc.)"
          ></textarea>
        </div>
      </section>

      <!-- Legal & Action -->
      <div class="checkout-footer">
        <p class="legal-text">
          Al confirmar tu pedido declaras conocer y aceptar nuestros 
          <a href="#" class="legal-link">TÉRMINOS Y CONDICIONES</a> y nuestro 
          <a href="#" class="legal-link">AVISO DE PRIVACIDAD</a>.
        </p>

        <button class="confirm-btn" @click="submitOrder" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Confirmar Pedido - ${{ total.toFixed(2) }}</span>
          <span v-else>Procesando...</span>
        </button>
      </div>

    </div>
    </div>


    
    <OrderSuccessModal 
      :show="showSuccessModal" 
      :order-info="orderInfo"
      @close="handleOrderComplete"
    />

  </div>
</template>

<style scoped>
.checkout-container {
  height: 100vh;
  height: 100dvh;
  background-color: #f3f4f6;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100vw; /* Prevent horizontal scroll */
  z-index: 2000;
  display: flex;
  flex-direction: column;
  overflow-x: hidden; /* Prevent horizontal movement */
  overscroll-behavior: none; /* Prevent elastic bounce globally */
}

.checkout-header {
  background-color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  z-index: 20;
}

.checkout-logo {
  height: 24px;
  max-width: 150px;
  object-fit: contain;
}

.checkout-scroll-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 2rem;
  width: 100%;
  overflow-x: hidden;
  overscroll-behavior-x: none;
  touch-action: pan-y; /* Allow only vertical scroll gestures */
}

.back-btn {
  position: absolute;
  left: 1rem;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #4b5563;
  display: flex;
}

.checkout-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: var(--color-brand);
}

.card-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

.summary-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
}

.summary-total span {
  font-weight: 800;
  color: var(--color-brand);
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #374151;
}

input, select, textarea {
  width: 100%;
  padding: 0 20px;
  border: 1px solid #e5e7eb;
  border-radius: 50px;
  font-family: inherit;
  font-size: 1rem;
  background-color: #fff;
  color: #1a1a1a;
  box-sizing: border-box;
}

input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #1a1a1a !important;
}

input, select {
  height: 54px;
  display: flex;
  align-items: center;
}

textarea {
  padding: 15px 20px;
  height: auto;
  border-radius: 20px;
}

select {
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--color-brand);
  ring: 2px solid var(--color-brand/20);
}

textarea {
  resize: vertical;
}

.phone-row {
  display: flex;
  gap: 12px;
}

.country-select-wrapper {
  width: 110px;
  flex-shrink: 0;
}

.country-select {
  padding-right: 8px;
}

.time-input-container {
  position: relative;
}

.elegant-time-input {
  font-size: 1.2rem;
  text-align: center;
  font-weight: 700;
  color: var(--color-brand);
  cursor: pointer;
  letter-spacing: 1px;
  width: 100%;
  max-width: 100%;
  display: block;
  box-sizing: border-box;
  -webkit-appearance: none;
  appearance: none;
  min-width: 0;
  background-color: white;
  height: 54px;
  line-height: 52px;
  padding: 0 20px;
}

/* Location Pills */
.location-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.location-pill {
  border: 1px solid #e5e7eb;
  background-color: white;
  padding: 8px 16px;
  border-radius: 50px;
  color: #4b5563;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  /* Fix button defaults */
  line-height: inherit;
}

.location-pill.active {
  background-color: var(--color-brand);
  color: white;
  border-color: var(--color-brand);
  /* Removed shadow */
}

.location-pill:hover:not(.active) {
  background-color: #f9fafb;
}


/* Payment Grid Squares */
.payment-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 768px) {
  .payment-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.payment-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 1.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: white;
  text-align: center;
}

.payment-card input {
  display: none;
}

.payment-icon {
  color: #9ca3af;
  transition: color 0.2s;
}

.payment-card span {
  font-weight: 600;
  color: #4b5563;
  font-size: 0.9rem;
}

.payment-card.active {
  border-color: var(--color-brand);
  background-color: #f0fdfa; /* Light brand tint */
  box-shadow: 0 0 0 1px var(--color-brand);
}

.payment-card.active .payment-icon {
  color: var(--color-brand);
}

.payment-card.active span {
  color: var(--color-brand);
}

/* Footer Section */
.checkout-footer {
  margin-top: 1rem;
}

.legal-text {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.legal-link {
  color: var(--color-brand);
  text-decoration: underline;
  font-weight: 600;
}

.confirm-btn {
  width: 100%;
  background-color: var(--color-brand);
  color: white;
  border: none;
  padding: 1.25rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  /* Removed shadow */
  transition: transform 0.2s;
}

.confirm-btn:active {
  transform: scale(0.98);
}

.confirm-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}
</style>
