# Centralized Styling System

This directory contains the centralized styling system for Jake Kohl's portfolio website, built with Vue.js and PrimeVue components. The system uses orange as the primary color and provides a comprehensive set of design tokens, utilities, and component customizations.

## File Structure

```
src/styles/
├── design-tokens.scss      # Core design tokens (colors, typography, spacing)
├── utilities.scss          # Utility classes for layout, spacing, colors, etc.
├── primevue-orange-theme.scss # PrimeVue component theme customization
├── styles.scss             # Main stylesheet that imports everything
└── README.md              # This documentation file
```

## Design Tokens

### Color Palette
- **Primary Orange**: `#f97316` (main orange)
- **Orange Variants**: 50-900 scale from lightest to darkest
- **Neutral Grays**: 50-900 scale for text, backgrounds, and borders
- **Semantic Colors**: Success (green), Warning (amber), Danger (red), Info (blue)

### Typography
- **Font Family**: Inter (primary), with fallbacks
- **Font Sizes**: xs (12px) to 6xl (60px)
- **Font Weights**: light (300) to extrabold (800)
- **Line Heights**: tight (1.25) to loose (2)

### Spacing
- **Scale**: 0 to 32 (4px to 128px)
- **Consistent spacing** for margins, padding, and gaps

### Border Radius
- **Scale**: sm (2px) to full (9999px)
- **Consistent rounded corners** across components

## Usage

### CSS Custom Properties
The system provides CSS custom properties that you can use in your components:

```css
.my-component {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}
```

### SCSS Variables
Use SCSS variables in your component styles:

```scss
.my-component {
  background-color: $primary;
  color: $text-white;
  padding: $spacing-4;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
}
```

### Utility Classes
Apply utility classes directly in your templates:

```html
<div class="bg-primary text-white p-4 rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-4">Title</h2>
  <p class="text-lg">Content here</p>
</div>
```

## Available Utility Classes

### Layout
- `.container`, `.container-sm`, `.container-lg`
- `.flex`, `.flex-col`, `.flex-row`, `.items-center`, `.justify-between`
- `.grid`, `.grid-cols-2`, `.grid-cols-3`, `.gap-4`

### Spacing
- Margins: `.m-0`, `.m-4`, `.mt-4`, `.mb-4`, `.ml-4`, `.mr-4`
- Padding: `.p-0`, `.p-4`, `.px-4`, `.py-4`

### Typography
- Text alignment: `.text-left`, `.text-center`, `.text-right`
- Font weight: `.font-light`, `.font-normal`, `.font-semibold`, `.font-bold`
- Font size: `.text-sm`, `.text-base`, `.text-lg`, `.text-xl`, `.text-2xl`

### Colors
- Text colors: `.text-primary`, `.text-secondary`, `.text-white`, `.text-gray-600`
- Background colors: `.bg-primary`, `.bg-secondary`, `.bg-white`, `.bg-gray-50`
- Gradients: `.bg-gradient-primary`, `.bg-gradient-hero`

### Borders & Shadows
- Border radius: `.rounded`, `.rounded-lg`, `.rounded-xl`, `.rounded-full`
- Shadows: `.shadow`, `.shadow-md`, `.shadow-lg`, `.shadow-xl`

### Transitions & Effects
- Transitions: `.transition-all`, `.transition-fast`, `.transition-slow`
- Hover effects: `.hover-lift`, `.hover-scale`, `.hover-scale-sm`

## PrimeVue Integration

The system includes comprehensive PrimeVue component customizations:

### Buttons
```html
<PrimeButton label="Primary Button" class="p-button-primary" />
<PrimeButton label="Secondary Button" severity="secondary" />
```

### Cards
```html
<PrimeCard class="p-card">
  <template #content>
    <p>Card content</p>
  </template>
</PrimeCard>
```

### Navigation
```html
<PrimeMenubar :model="items" class="p-menubar" />
```

All PrimeVue components automatically inherit the orange theme styling.

## Responsive Design

The system includes responsive utilities:

```html
<!-- Hide on mobile, show on larger screens -->
<div class="hidden-mobile">Desktop only content</div>

<!-- Show on mobile, hide on larger screens -->
<div class="visible-mobile">Mobile only content</div>

<!-- Responsive text sizing -->
<h1 class="responsive-text-3xl">Responsive heading</h1>
```

## Component Utilities

### Button Base
```html
<button class="btn-base bg-primary text-white">
  Custom Button
</button>
```

### Card Base
```html
<div class="card-base p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### Input Base
```html
<input class="input-base" placeholder="Enter text..." />
```

## Best Practices

1. **Use utility classes** for simple styling needs
2. **Use SCSS variables** for component-specific styling
3. **Use CSS custom properties** for dynamic styling
4. **Follow the spacing scale** (use predefined spacing values)
5. **Use semantic color names** (primary, secondary, success, etc.)
6. **Leverage PrimeVue components** before building custom ones
7. **Use responsive utilities** for mobile-first design

## Adding New Styles

When adding new styles:

1. **Add design tokens** to `design-tokens.scss` if needed
2. **Add utility classes** to `utilities.scss` for reusable patterns
3. **Customize PrimeVue components** in `primevue-orange-theme.scss`
4. **Use existing patterns** before creating new ones

## Color Accessibility

The orange color palette has been tested for:
- **WCAG AA compliance** for text contrast
- **Color-blind friendly** combinations
- **High contrast** for readability

## Browser Support

The styling system supports:
- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **CSS Custom Properties** (IE11+ with fallbacks)
- **CSS Grid** (with flexbox fallbacks)
- **CSS Flexbox** (IE10+)

## Performance

- **Minimal CSS output** through efficient SCSS compilation
- **Tree-shaking** of unused utility classes
- **Optimized** PrimeVue theme variables
- **Efficient** CSS custom properties usage
