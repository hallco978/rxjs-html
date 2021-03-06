
var TestScheduler = Rx.TestScheduler,
    Observable = Rx.Observable;

/** Fake DOM Element */
function FakeDOMStandardElement(nodeName) {
    this.listeners = {};
    this.nodeName = nodeName
    this.addEventListenerCalled = false;
    this.removeEventListenerCalled = false;
}

FakeDOMStandardElement.prototype.addEventListener = function (eventName, handler, useCapture) {
    this.listeners[eventName] = handler;
    this.addEventListenerCalled = true;
};

FakeDOMStandardElement.prototype.removeEventListener = function (eventName, handler, useCapture) {
    delete this.listeners[eventName];
    this.removeEventListenerCalled = true;
};

FakeDOMStandardElement.prototype.trigger = function (eventName, eventData) {
    if (eventName in this.listeners) {
        this.listeners[eventName](eventData);
    }
};

test('Event_1', function () {
    var element = new FakeDOMStandardElement('foo');

    var d = Observable.fromEvent(element, 'someEvent')
        .subscribe(function (x) {
            equal(x, 42);
        });

    element.trigger('someEvent', 42);
    equal(element.addEventListenerCalled, true);
    equal(element.removeEventListenerCalled, false);

    d.dispose();

    equal(element.removeEventListenerCalled, true);
});

test('Event_2', function () {
    var elements = [new FakeDOMStandardElement('foo')];

    var d = Observable.fromEvent(elements, 'someEvent')
        .subscribe(function (x) {
            equal(x, 42);
        });

    elements[0].trigger('someEvent', 42);
    equal(elements[0].addEventListenerCalled, true);
    equal(elements[0].removeEventListenerCalled, false);    

    d.dispose();

    equal(elements[0].removeEventListenerCalled, true);    
});

/** Fake DOM Element */
function FakeDOMIEElement(nodeName) {
    this.listeners = {};
    this.nodeName = nodeName
    this.attachEventCalled = false;
    this.detachEventCalled = false;
}

FakeDOMIEElement.prototype.attachEvent = function (eventName, handler) {
    this.listeners[eventName] = handler;
    this.attachEventCalled = true;
};

FakeDOMIEElement.prototype.detachEvent = function (eventName, handler) {
    delete this.listeners[eventName];
    this.detachEventCalled = true;
};

FakeDOMIEElement.prototype.trigger = function (eventName, eventData) {
    if (eventName in this.listeners) {
        this.listeners[eventName](eventData);
    }
};

test('Event_3', function () {
    var element = new FakeDOMIEElement('foo');

    var d = Observable.fromEvent(element, 'someevent')
        .subscribe(function (x) {
            equal(x, 42);
        });

    element.trigger('onsomeevent', 42);
    equal(element.attachEventCalled, true);
    equal(element.detachEventCalled, false);

    d.dispose();

    equal(element.detachEventCalled, true);
});

test('Event_4', function () {
    var elements = [new FakeDOMIEElement('foo')];

    var d = Observable.fromEvent(elements, 'someevent')
        .subscribe(function (x) {
            equal(x, 42);
        });

    elements[0].trigger('onsomeevent', 42);
    equal(elements[0].attachEventCalled, true);
    equal(elements[0].detachEventCalled, false);    

    d.dispose();

    equal(elements[0].detachEventCalled, true);    
});