import React, { useRef } from "react";

export default function Timer(props) {
  const [seconds, setSeconds] = React.useState(0);

  // starts timer when quiz is loaded with data and stops it after clicking "check asnwers" button
  let interval = useRef();
  React.useEffect(() => {
    if (props.quizData != "" && props.gameDisplay.quizDisplay) {
      interval.current = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
      props.timer(seconds);
    }
  }, [props.gameDisplay]);

  if (props.quizCompleted.completed) {
    clearInterval(interval.current);
  }

  return (
    <div className="quiz-section--timer">
      <div id="timer">{props.timer(seconds)}</div>
    </div>
  );
}
