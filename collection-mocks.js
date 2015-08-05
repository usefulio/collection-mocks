/**
 * @summary The mock collection variable. A null collection used to mock the results of a db operation
 */
var mockCollection = new Mongo.Collection(null);

/**
 * @summary The mock method. It is applied to the Mongo.Collection prototype and mocks the results of a db operation
 * @locus Anywhere
 * @method mock
 * @memberOf Mongo.Collection
 * @param {Object | Array} insert An array of arguments to be passed to the mockCollection's insert method
 * @param {Object | Array} update An array of arguments to be passed to the mockCollection's update method
 * @param {Object | Array} find An array of arguments to be passed to the mockCollection's findOne method
 * @return {Object} The result of findOne
 */
Mongo.Collection.prototype.mock = function (insert, update, find) {
  var self = this;

  // clear out the mock collection in case any previous calls failed to clean
  // up after themselves
  mockCollection.remove({});
  
  // if the user doesn't pass an insert argument, lets try to find the document
  // they're trying to update by searching the real collection (self)
  if (! insert) {
    if (! _.isArray(update))
      throw new Error("implicit insert requires two update arguments");
    insert = self.findOne(update[0]);
  }
  
  // insert is actually the array of arguments to be passed to the
  // insert method, but we don't want to force users to call mock with
  // an array if they don't want to
  if (! _.isArray(insert)) {
    insert = [insert];
  }

  // insert the document into the mock collection
  var insertResult;
  if (insert && insert[0])
    insertResult = mockCollection.insert.apply(mockCollection, insert);

  // just like insert, update is the array of arguments that we pass to the
  // update method; we use the insertResult document as the query selector
  if (update) {
    if (! _.isArray(update)) {
      update = [insertResult, update];
    }
    /*var updateResult = */mockCollection.update.apply(mockCollection, update);
  }

  // use the document we just inserted if no find argument exists
  if (! find) find = insertResult;

  // Make sure we pass an array to findOne
  if (! _.isArray(find)) {
    find = [find];
  }

  // find the document in the mock collection
  var findResult = mockCollection.findOne.apply(mockCollection, find);

  // return the results of the findOne method
  return findResult;
};