/**
 * @desc    Logout the customer
 * @route   GET /auth/logout
 * @access  Public
 */
exports.logout = async (req, res) => {
    req.logout((err) => {
        if(err) {
            console.log(err);
            return res.status(500).json({message: "Error logging out"});
        }
        req.session.destroy(function (err) {
            if(err) {
                console.log(err);
                return res.status(500).json({message: "Error destroying session"});
            }
            res.json({message: "Logout successful"});
        });
    });
}