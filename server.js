var express = require('express');
var fs = require('fs');
var _ = require('lodash');

var app = express();

var cardTemplate = _.template(fs.readFileSync(__dirname + '/card.html'));

app.use(express.static(__dirname + '/client'));
app.get('/', function(req, res) {
	res.writeHead(200, {
		'content-type': 'text/html'
	});
	res.write("<link rel=stylesheet href=style.css>\n");
	res.end(cardTemplate({
		style: '{ top: 100px; left: 200px; }'
	}));
})

app.listen(8000);
