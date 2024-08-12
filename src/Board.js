import React,{useEffect, useState} from 'react';
import './Board.css';

function Board (){
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
    const [numberVal, setNumberVal] = useState([]);

    useEffect(() => {
        function generateArrayWithTwoValues(){
            const arr = Array.from(Array(4),() => new Array(4).fill(null))
            const randomIndex=[];
            while(randomIndex.length < 2){
                let randomVal = Math.floor(Math.random()*16)
                if(!randomIndex.includes(randomVal,0))
                    randomIndex.push(randomVal)
            }
            randomIndex.forEach(index => arr[Math.floor(index/4)][index%4]=2);
            return arr;
        }
        setNumberVal(generateArrayWithTwoValues());
    },[]);
    
    // useEffect(() => {
    //     window.addEventListener('keydown', handleKeyDownEvent);
    //     return () => {
    //         window.removeEventListener('keydown',handleKeyDownEvent)
    //     }
    // },[]);

    // const handleKeyDownEvent = (e) => {
    //     switch (e.key) {
    //         case 'ArrowLeft':
    //             console.log('Left arrow key pressed');
    //             break;

    //         case 'ArrowUp':
    //             console.log('Up arrow key pressed');
    //             break;

    //         case 'ArrowRight':
    //             console.log('Right arrow key pressed');
    //             break;
    //         case 'ArrowDown':
    //             console.log('Down arrow key pressed');
    //             break;

    //         default:
    //             break;
    //     }
    // }

    return(
        <div className='container'>
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
                        <div className="score-val">55234</div>
                    </div>
                    <div className="score-box high-score-box">
                        <div className="score-title">HIGH SCORE</div>
                        <div className="score-val">552345</div>
                    </div>
                </div>
            </div>
            <div className='box-wrap'>
                {console.log("val",numberVal)}
                {
                    numberVal.map((val,i) => {
                        return val.map(j => {
                            return <div className="box" key={`${i}${j}`} style={{backgroundColor: colorForNumbers.find(obj => obj[j]!== undefined)[j]}}>{j}</div>
                        })
                    })
                }
            </div>
            <div className="note-wrap">
                <div className='note'>HOW TO PLAY: </div>
                <div className='note-text'> Use your <b>arrow keys</b> to move the tiles. <br/>When two tiles with the same number <br/>touch,  they <b>merge into one!</b></div>
            </div>
        </div>
    )
}
export default Board;