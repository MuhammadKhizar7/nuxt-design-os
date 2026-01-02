
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_PRODUCT = path.resolve(PROJECT_ROOT, 'product');
const COMPONENTS_ROOT = path.resolve(PROJECT_ROOT, 'app/components');
const OUTPUT_DIR = path.resolve(PROJECT_ROOT, 'product-plan');
const ZIP_OUTPUT = path.resolve(PROJECT_ROOT, 'public/product-plan.zip');

// Helper to read file safely
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (e) {
        return null;
    }
}

// Helper to write file ensuring dir exists
function writeFile(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content);
}

// Helper to copy directory
function copyDir(src, dest, transformFn) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath, transformFn);
        } else {
            let content = fs.readFileSync(srcPath);
            if (transformFn && (entry.name.endsWith('.vue') || entry.name.endsWith('.ts'))) {
                content = Buffer.from(transformFn(content.toString(), entry.name));
            }
            fs.writeFileSync(destPath, content);
        }
    }
}

async function main() {
    console.log('Starting export generation...');

    // 1. Gather Info
    const overview = readFile(path.join(PUBLIC_PRODUCT, 'product-overview.md')) || '';
    const roadmap = readFile(path.join(PUBLIC_PRODUCT, 'product-roadmap.md')) || '';

    // Parse sections from roadmap or directory structure
    const sectionsDir = path.join(PUBLIC_PRODUCT, 'sections');
    const sectionIds = fs.existsSync(sectionsDir) ? fs.readdirSync(sectionsDir).filter(name => fs.statSync(path.join(sectionsDir, name)).isDirectory()) : [];

    console.log(`Found sections: ${sectionIds.join(', ')}`);

    // 2. Create Directory Structure
    const dirs = [
        'prompts',
        'instructions/incremental',
        'design-system',
        'data-model',
        'shell/components',
        'sections'
    ];
    dirs.forEach(d => fs.mkdirSync(path.join(OUTPUT_DIR, d), { recursive: true }));

    // 3. Generate product-overview.md
    writeFile(path.join(OUTPUT_DIR, 'product-overview.md'), overview);

    // 4. Generate Instructions
    // 01-foundation.md
    const foundationContent = `# Milestone 1: Foundation\n\n> **Provide alongside:** \`product-overview.md\`\n> **Prerequisites:** None\n\n## Goal\nSet up foundational elements.\n\n[Full content would go here using the template...]`; // Simplified for brevity in this step, normally detailed
    writeFile(path.join(OUTPUT_DIR, 'instructions/incremental/01-foundation.md'), foundationContent);

    // Generate Section Instructions
    sectionIds.forEach((id, index) => {
        const spec = readFile(path.join(PUBLIC_PRODUCT, `sections/${id}/spec.md`)) || '';
        const milestoneNum = (index + 2).toString().padStart(2, '0');
        const content = `# Milestone ${index + 2}: ${id}\n\n> **Prerequisites:** Foundation\n\n${spec}`;
        writeFile(path.join(OUTPUT_DIR, `instructions/incremental/${milestoneNum}-${id}.md`), content);

        // Create section dir in product-plan
        fs.mkdirSync(path.join(OUTPUT_DIR, `sections/${id}/components`), { recursive: true });

        // Generate README and Tests
        writeFile(path.join(OUTPUT_DIR, `sections/${id}/README.md`), `# ${id}\n\n${spec}`);
        writeFile(path.join(OUTPUT_DIR, `sections/${id}/tests.md`), `# Test Instructions: ${id}\n\nSee spec.md for flows to test.`);
    });

    // one-shot-instructions.md (Concatenate)
    let oneShot = `# Complete Implementation Instructions\n\n`;
    oneShot += readFile(path.join(OUTPUT_DIR, 'instructions/incremental/01-foundation.md')) + '\n\n---\n\n';
    sectionIds.forEach((id, index) => {
        const milestoneNum = (index + 2).toString().padStart(2, '0');
        oneShot += readFile(path.join(OUTPUT_DIR, `instructions/incremental/${milestoneNum}-${id}.md`)) + '\n\n---\n\n';
    });
    writeFile(path.join(OUTPUT_DIR, 'instructions/one-shot-instructions.md'), oneShot);

    // 5. Copy Components
    // Shell
    copyDir(path.join(COMPONENTS_ROOT, 'shell'), path.join(OUTPUT_DIR, 'shell/components'), (content) => {
        return content.replace(/@\//g, '../../'); // Basic transform
    });

    // Sections
    sectionIds.forEach(id => {
        copyDir(path.join(COMPONENTS_ROOT, `sections/${id}`), path.join(OUTPUT_DIR, `sections/${id}/components`), (content) => {
            return content.replace(/@\//g, '../../../'); // Basic transform
        });
        // Copy types and data
        const types = readFile(path.join(PUBLIC_PRODUCT, `sections/${id}/types.ts`));
        if (types) writeFile(path.join(OUTPUT_DIR, `sections/${id}/types.ts`), types);

        const data = readFile(path.join(PUBLIC_PRODUCT, `sections/${id}/data.json`));
        if (data) writeFile(path.join(OUTPUT_DIR, `sections/${id}/sample-data.json`), data);
    });

    // 6. Design System & Data Model
    copyDir(path.join(PUBLIC_PRODUCT, 'design-system'), path.join(OUTPUT_DIR, 'design-system'));
    copyDir(path.join(PUBLIC_PRODUCT, 'data-model'), path.join(OUTPUT_DIR, 'data-model'));

    // 7. Prompts
    const oneShotPrompt = `# One-Shot Prompt\n\nUse product-overview.md and one-shot-instructions.md to build the app.`;
    writeFile(path.join(OUTPUT_DIR, 'prompts/one-shot-prompt.md'), oneShotPrompt);

    const sectionPrompt = `# Section Prompt\n\nReplace variables and use incremental instructions.`;
    writeFile(path.join(OUTPUT_DIR, 'prompts/section-prompt.md'), sectionPrompt);

    writeFile(path.join(OUTPUT_DIR, 'README.md'), `# Design Handoff\n\nSee folders for details.`);

    // 8. ZIP
    console.log('Zipping...');
    const zip = new JSZip();

    function addValidationFolder(zipFolder, folderPath) {
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            const curPath = path.join(folderPath, file);
            if (fs.statSync(curPath).isDirectory()) {
                addValidationFolder(zipFolder.folder(file), curPath);
            } else {
                zipFolder.file(file, fs.readFileSync(curPath));
            }
        }
    }

    addValidationFolder(zip.folder('product-plan'), OUTPUT_DIR);

    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(fs.createWriteStream(ZIP_OUTPUT))
        .on('finish', () => {
            console.log('product-plan.zip created.');
            // Cleanup
            fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
        });
}

main().catch(console.error);
