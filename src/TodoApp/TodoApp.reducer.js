import { Map } from 'immutable';
import { List } from 'immutable';
import { spoiled } from 'reelm';
import { put, take, select } from  'reelm/effects';
import { defineReducer } from 'reelm/fluent';

export const Change = 'Change';
export const Add = 'Add';
export const Delete = 'Delete';
export const TodoItems = 'TodoItems';

function perform(effect) {
    if (typeof effect === 'function') {
        return (state, action) =>
            spoiled(state, function* () {
                yield* effect(action);
            });
    }
    else {
        return state =>
            spoiled(state, function* () {
                yield effect;
            });
    }
}

const todoItemReducer = defineReducer(Map({}))
    .on(Change, (state, { data }) => state.mergeDeep(data));

const todoItemListReducer = defineReducer(List())
    .scopedOver('[Index]', ({ Index }) => ([Index]), todoItemReducer)
    .on('Add', (list, { item }) => list.push(Map(item)))
    .on('[Index].Delete', (list, { match: { Index } }) => list.delete(Index))
    .on('[Index].Replace', (list, { item, match: { Index } }) => list.set(Index, item));

export default defineReducer(Map({ newTodoText: '', currentEditingIndex: null, filter: 'All' }))
    .scopedOver(TodoItems, ['todoItems'], todoItemListReducer)
    .scopedOver('CurrentEditingItem', ['currentEditingItem'], todoItemReducer)
    .on('ChangeFilter', (state, { filter }) => state.set('filter', filter))
    .on('ToggleAll', state => state.update('todoItems', todoItems => {
        if (todoItems.some(x => !x.get('completed'))) {
            return todoItems.map(x => x.set('completed', true));
        }
        else {
            return todoItems.map(x => x.set('completed', false));
        }
    }))
    .on('ClearCompleted', state =>
        state.update('todoItems', todoItems => todoItems.filter(x => !x.get('completed'))))
    .on('BeginEdit', (state, { item, index }) =>
        state.merge({
            currentEditingItem: item,
            currentEditingIndex: index,
        }))

    .on('ComleteEdit', state =>
        state.merge({
            currentEditingItem: null,
            currentEditingIndex: null,
        }))

    .on(`${TodoItems}.[Index].RequestEdit`, perform(function* ({ match: { Index } }) {
        const currentEditingIndex = yield select(x => x.get('currentEditingIndex'));
        if (currentEditingIndex === null) {
            const itemToEdit = yield select(x => x.getIn(['todoItems', Index]));
            yield put({ type: 'BeginEdit', item: itemToEdit, index: parseInt(Index, 10) });
            const completeAction = yield take(['CurrentEditingItem.SubmitEdit', 'CurrentEditingItem.CancelEdit']);
            if (completeAction.type === 'CurrentEditingItem.SubmitEdit') {
                const itemAfterEdit = yield select(x => x.get('currentEditingItem'));
                if (itemAfterEdit.get('title') === '')
                    yield put({ type: `TodoItems.${Index}.Delete` });
                else
                    yield put({ type: `TodoItems.${Index}.Replace`, item: itemAfterEdit });
            }
            yield put({ type: 'ComleteEdit' });
        }
    }))

    .on('NewTodo.Clear', state => state.set('newTodoText', ''))
    .on('NewTodo.Change', (state, { text }) => state.set('newTodoText', text))

    .on('CreateTodo', perform(function* ({ text }) {
        yield put({
            type: 'TodoItems.Add',
            item: { title: text, completed: false } });
        yield put({
            type: 'NewTodo.Clear' });
    }));

