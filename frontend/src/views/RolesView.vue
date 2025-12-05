<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import CustomButton from '../components/CustomButton.vue'

const loading = ref(true);
const roles = ref([]);
const toast = useToast();
const fetchRoles = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/roles`,
      {
        method: 'GET',
        headers: {
          'Origin': import.meta.env.VITE_APP_URL,
          'Referrer': import.meta.env.VITE_APP_URL,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    roles.value = data;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Failed to fetch roles', detail: error.message, life: 3000 });
    roles.value = [];
  } finally {
    loading.value = false;
  }
};

// Methods for handling external navigation
const openExternalLink = (url) => {
  if (url) {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Failed to open external link', detail: error.message, life: 3000 });
      window.location.href = url;
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Present';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Failed to format date', detail: error.message, life: 3000 });
    return dateString;
  }
};

const isCurrentRole = (endDate) => {
  if (!endDate || endDate.toLowerCase() === 'present') return true;
  try {
    const end = new Date(endDate);
    return end >= new Date();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Failed to determine if role is current', detail: error.message, life: 3000 });
    return false;
  }
};

onMounted(() => {
  fetchRoles();
});
</script>

<template>
  <div v-if="loading">
    <PrimeProgressSpinner style="width: 50px; height: 50px;" />
  </div>
  <div v-else class="roles-container">
    <div class="content-wrapper">
      <div class="roles-header">
        <h1 class="roles-title">
          <i class="pi pi-briefcase mr-3"></i>
          Professional Experience
        </h1>
        <p class="roles-subtitle">
          A journey through my career and professional growth
        </p>
      </div>

      <!-- Roles Section -->
      <div v-if="roles.length > 0" class="roles-section">
        <div class="roles-grid" data-test="roles-grid">
          <PrimeCard
            v-for="role in roles"
            :key="role.dataTest"
            class="role-card"
            :data-test="role.dataTest"
          >
            <template #header>
              <div class="role-header">
                <div class="role-title-section">
                  <div v-if="role.logo" class="role-logo-container">
                    <img :src="role.logo" :alt="`${role.company} logo`" class="role-logo" data-test="role-logo" />
                  </div>
                  <h3 class="role-title" data-test="role-title">{{ role.title }}</h3>
                  <h4 class="role-company" data-test="role-company">{{ role.company }}</h4>
                </div>
                <PrimeTag
                  :value="isCurrentRole(role.endDate) ? 'Current' : 'Previous'"
                  :severity="isCurrentRole(role.endDate) ? 'success' : 'secondary'"
                  class="role-status"
                  data-test="role-status"
                />
              </div>
            </template>
            <template #content>
              <div class="role-meta" data-test="role-meta">
                <div class="meta-item">
                  <i class="pi pi-map-marker mr-2"></i>
                  <span data-test="role-location">{{ role.location }}</span>
                </div>
                <div class="meta-item">
                  <i class="pi pi-calendar mr-2"></i>
                  <span data-test="role-dates">
                    {{ formatDate(role.startDate) }} - {{ formatDate(role.endDate) }}
                  </span>
                </div>
              </div>

              <div v-if="role.description && role.description.length > 0" class="role-description" data-test="role-description">
                <h4>Responsibilities & Achievements:</h4>
                <ul>
                  <li v-for="(item, index) in role.description" :key="index">
                    <i class="pi pi-check mr-2"></i>
                    {{ item }}
                  </li>
                </ul>
              </div>
            </template>
            <template #footer>
              <div class="role-actions">
                <CustomButton
                  v-if="role.url"
                  label="Company Website"
                  icon="pi pi-external-link"
                  variant="gradient"
                  data-test="role-url-button"
                  @click="openExternalLink(role.url)"
                />
              </div>
            </template>
          </PrimeCard>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <PrimeCard class="empty-state-card">
          <template #content>
            <div class="text-center">
              <i class="pi pi-briefcase text-6xl text-primary mb-4"></i>
              <h3>No Roles Found</h3>
              <p>Professional experience information will appear here.</p>
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.roles-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent-blue-dark) 50%, var(--color-accent-blue-darker) 100%);
  padding: var(--spacing-8) 0;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.roles-header {
  text-align: center;
  margin-bottom: var(--spacing-12);
  color: var(--color-text-white);
}

.roles-title {
  font-size: var(--font-size-6xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-4);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.roles-subtitle {
  font-size: var(--font-size-xl);
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.roles-section {
  margin-bottom: var(--spacing-16);
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-8);
  margin-bottom: var(--spacing-12);
}

.role-card {
  height: fit-content;
  transition: var(--transition-base);
  border: none;
  border-radius: var(--border-radius-3xl);
  box-shadow: var(--shadow-xl);
  background: rgba(255, 255, 255, 0.95);
  overflow: hidden;
}

.role-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-2xl);
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-6) var(--spacing-6) 0 var(--spacing-6);
  margin-bottom: var(--spacing-4);
}

.role-title-section {
  flex: 1;
}

.role-logo-container {
  margin-bottom: var(--spacing-4);
}

.role-logo {
  max-width: 120px;
  max-height: 60px;
  object-fit: contain;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.5);
  padding: var(--spacing-2);
}

.role-title {
  margin: 0 0 var(--spacing-2) 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
}

.role-company {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
}

.role-status {
  margin-left: var(--spacing-4);
  flex-shrink: 0;
}

.role-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-8);
  padding: 0 var(--spacing-6);
}

.meta-item {
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.meta-item i {
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}

.role-description {
  padding: 0 var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

.role-description h4 {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.role-description ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.role-description li {
  display: flex;
  align-items: flex-start;
  margin-bottom: var(--spacing-3);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-relaxed);
}

.role-description i {
  color: var(--color-success);
  margin-top: var(--spacing-1);
  flex-shrink: 0;
}

.role-actions {
  display: flex;
  gap: var(--spacing-4);
  flex-wrap: wrap;
  padding: 0 var(--spacing-6) var(--spacing-6) var(--spacing-6);
}

.empty-state {
  text-align: center;
  margin-top: var(--spacing-16);
}

.empty-state-card {
  max-width: 500px;
  margin: 0 auto;
  border: none;
  border-radius: var(--border-radius-3xl);
  box-shadow: var(--shadow-xl);
  background: rgba(255, 255, 255, 0.95);
}

.text-primary {
  color: var(--color-primary) !important;
}

.text-center {
  text-align: center;
}

.mr-2 {
  margin-right: var(--spacing-2);
}

.mr-3 {
  margin-right: var(--spacing-3);
}

.mb-4 {
  margin-bottom: var(--spacing-4);
}

.text-6xl {
  font-size: var(--font-size-6xl);
}

/* Responsive Design */
@media (max-width: 768px) {
  .roles-title {
    font-size: var(--font-size-4xl);
  }

  .roles-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }

  .role-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .role-status {
    margin-left: 0;
    margin-top: var(--spacing-2);
  }

  .role-actions {
    flex-direction: column;
  }

  .role-description,
  .role-meta {
    padding: 0 var(--spacing-6);
  }
}
</style>

