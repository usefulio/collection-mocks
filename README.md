# Easy mocks for your collections

This package adds a method to Mongo.Collection's prototype that mocks the results of a db operation.

### Installation
Simply add the `useful:collection-mocks` package to your meteor app and you can start using the `mock` and `mockMulti` methods on your collections.

The `mock` method is attached to `Mongo.Collection.prototype` which means that you can access it from any of your collections, e.g. `Books.mock`, and the mock method will be able to access your collection, if need be.

### Your Collections
The `mock` and `mockMulti` methods access your collection only to read existing data & only if you don't pass an insert argument.

### Examples
```
Books.mock({name: 'Leave it to Jeeves'}, {$set: {author: 'PGWoodhouse'}}) 
// -> {name: 'Leave it to Jeeves', author: 'PGWoodhouse'}
```

```
Books.mock(null, [{author: 'PGWoodhouse'}, {$set: {rating: 5}}])
// if a book with author 'PGWoodhouse' exists, we'll return that book with the updated rating
```

```
Books.mock({name: 'untitled'}, null, {name: {$in: ['untitled']}})
// -> {name: 'untitled'}
```

```
var changedDocs = myCollection.mockMulti([{name: 'john'}, {name: 'john'}], [{name: 'john'}, {$set: {selected: true}}, {multi: true}])
// inserts two identical documents, performs an update which affects both documents and returns all the affected documents.
```

### mock vs mockMulti

The `mock` and `mockMulti` both simulate the result of mongo db operations against your collection, but are subtly different, here's a quick run down of when to use which:

1. You should generally use the mock method, especially for allow/deny rules and other cases where you know that only one document will be affected (or you only care about one document).
2. You should use the mockMulti method to test the behavior of update operations which may affect multiple documents
3. You should use the mockMulti method with caution on the server, it will load all affected documents into memory!

### How it works

**The `mock` method takes three arguments:**

- `insert` an array of arguments to be passed to the mockCollection's insert method
- `update` an array of arguments to be passed to the mockCollection's update method
- `find` an array of arguments to be passed to the mockCollection's findOne method

The mock method executes insert, then update, and finally findOne and returns the result of findOne.

Each argument is optional and we have some smart behavior to handle non-existant arguments:
- `insert`, if not specified we'll grab the first part of the `update` operator as a query and insert the first doc which matches that query
- `update`, if not specified we'll skip the update, if a single argument is specified, we'll use the id returned by our insert operation as the first argument (the query)
- `find`, if not specified we'll use the id returned by our insert operation

**The `mockMulti` method takes four arguments:**

- `insert` an array of documents to be inserted in the mock collection, you can also pass an array of arrays if you want more control over which arguments are passed to the insert method.
- `update` an array of arguments to be passed to the mockCollection's update method
- `find` an array of arguments to be passed to the mockCollection's find method

The mockMulti method executes insert, then update, and finally find and returns the result of find().fetch().

Each argument is optional:
- `insert`, if not specified we'll grab the first part of the `update` operator as a query and insert all the found documents into our mock collection
- `update`, if not specified we'll skip the update, if a single argument is specified, we'll use the ids returned by our insert operation as the first argument (the query)
- `find`, if not specified we'll use the ids returned by our insert operation
