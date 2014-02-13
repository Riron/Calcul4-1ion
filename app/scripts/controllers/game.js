'use strict';

angular.module('calculationApp')
  .controller('GameCtrl', function ($scope, $timeout, $routeParams, $localStorage, Restangular, $location) {
    $scope.keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, 'Pass'];
    $scope.answers = [];
    //Init score to 0
    $scope.score = 0;
    $scope.input = '?';
    // Init time left to 60 sec
    $scope.partyTime = 60;
    $scope.timeLeft = $scope.partyTime;
    // Game started or not ?
    $scope.gameStarted = false;
    // Init question to questions[0]
    var questionNumber = 0;
    // Var to display previous question and previous answer
    $scope.previousQuestion = 'Tap to start';
    $scope.previousAnswer = '';
    // First stat screen text
    $scope.continue = 'Sending results...';

    // Init boolean to display tick or cross for previous question
    $scope.correctAnswer = true;
    // Init stats object for game end
    $scope.stats = {};
    // Store party ID and round Number
    $scope.partyId = $routeParams.partyId;
    $scope.roundNumber = $routeParams.roundNumber;
    // Path to send round results
    var sendResult = Restangular.all('pushRoundResult');
    // Path to get round questions
    var getRoundData = Restangular.all('getRoundData');

    // Loader
    $scope.loading = true;

    getRoundData.post({partyId: $routeParams.partyId, roundNumber: $routeParams.roundNumber}).then(function(response) {
      console.log(response);
      // Set questions array, question, and next question vars
      $scope.questions = response.questions;
      $scope.question = $scope.questions[questionNumber].operation;
      $scope.nextQuestion = $scope.questions[questionNumber+1].operation;
      $scope.loading = false;
    });

    // Handle answer
    $scope.giveAnswer = function(answer) {
      // Start countdown if needed
      if(!$scope.gameStarted) {
        $scope.gameStarted = true;
        $scope.countdown();
      }
      // Ik key presses is "erase" or "pass"
      if(typeof answer === 'string'){
        // Go to next question
        if(answer === 'Pass'){
          $scope.checkAnswer(':(');
        }
        // Substring last character
        else {
          $scope.input = $scope.input.substring(0, $scope.input.length-1);
        }
      }
      else{
        if($scope.input === '?'){
          $scope.input = '';
        }
        $scope.input += answer;
        if($scope.input.length === $scope.questions[questionNumber].answer.toString().length){
          $scope.checkAnswer($scope.input);
        }
      }
    };

    // Check if answer is correct, updates score and displays next question
    $scope.checkAnswer = function(answer) {
      // Store previous answer for display
      $scope.previousAnswer = '= '+answer;
      // If answer is correct, +5
      if($scope.questions[questionNumber].answer.toString() === answer){
        $scope.correctAnswer = true;
        $scope.handleScore(true);
        // Store answer
        $scope.answers.push({'answer': answer, 'correct': true});
      }
      // Else -3 or set score to 0 if score is already < 3
      else{
        $scope.correctAnswer = false;
        $scope.handleScore(false);
        // Store answer
        $scope.answers.push({'answer': answer, 'correct': false});
      }
      // Increment question number and fetch question
      questionNumber += 1;
      // If we reached the end, restart to 0
      if(questionNumber === $scope.questions.length){
        questionNumber = 0;
      }
      $scope.previousQuestion = $scope.question;
      $scope.question = $scope.questions[questionNumber].operation;
      $scope.nextQuestion = $scope.questions[questionNumber+1].operation;
      $scope.input = '?';
    };

    $scope.handleScore = function(correctAnswerBoolean) {
      if(correctAnswerBoolean === true){
        $scope.score += 5;
        $scope.scoreChange = '+5';
        $scope.correct = true;
        $timeout(function() {
          $scope.correct = false;
        }, 400);
      }
      else {
        if($scope.score >= 3){
          $scope.score -= 3;
          $scope.scoreChange = '-3';
          $scope.correct = true;
          $timeout(function() {
            $scope.correct = false;
          }, 400);
        }
        else{
          $scope.score = 0;
        }
      }
    };

    $scope.countdown = function() {
      $scope.timeLeft -= 1;
      if($scope.timeLeft > 0){
        $timeout($scope.countdown, 1000);
      }
      else {
        console.log('game ended');
        // Analyse party for stats
        var correctAnswers = [];
        angular.forEach($scope.answers, function(value){
          if(value.correct === true){
            this.push(value);
          }
        }, correctAnswers);

        // Calculate stats
        $scope.stats.precision = correctAnswers.length / $scope.answers.length;
        $scope.stats.speed = $scope.answers.length / $scope.partyTime;
        
        // Send round result to server
        sendResult.post({partyId: $scope.partyId, username: $localStorage.username, score: $scope.score, round: $scope.roundNumber}).then(function(response) {
          if('error' in response){
            $scope.error = response.error;
          }
          else if('status' in response){
            console.log('Results sent');
          }
          // Wait for results to be sent before allowing to switch to next screen
          $scope.timeoutBeforeStats = true;
          $scope.continue = 'Tap to continue...';
        }, function() {
          console.log('There was an error connecting');
        });
      }
    };

    // Continue to stats screen
    $scope.continueToStats = function() {
      if($scope.timeoutBeforeStats) {
        $location.path('results/'+$scope.partyId+'/'+$scope.roundNumber);
      }
    };
  });