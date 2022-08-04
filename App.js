var express = require('express')
var cors = require('cors')
var app = express()
 
app.use(cors())

var mysql      = require('mysql2');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'username',
  password : 'password',
  database : 'dbname'
});
 
connection.connect();
 
app.get('/attractions', function (req, res, next) {
  const page = parseInt(req.query.page);
  const per_page = parseInt(req.query.per_page);
  const sort_column = req.query.sort_column;
  const sort_direction = req.query.sort_direction;
  const search = req.query.search;

  const start_index = (page-1) * per_page;
  var params = [];
  var sql = `SELECT * FROM attractions`;
  if(search){
    sql += ' WHERE name LIKE ?'
    params.push('%'+search+'%')
  }

  if(sort_column){
    sql += ' ORDER BY ' +sort_column+' '+sort_direction; 
  }
  sql += ' LIMIT ?, ?'
  params.push(start_index)
  params.push(per_page)
  console.log(sql,params)
  // connection.query('SELECT * FROM `attractions` LIMIT 0,7', function (error, results, fields) {
  //   if (error) throw error;
  //     res.json({results:results})
  // });

  connection.execute(
    sql,
    params,
    function(err, results, fields) {

        console.log(results); // results contains rows returned by server

        connection.query(
          'SELECT COUNT(id) as total FROM attractions',
          function(err, counts, fields) {
            const total = counts[0]['total']
            const total_pages = Math.ceil(total/per_page)
            res.json({
              page:page,
              per_page:per_page,
              total: total,
              total_pages:total_pages,
              data:results
            });
          }
        );
    }
  );
})
 
app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333')
})