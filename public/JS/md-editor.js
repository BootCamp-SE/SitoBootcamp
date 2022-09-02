/* eslint-disable no-undef */
const form = document.querySelector('form');
const mdEditor = document.querySelector('#md-editor');
const submitButton = document.querySelector('#submit');
const feedback = document.querySelector('#feedback');
const inputTag = document.querySelector('#tagsInput');

form.addEventListener('submit', async (e) => {
	e.preventDefault();
});

submitButton.addEventListener('click', async (e) => {
	e.preventDefault();

	feedback.setAttribute('class', 'd-none');

	const title = form.title.value;
	const subtitle = form.subtitle.value;
	var tags = [];
	const tagsNode = document.querySelectorAll('.tag');
	tagsNode.forEach((tag) => {
		tags.push(tag.textContent);
	});
	const body = DOMPurify.sanitize(mdEditor.value);

	try {
		const res = await fetch('/api/md-editor', {
			method: 'POST',
			body: JSON.stringify({title, subtitle, tags, body}),
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await res.json();
		if(data.res) {
			feedback.textContent = data.res;
			feedback.setAttribute('class', 'text-success');
		} else {
			feedback.textContent = data.err;
			feedback.setAttribute('class', 'text-danger');
		}
	} catch (err) {
		console.log(err);
	}
});

inputTag.addEventListener('input', (e) => {
	e.target.value = e.target.value.toUpperCase();
});
