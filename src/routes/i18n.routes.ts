import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Base directory for i18n files
const i18nBaseDir = path.join(__dirname, '../../public/i18n'); // Adjust the path as needed

router.get('/:namespace/:locale.json', (req, res) => {
    const { namespace, locale } = req.params;

    // Construct the file path
    const filePath = path.join(i18nBaseDir, namespace, `${locale}.json`);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'Translation file not found' });
    }
});

export default router;
