#!/usr/bin/env node

/**
 * Auto Version Script
 * 
 * Atualiza a versão automaticamente baseado em:
 * 1. Argumento direto (usado pelo pre-commit): patch, minor, major
 * 2. Mensagem do commit (usado pelo prepare-commit-msg): [FIX], [FEAT], [MAJOR]
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Determinar tipo de atualização
let versionType = null

// Opção 1: Argumento direto (patch, minor, major)
if (process.argv[2] && ['patch', 'minor', 'major'].includes(process.argv[2])) {
  versionType = process.argv[2]
} 
// Opção 2: Arquivo de mensagem do commit
else if (process.argv[2] && process.argv[2].includes('COMMIT_EDITMSG')) {
  const commitMsgFile = process.argv[2]
  const commitMsg = readFileSync(commitMsgFile, 'utf-8').trim()

  if (commitMsg.match(/\[MAJOR\]/i) || commitMsg.match(/\[FEAT\]\[MAJOR\]/i)) {
    versionType = 'major'
  } else if (commitMsg.match(/\[FEAT\]/i)) {
    versionType = 'minor'
  } else if (commitMsg.match(/\[FIX\]/i)) {
    versionType = 'patch'
  }
}

// Se não houver tag de versão, não fazer nada
if (!versionType) {
  // Modo silencioso quando chamado pelo pre-commit sem tag
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

console.log(`✅ package.json atualizado para v${newVersion}\n`)

process.exit(0)
