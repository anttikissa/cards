var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var log = require('basic-log');

var db = require('./db');

var app = express();

_.templateSettings.interpolate = /\$(\w+)/g
var cardTemplate = _.template(fs.readFileSync(__dirname + '/card.html'));

app.use(express.static(__dirname + '/client'));

app.get('/', function(req, res) {
	db.tables.find(1).then(function(table) {
		return Promise.all(table.cards.map(function(id) {
			return db.cards.find(id);
		})).then(function(cards) {
			res.writeHead(200, {
				'content-type': 'text/html'
			});

			res.write("<link rel=stylesheet href=style.css>\n");
			function render(card) {
				var data = cardTemplate({
					id: card.id,
					title: card.title,
					content: '<p>' + card.content.replace('\n', '<p>'),
					style: 'top: ' + card.y + 'px; left: ' + card.x + 'px;'
				});
				res.write(data);
			}

			cards.forEach(render);

			res.end();
		});
	}).catch(function(err) {
		res.writeHead(500);
		res.end(err);
	});
})

var port = 8000;

app.listen(port, function(err) {
	if (!err) {
		log("Listening to http://localhost:" + port + "/");
	}

});
