var Router = require('koa-router');

var meals = require('./meals');

module.exports = function(app) {

	meals.loadDefaultTasks();

	var router = new Router();

	router
		.get('/meals', function*(next) {
			this.body = {
				sucess: true,
				items: meals.list()
			};
		})
		.post('/meals', function*(next) {
			if (this.request.accepts('json') !== 'json')
				this.throw(406, 'json only');

			meals.add(this.request.body)

			this.body = {
				success: true,
				items: meals.list()
			};
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