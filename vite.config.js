import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: './',
    plugins: [
      {
        name: 'fal-proxy-middleware',
        configureServer(server) {
          server.middlewares.use('/api/fal', async (req, res, next) => {
            let targetUrl = req.headers['x-fal-target-url'];
            
            if (!targetUrl) {
              const match = req.url.match(/^\/(.+)$/);
              const targetPath = match ? match[1] : '';
              targetUrl = `https://queue.fal.run/${targetPath}`;
            }

            const apiKey = env.VITE_FAL_API_KEY || env.FAL_API_KEY;

            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: "Missing API Key in environment variables" }));
              return;
            }

            const fetchOptions = {
              method: req.method,
              headers: {
                'Authorization': `Key ${apiKey}`,
                'Content-Type': req.headers['content-type'] || 'application/json',
              }
            };

            if (req.method !== 'GET' && req.method !== 'HEAD') {
              const body = await new Promise((resolve, reject) => {
                let data = '';
                req.on('data', chunk => data += chunk);
                req.on('end', () => resolve(data));
                req.on('error', reject);
              });
              if (body) {
                fetchOptions.body = body;
              }
            }

            try {
              // Node 18+ has built-in fetch
              const response = await fetch(targetUrl, fetchOptions);
              const text = await response.text();
              
              res.statusCode = response.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(text);
            } catch (error) {
              console.error("Vite Proxy Error:", error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Proxy implementation error', details: error.message }));
            }
          });
        }
      }
    ],
    server: {
      proxy: {
        '/api/pixazo': {
          target: 'https://gateway-stable-diffusion-v1-5-inpainting.appypie.workers.dev',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/pixazo/, '')
        },
        '/api/replicate': {
          target: 'https://api.replicate.com/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/replicate/, '')
        }
      }
    }
  }
})
