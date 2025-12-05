<template>
  <PrimeButton
    v-bind="$attrs"
    :class="buttonClasses"
    :severity="severity"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :icon="icon"
    :label="label"
    :iconPos="iconPos"
    :badge="badge"
    :badgeClass="badgeClass"
    :link="link"
    :plain="plain"
    :text="text"
    :outlined="outlined"
    :raised="raised"
    :rounded="rounded"
    :block="block"
    @click="handleClick"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>

    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>

    <template v-if="$slots.badge" #badge>
      <slot name="badge" />
    </template>
  </PrimeButton>
</template>

<script setup>
import { computed } from 'vue'
import PrimeButton from 'primevue/button'

// Define props with defaults
const props = defineProps({
  // PrimeVue Button props
  severity: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'info', 'warning', 'help', 'danger', 'contrast'].includes(value)
  },
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['small', 'normal', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: null
  },
  label: {
    type: String,
    default: null
  },
  iconPos: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right', 'top', 'bottom'].includes(value)
  },
  badge: {
    type: String,
    default: null
  },
  badgeClass: {
    type: String,
    default: null
  },
  link: {
    type: Boolean,
    default: false
  },
  plain: {
    type: Boolean,
    default: false
  },
  text: {
    type: Boolean,
    default: false
  },
  outlined: {
    type: Boolean,
    default: false
  },
  raised: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  // Custom props for enhanced styling
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'minimal', 'gradient', 'outline', 'ghost'].includes(value)
  },
  iconSize: {
    type: String,
    default: 'normal',
    validator: (value) => ['small', 'normal', 'large'].includes(value)
  },
  spacing: {
    type: String,
    default: 'normal',
    validator: (value) => ['compact', 'normal', 'relaxed'].includes(value)
  }
})

// Define emits
const emit = defineEmits(['click'])

// Computed classes for enhanced styling
const buttonClasses = computed(() => {
  const classes = ['custom-button']

  // Add variant classes
  if (props.variant !== 'default') {
    classes.push(`custom-button--${props.variant}`)
  }

  // Add size classes
  classes.push(`custom-button--${props.size}`)

  // Add icon size classes
  classes.push(`custom-button--icon-${props.iconSize}`)

  // Add spacing classes
  classes.push(`custom-button--spacing-${props.spacing}`)

  // Add icon position classes
  if (props.icon || props.$slots?.icon) {
    classes.push(`custom-button--icon-${props.iconPos}`)
  }

  // Add state classes
  if (props.loading) {
    classes.push('custom-button--loading')
  }

  if (props.disabled) {
    classes.push('custom-button--disabled')
  }

  return classes
})

// Handle click events
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* ===== CUSTOM BUTTON COMPONENT STYLES ===== */
.custom-button {
  /* Base button styling */
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-base);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

/* Ensure consistent icon and text alignment */
.custom-button .p-button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.custom-button .p-button-label {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  visibility: visible;
  opacity: 1;
}

/* Ensure text content is visible */
.custom-button .p-button-label,
.custom-button .p-button-text {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  visibility: visible;
  opacity: 1;
}

/* ===== SIZE VARIANTS ===== */
.custom-button--small {
  min-height: var(--button-height-sm);
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
  gap: var(--spacing-1);
}

.custom-button--small .p-button-icon {
  font-size: var(--font-size-sm);
}

.custom-button--normal {
  min-height: var(--button-height-base);
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-base);
  gap: var(--spacing-2);
}

.custom-button--normal .p-button-icon {
  font-size: var(--font-size-base);
}

.custom-button--large {
  min-height: var(--button-height-lg);
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--font-size-lg);
  gap: var(--spacing-3);
}

.custom-button--large .p-button-icon {
  font-size: var(--font-size-lg);
}

/* ===== ICON SIZE VARIANTS ===== */
.custom-button--icon-small .p-button-icon {
  font-size: var(--font-size-sm);
}

.custom-button--icon-normal .p-button-icon {
  font-size: var(--font-size-base);
}

.custom-button--icon-large .p-button-icon {
  font-size: var(--font-size-lg);
}

/* ===== SPACING VARIANTS ===== */
.custom-button--spacing-compact {
  gap: var(--spacing-1);
  padding-left: var(--spacing-3);
  padding-right: var(--spacing-3);
}

.custom-button--spacing-normal {
  gap: var(--spacing-2);
}

.custom-button--spacing-relaxed {
  gap: var(--spacing-3);
  padding-left: var(--spacing-8);
  padding-right: var(--spacing-8);
}

/* ===== ICON POSITION VARIANTS ===== */
.custom-button--icon-left {
  flex-direction: row;
}

.custom-button--icon-right {
  flex-direction: row-reverse;
}

.custom-button--icon-top {
  flex-direction: column;
  gap: var(--spacing-1);
}

.custom-button--icon-bottom {
  flex-direction: column-reverse;
  gap: var(--spacing-1);
}

/* ===== CUSTOM VARIANTS ===== */
.custom-button--minimal {
  background: transparent;
  border: 1px solid transparent;
  color: var(--color-primary);
}

.custom-button--minimal:hover {
  background: var(--color-primary-lightest);
  border-color: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.custom-button--minimal:active {
  background: var(--color-primary-lighter);
}

.custom-button--gradient {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  border: none;
  color: var(--color-text-white);
  box-shadow: var(--shadow-md);
}

.custom-button--gradient:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.custom-button--gradient:active {
  transform: translateY(0);
  box-shadow: var(--shadow-md);
}

.custom-button--outline {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}

.custom-button--outline:hover {
  background: var(--color-primary);
  color: var(--color-text-white);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.custom-button--outline:active {
  transform: translateY(0);
}

.custom-button--ghost {
  background: transparent;
  border: none;
  color: var(--color-primary);
  padding: var(--spacing-2) var(--spacing-4);
}

.custom-button--ghost:hover {
  background: var(--color-primary-lightest);
  color: var(--color-primary-dark);
}

.custom-button--ghost:active {
  background: var(--color-primary-lighter);
}

/* ===== STATE VARIANTS ===== */
.custom-button--loading {
  cursor: not-allowed;
  opacity: 0.7;
}

.custom-button--loading .p-button-icon {
  animation: spin 1s linear infinite;
}

.custom-button--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.custom-button--disabled:hover {
  transform: none;
  box-shadow: none;
}

/* ===== HOVER EFFECTS ===== */
.custom-button:not(.custom-button--disabled):not(.custom-button--loading):hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.custom-button:not(.custom-button--disabled):not(.custom-button--loading):active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* ===== FOCUS STYLES ===== */
.custom-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 768px) {
  .custom-button--large {
    min-height: var(--button-height-base);
    padding: var(--spacing-3) var(--spacing-6);
    font-size: var(--font-size-base);
  }

  .custom-button--spacing-relaxed {
    padding-left: var(--spacing-6);
    padding-right: var(--spacing-6);
  }
}

/* ===== ANIMATIONS ===== */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ===== PRIMEVUE OVERRIDE STYLES ===== */
/* Ensure our custom styles take precedence over PrimeVue defaults */
.custom-button.p-button {
  /* Reset PrimeVue button styles that might conflict */
  min-width: auto;
  width: auto;

  /* Ensure proper flex layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Override PrimeVue icon positioning */
.custom-button.p-button .p-button-icon {
  order: 0;
  margin: 0;
}

.custom-button.p-button .p-button-label {
  order: 1;
  margin: 0;
  visibility: visible !important;
  opacity: 1 !important;
  display: flex !important;
}

/* Ensure text content is always visible */
.custom-button.p-button .p-button-text,
.custom-button.p-button .p-button-label {
  visibility: visible !important;
  opacity: 1 !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

/* Override any PrimeVue styles that might hide text */
.custom-button.p-button .p-button-label,
.custom-button.p-button .p-button-text,
.custom-button.p-button span {
  visibility: visible !important;
  opacity: 1 !important;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
}

/* Ensure the button content is visible */
.custom-button.p-button .p-button-content {
  display: flex !important;
  align-items: center;
  justify-content: center;
  gap: inherit;
}

/* Icon right positioning */
.custom-button.p-button.custom-button--icon-right .p-button-icon {
  order: 1;
}

.custom-button.p-button.custom-button--icon-right .p-button-label {
  order: 0;
}

/* Icon top/bottom positioning */
.custom-button.p-button.custom-button--icon-top .p-button-icon,
.custom-button.p-button.custom-button--icon-top .p-button-label,
.custom-button.p-button.custom-button--icon-bottom .p-button-icon,
.custom-button.p-button.custom-button--icon-bottom .p-button-label {
  order: unset;
}

/* ===== ACCESSIBILITY ENHANCEMENTS ===== */
.custom-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--border-radius-lg);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .custom-button {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .custom-button {
    transition: none;
  }

  .custom-button:hover {
    transform: none;
  }

  .custom-button .p-button-icon {
    animation: none;
  }
}

/* ===== GLOBAL BUTTON TEXT VISIBILITY FIX ===== */
/* Ensure button text is always visible across all states */
.custom-button.p-button * {
  visibility: visible !important;
  opacity: 1 !important;
}

/* Specific overrides for button content */
.custom-button.p-button .p-button-label,
.custom-button.p-button .p-button-text,
.custom-button.p-button .p-button-content,
.custom-button.p-button span:not(.p-button-icon) {
  visibility: visible !important;
  opacity: 1 !important;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
}

/* Ensure text is visible in all states */
.custom-button.p-button:hover .p-button-label,
.custom-button.p-button:hover .p-button-text,
.custom-button.p-button:hover .p-button-content,
.custom-button.p-button:hover span:not(.p-button-icon),
.custom-button.p-button:focus .p-button-label,
.custom-button.p-button:focus .p-button-text,
.custom-button.p-button:focus .p-button-content,
.custom-button.p-button:focus span:not(.p-button-icon),
.custom-button.p-button:active .p-button-label,
.custom-button.p-button:active .p-button-text,
.custom-button.p-button:active .p-button-content,
.custom-button.p-button:active span:not(.p-button-icon),
.custom-button.p-button:visited .p-button-label,
.custom-button.p-button:visited .p-button-text,
.custom-button.p-button:visited .p-button-content,
.custom-button.p-button:visited span:not(.p-button-icon) {
  visibility: visible !important;
  opacity: 1 !important;
  display: inline-flex !important;
}
</style>
