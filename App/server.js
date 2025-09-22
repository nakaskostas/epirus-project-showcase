
import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/organize', (req, res) => {
    const { sourceType, source } = req.body;
    let command;

    if (sourceType === 'local') {
        // For local paths, we need to construct the correct relative or absolute path
        // This is a simplification. A real app would need more robust path handling.
        command = `node index.js organize "${source}"`;
    } else if (sourceType === 'github') {
        command = `node index.js organize ${source}`;
    } else {
        return res.status(400).send('Invalid source type');
    }

    const child = exec(command, { cwd: __dirname });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    child.stdout.on('data', (data) => {
        res.write(`data: ${data.toString()}\n\n`);
    });

    child.stderr.on('data', (data) => {
        res.write(`data: [ERROR] ${data.toString()}\n\n`);
    });

    child.on('close', (code) => {
        res.write(`data: [DONE] Process finished with code ${code}\n\n`);
        res.end();
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
