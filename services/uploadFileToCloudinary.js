const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary.
 * @param {File} file - The file object (from multer).
 * @param {String} userId - User ID (used for folder structure).
 * @param {String} warrantyId - Warranty ID (used for folder structure).
 * @param {String} fileName - A custom file name.
 * @returns {String|null} - The secure URL of the uploaded file.
 */

exports.uploadFileToCloudinary = async (file, userId, warrantyId, fileName) => {
    try {
        // Validate input
        if (!file || !file.buffer || !file.mimetype) {
            throw new Error("Invalid file object. Ensure it has 'buffer' and 'mimetype' properties.");
        }

        // Use a Promise to handle stream-based upload
        return await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: `warranty/${userId}/${warrantyId}`,
                    public_id: fileName,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        return reject(error);
                    }
                    resolve(result.secure_url);
                }
            );
            stream.end(file.buffer);
        });

    } catch (err) {
        console.error("Unexpected Cloudinary error:", err.message);
        return null;
    }
};
