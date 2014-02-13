'use strict';

angular.module('calculationApp')
  .factory('userService', function ($localStorage, Restangular, $location) {
    // Service logic
    var _this = this;
    _this.logged = $localStorage.isLogged;
    var loginRoute = Restangular.all('login');
    var signupRoute = Restangular.all('signup');

    // Public API here
    return {
      isLogged: function() {
        return _this.logged;
      },
      loginInternal: function(login, password) {
        loginRoute.post({type: 'internal', login: login, password: password}).then(function(response) {
          console.log('Requested token');
          console.log(response);
          // If error is returned, send error to login screen
          if('error' in response){
            return response.error;
          }
          // Else, if we have a token sent back, store data and redirect to home
          else if('token' in response){
            $localStorage.token = response.token;
            $localStorage.username = login;
            $localStorage.isLogged = true;
            _this.logged = true;
            $location.path('/');
          }
        }, function() {
          console.log('There was an error connecting');
        });
      },
      signup: function(firstName, lastName, email, username, password) {
        signupRoute.post({firstname: firstName, lastname: lastName, email: email, accounts: [{type: 'internal', username: username, password: password}] }).then(function(response) {
          console.log('Requested token');
          console.log(response);
          if('error' in response){
            return response.error;
          }
          else if('token' in response){
            this.loginInternal(username, password);
          }
        }, function() {
          console.log('There was an error connecting');
        });
      }
    };
  });
