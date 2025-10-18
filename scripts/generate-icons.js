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
  { size: 192, name: 'icon-192x192.png', maskable: false },
  { size: 512, name: 'icon-512x512.png', maskable: false },
  { size: 192, name: 'icon-192x192-maskable.png', maskable: true },
  { size: 512, name: 'icon-512x512-maskable.png', maskable: true },
]

async function generateIcons() {
  console.log('🎨 Gerando ícones PWA...\n')
  
  for (const { size, name, maskable } of sizes) {
    try {
      // Para ícones maskable, reduz o conteúdo para 75% (safe zone)
      // deixando 12.5% de margem em cada lado
      const iconSize = maskable ? Math.round(size * 0.75) : size
      const padding = maskable ? Math.round((size - iconSize) / 2) : 0
      
      if (maskable) {
        // Cria um canvas com fundo azul (#3880ff) e o ícone reduzido no centro
        await sharp(svgBuffer)
          .resize(iconSize, iconSize)
          .extend({
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
            background: { r: 56, g: 128, b: 255, alpha: 1 } // #3880ff
          })
          .png()
          .toFile(join(publicDir, name))
      } else {
        // Ícones normais mantêm o tamanho original
        await sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toFile(join(publicDir, name))
      }
      
      console.log(`✅ ${name} (${size}x${size}${maskable ? ' - maskable com 75% safe zone' : ''})`)
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
