
Messages = new Mongo.Collection('messages');

var charCodes = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  0: "----",
};

if (Meteor.isClient) {

  // This code only runs on the client
  angular.module('morse',['angular-meteor', 'ngTouch']);

  function onReady() {
    angular.bootstrap(document, ['morse']);
  }

  if (Meteor.isCordova)
    angular.element(document).on('deviceready', onReady);
  else{
    angular.element(document).ready(onReady);
  }

  angular.module('morse').controller('MorseCtrl', ['$scope', '$meteor',
    function ($scope, $meteor) {

      var messages = $meteor.collection( function() {
        return Messages.find({difficulty: 2})
      });

      $scope.message = messages[Math.floor((Math.random() * messages.length))];
      $scope.word = $scope.message.text.split(" ")[0];
      $scope.currLetter = 0;

      $scope.guess = "";
      $scope.currGuess = "";

      function updateCurrentGuess(){
        var guessUpdated = false;
        if ($scope.currGuess.length >= 6){
          $scope.currGuess = "";
        }
        for(var prop in charCodes) {
          if(charCodes.hasOwnProperty(prop) &&
             charCodes[ prop ] == $scope.currGuess) {
              $scope.guess = prop;
              guessUpdated = true;
              break;
          }
        }
        if(!guessUpdated)
          $scope.guess = "?";
        if( $scope.guess == $scope.message.text.charAt($scope.currLetter).toLowerCase())
        {
          $scope.currLetter += 1;
          if ($scope.message.text.charAt($scope.currLetter) == " ")
          {
            $scope.currLetter += 1;
            $scope.word = $scope.message.text.slice($scope.currLetter).split(" ")[0];
            getConversion();
          }
          resetGuess();
          getConversion();
        }
        $scope.$apply();
      }

      function resetGuess() {
        $scope.currGuess = "";
        $scope.guess = "";
      }

      function getConversion () {

        var encoded = ''
        var chars = $scope.word.toLowerCase().split("");

        for (i = 0; i < chars.length; i++) {
          debugger;
          if (chars[i] != " ") {
            if (charCodes[chars[i]]) {
              encoded += charCodes[chars[i]] + " ";
            }
          }
        }
        $scope.conversion = encoded;
      };
      getConversion();

      // how many milliseconds is a long press?
      var longpress = 150;
      // holds the start time
      var start;

      $("#tapArea" ).on( 'mousedown', function( e ) {
          start = new Date().getTime();
      });
      $("#tapArea" ).on( 'mouseleave', function( e ) {
          start = 0;
      });
      $("#tapArea").on( 'mouseup', function( e ) {
          if (new Date().getTime() >= (start + longpress)) {
             $scope.currGuess = $scope.currGuess + "-";
          } else {
             $scope.currGuess = $scope.currGuess + ".";
          }
          updateCurrentGuess();
      });

  }]); // end of controller

}
