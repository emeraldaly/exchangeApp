var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var db = 'mongodb://localhost/exchangeSite';
mongoose.connect(db)

var itemSchema = new Schema({
  _owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  itemName: String,
  itemDescription: String,
  itemPrice: Number,
  itemSold: Boolean,
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

var userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  money: Number,
  collectedItems: [{
    type: String
  }]
  
});

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

var commentSchema = new Schema({
  _owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  itemLink: String,
  commentMsg: String
});


Comment = mongoose.model('Comment', commentSchema);
Item = mongoose.model('Item', itemSchema);
User = mongoose.model('User', userSchema);

var user1 = new User({
  username: 'sellerextraordinaire',
  password: 'notsecurepassword',
  money: 25000,
  collectedItems: []
});

user1.save(function(err) {
  if(err) throw err;
  var comment1 = new Comment({
    commentMsg: "This is an excellent product.",
    _owner: user1.id,
    itemLink: "Shark Vaccuum"
  });

  var comment2 = new Comment({
    commentMsg: "Quality can not be beat",
    _owner: user1.id,
    itemLink: "Citizen Bike"
  });

  comment1.save(function(err) {
    if(err) throw err;
    comment2.save(function(err) {
      if(err) throw err;
    });
  });

  var item1 = new Item({
    itemName: 'Shark Vaccuum',
    itemDescription: "A great way to keep your home clean.",
    itemPrice: 240,
    itemSold: false
  });
  item1.save(function(err) {
    if(err) throw err;

    Item.update({
      itemName: 'Shark Vaccuum'
    }, {
      $push: {
        comments: comment1._id
      }
    }).exec(function(err) {
      if(err) throw err;
      console.log('Item 1 loaded');
    });
  });
  var item2 = new Item({
    itemName: 'Citizen Bike',
    itemDescription: "A cute, foldable bike to get around town.",
    itemPrice: 450,
    itemSold: false
  });
  item2.save(function(err) {
    if(err) throw err;

    Item.update({
      itemName: 'Citizen Bike'
    }, {
      $push: {
        comments: comment2._id
      }
    }).exec(function(err) {
      if(err) throw err;
      console.log('Item 2 loaded');
    });
  });
});

var user2 = new User({
  username: 'Looking2Buy',
  password: 'notsecurefosure',
  money: 10000,
  collectedItems: []
});

user2.save(function(err) {
  if(err) throw err;
  var comment1 = new Comment({
    commentMsg: "This helps me keep my house clean!",
    _owner: user2.id,
    itemLink: "Shark Vaccuum"
  });

  var comment2 = new Comment({
    commentMsg: "I can get all around town! Easy to store.",
    _owner: user2.id,
    itemLink: "Citizen Bike"
  });

  comment1.save(function(err) {
    if(err) throw err;
    comment2.save(function(err) {
      if(err) throw err;
    });
  });

  Item.update({
    itemName: 'Shark Vaccuum'
  }, {
    $push: {
      comments: comment1._id
    }
  }).exec(function(err) {
    if(err) throw err;
    console.log('Item 1 comments loaded');
  });

  Item.update({
    itemName: 'Citizen Bike'
  }, {
    $push: {
      comments: comment2._id
    }
  }).exec(function(err) {
    if(err) throw err;
    console.log('Item 2 comments loaded');
  });
});