// build.js - Script to create production build
const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Files and directories to copy to dist
const filesToCopy = [
    'src',
    'package.json'
];

// Files to exclude during copy
const excludePatterns = [
    'node_modules',
    '.git',
    '.env',
    '*.log',
    'dist'
];

function shouldExclude(filePath) {
    return excludePatterns.some(pattern => 
        filePath.includes(pattern) || 
        path.basename(filePath).match(pattern.replace('*', '.*'))
    );
}

function copyRecursiveSync(src, dest) {
    if (shouldExclude(src)) {
        return;
    }
    
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Clean dist directory first
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy files to dist
filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(srcPath)) {
        copyRecursiveSync(srcPath, destPath);
        console.log(`✓ Copied ${file} to dist/`);
    }
});

// Create production package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const prodPackageJson = {
    ...packageJson,
    scripts: {
        start: "node src/app.js",
        dev: "nodemon src/app.js"
    },
    devDependencies: {} // Remove dev dependencies for production
};

fs.writeFileSync(
    path.join(distDir, 'package.json'), 
    JSON.stringify(prodPackageJson, null, 2)
);

// Create .env.example in dist
const envExample = `# Environment Variables
JWT_SECRET=your-jwt-secret-here
MONGODB_URI=your-mongodb-connection-string
PORT=3000
NODE_ENV=production
`;

fs.writeFileSync(path.join(distDir, '.env.example'), envExample);

console.log('✓ Build completed successfully!');
console.log('✓ Production files are ready in ./dist directory');
console.log('✓ Don\'t forget to:');
console.log('  - Copy your .env file to dist/ directory');
console.log('  - Run npm install in dist/ directory');
console.log('  - Update your MongoDB connection string for production');