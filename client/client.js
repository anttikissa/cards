var log = console.log.bind(console);

// $('<div> <p>foo</p> <p>bar</p> </div>') -> 'foo\nbar'
function textify($el) {
	return $el.find('p').map(function() {
		return this.innerHTML;
	}).get().join('\n').trim();
}

$(function() {
	var $body = $('body');

	$body.on('click', '.card .content', function(e) {
		var $content = $(e.target).closest('.content');
		$content.data('textWhenFocused', textify($content));
	});

	var dragging = false;
	var $dragTarget = null;
	var dragX = null;
	var dragY = null;
	var origOffset = null;

	function saveCard(id, changed) {
			cardUrl = '/card/' + id;
			$.ajax(cardUrl, {
				type: 'PATCH',
				data: changed
			})
			.then(function() {
				log('Card saved. (PATCH ok)');
			}).fail(function(err) {
				log('PATCH fail', err);
				alert(err.message);
			});
	}

	$body.on('mousedown', '.card .drag-handle', function(e) {
		$dragTarget = $(e.target).closest('.card');
		$dragTarget.addClass('being-dragged');
		$dragTarget.find('.content').attr('contenteditable', false);

		$body.addClass('dragging');

		dragX = e.clientX;
		dragY = e.clientY;
		origOffset = $dragTarget.offset();

		dragging = true;
	});

	$body.on('click', '.card .drag-handle', function(e) {
		e.preventDefault();
	});

	$body.on('mousemove', function(e) {
		if (!dragging) {
			return;
		}

		var deltaX = e.clientX - dragX;
		var deltaY = e.clientY - dragY;

		var newTop = origOffset.top + deltaY;
		var newLeft = origOffset.left + deltaX;

		// TODO maybe use translate2d
		$dragTarget.css('top', newTop + 'px');
		$dragTarget.css('left', newLeft + 'px');
	});

	$body.on('mouseup', function(e) {
		dragging = false;
		var finalDeltaX = e.clientX - dragX;
		var finalDeltaY = e.clientY - dragY;

		if ($dragTarget) {

			var finalPosX = parseInt($dragTarget.css('left'));
			var finalPosY = parseInt($dragTarget.css('top'));

			var id = $dragTarget.data('id');

			saveCard(id, {
				x: finalPosX,
				y: finalPosY
			});

			$dragTarget.removeClass('being-dragged');
			$dragTarget.find('.content').attr('contenteditable', true);
			$dragTarget = null;
		}

		$body.removeClass('dragging');
	});

	$body.on('blur', '.content', function(e) {
		var $content = $(e.target);
		var text = textify($content);
		var oldText = $content.data('textWhenFocused');
		if (oldText !== text) {
			var $card = $content.closest('.card');
			var id = $card.data('id');

			log('PATCH id', id, 'with text', text);

			// TODO window.fetch with PATCH doesn't work exactly,
			// find out why
//			window.fetch('/card/' + id, {
//				method: 'PATCH',
//				body: JSON.stringify({ 'content': text })
//			})

			saveCard(id, { 'content': text });
		}
	});
});
