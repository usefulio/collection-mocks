# Easy mocks for your collections

This package adds a method to Mongo.Collection's prototype that mocks the results of a db operation.

**This is a work in progress.**

### Installation
Simply add the `useful:collection-mocks` package to your meteor app and you can start using the `mock` method on your collections.

### Examples
```
Books.mock({name: 'Leave it to Jeeves'}, {$set: {author: 'PGWoodhouse'}}) 
// -> {name: 'Leave it to Jeeves', author: 'PGWoodhouse'}
```

```
Books.mock(null, [{author: 'PGWoodhouse'}, {$set: {rating: 5}}])
// -> if a book with author 'PGWoodhouse' exists, we'll return that book with the updated rating
```

```
Books.mock({name: 'untitled'}, null, {name: {$in: ['untitled']}})
// -> {name: 'untitled'}
```

### How it works

The mock method takes three arguments:

- `insert` an array of arguments to be passed to the mockCollection's insert method
- `update` an array of arguments to be passed to the mockCollection's update method
- `find` an array of arguments to be passed to the mockCollection's findOne method

The mock method executes insert, then update, and finally findOne and returns the result of findOne.

Each argument is optional and we have some smart behavior to handle non-existant arguments
- `insert`, if not specified we'll grab the first part of the `update` operator
- `update`, if not specified we'll skip the update, if a single argument is specified, we'll use the id returned by our insert operation as the first argument (the query)
- `find`, if not specified we'll use the id returned by our insert operation