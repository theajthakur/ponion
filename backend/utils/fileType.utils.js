const { fileTypeFromBuffer } = require('file-type');

const validateImage = async (buffer) => {
    try {
        const type = await fileTypeFromBuffer(buffer);

        if (!type) {
            return { valid: false, message: 'Unknown file type' };
        }

        const allowed = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
        ];

        if (!allowed.includes(type.mime)) {
            return { valid: false, message: 'Invalid image type' };
        }

        return { valid: true, type };
    } catch (err) {
        console.log(err)
        return { valid: false, message: 'File validation failed' };
    }
};

module.exports = validateImage;
