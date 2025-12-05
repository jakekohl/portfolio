import Card from 'primevue/card';
import Menubar from 'primevue/menubar';
import Badge from 'primevue/badge';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Chip from 'primevue/chip';
import Divider from 'primevue/divider';
import Panel from 'primevue/panel';
import Timeline from 'primevue/timeline';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select'
import Sidebar from 'primevue/sidebar';
import Tooltip from 'primevue/tooltip';

// Orange theme configuration for PrimeVue
const orangeTheme = {
  primary: '#f97316',
  primaryDark: '#ea580c',
  primaryLight: '#fb923c',
  primaryLighter: '#fdba74',
  primaryLightest: '#ffedd5',

  secondary: '#6b7280',
  secondaryDark: '#374151',
  secondaryLight: '#9ca3af',

  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',

  text: '#111827',
  textSecondary: '#6b7280',
  textLight: '#9ca3af',
  textWhite: '#ffffff',

  background: '#ffffff',
  backgroundSecondary: '#f9fafb',
  backgroundTertiary: '#f3f4f6',

  border: '#e5e7eb',
  borderMedium: '#d1d5db',
  borderDark: '#9ca3af',

  borderRadius: '0.5rem',
  borderRadiusLarge: '0.75rem',
  borderRadiusXLarge: '1rem',

  shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  shadowMedium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLarge: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

  transition: 'all 0.3s ease',
  transitionFast: 'all 0.15s ease',
  transitionSlow: 'all 0.5s ease',
};

export default {
  install: (app) => {
    app.component('PrimeCard', Card);
    app.component('PrimeMenubar', Menubar);
    app.component('PrimeAvatar', Avatar);
    app.component('PrimeBadge', Badge);
    app.component('PrimeButton', Button);
    app.component('PrimeTag', Tag);
    app.component('PrimeChip', Chip);
    app.component('PrimeDivider', Divider);
    app.component('PrimePanel', Panel);
    app.component('PrimeTimeline', Timeline);
    app.component('PrimeProgressBar', ProgressBar);
    app.component('PrimeProgressSpinner', ProgressSpinner);
    app.component('PrimeDialog', Dialog);
    app.component('PrimeSidebar', Sidebar);
    app.component('PrimeSelect', Select);

    // Register tooltip directive globally
    app.directive('tooltip', Tooltip);

    // Provide theme configuration globally
    app.provide('orangeTheme', orangeTheme);
  },
};
