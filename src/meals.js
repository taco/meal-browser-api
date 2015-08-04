var uuid = require('node-uuid');
var meals = [];

function findIndex(meal) {
	return meals.findIndex(function(t) {
		return t.id === (meal.id || meal);
	});
}

module.exports = {
	loadDefaultMeals: function() {
		meals = JSON.parse(require('fs').readFileSync(__dirname + '/data/meals.json', 'utf8'))
	},

	list: function(offset, limit, sortby, sortdir, filter) {
		var dir = sortdir === 'asc' ? 1 : -1;
		
		var ret = meals.sort(function(a, b) {
			if (a[sortby] < b[sortby]) {
				return -1 * dir;
			}
			if (a[sortby] > b[sortby]) {
				return 1 * dir;
			}
			return 0;
		})

		if (Array.isArray(filter) && filter.length) {
			ret = meals.filter(function(m) {
				return filter.every(function(f) {
					return m[f.f] < f.u && m[f.f] > f.b;
				});
			});
		}

		return ret.slice(offset || 0, offset + limit || meals.length);
	},

	add: function(meal) {
		meal.id = uuid.v1();

		meals.push(meal);
	},

	update: function(id, meal) {
		var index = findIndex(id);

		if (index > -1) {
			meals[index].name = meal.name;
		}
	},

	remove: function(id) {
		var index = findIndex(id);

		meals.splice(index, 1);
	}
}