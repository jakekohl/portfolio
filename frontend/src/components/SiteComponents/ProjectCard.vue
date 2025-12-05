<script setup>
import { computed } from 'vue';
import PrimeCard from 'primevue/card';
import PrimeTag from 'primevue/tag';
import PrimeChip from 'primevue/chip';
import CustomButton from '../CustomButton.vue';

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['open-image', 'open-github', 'open-demo']);

const isCompleted = computed(() => props.project.status === 'Completed');
const statusSeverity = computed(() => {
  if (isCompleted.value) return 'success';
  return props.project.status === 'In Development' ? 'info' : 'warning';
});

const handleImageClick = (image) => {
  emit('open-image', image);
};

const handleGithubClick = () => {
  emit('open-github', props.project.github);
};

const handleDemoClick = () => {
  emit('open-demo', props.project.demo);
};
</script>

<template>
  <PrimeCard
    :class="['project-card', { 'completed-project': isCompleted }]"
    :data-test="project.dataTest"
  >
    <template #header>
      <div class="project-header">
        <h3 class="project-title" data-test="project-title">{{ project.title }}</h3>
        <PrimeTag
          :value="project.status"
          :severity="statusSeverity"
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
            @click="handleImageClick(image)"
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
          @click="handleGithubClick"
        />
        <CustomButton
          v-if="project.demo"
          label="Live Demo"
          icon="pi pi-external-link"
          variant="gradient"
          data-test="project-demo-button"
          @click="handleDemoClick"
        />
      </div>
    </template>
  </PrimeCard>
</template>

<style scoped>
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

@media (max-width: 768px) {
  .images-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

