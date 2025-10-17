#!/usr/bin/env node

/**
 * Auto Version Script
 * 
 * Analisa a mensagem do commit e atualiza a versão automaticamente:
 * - [FIX] → patch (1.3.0 → 1.3.1)
 * - [FEAT] → minor (1.3.0 → 1.4.0)
 * - [FEAT][MAJOR] ou [MAJOR] → major (1.3.0 → 2.0.0)
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Ler mensagem do commit
const commitMsgFile = process.argv[2]
if (!commitMsgFile) {
  console.log('⚠️  Nenhuma mensagem de commit fornecida. Pulando versionamento automático.')
  process.exit(0)
}

const commitMsg = readFileSync(commitMsgFile, 'utf-8').trim()

// Determinar tipo de atualização
let versionType = null

if (commitMsg.match(/\[MAJOR\]/i) || commitMsg.match(/\[FEAT\]\[MAJOR\]/i)) {
  versionType = 'major'
} else if (commitMsg.match(/\[FEAT\]/i)) {
  versionType = 'minor'
} else if (commitMsg.match(/\[FIX\]/i)) {
  versionType = 'patch'
}

// Se não houver tag de versão, não fazer nada
if (!versionType) {
  console.log('ℹ️  Commit sem tag de versão ([FIX], [FEAT], [MAJOR]). Pulando versionamento.')
  process.exit(0)
}

// Ler versão atual
const packageJsonPath = join(rootDir, 'package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
const currentVersion = packageJson.version

// Calcular nova versão
const [major, minor, patch] = currentVersion.split('.').map(Number)

let newVersion
switch (versionType) {
  case 'major':
    newVersion = `${major + 1}.0.0`
    break
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`
    break
  case 'patch':
    newVersion = `${major}.${minor}.${patch + 1}`
    break
}

console.log(`\n📦 Versionamento Automático`)
console.log(`   Tipo: ${versionType.toUpperCase()}`)
console.log(`   ${currentVersion} → ${newVersion}`)

// Atualizar package.json
packageJson.version = newVersion
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8')

console.log(`✅ package.json atualizado para v${newVersion}`)

// Executar sync-version para garantir consistência
try {
  const { execSync } = await import('child_process')
  execSync('node scripts/sync-version.js', { cwd: rootDir, stdio: 'inherit' })
} catch (error) {
  console.error('❌ Erro ao sincronizar versão:', error.message)
  process.exit(1)
}

// Adicionar package.json ao staging
try {
  const { execSync } = await import('child_process')
  execSync('git add package.json', { cwd: rootDir })
  console.log(`✅ package.json adicionado ao commit`)
} catch (error) {
  console.error('❌ Erro ao adicionar package.json:', error.message)
  process.exit(1)
}

console.log(`\n🎉 Versão atualizada com sucesso!\n`)
process.exit(0)
