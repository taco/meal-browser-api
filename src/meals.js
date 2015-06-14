var uuid = require('node-uuid');
var meals = [];

function findIndex(meal) {
	return meals.findIndex(function(t) {
		return t.id === (meal.id || meal);
	});
}

module.exports = {
	loadDefaultTasks: function() {
		this.add({
			name: 'Meal 1'
		});
		this.add({
			name: 'Meal 2'
		});
	},

	list: function() {
		return meals.slice(0).reverse();
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