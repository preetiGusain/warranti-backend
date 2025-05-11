const { v2: cloudinary } = require('cloudinary');
const Warranty = require("../../models/warranty");

/**
 * @desc    Deletes selected warranty for the customer
 * @route   DELETE /warranty/delete
 * @access  Public
 */
exports.deleteWarranty = async (req, res, next) => {
    try {
        const warrantyId = req.params.id;

        const warranty = await Warranty.findById(warrantyId);
        if (!warranty) {
            return res.status(404).json({ message: "Warranty not found" });
        }

        // Delete all images in warranty folder of specific warranty id
        await cloudinary.api.delete_resources_by_prefix(`warranty/${warranty.user}/${warrantyId}`);

        try {
            await cloudinary.api.delete_folder(`warranty/${warranty.user}/${warrantyId}`);
        } catch (err) {
            console.warn("Cloudinary folder deletion warning:", err.message);
            console.error("Error deleting the warranty id folder");
        }

        // Delete warranty record
        await Warranty.findByIdAndDelete(warrantyId);

        res.status(200).json({
            message: "Warranty and associated images deleted successfully!"
        });

    } catch (error) {
        console.error("Error deleting warranty or images:", error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message,
        });
    }
};
