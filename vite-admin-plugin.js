import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Vite plugin to add API endpoints for saving JSON files
export function adminApiPlugin() {
    return {
        name: 'admin-api',
        configureServer(server) {
            // Save pools.json
            server.middlewares.use((req, res, next) => {
                if (req.url === '/api/save-pools' && req.method === 'POST') {
                    let body = '';
                    req.on('data', chunk => { body += chunk; });
                    req.on('end', () => {
                        try {
                            const filePath = path.join(__dirname, 'public/data/pools.json');
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
                    return;
                }

                if (req.url === '/api/save-bracket' && req.method === 'POST') {
                    let body = '';
                    req.on('data', chunk => { body += chunk; });
                    req.on('end', () => {
                        try {
                            const filePath = path.join(__dirname, 'public/data/bracket.json');
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
                    return;
                }

                next();
            });
        }
    };
}
