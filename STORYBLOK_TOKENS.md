# Storyblok Access Tokens - Single Source of Truth

## Space Information
- **Space Name**: rum-river-mn  
- **Space ID**: 288003424841711

## Access Tokens (Read-Only)

### 1. Public Token
- **Token**: `tJCdp1QyfInsvreqnI2gLQtt`
- **Name**: publictoken
- **Type**: Public
- **Access**: Published content only
- **Use Case**: Production websites, live content
- **API**: Content Delivery API (`https://api.storyblok.com/v2/cdn/`)
- **Version**: `version=published`
- **Authentication**: Token in URL params, no headers needed

### 2. Preview Token  
- **Token**: `AcBamY8QEHeF7Wid0UOgcAtt`
- **Name**: previewtoken
- **Type**: Preview
- **Access**: Both draft AND published content
- **Use Case**: Development, staging, content preview
- **API**: Content Delivery API (`https://api.storyblok.com/v2/cdn/`)
- **Version**: `version=draft` or `version=published`
- **Authentication**: Token in URL params, no headers needed

### 3. Asset Token
- **Token**: `waTYk2VUxFymCMUMcGXQRwtt`
- **Name**: assettoken  
- **Type**: Asset
- **Access**: Private assets only
- **Use Case**: Accessing private/protected images and files
- **API**: Asset service
- **Authentication**: Token-based asset URLs

### 4. Theme Token
- **Token**: `np9NPdI2NaJiXf7DmeYB8Qtt`
- **Name**: themetoken
- **Type**: Theme  
- **Access**: Theme development resources
- **Use Case**: Theme development and customization
- **API**: Theme-specific endpoints

## Usage Recommendations

### For `/beta-cms` Route (Current Implementation)
**Use**: Public Token (`tJCdp1QyfInsvreqnI2gLQtt`)
**Why**: Fetching published content for live website
**Implementation**:
```javascript
const url = `https://api.storyblok.com/v2/cdn/stories/home?token=tJCdp1QyfInsvreqnI2gLQtt&version=published`
```

### For Development/Staging  
**Use**: Preview Token (`AcBamY8QEHeF7Wid0UOgcAtt`)
**Why**: See draft content and unpublished changes
**Implementation**:
```javascript
const url = `https://api.storyblok.com/v2/cdn/stories/home?token=AcBamY8QEHeF7Wid0UOgcAtt&version=draft`
```

### For Private Images
**Use**: Asset Token (`waTYk2VUxFymCMUMcGXQRwtt`)
**Why**: Access protected assets
**Implementation**: Applied to asset URLs automatically

### For Theme Development
**Use**: Theme Token (`np9NPdI2NaJiXf7DmeYB8Qtt`)
**Why**: Theme customization and development
**Implementation**: Theme-specific API calls

## Security Notes
- All tokens are read-only (safe for frontend use)
- Public and Preview tokens can be used in client-side code
- Asset and Theme tokens have specific use cases
- No authentication headers required for CDN API
- Store in environment variables for production

## Current Environment Setup
- **Production**: Use Public Token
- **Development**: Can use Preview Token to see drafts
- **Feature Flag**: `FEATURE_CMS_IMAGES=0` (images disabled for safety)