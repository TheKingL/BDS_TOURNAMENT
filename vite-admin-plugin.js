import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Generic handler for saving JSON files
function handleJsonSave(req, res, relativePath) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        try {
            const filePath = path.join(__dirname, relativePath);
            fs.writeFileSync(filePath, body, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
        } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
        }
    });
}

// Vite plugin to add API endpoints for saving JSON files
export function adminApiPlugin() {
    return {
        name: 'admin-api',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                // Babyfoot
                if (req.url === '/api/save-babyfoot-pools' && req.method === 'POST') {
                    handleJsonSave(req, res, 'public/data/babyfoot/pools.json');
                    return;
                }
                if (req.url === '/api/save-babyfoot-bracket' && req.method === 'POST') {
                    handleJsonSave(req, res, 'public/data/babyfoot/bracket.json');
                    return;
                }
                if (req.url === '/api/save-babyfoot-teams' && req.method === 'POST') {
                    handleJsonSave(req, res, 'public/data/babyfoot/teams.json');
                    return;
                }

                // Ping-Pong Solo
                if (req.url === '/api/save-pingpong-solo-players' && req.method === 'POST') {
                    handleJsonSave(req, res, 'public/data/pingpong-solo/players.json');
                    return;
                }
                if (req.url === '/api/save-pingpong-solo-league' && req.method === 'POST') {
                    handleJsonSave(req, res, 'public/data/pingpong-solo/league.json');
                    return;
                }
                if (req.url === '/api/save-pingpong-solo-bracket' && req.method === 'POST') {
                    handleJsonSave(req, res, 'public/data/pingpong-solo/bracket.json');
                    return;
                }

                // Ping-Pong Duo
                if (req.url === '/api/save-pingpong-duo-teams' && req.method === 'POST') {
                    handleJsonSave(req, res, 'public/data/pingpong-duo/teams.json');
                    return;
                }
                if (req.url === '/api/save-pingpong-duo-league' && req.method === 'POST') {
                    handleJsonSave(req, res, 'public/data/pingpong-duo/league.json');
                    return;
                }
                if (req.url === '/api/save-pingpong-duo-bracket' && req.method === 'POST') {
                    handleJsonSave(req, res, 'public/data/pingpong-duo/bracket.json');
                    return;
                }

                next();
            });
        }
    };
}
