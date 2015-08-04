var Router = require('koa-router');

var meals = require('./meals');

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
				console.log(this.request.query.filter)
				filter = JSON.parse(this.request.query.filter)
				console.log('\n\tFILTER!')
			} catch(e) {}
			console.log('\t', filter)


			this.body = {
				sucess: true,
				items: meals.list(offset, limit, sortby, sortdir, filter)
			};
		})
		.post('/meals', function*(next) {
			if (this.request.accepts('json') !== 'json')
				this.throw(406, 'json only');

			meals.add(this.request.body)

			this.body = {
				success: true,
				items: meals.list(this.request.query.offset, this.request.query.limit)
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