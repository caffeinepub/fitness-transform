const fs = require('fs');
const path = require('path');

console.log('[Validate] Starting manifest validation...');

const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');
const publicDir = path.join(__dirname, '..', 'public');

// Check if manifest.json exists
if (!fs.existsSync(manifestPath)) {
  console.error('[Validate] ERROR: manifest.json not found at:', manifestPath);
  process.exit(1);
}

console.log('[Validate] Found manifest.json at:', manifestPath);

// Read and parse manifest.json
let manifest;
try {
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  manifest = JSON.parse(manifestContent);
  console.log('[Validate] Manifest parsed successfully');
} catch (error) {
  console.error('[Validate] ERROR: Failed to parse manifest.json');
  console.error('[Validate] Parse error:', error.message);
  process.exit(1);
}

// Validate required fields
const requiredFields = [
  'name',
  'short_name',
  'start_url',
  'display',
  'theme_color',
  'background_color',
  'icons'
];

console.log('[Validate] Checking required fields...');
const missingFields = [];

for (const field of requiredFields) {
  if (!manifest[field]) {
    missingFields.push(field);
    console.error('[Validate] ERROR: Missing required field:', field);
  } else {
    console.log('[Validate] ✓ Found required field:', field);
  }
}

if (missingFields.length > 0) {
  console.error('[Validate] ERROR: Manifest is missing required fields:', missingFields.join(', '));
  process.exit(1);
}

// Validate icons array
if (!Array.isArray(manifest.icons)) {
  console.error('[Validate] ERROR: icons field must be an array');
  process.exit(1);
}

if (manifest.icons.length === 0) {
  console.error('[Validate] ERROR: icons array is empty');
  process.exit(1);
}

console.log('[Validate] Found', manifest.icons.length, 'icon(s) in manifest');

// Validate icon files exist
const missingIcons = [];

for (const icon of manifest.icons) {
  if (!icon.src) {
    console.error('[Validate] ERROR: Icon entry missing src field:', JSON.stringify(icon));
    missingIcons.push('(missing src field)');
    continue;
  }

  // Remove leading slash and resolve path
  const iconSrc = icon.src.startsWith('/') ? icon.src.slice(1) : icon.src;
  const iconPath = path.join(publicDir, iconSrc);

  console.log('[Validate] Checking icon file:', iconSrc);

  if (!fs.existsSync(iconPath)) {
    console.error('[Validate] ERROR: Icon file not found:', iconPath);
    missingIcons.push(icon.src);
  } else {
    console.log('[Validate] ✓ Icon file exists:', iconSrc);
    
    // Check file size
    const stats = fs.statSync(iconPath);
    console.log('[Validate]   File size:', Math.round(stats.size / 1024), 'KB');
  }
}

if (missingIcons.length > 0) {
  console.error('[Validate] ERROR: Missing icon files:', missingIcons.join(', '));
  console.error('[Validate] Please ensure all icon files referenced in manifest.json exist in the public directory');
  process.exit(1);
}

console.log('[Validate] ✓ All manifest validations passed successfully');
console.log('[Validate] Manifest summary:');
console.log('[Validate]   Name:', manifest.name);
console.log('[Validate]   Short name:', manifest.short_name);
console.log('[Validate]   Start URL:', manifest.start_url);
console.log('[Validate]   Display mode:', manifest.display);
console.log('[Validate]   Theme color:', manifest.theme_color);
console.log('[Validate]   Background color:', manifest.background_color);
console.log('[Validate]   Icons:', manifest.icons.length);

process.exit(0);
