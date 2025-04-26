import { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import './App.css';
import Task from './components/Task.jsx';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('1');
  const [thisTodo, setThisTodo] = useState([]);
  const [sort, setSort] = useState(true);
  const [users, setUsers] = useState([]);
  const [pendingLimit, setPendingLimit] = useState(3);
  const [completedLimit, setCompletedLimit] = useState(3);
  
    useEffect(() => {
      fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
      })
      .catch((error) => console.error('Error fetching todos:', error));
    
      fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        //console.log('users:', users);
      })
      .catch((error) => console.error('Error fetching todos:', error));
    }, []);

    useEffect(() => {
      //console.log('Filter changed:', filter);
      setThisTodo(
        todos.filter((todo) => todo.userId == filter)
        .sort((a, b) => sort ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)));
    }, [filter, todos, sort]);

    useEffect(() => {
      setPendingLimit(3);
      setCompletedLimit(3);
    }, [filter]);

    useEffect(() => { 
      //console.log('Filtered todos:', thisTodo);
      let compTodosLen = thisTodo.filter((todo) => todo.completed).length;
      let pendTodosLen = thisTodo.filter((todo) => !todo.completed).length;
      //console.log('Completed todos:', compTodosLen);
      //console.log('Pending todos:', pendTodosLen);
      if (thisTodo.length > 0) {
        if (compTodosLen == completedLimit - 3)
          setCompletedLimit(compTodosLen);
        if (pendTodosLen == pendingLimit - 3)
          setPendingLimit(pendTodosLen);
      }
    }, [thisTodo]);

    const clickFunc = (e) => {
      //console.log('Clicked:', e);
      let newTodos = todos.map((todo) =>
        todo.id == e ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(newTodos);
    };


  return (
    <>
      <div className="container mt-5">

      <div className="columns is-vcentered">
        <div className="column is-half">
          <div className="field">
            <label className="label">Filter by:</label>
            <div className="control">
              <div className="select">
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  {users.map((user, i) => 
                    <option key={i} value={i + 1}>
                      {user.username}
                    </option>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="column is-half">
          <div className="field">
            <label className="label">Sort:</label>
            <div className="control">
              <div className="select">
                <select value={sort} onChange={(e) => setSort(e.target.value === 'true')}>
                  <option value={true}>Title (asc)</option>
                  <option value={false}>Title (desc)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="columns">
        {/* pending todos */}
        <div className="column is-half">
          <h3 className="title is-5">Pending:</h3>
          {thisTodo
            .filter((todo) => !todo.completed)
            .slice(0, pendingLimit)
            .map((todo) => (
              <Task
                key={todo.id}
                id={todo.id}
                clickFunc={clickFunc}
                text={todo.title}
                isCompleted={false}
              />
            ))}
          {thisTodo.filter((todo) => !todo.completed).length > pendingLimit && (
            <button
              className="button is-link is-light mt-2"
              onClick={() => setPendingLimit(pendingLimit + 3)}
            >
              Load More
            </button>
          )}
        </div>

        {/* completed todos */}
        <div className="column is-half">
          <h3 className="title is-5">Completed:</h3>
          {thisTodo
            .filter((todo) => todo.completed)
            .slice(0, completedLimit)
            .map((todo) => (
              <Task
                key={todo.id}
                id={todo.id}
                clickFunc={clickFunc}
                text={todo.title}
                isCompleted={true}
              />
            ))}
          {thisTodo.filter((todo) => todo.completed).length > completedLimit && (
            <button
              className="button is-link is-light mt-2"
              onClick={() => setCompletedLimit(completedLimit + 3)}
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default App
