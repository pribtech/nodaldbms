/**
 * 
 */
console.log('Starting '+JSON.stringify(process.versions));
const url = require('url')
	,path = require('path')
	,favicon = require('serve-favicon')
	,alasql = require('./lib/alasqlextended');
var express = require('express')
  , http = require('http')
  , app = express();
app.set('port', (process.env.PORT || process.env.VCAP_APP_PORT || 3000));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
 
function errorHandler(err, req, res, next) {
		console.error('errorHandler '+err+(err.stack?err.stack:""));
		 if (res.headersSent)
			    return next(err);
		res.status(500);
		res.render('error', { error: "Internal error" });
	}
app.use(errorHandler);


// development only
if ('development' === app.get('env')) {
	console.log('development mode');
	global.bypassSignon=true;
//	app.use(express.errorHandler());
}
app.all('*', function (req, res, next) {
		if (global.bypassSignon || req.session && req.session.authorized)
			return next();
		res.status(401);
		res.render('error',{error:"Signon Required"}); 
	});

function callAlasql(request, response, commands, next) {
	console.log("callAlasql: " +JSON.stringify(commands));
	var a;
	try {
		a = alasql(commands);
	} catch(err) {
		a = err.toString();
	};
	response.writeHead(200, {'Content-Type': 'application/json'});
	response.end(JSON.stringify(a));
  	next();  	
}

alasql.extensions.initialise();

app.get('/commands/:commands'
		,function(request, response, next) {
				console.log("url:" + request.url);
//				var command=require('url').parse(request.url,true).query;  req.params.
//				callAlasql(request, response, decodeURI(require('url').parse(request.url,true).select), next);
				callAlasql(request, response, request.params.commands, next);
			}
	).post('/commands'
		,function(request, response, next) {
				callAlasql(request, response, request.body, next);
			}
	);

http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});