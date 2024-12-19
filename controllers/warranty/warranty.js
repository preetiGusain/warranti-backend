const Warranty = require("../../models/warranty");

/**
 * @desc    Gets selected warranty by a customer
 * @route   GET /warranty/warranties/:id
 * @access  Public
 */
exports.warranty = async (req, res, next) => {
    try {
        const warrantyId = req.params.id;
        const findWarranty = await Warranty.findById(warrantyId);

        if (!findWarranty) {
            return res.status(404).json({
                message: "Warranty not found",
            });
        }

        res.status(200).json({
            message: "Warranty found successfully!",
            warranty: findWarranty
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message,
        });
    }
};