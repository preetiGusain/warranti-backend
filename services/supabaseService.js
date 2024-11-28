const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Uploads a file to the "warranty-files" bucket in Supabase.
 * @param {File} file - The file object to upload.
 * @param {String} userId - The ID of the user uploading the file.
 * @param {String} fileType - The type of file (i.e, 'receipts', 'warranty-cards', 'product-photos').
 * @returns {String|null} - The public URL of the uploaded file or null if an error occurs.
 */
const uploadFile = async (file, userId, fileType) => {
    try {
        //Unique file name using timestamp
        const uniqueFileName = `${Date.now()}-${path.basename(file.name)}`;

        const folderPath = `${userId}/${fileType}`;
        const filePath = `${folderPath}/${uniqueFileName}`;

        // Uploading the file to Supabase
        const { data, error } = await supabase.storage
            .from('warranty-files')
            .upload(filePath, file.data, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Error uploading file:', error.message);
            return null;
        }

        // Get the public URL of the uploaded file
        const { publicURL } = supabase.storage
            .from('warranty-files')
            .getPublicUrl(data.path);

        return publicURL; // Return the file's public URL
    } catch (error) {
        console.error('Unexpected error uploading file:', error.message);
        return null;
    }
};

module.exports = { uploadFile };
