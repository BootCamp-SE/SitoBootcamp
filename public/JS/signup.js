/* eslint-disable no-undef */
const form = document.querySelector('form');
const feedback = document.querySelector('.feedback');

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	// reset errors
	feedback.textContent = '';
	// get values
	const user = form.username.value;
	const password = form.password.value;
	try {
		const res = await fetch('/api/auth/signup', { 
			method: 'POST', 
			body: JSON.stringify({ username: user, password }),
			headers: {'Content-Type': 'application/json'}
		});
		const data = await res.json();
		console.log(data);
		feedback.textContent = data.res ? data.res : data.err;
	}
	catch (err) {
		console.log(err);
	}
});