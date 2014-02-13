'use strict';

angular.module('calculationApp')
  .controller('ResultsCtrl', function ($scope, $routeParams, Restangular) {
		// Path to get round results
		var roundResult = Restangular.all('getRoundResult');
		
		roundResult.post({partyId: $routeParams.partyId, roundNumber:$routeParams.roundNumber}).then(function(response) {
			console.log(response);
		  if('error' in response){
				$scope.error = response.error;
		  }
		  else if('status' in response){
				$scope.d3Data = [
					{
					  'itemLabel':'Player 2',
					  'itemValue':198
					},
					{
					  'itemLabel':'Player 1',
					  'itemValue':156
					},
				];
		  }
		}, function() {
		  console.log('There was an error connecting');
		});

		console.log($routeParams.partyId);
	});
