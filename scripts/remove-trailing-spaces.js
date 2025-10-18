#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'
import { resolve } from 'path'

// Padrões de arquivos para verificar
const patterns = [
  '**/*.{js,ts,vue,json,md,css,html,yml,yaml}',
  '!node_modules/**',
  '!.nuxt/**',
  '!dist/**',
  '!.output/**',
  '!.git/**',
]

async function removeTrailingSpaces() {
  console.log('🧹 Removendo trailing spaces...\n')

  let totalFiles = 0
  let modifiedFiles = 0

  try {
    const files = await glob(patterns, {
      cwd: resolve(process.cwd()),
      ignore: ['node_modules/**', '.nuxt/**', 'dist/**', '.output/**', '.git/**'],
      nodir: true,
    })

    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8')
        // Remove trailing spaces de cada linha
        const cleaned = content.replace(/[ \t]+$/gm, '')

        if (content !== cleaned) {
          writeFileSync(file, cleaned, 'utf-8')
          console.log(`✅ ${file}`)
          modifiedFiles++
        }

        totalFiles++
      } catch (error) {
        console.error(`❌ Erro ao processar ${file}:`, error.message)
      }
    }

    console.log(`\n📊 Resultado:`)
    console.log(`   Total de arquivos verificados: ${totalFiles}`)
    console.log(`   Arquivos modificados: ${modifiedFiles}`)
    console.log(`   Arquivos sem alteração: ${totalFiles - modifiedFiles}`)

    if (modifiedFiles > 0) {
      console.log('\n🎉 Trailing spaces removidos com sucesso!')
    } else {
      console.log('\n✨ Nenhum trailing space encontrado!')
    }
  } catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

removeTrailingSpaces().catch(console.error)
