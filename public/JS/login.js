const form = document.querySelector('form');
const loginFeedback = document.getElementById('login-feedback');

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	// reset errors
	loginFeedback.textContent = '';
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
		loginFeedback.textContent = data.res ? data.res.message : data.err;
		if (data.res) loginFeedback.style.color = 'green';
	}
	catch (err) {
		console.log(err);
	}
});