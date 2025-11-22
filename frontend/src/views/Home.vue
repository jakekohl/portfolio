<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();

const me = ref(null);

const testSkills = ref([
  { name: 'API'},
  { name: 'End-to-End'},
  { name: 'Integration'},
  { name: 'Performance'},
  { name: 'Cypress'},
  { name: 'Playwright'},
]);

const supportSkills = ref([
  { name: 'Technical Support'},
  { name: 'Troubleshooting'},
  { name: 'Log Analysis'},
  { name: 'Infrastructure Management'},
  { name: 'Database Management'},
  { name: 'Technical Documentation'},
  { name: 'Incident Management'},
  { name: 'Escalation Management'},
]);

const devSkills = ref([
  { name: 'Backend Development'},
  { name: 'Debugging'},
  { name: 'Requirements Review'},
  { name: 'CI/CD'},
  { name: 'Code Review'},
  { name: 'ETL'},
  { name: 'Vue.js'},
  { name: 'Express.js'},
  { name: 'JavaScript'},
  { name: 'TypeScript'},
  { name: 'Java'},
  { name: 'Python'},
  { name: 'Git'},
  { name: 'GitHub'},
]);

const infrastructureSkills = ref([
  { name: 'AWS'},
  { name: 'ECS'},
  { name: 'EC2'},
  { name: 'Lambda'},
  { name: 'S3'},
  { name: 'RDS'},
  { name: 'Cloudwatch'},
  { name: 'Wildfly/Jboss'},
  { name: 'RabbitMQ'},
  { name: 'SQL Server'},
  { name: 'MongoDB'},
  { name: 'PostgreSQL'},
  { name: 'SSAS'},
  { name: 'SSRS'},
  { name: 'Windows Server'}
]);

const softSkills = ref([
  { name: 'Communication'},
  { name: 'Collaboration'},
  { name: 'Problem Solving'},
  { name: 'Time Management'},
  { name: 'Adaptability'},
  { name: 'Leadership'},
  { name: 'Training'},
  { name: 'Project Management'},
  { name: 'Training'},
  { name: 'Team Management'},
]);

const navigateToSection = (route) => {
  router.push(route);
};

async function downloadResume() {
  const fileName = 'Resume_kohlJacob.pdf';
  const resumeUrl = '/Resume_kohlJacob.pdf';

  const a = document.createElement('a');
  a.href = resumeUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function getMe() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/me`);
    const data = await response.json();
    me.value = data;
  } catch (error) {
    console.error('Error fetching me:', error);
  }
}

onMounted(() => {
  getMe();
});
</script>

<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section" data-test="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Hi, I'm
            <span class="name-highlight">{{ me?.name || 'Jake Kohl' }}</span>
          </h1>
          <h2 class="hero-subtitle">
            {{ me?.title || 'Quality Assurance Engineer | Test Automation Enthusiast' }}
          </h2>
          <p class="hero-description">
            Passionate about creating comprehensive testing solutions within <b>Cypress</b> and <b>Playwright</b>.
            With an automation first approach to testing and significant experience in <b>technical support</b>, I strive to create scalable testing strategies that does not compromise on speed or quality.
          </p>
          <div class="hero-actions">
            <CustomButton
              label="View My Work"
              icon="pi pi-briefcase"
              size="large"
              variant="gradient"
              data-test="hero-projects-button"
              @click="navigateToSection('/projects')"
            />
            <CustomButton
              label="Download Resume"
              icon="pi pi-download"
              severity="secondary"
              size="large"
              variant="outline"
              data-test="hero-resume-button"
              @click="downloadResume"
            />
          </div>
        </div>
        <div class="hero-image">
          <PrimeAvatar
            :image="me?.avatarUrl || 'https://avatars.githubusercontent.com/u/9215669?v=4'"
            size="xlarge"
            shape="circle"
            class="profile-avatar"
            data-test="profile-avatar"
          />
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section" data-test="stats-section">
      <h1 class="section-title">Professional Experience (Years)</h1>
      <div class="content-wrapper">
        <div class="stats-grid">
          <div
            v-for="exp in me?.experiences"
            :key="exp.type.toLowerCase().replace(/\s+/g, '-')"
            class="stat-card"
            :data-test="`stat-${exp.name.toLowerCase().replace(/\s+/g, '-')}`"
          >
            <PrimeCard class="stat-card-inner">
              <template #content>
                <div class="stat-content">
                  <i :class="exp?.icon || 'pi pi-briefcase'" class="stat-icon"></i>
                  <div class="stat-value">{{ exp?.years || '0' }}</div>
                  <div class="stat-label">{{ exp?.name || 'Experience' }}</div>
                </div>
              </template>
            </PrimeCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Preview Section -->
    <section class="skills-preview-section" data-test="skills-section">
      <div class="content-wrapper">
        <h3 class="section-title">Technical Expertise</h3>
        <h4 class="skill-category">Development</h4>
        <div class="skills-grid" data-test="skill-domain-development">
          <div
            v-for="skill in devSkills"
            :key="skill.name"
            class="skill-item"
          >
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }}</span>
            </div>
          </div>
        </div>
        <h4 class="skill-category">Testing</h4>
        <div class="skills-grid" data-test="skill-domain-testing">
          <div
            v-for="skill in testSkills"
            :key="skill.name"
            class="skill-item"
          >
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }}</span>
            </div>
          </div>
        </div>
        <h4 class="skill-category">Infrastructure</h4>
        <div class="skills-grid" data-test="skill-domain-infrastructure">
          <div
            v-for="skill in infrastructureSkills"
            :key="skill.name"
            class="skill-item"
          >
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }}</span>
            </div>
          </div>
        </div>
        <h4 class="skill-category">Support</h4>
        <div class="skills-grid" data-test="skill-domain-support">
          <div
            v-for="skill in supportSkills"
            :key="skill.name"
            class="skill-item"
          >
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }}</span>
            </div>
          </div>
        </div>
        <h4 class="skill-category">Soft Skills</h4>
        <div class="skills-grid" data-test="skill-domain-soft-skills">
          <div
            v-for="skill in softSkills"
            :key="skill.name"
            class="skill-item"
          >
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" data-test="cta-section">
      <div class="content-wrapper">
        <PrimeCard class="cta-card">
          <template #content>
            <div class="cta-content">
              <h3>Ready to Work Together?</h3>
              <p>I'm always interested in new opportunities and exciting projects. Let's connect!</p>
              <CustomButton
                label="Get in Touch"
                icon="pi pi-envelope"
                size="large"
                variant="gradient"
                data-test="contact-cta-button"
                @click="navigateToSection('/contact')"
              />
            </div>
          </template>
        </PrimeCard>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  min-height: 70vh;
  display: flex;
  align-items: center;
  padding: var(--spacing-12) var(--spacing-4);
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent-blue-dark) 50%, var(--color-accent-blue-darker) 100%);
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-16);
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text {
  color: var(--color-text-white);
}

.hero-title {
  font-size: var(--font-size-6xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-4);
  line-height: var(--line-height-tight);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.name-highlight {
  background: var(--color-accent-orange, #fd9744);
  -webkit-text-stroke: 0.5px rgb(41, 40, 40);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-normal);
  margin-bottom: var(--spacing-6);
  color: rgba(255, 255, 255, 0.9);
}

.hero-description {
  font-size: var(--font-size-xl);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-8);
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-avatar {
  width: 250px !important;
  height: 250px !important;
  background: linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent-blue-dark) 100%) !important;
  color: var(--color-text-white) !important;
  font-size: 6rem !important;
  box-shadow: var(--shadow-2xl);
}

/* Stats Section */
.stats-section {
  background: var(--color-background-secondary);
  padding: var(--spacing-16) 0;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-8);
}

.stat-card-inner {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  box-shadow: var(--shadow-xl);
  transition: var(--transition-base);
}

.stat-card-inner:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-2xl);
}

.stat-content {
  text-align: center;
  padding: var(--spacing-4);
}

.stat-icon {
  font-size: var(--font-size-5xl);
  color: #f97316;
  margin-bottom: var(--spacing-4);
}

.stat-value {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.stat-label {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

/* Skills Preview Section */
.skills-preview-section {
  background: var(--color-background-primary);
  padding: var(--spacing-16) 0;
}

.section-title {
  text-align: center;
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-12);
  color: var(--color-text-primary);
}

.skill-category {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-6);
  margin-top: var(--spacing-8);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-12);
}

.skill-item {
  background: var(--color-background-primary);
  padding: var(--spacing-6);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-base);
  transition: var(--transition-base);
}

.skill-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.skill-name {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.skill-percentage {
  font-weight: var(--font-weight-semibold);
  color: #f97316;
}

.skill-progress {
  height: 0.5rem;
}

.skills-cta {
  text-align: center;
}

/* CTA Section */
.cta-section {
  background: var(--gradient-hero-alt);
  padding: var(--spacing-16) 0;
}

.cta-card {
  max-width: 600px;
  margin: 0 auto;
  border: none;
  box-shadow: var(--shadow-2xl);
}

.cta-content {
  text-align: center;
  padding: var(--spacing-8);
}

.cta-content h3 {
  font-size: var(--font-size-4xl);
  margin-bottom: var(--spacing-4);
  color: var(--color-text-primary);
}

.cta-content p {
  font-size: var(--font-size-xl);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-8);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    min-height: 60vh;
    padding: var(--spacing-8) var(--spacing-4);
  }

  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--spacing-8);
  }

  .hero-title {
    font-size: var(--font-size-5xl);
  }

  .hero-subtitle {
    font-size: var(--font-size-xl);
  }

  .hero-description {
    font-size: var(--font-size-base);
  }

  .hero-actions {
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .profile-avatar {
    width: 180px !important;
    height: 180px !important;
    font-size: 4rem !important;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-4);
  }

  .section-title {
    font-size: var(--font-size-4xl);
  }

  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-4);
  }
}

@media (max-width: 1024px) and (min-width: 769px) {
  .skills-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
