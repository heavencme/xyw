var redis = require( 'redis' );

function Redis( id ) {	
	this.id = id;

	// connect to the default: port(6379), host(127.0.0.1), options(null)
	this.client = redis.createClient();
	
	// make client access to callback function
	var client = this.client;

	
	// establish connection to redis
	this.on = function(){
		client.on("error", function( err ) {
			if( err ) {
				console.log( "Err" + err );
			}
		});
	}

	// unset the connection
	this.quit = function(){
		client.quit();
	}

}

/**hmset method**/
Redis.prototype.hashMultiSet = function( event, act, key, valueObj ){
	// make quit method access to callback
	var quit = this.quit;

	// establish
	this.on();

	//hash multi set
	this.client.hmset( key, valueObj, function( err, replies ){
		if( err ){
			console.log( err );
			return;
		}

		var resultObj = {};
		resultObj.database = 'redis';
		resultObj.action = act;
		resultObj.data = replies;
		event.emit( 'ready', resultObj );

		// quit connection
		quit();
	});
}

/**hgetall method**/
Redis.prototype.hashGetAll = function( event, act, key ){
	// make quit method access to callback
	var quit = this.quit;

	// establish
	this.on();

	//hash multi set
	this.client.hgetall( key, function( err, replies ){
		if ( err ){
			console.log( err );
			return;
		}

		var resultObj = {};
		resultObj.database = 'redis';
		resultObj.action = act;
		resultObj.data = replies;
		event.emit( 'ready', resultObj );

		// quit connection
		quit();
	});
}

/**hset method to alt certain key field**/
Redis.prototype.hashSet = function( event, act, key, field, value ){
	// make quit method access to callback
	var quit = this.quit;

	// establish
	this.on();

	//hash multi set
	this.client.hset( key, field, value, function( err, replies ){
		if ( err ){
			console.log( err );
			return;
		}

		var resultObj = {};
		resultObj.database = 'redis';
		resultObj.action = act;
		resultObj.data = replies;
		event.emit( 'ready', resultObj );

		// quit connection
		quit();
	});
}

Redis.prototype.identify = function(){
 return this.id;
}

module.exports = Redis;


/**
	//set
	client.set( 'myName', 'wb', redis.print );

	//multi set
	client.mset( 'myAge', 23, 'myPro', 'cs', redis.print );
	client.mset( ['myAge', 23, 'myPro', 'cs'], redis.print );

	//get
	client.get ( 'myName', function( err, data ) {
		if ( err ) {
			console.log( err );
			return;
		}
		console.log (data);
	});

	// hash get all
	client.hgetall( 'user:1', function( err, data ) {
		if ( err ) {
			console.log ( err );
			return;
		}
		console.log( data );
	});


	//hash set
	client.hset( 'user:1', 'name', 'wb', redis.print );

	//retrieve data
	client.hgetall( 'user:1', function( err, obj ){
		if ( err ){
			console.log( err );
			return;
		}
		console.log( obj );
	});

// multi operation
client.multi()
	.sadd( 'user:1:name', 'wb' )
	.sadd( 'user:1:age', 23 )
	.sadd( 'user:2:name', 'lv' )
	.sadd( 'user:2:age', 22 )
	.exec( function( err, reply ){
		if ( err ) {
			console.log( err );
			return;
		}
		console.log( reply );

		//end
		client.end();
	});

**/

