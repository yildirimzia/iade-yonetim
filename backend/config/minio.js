const Minio = require('minio');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// MinIO client configuration
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123'
});

const BUCKET_NAME = process.env.MINIO_BUCKET || 'iade-yonetim';

// Public URL for MinIO (production'da external domain kullanılır)
const MINIO_PUBLIC_URL = process.env.MINIO_PUBLIC_URL || 
  `http${process.env.MINIO_USE_SSL === 'true' ? 's' : ''}://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || 9000}`;

// Create bucket if it doesn't exist
const initializeBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`✅ MinIO bucket '${BUCKET_NAME}' created successfully`);
      
      // Set bucket policy to public read
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
          }
        ]
      };
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
      console.log(`✅ MinIO bucket '${BUCKET_NAME}' set to public read`);
    } else {
      console.log(`✅ MinIO bucket '${BUCKET_NAME}' already exists`);
    }
  } catch (error) {
    console.error('❌ MinIO bucket initialization error:', error.message);
    console.warn('⚠️  MinIO is not running. Please start it with: docker-compose up -d minio');
    console.warn('⚠️  Image uploads will fail until MinIO is started.');
    // Don't throw - allow server to start anyway
  }
};

// Initialize bucket on startup (non-blocking)
initializeBucket().catch(err => {
  console.error('MinIO initialization failed:', err.message);
});

// Multer memory storage (we'll upload to MinIO manually)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|avif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir (jpg, jpeg, png, gif, webp, avif)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

// Upload file to MinIO
const uploadToMinio = async (file, folder = 'products') => {
  try {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${uuidv4()}${fileExtension}`;
    
    // Upload to MinIO
    await minioClient.putObject(
      BUCKET_NAME,
      fileName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      }
    );

    // Generate public URL - Production'da MINIO_PUBLIC_URL kullanılır
    const url = `${MINIO_PUBLIC_URL}/${BUCKET_NAME}/${fileName}`;

    return {
      url: url,
      fileName: fileName,
      bucket: BUCKET_NAME
    };
  } catch (error) {
    console.error('MinIO upload error:', error);
    throw error;
  }
};

// Delete file from MinIO
const deleteFromMinio = async (fileName) => {
  try {
    await minioClient.removeObject(BUCKET_NAME, fileName);
    return true;
  } catch (error) {
    console.error('MinIO delete error:', error);
    throw error;
  }
};

module.exports = {
  minioClient,
  upload,
  uploadToMinio,
  deleteFromMinio,
  BUCKET_NAME
};
