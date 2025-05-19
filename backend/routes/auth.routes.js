const express = require('express');
const router = express.Router();
const passport = require('../controllers/passport');
const authMiddleware = require('../middleWare/auth.middleWares');
const authControllers = require('../controllers/auth.controllers');


router.post('/sign-up', authControllers.signUp);
router.post('/sign-in', authControllers.login);
router.post('/forgot-password', authControllers.forgotPassword);

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
  
    res.redirect('/');
});

router.post("/logout", authMiddleware,authControllers.logout);


module.exports = router;