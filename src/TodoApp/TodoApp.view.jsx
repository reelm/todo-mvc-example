import React from 'react';
import { connect } from 'react-redux';
import { forwardTo } from 'reelm';

import TodoItem from './TodoItem.view';
import TodoItemEditor from './TodoItemEditor.view';
import TodoFooter from './TodoFooter.view';

const ENTER_KEY = 13;

const TodoFilter = {
    All: 'All',
    Active: 'Active',
    Completed: 'Completed',
};

function TodoApp({ todos,
    newTodoText, activeTodoCount,
    completedTodoCount, currentTodoFilter,
    dispatch, currentEditingItem, currentEditingIndex }) {

    const onNewTodoChange = text => dispatch({
        type: 'NewTodo.Change',
        text: text });
    const onCreateTodo = text => dispatch({
        type: 'CreateTodo',
        text: text });

    const onToggleAll = () => dispatch({
        type: 'ToggleAll',
    });

    return (
        <div>
            <header className='header'>
                <h1>todos</h1>
                <input
                  className='new-todo'
                  placeholder='What needs to be done?'
                  value={newTodoText}
                  onKeyDown={onKey({
                    [ENTER_KEY]: e => onCreateTodo(e.target.value),
                  })}
                  onChange={e => onNewTodoChange(e.target.value)}
                  autoFocus />
            </header>
            <section className='main'>
                <input
                  className='toggle-all'
                  type='checkbox'
                  onChange={onToggleAll}
                  checked={activeTodoCount === 0} />
                <ul className='todo-list'>
                    {todos.map((todo, index) =>
                        currentEditingIndex === index
                            ? (<TodoItemEditor
                                  key={index}
                                  todo={currentEditingItem}
                                  dispatch={forwardTo(dispatch, 'CurrentEditingItem')}
                                  />)
                            : (<TodoItem
                                  key={index}
                                  todo={todo}
                                  dispatch={forwardTo(dispatch, 'TodoItems', index)}
                                  />)
                            )}
                </ul>
            </section>
            <TodoFooter
              dispatch={dispatch}
              activeCount={activeTodoCount}
              completedCount={completedTodoCount}
              filter={currentTodoFilter} />
        </div>);
}

function onKey(keyMap) {
    return function(e, ...args) {
        if (keyMap[e.keyCode]) {
            keyMap[e.keyCode](e, ...args);
        }
    };
}

function filterWith(todos, filter) {
    if (filter === 'All') {
        return todos;
    }
    if (filter === 'Active') {
        return todos.filter(x => !x.completed);
    }
    if (filter === 'Completed') {
        return todos.filter(x => x.completed);
    }
    return [];
}

function TodoAppSelector(state) {
    return ({
        todos: filterWith(state.get('todoItems').toJS(), state.get('filter')),
        activeTodoCount: state.get('todoItems').toJS().filter(x => !x.completed).length,
        completedTodoCount: state.get('todoItems').toJS().filter(x => x.completed).length,
        currentTodoFilter: state.get('filter'),
        newTodoText: state.get('newTodoText'),
        currentEditingItem: state.get('currentEditingItem') && state.get('currentEditingItem').toJS(),
        currentEditingIndex: state.get('currentEditingIndex'),
    });
}

export default connect(TodoAppSelector)(TodoApp);
