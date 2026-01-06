import * as Client from '@storacha/client'
import { filesFromPaths } from 'files-from-path'
import fs from 'fs'
import path from 'path'

// Main function to upload files to Storacha
async function uploadToStoracha() {
  console.log('🚀 Starting Storacha Upload Process...\n')

  try {
    // ============================================
    // STEP 1: Initialize Storacha Client
    // ============================================
    console.log('📦 Step 1: Initializing Storacha client...')
    const client = await Client.create()
    console.log('✅ Client initialized successfully!\n')

    // ============================================
    // STEP 2: Login with Email
    // ============================================
    console.log('🔐 Step 2: Logging in with email...')
    console.log('📧 Email: drasifbtm@gmail.com')
    
    await client.login('drasifbtm@gmail.com')
    
    console.log('✅ Login successful!')
    console.log('⚠️  Check your email for verification link if this is your first time\n')

    // ============================================
    // STEP 3: Create or Set Space
    // ============================================
    console.log('🏠 Step 2.5: Setting up Storacha space...')
    
    // List existing spaces
    const spaces = await client.spaces()
    
    if (spaces.length === 0) {
      // Create a new space if none exists
      console.log('📦 No existing space found. Creating new space...')
      const space = await client.createSpace('my-storacha-space')
      await client.setCurrentSpace(space.did())
      console.log(`✅ New space created: ${space.did()}`)
    } else {
      // Use the first existing space
      console.log(`📦 Found ${spaces.length} existing space(s)`)
      await client.setCurrentSpace(spaces[0].did())
      console.log(`✅ Using space: ${spaces[0].did()}`)
    }
    console.log()

    // ============================================
    // STEP 4: Create a Test File
    // ============================================
    console.log('📝 Step 3: Creating test file...')
    
    // Create a test directory if it doesn't exist
    const testDir = './test-uploads'
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }

    // Create a test file with meaningful content
    const testFileName = 'storacha-test.txt'
    const testFilePath = path.join(testDir, testFileName)
    
    // Get current date for the file content
    const currentDate = new Date().toISOString()
    
    const fileContent = `
╔════════════════════════════════════════╗
║   Storacha Upload Test File           ║
╚════════════════════════════════════════╝

Upload Date: ${currentDate}
Uploaded by: drasifbtm@gmail.com

This is a test file uploaded to Storacha using the JavaScript client.

🌟 Storacha Features:
- Decentralized storage
- IPFS-backed infrastructure
- Content addressing with CIDs
- Easy JavaScript integration
- Secure and reliable

📊 File Information:
- Format: Plain Text
- Purpose: Testing Storacha upload functionality

✨ Successfully uploaded to the decentralized web!
    `.trim()

    fs.writeFileSync(testFilePath, fileContent)
    console.log(`✅ Test file created: ${testFilePath}`)
    console.log(`📏 File size: ${fs.statSync(testFilePath).size} bytes\n`)

    // ============================================
    // STEP 5: Upload Using uploadDirectory()
    // ============================================
    console.log('☁️  Step 5: Uploading file to Storacha...')
    console.log('⏳ This may take a few moments...\n')

    // Load files from the test directory
    const files = await filesFromPaths([testFilePath])
    
    console.log('📦 Files prepared for upload:')
    for (const file of files) {
      console.log(`   - ${file.name} (${file.size} bytes)`)
    }
    console.log()

    // Upload the files
    const directoryCid = await client.uploadDirectory(files)
    
    console.log('✅ Upload successful!\n')

    // ============================================
    // STEP 6: Print CID and Gateway URL
    // ============================================
    console.log('╔════════════════════════════════════════════════════════════╗')
    console.log('║              📍 UPLOAD RESULTS                             ║')
    console.log('╚════════════════════════════════════════════════════════════╝\n')

    console.log('🔗 Content Identifier (CID):')
    console.log(`   ${directoryCid}\n`)

    console.log('🌐 Gateway URLs:')
    console.log(`   IPFS Gateway: https://ipfs.io/ipfs/${directoryCid}/${testFileName}`)
    console.log(`   W3S Gateway:  https://w3s.link/ipfs/${directoryCid}/${testFileName}`)
    console.log(`   Dweb Link:    ipfs://${directoryCid}/${testFileName}\n`)

    console.log('💡 Tips:')
    console.log('   - The CID is the permanent address of your content')
    console.log('   - You can access your file from any IPFS gateway')
    console.log('   - Content is immutable - same content = same CID')
    console.log('   - Share the gateway URL with anyone!\n')

    console.log('╔════════════════════════════════════════════════════════════╗')
    console.log('║          🎉 STORACHA UPLOAD COMPLETED SUCCESSFULLY!        ║')
    console.log('╚════════════════════════════════════════════════════════════╝\n')

    // Save results to a JSON file for reference
    const results = {
      timestamp: new Date().toISOString(),
      email: 'drasifbtm@gmail.com',
      cid: directoryCid.toString(),
      fileName: testFileName,
      fileSize: fs.statSync(testFilePath).size,
      gatewayUrls: {
        ipfs: `https://ipfs.io/ipfs/${directoryCid}/${testFileName}`,
        w3s: `https://w3s.link/ipfs/${directoryCid}/${testFileName}`,
        dweb: `ipfs://${directoryCid}/${testFileName}`
      }
    }

    fs.writeFileSync('upload-results.json', JSON.stringify(results, null, 2))
    console.log('📄 Results saved to: upload-results.json\n')

  } catch (error) {
    console.error('❌ Error occurred during upload process:')
    console.error(`   ${error.message}\n`)
    
    if (error.message.includes('login')) {
      console.log('💡 Troubleshooting Tips:')
      console.log('   1. Check your email for verification link')
      console.log('   2. Make sure you\'ve verified your email address')
      console.log('   3. Try running the script again after verification\n')
    }
    
    process.exit(1)
  }
}

// Run the upload function
uploadToStoracha()