// This function uses a null collection to mock the results of a db operation
// e.g. Books.mock({name: 'joe'}, {$set: {read: true}})
// returns {name: 'joe', read: true}

var mockCollection = new Mongo.Collection(null);

Mongo.Collection.prototype.mock = function (insert, update, find) {
  var self = this;

  // clear out the mock collection in case any previous calls failed to clean
  // up after themselves
  mockCollection.remove({});

  if (! insert) {
    if (! _.isArray(update))
      throw new Error("implicit insert requires two update arguments");
    insert = self.findOne(update[0]);
  }
  if (! _.isArray(insert)) {
    insert = [insert];
  }

  var insertResult;
  if (insert && insert[0])
    insertResult = mockCollection.insert.apply(mockCollection, insert);

  if (update) {
    if (! _.isArray(update)) {
      update = [insertResult, update];
    }
    var updateResult = mockCollection.update.apply(mockCollection, update);
  }

  if (! find) find = insertResult;

  if (! _.isArray(find)) {
    find = [find];
  }

  var findResult = mockCollection.findOne.apply(mockCollection, find);

  return findResult;
};