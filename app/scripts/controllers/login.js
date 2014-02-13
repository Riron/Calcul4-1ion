'use strict';

angular.module('calculationApp')
  .controller('LoginCtrl', function ($scope, userService) {
    $scope.error = '';

    // Connection
    $scope.connect = function() {
			$scope.error = userService.loginInternal($scope.login, $scope.password);
		};
  });
