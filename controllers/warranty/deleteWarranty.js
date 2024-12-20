const Warranty = require("../../models/warranty");

/**
 * @desc    Deletes selected warranty for the customer
 * @route   DELETE /warranty/delete
 * @access  Public
 */
exports.deleteWarranty = async (req ,res ,next) => {
    try {
        const warrantyId = req.params.id;
        const deleteWarranty = await Warranty.findByIdAndDelete(warrantyId);

        if(!deleteWarranty) {
            return res.status(404).json({
                message: "Warranty not found",
            });
        }
        
        res.status(200).json({
            message: "Warranty deleted successfully!",
            deleteWarranty: deleteWarranty
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message,
        });
    }
};
