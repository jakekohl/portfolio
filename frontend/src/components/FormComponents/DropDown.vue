<script setup>
import { computed } from 'vue';
import Select from 'primevue/select';

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, null],
    default: null,
  },
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  optionLabel: {
    type: [String, Function],
    default: 'label',
  },
  optionValue: {
    type: [String, Function],
    default: 'value',
  },
  optionDisabled: {
    type: [String, Function],
    default: null,
  },
  placeholder: {
    type: String,
    default: 'Select an option',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showClear: {
    type: Boolean,
    default: false,
  },
  filter: {
    type: Boolean,
    default: false,
  },
  filterPlaceholder: {
    type: String,
    default: 'Search...',
  },
  id: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: '',
  },
  panelClass: {
    type: String,
    default: 'custom-dropdown-panel',
  },
  dataTest: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'change', 'filter']);

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    emit('change', value);
  },
});

// Passthrough props for styling the panel
const pt = computed(() => ({
  panel: {
    class: props.panelClass,
    style: 'background: #ffffff !important; background-color: #ffffff !important; background-image: none !important; border: 3px solid #000000 !important; border-width: 3px !important; border-style: solid !important; border-color: #000000 !important;',
  },
  list: {
    style: 'background: #ffffff !important; background-color: #ffffff !important; background-image: none !important;',
  },
  item: ({ context }) => ({
    style: context.selected
      ? 'background: #ffedd5 !important; background-color: #ffedd5 !important; background-image: none !important; color: #ea580c !important;'
      : 'background: #ffffff !important; background-color: #ffffff !important; background-image: none !important; color: #111827 !important;',
  }),
}));
</script>

<template>
  <Select
    :id="id"
    v-model="computedValue"
    :options="options"
    :optionLabel="optionLabel"
    :optionValue="optionValue"
    :optionDisabled="optionDisabled"
    :placeholder="placeholder"
    :disabled="disabled"
    :showClear="showClear"
    :filter="filter"
    :filterPlaceholder="filterPlaceholder"
    :class="class"
    :pt="pt"
    :data-test="dataTest"
  />
</template>

<style scoped>
/* Component-specific styles for the select input */
:deep(.p-select) {
  background: var(--color-background-primary) !important;
  background-color: var(--color-background-primary) !important;
  border: 3px solid var(--color-text-primary) !important;
  border-width: 3px !important;
  border-style: solid !important;
  border-color: var(--color-text-primary) !important;
  border-radius: var(--border-radius-lg) !important;
  width: 100%;
}

:deep(.p-select-label),
:deep(.p-select-label-empty),
:deep(.p-select .p-select-label),
:deep(.p-select input),
:deep(.p-select span),
:deep(.p-select *) {
  color: var(--color-text-primary) !important;
}

:deep(.p-select-trigger) {
  background: var(--color-background-primary) !important;
  background-color: var(--color-background-primary) !important;
}

:deep(.p-select-trigger .p-icon) {
  color: var(--color-text-primary) !important;
}

:deep(.p-select:focus),
:deep(.p-select:focus-within) {
  border-color: var(--color-text-primary) !important;
  border: 3px solid var(--color-text-primary) !important;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1) !important;
}
</style>

<!-- Non-scoped styles for select panel (rendered in portal) -->
<style>
/* Global styles for custom select panel - rendered outside component */
/* Force white background with maximum specificity */
html body .p-select-panel.custom-dropdown-panel,
html body [data-pc-name="selectpanel"].custom-dropdown-panel,
body .p-select-panel.custom-dropdown-panel,
.p-select-panel.custom-dropdown-panel,
[data-pc-name="selectpanel"].custom-dropdown-panel,
*[class*="custom-dropdown-panel"] {
  background: var(--color-background-primary) !important;
  background-color: var(--color-background-primary) !important;
  background-image: none !important;
  border: 3px solid var(--color-text-primary) !important;
  border-radius: var(--border-radius-lg) !important;
  box-shadow: var(--shadow-lg) !important;
  z-index: 1000 !important;
}

html body .p-select-panel.custom-dropdown-panel .p-select-list-wrapper,
html body [data-pc-name="selectpanel"].custom-dropdown-panel [data-pc-section="list"],
html body .p-select-panel.custom-dropdown-panel [data-pc-section="list"],
body .p-select-panel.custom-dropdown-panel .p-select-list-wrapper {
  background: var(--color-background-primary) !important;
  background-color: var(--color-background-primary) !important;
  background-image: none !important;
}

html body .p-select-panel.custom-dropdown-panel .p-select-item,
html body [data-pc-name="selectpanel"].custom-dropdown-panel [data-pc-section="item"],
html body .p-select-panel.custom-dropdown-panel [data-pc-section="item"],
body .p-select-panel.custom-dropdown-panel .p-select-item {
  background: var(--color-background-primary) !important;
  background-color: var(--color-background-primary) !important;
  background-image: none !important;
  border-radius: var(--border-radius-lg);
  color: var(--color-text-primary) !important;
}

html body .p-select-panel.custom-dropdown-panel .p-select-item:hover,
html body [data-pc-name="selectpanel"].custom-dropdown-panel [data-pc-section="item"]:hover,
html body .p-select-panel.custom-dropdown-panel [data-pc-section="item"]:hover,
body .p-select-panel.custom-dropdown-panel .p-select-item:hover {
  background: var(--color-background-secondary) !important;
  background-color: var(--color-background-secondary) !important;
  background-image: none !important;
  border-radius: var(--border-radius-lg);
}

html body .p-select-panel.custom-dropdown-panel .p-select-item.p-highlight,
html body [data-pc-name="selectpanel"].custom-dropdown-panel [data-pc-section="item"].p-highlight,
html body .p-select-panel.custom-dropdown-panel [data-pc-section="item"].p-highlight,
body .p-select-panel.custom-dropdown-panel .p-select-item.p-highlight {
  background: var(--color-primary-lightest) !important;
  background-color: var(--color-primary-lightest) !important;
  background-image: none !important;
  border-radius: var(--border-radius-lg);
  color: var(--color-primary-dark) !important;
}
</style>

