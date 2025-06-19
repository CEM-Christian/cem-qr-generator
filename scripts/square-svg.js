#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

/**
 * Parse an SVG viewBox attribute
 * @param {string} viewBox - The viewBox string "x y width height"
 * @returns {object} Parsed viewBox values
 */
function parseViewBox(viewBox) {
  const values = viewBox.trim().split(/\s+/).map(Number)
  if (values.length !== 4) {
    throw new Error(`Invalid viewBox format: ${viewBox}`)
  }
  return {
    x: values[0],
    y: values[1],
    width: values[2],
    height: values[3],
  }
}

/**
 * Create a square viewBox from the original viewBox
 * @param {object} originalViewBox - The original viewBox object
 * @returns {object} Square viewBox object
 */
function createSquareViewBox(originalViewBox) {
  const { x, y, width, height } = originalViewBox

  // Use the larger dimension as the square size
  const squareSize = Math.max(width, height)

  // Calculate center offsets to keep content centered
  const centerX = x + width / 2
  const centerY = y + height / 2

  // Calculate new x,y to center the content in the square
  const newX = centerX - squareSize / 2
  const newY = centerY - squareSize / 2

  return {
    x: newX,
    y: newY,
    width: squareSize,
    height: squareSize,
  }
}

/**
 * Convert viewBox object to string
 * @param {object} viewBox - ViewBox object
 * @returns {string} ViewBox string
 */
function viewBoxToString(viewBox) {
  return `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`
}

/**
 * Process a single SVG file to create a square version
 * @param {string} inputPath - Path to input SVG file
 * @param {string} outputPath - Path to output SVG file
 * @returns {boolean} Success status
 */
function processSVGFile(inputPath, outputPath) {
  try {
    console.log(`Processing: ${path.basename(inputPath)}`)

    // Read the SVG file
    const svgContent = fs.readFileSync(inputPath, 'utf8')

    // Find viewBox attribute using regex
    const viewBoxRegex = /viewBox\s*=\s*["']([^"']+)["']/i
    const match = svgContent.match(viewBoxRegex)

    if (!match) {
      console.warn(`⚠️  No viewBox found in ${path.basename(inputPath)}`)
      return false
    }

    const originalViewBoxString = match[1]
    console.log(`  Original viewBox: ${originalViewBoxString}`)

    // Parse the original viewBox
    const originalViewBox = parseViewBox(originalViewBoxString)

    // Create square viewBox
    const squareViewBox = createSquareViewBox(originalViewBox)
    const squareViewBoxString = viewBoxToString(squareViewBox)

    console.log(`  Square viewBox: ${squareViewBoxString}`)

    // Replace viewBox in SVG content
    const updatedSvgContent = svgContent.replace(
      viewBoxRegex,
      `viewBox="${squareViewBoxString}"`,
    )

    // Write the new SVG file
    fs.writeFileSync(outputPath, updatedSvgContent, 'utf8')

    console.log(`✅ Created: ${path.basename(outputPath)}`)
    return true
  }
  catch (error) {
    console.error(`❌ Error processing ${path.basename(inputPath)}:`, error.message)
    return false
  }
}

/**
 * Process all SVG files in a directory
 * @param {string} inputDir - Input directory path
 * @param {string} outputDir - Output directory path (optional, defaults to inputDir)
 * @param {string} suffix - Suffix to add to output files (default: '-square')
 */
function processDirectory(inputDir, outputDir = inputDir, suffix = '-square') {
  try {
    console.log(`🔍 Scanning directory: ${inputDir}`)

    if (!fs.existsSync(inputDir)) {
      throw new Error(`Input directory does not exist: ${inputDir}`)
    }

    // Create output directory if it doesn't exist
    if (outputDir !== inputDir && !fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Find all SVG files
    const files = fs.readdirSync(inputDir)
    const svgFiles = files.filter(file =>
      file.toLowerCase().endsWith('.svg')
      && !file.includes(suffix), // Skip already processed files
    )

    if (svgFiles.length === 0) {
      console.log('📂 No SVG files found to process')
      return
    }

    console.log(`📋 Found ${svgFiles.length} SVG file(s) to process\n`)

    let successCount = 0
    let failCount = 0

    // Process each SVG file
    for (const svgFile of svgFiles) {
      const inputPath = path.join(inputDir, svgFile)

      // Create output filename with suffix
      const nameWithoutExt = path.parse(svgFile).name
      const outputFile = `${nameWithoutExt}${suffix}.svg`
      const outputPath = path.join(outputDir, outputFile)

      const success = processSVGFile(inputPath, outputPath)
      if (success) {
        successCount++
      }
      else {
        failCount++
      }
      console.log() // Empty line for readability
    }

    // Summary
    console.log('📊 Summary:')
    console.log(`✅ Successfully processed: ${successCount}`)
    console.log(`❌ Failed: ${failCount}`)
    console.log(`📁 Output directory: ${outputDir}`)
  }
  catch (error) {
    console.error('❌ Error processing directory:', error.message)
  }
}

/**
 * Main function to handle command line arguments
 */
function main() {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📐 SVG Square Converter

Usage: node square-svg.js [options] [input] [output]

Arguments:
  input             Input SVG file or directory (default: ./public/logos)
  output            Output directory (default: same as input)

Options:
  --suffix <text>   Suffix for output files (default: -square)
  --help, -h        Show this help message

Examples:
  node square-svg.js                              # Process ./public/logos
  node square-svg.js ./logos                      # Process ./logos directory
  node square-svg.js logo.svg                     # Process single file
  node square-svg.js ./logos ./output             # Process to different directory
  node square-svg.js --suffix -sq ./logos        # Use custom suffix

Features:
  ✅ Automatically detects SVG files
  ✅ Preserves original aspect ratio (no distortion)
  ✅ Centers content in square viewBox
  ✅ Skips already processed files
  ✅ Batch processing for directories
`)
    return
  }

  let inputPath = './public/logos' // Default
  let outputPath = null
  let suffix = '-square'

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '--suffix') {
      if (args[i + 1]) {
        suffix = args[i + 1]
        i++ // Skip next argument
      }
    }
    else if (!arg.startsWith('--')) {
      if (!inputPath || inputPath === './public/logos') {
        inputPath = arg
      }
      else if (!outputPath) {
        outputPath = arg
      }
    }
  }

  console.log('📐 SVG Square Converter')
  console.log('='.repeat(50))

  // Check if input is a file or directory
  if (fs.existsSync(inputPath)) {
    const stats = fs.statSync(inputPath)

    if (stats.isFile()) {
      // Process single file
      if (!inputPath.toLowerCase().endsWith('.svg')) {
        console.error('❌ Input file must be an SVG file')
        return
      }

      const dir = path.dirname(inputPath)
      const fileName = path.parse(inputPath).name
      const outputFile = outputPath || path.join(dir, `${fileName}${suffix}.svg`)

      processSVGFile(inputPath, outputFile)
    }
    else if (stats.isDirectory()) {
      // Process directory
      const outputDir = outputPath || inputPath
      processDirectory(inputPath, outputDir, suffix)
    }
  }
  else {
    console.error(`❌ Input path does not exist: ${inputPath}`)
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export {
  createSquareViewBox,
  parseViewBox,
  processDirectory,
  processSVGFile,
}
