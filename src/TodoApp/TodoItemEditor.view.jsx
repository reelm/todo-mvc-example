import React from 'react';
import classNames from 'classnames';

const ENTER = 13;
const ESCAPE = 27;

export default function TodoItemEditor({ todo, dispatch }) {
    const onEdit = text => dispatch({ type: 'Change', data: { title: text } });
    const onSubmitEdit = () => dispatch({ type: 'SubmitEdit' });
    const onCancelEdit = () => dispatch({ type: 'CancelEdit' });

    return (
        <li className={classNames({
            completed: todo.completed,
            editing: true,
        })}>
            <div className='view'>
                <input
                  className='toggle'
                  type='checkbox'
                  readOnly
                  checked={todo.completed} />
            </div>
            <input
              autoFocus
              className='edit'
              value={todo.title}
              onBlur={onSubmitEdit}
              onChange={e => onEdit(e.target.value)}
              onKeyDown={onKey({
                  [ENTER]: onSubmitEdit,
                  [ESCAPE]: onCancelEdit,
              })} />
        </li>);
}

function onKey(keyMap) {
    return function(e, ...args) {
        if (keyMap[e.keyCode]) {
            keyMap[e.keyCode](e, ...args);
        }
    };
}
