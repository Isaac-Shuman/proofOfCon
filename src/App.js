import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    //Count the pices on the board
    shift = -1;
    let pieces = 0;
    for (let i = 0; i < squares.length; i++) {
      pieces += squares[i] ? 1 : 0;
    }
    const nextSquares = squares.slice();

    if (pieces < 6) {
      if (squares[i] || calculateWinner(squares)) {
        return;
      }

      xIsNext ? (nextSquares[i] = "X") : (nextSquares[i] = "O");
    } else {
      shift = i;
      console.log("Shift is: " + shift);
    }

    onPlay(nextSquares, shift);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [startShift, setStartShift] = useState(-1);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares, shiftClick) {
    //Do shift operation
    const movingPlayer = xIsNext ? "X" : "O";
    //If startShift is previously unassigned and the piece to shift is conrtolled by the current player
    if (shiftClick != -1) {
      console.log(
        "currentSquares[shiftClick] is: " + currentSquares[shiftClick]
      );
      console.log("movingPlayer is " + movingPlayer);
      console.log(currentSquares[shiftClick] === movingPlayer);
      if (startShift == -1 && currentSquares[shiftClick] === movingPlayer) {
        setStartShift(shiftClick);
        console.log("startShift set to: " + shiftClick);
        //color the selected tile
      } else if (
        /*If the startShift is != -1 
      and currentSquares[endShift] === null
      and endShift = startShift plus or minus 1 or 3
      */
        startShift != -1 &&
        currentSquares[shiftClick] === null &&
        Math.abs((shiftClick % 3) - (startShift % 3)) <= 1 &&
        Math.abs(shiftClick - startShift) < 5
      ) {
        const proposedBoard = currentSquares.slice();
        proposedBoard[shiftClick] = currentSquares[startShift];
        proposedBoard[startShift] = null;
        if (
          calculateWinner(proposedBoard) ||
          currentSquares[4] != movingPlayer ||
          proposedBoard[4] === null
        ) {
          const nextHistory = [
            ...history.slice(0, currentMove + 1),
            proposedBoard,
          ];
          setHistory(nextHistory);
          setCurrentMove(nextHistory.length - 1);
        }
        setStartShift(-1);
      } else {
        setStartShift(-1);
      }
    } else {
      //update nextSquares
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
