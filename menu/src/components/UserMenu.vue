<script setup>
import { ref } from 'vue';
import { User, LogOut } from 'lucide-vue-next';

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleLogout = () => {
  // Logic to handle logout will go here
  console.log('Cerrar sesión');
  isDropdownOpen.value = false;
};
</script>

<template>
  <div class="user-menu-container">
    <button class="icon-btn" aria-label="Usuario" @click="toggleDropdown">
      <User :size="24" color="var(--color-brand)" stroke-width="2" />
    </button>
    
    <!-- Dropdown -->
    <div v-if="isDropdownOpen" class="dropdown-menu">
      <button class="dropdown-item" @click="handleLogout">
        <LogOut :size="16" color="var(--color-brand)" class="dropdown-icon"/>
        <span>Cerrar sesión</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.user-menu-container {
  position: relative;
}

.icon-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  cursor: pointer;
}

.icon-btn:hover {
  background-color: rgba(55, 97, 103, 0.1);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  padding: 0.5rem 0;
  z-index: 1000;
  margin-top: 5px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: var(--color-text);
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-icon {
  stroke-width: 2;
}
</style>
