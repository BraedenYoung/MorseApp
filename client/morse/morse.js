//
//
// var charCodes = {
//   a: ".-",
//   b: "-...",
//   c: "-.-.",
//   d: "-..",
//   e: ".",
//   f: "..-.",
//   g: "--.",
//   h: "....",
//   i: "..",
//   j: ".---",
//   k: "-.-",
//   l: ".-..",
//   m: "--",
//   n: "-.",
//   o: "---",
//   p: ".--.",
//   q: "--.-",
//   r: ".-.",
//   s: "...",
//   t: "-",
//   u: "..-",
//   v: "...-",
//   w: ".--",
//   x: "-..-",
//   y: "-.--",
//   z: "--..",
//   1: ".----",
//   2: "..---",
//   3: "...--",
//   4: "....-",
//   5: ".....",
//   6: "-....",
//   7: "--...",
//   8: "---..",
//   9: "----.",
//   0: "----",
// };
//
// var backgroundColors = [
//   "#5EBBB4",
//   "#DDAA4C",
//   "#DD5761",
//   "#59AF72",
//   "#695F84",
//   "#4D4B52",
//   "#ED8268"
// ];
//
// var timerStarted = false;
// var duration, timer;
//
//
// if (Meteor.isClient) {
//
//
//   function onReady() {
//     angular.bootstrap(document, ['morse']);
//   }
//
//   if (Meteor.isCordova)
//     angular.element(document).on('deviceready', onReady);
//   else{
//     angular.element(document).ready(onReady);
//   }
//
//   angular.module('morse').controller('MorseCtrl', ['$scope', '$meteor',
//     function ($scope, $meteor) {
//
//       $scope.sentencePosition = 0;
//
//       $scope.guess = "";
//       $scope.currGuess = "";
//       $scope.currLetter = 0;
//
//       $scope.message = "";
//       $scope.word = "";
//
//       var messages = $meteor.collection( function() {
//         return Messages.find({difficulty: 2})
//       });
//
//       function getMessage() {
//         $scope.message = messages[Math.floor((Math.random() * messages.length))];
//
//         if ($scope.message)
//           $scope.word = $scope.message.text.split(" ")[0];
//
//         $scope.sentencePosition = 0;
//       }
//       getMessage();
//
//       function updateCurrentGuess(){
//         var guessUpdated = false;
//         if ($scope.currGuess.length >= 6){
//           resetGuess();
//         }
//         for(var prop in charCodes) {
//           if(charCodes.hasOwnProperty(prop) &&
//              charCodes[ prop ] == $scope.currGuess) {
//               $scope.guess = prop;
//               guessUpdated = true;
//               break;
//           }
//         }
//         if(!guessUpdated)
//           $scope.guess = "?";
//         else if($scope.guess == $scope.message.text.charAt($scope.sentencePosition).toLowerCase())
//         {
//           getNextWord();
//         }
//         debugger;
//         $scope.$apply();
//       }
//
//       function resetGuess() {
//         $scope.currGuess = "";
//         $scope.guess = "";
//       }
//
//       function getNextWord() {
//         $scope.sentencePosition += 1;
//         $scope.currLetter += 1;
//         resetGuess();
//         if ($scope.sentencePosition >= $scope.message.text.length) {
//           getMessage();
//         } else if ($scope.message.text.charAt($scope.sentencePosition) == " ") {
//           $scope.sentencePosition += 1;
//           $scope.word = $scope.message.text.slice($scope.sentencePosition).split(" ")[0];
//         } else {
//           return;
//         }
//         duration = timer = $scope.word.length/1.5 * 100;
//         getConversion();
//         $scope.currLetter = 0;
//       }
//
//       function getConversion () {
//         var encoded = ''
//         var chars = $scope.word.toLowerCase().split("");
//
//         for (i = 0; i < chars.length; i++) {
//           if (chars[i] != " ") {
//             if (charCodes[chars[i]]) {
//               encoded += charCodes[chars[i]] + " ";
//             }
//           }
//         }
//         $scope.conversion = encoded;
//       };
//       getConversion();
//
//       function startTimer() {
//           duration = Math.ceil($scope.word.length/1.5) * 100;
//           timer = duration;
//
//           $("body").css("background-color", backgroundColors[Math.floor(Math.random() * backgroundColors.length)]);
//
//           setInterval(function () {
//
//               redrawCircle(Math.ceil((timer/duration)*100) / 100);
//               if (--timer < 0) {
//                 resetGuess();
//                 $scope.currLetter = 0;
//
//                 timer = duration;
//               }
//           }, 100);
//       }
//       if (!timerStarted)
//       {
//         timerStarted = true;
//         startTimer();
//       }
//
//
//
//
//       // how many milliseconds is a long press?
//       var longpress = 150;
//       // holds the start time
//       var start;
//
//
//
//       $scope.onShortPress = function () {
//         $scope.currGuess += ".";
//         updateCurrentGuess();
//       }
//
//       $scope.onLongPress = function () {
//         $scope.currGuess += "-";
//         updateCurrentGuess();
//       }
//
//       // $("#tapArea").on( 'taphold', function () {
//       //     event.preventDefault();
//       //     $scope.currGuess += "-";
//       //     updateCurrentGuess();
//       // });
//
//
//
//       var el = document.getElementById('graph'); // get canvas
//
//       var options = {
//           size: el.getAttribute('data-size') || 220,
//           lineWidth: el.getAttribute('data-line') || 15,
//           rotate: el.getAttribute('data-rotate') || 0
//       }
//
//       var canvas = document.getElementById('circle');
//
//       if (typeof(G_vmlCanvasManager) !== 'undefined') {
//           G_vmlCanvasManager.initElement(canvas);
//       }
//
//       var ctx = canvas.getContext('2d');
//       canvas.width = canvas.height = options.size;
//
//       el.appendChild(canvas);
//
//       ctx.translate(options.size / 2, options.size / 2); // change center
//       ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg
//
//       //imd = ctx.getImageData(0, 0, 240, 240);
//       var radius = (options.size - options.lineWidth) / 2;
//
//       var redrawCircle = function(percent) {
//
//           // Store the current transformation matrix
//           ctx.save();
//
//           // Use the identity matrix while clearing the canvas
//           ctx.setTransform(1, 0, 0, 1, 0, 0);
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//           // Restore the transform
//           ctx.restore();
//
//           ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
//           drawCircle(options.lineWidth, 100 / 100);
//
//           ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
//           drawCircle(options.lineWidth, percent);
//       }
//
//       var drawCircle = function(lineWidth, percent) {
//
//           percent = Math.min(Math.max(0, percent || 1), 1);
//
//           ctx.beginPath();
//           ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
//           ctx.lineCap = 'round'; // butt, round or square
//           ctx.lineWidth = lineWidth
//           ctx.stroke();
//       };
//
//
//       if (!Meteor.isCordova) {
//         $("#tapArea" ).on( 'mousedown', function( e ) {
//             start = new Date().getTime();
//         });
//         $("#tapArea" ).on( 'mouseleave', function( e ) {
//             start = 0;
//         });
//         $("#tapArea").on( 'mouseup', function( e ) {
//             if (new Date().getTime() >= (start + longpress)) {
//               $scope.onLongPress();
//             } else {
//               $scope.onShortPress();
//             }
//         });
//       }
//
//   }]); // end of controller
//
//   // Add this directive where you keep your directives
//    angular.module('morse').directive('onLongPress', function ($timeout, $parse) {
//
//      //Global variable, to cancel timer on touchend.
//     var timer;
//
//     return {
//         restrict: 'A',
//         link: function($scope, $elm, $attrs) {
//             $elm.bind('touchstart', function(evt) {
//                 // Locally scoped variable that will keep track of the long press
//                 $scope.longPress = true;
//
//                 // We'll set a timeout for 600 ms for a long press
//                 timer = $timeout(function() {
//                     if ($scope.longPress) {
//                         // If the touchend event hasn't fired,
//                         // apply the function given in on the element's on-long-press attribute
//                         $scope.$apply(function() {
//                             $scope.$eval($attrs.onLongPress)
//                         });
//                     }
//                 }, 300);
//                 timer;
//             });
//
//             $elm.bind('touchend', function(evt) {
//
//                 // Prevent on quick presses, unwanted onLongPress selection.
//                 $timeout.cancel(timer);
//
//                 // If there is an on-touch-end function attached to this element, apply it
//                 if (!$scope.longPress) {
//                     $scope.$apply(function() {
//                         $scope.$eval($attrs.onShortPress)
//                     });
//                 }
//
//                 // Prevent the onLongPress event from firing
//                 $scope.longPress = false;
//
//             });
//         }
//     };
//   });// End of directive
//
//
// }
