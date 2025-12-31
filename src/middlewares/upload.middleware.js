import multer from 'multer';
// Configure multer for memory storage
const storage = multer.memoryStorage();
// File filter - only accept PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    }
    else {
        cb(new Error('Only PDF files are allowed'));
    }
};
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
}).single('file');
// Create upload middleware with error handling
export const uploadPDF = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('[Upload Middleware] Error:', err.message);
            // REQUIREMENT: Always return { notes: [] } even on failure
            return res.status(400).json({ notes: [] });
        }
        next();
    });
};
//# sourceMappingURL=upload.middleware.js.map