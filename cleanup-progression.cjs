const fs = require('fs');

// Read the file
const filePath = './app/db/template-531-hypertrophy.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Remove old progression blocks
// Pattern: progression: { ... },
content = content.replace(/\s*progression: \{[^}]*\},?\s*/g, '');

// Write the cleaned content
fs.writeFileSync(filePath, content);
console.log('Progression cleanup completed!');
