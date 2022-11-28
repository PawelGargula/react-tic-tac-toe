import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button
            className={props.className}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

function SortButton(props) {
    return (
        <button
            className="sort-button"
            onClick={props.onClick}
        >
            Toggle sort
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        const className =
            this.props.winningSquares?.includes(i) ?
                "square winner-bgc" :
                "square";
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                key={i}
                className={className}
            />
        );
    }

    render() {
        let index = -1;
        let squares = Array(3).fill(null).map((el, i) => (
            <div className="board-row" key={i}>
                {Array(3).fill(null).map(() => {
                    index++;
                    return (this.renderSquare(index));
                })}
            </div>
        ));

        return (
            <div>
                {squares}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                XYPosition: null
            }],
            stepNumber: 0,
            xIsNext: true,
            sortAscending: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const { winner } = calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";

        let XYposition = current.XYPosition;

        XYposition = `(${calcXPosision(i)}, ${calcYPosition(i)})`;

        this.setState((state) => ({
            history: history.concat([{
                squares: squares,
                XYPosition: XYposition
            }]),
            stepNumber: history.length,
            xIsNext: !state.xIsNext
        }));
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    toggleSort() {
        this.setState((state) => ({
            sortAscending: !state.sortAscending
        }));
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const { winner } = calculateWinner(current.squares);
        const { winningSquares } = calculateWinner(current.squares);

        let moves = history.map((step, move) => {
            const desc = move ? `Go to move #${move} ${step.XYPosition}` : 'Go to start game';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        if (!this.state.sortAscending) {
            moves.reverse();
        }

        let status;
        if (winner) {
            status = `Winner ${winner}`;
        } else if (this.state.stepNumber === 9) {
            status = `Draw`;
        }
        else {
            status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winningSquares={winningSquares}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <SortButton onClick={() => this.toggleSort()}></SortButton>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a]
            && squares[a] === squares[b]
            && squares[a] === squares[c]) {
            const winner = squares[a];
            const winningSquares = [a, b, c]
            return { winner, winningSquares };
        }
    }

    return { winner: null };
}

function calcXPosision(i) {
    const xPosition = i % 3 + 1;

    return xPosition;
}

function calcYPosition(i) {
    const yPosition = Math.floor(i / 3) + 1;

    return yPosition;
}