import './App.css';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import GameOver from './components/GameOver';
import { boardDefault, genetateWordSet } from './Words'
import { createContext, useState, useEffect } from 'react';


export const AppContext = createContext();

function App() {
  const [board, setBoard] = useState(boardDefault)
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 })
  const [wordSet, setWordSet] = useState(new Set())
  const [disabledLetters, setDisabledLetters] = useState([])
  const [gameOver, setGameOver] = useState({ gameOver: false, guessedWord: false });
  const [correctWord, setCorrectWord] = useState("");

  useEffect(() => {
    genetateWordSet().then((words) => {
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    })
  }, []);

  const onSelectLetter = (keyVal) => {
    if (currAttempt.letterPos > 4) return;
    const newBoard = { ...board };
    newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal;
    setBoard(newBoard);
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos + 1 });
    // console.log(currAttempt)
  }
  const onDelete = () => {
    if (currAttempt.letterPos === 0) return;
    const newBoard = { ...board };
    newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = "";
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos - 1 });

  }
  const onEnter = () => {
    if (currAttempt.letterPos !== 5) return;
    let currWord = "";
    for (let i = 0; i < 5; i++) {
      currWord += board[currAttempt.attempt][i];
    }
    //console.log(wordSet);
    if (wordSet.has(currWord.toLowerCase())) {
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 });
    } else {
      alert(currWord.toLowerCase() + " Word Not Found");
    }
    if (currWord.toLowerCase() === correctWord) {
      setGameOver({ gameOver: true, guessedWord: true })
      console.log(gameOver);
      return;
    }
    if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
      console.log(gameOver);
    }

    // console.log(currAttempt);
  }
  return (
    <div className="App">
      <nav>
        <h1>
          Unlimited Wordle
        </h1>
      </nav>
      <AppContext.Provider value={{ board, setBoard, onSelectLetter, onEnter, onDelete, correctWord, currAttempt, setCurrAttempt, disabledLetters, setDisabledLetters, gameOver, setGameOver }}>
        <div className='game'>
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
