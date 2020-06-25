import {TodoController} from './todo.js';

document.body.innerHTML = '<div id="app"></div>';

describe('TodoController', () => {
  test('constructor() - 인스턴스 생성시 초기값으로 엘리먼트를 전달한다.', () => {
    const rootEl = document.querySelector('#app');
    new TodoController(rootEl);
  });
});
