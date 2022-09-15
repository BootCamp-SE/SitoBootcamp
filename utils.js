// NOTE: Maybe move this to Middleware/utils.js

const md = require('markdown-it')({
	html: false,
	xhtmlOut: false,
	breaks: true,
	langPrefix: 'language-',
	linkify: true,
	typographer: true,
	quotes: '“”‘’',
})
	.use(require('markdown-it-sub'))
	.use(require('markdown-it-abbr'))
	.use(require('markdown-it-mark'))
	.use(require('markdown-it-sup'))
	.use(require('markdown-it-ins'))
	.use(require('markdown-it-smartarrows'))
	.use(require('markdown-it-checkbox'));

const createDomPurifire = require('dompurify');
const { JSDOM } = require('jsdom');
const domPurifier = createDomPurifire(new JSDOM().window);

const parseMD = (source) => {
	return domPurifier.sanitize(md.render(source));
};

module.exports = {
	parseMD,
};
