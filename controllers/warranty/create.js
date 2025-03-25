const { calculateWarrantyEndDate } = require("../../middleware/calculateWarrantyEndDate");
const Warranty = require("../../models/warranty");
const { uploadFileToSupabase } = require("../../services/uploadFileToSupabase");

/**
 * @desc    Creates warranty for the customer
 * @route   POST /warranty/create
 * @access  Public
 */
exports.create = async (req, res, next) => {
    try {
        const warrantyCard = req.files['warrantyCard'] ? req.files['warrantyCard'][0] : null;
        const receipt = req.files['receipt'] ? req.files['receipt'][0] : null;
        const product = req.files['product'] ? req.files['product'][0] : null;

        const { productName, warrantyDuration, warrantyDurationUnit, purchaseDate, productId } = req.body;
        const warrantyEndDate = calculateWarrantyEndDate(purchaseDate, warrantyDuration, warrantyDurationUnit);
        const warrantyStatus = new Date() > warrantyEndDate ? 'Expired' : 'Active';

        const warranty = new Warranty({
            user: req.user._id,
            productName,
            productId,
            warrantyDuration,
            warrantyDurationUnit,
            purchaseDate,
            warrantyEndDate,
            status: warrantyStatus
        });

        const savedWarranty = await warranty.save();
        const update = {};

        if (warrantyCard) {
            try {
                const warrantyCardPhotoURL = await uploadFileToSupabase(
                    warrantyCard, 
                    req.user._id, 
                    warranty._id, 
                    "warrantyCard"
                );
                update['warrantyCardPhoto'] = warrantyCardPhotoURL;
            } catch (error) {
                console.error("Error uploading warranty card:", error);
            }
        }
        if (receipt) {
            try {
                const receiptPhotoURL = await uploadFileToSupabase(
                    receipt, 
                    req.user._id, 
                    warranty._id, 
                    "receipt"
                );
                update['receiptPhoto'] = receiptPhotoURL;
            } catch (error) {
                console.error("Error uploading receipt:", error);
            }
        }
        if (product) {
            try {
                const productPhotoURL = await uploadFileToSupabase(
                    product, 
                    req.user._id, 
                    warranty._id, 
                    "product"
                );
                update['productPhoto'] = productPhotoURL;
            } catch (error) {
                console.error("Error uploading product photo:", error);
            }
        } else {
            // If no product image is uploaded, use a default image
            const defaultProductPhotoURL = "https://unbwoaamlcjijcajyygm.supabase.co/storage/v1/object/public/images//default_product_image.png";
            update['productPhoto'] = defaultProductPhotoURL;
        }

        // Update the warranty with the images URLs
        const updatedWarranty = await Warranty.findByIdAndUpdate(
            savedWarranty._id, 
            update, 
            { new: true }
        );
        
        res.status(200).json({ 
            message: "Warranty created successfully", 
            warranty: updatedWarranty 
        });
    } catch (error) {
        console.error('Error in creating warranty:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
