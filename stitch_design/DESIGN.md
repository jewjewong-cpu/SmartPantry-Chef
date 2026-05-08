---
name: Culinary Comfort
colors:
  surface: '#fefae0'
  surface-dim: '#dedbc2'
  surface-bright: '#fefae0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f4db'
  surface-container: '#f2efd5'
  surface-container-high: '#ede9cf'
  surface-container-highest: '#e7e3ca'
  on-surface: '#1d1c0d'
  on-surface-variant: '#554336'
  inverse-surface: '#323120'
  inverse-on-surface: '#f5f1d8'
  outline: '#887364'
  outline-variant: '#dbc2b0'
  surface-tint: '#904d00'
  primary: '#8d4b00'
  on-primary: '#ffffff'
  primary-container: '#b15f00'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb77d'
  secondary: '#586330'
  on-secondary: '#ffffff'
  secondary-container: '#d8e6a6'
  on-secondary-container: '#5c6834'
  tertiary: '#8f4a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ae611a'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77d'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#dbe9a9'
  secondary-fixed-dim: '#bfcd8f'
  on-secondary-fixed: '#171e00'
  on-secondary-fixed-variant: '#404b1b'
  tertiary-fixed: '#ffdcc4'
  tertiary-fixed-dim: '#ffb781'
  on-tertiary-fixed: '#2f1400'
  on-tertiary-fixed-variant: '#6f3800'
  background: '#fefae0'
  on-background: '#1d1c0d'
  surface-variant: '#e7e3ca'
typography:
  display-lg:
    fontFamily: Literata
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  display-md:
    fontFamily: Literata
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Literata
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Literata
    fontSize: 22px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-page: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The visual identity of this design system is rooted in the concept of a "digital kitchen companion." It moves away from the sterile, high-tech aesthetic of typical utility apps in favor of a **Tactile Modernism** style. The brand personality is nurturing, knowledgeable, and grounded, evoking the sensory experience of a sun-drenched kitchen.

This design system prioritizes a high degree of "visual softness." Every interaction should feel intentional and calm, reducing the cognitive load of meal planning and cooking. By blending organic textures with a structured layout, the system creates an environment that feels as reliable as a family heirloom cookbook but as efficient as a modern kitchen appliance.

## Colors

The color palette is inspired by natural ingredients and raw materials found in a pantry. 

- **Primary (Warm Amber):** Used for primary actions and key highlights, representing heat, honey, and energy.
- **Secondary (Sage Green):** A grounded, earthy tone used for success states and herbal, fresh categorization.
- **Tertiary (Terra Cotta):** Used for accents that require warmth without the urgency of a traditional red.
- **Surface (Cream & Parchment):** The background avoids pure white to reduce eye strain, opting instead for a milky cream that feels like high-quality paper or a clean countertop.
- **Typography (Deep Forest):** A very dark, warm green is used instead of pure black to maintain the earthy, organic harmony of the interface.

## Typography

This design system utilizes a sophisticated pairing of a serif and a sans-serif to balance tradition with modernity.

- **Headlines (Literata):** This soft, bookish serif provides a sense of editorial authority and warmth. It should be used for page titles, recipe names, and section headers to evoke the feel of a classic culinary publication.
- **Body & UI (Plus Jakarta Sans):** A friendly, contemporary sans-serif with open apertures and rounded terminals. It is used for instructions, descriptions, and functional UI elements to ensure high legibility while maintaining the "soft" brand character.
- **Hierarchy:** Generous line heights are applied across all levels to prevent the layout from feeling cramped, ensuring that instructions are easy to read from a distance (e.g., while the user is actually cooking).

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid** model. On desktop, content is contained within a 1200px max-width to maintain focus, while on smaller devices, it uses a flexible fluid grid with 32px side margins.

The spacing rhythm is based on an 8px base unit. To reinforce the "cozy" feel, this design system uses more generous internal padding within components than a standard utility app. Grouping of elements (like ingredients in a list) should use tighter "stack-sm" spacing, while major shifts in content (like moving from ingredients to preparation steps) should utilize "stack-lg" to provide clear visual breathing room.

## Elevation & Depth

Depth in this design system is achieved through **Soft Ambient Shadows** rather than stark borders or heavy gradients. 

1.  **Level 0 (Flat):** Used for the main background surface (Cream).
2.  **Level 1 (Low):** Subtle, diffused shadows (color-tinted with the Deep Forest text color at 5% opacity) are used for cards and input fields to make them appear slightly lifted from the "countertop."
3.  **Level 2 (High):** Used for primary buttons and active modals. These shadows are more spread out and slightly warmer in tint to create a "squishy," tactile feel that invites a click.
4.  **Tonal Layering:** Instead of shadows, some containers use subtle color shifts—such as a slightly darker "Oatmeal" shade—to delineate secondary information areas like sidebars or ingredient lists.

## Shapes

The shape language is characterized by "Generous Rounding." There are no sharp corners in the UI, as they feel too clinical or aggressive for a domestic setting.

- **Standard Elements:** Buttons, inputs, and small cards use a 0.5rem (8px) radius.
- **Large Containers:** Main recipe cards and modal containers use a 1.5rem (24px) radius to emphasize the "soft" and approachable nature of the system.
- **Interactive Icons:** Icons should be enclosed in "squircle" or pill-shaped backgrounds when interactive, reinforcing the tactile physical-button metaphor.

## Components

- **Buttons:** Primary buttons feature a subtle gradient of Warm Amber and Terra Cotta with a slight inner-glow on the top edge to look "pressed" or "baked." Text is always centered and set in a bold weight of the sans-serif font.
- **Cards:** Recipe cards use a white or light cream background with a Level 1 elevation. Images within cards must have a matching border radius to maintain the soft aesthetic.
- **Input Fields:** Search and quantity inputs have a thick, soft border in a light earth tone. When focused, the border transitions to the primary Warm Amber with a soft outer glow.
- **Chips/Labels:** Used for tags like "Gluten-Free" or "Quick." These should be pill-shaped with low-contrast background tints (e.g., a very light Sage background with a darker Sage text).
- **Checklists:** For grocery lists and recipe steps, use custom circular checkboxes. When checked, they should fill with the Secondary Green and use a subtle strike-through for the text.
- **Progress Indicators:** Use soft, thick bars with rounded ends. The "cook mode" progress should feel like a filling liquid or a slow-burning candle, using warm amber tones.