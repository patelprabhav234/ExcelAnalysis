const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const { protect } = require('../middleware/auth');
const File = require('../models/File');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        const filetypes = /xlsx|xls/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Only Excel files are allowed!'));
    }
});

// Upload file
router.post('/upload', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const file = await File.create({
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            user: req.user.id
        });

        res.status(201).json(file);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get file data
router.get('/:id/data', protect, async (req, res) => {
    try {
        const file = await File.findOne({ _id: req.params.id, user: req.user.id });
        
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        res.status(200).json({
            headers: Object.keys(data[0]),
            data: data
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get user's files
router.get('/my-files', protect, async (req, res) => {
    try {
        const files = await File.find({ user: req.user.id });
        res.status(200).json(files);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete file
router.delete('/:id', protect, async (req, res) => {
    try {
        const file = await File.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router; 