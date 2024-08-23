import React, { useEffect, useState } from 'react';
import './Board.css';
import ArrowRepeat from './arrow-repeat.svg';
import ArrowForward from './arrow-forward.svg';
import { useSwipeable } from 'react-swipeable';

function Board() {
    const colorForNumbers = [
        { null: "" },
        { 2: "#585d8b" },
        { 4: "#755b6c" },
        { 8: "#E9BC78" },
        { 16: "#FCAF85" },
        { 32: "#F18E88" },
        { 64: "#F06C94" },
        { 128: "#F25BAC" },
        { 256: "#9683eb" },
        { 512: "#a05bc1" },
        { 1024: "#eb0080" },
        { 2048: "#aa17ef" }
    ];

    const generateArrayWithTwoValues = () => {
        const arr = Array.from(Array(4), () => new Array(4).fill(null));
        const randomIndex = [];

        while (randomIndex.length < 2) {
            let randomVal = Math.floor(Math.random() * 16);
            if (!randomIndex.includes(randomVal)) {
                randomIndex.push(randomVal);
            }
        }

        randomIndex.forEach(index => arr[Math.floor(index / 4)][index % 4] = 2);
        return arr;
    }

    const [boardTilesVal, setBoardTilesVal] = useState(JSON.parse(localStorage.getItem('2048BoardTiles')) || generateArrayWithTwoValues());
    const [previousBoardTilesVal, setPreviousBoardTilesVal] = useState(JSON.parse(localStorage.getItem('2048PreviousBoardTiles')) || []);
    const [score, setScore] = useState(Number(localStorage.getItem('2048Score')) || 0);
    const [previousScore, setPreviousScore] = useState(Number(localStorage.getItem('2048PreviousScore')) || 0);
    const [highScore, setHighScore] = useState(Number(localStorage.getItem('2048HighScore')) || 0);

    useEffect(() => {
        const handleKeyDownEvent = (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    setBoardTilesVal(prevVal => {
                        setPreviousBoardTilesVal(prevVal);
                        return moveTiles(prevVal, 'Left');
                    });
                    break;
                case 'ArrowUp':
                    setBoardTilesVal(prevVal => {
                        setPreviousBoardTilesVal(prevVal);
                        return moveTiles(prevVal, 'Up');
                    });
                    break;
                case 'ArrowRight':
                    setBoardTilesVal(prevVal => {
                        setPreviousBoardTilesVal(prevVal);
                        return moveTiles(prevVal, 'Right');
                    });
                    break;
                case 'ArrowDown':
                    setBoardTilesVal(prevVal => {
                        setPreviousBoardTilesVal(prevVal);
                        return moveTiles(prevVal, 'Down');
                    });
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDownEvent);
        return () => {
            window.removeEventListener('keydown', handleKeyDownEvent);
        };
    }, []);

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => setBoardTilesVal(prevVal => {
            setPreviousBoardTilesVal(prevVal);
            return moveTiles(prevVal, 'Left');
        }),
        onSwipedRight: () => setBoardTilesVal(prevVal => {
            setPreviousBoardTilesVal(prevVal);
            return moveTiles(prevVal, 'Right');
        }),
        onSwipedUp: () => setBoardTilesVal(prevVal => {
            setPreviousBoardTilesVal(prevVal);
            return moveTiles(prevVal, 'Up');
        }),
        onSwipedDown: () => setBoardTilesVal(prevVal => {
            setPreviousBoardTilesVal(prevVal);
            return moveTiles(prevVal, 'Down');
        }),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    useEffect(() => {
        if (highScore <= score)
            setHighScore(score);
        if (score === 0)
            localStorage.setItem('2048PreviousScore', 0);
        localStorage.setItem('2048Score', score);
    }, [score]);

    useEffect(() => {
        localStorage.setItem('2048PreviousScore', previousScore);
    }, [previousScore]);

    useEffect(() => {
        localStorage.setItem('2048HighScore', score);
    }, [highScore]);

    useEffect(() => {
        localStorage.setItem('2048BoardTiles', JSON.stringify(boardTilesVal));
    }, [boardTilesVal]);

    useEffect(() => {
        localStorage.setItem('2048PreviousBoardTiles', JSON.stringify(previousBoardTilesVal));
    }, [previousBoardTilesVal]);

    const moveTiles = (board, direction) => {
        var countScore = 0;
        var isMove = false;
        let newBoard = board.map(row => row.slice());
        let newVal = [];
        if (direction === 'Up' || direction === 'Down') {
            for (let col = 0; col < 4; col++) {
                newVal.push(newBoard.map(val => val[col]))
            }
        } else {
            newVal = newBoard;
        }
        newBoard = newVal.map(row => {
            let newRow = [];
            var findRow = row.filter(v => v !== null);
            for (let i = 0; i < findRow.length; i++) {
                if (findRow[i] === findRow[i + 1]) {
                    newRow.push(findRow[i] + findRow[i + 1])
                    countScore = findRow[i] + findRow[i + 1]
                    i++;
                } else {
                    newRow.push(findRow[i])
                }
            }
            if (direction === 'Right' || direction === 'Down') {
                newRow = Array(row.length - newRow.length).fill(null).concat(newRow);
            } else {
                newRow = newRow.concat(Array(row.length - newRow.length).fill(null));
            }

            if (newRow.toString() !== row.toString() && !isMove)
                isMove = true
            return newRow;
        });
        let transportArray = [];
        if (direction === 'Up' || direction === 'Down') {
            for (let col = 0; col < 4; col++) {
                transportArray.push(newBoard.map(val => val[col]))
            }
        } else {
            transportArray = newBoard;
        }
        if (isMove)
            transportArray = generateSingleRandomValue(transportArray);

        setScore(prevCountScore => {
            setPreviousScore(prevCountScore);
            return prevCountScore + countScore;
        });
        return transportArray;
    }
    const generateSingleRandomValue = (boardVal) => {
        var randomIndex = null;
        while (randomIndex === null) {
            randomIndex = Math.floor(Math.random() * 16);
            if (boardVal[Math.floor(randomIndex / 4)][randomIndex % 4] !== null) {
                randomIndex = null
            } else {
                boardVal[Math.floor(randomIndex / 4)][randomIndex % 4] = 2
            }
        }
        return boardVal;
    }

    const getColor = (value) => {
        const colorObj = colorForNumbers.find(obj => obj[value] !== undefined);
        return colorObj ? colorObj[value] : '#ccc';
    }

    const onRefresh = () => {
        setScore(0);
        setBoardTilesVal(generateArrayWithTwoValues());
        setPreviousBoardTilesVal([]);
    }

    const onForward = () => {
        if (score !== 0) {
            setBoardTilesVal(previousBoardTilesVal);
            setScore(previousScore);
        }
    }

    return (
        <div className='tablet-size-container' {...swipeHandlers}>
            <div className='board-header'>
                <div className="game-title">
                    <div className='t2-color'>2</div>
                    <div className='t0-color'>0</div>
                    <div className='t4-color'>4</div>
                    <div className='t8-color'>8</div>
                </div>
                <div className="score-wrap">
                    <div className="score-box">
                        <div className="score-title">SCORE</div>
                        <div className="score-val">{score}</div>
                    </div>
                    <div className="score-box high-score-box">
                        <div className="score-title">HIGH SCORE</div>
                        <div className="score-val">{highScore}</div>
                    </div>
                </div>
            </div>
            <div className="refresh-wrap">
                <img src={ArrowForward} alt="Forward" className='refresh-icon forward' onClick={onForward} />
                <img src={ArrowRepeat} alt="Refresh" className='refresh-icon' data-bs-toggle="modal" data-bs-target="#staticBackdrop" />
            </div>
            <div className='box-wrap'>
                {
                    boardTilesVal.map((row, rowIndex) => (
                        row.map((value, colIndex) => (
                            <div
                                className="box"
                                key={`${rowIndex}-${colIndex}`}
                                style={{ backgroundColor: getColor(value) }}
                            >
                                {value}
                            </div>
                        ))
                    ))
                }
            </div>
            <div className="note-wrap">
                <div className='note'>HOW TO PLAY: </div>
                <div className='note-text'>
                    Use your <b>arrow keys</b> to move the tiles. <br />
                    When two tiles with the same number <br />
                    touch, they <b>merge into one!</b>
                </div>
            </div>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content modal-refresh">
                        <div className="modal-body confirm-msg">
                            Are You Sure?
                        </div>
                        <div className="modal-footer footer-wrap">
                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={onRefresh}>Restart</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Board;