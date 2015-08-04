// Tests if mock object property gets set when using the insert argument
Tinytest.add('Mock Collection - insert argument - property gets set correctly', function (test) {
  var TestCollection = new Mongo.Collection('test1');
  var mock = TestCollection.mock({ name: 'joe' });
  test.equal(mock.name, 'joe');
});

// Tests if mock object property gets set when using the update argument
Tinytest.add('Mock Collection - update argument - property gets set correctly', function (test) {
  var TestCollection = new Mongo.Collection('test2');
  var mock = TestCollection.mock({ name: 'joe' }, { $set: { read: true } });
  test.equal(mock.read, true);
}); 

Tinytest.add('Mock Collection - update argument - property gets overriden', function (test) {
  var TestCollection = new Mongo.Collection('test3');
  var mock = TestCollection.mock({ name: 'joe', read: true }, { $set: { read: false } });
  test.equal(mock.read, false);
}); 

// Tests if mock object property gets set when using the find argument
Tinytest.add('Mock Collection - find argument - object exists', function (test) {
  var TestCollection = new Mongo.Collection('test4');
  var mock = TestCollection.mock({ name: 'joe', key: 'abc' }, null, { key: 'abc' });
  test.equal(mock.name, 'joe');
}); 

Tinytest.add('Mock Collection - find argument - object does not exist', function (test) {
  var TestCollection = new Mongo.Collection('test5');
  var mock = TestCollection.mock({ name: 'joe', key: 'abc' }, null, { key: 'xyz' });
  
  test.equal(mock, undefined);
});