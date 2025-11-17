const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');

// Function to recursively get all .tsx files
function getAllTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to remove version numbers from imports
function fixImports(content) {
  // Fix class-variance-authority
  content = content.replace(/class-variance-authority@[\d.]+/g, 'class-variance-authority');
  
  // Fix @radix-ui imports
  content = content.replace(/@radix-ui\/([\w-]+)@[\d.]+/g, '@radix-ui/$1');
  
  // Fix lucide-react
  content = content.replace(/lucide-react@[\d.]+/g, 'lucide-react');
  
  // Fix react-day-picker
  content = content.replace(/react-day-picker@[\d.]+/g, 'react-day-picker');
  
  // Fix embla-carousel-react
  content = content.replace(/embla-carousel-react@[\d.]+/g, 'embla-carousel-react');
  
  // Fix sonner
  content = content.replace(/sonner@[\d.]+/g, 'sonner');
  
  // Fix vaul
  content = content.replace(/vaul@[\d.]+/g, 'vaul');
  
  return content;
}

// Get all .tsx files
const files = getAllTsxFiles(componentsDir);

console.log(`Found ${files.length} TypeScript files`);

let fixedCount = 0;

// Process each file
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const fixedContent = fixImports(content);
  
  if (content !== fixedContent) {
    fs.writeFileSync(file, fixedContent, 'utf8');
    console.log(`Fixed: ${path.relative(__dirname, file)}`);
    fixedCount++;
  }
});

console.log(`\nFixed ${fixedCount} files`);
console.log('Import fixes complete!');
