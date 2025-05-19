const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Users = require('../config/models/users.models');

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Tìm người dùng theo Google ID
      let user = await Users.findOne({ google_account_id: profile.id });

      // Nếu chưa có, tạo người dùng mới
      if (!user) {
        user = await Users.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          auth_type: 'google',
          google_account_id: profile.id,
          refresh_token: refreshToken || '', // Tránh lỗi nếu refreshToken không tồn tại
        });
      }

      return done(null, user);
    } catch (error) {
      console.error('Google Authentication Error:', error.message);
      return done(error, null);
    }
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Users.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Deserialize User Error:', error.message);
    done(error, null);
  }
});

module.exports = passport;
