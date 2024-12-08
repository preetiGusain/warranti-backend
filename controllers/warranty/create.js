const Warranty = require("../../models/warranty");

/**
 * @desc    Creates warranty for the customer
 * @route   POST /warranty/create
 * @access  Public
 */
exports.create = async (req, res, next) => {
    try {
        const {receiptPhotoURL, warrantyCardPhotoURL, productPhotoURL, 
            productName, warrantyDuration, warrantyDurationUnit, purchaseDate, productId } = req.body;

        const warranty = new Warranty({
            user: req.user._id,
            receiptPhoto: receiptPhotoURL,
            warrantyCardPhoto: warrantyCardPhotoURL,
            productPhoto: productPhotoURL,
            productName,
            productId,
            warrantyDuration,
            warrantyDurationUnit,
            purchaseDate
        });
        await warranty.save();
        res.status(200).json({message: "Warranty created successfully", warranty});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};
