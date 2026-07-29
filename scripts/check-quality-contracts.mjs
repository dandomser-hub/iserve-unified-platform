import { readFile } from 'node:fs/promises';
import process from 'node:process';

const router = await readFile('src/app/router.tsx', 'utf8');
const app = await readFile('src/app/App.tsx', 'utf8');
const appShell = await readFile('src/layouts/AppShell.tsx', 'utf8');
const disclosure = await readFile('src/config/prototype.ts', 'utf8');

const failures = [];
const staticPageImports = router.match(/from ['"]@\/modules\//g) ?? [];
const lazyRoutePattern = /lazyNamed\(\(\) => import\(['"]@\/([^'"]+)['"]\), ['"]([^'"]+)['"]\)/g;
const lazyPageDeclarations = [...router.matchAll(lazyRoutePattern)];

if (staticPageImports.length > 0) {
  failures.push('Router contains static imports from src/modules.');
}
if (lazyPageDeclarations.length < 40) {
  failures.push(`Expected at least 40 lazy route declarations; found ${lazyPageDeclarations.length}.`);
}
for (const [, modulePath, exportName] of lazyPageDeclarations) {
  const moduleSource = await readFile(`src/${modulePath}.tsx`, 'utf8');
  const exportedDeclaration = new RegExp(`export\\s+(?:function|const|class)\\s+${exportName}\\b`);
  if (!exportedDeclaration.test(moduleSource)) {
    failures.push(`Lazy route ${modulePath} does not export ${exportName}.`);
  }
}
if (!app.includes('<Suspense') || !app.includes('<RouteLoadingFallback')) {
  failures.push('Application-level Suspense fallback is missing.');
}
if (!appShell.includes('<PrototypeDisclosure')) {
  failures.push('Authenticated application shell is missing the prototype disclosure.');
}
if (!router.includes("publicPrototypePage(<RoleSelectorPage />)") || !router.includes("publicPrototypePage(<DocumentVerificationPage />)")) {
  failures.push('One or more public prototype routes are missing the prototype disclosure.');
}
for (const requiredPhrase of [
  'Fictional data',
  'No production authentication',
  'No persistent database',
  'No official submission or fund processing',
]) {
  if (!disclosure.includes(requiredPhrase)) {
    failures.push(`Prototype disclosure is missing: ${requiredPhrase}`);
  }
}

if (failures.length > 0) {
  failures.forEach(failure => console.error(`Quality contract failed: ${failure}`));
  process.exit(1);
}

console.log(`Quality contracts passed: ${lazyPageDeclarations.length} route screens are lazy loaded and prototype limitations are disclosed.`);
