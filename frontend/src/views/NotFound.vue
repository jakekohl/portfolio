<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="notfound-container">
    <div class="content-wrapper">
      <PrimeCard class="notfound-card" data-test="not-found-page">
        <template #content>
          <div class="notfound-content">
            <div class="error-icon">
              <i class="pi pi-exclamation-triangle"></i>
            </div>
            <h1 class="error-title">404</h1>
            <h2 class="error-subtitle">Page Not Found</h2>
            <p class="error-description">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
            <div class="error-actions">
              <PrimeButton 
                label="Go Home" 
                icon="pi pi-home" 
                size="large"
                @click="goHome"
              />
              <PrimeButton 
                label="Go Back" 
                icon="pi pi-arrow-left" 
                size="large"
                severity="secondary"
                outlined
                @click="goBack"
              />
            </div>
          </div>
        </template>
      </PrimeCard>
    </div>
  </div>
</template>

<style scoped>
.notfound-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent-blue-dark) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8);
}

.content-wrapper {
  width: 100%;
  max-width: 600px;
}

.notfound-card {
  border: none;
  box-shadow: var(--shadow-2xl);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.notfound-content {
  text-align: center;
  padding: var(--spacing-8);
}

.error-icon {
  margin-bottom: var(--spacing-8);
}

.error-icon i {
  font-size: var(--font-size-6xl);
  color: var(--color-warning);
}

.error-title {
  font-size: var(--font-size-6xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-4) 0;
  line-height: var(--line-height-tight);
}

.error-subtitle {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-6) 0;
}

.error-description {
  font-size: var(--font-size-xl);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-10);
}

.error-actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .error-title {
    font-size: var(--font-size-5xl);
  }
  
  .error-subtitle {
    font-size: var(--font-size-2xl);
  }
  
  .error-description {
    font-size: var(--font-size-base);
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .notfound-container {
    padding: var(--spacing-4);
  }
}
</style>
