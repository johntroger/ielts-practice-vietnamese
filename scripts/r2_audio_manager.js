import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'ielts-audio-storage';
const PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev';

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  console.error('❌ Missing Cloudflare R2 credentials in .env file!');
}

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID || '',
    secretAccessKey: SECRET_ACCESS_KEY || '',
  },
});

/**
 * Determine MIME content type by file extension
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.mp3': return 'audio/mpeg';
    case '.wav': return 'audio/wav';
    case '.m4a': return 'audio/mp4';
    case '.ogg': return 'audio/ogg';
    case '.aac': return 'audio/aac';
    case '.json': return 'application/json';
    default: return 'application/octet-stream';
  }
}

/**
 * Upload an audio file to Cloudflare R2
 * @param {string} localFilePath - Path to the file on local disk
 * @param {string} [destinationKey] - Optional custom name in bucket. Defaults to base filename.
 * @returns {Promise<{ key: string, publicUrl: string, size: number }>}
 */
export async function uploadAudioToR2(localFilePath, destinationKey = null) {
  if (!fs.existsSync(localFilePath)) {
    throw new Error(`File does not exist: ${localFilePath}`);
  }

  const fileName = destinationKey || path.basename(localFilePath);
  // Clean filename: remove special characters, spaces to hyphens
  const sanitizedKey = fileName.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_\-\.]/g, '');
  
  const fileBuffer = fs.readFileSync(localFilePath);
  const fileSize = fileBuffer.length;
  const contentType = getMimeType(localFilePath);

  console.log(`📤 Uploading "${path.basename(localFilePath)}" -> R2 Key: "${sanitizedKey}" (${(fileSize / (1024 * 1024)).toFixed(2)} MB)...`);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: sanitizedKey,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  const cleanDomain = PUBLIC_DOMAIN.replace(/\/+$/, '');
  const publicUrl = `${cleanDomain}/${sanitizedKey}`;

  console.log(`✅ Upload successful!`);
  console.log(`🔗 Public URL: ${publicUrl}`);

  return {
    key: sanitizedKey,
    publicUrl,
    size: fileSize,
    contentType,
  };
}

/**
 * List all objects currently in the R2 bucket
 */
export async function listR2Audios() {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
  });

  const response = await r2Client.send(command);
  const cleanDomain = PUBLIC_DOMAIN.replace(/\/+$/, '');

  if (!response.Contents || response.Contents.length === 0) {
    console.log('📂 Bucket is currently empty.');
    return [];
  }

  const items = response.Contents.map((obj) => ({
    key: obj.Key,
    sizeMB: (obj.Size / (1024 * 1024)).toFixed(2),
    lastModified: obj.LastModified,
    publicUrl: `${cleanDomain}/${obj.Key}`,
  }));

  console.log(`\n📁 Total files in bucket: ${items.length}`);
  items.forEach((item, index) => {
    console.log(`  [${index + 1}] ${item.key} (${item.sizeMB} MB) -> ${item.publicUrl}`);
  });

  return items;
}

// CLI usage support
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve('scripts/r2_audio_manager.js')) {
  const action = process.argv[2];
  const target = process.argv[3];
  const customKey = process.argv[4];

  (async () => {
    try {
      if (action === 'list') {
        await listR2Audios();
      } else if (action === 'upload' && target) {
        await uploadAudioToR2(target, customKey);
      } else {
        console.log(`Usage:`);
        console.log(`  node scripts/r2_audio_manager.js upload <path_to_audio.mp3> [optional_key]`);
        console.log(`  node scripts/r2_audio_manager.js list`);
      }
    } catch (err) {
      console.error('❌ Error:', err.message);
      process.exit(1);
    }
  })();
}
