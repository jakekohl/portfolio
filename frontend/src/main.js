import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import primevueConfig from './util/primevue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

// PrimeVue configuration with orange theme
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: 'aura',
    options: {
      darkModeSelector: false,
      cssLayer: false,
    },
  },
});

app.use(router);
app.use(primevueConfig);
app.mount('#app');
