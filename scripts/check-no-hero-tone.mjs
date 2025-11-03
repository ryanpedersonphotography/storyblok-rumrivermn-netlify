import { execSync } from 'node:child_process';

const cmd = `rg -n --hidden --glob '!.git' --glob '!node_modules' --glob '!src/styles/tokens/theme.css' '\\-\\-tone-hero-(start|mid|end|fg)' || true`;
const out = execSync(cmd, { stdio: 'pipe', encoding: 'utf8' }).trim();
if (out) {
  console.error('❌ Found deprecated hero tone tokens:\n' + out);
  process.exit(1);
} else {
  console.log('✅ OK: no deprecated hero tone tokens found.');
}
