var Item = require('../models/item.js');
var User = require('../models/user.js');
var Comment = require('../models/comment.js');

exports.home = function(req, res, next) {
  res.sendFile(process.cwd() + '/public/views/index.html');
}

exports.getLogin = function(req, res, next) {
  console.log('getLogin')
  console.log(req.user.username);
  console.log(req.user.id);

  User.findOne({
    username: req.user.username
  })
  .select('username money collectedItems')
  .exec()
  .then(function(user) {
    res.json(user);
  });
}

exports.logout = function(req, res, next) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
}

exports.getItems = function(req, res, next) {
  Item.find({})
  .populate('_owner', 'username')
  .populate({
    path: 'comments',
    populate: {
      path: '_owner',
      select: 'username'
    }
  })
  .exec().then(function(items) {
    console.log(items);
    res.json(items);
  });
}

exports.addComment = function(req, res, next) {
  var itemName = req.body.itemName;
  var commentMsg = req.body.commentMsg;
  var comment = new Comment({
    commentMsg: commentMsg,
    itemLink: itemName
  });

  comment.save(function(err) {
    if(err) throw err;
    Item.update({
      itemName: itemName
    }, {
      $push: { comments: comment._id }
    }, function(err, updated) {
      if(err) throw err;
      res.json({});
    });
  });
}

exports.newItem = function(req, res, next) {
  var itemName = req.body.itemName;
  var itemDescription = req.body.itemDescription;
  var itemPrice = req.body.itemPrice;
  var item = new Item({
    itemName: itemName,
    itemDescription: itemDescription,
    itemPrice: itemPrice,
  });

  item.save(function(err) {
    if(err) throw err;
    res.json({});
  })
}

exports.buyItem = function(req, res, next) {
  Item.findOneAndUpdate({
    _id: req.body.itemId
  }, {
    $set: { 'itemSold': true }
  }, function(err, updated) {
    if(err) throw err;
    console.log('updated!');
    console.log(req.user.id);
    debugger;
    User.findOneAndUpdate({
      _id: req.user.id
    }, {
      $set: {
        money: req.body.userMoney
      },
      $push: {
        'collectedItems': updated._doc.itemName
      }
    }, function(err, user) {
      if(err) throw err;
    })
    res.json({});
  });
}