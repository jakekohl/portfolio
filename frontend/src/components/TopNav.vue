<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, computed } from 'vue';

const router = useRouter();
const route = useRoute();

const sidebarVisible = ref(false);

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    dataTest: 'nav-home',
    command: () => {
      router.push('/');
      sidebarVisible.value = false;
    }
  },
  {
    label: 'Career',
    icon: 'pi pi-building',
    dataTest: 'nav-roles',
    command: () => {
      router.push('/roles');
      sidebarVisible.value = false;
    }
  },
  {
    label: 'Projects',
    icon: 'pi pi-briefcase',
    dataTest: 'nav-projects',
    command: () => {
      router.push('/projects');
      sidebarVisible.value = false;
    }
  },
  {
    label: 'Contact',
    icon: 'pi pi-envelope',
    dataTest: 'nav-contact',
    command: () => {
      router.push('/contact');
      sidebarVisible.value = false;
    }
  }
]);

const socialLinks = ref([
  {
    icon: 'pi pi-github',
    link: 'https://github.com/jakekohl',
    dataTest: 'social-github'
  },
  {
    icon: 'pi pi-linkedin',
    link: 'https://linkedin.com/in/jacob-jp-kohl',
    dataTest: 'social-linkedin'
  }
]);

const currentPath = computed(() => route.path);

const isActiveRoute = (label) => {
  const routeMap = {
    'Home': '/',
    'Career': '/roles',
    'Projects': '/projects',
    'Contact': '/contact'
  };
  return currentPath.value === routeMap[label];
};

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};
</script>

<template>
  <div class="full-width-nav">
    <div class="nav-container">
      <div class="nav-content">
        <div class="nav-left">
          <div class="brand-section" @click="router.push('/')" data-test="brand-slot">
            <span class="brand-text">Jake Kohl</span>
          </div>
          <button 
            class="mobile-menu-button" 
            @click="toggleSidebar"
            aria-label="Toggle menu"
            data-test="mobile-menu-button"
          >
            <i class="pi pi-bars"></i>
          </button>
        </div>

        <nav class="nav-center">
          <a
            v-for="item in items"
            :key="item.label"
            @click="item.command"
            class="nav-item"
            :class="{ 'active-nav': isActiveRoute(item.label) }"
            :data-test="item.dataTest"
          >
            <i :class="item.icon" class="nav-icon"></i>
            <span>{{ item.label }}</span>
          </a>
        </nav>

        <div class="nav-right">
          <div v-if="!sidebarVisible" class="social-links">
            <a v-for="link in socialLinks" :key="link.link" :href="link.link" target="_blank" rel="noopener" class="social-link" :data-test="link.dataTest">
              <i :class="link.icon"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <PrimeSidebar 
      v-model:visible="sidebarVisible" 
      position="left"
      class="mobile-sidebar"
      data-test="mobile-sidebar"
    >
      <template #header>
        <div class="sidebar-header">
          <span class="sidebar-brand">Jake Kohl</span>
        </div>
      </template>
      
      <nav class="sidebar-nav">
        <a
          v-for="item in items"
          :key="item.label"
          @click="item.command"
          class="sidebar-nav-item"
          :class="{ 'active-nav': isActiveRoute(item.label) }"
          :data-test="`mobile-${item.dataTest}`"
        >
          <i :class="item.icon" class="sidebar-nav-icon"></i>
          <span>{{ item.label }}</span>
        </a>
      </nav>

      <div class="sidebar-social">
        <div class="sidebar-social-label">Connect</div>
        <div class="sidebar-social-links">
          <a 
            v-for="link in socialLinks" 
            :key="link.link" 
            :href="link.link" 
            target="_blank" 
            rel="noopener" 
            class="sidebar-social-link" 
            :data-test="`mobile-${link.dataTest}`"
          >
            <i :class="link.icon"></i>
            <span>{{ link.icon.includes('github') ? 'GitHub' : 'LinkedIn' }}</span>
          </a>
        </div>
      </div>
    </PrimeSidebar>
  </div>
</template>

<style>
/* Full width navigation - no scoped styles to avoid conflicts */
.full-width-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100vw;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-md);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.nav-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: var(--spacing-3) 0;
  min-height: 60px;
  width: 100%;
}

.nav-left {
  display: flex;
  justify-content: flex-start;
}

.nav-center {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: var(--spacing-2);
}

.nav-right {
  display: flex;
  justify-content: flex-end;
}

.brand-section {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: var(--transition-base);
}

.brand-section:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.brand-text {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-3) var(--spacing-4);
  margin: 0 var(--spacing-1);
  border-radius: var(--border-radius-xl);
  transition: var(--transition-base);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
}

.nav-item:hover {
  background: var(--color-primary-lightest);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.active-nav {
  background: var(--color-primary);
  color: var(--color-text-white) !important;
}

.active-nav:hover {
  background: var(--color-primary-dark);
  color: var(--color-text-white) !important;
}

.nav-icon {
  font-size: var(--font-size-base);
}

.social-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2);
  border-radius: var(--border-radius-full);
  transition: var(--transition-base);
  color: var(--color-text-secondary);
  text-decoration: none;
  width: var(--button-height-base);
  height: var(--button-height-base);
}

.social-link:hover {
  background: var(--color-primary-lightest);
  color: var(--color-primary);
  transform: scale(1.1);
}

/* Mobile Menu Button */
.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-2);
  color: var(--color-text-primary);
  font-size: var(--font-size-2xl);
  transition: var(--transition-base);
  margin-left: var(--spacing-4);
}

.mobile-menu-button:hover {
  color: var(--color-primary);
  transform: scale(1.1);
}

/* Mobile Sidebar Styles */
.mobile-sidebar {
  z-index: 1001;
  background: var(--color-background-primary) !important;
}

.mobile-sidebar :deep(.p-sidebar) {
  background: var(--color-background-primary) !important;
}

.mobile-sidebar :deep(.p-sidebar-content) {
  background: var(--color-background-primary) !important;
}

.sidebar-header {
  padding: var(--spacing-4) 0;
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: var(--spacing-4);
}

.sidebar-brand {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-8);
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-xl);
  transition: var(--transition-base);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-lg);
}

.sidebar-nav-item:hover {
  background: var(--color-primary-lightest);
  color: var(--color-primary);
}

.sidebar-nav-item.active-nav {
  background: var(--color-primary);
  color: var(--color-text-white) !important;
}

.sidebar-nav-icon {
  font-size: var(--font-size-xl);
}

.sidebar-social {
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-border-light);
}

.sidebar-social-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-3);
}

.sidebar-social-links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.sidebar-social-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  border-radius: var(--border-radius-xl);
  transition: var(--transition-base);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
}

.sidebar-social-link:hover {
  background: var(--color-primary-lightest);
  color: var(--color-primary);
}

.sidebar-social-link i {
  font-size: var(--font-size-xl);
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .brand-text {
    font-size: var(--font-size-xl);
  }

  .nav-container {
    padding: 0 var(--spacing-2);
  }

  .mobile-menu-button {
    display: block;
  }

  .nav-center {
    display: none;
  }

  .nav-content {
    grid-template-columns: auto 1fr auto;
  }

  .nav-right {
    justify-content: flex-end;
  }

  .social-links {
    gap: var(--spacing-2);
  }

  .social-link {
    width: var(--button-height-sm);
    height: var(--button-height-sm);
    padding: var(--spacing-1);
  }
}

@media (max-width: 480px) {
  .brand-text {
    font-size: var(--font-size-lg);
  }

  .nav-container {
    padding: 0 var(--spacing-1);
  }

  .nav-content {
    padding: var(--spacing-2) 0;
    min-height: 50px;
  }
}
</style>
