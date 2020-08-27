const passport = require('passport');
const strategyFB = require('passport-facebook').Strategy;
const { User } = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new strategyFB({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: 'https://medtechnika.te.ua/api/v1/fb/cb',
    profileFields: ['name', 'email']
  },
    async (accessToken, refreshToken, profile, done) => {
      console.log("PROFILE === ", profile);
      const { first_name, last_name, id, email } = profile._json;
      console.log("ACCESS TOKEN FB === ", accessToken);
      await User.findOne({ facebookID: id })
        .then(user => {
          console.log("USER === ", user);
          if (!user) {
            User.create({
              email: email,
              facebookID: id,
              fName: first_name,
              lName: last_name,
              role: false
            })
              .then(fbUser => done(null, fbUser))
              .catch(err => {
                console.log(err);
              })
          }
          done(null, user);
        })
        .catch(err => {
          console.log(err);
        })
    }
  )
)
