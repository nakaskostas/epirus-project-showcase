import path from 'path';
import { glob } from 'glob';
import fs from 'fs-extra';

import { rimraf } from 'rimraf';
import simpleGit from 'simple-git';

const fileTypeMappings = {
    images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff'],
    videos: ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
    documents: ['.pdf', '.doc', '.docx', '.txt'],
    spreadsheets: ['.xls', '.xlsx', '.csv'],
    cad: ['.dwg', '.dxf'], // Engineering drawings
    archives: ['.zip', '.rar', '.7z', '.tar', '.gz'],
};

/**
 * Determines the category for a given file based on its extension.
 * @param {string} filePath - The path to the file.
 * @returns {string} The category name (e.g., 'images', 'videos') or 'others'.
 */
function getFileCategory(filePath) {
    const extension = path.extname(filePath).toLowerCase();    
    
    // Special case for PDFs to go into documents/pdf
    if (extension === '.pdf') {
        return path.join('documents', 'pdf');
    }

    for (const category in fileTypeMappings) {
        if (fileTypeMappings[category].includes(extension)) {
            return category;
        }
    }
    return 'others'; // For files that don't match any category
}

/**
 * Organizes files from a source directory into a structured output directory.
 * @param {string} source - The source directory path.
 * @param {object} options - The options object from commander.
 * @param {string} options.output - The path to the output directory.
 */
export async function organizeFiles(source, options) {
    const outputPath = path.resolve(options.output);
    let sourcePath = '';
    let isTemp = false;

    // Check if the source is a URL
    const isUrl = source.startsWith('http://') || source.startsWith('https://');

    try {
        if (isUrl) {
            // It's a URL, so we need to clone it
            sourcePath = path.resolve('.tmp-repo');
            isTemp = true;
            console.log(`Source is a URL. Cloning ${source} into ${sourcePath}...`);

            // Clean up any previous temporary directory
            if (await fs.pathExists(sourcePath)) {
                await fs.remove(sourcePath);
            }
            await fs.ensureDir(sourcePath);

            const git = simpleGit({
                progress({ method, stage, progress }) {
                    // Provides real-time feedback in the output console for long-running git operations.
                    console.log(`git.${method} ${stage} stage ${progress}% complete`);
                },
            });

            // Use a shallow clone (--depth 1) to fetch only the latest commit,
            // which is much faster and requires less data.
            await git.clone(source, sourcePath, [
                '--depth', '1',
                '--no-hardlinks'
            ]);
            console.log('Repository cloned successfully.');

        } else {
            // It's a local path
            sourcePath = path.resolve(source);
            // Check if source exists
            if (!await fs.pathExists(sourcePath)) {
                console.error(`Error: Source directory does not exist: ${sourcePath}`);
                return;
            }
        }

        console.log(`\nScanning source directory: ${sourcePath}`);
        console.log(`Organizing files into: ${outputPath}`);

        // Ensure the base output directory exists
        await fs.ensureDir(outputPath);

        const files = await glob('**/*', { cwd: sourcePath, nodir: true, dot: true });

        if (files.length === 0) {
            console.log('No files found in the source directory.');
            return;
        }

        for (const file of files) {
            const sourceFile = path.join(sourcePath, file);
            const category = getFileCategory(sourceFile);

            if (category !== 'others') {
                const destDir = path.join(outputPath, category);
                await fs.ensureDir(destDir);
                await fs.copy(sourceFile, path.join(destDir, path.basename(file)));
                console.log(`Copied: ${file} -> ${category}/`);
            }
        }

        console.log(`\n✅ Successfully organized ${files.length} files.`);

    } catch (error) {
        console.error('An error occurred during file organization:', error);
    } finally {
        // Clean up the temporary directory if it was created
        if (isTemp && await fs.pathExists(sourcePath)) {
            console.log('Cleaning up temporary repository directory...');
            await rimraf(sourcePath); // Use rimraf for robust deletion
            console.log('Temporary repository directory cleaned up.');
        }
    }
}