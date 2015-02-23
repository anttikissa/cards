var fs = require('fs');

function set(object, key, value) {
	object[key] = value;
	return object;
}

var db = {
	tables: {
		find: function(id) {
			return new Promise(function(resolve, reject) {
				var file = 'data/tables/' + id + '.json';
				fs.readFile(file, 'utf8', function(err, data) {
					err && reject(err);
					data && resolve(JSON.parse(data));
				});
			});
		}
	},

	cards: {
		find: function(id) {
			return new Promise(function(resolve, reject) {
				var file = 'data/cards/' + id + '.json';
				fs.readFile(file, 'utf8', function(err, data) {
					err && reject(err);
					data && resolve(set(JSON.parse(data), 'id', id));
				});
			});
		}
	}
}

module.exports = db;

