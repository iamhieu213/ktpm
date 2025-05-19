const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../config/models/users.models');  // Đảm bảo đường dẫn đúng

// Cấu hình chiến lược đăng nhập
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Email không tồn tại.' });
            }

            // Kiểm tra mật khẩu (ví dụ: bcrypt)
            const isMatch = password === user.password;  // Thay bằng bcrypt.compare
            if (!isMatch) {
                return done(null, false, { message: 'Mật khẩu không chính xác.' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Serialize và Deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
