//Background - http://qrohlf.com/trianglify/
function background() {
var pattern = Trianglify({
  width: window.innerWidth,
  height: window.innerHeight,
  cell_size: 40,
  variance: 0.75,
  x_colors: 'YlGnBu',
  y_colors: 'match_x'
});
document.body.appendChild(pattern.canvas());
}
background();
window.addEventListener('resize', function() {
  var canvas = document.getElementsByTagName('canvas');
  document.body.removeChild(canvas[0]);
  background();
});

window.onload = function () {
  // Check browser support
if (typeof(Storage) !== "undefined" && window.location.href == "https://parmesanio.github.io/trivia-game/") {
  // Retrieve
  var prevScore = localStorage.getItem("score");
  var highScore = localStorage.getItem("highScore");
  if (highScore == null || prevScore == null) {
    document.getElementById("prev-score").innerHTML = "Previous Score: 0";
    document.getElementById("high-score").innerHTML = "High Score: 0";
  }else {
    document.getElementById("prev-score").innerHTML = "Previous Score: " + prevScore;
    document.getElementById("high-score").innerHTML = "High Score: " + highScore;
  }
}
  var score = document.getElementById("score").innerHTML;
  var amount = 10;
  var category = "";
  document.getElementById("numOfQuestions").addEventListener('change', function() {
    amount = this.value;
  });
  document.getElementById("cateOfQuestions").addEventListener('change', function() {
    category = this.value;
    console.log(category);
  });

  document.getElementById("play").addEventListener('click', function() {
    document.getElementById("hide-header-play").style.display = "none";
    document.getElementById("hide-customize-play").style.display = "none";
    document.getElementById("Home").style.display = "block";
    startTrivia();
  });
  function startTrivia() {
  var http = new XMLHttpRequest();

  //Request (type, url, async?)
  http.open("GET", "https://opentdb.com/api.php?amount=" + amount + "&category=" + category, true);
  http.send();
  var j = 0;
  var arr = [];
  http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
      var data = JSON.parse(http.response); //JSON.parse turns data into an object we can use.
      function newtrivia() {
          document.getElementById("question").innerHTML = data.results[j].question;
          arr.push(data.results[j].correct_answer);
          data.results[j].incorrect_answers.forEach(function(output){
            arr.push(output);
          });
          arr.sort();
          for(i = 0; i < arr.length; i++) {
            //Create p elements
            var p = document.createElement("p");

            document.getElementById("choices").append(p);
            var pTags = document.getElementsByTagName("p");
            pTags[i].innerHTML = arr[i];
            //Add click event to each p element
            pTags[i].addEventListener('click', function() {
                if(this.innerHTML == data.results[j].correct_answer) {
                  this.style.border = '2px solid rgba(88,222,88,1)';
                  //Break if statement so multiple clicks do not add to score
                  this.innerHTML = this.innerHTML + " ";
                  this.style.transformOrigin = "50%";
                  this.style.animation = "correct 0.5s ease-in-out alternate infinite";
                  document.getElementById("scoreLabel").style.display = "block";
                  document.getElementById("score").style.display = "block";
                  score = parseInt(score, 10) + 1;
                  document.getElementById("score").innerHTML = score;
                  document.getElementById("nextQuestion").style.display = "block";
                }else {
                  for(i = 0; i < data.results[j].incorrect_answers.length; i++) {
                    if(this.innerHTML == data.results[j].incorrect_answers[i]) {
                      this.style.border = '2px solid rgba(226,0,34,1)';
                      this.style.animation = "drop 1.3s ease-in-out forwards";
                      document.getElementById("scoreLabel").style.display = "block";
                      document.getElementById("score").style.display = "block";
                      score = parseInt(score, 10) - 1;
                      document.getElementById("score").innerHTML = score;
                    }
                  }
                }
    /* --- BUGS ---
    1) API encoded special characters !== decoded special characters; click events fail.
    2) ...
    */
              });
        }
      }
      newtrivia();
      document.getElementById("nextQuestion").addEventListener('click', function() {
        arr = [];
        this.style.display = "none";
        //Clear p elements
        for(i = 0; i < data.results[j].incorrect_answers.length; i++) {
          var pChoice = document.getElementById("choices");
          while(pChoice.hasChildNodes()) {
            pChoice.removeChild(pChoice.firstChild);
          }
        }
        //Restart Trivia or coninue to next question
        if( j == (amount - 2)) {
          j = j + 1;
          //set button to say reset
          this.style.border = '3px solid rgba(88,222,88,1)';
          document.getElementById("nextQuestion").innerHTML = "Submit";
        }
        else if(j == (amount - 1)) {
          localStorage.setItem("score", score);
          if (highScore == null) {
            localStorage.setItem("highScore", score);
          }else if (score > highScore) {
            localStorage.setItem("highScore", score);
          }
        //Fire off reload page function when clicked.
          reloadPage();
        }else {
          document.getElementById("nextQuestion").innerHTML = "Next";
          j = j + 1;
        }
        newtrivia();
      });
      document.getElementById("Home").addEventListener('click', function() {
        localStorage.setItem("score", score);
      });
      function reloadPage() {
        document.getElementById("trivia").style.display = "none";
        location.reload();
      }
    }
  }
}

}
