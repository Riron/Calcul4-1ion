'use strict';

angular.module('calculationApp')
  .controller('AppCtrl', function ($scope, $location) {
    // Change path when link is "touched"
		$scope.link = function(link) {
			$location.path(link);
		};
  });
