# Riot_ReImagined Design System

This document describes the design system implemented using taste-skill's redesign-existing-projects methodology.

## Color Palette

### Primary Background
- **Dark-900**: `#0a0a0a` - Main background color
- **Dark-800**: `#121212` - Secondary surface
- **Dark-700**: `#1a1a1a` - Tertiary surface
- **Dark-600**: `#222222` - Elevated surface

### Accent Colors (Anti-Slop Desaturation)
- **Accent Primary**: `#4FB7DD` - Main accent (cool blue, desaturated)
- **Accent Secondary**: `#5724FF` - Secondary accent (violet, use sparingly)
- **Accent Tertiary**: `#EDFF66` - Tertiary accent (yellow, reduced intensity)

### Text Colors
- **White**: `#ffffff` - Primary text
- **White 80%**: `#ffffff` with opacity - Secondary text
- **White 70%**: `#ffffff` with opacity - Tertiary text
- **White 60%**: `#ffffff` with opacity - Disabled/muted text
- **White 50%**: `#ffffff` with opacity - Very faint text

## Typography

### Font Stack
- **Primary**: "General Sans", sans-serif
- **Display**: "Riot" font (custom)
- **Code/Data**: Monospace variants

### Font Sizes (Responsive)
- **H1**: `clamp(2rem, 5vw, 3.75rem)` with 1.2 line-height
- **H2**: `clamp(1.5rem, 4vw, 2.25rem)` with 1.3 line-height
- **H3**: `clamp(1.25rem, 3vw, 1.875rem)` with 1.4 line-height
- **Body**: Base 1rem with 1.6 line-height
- **Small**: 0.875rem

### Typography Rules
- Headlines: Letter-spacing -0.02em (tight tracking)
- Body text: Letter-spacing -0.005em
- All text: Smooth scroll behavior enabled
- Paragraph max-width: 65 characters
- Text wrapping: `text-wrap: balance` for headings

## Component Patterns

### Buttons
- **Base Style**: White background, rounded pill (border-radius: full)
- **Hover**: Scale 1.05x, shadow-lg
- **Active**: Scale 0.95x (press effect)
- **Focus**: 2px solid accent-primary outline
- **Transitions**: 300ms ease-out
- **Alternative**: Gradient (accent-primary to blue-400) with black text

### Navigation
- **Link Hover**: Underline animation using gradient border-bottom
- **Active Link**: Color change to accent-primary
- **Transition**: 300ms ease-out
- **Accessibility**: Focus visible outline required

### Cards
- **Style**: `card-elevated` class
- **Background**: rgba(255, 255, 255, 0.03)
- **Border**: 1px solid rgba(255, 255, 255, 0.1)
- **Border Radius**: 12px
- **Hover State**: Background opacity increase, border color to accent-primary with 0.3 opacity
- **Hover Effect**: translateY(-4px), shadow 0 10px 40px rgba(79, 183, 221, 0.1)

### Forms
- **Input Border**: border-white/10
- **Input Focus**: border-accent-primary with 300ms transition
- **Placeholder**: text-white/40
- **Background**: bg-white/5

### Modals/Overlays
- **Backdrop**: bg-black/95 with backdrop-blur-xl
- **Transition**: 500ms ease-in-out
- **Animation**: Slide from right or fade

## Animations & Interactions

### Transitions
- Standard: 300ms ease-out
- Navigation: 300ms duration
- Page transitions: 500ms ease-in-out

### Hover Effects
- **Buttons**: Scale, shadow, color shift
- **Links**: Underline animation, color to accent-primary
- **Social Icons**: Translate up (-translate-y-1), background glow

### Loading States
- **Pulse**: 2s infinite cubic-bezier(0.4, 0, 0.6, 1)
- **Shimmer**: 2s infinite background animation
- **Skeleton**: Loading-skeleton class with pulse-glow animation

### Reveal Animations
- **On Scroll**: Fade + translateY(20px) → opacity: 1, translateY(0)
- **Duration**: 0.8s ease-out
- **Stagger**: Each child +0.1s delay

### Entrance Animations
- **Scale In**: 0.95 → 1.0 scale with opacity fade
- **Slide In Left/Right**: ±30px translateX → 0
- **Duration**: 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)

## Spacing System

### Container
- **Max-width**: 1440px for full-width containers
- **Padding**: Responsive 1rem to 3rem

### Grid System
- **Column Gap**: 12px to 24px (responsive)
- **Row Gap**: 12px to 32px (responsive)
- **Breakpoints**: sm, md, lg (Tailwind defaults)

### Vertical Rhythm
- **Section Spacing**: 4rem-6rem vertical padding
- **Component Spacing**: 1rem-2rem margin/padding
- **Line Height**: 1.6-1.7 for body text

## Accessibility

### Focus States
- All interactive elements: 2px solid #4FB7DD outline
- Outline offset: 2px
- Focus visible only (not always visible)

### Keyboard Navigation
- Skip-to-content link: Hidden by default, visible on focus
- Tab order: Logical flow from top to bottom
- Form validation: Inline error messages (no window.alert)

### Alt Text
- All images: Descriptive alt text
- Decorative images: Empty alt attribute is acceptable only with role="presentation"
- Background images: Fallback color provided

### Color Contrast
- Minimum 4.5:1 for body text
- Minimum 3:1 for large text
- Links: Underline or distinct visual indicator beyond color

## Code Quality Standards

### Structure
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`
- No div soup
- Proper heading hierarchy (h1 → h2 → h3)

### Styling
- No hardcoded pixel widths (use relative units)
- No arbitrary z-index values (use z-index scale)
- No inline styles (use Tailwind classes)
- Consistent spacing scale

### Performance
- Smooth scroll-behavior enabled globally
- GPU-accelerated transforms (not top/left)
- Debounced resize listeners
- Lazy loading on images where appropriate

## Strategic Additions

### Missing Features Implemented
- ✅ Focus visible states
- ✅ Smooth scroll transitions
- ✅ Loading state animations
- ✅ Navigation underline animation
- ✅ Card elevation patterns
- ✅ Accessibility improvements

### Recommended Future Additions
- [ ] Custom 404 page
- [ ] Empty states for data views
- [ ] Error boundary component
- [ ] Toast/notification system
- [ ] Loading skeleton components
- [ ] Form validation patterns
- [ ] Progressive image loading

## Tailwind Configuration

Custom values in `tailwind.config.cjs`:
- Dark color scale (`dark.900`, `dark.800`, etc.)
- Accent colors (`accent.primary`, `accent.secondary`)
- Custom spacing
- Enhanced box-shadow scale
- Typography scale

## Files Modified

1. ✅ `tailwind.config.cjs` - Enhanced color palette and design system
2. ✅ `src/index.css` - Dark background, typography improvements
3. ✅ `src/App.css` - Modernized patterns, removed boilerplate
4. ✅ `src/glitch.css` - Premium animations and loading states
5. ✅ `src/components/common/Button.jsx` - Enhanced hover states
6. ✅ `src/components/common/Navbar.jsx` - Color consistency
7. ✅ `src/components/common/Footer.jsx` - Complete redesign
8. ✅ `src/components/home/About.jsx` - Theme alignment
9. ✅ `src/components/home/Story.jsx` - Dark theme update
10. ✅ `src/components/home/Contact.jsx` - Theme consistency

## Next Steps

Run the development server to test the redesigned UI:
```bash
npm run dev
```

## References

- [Taste Skill - Redesign Existing Projects](https://github.com/Leonxlnx/taste-skill)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GSAP Documentation](https://greensock.com/docs/)
