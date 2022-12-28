import { nanoid } from "nanoid";

export default function QuizElement(props) {
  // on answer check click, adds appropriate classes to buttons
  let answerCheck;
  const answer = props.answers.map((eachAnswerObject) => {
    if (props.quizCompleted) {
      if (eachAnswerObject.answerClicked && eachAnswerObject.id === props.correctAnswerId) {
        answerCheck = " correct-answer";
      } else if (eachAnswerObject.answerClicked && eachAnswerObject.id !== props.correctAnswerId) {
        answerCheck = " wrong-answer";
      } else if (!eachAnswerObject.answerClicked && eachAnswerObject.id === props.correctAnswerId) {
        answerCheck = " correct-answer";
      } else {
        answerCheck = " faded";
      }
    }

    return <button className={`answer-btn${eachAnswerObject.answerClicked ? " clicked" : ""}${props.quizCompleted ? answerCheck : ""}`} key={nanoid()} id={eachAnswerObject.id} onClick={() => props.handleAnswerClick(eachAnswerObject.id, props.quizElementId)} disabled={props.quizCompleted ? true : false} dangerouslySetInnerHTML={{ __html: eachAnswerObject.answer }}></button>;
  });

  return (
    <div className="quiz-element" id={props.quizElementId}>
      <h1 className="quiz-section--question" dangerouslySetInnerHTML={{ __html: props.questionNumber + ". " + props.question }}></h1>
      <div className="quiz-section--answers">{answer}</div>
    </div>
  );
}
