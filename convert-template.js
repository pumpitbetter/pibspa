const fs = require('fs');

// Read the file
const filePath = './app/db/template-531-hypertrophy.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Convert reps to repRange
content = content.replace(/reps: (\d+),/g, (match, reps) => {
  return `repRange: { min: ${reps}, max: ${reps} },`;
});

// Add progression control based on patterns
const lines = content.split('\n');
const convertedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  convertedLines.push(line);
  
  // Look for repRange lines that need progression control
  if (line.includes('repRange: { min:') && line.endsWith(',')) {
    const nextLine = lines[i + 1];
    const prevLines = lines.slice(Math.max(0, i - 10), i);
    
    // Find the order and amrep context
    let order = null;
    let hasAmrep = false;
    
    for (let j = prevLines.length - 1; j >= 0; j--) {
      if (prevLines[j].includes('order:')) {
        const orderMatch = prevLines[j].match(/order: (\d+),/);
        if (orderMatch) {
          order = parseInt(orderMatch[1]);
          break;
        }
      }
    }
    
    // Check if this is an AMRAP set (has amrep: true after repRange)
    if (nextLine && nextLine.includes('amrep: true')) {
      hasAmrep = true;
    }
    
    // Determine progression control based on pattern
    if (hasAmrep) {
      // AMRAP sets get progression enabled with progressionSets
      convertedLines.push('    progressionEnabled: true, // Final AMRAP set triggers progression');
      convertedLines.push('    progressionSets: [3], // Only this set counts for progression');
    } else if (line.includes('min: 10, max: 10')) {
      // 10-rep sets are hypertrophy assistance work
      convertedLines.push('    progressionEnabled: false, // Hypertrophy assistance work does not trigger progression');
    } else if (order === 1 || order === 2) {
      // Main work sets (orders 1 and 2)
      convertedLines.push('    progressionEnabled: true, // Main 5/3/1 sets can trigger progression');
    } else if (order === 3) {
      // Order 3 non-AMRAP sets
      convertedLines.push('    progressionEnabled: false, // Not the final set');
    }
  }
}

// Write the converted content
fs.writeFileSync(filePath, convertedLines.join('\n'));
console.log('Template conversion completed!');
