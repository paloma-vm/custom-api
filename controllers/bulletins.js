const Bulletin = require('../models/bulletin');
const User = require('../models/user');

module.exports = (app) => {
  // INDEX
  app.get('/bulletins', async (req, res) => {
    try {
      const currentUser = req.user;
      const bulletins = await Bulletin.find({}).lean().populate('postedBy');
      return res.json({ bulletins, currentUser });
    } catch (err) {
      console.log(err.message);
    }
  });

  // CREATE (async)
  app.post('/bulletins/new', async (req, res) => {
    console.log(req.body);
    if (req.user) {
      // INSTANTIATE INSTANCE OF BULLETIN MODEL
      const userId = req.user._id;
      const bulletin = new Bulletin(req.body);
      bulletin.postedBy = userId;
   
      try {
        // SAVE INSTANCE OF BULLETIN MODEL TO DB
        await bulletin.save();
        const user = await User.findById(userId);
        user.bulletins.unshift(bulletin);
        await user.save();
        // Return the new bulletin object
        return res.json({bulletin});
    } catch (err) {
      console.log(err.message);
    }
    } else {
      return res.status(401).json({ error: 'Unauthorized' }); // UNAUTHORIZED
    }
  });

  app.get('/bulletins/new', (req, res) => {
    res.json({message: 'Create a new bulletin.'})
  })

  /* SHOW (LOOK UP bulletin) async  */
  app.get('/bulletins/:id', async (req, res) => {
    try {
      const currentUser = req.user;
      const bulletin = await Bulletin.findById(req.params.id).lean();
      res.json({ bulletin, currentUser });
    } catch(err) {
      console.log(err.message);
    }
  });
     
  /* LOOK UP BOARD */
  // async version
  app.get('/b/:board', async (req, res) => {
    try {
      const { user } = req;
      const bulletins = await Bulletin.find({ board: req.params.board }).lean()
      return res.json({ bulletins, user });
    } catch (err) {
      console.log(err.message);
    }
    console.log(req.params.board);
  });
};