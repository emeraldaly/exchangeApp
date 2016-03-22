angular.module('exchangeSiteApp', [])
.controller('exchangeSiteController', function($scope, $http) {

//log in
  $scope.getLogin = function() {
    $http.get('/loginAction')
    .then(function(response) {
      console.log(response.data);
      $scope.user = response.data;
    });
  };

  $scope.forms = {};
  $scope.login = function() {
    $http.post('/login', {
      username: $scope.forms.username,
      password: $scope.forms.password
    })
    .then(function(user) {
      $scope.getLogin();
    });
  };

  //logout
  $scope.logout = function() {
    $http.get('/logout')
    .then(function(response) {
      $scope.user = null;
    });
  };

  //get items
  $scope.getItems = function() {
    $http.get('/getItems')
    .then(function(response) {
      console.log(response);
      $scope.items = response.data;
      $scope.getLogin();
    });
  };

  //add Comment
  $scope.commentTxt = {};
  $scope.addComment = function(itemName) {
    $http.post('/addComment', {
      itemName: itemName,
      commentMsg: $scope.commentTxt.addComment
    })
    .then(function() {
      $scope.commentTxt.addComment = ''
      $scope.getItems();
    });
  };

  //add item
  $scope.itemTxt = {};
  $scope.newItem = function() {
    $http.post('/newItem', {
      //get fields
      itemName: $scope.itemTxt.name,
      itemDescription: $scope.itemTxt.description,
      itemPrice: $scope.itemTxt.price
    })
    .then(function() {
      //clear fields
      $scope.itemTxt.name = '';
      $scope.itemTxt.description = '';
      $scope.itemTxt.price = '';
      $scope.getItems();
    })
  };

  //buy item
  $scope.buyItem = function(itemId, itemPrice) {
    $scope.user.money = $scope.user.money - itemPrice;
    $http.put('/buyItem', {itemId: itemId, userMoney: $scope.user.money})
    .then(function() {
      $scope.getItems();
    });
  };

}); 