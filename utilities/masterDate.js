var mongoskin = require('mongoskin');
var json2xls = require('json2xls');var _ = require('lodash');
var fs = require('fs');
var q = require('q')
var db = mongoskin.db('mongodb://mda-preval:B3p3rf3cta_x2y@52.24.57.147/mda-preval', {
  native_parser: true,
  'auto_reconnect': true,
  'poolSize': 1000,
  socketOptions: {
    keepAlive: 500,
    connectTimeoutMS: 50000,
    socketTimeoutMS: 0
  }
});

//Get Master App and All user App in That Master App (Detail)

var result = [];

function test() {
  var deferred = q.defer();
  db.collection('schema').find({},{ title:1, _id:1}).toArray(function (error, schema) {
    deferred.resolve(schema)
  });
  return deferred.promise;
}

test().then(function(schema) {
  var master = db.collection("masterqcsettings")
  .find({isActive:true},{ schema:1,title:1 });
  master.forEach(function(t){
    t.schema.forEach(function(e){
      var ObjResult = {};
      ObjResult['Master Title'] = t.title;
      ObjResult['App Title'] = '';
      schema.forEach(function(s) {
        if (s._id == e._id) {
          ObjResult['App Title'] = s.title;
        }
      });
      result.push(ObjResult);
    });
    var xls = json2xls(result);
    fs.writeFileSync('Active_MasterApp.xlsx', xls, 'binary');
    console.log("Created Successfully");
  });
});
