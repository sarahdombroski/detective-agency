// requires the user to be logged in for specific routes
const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        next();
    } else {
        res.redirect('/login');
    }
};

// checks if the user has the specific role to access the page
const requireRole = (roleName) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            console.error('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }
        if (req.session.user.roleName !== roleName) {
            console.error('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }
        next();
    };
};

export { requireLogin, requireRole };