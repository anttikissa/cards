var log = console.log.bind(console);

$(function() {
	$('body').on('click', '.card .content', function(e) {
		log('got', e);
	});
});
