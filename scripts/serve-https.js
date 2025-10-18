#!/usr/bin/env node
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações
const PORT = process.env.PORT || 3001;
const PUBLIC_DIR = path.join(__dirname, '../.output/public');

// Auto-detect certificates in personal/ directory
function findCertificates() {
  const personalDir = path.join(__dirname, '..', 'personal');

  // Check if personal directory exists
  if (!fs.existsSync(personalDir)) {
    return null;
  }

  const files = fs.readdirSync(personalDir);

  const certFile = files.find(f => f.endsWith('.crt'));
  const keyFile = files.find(f => f.endsWith('.key'));

  if (certFile && keyFile) {
    return {
      cert: path.join(personalDir, certFile),
      key: path.join(personalDir, keyFile)
    };
  }

  return null;
}

const certs = findCertificates();

if (!certs) {
  console.error('❌ Certificados HTTPS não encontrados na pasta personal/!');
  console.error('\n💡 Configure os certificados do Tailscale:');
  console.error('   ./scripts/setup-https.sh');
  console.error('\n📖 Ou consulte: docs/HTTPS-TAILSCALE.md');
  process.exit(1);
}

const CERT_FILE = certs.cert;
const KEY_FILE = certs.key;

// Ler certificados
const options = {
  key: fs.readFileSync(KEY_FILE),
  cert: fs.readFileSync(CERT_FILE)
};

// Importar serve dinamicamente
const { default: handler } = await import('serve-handler');

// Criar servidor HTTPS
const server = https.createServer(options, (req, res) => {
  // Tratar rota /api/hymnal especificamente
  if (req.url === '/api/hymnal') {
    const apiFile = path.join(PUBLIC_DIR, 'api', 'hymnal');

    if (fs.existsSync(apiFile)) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return fs.createReadStream(apiFile).pipe(res);
    }
  }

  return handler(req, res, {
    public: PUBLIC_DIR,
    cleanUrls: true,
    rewrites: [
      { source: '**', destination: '/index.html' }
    ]
  });
});

server.listen(PORT, () => {
  const hostname = path.basename(CERT_FILE, '.crt');

  console.log('\n🚀 Servidor HTTPS PWA rodando!\n');
  console.log('📱 Acesse:');
  console.log(`   - HTTPS (Tailscale): https://${hostname}:${PORT}`);
  console.log(`   - Local: https://localhost:${PORT}`);
  console.log('\n✅ PWA instalável via HTTPS!');
  console.log('⚡ Pressione Ctrl+C para parar\n');
});

// Tratar erros
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso`);
    console.error(`💡 Tente: PORT=3002 node scripts/serve-https.js`);
  } else {
    console.error('❌ Erro no servidor:', err.message);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso!');
    process.exit(0);
  });
});
