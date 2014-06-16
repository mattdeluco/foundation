# Foundation

Foundation is a framework I've created, based off an old version of
[mean.io](https://github.com/linnovate/mean), to help me rapidly develop and
deploy some of my own web app ideas.

## Depedencies
* Node.js
* MongodDB
* NPM
* Bower
* Optional: Grunt

## Quick Install
```
$ git clone git@github.com:mattdeluco/snap.git
$ npm install
$ grunt || node server
```

## Structure
Foundation is broken up into client and server modules.

### Server
The [expressjs](http://expressjs.com) server functions mainly as a way to deploy the client and to provide a
storage API.  A server module is a subdirectory under server/ with the
following files, where "Module" is the name of the module, e.g. User:

* tests/ - contains unit test files
  * ModuleXTest.js - unit test files must end in Test.js, for example "UserModelTest.js"
* ModuleModel.js - the mongoose model definition
* ModuleController.js - the controller
* ModuleAPI.js - the routes that define the API for the module


### Client
The [AngularJS](https://angularjs.org) and [Twitter Bootstrap](http://getbootstrap.com)
based client.

 
## Configuration
All configuration is specified in the [config](config/) folder, particularly the [config.js](config/config.js) file and the [env](config/env/) files. Here you will need to specify your application name, database name, as well as hook up any social app keys if you want integration with Twitter, Facebook, GitHub or Google.

### Environmental Settings

There are three environments provided by default, __development__, __test__, and __production__. Each of these environments has the following configuration options:
* __db__ - This is the name of the MongoDB database to use, and is set by default to __mean-dev__ for the development environment.
* __app.name__ - This is the name of your app or website, and can be different for each environment. You can tell which environment you are running by looking at the TITLE attribute that your app generates.
* __Social OAuth Keys__ - Facebook, GitHub, Google, Twitter. You can specify your own social application keys here for each platform:
	* __clientID__
	* __clientSecret__
	* __callbackURL__

To run with a different environment, just specify NODE_ENV as you call grunt:

	$ NODE_ENV=test grunt

If you are using node instead of grunt, it is very similar:

	$ NODE_ENV=test node server

> NOTE: Running Node.js applications in the __production__ environment enables caching, which is disabled by default in all other environments.

## Credits
Inspired and borrowed from the terrific [mean.io](https://github.com/linnovate/mean)
project.