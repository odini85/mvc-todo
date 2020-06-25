import {TodoListView, TodoItemModel} from './todo.js';
import EventEmitter from './event-emitter.js';

document.body.innerHTML = '<div id="app"></div>';
const eventEmitter = new EventEmitter();
const rootEl = document.querySelector('#app');
const todoListView = new TodoListView(eventEmitter, rootEl);

describe('TodoListView', () => {
  test('constructor() - 인스턴스가 생성될때 기본 DOM 구조가 생성된다.', () => {
    expect(rootEl.querySelector('.uid_form')).not.toBeNull();
    expect(rootEl.querySelector('.uid_text')).not.toBeNull();
    expect(rootEl.querySelector('.uid_list')).not.toBeNull();
  });
  test('renderList() - 인자로 전달된 갯수 만큼 아이템 리스트를 랜더링한다. ', () => {
    todoListView.renderList(
      Array(5)
        .fill(null)
        .map((_, index) => {
          return new TodoItemModel({
            id: index,
            text: 'test_' + index,
            createAt: new Date(),
            isDone: false
          });
        })
    );
    expect(rootEl.querySelector('.uid_list').querySelectorAll('li').length).toBe(5);
  });
  test('handlerSubmit() - 메소드가 호출되면 uid_text값을 검증하고 view:add에 값을 전달한다. ', () => {
    const fn = jest.fn();
    eventEmitter.on('view:add', fn);
    rootEl.querySelector('.uid_text').value = 'aaaa';
    todoListView.handlerSubmit({preventDefault: () => {}});

    expect(fn.mock.calls[0][0]).toBe('aaaa');
  });
  test('handlerList() - done 버튼을 클릭하면 view:done에 id값을 전달한다. ', () => {
    const fn = jest.fn();
    eventEmitter.on('view:done', fn);
    const buttonEl = rootEl.querySelectorAll('button[data-type="done"]')[1];
    buttonEl.click();
    expect(fn).toBeCalled();
    expect(typeof fn.mock.calls[0][0]).toBe('number');
  });
  test('handlerList() - remove 버튼을 클릭하면 view:remove에 id값을 전달한다. ', () => {
    const fn = jest.fn();
    eventEmitter.on('view:remove', fn);
    const buttonEl = rootEl.querySelectorAll('button[data-type="remove"]')[1];
    buttonEl.click();
    expect(fn).toBeCalled();
    expect(typeof fn.mock.calls[0][0]).toBe('number');
  });
});
