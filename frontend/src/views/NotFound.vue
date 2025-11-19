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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.content-wrapper {
  width: 100%;
  max-width: 600px;
}

.notfound-card {
  border: none;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.notfound-content {
  text-align: center;
  padding: 2rem;
}

.error-icon {
  margin-bottom: 2rem;
}

.error-icon i {
  font-size: 5rem;
  color: #f59e0b;
}

.error-title {
  font-size: 6rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
  line-height: 1;
}

.error-subtitle {
  font-size: 2.5rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1.5rem 0;
}

.error-description {
  font-size: 1.25rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .error-title {
    font-size: 4rem;
  }
  
  .error-subtitle {
    font-size: 2rem;
  }
  
  .error-description {
    font-size: 1rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .notfound-container {
    padding: 1rem;
  }
}
</style>