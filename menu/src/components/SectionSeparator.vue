<template>
  <div class="section-separator">
    <div class="line"></div>
    <div class="icon-circle">
      <img src="/bambu-icon.png" alt="icon" class="separator-icon" />
    </div>
    <div class="line"></div>
  </div>
</template>

<style scoped>
.section-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0;
  width: 100%;
}

.line {
  height: 3px;
  background-color: #e5e7eb;
  flex: 1;
  border-radius: 2px;
}

.icon-circle {
  width: 40px;
  height: 40px;
  background-color: #f7f9f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  border: 1px solid rgba(0,0,0,0.03); /* Subtle definition */
}

.separator-icon {
  width: 20px;
  height: auto;
  object-fit: contain;
  opacity: 0.7;
}
</style>
