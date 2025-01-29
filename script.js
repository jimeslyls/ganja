document.getElementById('go-btn').addEventListener('click', () => {
  document.getElementById('game-content').style.display = 'block';
  document.querySelector('header').style.display = 'none';
  document.getElementById('go-btn').style.display = 'none';
  startGame();
});

document.getElementById('play-again-btn').addEventListener('click', () => {
  location.reload();
});

let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let startTime = 0;
let endTime = 0;
let timeBonus = 0;

function getLetterGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

let questions = [
  {
    question: "What is 2 + 2?",
    answers: [
      { text: '3', correct: false },
      { text: '4', correct: true },
      { text: '5', correct: false }
    ]
  },
  {
    question: "What is the capital of France?",
    answers: [
      { text: 'Berlin', correct: false },
      { text: 'Madrid', correct: false },
      { text: 'Paris', correct: true }
    ]
  },
  {
    question: "What is the largest planet in our solar system?",
    answers: [
      { text: 'Earth', correct: false },
      { text: 'Jupiter', correct: true },
      { text: 'Mars', correct: false }
    ]
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    answers: [
      { text: 'Oxygen', correct: true },
      { text: 'Osmium', correct: false },
      { text: 'Ozone', correct: false }
    ]
  },
  {
    question: "What is the square root of 64?",
    answers: [
      { text: '6', correct: false },
      { text: '8', correct: true },
      { text: '10', correct: false }
    ]
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    answers: [
      { text: 'William Shakespeare', correct: true },
      { text: 'Jane Austen', correct: false },
      { text: 'Charles Dickens', correct: false }
    ]
  },
  {
    question: "Which continent is known as the 'Dark Continent'?",
    answers: [
      { text: 'Asia', correct: false },
      { text: 'Africa', correct: true },
      { text: 'South America', correct: false }
    ]
  },
  {
    question: "What is the chemical formula for water?",
    answers: [
      { text: 'CO2', correct: false },
      { text: 'H2O', correct: true },
      { text: 'O2', correct: false }
    ]
  },
  {
    question: "Which country is home to the Great Barrier Reef?",
    answers: [
      { text: 'USA', correct: false },
      { text: 'Australia', correct: true },
      { text: 'Brazil', correct: false }
    ]
  },
  {
    question: "Who was the first president of the United States?",
    answers: [
      { text: 'George Washington', correct: true },
      { text: 'Abraham Lincoln', correct: false },
      { text: 'Thomas Jefferson', correct: false }
    ]
  }
];

let timer;
let questionTimer;

function startGame() {
  startTime = Date.now();
  let timeRemaining = 60;
  document.getElementById('timer').textContent = `Time Remaining: ${timeRemaining}s`;

  timer = setInterval(function() {
    timeRemaining--;
    document.getElementById('timer').textContent = `Time Remaining: ${timeRemaining}s`;
    if (timeRemaining <= 0) {
      endGame();
    }
  }, 1000);

  showNextQuestion();
}

function showNextQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endGame();
    return;
  }

  const question = questions[currentQuestionIndex];
  document.getElementById('question').textContent = question.question;
  const answersContainer = document.getElementById('answers');
  answersContainer.innerHTML = '';

  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.textContent = answer.text;
    button.classList.add('answer-btn');
    button.onclick = () => handleAnswer(button, answer);
    answersContainer.appendChild(button);
  });
}

function handleAnswer(button, answer) {
  document.querySelectorAll('.answer-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === answer.text) {
      btn.style.backgroundColor = answer.correct ? 'green' : 'red';
    }
  });

  document.querySelectorAll('.answer-btn').forEach(btn => {
    const selectedAnswer = questions[currentQuestionIndex].answers.find(a => a.text === btn.textContent);
    if (selectedAnswer.correct) {
      btn.style.backgroundColor = 'green';
    } else if (!selectedAnswer.correct && btn.style.backgroundColor !== 'red') {
      btn.style.backgroundColor = 'gray';
    }
  });
  document.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = true);
  if (answer.correct) {
    button.style.backgroundColor = 'green';
    score += 8;
    correctAnswers++;
  } else {
    button.style.backgroundColor = 'red';
    score -= 5;
    incorrectAnswers++;
  }
  
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions.length) {
      endGame();
    } else {
      showNextQuestion();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timer);
  endTime = Date.now();
  let totalTime = ((endTime - startTime) / 1000).toFixed(2);
  
  if (totalTime <= 20) timeBonus = 20;
  else if (totalTime <= 25) timeBonus = 15;
  else if (totalTime <= 30) timeBonus = 10;
  else if (totalTime <= 35) timeBonus = 5;
  else timeBonus = 0;
  
  score = Math.max(score + timeBonus, 0);
  let letterGrade = getLetterGrade(score);
  
  document.getElementById('game-content').style.display = 'none';
  document.getElementById('results-container').style.display = 'flex';
  document.getElementById('results-container').style.flexDirection = 'column';
  document.getElementById('results-container').style.justifyContent = 'center';
  document.getElementById('results-container').style.alignItems = 'center';
  document.getElementById('results-container').style.height = '100vh';
  document.getElementById('score').innerHTML = `Your Score: ${score} <br>
    <small>Time Taken: ${totalTime}s <span style='color:green;'>+${timeBonus}</span></small><br>
    <small>Correct Answers: ${correctAnswers}/10 <span style='color:green;'>+${correctAnswers * 8}</span></small><br>
    ${incorrectAnswers > 0 ? `<small>Incorrect Answers: ${incorrectAnswers} <span style='color:red;'>-${incorrectAnswers * 5}</span></small><br>` : ''}
    <span style='color:red; font-size: 1.5em; font-weight: bold;'>Grade: ${letterGrade}</span>`;
}
