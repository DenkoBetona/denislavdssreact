import { useState, useEffect } from 'react'
import 'bulma/css/bulma.min.css';

const Task = ({ id, clickFunc, text, isCompleted}) => {
    const todayString = () => {
        const today = new Date();
        return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getFullYear()).slice(-2)}`;
    };

    return (
        <div className="box">
            <p>{text}</p>
            {
            isCompleted ?
            <>
            <p className="has-text-grey mt-2">Completed on:
            <span className="has-text-info">
                {todayString()}
            </span></p>
            <button onClick={() => clickFunc(id)} className="button is-warning is-light mt-2">Undo</button>
            </>
            :
            <button onClick={() => clickFunc(id)} className="button is-success is-light mt-2">Complete</button>
            }            
        </div>
    )
}

export default Task;