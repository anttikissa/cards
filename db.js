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
		},
		
		save: function(card) {
			return new Promise(function(resolve, reject) {
				var id = card.id;
				if (!card.id) {
					return reject(new Error('no id'));
				}
				var file = 'data/cards/' + id + '.json';
				fs.writeFile(file, JSON.stringify(card, null, 2), 'utf8',
						function(err, data) {
					err && reject(err);
					!err && resolve();
				});
			});
		}
	}
}

module.exports = db;

