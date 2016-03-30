var mongodb = require('mongodb');
var settings = require('./settings');

function mgDB( id ) {
	this.id = id;
	this.mgClient = mongodb.MongoClient;
	// certain database
	this.mongoUri = 'mongodb://localhost:27017/leihou';
}

/** insert method **/
mgDB.prototype.insert = function( event, act, collection, docArr ) {
	// connect to database
	this.mgClient.connect( this.mongoUri, function(err, db) {
		if (err) {
			throw err;
			return;
		}
		
		// choose the collection
		var cl = db.collection( collection );

		// insert opration
		cl.insert(docArr, function(err, result) {
			if (err) {
				throw err;
				return;
			}

			if (result) {
				// pack the data
				var resultObj = {};
				resultObj.database = 'mongodb';
				resultObj.data = result;

				// closure make variables: act, event accessible to callback function
				resultObj.action = act;
				event.emit( 'ready', resultObj );

				// close the connect
				db.close();
			}

		});

	});
}

/** find method **/
mgDB.prototype.find = function( event, act, collection, query, fields, option, responseObj ){
	// connect to database
	this.mgClient.connect( this.mongoUri, function(err, db) {
		if( err ) {
			throw err;
			return;
		}
		
		// choose the collection
		var cl = db.collection( collection );
			
		// find operation
		cl.find( query, fields, option ).toArray(function(err, result) {
			if( err ) {
				throw err;
				return;
			}

			if( result ) {
				// pack the data
				var resultObj = {};
				resultObj.database = 'mongodb';
				resultObj.data = result;

				// closure make variables: act, event accessible to callback function
				resultObj.action = act;
				resultObj['responseObj'] = responseObj;
				event.emit( 'ready', resultObj );

				// close the connect
				db.close();	
			}
		});

	
	});
}

/** update method **/
mgDB.prototype.update = function( event, act, collection, query, doc, option ){
	// connect to database
	this.mgClient.connect( this.mongoUri, function(err, db) {
		if( err ) {
			throw err;
			return;
		}
		
		// choose the collection
		var cl = db.collection( collection );
			
		// find oprationa
		cl.update( query, doc, option, function(err, numUpdated) {
			if( err ) {
				throw err;
				return;
			}

			if( numUpdated ) {
				// pack the data
				var resultObj = {};
				resultObj.database = 'mongodb';
				resultObj.data = numUpdated;

				// closure make variables: act, event accessible to callback function
				resultObj.action = act;
				event.emit( 'ready', resultObj );

				// close the connect
				db.close();	
			}
		});

	
	});
}


mgDB.prototype.identify = function(){
 return this.id;
}

module.exports = mgDB; 
