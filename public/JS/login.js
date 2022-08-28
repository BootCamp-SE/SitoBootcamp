/* eslint-disable no-undef */
const form = document.querySelector('form');
const loginFeedback = document.getElementById('login-feedback');

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	// reset errors
	loginFeedback.textContent = '';
	// get values
	const user = form.username.value;
	const password = form.password.value;
	const remember = form.remember.checked;
	try {
		const res = await fetch('/api/auth/login', { 
			method: 'POST', 
			body: JSON.stringify({ username: user, password, remember}),
			headers: {'Content-Type': 'application/json'}
		});
		const data = await res.json();
		loginFeedback.textContent = data.res ? data.res.message : data.err;
		if (data.res) {
			loginFeedback.style.color = 'green';
			await setTimeout(() => {
				location.assign(document.referrer);
			}, 1000);
		}
	}
	catch (err) {
		console.log(err);
	}
});