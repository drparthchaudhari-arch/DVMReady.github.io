# DVMReady Component Library

This folder contains reusable JavaScript components to enhance DVMReady.com and help it compete with DVMCalc.com.

## Components

### 1. Patient Weight Ribbon (`patient-weight-ribbon.js`)
**Purpose:** Persistent weight input that follows users across all calculators

**Features:**
- Stores weight in sessionStorage (persists across page navigation)
- Species selector (Dog/Cat/Exotic)
- Unit toggle (kg/lb)
- Quick preset buttons (2.5, 5, 10, 20, 30 kg)
- Auto-populates calculator fields on page load

**DVMCalc Equivalent:** The persistent weight ribbon at the top of DVMCalc pages

**Usage:**
```html
<script src="patient-weight-ribbon.js"></script>
```

---

### 2. Quick Calculate Widget (`quick-calculate-widget.js`)
**Purpose:** Floating mini-calculator for instant dose calculations without page navigation

**Features:**
- Floating action button (bottom-right corner)
- 3 calculator tabs: Drug, Fluid, Toxin
- Pre-fills weight from ribbon
- Copy results to clipboard
- Emergency contact links

**DVMCalc Equivalent:** The "Quick Calculate" feature on DVMCalc homepage

**Usage:**
```html
<script src="quick-calculate-widget.js"></script>
```

---

### 3. Drug Formulary Data (`drug-formulary-data.js`)
**Purpose:** Comprehensive veterinary drug database for dose calculations

**Features:**
- 300+ medications (expandable)
- Dose ranges for dogs and cats
- Multiple formulations per drug
- Contraindications and side effects
- Helper methods for dose calculations

**Current Categories:**
- Analgesics/NSAIDs
- Antibiotics
- Emergency drugs
- Steroids
- Anesthesia agents
- CRI protocols

**DVMCalc Equivalent:** DVMCalc's 300+ medication database

**Usage:**
```javascript
// Get drug info
const drug = VeterinaryDrugFormulary.getDrugByName('Carprofen');

// Calculate dose
const dose = VeterinaryDrugFormulary.calculateDose('Carprofen', 10, 'dog', 'mid');
// Returns: { drug, dose, unit, totalMg, frequency, route, notes }
```

---

### 4. Improved Cookie Consent (`improved-cookie-consent.js`)
**Purpose:** Less intrusive, remembers user preferences

**Features:**
- Remembers choice (stores in localStorage)
- Doesn't show on every page load
- Granular preferences (Essential/Analytics/Functional)
- Modern UI with smooth animations
- GDPR compliant

**DVMCalc Equivalent:** DVMCalc's cleaner disclaimer approach

**Usage:**
```html
<script src="improved-cookie-consent.js"></script>
```

---

## Integration Example

Create a single file that loads all components:

```html
<!DOCTYPE html>
<html>
<head>
  <title>DVMReady - Veterinary Calculators</title>
  <!-- Your existing CSS -->
  <link rel="stylesheet" href="your-styles.css">
</head>
<body>
  <!-- Your existing content -->
  
  <!-- Load all DVMReady enhancements -->
  <script src="patient-weight-ribbon.js"></script>
  <script src="quick-calculate-widget.js"></script>
  <script src="drug-formulary-data.js"></script>
  <script src="improved-cookie-consent.js"></script>
  
  <!-- Your existing scripts -->
  <script src="your-scripts.js"></script>
</body>
</html>
```

---

## Implementation Priority

### Phase 1 (Immediate - High Impact)
1. **Remove "Under Construction" banner**
   - Hurts credibility
   - Simple fix

2. **Deploy Patient Weight Ribbon**
   - Core feature DVMCalc has
   - High user value
   - Medium implementation effort

3. **Deploy Improved Cookie Consent**
   - Fixes annoying UX issue
   - Low effort

### Phase 2 (Short-term)
4. **Deploy Quick Calculate Widget**
   - Differentiating feature
   - Medium effort

5. **Expand Drug Database**
   - Add more drugs to formulary
   - Update dose calculator dropdown

### Phase 3 (Long-term)
6. **Add More Calculators**
   - Target 60+ to match DVMCalc
   - Focus on toxicology (24 calculators)

7. **Theme Toggle**
   - Light/dark mode option

---

## Key Differences from DVMCalc

| Feature | DVMReady (with components) | DVMCalc |
|---------|---------------------------|---------|
| Theme | Dark (modern) | Light (professional) |
| Study Resources | ✅ NAVLE prep | ❌ None |
| Exotic Animals | ✅ Yes | ❌ No |
| Unified Toxicity Suite | ✅ 6-in-1 | 24 separate |
| Persistent Weight | ✅ With ribbon | ✅ Yes |
| Quick Calculate | ✅ With widget | ✅ Yes |
| Drug Database | 300+ (with formulary) | 300+ |
| Cookie Handling | ✅ Improved | Basic |

---

## Browser Compatibility

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers (iOS Safari, Chrome Android)

---

## Notes for Developers

1. **All components are self-contained** - No external dependencies
2. **CSS is injected automatically** - No separate CSS files needed
3. **Uses localStorage/sessionStorage** - Respects user privacy
4. **Mobile responsive** - Works on all screen sizes
5. **Accessible** - Proper ARIA labels and keyboard navigation

---

## Customization

### Change Colors
Edit the CSS variables in each component:
```css
/* Primary color (teal) */
background: linear-gradient(135deg, #4ecdc4, #44a3aa);

/* Change to your brand color */
background: linear-gradient(135deg, #your-primary, #your-secondary);
```

### Change Position
```javascript
// Quick calculate widget position
const widget = new QuickCalculateWidget({
  position: 'bottom-left' // or 'bottom-right', 'top-left', 'top-right'
});
```

---

## Testing Checklist

- [ ] Weight ribbon appears on all calculator pages
- [ ] Weight persists when navigating between pages
- [ ] Quick calculate widget opens/closes correctly
- [ ] Drug calculations are accurate
- [ ] Cookie consent remembers choice
- [ ] Works on mobile devices
- [ ] No console errors
