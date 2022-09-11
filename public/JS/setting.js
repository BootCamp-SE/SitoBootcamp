const ID = window.location.href.slice(window.location.href.lastIndexOf('/') + 1 );

const playerForm = document.querySelector('#playerForm');
const updatePlayerFeedback = document.querySelector('#update-player-feedback');

if(playerForm != null)
{
	playerForm.addEventListener('submit', async (e) => {
		e.preventDefault();
	
		updatePlayerFeedback.textContent = '';
	
		
		const grado = playerForm.rank.value;
		const equipaggio = playerForm.crew.value;
		const equipaggio_secondario = playerForm.reservecrew.value;
		const specializzazione = playerForm.specialization.value;
		const discord_id = playerForm.iddiscord.vlaue;
		const discord_name = playerForm.namediscord.value;
		const steam_id = playerForm.idsteam.value;
		const steam_name = playerForm.namesteam.value;
		const note_private = playerForm.noteprivate.value;
		const note_pubbliche = playerForm.notepublic.value;

	
		try {
			const res = await fetch(`/api/auth/settings/player?ID=${ID}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					grado,
					equipaggio,
					equipaggio_secondario,
					specializzazione,
					discord: {
						id: discord_id,
						name: discord_name,
					},
					steam: {
						id: steam_id,
						name: steam_name,
					},
					note_private,
					note_pubbliche
				}),
			});
			const data = await res.json();
			updatePlayerFeedback.textContent = data.res ? data.res : data.err;
			updatePlayerFeedback.style.color = data.res ? 'green' : 'red';
		} catch (err) {
			console.log(err);
		}
	
	});
}


const userForm = document.querySelector('#userForm');
const toggleOldPassword = document.querySelector('#toggleOldPassword');
const toggleNewPassword = document.querySelector('#toggleNewPassword');
const updateUserFeedback = document.querySelector('#update-user-feedback');

userForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	updateUserFeedback.textContent = '';

	const username = userForm.username.value;
	const oldPassword = userForm.oldpassword.value;
	const newPassword = userForm.newpassword.value;

	// check password
	updateUserFeedback.style.color = 'red';
	updateUserFeedback.textContent = checkPassword();

	if(updateUserFeedback.textContent == '') {
		try {
			const res = await fetch(`/api/auth/settings/user?ID=${ID}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({username, oldPassword, newPassword}),
			});
			const data = await res.json();
			updateUserFeedback.textContent = data.res ? data.res : data.err;
			updateUserFeedback.style.color = data.res ? 'green' : 'red';
		} catch (err) {
			console.log(err);
		}
	}
});
toggleOldPassword.addEventListener('click', () => {
	const inputType = userForm.password[0].getAttribute('type') == 'password' ? 'text' : 'password';
	userForm.password[0].setAttribute('type', inputType);
	toggleOldPassword.classList.toggle('bi-eye');
});

toggleNewPassword.addEventListener('click', () => {
	const inputType = userForm.password[1].getAttribute('type') == 'password' ? 'text' : 'password';
	userForm.password[1].setAttribute('type', inputType);
	toggleNewPassword.classList.toggle('bi-eye');
});


function checkPassword(){
	var pw = userForm.newpassword.value;
	var old_pw = userForm.oldpassword.value;
	var chk_pw = userForm.confirm_password.value;

	if(pw.length < 6)
		return 'La password deve contenere più di 6 caratteri';
	if(pw.length > 20)
		return 'La password deve contenere meno di 20 caratteri';
	if(!pw.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/))
		return 'La Password deve contenere:\r\n- Almeno una lettera maiuscola\r\n- Almeno una lettera minuscola\r\n- Almeno un numero';		
	if(chk_pw != pw)
		return 'Le password inserite non corrispondono';
	if(old_pw == pw)
		return 'Le password deve essere diversa da quella vecchia';
	return '';
}