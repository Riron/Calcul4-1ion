'use strict';

angular.module('calculationApp')
  .controller('SignupCtrl', function ($scope, userService) {
		
		// Sign up
		$scope.signup = function() {
			$scope.error = userService.signup($scope.firstName, $scope.lastName, $scope.email, $scope.username, $scope.password);
		};
  });
