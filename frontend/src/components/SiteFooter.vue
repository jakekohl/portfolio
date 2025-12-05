<template>
  <footer class="site-footer">
    <div class="footer-content">
      <p class="footer-text" data-test="footer-text">
        <i class="pi pi-code footer-icon"/>
        This site is continuously being improved and updated. New features and enhancements are regularly being worked on.
      </p>
      <p class="footer-copyright" data-test="footer-copyright">
        &copy; {{ currentYear }} Jake Kohl. Built with Vue.js and PrimeVue.
      </p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.site-footer {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--color-border-light);
  margin-top: auto;
  padding: var(--spacing-6) 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
  text-align: center;
}

.footer-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-2) 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  line-height: var(--line-height-relaxed);
}

.footer-icon {
  color: var(--color-primary);
  font-size: var(--font-size-base);
}

.footer-copyright {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin: 0;
  line-height: var(--line-height-normal);
}

@media (max-width: 768px) {
  .footer-content {
    padding: 0 var(--spacing-3);
  }

  .footer-text {
    font-size: var(--font-size-xs);
    flex-direction: column;
    gap: var(--spacing-1);
  }
}
</style>

