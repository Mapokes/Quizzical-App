import React from "react";
import TitleSection from "./components/TitleSection";
import QuizElement from "./components/QuizElement";
import Timer from "./components/Timer";
import { nanoid } from "nanoid";

export default function App() {
  const [savedResults, setSavedResults] = React.useState(() => JSON.parse(localStorage.getItem("results")) || []);

  const [darkMode, setDarkMode] = React.useState(() => JSON.parse(localStorage.getItem("darkMode")) || false);

  const [gameDisplay, setGameDisplay] = React.useState({
    titleSreenDisplay: true,
    resultsDisplay: false,
    quizDisplay: false,
  });

  const [formData, setFormData] = React.useState({
    questionNumber: 10,
    questionCategory: 0,
    questionDifficulty: 0,
    questionType: 0,
    usernameInput: "",
    quizLink: "https://opentdb.com/api.php?amount=10",
  });

  const [inputError, setInputError] = React.useState({
    questionNumberError: false,
    usernameInputError: false,
  });

  const [quizData, setQuizData] = React.useState([]);

  const [quizCompleted, setQuizCompleted] = React.useState({
    completed: false,
    score: 0,
  });

  /** onChange function for Title Section's inputs: updates states of formData and inputError accordingly  */
  function handleOnChange(e) {
    const { name, value } = e.target;

    // "formData.quizLink" changes if e.target isn't "usernameInput". If it is it takes values from "formData" accordingly
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
        quizLink: `https://opentdb.com/api.php?amount=${name === "questionNumber" ? value : formData.questionNumber}&category=${name === "questionCategory" ? value : formData.questionCategory}&difficulty=${name === "questionDifficulty" ? value : formData.questionDifficulty}&type=${name === "questionType" ? value : formData.questionType}`,
      };
    });

    // sets error on inputs if "questionNumber" is 0 or >50 and when "usernameInput" is empty
    setInputError((prevInputError) => {
      const errorName = name == "questionNumber" ? "questionNumberError" : "usernameInputError";
      if ((name === "questionNumber" && (value == 0 || value > 50)) || (name === "usernameInput" && value.trim() == "")) {
        return {
          ...prevInputError,
          [errorName]: true,
        };
      } else {
        return {
          ...prevInputError,
          [errorName]: false,
        };
      }
    });
  }

  // onClick function for starting quiz game. Checks for errors and then fetches link and sets states on "quizData" and "gameDisplay"
  function handleStartQuiz() {
    // if "usernameInput" is empty - puts error (default on page load there is no error, even though it's empty)
    if (formData.usernameInput == "") {
      setInputError((prevInputError) => {
        return {
          ...prevInputError,
          usernameInputError: true,
        };
      });
    }

    // changes game display and fetches quiz link to set up state of "quizData" array with objects
    if (!inputError.questionNumberError && !inputError.usernameInputError && formData.usernameInput != "") {
      setGameDisplay({ titleSreenDisplay: false, resultsDisplay: false, quizDisplay: true });
      fetch(formData.quizLink)
        .then((response) => response.json())
        .then((data) => {
          if (data.results == "") {
            alert("No results. Please refesh page and select different options.");
          }
          const newQuizDataArray = [];
          let questionNumber = 1;
          data.results.map((eachData) => {
            const correctAnswer = {
              id: nanoid(),
              answer: eachData.correct_answer,
              answerClicked: false,
            };
            const wrongAnswers = eachData.incorrect_answers.map((eachIncorrentAnswer) => {
              return {
                id: nanoid(),
                answer: eachIncorrentAnswer,
                backgroundColor: "",
                answerClicked: false,
              };
            });

            const allAnswers = shuffleAnswers(wrongAnswers.concat(correctAnswer));

            newQuizDataArray.push({
              quizElementId: nanoid(),
              questionNumber: questionNumber++,
              question: eachData.question,
              correctAnswerId: correctAnswer.id,
              answers: allAnswers,
            });
          });
          setQuizData(newQuizDataArray);
        });
    }
  }

  /** healper function for randomizing order of answers inside array "quizData.answers". Default answers have correct answer is same place*/
  function shuffleAnswers(answersArray) {
    let currentIndex = answersArray.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [answersArray[currentIndex], answersArray[randomIndex]] = [answersArray[randomIndex], answersArray[currentIndex]];
    }

    return answersArray;
  }

  /** onClick function to check saved results. Updates state of "gameDisplay" accordingly */
  function handleResultsClick(e) {
    const button = e.target.innerText;

    if (button === "Results") {
      setGameDisplay({ titleSreenDisplay: true, resultsDisplay: true, quizDisplay: false });
    } else {
      setGameDisplay({ titleSreenDisplay: true, resultsDisplay: false, quizDisplay: false });
    }
  }

  /** onClick function to mark clicked answer. Takes in "clickedAnswerId" and "answerQuizElementId" to identify each quiz element (question with its answers) and set state of "quizData.answerClicked" accordingly */
  function handleAnswerClick(clickedAnswerId, answerQuizElementId) {
    setQuizData((prevQuizData) => {
      return prevQuizData.map((eachPrevQuizData) => {
        if (eachPrevQuizData.quizElementId === answerQuizElementId) {
          return {
            ...eachPrevQuizData,
            answers: eachPrevQuizData.answers.map((eachAnswer) => (eachAnswer.id === clickedAnswerId ? { ...eachAnswer, answerClicked: true } : { ...eachAnswer, answerClicked: false })),
          };
        } else {
          return eachPrevQuizData;
        }
      });
    });
  }

  /** onClick function marking clicked correct and incorrect answers. Counts score. On second click ("Play again") - resets all states */
  function handleCheckAnswersClick() {
    if (!quizCompleted.completed) {
      let scoreTest = 0;

      quizData.map((eachQuizData) => {
        eachQuizData.answers.map((eachAnswer) => {
          if (eachAnswer.answerClicked && eachAnswer.id === eachQuizData.correctAnswerId) {
            scoreTest++;
          }
        });
      });

      setQuizCompleted({
        completed: true,
        score: scoreTest,
      });
    } else {
      setQuizCompleted({ completed: false, score: 0 });
      setGameDisplay({
        titleSreenDisplay: true,
        resultsDisplay: false,
        quizDisplay: false,
      });
      setFormData({ questionNumber: 10, questionCategory: 0, questionDifficulty: 0, questionType: 0, usernameInput: "", quizLink: "https://opentdb.com/api.php?amount=10" });
      setQuizData([]);
    }
  }

  // on check answers click, saves user result. If score is within TOP10, it saves user result accordingly
  React.useEffect(() => {
    if (quizCompleted.completed) {
      const date = new Date();
      const userData = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      const currentResult = {
        username: formData.usernameInput.trim(),
        score: quizCompleted.score,
        questionNumber: formData.questionNumber,
        category: formData.questionCategory,
        difficulty: formData.questionDifficulty,
        type: formData.questionType,
        time: quizTime,
        date: userData,
      };

      // checks score of TOP10 results and finds object's index of first lowest score in comparison to new user result and puts it before it. Else, at the end of array and if array.length > 10, last object is discarded
      setSavedResults((prevSavedResult) => {
        const index = prevSavedResult.findIndex((eachPrevResult) => eachPrevResult.score < currentResult.score);
        index < 0 ? prevSavedResult.push(currentResult) : prevSavedResult.splice(index, 0, currentResult);
        prevSavedResult.length > 10 && prevSavedResult.pop();
        localStorage.setItem("results", JSON.stringify(prevSavedResult));
        return prevSavedResult;
      });
    }
  }, [quizCompleted]);

  let quizTime = 0;
  /** helper function for returnning string with correct time "XX:XX" indicating length of game */
  function timer(time) {
    let timeMinutes = Math.floor(time / 60);
    let timeSeconds = time - timeMinutes * 60;
    if (time <= 59) return quizCompleted.completed ? (quizTime = `00:${timeSeconds < 10 ? "0" + timeSeconds : timeSeconds}`) : `00:${timeSeconds < 10 ? "0" + timeSeconds : timeSeconds}`;
    if (time > 59) return quizCompleted.completed ? (quizTime = `${timeMinutes < 10 ? "0" + timeMinutes : timeMinutes}:${timeSeconds < 10 ? "0" + timeSeconds : timeSeconds}`) : `${timeMinutes < 10 ? "0" + timeMinutes : timeMinutes}:${timeSeconds < 10 ? "0" + timeSeconds : timeSeconds}`;
  }

  /** saves to local storage dark/light mode */
  function handleDarkModeClick() {
    setDarkMode((prevDarkMode) => {
      localStorage.setItem("darkMode", JSON.stringify(!prevDarkMode));
      return !prevDarkMode;
    });
  }

  /** returns loading animation or "quiz-section" container if "quizData" has been updated with fetched quiz link */
  function getQuiz() {
    if (gameDisplay.quizDisplay && quizData != "") {
      return (
        <div className={"quiz-section"}>
          <h1 className="quiz-section--title">Quizzical</h1>
          {quizData.map((eachQuizData) => {
            // console.log(eachQuizData.correctAnswerId);
            return <QuizElement key={nanoid()} {...eachQuizData} handleAnswerClick={handleAnswerClick} quizCompleted={quizCompleted.completed} />;
          })}
          <div className="quiz-section--score">
            {quizCompleted.completed && <h2 className="score--score-text">{`You scored ${quizCompleted.score}/${quizData.length} correct answers`}</h2>}
            <button id="score--check-btn" onClick={handleCheckAnswersClick}>
              {quizCompleted.completed ? "Play again" : "Check answers"}
            </button>
          </div>
          <div className="quiz-section--timer">
            <Timer quizData={quizData} gameDisplay={gameDisplay} quizCompleted={quizCompleted} timer={timer} />
          </div>
        </div>
      );
    } else if (gameDisplay.quizDisplay) {
      return (
        <div className="loading-animation">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    }
  }

  return (
    <>
      {darkMode ? document.body.classList.add("dark-mode") : document.body.classList.remove("dark-mode")}
      <button id="dark-mode-btn" onClick={handleDarkModeClick}>
        {darkMode ? <i className="fa-regular fa-sun"></i> : <i className="fa-regular fa-moon"></i>}
      </button>
      {gameDisplay.resultsDisplay && <div className="background-overlay" onClick={handleResultsClick}></div>}
      {gameDisplay.titleSreenDisplay && <TitleSection formData={formData} savedResults={savedResults} handleOnChange={handleOnChange} handleStartQuiz={handleStartQuiz} handleResultsClick={handleResultsClick} inputError={inputError} gameDisplay={gameDisplay.resultsDisplay} />}
      {getQuiz()}
    </>
  );
}
