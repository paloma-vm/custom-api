/* Auth controller*/
const User = require("../models/user");
const jwt = require('jsonwebtoken');


module.exports = (app) => {
  /* Route to get all users */
  /* GET localhost:3000/users/ */
  app.get('/', (req, res) => {
    User.find().then((users) => {
        return res.json({users})
    })
    .catch((err) => {
        throw err.message
    });
})

  /* Route to create a new user */
  /* POST localhost:3000/users/ */   
  // SIGN UP POST (async)
  app.post('/users', async (req, res) => {
    try {
      // Create User (INSTANTIATE INSTANCE OF MODEL)
      const user = new User(req.body);
      // SAVE INSTANCE OF User MODEL TO DB
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
      return res.json({user: userResult});
    } catch (err) {
      console.log(err.message);
    }
  });



    // LOGIN FORM
    app.get('/login', (req, res) => res.json({message: 'Please login with your username and password.'}));



    // LOGIN (using async/await)
    app.post('/login', async (req, res) => {
      const { username, password } = req.body;
    
      try {
        // Find this user name
        const user = await User.findOne({ username }, 'username password');
    
        if (!user) {
          // User not found
          return res.status(401).send({ message: 'Wrong Username or Password' });
        }
    
        // Check the password
        const isMatch = await user.comparePassword(password);
    
        if (!isMatch) {
          // Password does not match
          return res.status(401).send({ message: 'Wrong Username or password' });
        }
    
        // Create a token
        const token = jwt.sign(
          { _id: user._id, username: user.username },
          process.env.SECRET,
          { expiresIn: '60 days' }
        );
    
        // Set a cookie and 
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        return res.json({message: 'You are now logged in.'});
      } catch (err) {
        console.log(err);
      }
    });

    // LOGOUT
    app.get('/logout', (req, res) => {
      res.clearCookie('nToken');
      return res.json({message: 'You have been logged out.'});
    });
    
    
};

