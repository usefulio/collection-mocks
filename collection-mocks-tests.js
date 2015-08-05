// Tests if mock object property gets set when using the insert argument
Tinytest.add('mock method - insert argument - property gets set correctly', function (test) {
  var TestCollection = new Mongo.Collection(null);
  var mock = TestCollection.mock({ name: 'joe' });
  test.equal(mock.name, 'joe');
});

// Tests if mock object property gets set when using the update argument
Tinytest.add('mock method - update argument - property gets set correctly', function (test) {
  var TestCollection = new Mongo.Collection(null);
  var mock = TestCollection.mock({ name: 'joe' }, { $set: { read: true } });
  test.equal(mock.read, true);
}); 

Tinytest.add('mock method - update argument - property gets overriden', function (test) {
  var TestCollection = new Mongo.Collection(null);
  var mock = TestCollection.mock({ name: 'joe', read: true }, { $set: { read: false } });
  test.equal(mock.read, false);
}); 

// Tests if mock object property gets set when using the find argument
Tinytest.add('mock method - find argument - object exists', function (test) {
  var TestCollection = new Mongo.Collection(null);
  var mock = TestCollection.mock({ name: 'joe', key: 'abc' }, null, { key: 'abc' });
  test.equal(mock.name, 'joe');
}); 

Tinytest.add('mock method - find argument - object does not exist', function (test) {
  var TestCollection = new Mongo.Collection(null);
  var mock = TestCollection.mock({ name: 'joe', key: 'abc' }, null, { key: 'xyz' });
  test.equal(mock, undefined);
});

// Tests if mockMulti can insert multiple documents
Tinytest.add('mockMulti method - insert argument - multiple documents are inserted', function (test) {
  var TestCollection = new Mongo.Collection(null);
  var mocks = TestCollection.mockMulti([{ name:'john' }, { name:'jim' }, { name: 'joe' }]);
  test.length(mocks, 3);
  test.equal(mocks[0].name, 'john');
  test.equal(mocks[1].name, 'jim');
  test.equal(mocks[2].name, 'joe');
});

// Tests if mockMulti updates all documents only when multi flag is passed
Tinytest.add('mockMulti method - update argument - without multi flag', function (test) {
  var TestCollection = new Mongo.Collection(null);
  var mocks = TestCollection.mockMulti([{ name:'john' }, { name:'jim' }], [{}, { $set: { updated: true } }]);
  test.equal(mocks[0].updated, true);
  test.isUndefined(mocks[1].updated);
});

Tinytest.add('mockMulti method - update argument - with multi flag', function (test) {
  var TestCollection = new Mongo.Collection(null);
  var mocks = TestCollection.mockMulti([{ name:'john' }, { name:'jim' }], [{}, { $set: { updated: true } }, { multi: true }]);
  test.equal(mocks[0].updated, true);
  test.equal(mocks[1].updated, true);
});

Tinytest.add('mockMulti method - update argument - with update query', function (test) {
  var TestCollection = new Mongo.Collection(null);
  var mocks = TestCollection.mockMulti([{ name:'john' }, { name:'jim' }], [{name: 'jim'}, { $set: { updated: true } }, { multi: true }], {updated: true});

  test.equal(mocks.length, 1);
  test.equal(mocks[0].name, 'jim');
  test.equal(mocks[0].updated, true);
});

Tinytest.add('mockMulti method - update argument - without insert', function (test) {
  var TestCollection = new Mongo.Collection(null);
  TestCollection.insert({name: 'john'});
  TestCollection.insert({name: 'jim'});
  var mocks = TestCollection.mockMulti(null, [{}, { $set: { updated: true } }, { multi: true }], {updated: true});

  test.equal(mocks.length, 2);
  test.equal(mocks[0].updated, true);
  test.equal(mocks[1].updated, true);
});

// Tests if mockMulti returns an array of documents
Tinytest.add('mockMulti method - find argument - result is array of documents', function (test) {
  var TestCollection = new Mongo.Collection(null);
  var mocks = TestCollection.mockMulti([{ name:'john' }, { name:'jim' }], [{}, { $set: { updated: true } }, { multi: true }], { updated: true });
  test.length(mocks, 2);
  _.each(mocks, function(doc) { 
    test.equal(doc.updated, true);
  })
});

Tinytest.addAsync('mockMulti method - insert argument - multiple arguments are supported', function (test, done) {
  var TestCollection = new Mongo.Collection(null);
  var didNotice = false;
  var notice = function () { test.isTrue(true); done(); };
  var mocks = TestCollection.mockMulti([[{name: 'joe'}, notice]]);
  test.length(mocks, 1);
});