const Warranty = require("../../models/warranty");
const { uploadFileToSupabase } = require("../../services/uploadFileToSupabase");
const { getTokenResponse } = require("../utils/getTokenResponse");

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
        const warranty = new Warranty({
            user: req.user._id,
            productName,
            productId,
            warrantyDuration,
            warrantyDurationUnit,
            purchaseDate
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
        }

        const updatedWarranty = await Warranty.findByIdAndUpdate(
            savedWarranty._id, 
            update, 
            { new: true }
        );
        
        res.status(200).json({ 
            message: "Warranty created successfully", 
            warranty: updatedWarranty 
        });

        getTokenResponse(req.user, 200, res);
    } catch (error) {
        console.error('Error in creating warranty:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
