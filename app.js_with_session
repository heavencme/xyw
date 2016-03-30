var express = require( 'express' );
var path = require( 'path' );
var favicon = require( 'static-favicon' );
var logger = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var expSession = require( 'express-session' );
var bodyParser = require( 'body-parser' );

var routes = require( './routes/index' );
var auth = require( './routes/auth' );

var app = express();

// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'jade' );

app.use( favicon() );
app.use( logger('dev') );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );
app.use( cookieParser() );
app.use( expSession({
    secret: 'my little cat on the keyboard',
    cookie: { maxAge: 60*1000 }
}) );
app.use( '/action', express.static( path.join( __dirname, 'public' ) ) );
app.use( '/images', express.static( path.join( __dirname, 'public/images' ) ) );
app.use( '/js', express.static( path.join( __dirname, 'public/js' ) ) );
app.use( '/css', express.static( path.join( __dirname, 'public/css' ) ) );

app.use( '/', routes );
app.use( '/auth', auth );
app.get( '/test', function( req, res ) {
	  res.sendfile( __dirname + '/public/test.html' );
});

/// catch 404 and forwarding to error handler
//I don't need to write all the routes here

app.use(function(req, res, next){
  res.send(404, 'Sorry cant find that!');
});

app.use(function(err, req, res, next){	
    console.log( 'app.js error handling' );
		console.log( err );
    if (err instanceof NotFound) {
        res.render('404.jade');
    } else {
        next(err);
    }
});

app.use( '/:home', function( req, res, next ) {
		if ( 'wb' == req.params.home ) {
			var err = new Error('Not Found');
			err.status = 404;
			next(err);
		}
});

/// error handlers

// development error handler
// will print stacktrace
if ( app.get('env') === 'development' ) {
    app.use( function( err, req, res, next ) {
        res.status( err.status || 500 );
        res.render( 'error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use( function( err, req, res, next ) {
		console.log( err );
    res.status( err.status || 500 );
    res.render( 'error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
