import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import * as dotenv from 'dotenv';

dotenv.config();

function adminAiPlugin() {
  return {
    name: 'admin-ai-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/admin/ai-command', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}');
            const { prompt, systemContext } = parsed;

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                text: "AI System Notice: GEMINI_API_KEY is not configured in this environment. I am operating in autonomous bank controller mode to process your command."
              }));
              return;
            }

            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey });

            const systemInstruction = `You are Veritas AI Central Command, the elite artificial intelligence operator and banking administrator assistant for Veritas Online Banking.
You have direct authority over the $10 Billion USD Central Bank Reserve and bank operations.
The user commanding you is the Veritas Bank Executive/Management (managementofficails001@gmail.com).
Your duties:
1. Parse and execute administrative commands:
   - Funding customers or injecting balance
   - Locking or unlocking customer accounts
   - Restricting or unrestricting customer transfers
   - Writing official warning messages or compliance notices to accounts
   - Reversing unauthorized or disputed transactions
   - Financial fraud detection and AML risk scoring
   - Liquidity calculations and regulatory audit reports
2. When the admin asks you to perform an action, provide a crisp, authoritative response with:
   - [ACTION REQUIRED]: describe the concrete action to execute (e.g., ACTION: FUND_ACCOUNT | USER: alex@example.com | AMOUNT: 50000 | REASON: Verified settlement) or (ACTION: LOCK_ACCOUNT | USER: ...) or (ACTION: REVERSE_TRANSACTION | ID: ...)
   - Detailed justification and compliance confirmation.
   - Status confirmation.
3. Be professional, decisive, sophisticated, and obedient to the admin's instructions.
System Context provided:
${systemContext || 'No additional context provided'}`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
              config: {
                systemInstruction,
                temperature: 0.2,
              },
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ text: response.text }));
          } catch (err: any) {
            console.error('Error generating AI response:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), adminAiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

