var Router = require('koa-router');

var meals = require('./meals');

var jsonp = require('jsonp-body');

meals.loadDefaultMeals();

module.exports = function(app) {



	var router = new Router();

	router
		.get('/meals', function*(next) {

			var offset = this.request.query.offset || 0;
			var limit = this.request.query.limit || 20;
			var sortby = this.request.query.sortby || 'rating';
			var sortdir = this.request.query.sortdir || 'desc';

			var filter = []
			try {
				filter = JSON.parse(this.request.query.filter)
			} catch (e) {}

			this.set('X-Content-Type-Options', 'nosniff');
			if (this.query.callback) {
				this.set('Content-Type', 'text/javascript');
			} else {
				this.set('Content-Type', 'application/json');
			}

			this.body = jsonp({
				sucess: true,
				items: meals.list(offset, limit, sortby, sortdir, filter)
			}, this.query.callback);
		})
		.post('/meals', function*(next) {
			if (this.request.accepts('json') !== 'json')
				this.throw(406, 'json only');

			var offset = this.request.query.offset || 0;
			var limit = this.request.query.limit || 20;
			var sortby = this.request.query.sortby || 'rating';
			var sortdir = this.request.query.sortdir || 'desc';

			var filter = []
			try {
				filter = JSON.parse(this.request.query.filter)
			} catch (e) {}

			this.set('X-Content-Type-Options', 'nosniff');
			if (this.query.callback) {
				this.set('Content-Type', 'text/javascript');
			} else {
				this.set('Content-Type', 'application/json');
			}

			this.body = jsonp({
				success: true,
				meal: meals.add(this.request.body),
				items: meals.list(offset, limit, sortby, sortdir, filter)
			});
		})
		.put('/meals/:id', function*(next) {
			meals.update(this.params.id, this.request.body);

			this.body = {
				success: true,
				items: meals.list()
			};
		})
		.del('/meals/:id', function*(next) {
			meals.remove(this.params.id);

			this.body = {
				success: true,
				items: meals.list()
			};
		});

	app
		.use(router.routes())
		.use(router.allowedMethods())
};