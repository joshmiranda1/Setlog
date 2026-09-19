// Copies the Workout Guide library (../workout-guide-main) into the client:
//   - trimmed metadata  -> src/data/workout-guide.json
//   - SVG frames        -> public/workout-guide/<slug>/frame-N.svg
//   - license files     -> public/workout-guide/
// Run with `npm run sync:guide` (from client/) after updating workout-guide-main.
// Artwork is CC BY-SA 4.0 (Bryl Lim, derived in part from Everkinetic); see public/workout-guide/ATTRIBUTION.md.
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const clientDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.resolve(process.argv[2] ?? path.join(clientDir, '..', 'workout-guide-main', 'packages', 'workout-guide'));
const assetsOut = path.join(clientDir, 'public', 'workout-guide');
const dataOut = path.join(clientDir, 'src', 'data', 'workout-guide.json');

const manifest = JSON.parse(await readFile(path.join(sourceDir, 'manifest.json'), 'utf8'));

await rm(assetsOut, { recursive: true, force: true });
await mkdir(assetsOut, { recursive: true });

const data = [];
for (const ex of manifest) {
  const frames = ex.frames.filter((f) => f.format === 'svg').sort((a, b) => a.index - b.index);
  await mkdir(path.join(assetsOut, ex.slug), { recursive: true });
  for (const f of frames) {
    await copyFile(path.join(sourceDir, f.path), path.join(assetsOut, ex.slug, `frame-${f.index}.svg`));
  }
  data.push({
    slug: ex.slug,
    name: ex.name,
    equipment: ex.equipment,
    type: ex.exerciseType,
    primary: ex.primaryMuscle,
    secondary: ex.secondaryMuscles,
    stretch: ex.isStretch,
    frames: frames.length,
    credit: { creator: ex.attribution.creator, url: ex.attribution.creatorUrl, license: ex.attribution.license },
  });
}

for (const file of ['LICENSE-ASSETS', 'ATTRIBUTION.md', 'LICENSES.md']) {
  await copyFile(path.join(sourceDir, file), path.join(assetsOut, file));
}

data.sort((a, b) => a.name.localeCompare(b.name));
await mkdir(path.dirname(dataOut), { recursive: true });
await writeFile(dataOut, JSON.stringify(data));
console.log(`Synced ${data.length} exercises (${data.reduce((n, e) => n + e.frames, 0)} frames).`);
