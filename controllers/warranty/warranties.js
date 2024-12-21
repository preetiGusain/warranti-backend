const Warranty = require("../../models/warranty");

/**
 * @desc    Gets warranties of a customer
 * @route   GET /warranties
 * @access  Public
 */
exports.warranties = async (req, res, next) => {
    try {
        console.log("Fetching warranties for user : " + req?.user?._id);
        
        const warranties = await Warranty.find({ user: req.user._id});

        if (!warranties.length) {
            return res.status(404).json({
                message: 'No warranties found for this user.',
                warranties: [],
            });
        }
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