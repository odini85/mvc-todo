import EventEmitter from './event-emitter.js';

export class TodoItemModel {
  constructor(id, text, createAt, isDone) {
    this.text = text;
    this.id = id;
    this.createAt = createAt;
    this.isDone = isDone;
  }
}

export class TodoListModel {
  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;
    this.todos = [];
    this.id = 0;
    this.eventEmitter.on('view:add', this.add.bind(this));
    this.eventEmitter.on('view:remove', this.remove.bind(this));
    this.eventEmitter.on('view:done', this.toggle.bind(this));
  }
  add(text) {
    const id = this.id++;
    const createAt = new Date();
    const isDone = false;
    this.todos.push(new TodoItemModel(id, text, createAt, isDone));
    this.eventEmitter.fire('model:add', this.todos);
  }
  toggle(toggleId) {
    const item = this.todos.find(({id}) => {
      return toggleId === id;
    });
    if (item) {
      item.isDone = !item.isDone;
    }
    this.eventEmitter.fire('model:toggle', this.todos);
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
      this.eventEmitter.fire('model:remove', this.todos);
    }
    return isSucceeded;
  }
  getList() {
    return this.todos;
  }
}

export class TodoListView {
  constructor(eventEmitter, rootEl) {
    this.rootEl = rootEl;
    this.eventEmitter = eventEmitter;
    this.renderOutline();
    this.bindEvent();
    this.eventEmitter.on('model:add', this.renderList.bind(this));
    this.eventEmitter.on('model:remove', this.renderList.bind(this));
    this.eventEmitter.on('model:toggle', this.renderList.bind(this));
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
    const {value} = textEl;
    if (value.trim()) {
      this.eventEmitter.fire('view:add', value);
      textEl.value = '';
    }
  }
  handlerList(e) {
    const tagName = e.target.tagName.toLowerCase();
    if (tagName === 'button') {
      const id = Number(e.target.getAttribute('data-id'));
      const type = e.target.getAttribute('data-type');
      if (type === 'done') {
        this.eventEmitter.fire('view:done', id);
      } else if (type === 'remove') {
        this.eventEmitter.fire('view:remove', id);
      }
    }
  }
}

export class TodoController {
  constructor(rootEl) {
    this.eventEmitter = new EventEmitter();
    this.view = new TodoListView(this.eventEmitter, rootEl);
    this.listModel = new TodoListModel(this.eventEmitter);
  }
}
