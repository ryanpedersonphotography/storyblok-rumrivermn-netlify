# AI Assistant Instructions for Image Migration

## 🎯 Quick Start for Incoming AI

### Step 1: Read These Files First
1. **MIGRATION_GUIDE.md** - Complete placement guidelines
2. **CODE_REFERENCES.md** - Critical path dependencies  
3. **venue/VENUE_METADATA.json** - Venue image specifications
4. **weddings/WEDDINGS_METADATA.json** - Wedding photo structure

### Step 2: Run Automated Analysis
```bash
node migration/AUTOMATED_PLACEMENT.js
```
This will analyze all migrated images and provide specific placement recommendations.

### Step 3: Execute Critical Migrations First
```bash
chmod +x migration/migrate-critical.sh
./migration/migrate-critical.sh
```
This handles the most important files that break the site if missing.

## 🚨 CRITICAL - Must Do First

### These paths MUST be preserved exactly:
```
migration/venue/barn-exterior-full-deck-view-evening.jpg 
→ public/images/venue/barn-exterior-full-deck-view-evening.jpg

migration/venue/barn-interior-ceiling-beams-lighting.jpg
→ public/images/venue/barn-interior-ceiling-beams-lighting.jpg

migration/venue/property-vineyard-rows-landscape.jpg
→ public/images/venue/property-vineyard-rows-landscape.jpg

migration/venue/details-swing-rustic-romance.jpg
→ public/images/venue/details-swing-rustic-romance.jpg

migration/venue/barn-exterior-deck-swing-golden-hour.jpg
→ public/images/venue/barn-exterior-deck-swing-golden-hour.jpg
```

**Why Critical:** These are hardcoded in CSS and break the site layout if missing.

### Wedding Photo Structure MUST be preserved:
```
migration/weddings/by-couple/anthony-and-linnea/001.jpg
→ public/wedding-photos/anthony-and-linnea/001.jpg

migration/weddings/by-couple/anthony-and-linnea/002.jpg  
→ public/wedding-photos/anthony-and-linnea/002.jpg
```

**Why Critical:** The `realWeddings.js` data structure depends on this exact path pattern.

## ⚡ High Priority (Day 1)

1. **All venue images** → `public/images/venue/`
2. **Featured couples** → `public/wedding-photos/[couple-name]/`
   - anthony-and-linnea (109 files)
   - emily-and-barron-nixon (24 files) 
   - erin-kate (19 files)

## 📋 Validation Commands

After each migration step:
```bash
# Check for broken CSS backgrounds
grep -r "url('/images/venue/" src/
find public/images/venue/ -name "*.jpg" | head -10

# Verify wedding photo structure  
ls public/wedding-photos/anthony-and-linnea/ | head -5

# Test site locally
npm run dev
```

## 🔧 Smart Placement Logic

### Use filename patterns to determine placement:
- `barn-*` → `public/images/venue/`
- `property-*` → `public/images/venue/`  
- `details-*` → `public/images/venue/`
- `dsc_*` → `public/images/bridal-suite/` or `public/images/reception/`
- Sequential numbers (001.jpg) → `public/wedding-photos/[couple]/`
- `[couple]-wedding-*` → `public/real-wedding-blogs/[couple]/`

### Quality gates before placement:
- Minimum 800px width for venue images
- Compress if over 2MB file size
- Convert to WebP if browser support needed
- Verify file isn't corrupted

## 🚦 Migration Priority Matrix

| Files | Priority | Risk | Validation Required |
|-------|----------|------|-------------------|
| CSS-referenced venue images | CRITICAL | HIGH | CSS background test |
| Active couple wedding photos | HIGH | MEDIUM | Gallery functionality |
| Blog images | MEDIUM | LOW | Blog page test |
| Bridal/reception images | MEDIUM | LOW | Feature page test |
| Legacy archives | LOW | NONE | Optional |

## 🎛️ Automated Helpers Available

### Image Analysis
```bash
node migration/AUTOMATED_PLACEMENT.js
# Analyzes all images and provides specific placement recommendations
```

### Batch Operations
```bash
# Critical files only
./migration/migrate-critical.sh

# Venue images
cp -r migration/venue/* public/images/venue/

# Wedding photos (by couple)
cp -r migration/weddings/by-couple/* public/wedding-photos/
```

### Validation Checks
```bash
# Find missing critical images
node -e "
const critical = ['barn-exterior-full-deck-view-evening.jpg'];
critical.forEach(f => {
  if (!require('fs').existsSync(\`public/images/venue/\${f}\`)) {
    console.log('MISSING:', f);
  }
});
"
```

## ⚠️ Common Pitfalls to Avoid

1. **DO NOT** change filenames in venue/ folder - CSS depends on exact names
2. **DO NOT** alter wedding photo numbering (001.jpg, 002.jpg) - data structure depends on it
3. **DO NOT** migrate all legacy files at once - will impact performance
4. **DO NOT** convert critical JPG files to WebP only - maintain JPG fallbacks
5. **DO NOT** skip validation steps - broken images break user experience

## 🎯 Success Criteria

- [ ] Site loads without broken images  
- [ ] CSS backgrounds display correctly
- [ ] Wedding galleries function properly
- [ ] Blog images load correctly
- [ ] Page load time under 3 seconds
- [ ] No 404 errors in browser console

## 📞 If You Get Stuck

1. Check the metadata JSON files for specific guidance
2. Run `node migration/AUTOMATED_PLACEMENT.js` for fresh analysis
3. Focus on CRITICAL files first - site must work before optimization
4. Test frequently with `npm run dev`
5. Refer to CODE_REFERENCES.md for exact path requirements

Remember: **Working site with basic images > Perfect optimization with broken site**