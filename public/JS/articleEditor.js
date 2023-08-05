const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
	e.preventDefault();

	let tags = [];
	
	Object.keys(form.tags.options).forEach( async key => {
		const option = form.tags.options[key];
		if (option.selected) {
			tags.push(option.value);
		}
	});
	console.log(tags);
	const formData = new FormData();
	formData.append('image', form.image.files[0]);
	formData.append('tags', tags);
	formData.append('title', form.title.value);
	formData.append('subtitle', form.subtitle.value);
	formData.append('body', form.body.value);
	
	const res = await fetch('/API/news/createArticle', {
		method: 'POST',
		body: formData,
	});
	const jres = await res.json();
	console.log(jres);
});