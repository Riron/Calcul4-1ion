'use strict';

angular.module('calculationApp')
  .controller('ChallengeCtrl', function ($scope, Restangular, $localStorage, $location) {
    var searchFriends = Restangular.all('findFriends');
    var addFriend = Restangular.all('addFriend');
    var listFriends = Restangular.all('listFriends');
    var challenge = Restangular.all('challenge');
    $scope.searchResults = [];
    $scope.friends = [];

    // Loader
    $scope.loading = true;

    // Search for friends
    $scope.searchFriends = function() {
			$scope.loading = true;
			searchFriends.post({search: $scope.search}).then(function(response) {
			  console.log(response);
			  if('error' in response){
					$scope.errorSearch = response.error;
			  }
			  else if('friends' in response){
					$scope.searchResults = [];
					angular.forEach(response.friends, function(value){
					  if(value.accounts[0].username !== $localStorage.username && $scope.friends.indexOf(value.accounts[0].username) === -1) {
							this.push(value);
					  }
					}, $scope.searchResults);
			  }
			  $scope.loading = false;
			}, function() {
			  console.log('There was an error connecting');
			});
    };

    // Add friend to friend list
    $scope.addFriend = function(friendId) {
			addFriend.post({id: $localStorage.token, idFriend: friendId}).then(function(response) {
			  console.log(response);
			  if('error' in response){
					$scope.errorSearch = response.error;
			  }
			  else if('friends' in response){
					$scope.listFriends();
					$scope.searchResults = [];
			  }
			}, function() {
			  console.log('There was an error connecting');
			});
    };

    // List user friends
    $scope.listFriends = function() {
			listFriends.post({id: $localStorage.token}).then(function(response) {
			  if('error' in response){
					$scope.errorFriends = response.error;
			  }
			  else if('friends' in response){
					angular.forEach(response.friends, function(value){
					  this.push(value);
					}, $scope.friends);
					console.log($scope.friends);
			  }
			  // Loader to false
				$scope.loading = false;
			}, function() {
			  console.log('There was an error connecting');
			});
    };

    // Launch game against friend
    $scope.playWith = function(friendUsername) {
			challenge.post({username: $localStorage.username, friendUsername: friendUsername}).then(function(response) {
			  console.log(response);
			  if('error' in response){
					$scope.errorSearch = response.error;
			  }
			  else if('status' in response){
					// Redirect to game
					$location.path('/game/'+response.partyId+'/1');
			  }
			}, function() {
			  console.log('There was an error connecting');
			});
    };

    $scope.listFriends();
  });
