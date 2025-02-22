/**
 * @desc    Checks for API call
 * @route   GET/auth/check
 * @access  Public
 */
exports.check = async (req, res, next) => {
    console.log("check API called");
    return res
            .status(200)
            .json({ success: true, message: "You are logged in correctly!" });
}