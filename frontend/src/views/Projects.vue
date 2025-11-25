<script setup>
import { ref, computed, onMounted } from 'vue';

const loading = ref(true);
const projects = ref([]);

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
    console.error('Failed to fetch projects:', error);
    projects.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProjects();
});

const ongoingProjects = computed(() => projects.value.filter(project => project.status === 'In Development') || []);
const completedProjects = computed(() => projects.value.filter(project => project.status === 'Completed') || []);

const hasOngoingProjects = computed(() => ongoingProjects.value.length > 0);
const hasCompletedProjects = computed(() => completedProjects.value.length > 0);

// Methods for handling external navigation
const openExternalLink = (url) => {
  if (url) {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open external link:', error);
      // Fallback: try to navigate in the same window
      window.location.href = url;
    }
  }
};

const openGithubRepo = (githubUrl) => {
  openExternalLink(githubUrl);
};

const openLiveDemo = (demoUrl) => {
  openExternalLink(demoUrl);
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

      <!-- Ongoing Projects Section -->
      <div v-if="hasOngoingProjects" class="projects-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-clock mr-2"></i>
            Ongoing Projects
          </h2>
          <p class="section-subtitle">Projects currently in development</p>
        </div>

        <div class="projects-grid" data-test="ongoing-projects">
          <PrimeCard
            v-for="project in ongoingProjects"
            :key="project.title"
            class="project-card"
            :data-test="project.dataTest"
          >
            <template #header>
              <div class="project-header">
                <h3 class="project-title" data-test="project-title">{{ project.title }}</h3>
                <PrimeTag
                  :value="project.status"
                  :severity="project.status === 'In Development' ? 'info' : 'warning'"
                  class="project-status"
                  data-test="project-status"
                />
              </div>
            </template>
            <template #content>
              <p class="project-description" data-test="project-description">{{ project.description }}</p>

              <!-- Project Images -->
              <div v-if="project.images && project.images.length > 0" class="project-images" data-test="project-images">
                <h4>Project Screenshots:</h4>
                <div class="images-grid">
                  <div
                    v-for="(image, index) in project.images"
                    :key="index"
                    class="image-thumbnail-container"
                    @click="openImageDialog(image)"
                  >
                    <div class="image-thumbnail-wrapper">
                      <img
                        :src="image.src"
                        :alt="image.alt"
                        class="image-thumbnail"
                        @error="$event.target.style.display='none'"
                      />
                      <div class="image-overlay">
                        <i class="pi pi-search-plus"></i>
                      </div>
                    </div>
                    <p v-if="image.caption" class="image-caption-thumbnail">{{ image.caption }}</p>
                  </div>
                </div>
              </div>

              <div class="project-technologies" data-test="project-technologies">
                <h4>Technologies Used:</h4>
                <div class="tech-chips">
                  <PrimeChip
                    v-for="tech in project.technologies"
                    :key="tech"
                    :label="tech"
                    class="tech-chip"
                  />
                </div>
              </div>

              <div v-if="project.skillsLeveraged" class="project-skills" data-test="project-skills">
                <h4>Skills Leveraged:</h4>
                <div class="skills-chips">
                  <PrimeChip
                    v-for="skill in project.skillsLeveraged"
                    :key="skill"
                    :label="skill"
                    class="skill-chip"
                  />
                </div>
              </div>

              <div v-if="project.features" class="project-features" data-test="project-features">
                <h4>Key Features:</h4>
                <ul>
                  <li v-for="feature in project.features" :key="feature">
                    <i class="pi pi-check mr-2"></i>
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </template>
            <template #footer>
              <div class="project-actions">
                <CustomButton
                  v-if="project.github"
                  label="View Code"
                  icon="pi pi-github"
                  variant="gradient"
                  data-test="project-code-button"
                  @click="openGithubRepo(project.github)"
                />
                <CustomButton
                  v-if="project.demo"
                  label="Live Demo"
                  icon="pi pi-external-link"
                  variant="gradient"
                  data-test="project-demo-button"
                  @click="openLiveDemo(project.demo)"
                />
              </div>
            </template>
          </PrimeCard>
        </div>
      </div>

      <!-- Completed Projects Section -->
      <div v-if="hasCompletedProjects" class="projects-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-check-circle mr-2"></i>
            Completed Projects
          </h2>
          <p class="section-subtitle">Finished projects and accomplishments</p>
        </div>

        <div class="projects-grid" data-test="completed-projects">
          <PrimeCard
            v-for="project in completedProjects"
            :key="project.title"
            class="project-card completed-project"
            :data-test="project.dataTest"
          >
            <template #header>
              <div class="project-header">
                <h3 class="project-title" data-test="project-title">{{ project.title }}</h3>
                <PrimeTag
                  value="Completed"
                  severity="success"
                  class="project-status"
                  data-test="project-status"
                />
              </div>
            </template>
            <template #content>
              <p class="project-description" data-test="project-description">{{ project.description }}</p>

              <!-- Project Images -->
              <div v-if="project.images && project.images.length > 0" class="project-images" data-test="project-images">
                <h4>Project Screenshots:</h4>
                <div class="images-grid">
                  <div
                    v-for="(image, index) in project.images"
                    :key="index"
                    class="image-thumbnail-container"
                    @click="openImageDialog(image)"
                  >
                    <div class="image-thumbnail-wrapper">
                      <img
                        :src="image.src"
                        :alt="image.alt"
                        class="image-thumbnail"
                        @error="$event.target.style.display='none'"
                      />
                      <div class="image-overlay">
                        <i class="pi pi-search-plus"></i>
                      </div>
                    </div>
                    <p v-if="image.caption" class="image-caption-thumbnail">{{ image.caption }}</p>
                  </div>
                </div>
              </div>

              <div class="project-technologies" data-test="project-technologies">
                <h4>Technologies Used:</h4>
                <div class="tech-chips">
                  <PrimeChip
                    v-for="tech in project.technologies"
                    :key="tech"
                    :label="tech"
                    class="tech-chip"
                  />
                </div>
              </div>

              <div v-if="project.skillsLeveraged" class="project-skills" data-test="project-skills">
                <h4>Skills Leveraged:</h4>
                <div class="skills-chips">
                  <PrimeChip
                    v-for="skill in project.skillsLeveraged"
                    :key="skill"
                    :label="skill"
                    class="skill-chip"
                  />
                </div>
              </div>

              <div v-if="project.features" class="project-features" data-test="project-features">
                <h4>Key Features:</h4>
                <ul>
                  <li v-for="feature in project.features" :key="feature">
                    <i class="pi pi-check mr-2"></i>
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </template>
            <template #footer>
              <div class="project-actions">
                <CustomButton
                  v-if="project.github"
                  label="View Code"
                  icon="pi pi-github"
                  variant="gradient"
                  data-test="project-code-button"
                  @click="openGithubRepo(project.github)"
                />
                <CustomButton
                  v-if="project.demo"
                  label="Live Demo"
                  icon="pi pi-external-link"
                  variant="gradient"
                  data-test="project-demo-button"
                  @click="openLiveDemo(project.demo)"
                />
              </div>
            </template>
          </PrimeCard>
        </div>
      </div>

      <!-- Coming Soon Section -->
      <div class="coming-soon">
        <PrimeCard class="coming-soon-card">
          <template #content>
            <div class="text-center">
              <i class="pi pi-clock text-6xl text-primary mb-4"></i>
              <h3>More Projects Coming Soon!</h3>
              <p>I'm constantly working on new projects and will update this portfolio regularly.</p>
            </div>
          </template>
        </PrimeCard>
      </div>
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-8);
  margin-bottom: var(--spacing-12);
}

.project-card {
  height: fit-content;
  transition: var(--transition-base);
  border: none;
  border-radius: var(--border-radius-3xl);
  box-shadow: var(--shadow-xl);
  background: rgba(255, 255, 255, 0.95);
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-2xl);
}

.completed-project {
  border-left: 4px solid var(--color-success);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-8);
  padding: var(--spacing-6) var(--spacing-6) 0 var(--spacing-6);
}

.project-title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
}

.project-status {
  margin-left: var(--spacing-4);
}

.project-description {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-8);
  line-height: var(--line-height-relaxed);
  font-weight: var(--font-weight-medium);
  padding: 0 var(--spacing-6);
}

.project-images {
  margin-bottom: var(--spacing-8);
  padding: 0 var(--spacing-6);
}

.project-images h4 {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-3);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-4);
}

.image-thumbnail-container {
  text-align: center;
  cursor: pointer;
  transition: var(--transition-base);
  display: flex;
  flex-direction: column;
}

.image-thumbnail-container:hover {
  transform: translateY(-4px);
}

.image-thumbnail-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-base);
  background: var(--background-secondary);
  margin-bottom: var(--spacing-2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: var(--transition-base);
  padding: var(--spacing-2);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition-base);
}

.image-thumbnail-container:hover .image-overlay {
  opacity: 1;
}

.image-overlay i {
  color: white;
  font-size: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.image-caption-thumbnail {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-2);
  font-style: italic;
  font-weight: var(--font-weight-medium);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-dialog :deep(.p-dialog-header) {
  background: var(--color-primary);
  color: white;
  border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
}

.dialog-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
}

.dialog-content {
  text-align: center;
  padding: var(--spacing-4);
}

.dialog-image {
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--spacing-4);
}

.dialog-caption {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  font-style: italic;
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-relaxed);
  padding: 0 var(--spacing-4);
}

.project-technologies h4,
.project-skills h4,
.project-features h4 {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-3);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.project-technologies,
.project-skills,
.project-features {
  padding: 0 var(--spacing-6);
}

.tech-chips,
.skills-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-8);
}

.tech-chip {
  background: var(--color-primary-lightest);
  color: var(--color-primary-dark);
  border: 2px solid var(--color-primary);
  font-weight: var(--font-weight-semibold);
  box-shadow: var(--shadow-sm);
}

.tech-chip:hover {
  background: var(--color-primary-lighter);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.skill-chip {
  background: var(--color-success-lightest);
  color: var(--color-success-dark);
  border: 2px solid var(--color-success);
  font-weight: var(--font-weight-semibold);
  box-shadow: var(--shadow-sm);
}

.skill-chip:hover {
  background: var(--color-success-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.project-features ul {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--spacing-8) 0;
}

.project-features li {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-2);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.project-features i {
  color: var(--color-success);
}

.project-actions {
  display: flex;
  gap: var(--spacing-4);
  flex-wrap: wrap;
  padding: 0 var(--spacing-6) var(--spacing-6) var(--spacing-6);
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

  .images-grid {
    grid-template-columns: 1fr;
  }

  .images-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .dialog-image {
    max-height: 60vh;
  }

  .project-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 var(--spacing-6);
  }

  .project-status {
    margin-left: 0;
    margin-top: var(--spacing-2);
  }

  .project-actions {
    flex-direction: column;
    padding: 0 var(--spacing-6);
  }

  .project-description,
  .project-images,
  .project-technologies,
  .project-skills,
  .project-features {
    padding: 0 var(--spacing-6);
  }
}
</style>
