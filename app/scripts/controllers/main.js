'use strict';

angular.module('calculationApp')
  .controller('MainCtrl', function ($scope, Restangular, $localStorage) {
		// Path to list unfinished parties
		var liveParties = Restangular.all('getOwnParties');

		// Init parties arrays. Parties which I can play, which I have to wait for the opponent to play, and which are finished
		$scope.livePartiesToPlay = [];
		$scope.livePartiesWait = [];
		$scope.finishedParties = [];

		// Loader
		$scope.loading = true;

		// Get all parties
		$scope.getOwnParties = function() {
			liveParties.post({username: $localStorage.username}).then(function(response) {
			  if('error' in response){
					$scope.errorFriends = response.error;
			  }
			  else if('parties' in response){
					// If parties are fetched, sort then by finished / on going
					angular.forEach(response.parties, function(value){
						if(value.finished === true) {
							$scope.generateFinishedPartyResult(value);
						}
						// If unfinished, test if it's my turn or not
						else {
							$scope.dispatchLiveParties(value);
						}
					});
			  }
			  $scope.loading = false;
			}, function() {
			  console.log('There was an error connecting');
			});
		};

		// Return party opponent
		$scope.getOpponent = function(party) {
			var opponent = '';
			angular.forEach(party.players, function(value){
				if(value !== $localStorage.username) {
					opponent = value;
				}
			});
			return opponent;
		};

		$scope.dispatchLiveParties = function(party) {
			var sameRound = true;
			var highestKey = -1;
			party.nextRound = 1;
			// Check if there is a round difference between players
			angular.forEach(party.rounds, function(value, key){
				// If only one result is saved, than only one player can play
				if(value.scores.length === 1) {
					party.nextRound = value.roundNumber;
					if(value.scores[0].username === $localStorage.username) {
						$scope.livePartiesWait.push(party);
					}
					else {
						$scope.livePartiesToPlay.push(party);
					}
					sameRound = false;
				}
				//  If both score are ste, get highest round number played
				else if(value.scores.length === 2) {
					if(key > highestKey) {
						highestKey = key;
						party.nextRound = value.roundNumber+1;
					}
				}
			});
			// If there is not, anyone can play
			if(sameRound) {
				$scope.livePartiesToPlay.push(party);
			}
		};
		$scope.generateFinishedPartyResult = function(party) {
			party.ownScore = 0;
			party.opponentScore = 0;
			// Summation of all rounds scores
			angular.forEach(party.rounds, function(value){
				angular.forEach(value.scores, function(val){
					if(val.username === $localStorage.username) {
						party.ownScore += val.result;
					}
					else {
						party.opponentScore += val.result;
					}
				});
			});
			$scope.finishedParties.push(party);
		};

		$scope.getOwnParties();
  });
