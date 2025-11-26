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

<style scoped lang="scss">
@import '../styles/design-tokens';

.site-footer {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid $border-light;
  margin-top: auto;
  padding: $spacing-6 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-4;
  text-align: center;
}

.footer-text {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin: 0 0 $spacing-2 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-2;
  line-height: $line-height-relaxed;
}

.footer-icon {
  color: $primary;
  font-size: $font-size-base;
}

.footer-copyright {
  font-size: $font-size-xs;
  color: $text-tertiary;
  margin: 0;
  line-height: $line-height-normal;
}

@media (max-width: $breakpoint-md) {
  .footer-content {
    padding: 0 $spacing-3;
  }

  .footer-text {
    font-size: $font-size-xs;
    flex-direction: column;
    gap: $spacing-1;
  }
}
</style>

