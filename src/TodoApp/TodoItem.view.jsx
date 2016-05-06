import React, { PropTypes } from 'react';
import classNames from 'classnames';

export default function TodoItem({ todo, dispatch }) {
    const onToggle = () => dispatch({ type: 'Change',
        data: { completed: !todo.completed } });
    const onDelete = () => dispatch({ type: 'Delete' });
    const onRequestEdit = () => dispatch({ type: 'RequestEdit' });

    return (
        <li className={classNames({
            completed: todo.completed,
            editing: false,
        })}>
            <div className='view'>
                <input
                  className='toggle'
                  type='checkbox'
                  checked={todo.completed}
                  onChange={onToggle} />
                <label onDoubleClick={onRequestEdit}>
                    {todo.title}
                </label>
                <button className='destroy' onClick={onDelete} />
            </div>
        </li>);
}

TodoItem.propTypes = {
    todo: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};
