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
        //Unique file name using timestamp
        const fileBase64 = decode(file.buffer.toString("base64"));
        
        // Uploading the file to Supabase
        const { data, error } = await supabase.storage
            .from('warranty-files')
            .upload(`${userId}/${warrantyId}/${fileName}.jpg`, fileBase64, {
                contentType: "image/jpg",
                upsert: false
            });

        if (error) {
            console.log(error);
            console.error('Error uploading file:', error.message);
            return null;
        }

        // Get the public URL of the uploaded file
        const fileDetail = await supabase.storage
            .from('warranty-files')
            .getPublicUrl(data.path);

        return fileDetail.data.publicUrl; // Return the file's public URL
    } catch (error) {
        console.error('Unexpected error uploading file:', error.message);
        return null;
    }
};
