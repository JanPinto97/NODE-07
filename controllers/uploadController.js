const path = require('path');
const cloudinary = require('../config/cloudinary');

exports.uploadLocal = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Cap fitxer rebut.' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  return res.json({
    success: true,
    message: 'Imatge pujada localment',
    image: {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
};

// CLOUDINARY
exports.uploadCloud = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Cap fitxer rebut.' });
  }

  const folder = process.env.CLOUDINARY_FOLDER || 'task-manager/images';

  cloudinary.uploader.upload_stream({ folder }, (error, result) => {
    if (error) {
      return res.status(500).json({ success: false, message: 'Error pujant a Cloudinary', error });
    }

    return res.json({
      success: true,
      message: 'Imatge pujada a Cloudinary',
      image: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes
      }
    });
  }).end(req.file.buffer);
};
