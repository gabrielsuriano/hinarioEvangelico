#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = path.join(__dirname, '../hymnals/evangelico.json');
const outputDir = path.join(__dirname, '../.output/public/api');
const outputFile = path.join(outputDir, 'hymnal');

// Criar diretório se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Copiar o arquivo JSON
const hymnalData = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));

// Salvar como arquivo sem extensão (para compatibilidade com a rota /api/hymnal)
fs.writeFileSync(outputFile, JSON.stringify(hymnalData), 'utf-8');

console.log('✅ Arquivo API copiado:', outputFile);
console.log(`📊 ${hymnalData.contents?.length || 0} hinos disponíveis`);
