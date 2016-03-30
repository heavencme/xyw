var mysql = require('mysql');
var settings = require('./settings');

function myDB( id ) {
	this.id = id;
	
	this.client = mysql.createConnection({  
		host: settings.host,  
		port: settings.port,  
		database: settings.dbname,  
		user: settings.username,  
		password: settings.password  
	});

	/**init client**/
	this.client.connect();
	
}

myDB.prototype.exec = function( sql, event, act, params ) {
	var client = this.client;
	
	/** avoid SQL Injection attacks**/
	if ( params ) {
		sql =client.escape( params );
	}

	client.query( sql, function( err, result ) {  
		if( !err ) {
			/**asyc function, couldn't just be returned**/
			//return result;

			// pack the data
			var resultObj = {};
			resultObj.database = 'mysql';
			resultObj.data = result;
			// closure make variables: act, event accessible to callback function
			resultObj.action = act;
			event.emit( 'ready', resultObj );

			/**
			return (function(id){
				//console.log( 'identification is ' + id );
			})(this.id);
			//this.readyEvent.emit( 'ready', result );
			**/
		
		}
		else {
			throw err;
			return;
		}
	});
	
}

myDB.prototype.identify = function(){
 return this.id;
}

myDB.prototype.close = function(){
	/**close client**/
	this.client.end();
}


module.exports = myDB; 
