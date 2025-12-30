import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter - only accept PDFs
const fileFilter = (
    req: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed') as any);
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
export const uploadPDF = (req: any, res: any, next: any) => {
    upload(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: `Upload error: ${err.message}`
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    });
};
