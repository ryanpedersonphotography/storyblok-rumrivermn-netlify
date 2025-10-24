# Brand Social Proof - Storyblok Schema Setup

## Block: `brand_social_proof`

### Schema Configuration

**Block Name (Technical)**: `brand_social_proof`
**Display Name**: `Brand Social Proof`
**Component Group**: `Home Page Sections`

### Fields

1. **Brand Names** (`brands`)
   - Type: `Textarea`
   - Default Value:
     ```
     THE KNOT
     WEDDINGWIRE
     MARTHA STEWART
     MINNESOTA BRIDE
     ```
   - Description: `One brand name per line`
   - Required: `Yes`

2. **Quote Text** (`quote_text`)
   - Type: `Textarea`
   - Default Value: `Rum River Barn isn't just a venue—it's {highlight_1}. Their commitment to saying 'yes' to every couple's vision sets them apart as {highlight_2}.`
   - Description: `Main testimonial quote with {highlight_1} and {highlight_2} placeholders`
   - Required: `Yes`

3. **First Highlight** (`highlight_1`)
   - Type: `Text`
   - Default Value: `where dreams come to life`
   - Description: `First highlighted phrase (replaces {highlight_1})`
   - Required: `Yes`

4. **Second Highlight** (`highlight_2`)
   - Type: `Text`
   - Default Value: `Minnesota's most accommodating wedding destination`
   - Description: `Second highlighted phrase (replaces {highlight_2})`
   - Required: `Yes`

---

## Setup Instructions

### Manual Creation (Storyblok UI)

1. Navigate to **Storyblok** → **Block Library**
2. Click **+ New Block**
3. Enter Block Name: `brand_social_proof`
4. Enter Display Name: `Brand Social Proof`
5. Add fields as specified above
6. Save block

### Programmatic Creation (Management API)

See script below for automated creation via Storyblok Management API.
