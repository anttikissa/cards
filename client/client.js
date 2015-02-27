var log = console.log.bind(console);

// $('<div> <p>foo</p> <p>bar</p> </div>') -> 'foo\nbar'
function textify($el) {
	return $el.find('p').map(function() {
		return this.innerHTML;
	}).get().join('\n');
}

$(function() {
	$('body').on('click', '.card .content', function(e) {
		var $content = $(e.target).closest('.content');
		$content.data('textWhenFocused', textify($content));
	});

	$('body').on('blur', '.content', function(e) {
		var $content = $(e.target);
		var text = textify($content);
		var oldText = $content.data('textWhenFocused');
		if (oldText !== text) {
			var $card = $content.closest('.card');
			var id = $card.data('id');

			log('PATCH id', id, 'with text', text);
		}
	});
});
