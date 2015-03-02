var log = console.log.bind(console);

// $('<div> <p>foo</p> <p>bar</p> </div>') -> 'foo\nbar'
function textify($el) {
	return $el.find('p').map(function() {
		return this.innerHTML;
	}).get().join('\n').trim();
}

$(function() {
	$('body').on('click', '.card .content', function(e) {
		var $content = $(e.target).closest('.content');
		$content.data('textWhenFocused', textify($content));
	});

	var mousedown = false;
	var $dragTarget = null;

	$('body').on('mousedown', '.card', function(e) {
		log('mousedown on card');
		$dragTarget = $(e.target);
		$dragTarget.addClass('beingDragged');

		mousedown = true;
	});

	$('body').on('mousemove', function(e) {
		if (!mousedown) {
			return;
		}

		log('mousemove', e);
	});

	$('body').on('mouseup', function(e) {
		mousedown = false;
		log('mouseup', e);
		$dragTarget && $dragTarget.removeClass('beingDragged');
		$dragTarget = null;
	});

	$('body').on('blur', '.content', function(e) {
		var $content = $(e.target);
		var text = textify($content);
		var oldText = $content.data('textWhenFocused');
		if (oldText !== text) {
			var $card = $content.closest('.card');
			var id = $card.data('id');

			log('PATCH id', id, 'with text', text);

			cardUrl = '/card/' + id;
			cardPatchData = { 'content': text };

			// TODO window.fetch with PATCH doesn't work exactly,
			// find out why
//			window.fetch('/card/' + id, {
//				method: 'PATCH',
//				body: JSON.stringify({ 'content': text })
//			})

			$.ajax(cardUrl, {
				type: 'PATCH',
				data: cardPatchData
			})
			.then(function() {
				log('PATCH ok');
			}).fail(function(err) {
				log('PATCH fail', err);
				alert(err.message);
			});

		}
	});
});
