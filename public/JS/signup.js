const form = document.querySelector('form');
const togglePassword = document.querySelector('#togglePassword');
const togglePassword2 = document.querySelector('#togglePassword2');
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

	// check password
	signupFeedback.style.color = 'red';
	signupFeedback.textContent = checkPassword();

	if(signupFeedback.textContent == '') {
		try {
			const res = await fetch('/api/auth/signup', {
				method: 'POST',
				body: JSON.stringify({ username: user, password , policy, createPlayer}),
				headers: { 'Content-Type': 'application/json' },
			});
			const data = await res.json();
			signupFeedback.textContent = data.res ? data.res : data.err;
			signupFeedback.style.color = data.res ? 'green' : 'red';

		} catch (err) {
			console.log(err);
		}
	}
});


function checkPassword(){
	var pw = form.password.value;
	var chk_pw = form.confirm_password.value;
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

togglePassword2.addEventListener('click', () => {
	const inputType = form.confirm_password.getAttribute('type') == 'password' ? 'text' : 'password';
	form.confirm_password.setAttribute('type', inputType);
	togglePassword2.classList.toggle('bi-eye');
});