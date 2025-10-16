import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const publicDir = join(__dirname, '..', 'public')
const svgPath = join(publicDir, 'icon.svg')
const svgBuffer = readFileSync(svgPath)

const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 192, name: 'icon-192x192-maskable.png' },
  { size: 512, name: 'icon-512x512-maskable.png' },
]

async function generateIcons() {
  console.log('🎨 Gerando ícones PWA...\n')
  
  for (const { size, name } of sizes) {
    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(join(publicDir, name))
      
      console.log(`✅ ${name} (${size}x${size})`)
    } catch (error) {
      console.error(`❌ Erro ao gerar ${name}:`, error.message)
    }
  }
  
  // Gera também o favicon
  try {
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(join(publicDir, 'favicon.png'))
    
    console.log(`✅ favicon.png (32x32)`)
  } catch (error) {
    console.error(`❌ Erro ao gerar favicon:`, error.message)
  }
  
  console.log('\n🎉 Ícones gerados com sucesso!')
}

generateIcons().catch(console.error)
