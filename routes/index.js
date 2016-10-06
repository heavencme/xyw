var express = require('express');
var events = require( 'events' );
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/' });

// module of mongodb
var mgDB = require('../database/mgDB');
// get config
var userConfig = require('../config/user.json');

var router = express.Router();
/**init a object of mongodb**/
var mgdb = new mgDB('xyw', 1);

/**register event on 'ready' evnets of data**/
var dataEvents = new events.EventEmitter();
dataEvents.on( 'ready', getData );

/**process the data got from database query results**/
function getData( d ){
	switch( d.database ){
		case 'mongodb':
			if( 'insert' == d.action ){
                d.responseObj.json({
                    status: 'ok',
                    msg:'written',
                    data: d.data
                });

                console.log( d.data );
                writeLog( 'database', d.data );

			}
			else if( 'find' == d.action ) {
                //console.log( d.data );
                writeLog('database', d.data);
                if (d.data.length < 1) {
                    d.responseObj.json({
                        status: 'failed',
                        msg: 'nodatafound'
                    }); 
                    return;   
                } 

                //console.log(d.responseObj);
                
                d.responseObj.json({
                    status: 'ok',
                    msg:'found',
                    data: d.data
                });
                
                //console.log(d.responseObj);
                //console.log(d.responseObj);
                                 

			}
			else if( 'update' == d.action ) {
				console.log( d.data );
			}
			break;

		default:
			break;
	}

}


/* GET home page. */
router.post('/data/write', function(req, res, next) {
    var ua = req.headers['user-agent'].toLowerCase();
    var recData = {};

    console.log(req.body);
    writeLog('dataWrite', ua);
    
    var reqData = req.body;
    var recData = {};

    for (var idx in userConfig) {
        if (userConfig[idx].passCode == reqData.passCode) {

            console.log("find passcode ok");

            recData.userName = userConfig[idx].userName;
            recData.time = reqData.time;
            recData.msg = reqData.msg;
            recData.timeStamp = reqData.timeStamp;

            mgdb.insert(dataEvents, 'insert', 'dairy', recData, res);    
            break;
        }
    }

    if(recData.length < 1) {
        res.json({
            status: 'failed',
            msg: 'passcodewrong'
        });
    }

    return;

});

router.post('/data/read', function(req, res, next) {
    var ua = req.headers['user-agent'].toLowerCase();

    //console.log(ua);
    writeLog('dataRead', ua);

    mgdb.find( dataEvents, 'find', 'dairy', {}, {}, {}, res );
    return;
});

router.post('/data/askme', function(req, res, next) {
    var ua = req.headers['user-agent'].toLowerCase();

    var askme = require('../config/askme.json');
    //console.log(ua);

    res.json(askme);
    
    writeLog('askme', ua);
    return;
});

function writeLog(fileName, data) {
    //var str = data.toString();
    var now = Date();

    console.log(data);

    fs.appendFile('log/' + fileName + '.log', now + ' |||| ' + data + '\n', function (err) {
        if (err) throw err;
    });
}

module.exports = router;
