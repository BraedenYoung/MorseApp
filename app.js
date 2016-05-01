
Messages = new Mongo.Collection('messages');

if (Meteor.isClient) {
  angular.module('morse', ['angular-meteor', 'ui.router']);

  angular.module('morse').config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
    .state('home', {
      url: "/",
      template: '<home></home>'
    })
    .state('morse', {
      url: "/morse",
      template: '<morse></morse>',
    })
    .state('success', {
      url: "/success",
      template: '<success></success>'
    })
    .state('failure', {
      url: "/failure",
      template: '<failure></failure>'
    });
    $urlRouterProvider.otherwise("/");
  }
);

angular.module('morse').directive('home', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/home/home.html',
    controller: function ($scope, $stateParams, $meteor) {
      var backgroundColors = [
        "#5EBBB4",
        "#DDAA4C",
        "#DD5761",
        "#59AF72",
        "#695F84",
        "#4D4B52",
        "#ED8268"
      ];

      $("body").css("background-color", backgroundColors[Math.floor(Math.random() * backgroundColors.length)]);

      $("#1").click(changeSelected).hover(showHighlight, hideHighlight);
      $("#2").click(changeSelected).hover(showHighlight, hideHighlight);
      $("#3").click(changeSelected).hover(showHighlight, hideHighlight);
      $("#4").click(changeSelected).hover(showHighlight, hideHighlight);
      $("#5").click(changeSelected).hover(showHighlight, hideHighlight);

      function changeSelected()
      {
        removeShowBorderFromAll();
        $(this).addClass("showBorder");

        $scope.difficulty = this.id;

      }

      function removeShowBorderFromAll()
      {
        $("#1").removeClass("showBorder");
        $("#2").removeClass("showBorder");
        $("#3").removeClass("showBorder");
        $("#4").removeClass("showBorder");
        $("#5").removeClass("showBorder");
      }

      function showHighlight()
      {
        $(this).css('background', 'rgba(0, 0, 0, 0.2)');
      }

      function hideHighlight()
      {
        $(this).css('background', '');
      }

    }
  }
});

angular.module('morse').directive('morse', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/morse/morse.html',
    controller: function ($scope, $stateParams, $meteor,) {

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

      var backgroundColors = [
        "#5EBBB4",
        "#DDAA4C",
        "#DD5761",
        "#59AF72",
        "#695F84",
        "#4D4B52",
        "#ED8268"
      ];

      $scope.duration;
      $scope.timer;

      $scope.sentencePosition = 0;

      $scope.guess = "";
      $scope.currGuess = "";
      $scope.currLetter = 0;

      $scope.message = "";
      $scope.word = "";

      var messages = $meteor.collection( function() {
        // Route with difficulty query param doesn't work
        // var urlParam = parseInt(location.pathname.slice(-1));

        return Messages.find({difficulty: 2})
      });

      function getMessage() {

        $scope.message = messages[Math.floor((Math.random() * messages.length))];

        if ($scope.message)
        $scope.word = $scope.message.text.split(" ")[0];

        $scope.sentencePosition = 0;
      }
      getMessage();

      function resetGuess() {
        $scope.currGuess = "";
        $scope.guess = "";
      }

      function updateCurrentGuess(){
        var guessUpdated = false;
        if ($scope.currGuess.length >= 6){
          resetGuess();
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
        else if($scope.guess == $scope.message.text.charAt($scope.sentencePosition).toLowerCase())
        {
          getNextWord();
        }
        debugger;
        $scope.$apply();
      }

      function getNextWord() {
        $scope.sentencePosition += 1;
        $scope.currLetter += 1;
        resetGuess();
        if ($scope.sentencePosition >= $scope.message.text.length) {


          $("body").css("background-color", backgroundColors[Math.floor(Math.random() * backgroundColors.length)]);

          getMessage();
        } else if ($scope.message.text.charAt($scope.sentencePosition) == " ") {
          $scope.sentencePosition += 1;
          $scope.word = $scope.message.text.slice($scope.sentencePosition).split(" ")[0];
        } else {
          return;
        }
        $scope.duration = $scope.timer = $scope.word.length/1.5 * 100;
        getConversion();
        $scope.currLetter = 0;
      }

      function getConversion () {
        var encoded = ''
        var chars = $scope.word.toLowerCase().split("");

        for (i = 0; i < chars.length; i++) {
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
      $scope.onShortPress = function () {
        $scope.currGuess += ".";
        updateCurrentGuess();
      }

      $scope.onLongPress = function () {
        $scope.currGuess += "-";
        updateCurrentGuess();
      }

      if (!Meteor.isCordova) {
        $("#tapArea" ).on( 'mousedown', function( e ) {
          start = new Date().getTime();
        });
        $("#tapArea" ).on( 'mouseleave', function( e ) {
          start = 0;
        });
        $("#tapArea").on( 'mouseup', function( e ) {
          if (new Date().getTime() >= (start + longpress)) {
            $scope.onLongPress();
          } else {
            $scope.onShortPress();
          }
        });
      }
    }
  }
});

angular.module('morse').directive('timer', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/morse/timer.html',
    controller: function ($scope, $stateParams) {

      var timerStarted = false;

      function resetGuess() {
        $scope.currGuess = "";
        $scope.guess = "";
      }

      function startTimer() {
        $scope.duration = Math.ceil($scope.word.length/1.5) * 100;
        $scope.timer = $scope.duration;

        setInterval(function () {

          redrawCircle(Math.ceil(($scope.timer/$scope.duration)*100) / 100);
          if (--$scope.timer < 0) {
            resetGuess();
            $scope.currLetter = 0;

            $scope.timer = $scope.duration;
          }
        }, 100);
      }
      if (!$scope.timerStarted)
      {
        timerStarted = true;
        startTimer();
      }

      var el = document.getElementById('graph'); // get canvas

      var options = {
        size: el.getAttribute('data-size') || 220,
        lineWidth: el.getAttribute('data-line') || 15,
        rotate: el.getAttribute('data-rotate') || 0
      }

      var canvas = document.getElementById('circle');

      if (typeof(G_vmlCanvasManager) !== 'undefined') {
        G_vmlCanvasManager.initElement(canvas);
      }

      var ctx = canvas.getContext('2d');
      canvas.width = canvas.height = options.size;

      el.appendChild(canvas);

      ctx.translate(options.size / 2, options.size / 2); // change center
      ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

      //imd = ctx.getImageData(0, 0, 240, 240);
      var radius = (options.size - options.lineWidth) / 2;

      var redrawCircle = function(percent) {

        // Store the current transformation matrix
        ctx.save();

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Restore the transform
        ctx.restore();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        drawCircle(options.lineWidth, 100 / 100);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        drawCircle(options.lineWidth, percent);
      }

      var drawCircle = function(lineWidth, percent) {

        percent = Math.min(Math.max(0, percent || 1), 1);

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
        ctx.lineCap = 'round'; // butt, round or square
        ctx.lineWidth = lineWidth
        ctx.stroke();
      };

    }
  }
});
}
