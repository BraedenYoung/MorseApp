
Messages = new Mongo.Collection('messages');

var charCodes = {
  a: ".- ",
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

// Object.prototype.getKeyByValue = function( value ) {
//     for( var prop in this ) {
//         if( this.hasOwnProperty( prop ) ) {
//              if( this[ prop ] === value )
//                  return prop;
//         }
//     }
// }


if (Meteor.isClient) {

  // This code only runs on the client
  angular.module('morse',['angular-meteor', 'ngTouch']);

  function onReady() {
    angular.bootstrap(document, ['morse']);
  }

  if (Meteor.isCordova)
    angular.element(document).on('deviceready', onReady);
  else
    angular.element(document).ready(onReady);


  angular.module('morse').controller('MorseCtrl', ['$scope', '$meteor',
    function ($scope, $meteor) {

      // $scope.messages = $meteor.collection(Messages);

      var messages = $meteor.collection( function() {
        return Messages.find({difficulty: 2})
      });

      $scope.message = messages[Math.floor((Math.random() * messages.length))];
      $scope.word = $scope.message.text.split(" ")[0];

      $scope.getConversion = function () {

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

      $scope.currGuess = '';
      $scope.guess = function() {
        if ($scope.currGuess.length >= 6){
          $scope.currGuess = '';
        }
        for( var prop in charCodes ) {
                if( charCodes.hasOwnProperty( prop ) ) {
                     if( charCodes[ prop ] == $scope.currGuess )
                         return prop;
                }
            }



      };


  }]); // end of controller


  // Add this directive where you keep your directives
  angular.module('morse').directive('onLongPress', function ($timeout, $parse) {

    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {

          var timeoutHandler;
          elem.bind('touchstart', function() {
            timeoutHandler = $timeout(function() {
              scope.$eval(attrs.onLongPress);
            }, 600);
          });

          elem.bind('touchend', function() {
            $timeout.cancel(timeoutHandler);
          });

          }
      };
  });// End of directive

}
