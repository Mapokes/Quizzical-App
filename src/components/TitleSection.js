import { nanoid } from "nanoid";

export default function TitleSection(props) {
  const categoryOptions = [
    {
      value: 0,
      category: "Any Category",
    },
    {
      value: 9,
      category: "General Knowledge",
    },
    {
      value: 10,
      category: "Entertainment: Books",
    },
    {
      value: 11,
      category: "Entertainment: Film",
    },
    {
      value: 12,
      category: "Entertainment: Music",
    },
    {
      value: 13,
      category: "Entertainment: Musicals & Theatres",
    },
    {
      value: 14,
      category: "Entertainment: Television",
    },
    {
      value: 15,
      category: "Entertainment: Video Games",
    },
    {
      value: 16,
      category: "Entertainment: Board Games",
    },
    {
      value: 17,
      category: "Science & Nature",
    },
    {
      value: 18,
      category: "Science: Computers",
    },
    {
      value: 19,
      category: "Science: Mathematics",
    },
    {
      value: 20,
      category: "Mythology",
    },
    {
      value: 21,
      category: "Sports",
    },
    {
      value: 22,
      category: "Geography",
    },
    {
      value: 23,
      category: "History",
    },
    {
      value: 24,
      category: "Politics",
    },
    {
      value: 25,
      category: "Art",
    },
    {
      value: 26,
      category: "Celebrities",
    },
    {
      value: 27,
      category: "Animals",
    },
    {
      value: 28,
      category: "Vehicles",
    },
    ,
    {
      value: 29,
      category: "Entertainment: Comics",
    },
    ,
    {
      value: 30,
      category: "Science: Gadgets",
    },
    ,
    {
      value: 31,
      category: "Entertainment: Japanese Anime & Manga",
    },
    ,
    {
      value: 32,
      category: "Entertainment: Cartoon & Animations",
    },
  ];

  const difficultyOptions = [
    {
      value: 0,
      difficulty: "Any Difficulty",
    },
    {
      value: "easy",
      difficulty: "Easy",
    },
    {
      value: "medium",
      difficulty: "Medium",
    },
    {
      value: "hard",
      difficulty: "Hard",
    },
  ];

  const typeOptions = [
    {
      value: 0,
      type: "Any type",
    },
    {
      value: "multiple",
      type: "Multiple Choice",
    },
    {
      value: "boolean",
      type: "True / False",
    },
  ];

  // creates "result" for every saved result in local storage
  let place = 1;
  const results = props.savedResults.map((eachSavedResult) => {
    const category = categoryOptions.map((eachCategoryOption) => {
      if (eachCategoryOption.value == eachSavedResult.category) {
        return eachCategoryOption.category;
      }
    });
    return (
      <div className="results-section--result" key={nanoid()}>
        {" "}
        <h3>{place++}.</h3>
        <h3>{eachSavedResult.username.trim()}</h3>
        <h3>
          {eachSavedResult.score}/{eachSavedResult.questionNumber}
        </h3>
        <h3>{category}</h3>
        <h3>{eachSavedResult.difficulty === 0 ? "Any" : eachSavedResult.difficulty[0].toUpperCase() + eachSavedResult.difficulty.substring(1)}</h3>
        <h3>{eachSavedResult.type === 0 ? "Any" : eachSavedResult.type[0].toUpperCase() + eachSavedResult.type.substring(1)}</h3>
        <h3>{eachSavedResult.time}</h3>
        <h3>{eachSavedResult.date}</h3>
      </div>
    );
  });

  return (
    <section className={"title-section"}>
      {props.gameDisplay && (
        <>
          <section className="results-section">
            <h1>Results</h1>
            <header className="results-section--header">
              <h3>Place</h3>
              <h3>Player</h3>
              <h3>Score</h3>
              <h3>Category</h3>
              <h3>Difficulty</h3>
              <h3>Type</h3>
              <h3>Time</h3>
              <h3>Date</h3>
            </header>
            {results}
            <button className="title-section--button" id="close-results-btn" onClick={props.handleResultsClick}>
              Close
            </button>
          </section>
        </>
      )}
      <h1 className="title-section--header">Quizzical</h1>
      <div className="title-section--form">
        <label className={`question-number-label${props.inputError.questionNumberError ? " error" : ""}`} htmlFor="question-number">
          Number of Questions (1-50):
        </label>
        <input
          type="number"
          name="questionNumber"
          id="question-number"
          min={1}
          max={50}
          onChange={props.handleOnChange}
          value={props.formData.questionNumber}
          onKeyDown={(event) => {
            if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
              event.preventDefault();
            }
          }}
        />

        <label htmlFor="question-category">Select Category:</label>
        <select name="questionCategory" id="question-category" value={props.formData.questionCategory} onChange={props.handleOnChange}>
          {categoryOptions.map((categoryOption) => {
            return (
              <option key={nanoid()} value={categoryOption.value}>
                {categoryOption.category}
              </option>
            );
          })}
        </select>

        <label htmlFor="question-difficulty">Select Difficulty:</label>
        <select name="questionDifficulty" id="question-difficulty" value={props.formData.questionDifficulty} onChange={props.handleOnChange}>
          {difficultyOptions.map((difficultyOption) => {
            return (
              <option key={nanoid()} value={difficultyOption.value}>
                {difficultyOption.difficulty}
              </option>
            );
          })}
        </select>

        <label htmlFor="question-type">Select Type:</label>
        <select name="questionType" id="question-type" value={props.formData.questionType} onChange={props.handleOnChange}>
          {typeOptions.map((typeOption) => {
            return (
              <option key={nanoid()} value={typeOption.value}>
                {typeOption.type}
              </option>
            );
          })}
        </select>

        <label className={`username-label${props.inputError.usernameInputError ? " error" : ""}`} htmlFor="usernameInput">
          Username
        </label>
        <input type="text" name="usernameInput" id="username-input" placeholder="Enter Username" maxLength={15} value={props.formData.usernameInput} onChange={props.handleOnChange} />
      </div>
      <button className="title-section--button" id="start-btn" onClick={props.handleStartQuiz}>
        Start quiz
      </button>
      <button className="title-section--button" id="results-btn" onClick={props.handleResultsClick}>
        Results
      </button>
    </section>
  );
}
