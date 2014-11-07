var QueryString = require('querystring');

exports.call = function (recievedData, callBack) {
    try {
        DataObj = QueryString.parse(recievedData.toString());
        return callBack(DataObj['projectID']);
    } catch (e) {
        return callBack(e);
    }

};

/*
 * 
 * var sqlite3 = require('sqlite3');
 var Global = require('./manager/global.js');
 
 var dbPath = 'ManagerDb.db';
 var ManagerDB = null;
 Global.fs.exists(dbPath, function (exists) {
 if (exists) {
 ManagerDB = new sqlite3.Database(dbPath);
 managerDb.each('select ID, name FROM projects', function (err, row) {
 console.log(row.name);
 });
 managerDb.close();
 } else {
 console.log('database does not exist.');
 }
 });
 */ 

