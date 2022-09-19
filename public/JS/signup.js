const form = document.querySelector('form');
const togglePassword = document.querySelector('#togglePassword');
const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');
const policyList = document.querySelectorAll('.policy');
const signupFeedback = document.querySelector('#signupFeedback');

form.addEventListener('submit', async (e) => {
	e.preventDefault();

	// reset errors
	signupFeedback.textContent = '';
	signupFeedback.setAttribute('class', 'd-none');

	// get values
	const user = form.username.value;
	const password = form.password.value;
	const createPlayer = form.createPlayer.checked;
	const policies = new Array();

	// get policy 
	for (var policy of policyList) {
		if (policy.checked) {
			policies.push(policy.name);		
		}
	}

	// check password
	signupFeedback.setAttribute('class', 'text-danger');
	signupFeedback.textContent = checkPassword();

	if(signupFeedback.textContent == '') {
		try {
			const res = await fetch('/api/auth/signup', {
				method: 'POST',
				body: JSON.stringify({ username: user, password , policy: policies, createPlayer}),
				headers: { 'Content-Type': 'application/json' },
			});
			const data = await res.json();

			signupFeedback.textContent = data.res ? data.res : data.err;
			if (data.res) {
				signupFeedback.setAttribute('class', 'text-success');
			} else {
				signupFeedback.setAttribute('class', 'text-danger');
			}
		} catch (err) {
			console.log(err);
		}
	}
});

function checkPassword(){
	var pw = form.password.value;
	var chk_pw = form.confirmPassword.value;
	if(pw.length < 6)
		return 'La password deve contenere più di 6 caratteri';
	if(pw.length > 20)
		return 'La password deve contenere meno di 20 caratteri';
	if(!pw.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/))
		return 'La Password deve contenere:\r\n- Almeno una lettera maiuscola\r\n- Almeno una lettera minuscola\r\n- Almeno un numero';		
	if(chk_pw != pw)
		return 'Le password inserite non corrispondono';
	return '';
}

togglePassword.addEventListener('click', () => {
	const inputType = form.password.getAttribute('type') == 'password' ? 'text' : 'password';
	form.password.setAttribute('type', inputType);
	togglePassword.classList.toggle('bi-eye');
});

toggleConfirmPassword.addEventListener('click', () => {
	const inputType = form.confirmPassword.getAttribute('type') == 'password' ? 'text' : 'password';
	form.confirmPassword.setAttribute('type', inputType);
	toggleConfirmPassword.classList.toggle('bi-eye');
});