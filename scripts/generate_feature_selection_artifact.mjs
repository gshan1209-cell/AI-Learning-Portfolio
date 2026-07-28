import { execSync } from 'node:child_process';
import path from 'node:path';

const scriptPath = path.join(process.cwd(), 'modules/feature-selection/python-reference/scripts/export_feature_selection.py');
console.log(`Executing real Python Feature Selection exporter: ${scriptPath}`);
execSync(`python "${scriptPath}"`, { stdio: 'inherit' });
