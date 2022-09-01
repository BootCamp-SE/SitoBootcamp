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
