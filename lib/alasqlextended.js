var alasql = require('alasql');

alasql.aggr.AGGR = function(v,a,s) {
		return s==2?a+v:(s==3?a:undefined); 
	};


/*
alasql.fn.myfn = function(a,b) {
    	return a*b+1;
	};

alasql.aggr.AGGR = function(value, accumulator, stage) {
		switch (stage) {
			case 2 : return accumulator + value;	// for every line in the group
			case 1 : return undefined;					// pre call
			case 3 : return accumulator;			// post 
		}
	};


alasql.from.DB = function(dbtype, opts, callback, i, query) {
		var res = [];
       	async_read_data_from_mysql_function(dbtype, opts.dbname, opts.tablename, function(data) {
				res = data;
				if(callback){
				res = callback(res, ix, query);
				}
			};
		return null;
	};

function async_read_data_from_mysql_function(dbtype, dbname, tablename, callback) {
    // put your code here
   callback(read_data);
}


alasql.exec(sql, params, cb, scope);

*/
alasql.execArray = function (a) {
		for(var i=0,il=a.length;i<il;i++) {
			this.exec(a[i]);
		}
	};

alasql.extensions = {
		initialise: (next) => {
			alasql.extensions.systemDBCreate(
					()=>{alasql.extensions.testDBCreate(
							()=>{alasql.extensions.consolelogDetails(next);
						})
					});
		},
		consolelogDetails: (next) => {
			console.log("alasql.engines: " +JSON.stringify(alasql.engines)); 
			console.log("alasql.databases: " +JSON.stringify(alasql.databases));
			if(next) next();
		},
		systemDBCreate : (next) => {
			try{
			alasql.execArray(['PRINT "setup system database"'
						,'CREATE FILESTORAGE DATABASE IF NOT EXISTS system("./systemDB.json") '
						,'PRINT "created system database"'
						,'ATTACH FILESTORAGE DATABASE system("./systemDB.json") '
						,'PRINT "attached system database"'
						,'USE system ']);
			} catch (e) {
				console.error("systemDBCreate: "+e);
			}
			if(next) next();
		},
		systemDBDrop : (next) => {
			alasql.promise("DROP  DATABASE testdb").then(next);
		},
		testDBCreate : (next) => {
			try{
			alasql.execArray(['PRINT "setup test database"'
//						,'CREATE localStorage DATABASE test'
//						,'PRINT "created test database"'
						,'ATTACH localStorage DATABASE test'
						,'PRINT "attached test database"'
						,'USE test'
						,['SELECT * INTO cities FROM ?',[
							{city:"Redmond", population:57530},
							{city:"Atlanta",population:447841},
							{city:"San Fracisco", population:837442}
						]]]
				);
			} catch (e) {
				console.error("testDBCreate: "+e);
			}
			if(next) next();
		},
		testDBDrop : (next) => {
			alasql.exec("DROP DATABASE test").then(next);
		}
	};
	
module.exports = alasql