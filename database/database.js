var events = require( 'events' );
// module of mysql
var myDB = require( './myDB' );
// module of mongodb
var mgDB = require( './mgDB' );
// module of redis
var Redis = require( './redis');

/**
function Database ( databaseType, event, action, opt ){
	this.databaseType = databaseType;
	this.event = event;
	this.action = action;
	this.opt = opt;

	// initiate the database
	this.initiate();
}
**/

/**register event on 'ready' evnets of data**/
var dataEvents = new events.EventEmitter();
dataEvents.on( 'ready', getData );

/**process the data got from database query results**/
function getData( d ){

	switch( d.database ){
		case 'mysql':
			if( 'query_all_test' == d.action ){
				console.log( d.data );
			}

			break;

		case 'mongodb':
			if( 'insert_test' == d.action ){
				console.log( d.data );
			}
			else if( 'find_test' == d.action ) {
				console.log( d.data );
			}
			else if( 'update_test' == d.action ) {
				console.log( d.data );
			}
			break;
		
		case 'redis':
			if ( 'hash_mset_test' == d.action ){
				console.log( d.data );
			}
			else if( 'hash_set_test' == d.action ){
				console.log( d.data );
			}
			else if( 'hash_get_test' == d.action ){
				console.log( d.data );
			}
			break;

		default:
			break;
	}

}

/**init a object of mysql**/
//var mydb = new myDB( 1 );

/**do the query**/
//mydb.exec( 'SELECT * FROM user_info', dataEvents, 'query_all_test' );
//mydb.exec( 'SELECT * FROM role_auth', dataEvents, 'query_all_test' );

/**close the conection with database client**/
//mydb.close();

/**init a object of mongodb**/
//var mgdb = new mgDB( 1 );

/**insert docArr into collection**/
var docArr = [{
	name: 'wb',
	age: 23
	},{
	name: 'we',
	age:0
	}
];

//mgdb.insert( dataEvents, 'insert_test', 'test', docArr );
//mgdb.find( dataEvents, 'find_test', 'test', {} );
//mgdb.update( dataEvents, 'update_test', 'test', {name: 'we'}, {$set:{name:'wangbin'}}, {w: 1, multi:true} );

/**init a object of redis**/
//var redis = new Redis( 1 );
// hash value object
var hashObj = {
	name: 'wangbin',
	university: 'nuaa',
	age: 23,
	degree: 'bachelor'
};

//redis.hashMultiSet( dataEvents, 'hash_mset_test', 'wangbin:profile', hashObj );
//redis.hashSet( dataEvents, 'hash_set_test', 'wangbin:profile', 'degree', 'doctor' );
//redis.hashGetAll( dataEvents, 'hash_get_test', 'wangbin:profile' );

var now = new Date().getTime();
console.log( now );



