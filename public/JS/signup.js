/* eslint-disable no-undef */
const form = document.querySelector('form');
const signupFeedback = document.getElementById('signup-feedback');

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	// reset errors
	signupFeedback.textContent = '';
	// get values
	const user = form.username.value;
	const password = form.password.value;
	try {
		const res = await fetch('/api/auth/signup', {
			method: 'POST',
			body: JSON.stringify({ username: user, password }),
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await res.json();
		signupFeedback.textContent = data.res ? data.res : data.err;
		if (data.res) signupFeedback.style.color = 'green';
	} catch (err) {
		console.log(err);
	}
});
