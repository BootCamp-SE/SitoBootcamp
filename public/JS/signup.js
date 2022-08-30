const form = document.querySelector('form');
const togglePassword = document.querySelector('#togglePassword');
const chbPolicyList = document.getElementsByClassName('chb_policy');
const signupFeedback = document.getElementById('signup-feedback');

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	// reset errors
	signupFeedback.textContent = '';
	// get values
	const user = form.username.value;
	const password = form.password.value;
	const policy = new Array();
	const createPlayer = form.createPlayer.checked;

	// get policy 
	for(var x=0; x < chbPolicyList.length; x++) {
		if(chbPolicyList[x].checked) {
			policy.push(chbPolicyList[x].name);		
		}
	}

	try {
		const res = await fetch('/api/auth/signup', {
			method: 'POST',
			body: JSON.stringify({ username: user, password , policy, createPlayer}),
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await res.json();
		signupFeedback.textContent = data.res ? data.res : data.err;
		if (data.res) signupFeedback.style.color = 'green';
	} catch (err) {
		console.log(err);
	}
});

togglePassword.addEventListener('click', () => {
	const inputType = form.password.getAttribute('type') == 'password' ? 'text' : 'password';
	form.password.setAttribute('type', inputType);
	togglePassword.classList.toggle('bi-eye');
});