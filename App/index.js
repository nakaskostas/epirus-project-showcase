import { Command } from 'commander';
import { organizeFiles } from './scripts/organizeFiles.js';

const program = new Command();

program
    .name('project-automator')
    .description('CLI to automate the creation of project showcase websites.')
    .version('1.0.0');

program.command('organize')
    .description('Organize project files from a source directory into a structured output directory.')
    .argument('<source>', 'Source directory or GitHub repository URL')
    .option('-o, --output <directory>', 'Output directory for organized files', 'public/assets')
    .action(organizeFiles);

program.parse(process.argv);