'use strict';

angular.module('calculationApp')
  .directive('resultText', function () {
    return {
      template: '<p>You {{word}} {{party.ownScore}} to {{party.opponentScore}}</p>',
      restrict: 'AE',
      link: function(scope) {
				if(scope.party.ownScore > scope.party.opponentScore) {
					scope.word = 'won';
				}
				else if(scope.party.ownScore < scope.party.opponentScore) {
					scope.word = 'lost';
				}
				else {
					scope.word = 'tied ! ';
				}
      }
    };
  });
