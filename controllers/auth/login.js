const passport = require('passport');
/**
 * @desc    Login the customer
 * @route   POST /auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.log(err);
          return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
          return res.status(401).json({ message: "Incorrect email or password" });
        }
        req.logIn(user, (err) => {
          if (err) {
            return res.status(500).json({ message: "Internal server error" });
          }
          return res.status(200).json({ message: "Login successful", user });
        });
      })(req, res, next);
}