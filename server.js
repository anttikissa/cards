var express = require('express');
var fs = require('fs');
var _ = require('lodash');

var app = express();

_.templateSettings.interpolate = /\$(\w+)/g
var cardTemplate = _.template(fs.readFileSync(__dirname + '/card.html'));
console.log(_.templateSettings.interpolate);

app.use(express.static(__dirname + '/client'));
app.get('/', function(req, res) {
	res.writeHead(200, {
		'content-type': 'text/html'
	});
	res.write("<link rel=stylesheet href=style.css>\n");
	function card(x, y) {
		res.write(cardTemplate({
			style: 'top: ' + y + 'px; left: ' + x + 'px;'
		}));
	}
	card(100, 100);
	card(360, 100);
	card(620, 100);
	card(620, 136);
	card(880, 100);
	res.end();
})

app.listen(8000);
