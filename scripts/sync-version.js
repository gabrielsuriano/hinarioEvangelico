#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

try {
  // Lê a versão do package.json
  const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'))
  const version = packageJson.version

  console.log(`📦 Versão atual: ${version}`)

  // Atualiza o nuxt.config.ts se necessário
  const nuxtConfigPath = join(rootDir, 'nuxt.config.ts')
  let nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')

  // Procura pelo start_url e atualiza se necessário
  const startUrlRegex = /start_url:\s*'\/'/

  if (startUrlRegex.test(nuxtConfig)) {
    console.log('✅ start_url está correto (sem versão na query)')
  } else {
    // Se tiver versão, remove
    nuxtConfig = nuxtConfig.replace(
      /start_url:\s*'\/\?v=[^']*'/,
      "start_url: '/'"
    )
    writeFileSync(nuxtConfigPath, nuxtConfig, 'utf-8')
    console.log('✅ start_url corrigido no nuxt.config.ts')
  }

  console.log('✅ Sincronização de versão completa!')
  console.log(`   Package.json: ${version}`)
  console.log(`   SettingsMenu.vue: Importa dinamicamente`)
  console.log(`   nuxt.config.ts: start_url: '/' (sem versão)`)

} catch (error) {
  console.error('❌ Erro ao sincronizar versão:', error)
  process.exit(1)
}
