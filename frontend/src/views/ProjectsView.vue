<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import ProjectCard from '../components/SiteComponents/ProjectCard.vue';
import DropDown from '../components/FormComponents/DropDown.vue';

const loading = ref(true);
const projects = ref([]);
const entities = ref([]);
const toast = useToast();

// Separate filter variables for completed and ongoing projects (null = "All")
const completedEntityFilter = ref(null);
const ongoingEntityFilter = ref(null);

const fetchEntities = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/projects/entities`,
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
    entities.value = data.entities || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Failed to fetch entities', detail: error.message, life: 3000 });
    entities.value = [];
  }
};

const fetchProjects = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/projects`,
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
    projects.value = data;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Failed to fetch projects', detail: error.message, life: 3000 });
    projects.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchEntities();
  await fetchProjects();
});

// Filter projects by status and entity separately
const ongoingProjects = computed(() => {
  let filtered = projects.value.filter(project => project.status === 'In Development') || [];
  if (ongoingEntityFilter.value) {
    filtered = filtered.filter(project => project.entity === ongoingEntityFilter.value);
  }
  return filtered;
});

const completedProjects = computed(() => {
  let filtered = projects.value.filter(project => project.status === 'Completed') || [];
  if (completedEntityFilter.value) {
    filtered = filtered.filter(project => project.entity === completedEntityFilter.value);
  }
  return filtered;
});

// Dropdown options for both filters (with "All" as default)
const entityOptions = computed(() => {
  const options = [{ label: 'All', value: null }];
  entities.value
    .filter(entity => entity) // Filter out null/undefined entities
    .sort()
    .forEach(entity => {
      options.push({ label: entity, value: entity });
    });
  return options;
});

// Methods for handling external navigation
const openExternalLink = (url) => {
  if (url) {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Failed to open external link', detail: error.message, life: 3000 });
      // Fallback: try to navigate in the same window
      window.location.href = url;
    }
  }
};

const handleImageClick = (image) => {
  openImageDialog(image);
};

const handleGithubClick = (githubUrl) => {
  openExternalLink(githubUrl);
};

const handleDemoClick = (demoUrl) => {
  openExternalLink(demoUrl);
};

const handleUrlClick = (url) => {
  openExternalLink(url);
};

// Image gallery dialog state
const selectedImage = ref(null);
const dialogVisible = ref(false);

const openImageDialog = (image) => {
  selectedImage.value = image;
  dialogVisible.value = true;
};

const closeImageDialog = () => {
  dialogVisible.value = false;
  selectedImage.value = null;
};
</script>

<template>
  <div v-if="loading">
    <PrimeProgressSpinner style="width: 50px; height: 50px;" />
  </div>
  <div v-else class="projects-container">
    <div class="content-wrapper">
      <div class="projects-header">
        <h1 class="projects-title">
          <i class="pi pi-briefcase mr-3"></i>
          My Projects
        </h1>
        <p class="projects-subtitle">
          A showcase of my development work and technical expertise
        </p>
      </div>

      <!-- Completed Projects Section -->
      <div v-if="completedProjects.length > 0" class="projects-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-check-circle mr-2"></i>
            Completed Projects
          </h2>
          <p class="section-subtitle">Finished projects and accomplishments</p>
          <div v-if="entityOptions.length > 1" class="filter-container">
            <label for="completed-entity-filter" class="filter-label">Filter by Team:</label>
            <DropDown
              id="completed-entity-filter"
              v-model="completedEntityFilter"
              :options="entityOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All"
              class="entity-filter-dropdown"
              data-test="completed-entity-filter"
            />
          </div>
        </div>

        <div v-if="completedProjects.length > 0" class="projects-grid" data-test="completed-projects">
          <ProjectCard
            v-for="project in completedProjects"
            :key="project.title"
            :project="project"
            @open-image="handleImageClick"
            @open-github="handleGithubClick"
            @open-demo="handleDemoClick"
            @open-url="handleUrlClick"
          />
        </div>
      </div>

      <!-- Ongoing Projects Section -->
      <div class="projects-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-clock mr-2"></i>
            Ongoing Projects
          </h2>
          <p class="section-subtitle">Projects currently in development</p>
          <div v-if="entityOptions.length > 1" class="filter-container">
            <label for="ongoing-entity-filter" class="filter-label">Filter by Team:</label>
            <DropDown
              id="ongoing-entity-filter"
              v-model="ongoingEntityFilter"
              :options="entityOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All"
              class="entity-filter-dropdown"
              data-test="ongoing-entity-filter"
            />
          </div>
        </div>

        <div v-if="ongoingProjects.length > 0" class="projects-grid" data-test="ongoing-projects">
          <ProjectCard
            v-for="project in ongoingProjects"
            :key="project.title"
            :project="project"
            @open-image="handleImageClick"
            @open-github="handleGithubClick"
            @open-demo="handleDemoClick"
            @open-url="handleUrlClick"
          />
        </div>
        <div v-else class="coming-soon">
          <PrimeCard class="coming-soon-card">
            <template #content>
              <div class="text-center">
                <h3>No Ongoing Projects with the selected team</h3>
                <p>There are no ongoing projects with the selected team. Try selecting a different team or clearing the filter.</p>
              </div>
            </template>
          </PrimeCard>
        </div>
      </div>

      <!-- Coming Soon Section -->
      
    </div>

    <!-- Image Preview Dialog -->
    <PrimeDialog
      v-model:visible="dialogVisible"
      :modal="true"
      :closable="true"
      :draggable="false"
      :style="{ width: '90vw', maxWidth: '1200px' }"
      class="image-dialog"
      @hide="closeImageDialog"
    >
      <template #header>
        <h3 class="dialog-title">Image Preview</h3>
      </template>
      <div v-if="selectedImage" class="dialog-content">
        <img
          :src="selectedImage.src"
          :alt="selectedImage.alt"
          class="dialog-image"
        />
        <p v-if="selectedImage.caption" class="dialog-caption">{{ selectedImage.caption }}</p>
      </div>
    </PrimeDialog>
  </div>
</template>

<style scoped>
.projects-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent-blue-dark) 50%, var(--color-accent-blue-darker) 100%);
  padding: var(--spacing-8) 0;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.projects-header {
  text-align: center;
  margin-bottom: var(--spacing-12);
  color: var(--color-text-white);
}

.projects-title {
  font-size: var(--font-size-6xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-4);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.projects-subtitle {
  font-size: var(--font-size-xl);
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.projects-section {
  margin-bottom: var(--spacing-16);
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-10);
  color: var(--color-text-white);
}

.section-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-2);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.section-subtitle {
  font-size: var(--font-size-base);
  opacity: 0.8;
}

.filter-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  margin-top: var(--spacing-4);
}

.filter-label {
  color: var(--color-text-white);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  opacity: 0.9;
}

.entity-filter-dropdown {
  min-width: 200px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-8);
  margin-bottom: var(--spacing-12);
}

.image-dialog :deep(.p-dialog),
.image-dialog :deep(.p-dialog-root),
.image-dialog :deep([data-pc-name="dialog"]) {
  background: var(--color-background-primary);
  border-radius: var(--border-radius-3xl) !important;
  overflow: hidden !important;
}

.image-dialog :deep(.p-dialog-header),
.image-dialog :deep(.p-dialog .p-dialog-header),
.image-dialog :deep([data-pc-name="dialog"] .p-dialog-header),
.image-dialog :deep([data-pc-name="dialog"] [data-pc-section="header"]),
.image-dialog :deep(.p-dialog-root .p-dialog-header) {
  background: #f97316 !important;
  background-color: #f97316 !important;
  background-image: none !important;
  color: white !important;
  border-radius: var(--border-radius-3xl) var(--border-radius-3xl) 0 0 !important;
  border-top-left-radius: var(--border-radius-3xl) !important;
  border-top-right-radius: var(--border-radius-3xl) !important;
  padding: var(--spacing-4) var(--spacing-6);
  opacity: 1 !important;
  overflow: hidden !important;
}

.image-dialog :deep(.p-dialog-header-content),
.image-dialog :deep([data-pc-section="header"]),
.image-dialog :deep([data-pc-section="headertitle"]) {
  background: #f97316 !important;
  background-color: #f97316 !important;
  background-image: none !important;
  opacity: 1 !important;
  border-radius: inherit !important;
}

.image-dialog :deep(.p-dialog-header h3),
.image-dialog :deep(.p-dialog-header .dialog-title) {
  background: transparent !important;
  background-color: transparent !important;
}

.image-dialog :deep(.p-dialog-header-icon),
.image-dialog :deep([data-pc-section="closeicon"]),
.image-dialog :deep(.p-dialog-header-icon *) {
  background: transparent !important;
  background-color: transparent !important;
  color: var(--color-text-white) !important;
}

.image-dialog :deep(.p-dialog-content) {
  background: var(--color-background-primary);
  padding: 0;
}

.dialog-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-white);
  background: transparent;
}

.dialog-content {
  text-align: center;
  padding: var(--spacing-6);
  background: var(--color-background-primary);
  border-radius: 0 0 var(--border-radius-3xl) var(--border-radius-3xl);
}

.dialog-image {
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  margin-bottom: var(--spacing-4);
  background: var(--color-background-secondary);
  padding: var(--spacing-4);
  border: 1px solid var(--color-border-light);
}

.dialog-caption {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  font-style: italic;
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-relaxed);
  padding: 0 var(--spacing-4);
}


.coming-soon {
  text-align: center;
}

.coming-soon-card {
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

@media (max-width: 768px) {
  .projects-title {
    font-size: var(--font-size-4xl);
  }

  .section-title {
    font-size: var(--font-size-3xl);
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }

  .dialog-image {
    max-height: 60vh;
  }
}
</style>

