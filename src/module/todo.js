import EventEmitter from './event-emitter.js';

class EventExecutor {
  bindEventExecutor(controller) {
    this.eventExecutor = controller.eventExecutor.bind(controller);
  }
  eventExecutor() {}
}
export class TodoItemModel {
  constructor(id, text, createAt, isDone) {
    this.text = text;
    this.id = id;
    this.createAt = createAt;
    this.isDone = isDone;
  }
}

export class TodoListModel extends EventExecutor {
  constructor() {
    super();
    this.todos = [];
    this.id = 0;
  }
  add(text) {
    const id = this.id++;
    const createAt = new Date();
    const isDone = false;
    this.todos.unshift(new TodoItemModel(id, text, createAt, isDone));
    this.eventExecutor('model:add', this.todos);
  }
  toggle(toggleId) {
    const item = this.todos.find(({id}) => {
      return toggleId === id;
    });
    if (!item) {
      return;
    }

    item.isDone = !item.isDone;
    this.eventExecutor('model:toggle', this.todos);
  }
  remove(removeId) {
    let isSucceeded = false;
    this.todos = this.todos.filter(({id}) => {
      if (removeId === id) {
        isSucceeded = true;
      }
      return removeId !== id;
    });
    if (isSucceeded) {
      this.eventExecutor('model:remove', this.todos);
    }
    return isSucceeded;
  }
  getList() {
    return this.todos;
  }
}

export class TodoListView extends EventExecutor {
  constructor(rootEl) {
    super();
    this.rootEl = rootEl;
    this.renderOutline();
    this.bindEvent();
  }
  renderOutline() {
    this.rootEl.innerHTML = `
        <form class="uid_form">
            <fieldset>
                <legend>todo list</legend>
                <input type="text" class="uid_text" />
                <button type="submit">등록</button>
            </fieldset>
        </form>
        <div class="uid_list">
        </div>
    `;
  }
  renderList(list) {
    let html = list
      .map(({id, text, isDone}) => {
        return `
            <li>
                ${text} 
                <button data-type="done" data-id="${id}">${isDone ? '취소' : '완료'}</button>
                <button data-type="remove" data-id="${id}">삭제</button>
            </li>
          `;
      })
      .join('');

    this.rootEl.querySelector('.uid_list').innerHTML = html;
  }
  bindEvent() {
    const formEl = this.rootEl.querySelector('.uid_form');
    const listEl = this.rootEl.querySelector('.uid_list');

    formEl.addEventListener('submit', this.handlerSubmit.bind(this));
    listEl.addEventListener('click', this.handlerList.bind(this));
  }
  handlerSubmit(e) {
    e.preventDefault();
    const textEl = this.rootEl.querySelector('.uid_text');
    const value = textEl.value.trim();
    if (!value) {
      return;
    }

    textEl.value = '';
    this.eventExecutor('view:add', value);
  }
  handlerList(e) {
    const tagName = e.target.tagName.toLowerCase();
    if (tagName !== 'button') {
      return;
    }

    const id = Number(e.target.getAttribute('data-id'));
    const type = e.target.getAttribute('data-type');
    if (type === 'done') {
      this.eventExecutor('view:done', id);
    } else if (type === 'remove') {
      this.eventExecutor('view:remove', id);
    }
  }
}

export class TodoController {
  constructor(view, model) {
    this.eventEmitter = new EventEmitter();
    this.view = view;
    this.model = model;

    view.bindEventExecutor(this);
    model.bindEventExecutor(this);
    this.subscribeRegister();
  }
  eventExecutor(eventName, ...rest) {
    this.eventEmitter.fire(eventName, ...rest);
  }
  subscribeRegister() {
    // view
    this.eventEmitter.on('view:add', (...rest) => {
      this.model.add(...rest);
    });
    this.eventEmitter.on('view:remove', (...rest) => {
      this.model.remove(...rest);
    });
    this.eventEmitter.on('view:done', (...rest) => {
      this.model.toggle(...rest);
    });

    // model
    this.eventEmitter.on('model:add', (...rest) => {
      this.view.renderList(...rest);
    });
    this.eventEmitter.on('model:remove', (...rest) => {
      this.view.renderList(...rest);
    });
    this.eventEmitter.on('model:toggle', (...rest) => {
      this.view.renderList(...rest);
    });
  }
}

export function createTodo(rootEl) {
  const view = new TodoListView(rootEl);
  const model = new TodoListModel();
  return new TodoController(view, model);
}
