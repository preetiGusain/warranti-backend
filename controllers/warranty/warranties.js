const Warranty = require("../../models/warranty");

/**
 * @desc    Gets warranties of a customer
 * @route   GET /warranty/warranties
 * @access  Public
 */
exports.warranties = async (req, res, next) => {
    try {
        const warranties = await Warranty.find();
        console.log(warranties);
        res.status(200).json({
            message: 'Warranties found successfully!',
            warranties: warranties
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message,
        });
    }
};