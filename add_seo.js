import fs from 'fs';
import path from 'path';

const pages = {
  'HomePage.tsx': 'Youth Climate Network',
  'AboutPage.tsx': 'About Us',
  'AdvocacyPage.tsx': 'Advocacy',
  'OurWorkPage.tsx': 'Our Work',
  'ImpactPage.tsx': 'Impact',
  'MediaPage.tsx': 'Media',
  'GetInvolvedPage.tsx': 'Get Involved',
  'DonatePage.tsx': 'Donate',
  'ContactPage.tsx': 'Contact',
  'TermsPage.tsx': 'Terms of Service',
  'PrivacyPage.tsx': 'Privacy Policy',
  'OurWorkDetailsPage.tsx': 'Project Details',
  'NotFoundPage.tsx': '404 - Not Found'
};

const dir = './src/app/components';

for (const [file, title] of Object.entries(pages)) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Add import
  if (!content.includes("import { SEO }")) {
    const importMatch = content.match(/^import .*?;$/m);
    if (importMatch) {
      content = content.replace(/^import .*?;$/m, `${importMatch[0]}\nimport { SEO } from './ui/SEO';`);
    } else {
      content = `import { SEO } from './ui/SEO';\n` + content;
    }
  }

  // Add component
  // Find the main export function return
  const functionName = file.replace('.tsx', '');
  const regex = new RegExp(`export function ${functionName}\\(.*?\\).*?\\{[\\s\\S]*?return \\(\\s*<([a-zA-Z]+)([^>]*)>`, 'm');
  
  const match = content.match(regex);
  if (match) {
    const fullMatch = match[0];
    const replacement = fullMatch + `\n      <SEO title="${title}" />`;
    if (!content.includes(`<SEO title="${title}"`)) {
       content = content.replace(fullMatch, replacement);
    }
  } else {
     // fallback
     const fallbackRegex = new RegExp(`export default function ${functionName}\\(.*?\\).*?\\{[\\s\\S]*?return \\(\\s*<([a-zA-Z]+)([^>]*)>`, 'm');
     const fbMatch = content.match(fallbackRegex);
     if (fbMatch) {
        const fullMatch = fbMatch[0];
        const replacement = fullMatch + `\n      <SEO title="${title}" />`;
        if (!content.includes(`<SEO title="${title}"`)) {
           content = content.replace(fullMatch, replacement);
        }
     } else {
        // Just find the first return after export
        const anyRegex = new RegExp(`export (default )?function .*?\\{[\\s\\S]*?return \\(\\s*<([a-zA-Z]+)([^>]*)>`, 'm');
        const anyMatch = content.match(anyRegex);
        if (anyMatch) {
            const fullMatch = anyMatch[0];
            const replacement = fullMatch + `\n      <SEO title="${title}" />`;
            if (!content.includes(`<SEO title="${title}"`)) {
               content = content.replace(fullMatch, replacement);
            }
        }
     }
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
}
