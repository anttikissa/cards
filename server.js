var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var route = require('koa-route');
var static = require('koa-static');

var fs = require('fs');
var _ = require('lodash');
var log = require('basic-log');

var db = require('./db');

var app = koa();

_.templateSettings.interpolate = /\$(\w+)/g
var cardTemplate = _.template(fs.readFileSync(__dirname + '/card.html'));

app.use(static(__dirname + '/client'));

app.use(route.get('/', function*() {
	var table = yield db.tables.find(1);
	
	var cards = yield Promise.all(table.cards.map(function(id) {
		return db.cards.find(id);
	}));

	this.body = "<link rel=stylesheet href=style.css>\n";
	this.body += "<script src='jquery-2.1.1.js'></script>\n";
	this.body += "<script src='client.js'></script>\n";
	var that = this;

	function render(card) {
		var data = cardTemplate({
			id: card.id,
			title: card.title,
			content: '<p>' + card.content.replace('\n', '<p>'),
			style: 'top: ' + card.y + 'px; left: ' + card.x + 'px;'
		});
		that.body += data;
	}

	cards.forEach(render);
}));

app.use(bodyParser());

app.use(route.get('/card/:id', function*(id) {
	this.body = JSON.stringify(yield db.cards.find(id), null, 2);
}));

app.use(route.put('/card/:id', function*(id) {
	var card = this.request.body;

	if (typeof card !== 'object') {
		this.throw('no body', 400);
	}

	card.id = id;
	yield db.cards.save(card);
	
	this.body = 'ok';
}));

var port = 8000;

app.listen(port, function(err) {
	log("Listening to http://localhost:" + port + "/");
});

