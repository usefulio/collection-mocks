Package.describe({
  name: 'useful:collection-mocks',
  version: '0.0.1',
  summary: 'Adds a method to Mongo.Collection\'s prototype that mocks the results of a db operation',
  git: 'https://github.com/usefulio/collection-mocks.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('mongo');

  api.addFiles('collection-mocks.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mongo');
  
  api.use('useful:collection-mocks');
  api.addFiles('collection-mocks-tests.js');
});
