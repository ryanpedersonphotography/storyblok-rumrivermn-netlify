import { execSync } from 'node:child_process';
const files = [
  'src/app/layout.tsx',
  'src/app/(migration)/layout.tsx',
  'src/app/(site)/layout.tsx',
  'src/components/primitive/HeroPrimitive.tsx',
];
const msg = execSync('git log -1 --pretty=%B').toString();
if (!/migrate\(|fix\(|chore\(css\):/.test(msg)) {
  const changed = execSync('git diff --name-only --cached').toString().split('\n').filter(Boolean);
  const hit = changed.filter(f => files.includes(f));
  if (hit.length) {
    console.error('Protected files changed in a non-migration commit:\n' + hit.join('\n'));
    process.exit(1);
  }
}
