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

        // Format the warranty end date
        const formattedEndDate = formatDate(warrantyEndDate);

        res.status(200).json({
            message: "Warranty found successfully!",
            warranty: {
                ...findWarranty.toObject(),
                formattedEndDate,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message,
        });
    }
};

// Utility function to format a date
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}