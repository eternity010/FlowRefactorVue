const fs = require('fs');
const path = require('path');

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyFileSync(src, dest) {
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${src} -> ${dest}`);
}

function resolveMermaidDist() {
  const cwd = process.cwd();
  const candidateA = path.join(cwd, 'node_modules', 'mermaid', 'dist', 'mermaid.min.js');
  if (fs.existsSync(candidateA)) return candidateA;
  try {
    // Fallback attempt via require.resolve in case package layout changes
    const resolved = require.resolve('mermaid/dist/mermaid.min.js');
    if (fs.existsSync(resolved)) return resolved;
  } catch (e) {
    // ignore
  }
  return null;
}

function main() {
  const src = resolveMermaidDist();
  if (!src) {
    console.error('Cannot locate mermaid/dist/mermaid.min.js. Ensure mermaid@10.6.1 is installed.');
    process.exit(1);
  }
  const destDir = path.join(process.cwd(), 'static');
  const dest = path.join(destDir, 'mermaid.min.js');
  ensureDirectoryExists(destDir);
  copyFileSync(src, dest);
}

main();


