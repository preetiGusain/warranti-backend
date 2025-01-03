const Warranty = require("../../models/warranty");

/**
 * @desc    Gets selected warranty by a customer
 * @route   GET /warranty/:id
 * @access  Public
 */
exports.warranty = async (req, res, next) => {
    try {
        console.log("Fetching warranty with id : " + req.params.id);
        
        const warrantyId = req.params.id;
        const findWarranty = await Warranty.findById(warrantyId);

        if (!findWarranty) {
            return res.status(404).json({
                message: "Warranty not found",
            });
        }

        // Check if the warranty has expired
        const currentDate = new Date();
        const warrantyEndDate = new Date(findWarranty.warrantyEndDate);

        if (warrantyEndDate < currentDate) {
            // If expired, update the status to "Expired"
            findWarranty.status = "Expired";
            await findWarranty.save();
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