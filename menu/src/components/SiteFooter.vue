<template>
  <footer class="site-footer">
    <div class="footer-content">
      <p class="copyright">
        Derechos Reservados. Bambú Lomas 2026.
      </p>
      <p class="legal-links">
        Conoce nuestro <a href="#" class="legal-link">AVISO DE PRIVACIDAD</a> y nuestros <a href="#" class="legal-link">TERMINOS Y CONDICIONES</a>.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background-color: #f5f5f5; /* Slightly darker than white */
  padding: 2rem 1rem;
  margin-top: auto;
  border-top: 1px solid #eeeeee;
}

.footer-content {
  max-width: 1200px; /* Match content container */
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.copyright {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
}

.legal-links {
  margin: 0;
  color: #999;
  font-size: 0.75rem; /* Small and discrete */
}

.legal-link {
  color: var(--color-brand);
  text-decoration: underline;
  font-weight: 700;
  transition: opacity 0.2s;
}

.legal-link:hover {
  opacity: 0.8;
}
</style>
