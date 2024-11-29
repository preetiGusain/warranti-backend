/**
 * @desc    Checks if the customer is logged in
 * @route   POST /auth/check
 * @access  Public
 */
exports.checkLogin = async (req, res, next) => {
    console.log(req.user); 
    req.user ? next() : res.sendStatus(401);
    // try {
    //     if (req.isAuthenticated()) {
    //         res.json({ user: req.user }); // Return user details
    //     } else {
    //         res.status(401).json({ error: { message: 'Not authenticated' } });
    //     }
    // } catch (error) {
    //     next(error);
    // }
};