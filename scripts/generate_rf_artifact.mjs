import { execSync } from 'node:child_process';
import path from 'node:path';

const scriptPath = path.join(process.cwd(), 'modules/startup-profit-prediction/python-reference/export_rf_tree.py');
console.log(`Executing real Python Random Forest exporter: ${scriptPath}`);
execSync(`python "${scriptPath}"`, { stdio: 'inherit' });
