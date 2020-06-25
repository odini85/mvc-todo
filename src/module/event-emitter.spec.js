import EventEmitter from './event-emitter.js';

let eventEmitter = new EventEmitter();

beforeEach(() => {
  eventEmitter._handlers = [];
});

describe('customEvents', () => {
  test('on()으로 이벤트 구독을 등록한다', () => {
    const fn = jest.fn();
    eventEmitter.on('test', fn);

    expect(eventEmitter._handlers.test[0]).toBe(fn);
  });
  test('off()으로 등록된 이벤트 헨들러를 제거 한다.', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    eventEmitter.on('test', fn1);
    eventEmitter.on('test', fn2);
    eventEmitter.off('test', fn1);
    expect(eventEmitter._handlers.test.length).toBe(1);
  });
  test('off()으로 등록되지 않은 이벤트명을 넘기면 무시한다.', () => {
    const fn1 = jest.fn();
    eventEmitter.on('test', fn1);
    eventEmitter.off('test1', fn1);
    expect(eventEmitter._handlers.test.length).toBe(1);
  });
  test('off()로 제거될 이벤트에 헨들러 리스트가 비어 있다면 해당 이벤트 이름의 프로퍼티는 제거 된다.', () => {
    const fn1 = jest.fn();
    eventEmitter.on('test', fn1);
    eventEmitter.off('test', fn1);
    expect(eventEmitter._handlers.test).toBeUndefined();
  });
  test('fire()으로 등록되지 않은 이벤트명을 넘기면 무시한다.', () => {
    const fn1 = jest.fn();
    eventEmitter.on('test', fn1);
    eventEmitter.fire('test1', 1, 2, 3, 4);
    expect(eventEmitter._handlers.test.length).toBe(1);
  });
  test('fire()으로 등록된 이벤트 헨들러 실행한다.', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    eventEmitter.on('test', fn1);
    eventEmitter.on('test', fn2);

    eventEmitter.fire('test');
    expect(fn1).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
  });
  test('fire()으로 전달한 인자를 등록된 이벤트 헨들러에 전달하여 실행한다.', () => {
    const fn1 = jest.fn();
    eventEmitter.on('test', fn1);
    eventEmitter.fire('test', 1, 2, 3, 4);

    expect(fn1).toHaveBeenCalledWith(1, 2, 3, 4);
  });
});
