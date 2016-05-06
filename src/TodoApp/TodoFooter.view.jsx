import React from 'react';
import classNames from 'classnames';

export default function TodoFooter({ activeCount, completedCount, filter, dispatch }) {
    const onChangeFilter = filter => dispatch({ type: 'ChangeFilter', filter: filter });
    const onClearCompleted = filter => dispatch({ type: 'ClearCompleted' });

    return (
        <footer className='footer'>
            <span className='todo-count'>
                <strong>{activeCount}</strong>
                {' '}{pluralize(activeCount, 'item')} left
            </span>
            <ul className='filters'>
                <li>
                    <FilterLink
                      onClick={() => onChangeFilter('All')}
                      filterType={'All'} text='All'
                      currentFilter={filter} />
                </li>
                <li>
                    <FilterLink
                      onClick={() => onChangeFilter('Active')}
                      filterType={'Active'} text='Active'
                      currentFilter={filter} />
                </li>
                <li>
                    <FilterLink
                      onClick={() => onChangeFilter('Completed')}
                      filterType={'Completed'} text='Completed'
                      currentFilter={filter} />
                </li>
            </ul>
            {(completedCount > 0)
                ? <button onClick={onClearCompleted} className='clear-completed'>Clear completed</button>
                : null}
        </footer>
    );
}

// eslint-disable-next-line react/no-multi-comp
function FilterLink({filterType, text, currentFilter, onClick}) {
    const className = classNames({ selected: currentFilter === filterType });
    return <a onClick={onClick} href='#/' className={className}>{text}</a>;
}

function pluralize(count, word) {
    return count === 1 ? word : word + 's';
}
