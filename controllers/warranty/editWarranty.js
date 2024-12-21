const Warranty = require("../../models/warranty");
const { uploadFileToSupabase } = require("../../services/uploadFileToSupabase");

/**
 * @desc    Edits selected warranty for the customer
 * @route   PUT /warranty/:id
 * @access  Public
 */
exports.editWarranty = async (req ,res ,next) => {
    try {
        const warrantyId = req.params.id;
        console.log("Editing warranty with:", req.params.id, req.body);

        const {productName, purchaseDate, warrantyDuration, warrantyDurationUnit } = req.body;
        const warranty = await Warranty.findById(warrantyId);

        if (!warranty) {
            return res.status(404).json({ message: "Warranty not found" });
        }

        const update = {};

        if (productName) update.productName = productName;
        if (purchaseDate) update.purchaseDate = purchaseDate;
        if (warrantyDuration) update.warrantyDuration = warrantyDuration;
        if (warrantyDurationUnit) update.warrantyDurationUnit = warrantyDurationUnit;
        
        console.log("Files in form : ", req?.files);
        
        const warrantyCard = req.files['warrantyCard'] ? req.files['warrantyCard'][0] : null;
        const receipt = req.files['receipt'] ? req.files['receipt'][0] : null;
        const product = req.files['product'] ? req.files['product'][0] : null;

        if (product) {
            try {
                const productPhotoURL = await uploadFileToSupabase(
                    product, 
                    req.user._id, 
                    warranty._id, 
                    "product"
                );
                if (productPhotoURL) update['productPhoto'] = productPhotoURL;
            } catch (error) {
                console.error("Error updating product photo:", error);
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
                if (receiptPhotoURL) update['receiptPhoto'] = receiptPhotoURL;
            } catch (error) {
                console.error("Error updating receipt photo:", error);
            }
        }

        if (warrantyCard) {
            try {
                const warrantyCardPhotoURL = await uploadFileToSupabase(
                    warrantyCard, 
                    req.user._id, 
                    warranty._id, 
                    "warrantyCard"
                );
                if (warrantyCardPhotoURL) update['warrantyCardPhoto'] = warrantyCardPhotoURL;
            } catch (error) {
                console.error("Error updating warranty card photo:", error);
            }
        }

        //Updating warranty in DB
        const updatedWarranty = await Warranty.findByIdAndUpdate(
            warrantyId,
            update,
            { new: true }
        );

        if (!updatedWarranty) {
            return res.status(400).json({ message: "Failed to update warranty" });
        }

        res.status(200).json({
            message: "Warranty updated successfully",
            warranty: updatedWarranty
        });
    } catch (error) {
        console.error("Error in updating warranty:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};