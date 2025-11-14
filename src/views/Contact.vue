<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(true);
const contactInfo = ref([]);
const specialties = ref([]);

const fetchContactInfo = async () => {
  try {
    loading.value = true;
    const response = await fetch('https://portfolio.jakekohl.dev/contact');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const contactResponse = await response.json();
    contactInfo.value = contactResponse.contact;
    specialties.value = contactResponse.specialties;
  } catch (error) {
    console.error('Failed to fetch contact info:', error);
    contactInfo.value = [];
    specialties.value = [];
  } finally {
    loading.value = false;
  }
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

onMounted(() => {
  fetchContactInfo();
});
</script>
<template>
  <div v-if="loading">
    <PrimeProgressSpinner style="width: 50px; height: 50px;" />
  </div>
  <div v-else class="contact-container">
    <div class="content-wrapper">
      <!-- Header Section -->
      <section class="contact-header">
        <div class="header-content">
          <h1 class="page-title">
            <i class="pi pi-envelope mr-3"/>
            Contact Me
          </h1>
          <p class="page-subtitle">
            Ready to work together? Let's discuss your next project.
          </p>
        </div>
        </section>

        <!-- Section Divider -->
        <div class="section-divider">
          <div class="divider-line"></div>
          <div class="divider-icon">
            <i class="pi pi-star-fill"></i>
          </div>
          <div class="divider-line"></div>
        </div>

        <div class="contact-content">
          <!-- Specialties -->
          <section class="specialties-section">
          <h2 class="section-title">What I Can Help You With</h2>
          <div class="specialties-grid">
            <PrimeCard
              v-for="specialty in specialties"
              :key="specialty.title"
              class="specialty-card"
              :data-test="specialty.dataTest"
            >
              <template #content>
                <div class="specialty-content">
                  <div class="specialty-icon">
                    <i :class="specialty.icon" class="text-primary"></i>
                  </div>
                  <h3 class="specialty-title">{{ specialty.title }}</h3>
                  <p class="specialty-description">{{ specialty.description }}</p>
                </div>
              </template>
            </PrimeCard>
          </div>
        </section>

        <!-- Section Divider -->
        <div class="section-divider">
          <div class="divider-line"></div>
          <div class="divider-icon">
            <i class="pi pi-envelope"></i>
          </div>
          <div class="divider-line"></div>
        </div>

        <!-- Contact Methods -->
        <section class="contact-methods">
          <h2 class="section-title">Contact Information</h2>
          <div class="contact-grid">
            <PrimeCard
              v-for="contact in contactInfo"
              :key="contact.type"
              class="contact-card"
              :data-test="contact.dataTest"
            >
              <template #content>
                <div class="contact-card-content">
                  <div class="contact-header">
                    <div class="contact-icon">
                      <i :class="contact.icon" class="text-primary" />
                    </div>
                    <h3 class="contact-type">{{ contact.type }}</h3>
                  </div>
                  <div class="contact-value-wrapper">
                    <a v-if="contact.link" :href="contact.link" target="_blank" class="contact-value" :data-test="`contact-url`">
                      {{ contact.value }}
                    </a>
                    <span v-else class="contact-value">{{ contact.value }}</span>
                    <PrimeButton
                      icon="pi pi-copy"
                      size="small"
                      class="copy-button"
                      :data-test="`contact-copy`"
                      @click="copyToClipboard(contact.value)"
                    />
                  </div>
                  <p class="contact-description">{{ contact.description }}</p>
                </div>
              </template>
            </PrimeCard>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent-blue-dark) 50%, var(--color-accent-blue-darker) 100%);
  padding: var(--spacing-8) 0;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

/* Header Section */
.contact-header {
  text-align: center;
  color: var(--color-text-white);
  margin-bottom: var(--spacing-16);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.page-title {
  font-size: var(--font-size-6xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-4);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.page-subtitle {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-normal);
  margin-bottom: var(--spacing-6);
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.contact-description {
  font-size: var(--font-size-xl);
  line-height: var(--line-height-relaxed);
  color: rgba(255, 255, 255, 0.8);
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

/* Section Dividers */
.section-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--spacing-16) 0;
  padding: 0 var(--spacing-4);
}

.divider-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  max-width: 200px;
}

.divider-icon {
  margin: 0 var(--spacing-6);
  padding: var(--spacing-3);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-full);
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.divider-icon i {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.8);
}

/* Contact Methods */
.section-title {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-white);
  text-align: center;
  margin-bottom: var(--spacing-12);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.contact-methods {
  margin-bottom: var(--spacing-16);
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-8);
}

.contact-card {
  border: none;
  box-shadow: var(--shadow-2xl);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: var(--transition-base);
}

.contact-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-2xl);
}

.contact-card-content {
  padding: var(--spacing-6);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.contact-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-1);
}

.contact-icon {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-full);
  background: var(--color-primary-lightest);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-icon i {
  font-size: var(--font-size-2xl);
}

.contact-type {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.contact-value-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.contact-value {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.contact-description {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--line-height-normal);
}

.contact-actions {
  display: flex;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

/* Copy Button Styling */
.copy-button {
  background: transparent !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  color: var(--color-text-secondary) !important;
  border-radius: var(--border-radius-md) !important;
  transition: var(--transition-base) !important;
  box-shadow: none !important;
}

.copy-button:hover {
  background: rgba(0, 0, 0, 0.05) !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
  color: var(--color-text-primary) !important;
  transform: translateY(-1px) !important;
}

.copy-button:focus {
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1) !important;
}

/* Specialties */
.specialties-section {
  margin-bottom: var(--spacing-8);
}

.specialties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-8);
}

.specialty-card {
  border: none;
  box-shadow: var(--shadow-2xl);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: var(--transition-base);
}

.specialty-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-2xl);
}

.specialty-content {
  text-align: center;
  padding: var(--spacing-6);
}

.specialty-icon {
  width: 70px;
  height: 70px;
  border-radius: var(--border-radius-full);
  background: var(--color-primary-lightest);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-3);
}

.specialty-icon i {
  font-size: var(--font-size-4xl);
}

.specialty-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.specialty-description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  font-size: var(--font-size-base);
}

.text-primary {
  color: var(--color-primary) !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-5xl);
  }

  .section-title {
    font-size: var(--font-size-4xl);
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .specialties-grid {
    grid-template-columns: 1fr;
  }

  .contact-card-content {
    text-align: center;
  }

  .contact-header {
    flex-direction: column;
    text-align: center;
  }

  .contact-value-wrapper {
    justify-content: center;
  }

  .contact-actions {
    justify-content: center;
  }

  .contact-header {
    margin-bottom: var(--spacing-12);
  }

  .contact-methods {
    margin-bottom: var(--spacing-12);
  }

  .section-divider {
    margin: var(--spacing-12) 0;
  }

  .divider-line {
    max-width: 100px;
  }

  .divider-icon {
    margin: 0 var(--spacing-4);
    padding: var(--spacing-2);
  }

  .divider-icon i {
    font-size: var(--font-size-base);
  }
}
</style>
