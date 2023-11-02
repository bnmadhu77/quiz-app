const question=document.getElementById("question");
const choices=Array.from(document.getElementsByClassName("choice-text"));
const progressText=document.getElementById("progressText");
const scoreText=document.getElementById("score");
const progressBarFull=document.getElementById("progressBarFull");
const loader=document.getElementById("loader");
const game=document.getElementById("game");
let currentQuestion={};
let acceptinganswers=false;
let score=0;
let questionCounter=0;

let questions=[];

/*open trivia datbase api*/
fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple").then(res =>{
    return res.json();
})
.then(loadedQuestions =>{
    questions=loadedQuestions.results.map(loadedQuestion => {
        const formattedQuestion ={
            question:loadedQuestion.question
        };
        const answerChoices = [... loadedQuestion.incorrect_answers];
        formattedQuestion.answer=Math.floor(Math.random() *3) + 1;
        answerChoices.splice(formattedQuestion.answer -1,0,loadedQuestion.correct_answer);
        answerChoices.forEach((choice,index) => {
            formattedQuestion['choice' + (index +1)] =choice;
        });
        return formattedQuestion;
    });
    // Function to show the loader
  function showLoader() {
    document.getElementById("loader").style.display = "block";
  }
  function hideLoader() {
    document.getElementById("loader").style.display = "none";
  }
  
  setTimeout(showLoader,500);
  setTimeout(function() {
    startGame();
    hideLoader();
  }, 500);
  
    
})
.catch(err =>{
    console.error(err);
});
const CORRECT_BONUS=10;
const MAX_QUESTIONS=10;

function startGame() {
    questionCounter=0;
    score=0;
    availableQuestions=[...questions];
    getNewQuestion();
   
};

function getNewQuestion(){
    if(availableQuestions.length === 0 || questionCounter >=MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore',score);
        return window.location.assign('./end.html');
    }
    questionCounter++;
    progressText.innerHTML="Question" +" " +questionCounter +"/" + MAX_QUESTIONS;
    progressBarFull.style.width=((questionCounter / MAX_QUESTIONS)* 100)+'%';
    const questionIndex=Math.floor(Math.random()*availableQuestions.length);
    currentQuestion=availableQuestions[questionIndex];
    question.innerText=currentQuestion.question;    
    choices.forEach(choice =>{
    const number=choice.dataset["number"];
    choice.innerText=currentQuestion["choice" + number];
    });
    availableQuestions.splice(questionIndex,1);
    acceptinganswers=true;
};
choices.forEach(choice =>{
    choice.addEventListener("click" ,e =>{
        if(!acceptinganswers) return;

        acceptinganswers=false;
        const selectedChoice= e.target;
        const selectedAnswer= selectedChoice.dataset["number"];

        var classToApply='incorrect';
        if(selectedAnswer == currentQuestion.answer){
            classToApply='correct';
        }
        if(classToApply == 'correct'){
            incrementScore(CORRECT_BONUS);
        }
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(()=>{
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        },1000);

        })
    });
    incrementScore= num =>{
        score +=num;
        scoreText.innerText=score;
    };
    
        
        

