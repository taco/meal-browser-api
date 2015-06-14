var app = require('koa')();

var bodyParser = require('koa-body-parser');
var routes = require('./routes');
var port = 3001;

app.use(bodyParser());

routes(app);

app.listen(port);

console.log('Meals-Browser-Api now listening at http://localhost:' + port + '/');