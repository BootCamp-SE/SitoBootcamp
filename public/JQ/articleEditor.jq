$('#md-editor').markdownEditor({
	defaultMode: 'split',
	enableEmojies: false,
	markdownItPlugins: {},
	toolbarHeaderL: [
		['undo', 'redo'],
		['bold', 'italic', 'ins', 'del', 'sup', 'sub', 'mark'],
		['paragraph', 'newline', 'indent', 'outdent', 'heading'],
		['ul', 'ol', 'dl'],
		['blockquote', 'hr'],
		['link', 'image'],
	],
	toolbarHeaderR: [['mode'], ['fullscreen']],
	toolbarFooterL: [],
	toolbarFooterR: [],
	alertFadeDuration: 500,
});



$('#tags').tagsinput({
	tagClass: 'badge bg-info',
	trimValue: true
});

var $elt = $('#tags').tagsinput('input');
const tags = ['ANNUNCI', 'COMUNICAZIONI', 'IMPORTANTE', 'REGOLAMENTO', 'MISSIONE', 'EVENTO', 'AVVISO'];

$elt.attr('list', 'tagsList');
$elt.attr('id', 'tagsInput');
$elt.css({
	width: "180px",
});
$('#tags').on('beforeItemAdd', function(event) {
	if (!tags.includes(event.item)) {
		event.cancel = true;
	}
});