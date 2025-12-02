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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 0.75rem 0;
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
  gap: 0.5rem;
}

.nav-right {
  display: flex;
  justify-content: flex-end;
}

.brand-section {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.brand-section:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: -0.025em;
}


.nav-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  margin: 0 0.25rem;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
}

.nav-item:hover {
  background: #fef3c7;
  color: #f59e0b;
  transform: translateY(-1px);
}

.active-nav {
  background: #f59e0b;
  color: white !important;
}

.active-nav:hover {
  background: #d97706;
  color: white !important;
}

.nav-icon {
  font-size: 1rem;
}

.social-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  color: #6b7280;
  text-decoration: none;
  width: 2.5rem;
  height: 2.5rem;
}

.social-link:hover {
  background: #fef3c7;
  color: #f59e0b;
  transform: scale(1.1);
}

/* Mobile Menu Button */
.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #1f2937;
  font-size: 1.5rem;
  transition: all 0.2s ease;
  margin-left: 1rem;
}

.mobile-menu-button:hover {
  color: #f59e0b;
  transform: scale(1.1);
}

/* Mobile Sidebar Styles */
.mobile-sidebar {
  z-index: 1001;
  background: #ffffff !important;
}

.mobile-sidebar :deep(.p-sidebar) {
  background: #ffffff !important;
}

.mobile-sidebar :deep(.p-sidebar-content) {
  background: #ffffff !important;
}

.sidebar-header {
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}

.sidebar-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: -0.025em;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
}

.sidebar-nav-item:hover {
  background: #fef3c7;
  color: #f59e0b;
}

.sidebar-nav-item.active-nav {
  background: #f59e0b;
  color: white !important;
}

.sidebar-nav-icon {
  font-size: 1.25rem;
}

.sidebar-social {
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.sidebar-social-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.sidebar-social-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-social-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
}

.sidebar-social-link:hover {
  background: #fef3c7;
  color: #f59e0b;
}

.sidebar-social-link i {
  font-size: 1.25rem;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .brand-text {
    font-size: 1.25rem;
  }

  .nav-container {
    padding: 0 0.5rem;
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
    gap: 0.5rem;
  }

  .social-link {
    width: 2rem;
    height: 2rem;
    padding: 0.375rem;
  }
}

@media (max-width: 480px) {
  .brand-text {
    font-size: 1.1rem;
  }

  .nav-container {
    padding: 0 0.25rem;
  }

  .nav-content {
    padding: 0.5rem 0;
    min-height: 50px;
  }
}
</style>
