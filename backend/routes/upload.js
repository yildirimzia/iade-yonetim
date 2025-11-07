const express = require('express');
const router = express.Router();
const { upload, uploadToMinio, deleteFromMinio } = require('../config/minio');
const { protect } = require('../middleware/auth');

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private
router.post('/image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen bir resim dosyası seçin.',
      });
    }

    // Upload to MinIO
    const result = await uploadToMinio(req.file, 'products');

    res.json({
      success: true,
      message: 'Resim başarıyla yüklendi!',
      data: {
        url: result.url, // MinIO URL
        fileName: result.fileName, // File path in bucket (for deletion)
        bucket: result.bucket
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Resim yükleme sırasında bir hata oluştu.',
    });
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private
router.post('/images', protect, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen en az bir resim dosyası seçin.',
      });
    }

    // Upload all files to MinIO
    const uploadPromises = req.files.map(file => uploadToMinio(file, 'products'));
    const results = await Promise.all(uploadPromises);

    const images = results.map((result) => ({
      url: result.url,
      fileName: result.fileName,
      bucket: result.bucket
    }));

    res.json({
      success: true,
      message: `${images.length} resim başarıyla yüklendi!`,
      data: images,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Resim yükleme sırasında bir hata oluştu.',
    });
  }
});

// @desc    Delete image
// @route   DELETE /api/upload/image/:fileName
// @access  Private
router.delete('/image/:fileName(*)', protect, async (req, res) => {
  try {
    const { fileName } = req.params;

    // Decode file name (URL encoded olabilir)
    const decodedFileName = decodeURIComponent(fileName);

    const result = await deleteFromMinio(decodedFileName);

    if (result) {
      res.json({
        success: true,
        message: 'Resim başarıyla silindi!',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Resim bulunamadı.',
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Resim silme sırasında bir hata oluştu.',
    });
  }
});

module.exports = router;
