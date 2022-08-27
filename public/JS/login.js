const form = document.querySelector('form');
const userError = document.querySelector('.username-error');
const passwordError = document.querySelector('.password-error');

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	// reset errors
	userError.textContent = '';
	passwordError.textContent = '';
	// get values
	const user = form.username.value;
	const password = form.password.value;
	try {
		const res = await fetch('/api/auth/login', { 
			method: 'POST', 
			body: JSON.stringify({ username: user, password }),
			headers: {'Content-Type': 'application/json'}
		});
		const data = await res.json();
		console.log(data);
		if (data.errors) {
			userError.textContent = data.errors.user;
			passwordError.textContent = data.errors.password;
		}
	}
	catch (err) {
		console.log(err);
	}
});