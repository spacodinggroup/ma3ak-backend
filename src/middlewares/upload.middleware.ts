import multer from 'multer';

// Configure multer for memory storage (no disk write)
const storage = multer.memoryStorage();

// File filter - only accept PDFs
const fileFilter = (
    req: any,
    file: multer.File,
    cb: multer.FileFilterCallback
) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'));
    }
};

// Create upload middleware
export const uploadPDF = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
    },
}).single('pdf'); // Expects field name 'pdf'
