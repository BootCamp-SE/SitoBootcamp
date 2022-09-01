/* eslint-disable no-undef */
const form = document.querySelector('form');
const mdEditor = document.querySelector('#md-editor');
const feedback = document.querySelector('.feedback');

form.addEventListener('submit', async (e) => {
	e.preventDefault();

	const body = DOMPurify.sanitize(mdEditor.value);

	try {
		const res = await fetch('/api/md-editor', {
			method: 'POST',
			body: JSON.stringify({body}),
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await res.json();
		feedback.textContent = data.res;
	} catch (err) {
		console.log(err);
	}
});