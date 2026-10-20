import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import yaml from 'yaml';

const version = process.argv[2] ?? '18.0.01';
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'unifont-'));

execFileSync('bash', [path.resolve('rebuild-unifont.sh'), version, process.cwd()], {
    cwd: work,
    stdio: 'inherit',
});

const { Unifont: faces } = yaml.parse(fs.readFileSync('fonts.yaml', 'utf8'), {
    uniqueKeys: false,
});
const rebuilt = path.join(work, `unifont-${version}`, 'font');
for (const face of faces) {
    for (const format of ['woff2', 'otf', 'ttf']) {
        const source = fs.readdirSync(rebuilt, { recursive: true }).find((file) =>
            file.endsWith(`/unifont.${format === 'ttf' ? 'ttf' : 'otf'}`),
        );
        const output = face[format].replace(/unifont-[\d.]+/, `unifont-${version}`);
        execFileSync('pyftsubset', [
            path.join(rebuilt, source),
            `--output-file=${output}`,
            ...(format === 'woff2' ? ['--flavor=woff2'] : []),
            `--unicodes=${face['unicode-range']}`,
            '--layout-features=*',
            '--name-IDs=*',
            '--name-legacy',
            '--name-languages=*',
            '--notdef-outline',
            '--desubroutinize',
        ], { stdio: 'inherit' });
    }
}
