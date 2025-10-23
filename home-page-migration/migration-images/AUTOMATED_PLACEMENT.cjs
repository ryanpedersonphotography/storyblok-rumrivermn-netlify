#!/usr/bin/env node

/**
 * Automated Image Placement Recommendations
 * Analyzes migrated images and provides specific placement instructions
 */

const fs = require('fs');
const path = require('path');

// Critical paths that must be preserved exactly
const CRITICAL_PATHS = [
  'barn-exterior-full-deck-view-evening.jpg',
  'barn-interior-ceiling-beams-lighting.jpg', 
  'property-vineyard-rows-landscape.jpg',
  'details-swing-rustic-romance.jpg',
  'barn-exterior-deck-swing-golden-hour.jpg',
  'barn-interior-exposed-beams-chandeliers.jpg',
  'barn-exterior-entrance-lighting-view.jpg'
];

// Wedding couples that are actively referenced in code
const ACTIVE_COUPLES = [
  'anthony-and-linnea',
  'emily-and-barron-nixon',
  'erin-kate'
];

class ImageMigrationAnalyzer {
  constructor(migrationPath) {
    this.migrationPath = migrationPath;
    this.recommendations = [];
  }

  analyze() {
    console.log('🔍 Analyzing migration folder for automated placement...\n');
    
    this.analyzeVenueImages();
    this.analyzeWeddingPhotos();
    this.analyzeBlogImages();
    this.analyzeOtherCategories();
    
    this.generateReport();
  }

  analyzeVenueImages() {
    const venuePath = path.join(this.migrationPath, 'venue');
    if (!fs.existsSync(venuePath)) return;

    const files = fs.readdirSync(venuePath);
    console.log(`📁 VENUE IMAGES: ${files.length} files`);

    files.forEach(file => {
      const isCritical = CRITICAL_PATHS.includes(file);
      const priority = isCritical ? 'CRITICAL' : 'HIGH';
      
      this.recommendations.push({
        source: `migration/venue/${file}`,
        target: `public/images/venue/${file}`,
        priority: priority,
        action: 'COPY_EXACT_PATH',
        reason: isCritical ? 'Referenced in CSS/Sanity data' : 'Venue marketing image',
        validation: isCritical ? 'Test CSS backgrounds and Sanity content' : 'Verify in venue galleries'
      });
    });
  }

  analyzeWeddingPhotos() {
    const weddingPath = path.join(this.migrationPath, 'weddings', 'by-couple');
    if (!fs.existsSync(weddingPath)) return;

    const couples = fs.readdirSync(weddingPath);
    console.log(`💒 WEDDING PHOTOS: ${couples.length} couples`);

    couples.forEach(couple => {
      const couplePath = path.join(weddingPath, couple);
      if (!fs.statSync(couplePath).isDirectory()) return;

      const files = fs.readdirSync(couplePath);
      const isActive = ACTIVE_COUPLES.includes(couple);
      const priority = isActive ? 'HIGH' : 'MEDIUM';

      files.forEach(file => {
        this.recommendations.push({
          source: `migration/weddings/by-couple/${couple}/${file}`,
          target: `public/wedding-photos/${couple}/${file}`,
          priority: priority,
          action: 'COPY_EXACT_STRUCTURE',
          reason: isActive ? 'Referenced in realWeddings.js' : 'Portfolio content',
          validation: 'Test wedding gallery functionality'
        });
      });
    });
  }

  analyzeBlogImages() {
    const blogPath = path.join(this.migrationPath, 'blog-images');
    if (!fs.existsSync(blogPath)) return;

    const couples = fs.readdirSync(blogPath);
    console.log(`📝 BLOG IMAGES: ${couples.length} couples`);

    couples.forEach(couple => {
      const couplePath = path.join(blogPath, couple);
      if (!fs.statSync(couplePath).isDirectory()) return;

      const files = fs.readdirSync(couplePath);
      
      files.forEach(file => {
        this.recommendations.push({
          source: `migration/blog-images/${couple}/${file}`,
          target: `public/real-wedding-blogs/${couple}/${file}`,
          priority: 'MEDIUM',
          action: 'COPY_WITH_OPTIMIZATION',
          reason: 'Blog post thumbnails and featured images',
          validation: 'Test blog post image loading'
        });
      });
    });
  }

  analyzeOtherCategories() {
    const categories = ['bridal-suite', 'reception', 'historical'];
    
    categories.forEach(category => {
      const categoryPath = path.join(this.migrationPath, category);
      if (!fs.existsSync(categoryPath)) return;

      const files = fs.readdirSync(categoryPath);
      console.log(`🏛️ ${category.toUpperCase()}: ${files.length} files`);

      files.forEach(file => {
        this.recommendations.push({
          source: `migration/${category}/${file}`,
          target: `public/images/${category}/${file}`,
          priority: 'MEDIUM',
          action: 'COPY_WITH_OPTIMIZATION',
          reason: `${category} feature content`,
          validation: `Test ${category} page displays`
        });
      });
    });
  }

  generateReport() {
    console.log('\n📊 AUTOMATED PLACEMENT RECOMMENDATIONS\n');
    
    // Group by priority
    const critical = this.recommendations.filter(r => r.priority === 'CRITICAL');
    const high = this.recommendations.filter(r => r.priority === 'HIGH');
    const medium = this.recommendations.filter(r => r.priority === 'MEDIUM');

    console.log(`🚨 CRITICAL (${critical.length}): Must be placed exactly as specified`);
    critical.forEach(rec => {
      console.log(`   ${rec.source} → ${rec.target}`);
      console.log(`   Reason: ${rec.reason}`);
      console.log('');
    });

    console.log(`⚡ HIGH PRIORITY (${high.length}): Important for site functionality`);
    high.slice(0, 5).forEach(rec => {
      console.log(`   ${rec.source} → ${rec.target}`);
    });
    if (high.length > 5) console.log(`   ... and ${high.length - 5} more`);

    console.log(`\n📝 MEDIUM PRIORITY (${medium.length}): Feature and content images`);
    console.log(`   Can be migrated in batches, optimize for web performance`);

    // Generate automated script
    this.generateMigrationScript();
  }

  generateMigrationScript() {
    const scriptContent = `#!/bin/bash
# Automated Image Migration Script
# Generated by AUTOMATED_PLACEMENT.js

echo "🚀 Starting automated image migration..."

# Create target directories
mkdir -p public/images/{venue,bridal-suite,reception,historical}
mkdir -p public/wedding-photos
mkdir -p public/real-wedding-blogs

# CRITICAL FILES FIRST (CSS/Sanity dependencies)
echo "🚨 Migrating critical venue images..."
${this.recommendations
  .filter(r => r.priority === 'CRITICAL')
  .map(r => `cp "${r.source}" "${r.target}"`)
  .join('\n')}

# HIGH PRIORITY - Active wedding photos
echo "⚡ Migrating high priority wedding photos..."
${this.recommendations
  .filter(r => r.priority === 'HIGH' && r.source.includes('weddings'))
  .slice(0, 10)
  .map(r => `cp "${r.source}" "${r.target}"`)
  .join('\n')}

# VENUE IMAGES
echo "🏛️ Migrating venue images..."
cp -r migration/venue/* public/images/venue/

echo "✅ Critical migration complete!"
echo "🔍 Run validation tests before proceeding with medium priority files."
`;

    fs.writeFileSync(path.join(this.migrationPath, 'migrate-critical.sh'), scriptContent);
    console.log('\n📜 Generated migration/migrate-critical.sh script for critical files');
  }
}

// Run analysis if called directly
if (require.main === module) {
  const migrationPath = process.argv[2] || './migration';
  const analyzer = new ImageMigrationAnalyzer(migrationPath);
  analyzer.analyze();
}

module.exports = ImageMigrationAnalyzer;