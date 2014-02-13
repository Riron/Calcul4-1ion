'use strict';

angular.module('calculationApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'restangular',
  'ngStorage',
  'ngTouch'
])
  .config(function ($routeProvider, RestangularProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/game/:partyId/:roundNumber', {
        templateUrl: 'views/game.html',
        controller: 'GameCtrl'
      })
      .when('/results/:partyId/:roundNumber', {
        templateUrl: 'views/results.html',
        controller: 'ResultsCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/challenge', {
        templateUrl: 'views/challenge.html',
        controller: 'ChallengeCtrl'
      })
      .when('/newGame', {
        templateUrl: 'views/newgame.html',
        controller: 'NewgameCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    RestangularProvider.setBaseUrl('http://rlier.fr:8282');
  })
  .run(function($rootScope, userService, $location){
    $rootScope.$on('$routeChangeStart', function (event, next) {
      if(!userService.isLogged()){
        if (next.templateUrl === 'partials/login.html') {
            // already going to the login route, no redirect needed
        }
        else {
          $location.path('/login');
        }
      }
    });
  });
