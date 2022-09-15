const form = document.querySelector('form');
const togglePassword = document.querySelector('#togglePassword');
const loginFeedback = document.querySelector('#login-feedback');

form.addEventListener('submit', async (e) => {
	e.preventDefault();

	// reset errors
	loginFeedback.textContent = '';
	loginFeedback.setAttribute('class', 'd-none');

	// get values
	const username = form.username.value;
	const password = form.password.value;
	const remember = form.rememberMe.checked;

	// Login request
	try {
		const res = await fetch('/api/auth/login', { 
			method: 'POST', 
			body: JSON.stringify({ username, password, remember}),
			headers: {'Content-Type': 'application/json'}
		});
		const data = await res.json();

		loginFeedback.textContent = data.res ? data.res : data.err;
		if (data.res) {
			loginFeedback.setAttribute('class', 'text-success');
			await setTimeout(() => {
				location.assign(document.referrer);
			}, 1000);
		} else {
			loginFeedback.setAttribute('class', 'text-danger');
		}
	}
	catch (err) {
		console.log(err);
	}
});

togglePassword.addEventListener('click', () => {
	const inputType = form.password.getAttribute('type') == 'password' ? 'text' : 'password';
	form.password.setAttribute('type', inputType);
	togglePassword.classList.toggle('bi-eye');
});