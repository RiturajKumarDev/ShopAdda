const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const imageRouter = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

imageRouter.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const fileId = req.file.filename;
    res.json({ success: true, fileId: fileId });
});

imageRouter.get('/health', (req, res) => {
    res.json({ success: true, message: "Local image service running" });
});

exports.imageRouter = imageRouter;
