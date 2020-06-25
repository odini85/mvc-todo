import {TodoListModel} from './todo.js';
import EventEmitter from './event-emitter.js';

let eventEmitter = new EventEmitter();
const todoListModel = new TodoListModel(eventEmitter);

beforeEach(() => {
  todoListModel.todos = [];
});

describe('TodoListModel', () => {
  test('add() - 전달된 인자로 새로운 아이템을 추가한다.', () => {
    todoListModel.add('123');
    const addItem = todoListModel.getList()[0];
    expect(addItem.text).toBe('123');
  });
  test('toggle() - 전달된 아이디에 해당되는 아이템의 완료를 토글시킨다.', () => {
    todoListModel.add('123');
    const item = todoListModel.getList()[0];
    const toggleId = item.id;

    expect(item.isDone).toBe(false);
    todoListModel.toggle(toggleId);
    expect(item.isDone).toBe(true);
  });
  test('remove() - 전달된 아이디에 해당되는 아이템 제거 한다.', () => {
    todoListModel.add('123');
    const item = todoListModel.getList()[0];
    const removeId = item.id;

    todoListModel.remove(removeId);

    expect(todoListModel.getList().length).toBe(0);
  });
});
