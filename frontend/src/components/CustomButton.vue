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

<style lang="scss" scoped>
@import '../styles/design-tokens';

// ===== CUSTOM BUTTON COMPONENT STYLES =====
.custom-button {
  // Base button styling
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-2;
  font-weight: $font-weight-semibold;
  text-decoration: none;
  border-radius: $border-radius-lg;
  transition: all $transition-base;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  // Ensure consistent icon and text alignment
  .p-button-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .p-button-label {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    visibility: visible;
    opacity: 1;
  }

  // Ensure text content is visible
  .p-button-label,
  .p-button-text {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    visibility: visible;
    opacity: 1;
  }

  // ===== SIZE VARIANTS =====
  &--small {
    min-height: $button-height-sm;
    padding: $spacing-2 $spacing-4;
    font-size: $font-size-sm;
    gap: $spacing-1;

    .p-button-icon {
      font-size: $font-size-sm;
    }
  }

  &--normal {
    min-height: $button-height-base;
    padding: $spacing-3 $spacing-6;
    font-size: $font-size-base;
    gap: $spacing-2;

    .p-button-icon {
      font-size: $font-size-base;
    }
  }

  &--large {
    min-height: $button-height-lg;
    padding: $spacing-4 $spacing-8;
    font-size: $font-size-lg;
    gap: $spacing-3;

    .p-button-icon {
      font-size: $font-size-lg;
    }
  }

  // ===== ICON SIZE VARIANTS =====
  &--icon-small {
    .p-button-icon {
      font-size: $font-size-sm;
    }
  }

  &--icon-normal {
    .p-button-icon {
      font-size: $font-size-base;
    }
  }

  &--icon-large {
    .p-button-icon {
      font-size: $font-size-lg;
    }
  }

  // ===== SPACING VARIANTS =====
  &--spacing-compact {
    gap: $spacing-1;
    padding-left: $spacing-3;
    padding-right: $spacing-3;
  }

  &--spacing-normal {
    gap: $spacing-2;
  }

  &--spacing-relaxed {
    gap: $spacing-3;
    padding-left: $spacing-8;
    padding-right: $spacing-8;
  }

  // ===== ICON POSITION VARIANTS =====
  &--icon-left {
    flex-direction: row;
  }

  &--icon-right {
    flex-direction: row-reverse;
  }

  &--icon-top {
    flex-direction: column;
    gap: $spacing-1;
  }

  &--icon-bottom {
    flex-direction: column-reverse;
    gap: $spacing-1;
  }

  // ===== CUSTOM VARIANTS =====
  &--minimal {
    background: transparent;
    border: 1px solid transparent;
    color: $primary;

    &:hover {
      background: $primary-lightest;
      border-color: $primary-light;
      color: $primary-dark;
    }

    &:active {
      background: $primary-lighter;
    }
  }

  &--gradient {
    background: $gradient-primary;
    border: none;
    color: $text-white;
    box-shadow: $shadow-md;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-lg;
    }

    &:active {
      transform: translateY(0);
      box-shadow: $shadow-md;
    }
  }

  &--outline {
    background: transparent;
    border: 2px solid $primary;
    color: $primary;

    &:hover {
      background: $primary;
      color: $text-white;
      transform: translateY(-1px);
      box-shadow: $shadow-md;
    }

    &:active {
      transform: translateY(0);
    }
  }

  &--ghost {
    background: transparent;
    border: none;
    color: $primary;
    padding: $spacing-2 $spacing-4;

    &:hover {
      background: $primary-lightest;
      color: $primary-dark;
    }

    &:active {
      background: $primary-lighter;
    }
  }

  // ===== STATE VARIANTS =====
  &--loading {
    cursor: not-allowed;
    opacity: 0.7;

    .p-button-icon {
      animation: spin 1s linear infinite;
    }
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }

  // ===== HOVER EFFECTS =====
  &:not(.custom-button--disabled):not(.custom-button--loading) {
    &:hover {
      transform: translateY(-1px);
      box-shadow: $shadow-md;
    }

    &:active {
      transform: translateY(0);
      box-shadow: $shadow-sm;
    }
  }

  // ===== FOCUS STYLES =====
  &:focus-visible {
    outline: 2px solid $primary;
    outline-offset: 2px;
  }

  // ===== RESPONSIVE ADJUSTMENTS =====
  @media (max-width: $breakpoint-md) {
    &--large {
      min-height: $button-height-base;
      padding: $spacing-3 $spacing-6;
      font-size: $font-size-base;
    }

    &--spacing-relaxed {
      padding-left: $spacing-6;
      padding-right: $spacing-6;
    }
  }
}

// ===== ANIMATIONS =====
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// ===== PRIMEVUE OVERRIDE STYLES =====
// Ensure our custom styles take precedence over PrimeVue defaults
.custom-button.p-button {
  // Reset PrimeVue button styles that might conflict
  min-width: auto;
  width: auto;

  // Ensure proper flex layout
  display: inline-flex;
  align-items: center;
  justify-content: center;

  // Override PrimeVue icon positioning
  .p-button-icon {
    order: 0;
    margin: 0;
  }

  .p-button-label {
    order: 1;
    margin: 0;
    visibility: visible !important;
    opacity: 1 !important;
    display: flex !important;
  }

  // Ensure text content is always visible
  .p-button-text,
  .p-button-label {
    visibility: visible !important;
    opacity: 1 !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }

  // Override any PrimeVue styles that might hide text
  .p-button-label,
  .p-button-text,
  span {
    visibility: visible !important;
    opacity: 1 !important;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
  }

  // Ensure the button content is visible
  .p-button-content {
    display: flex !important;
    align-items: center;
    justify-content: center;
    gap: inherit;
  }

  // Icon right positioning
  &.custom-button--icon-right {
    .p-button-icon {
      order: 1;
    }

    .p-button-label {
      order: 0;
    }
  }

  // Icon top/bottom positioning
  &.custom-button--icon-top,
  &.custom-button--icon-bottom {
    .p-button-icon,
    .p-button-label {
      order: unset;
    }
  }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
.custom-button {
  // Ensure proper focus indicators
  &:focus-visible {
    outline: 2px solid $primary;
    outline-offset: 2px;
    border-radius: $border-radius-lg;
  }

  // High contrast mode support
  @media (prefers-contrast: high) {
    border-width: 2px;
  }

  // Reduced motion support
  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }

    .p-button-icon {
      animation: none;
    }
  }
}

// ===== GLOBAL BUTTON TEXT VISIBILITY FIX =====
// Ensure button text is always visible across all states
.custom-button.p-button {
  // Force visibility of all text content
  * {
    visibility: visible !important;
    opacity: 1 !important;
  }

  // Specific overrides for button content
  .p-button-label,
  .p-button-text,
  .p-button-content,
  span:not(.p-button-icon) {
    visibility: visible !important;
    opacity: 1 !important;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
  }

  // Ensure text is visible in all states
  &:hover,
  &:focus,
  &:active,
  &:visited {
    .p-button-label,
    .p-button-text,
    .p-button-content,
    span:not(.p-button-icon) {
      visibility: visible !important;
      opacity: 1 !important;
      display: inline-flex !important;
    }
  }
}
</style>
