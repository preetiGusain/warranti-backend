const { createClient } = require('@supabase/supabase-js');
const { decode } = require('base64-arraybuffer');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Uploads a file to the "warranty-files" bucket in Supabase.
 * @param {File} file - The file object to upload.
 * @param {String} userId - The ID of the user uploading the file.
 * @param {String} fileType - The type of file (i.e, 'receipts', 'warranty-cards', 'product-photos').
 * @returns {String|null} - The public URL of the uploaded file or null if an error occurs.
 */
exports.uploadFileToSupabase = async (file, userId, warrantyId, fileName) => {
    try {
         // Validate input
         if (!file || !file.buffer || !file.mimetype) {
            throw new Error("Invalid file object. Ensure it has 'buffer' and 'mimetype' properties.");
        }

        // Decode file to ArrayBuffer
        const fileBase64 = decode(file.buffer.toString("base64"));
        const filePath = `${userId}/${warrantyId}/${fileName}`;
        
        // Uploading the file to Supabase
        const { data, error } = await supabase.storage
            .from('warranty-files')
            .upload(filePath, fileBase64, {
                contentType: file.mimetype, // Dynamically set content type
                upsert: false               // Prevent overwriting existing files
            });

        if (error) {
            console.log(error);
            console.error('Error uploading file:', error.message);
            return null;
        }

        // Get the public URL of the uploaded file
        const { data: urlData, error: urlError } = supabase.storage
            .from('warranty-files')
            .getPublicUrl(filePath);

            if (urlError) {
                console.error('Error fetching public URL:', urlError.message);
                return null;
            }

        return urlData.publicUrl; // Return the file's public URL
    } catch (error) {
        console.error('Unexpected error uploading file:', error.message);
        return null;
    }
};
