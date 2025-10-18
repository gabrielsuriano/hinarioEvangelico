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
      if (maskable) {
        // Para ícones maskable: reduz o SVG para 80% (safe zone)
        // e adiciona padding azul ao redor
        const iconSize = Math.round(size * 0.80) // 80% do tamanho (safe zone otimizada)
        const padding = Math.round((size - iconSize) / 2)

        // 1. Cria um canvas azul sólido QUADRADO
        const blueBackground = await sharp({
          create: {
            width: size,
            height: size,
            channels: 4,
            background: { r: 56, g: 128, b: 255, alpha: 1 } // #3880ff sólido
          }
        }).png().toBuffer()

        // 2. Redimensiona o SVG (que já é quadrado azul)
        const resizedIcon = await sharp(svgBuffer)
          .resize(iconSize, iconSize)
          .png()
          .toBuffer()

        // 3. Compõe: fundo azul + ícone centralizado
        await sharp(blueBackground)
          .composite([{
            input: resizedIcon,
            top: padding,
            left: padding
          }])
          .png()
          .toFile(join(publicDir, name))

        console.log(`✅ ${name} (${size}x${size} - maskable, safe zone 80%)`)
      } else {
        // Ícones normais: apenas redimensiona o SVG (já é quadrado azul)
        await sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toFile(join(publicDir, name))

        console.log(`✅ ${name} (${size}x${size} - quadrado)`)
      }
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
