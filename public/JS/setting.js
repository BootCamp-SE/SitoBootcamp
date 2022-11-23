const ID = window.location.href.slice(window.location.href.lastIndexOf('/') + 1 );

// Player
const playerForm = document.querySelector('#playerForm');
const updatePlayerFeedback = document.querySelector('#update-player-feedback');

if(playerForm != null)
{
	playerForm.addEventListener('submit', async (e) => {
		e.preventDefault();
	
		updatePlayerFeedback.textContent = '';
		updatePlayerFeedback.setAttribute('class', 'd-none');
		
		const grado = playerForm.rank.value;
		const equipaggio = playerForm.crew.value;
		const equipaggio_secondario = playerForm.reservecrew.value;
		const specializzazione = playerForm.specialization.value;
		const discord_id = playerForm.discordID.value;
		const discord_name = playerForm.discordName.value;
		const steam_id = playerForm.steamId.value;
		const steam_name = playerForm.steamName.value;
		const note_private = playerForm.privateNotes ? playerForm.privateNotes.value : '';
		const note_pubbliche = playerForm.publicNotes.value;
	
		try {
			const res = await fetch(`/api/auth/settings/player?ID=${ID}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					grado,
					equipaggio,
					equipaggio_secondario,
					specializzazione,
					discord_id,
					discord_name,
					steam_id,
					steam_name,
					note_private,
					note_pubbliche
				}),
			});
			const data = await res.json();

			updatePlayerFeedback.textContent = data.res ? data.res : data.err;
			if (data.res) {
				updatePlayerFeedback.setAttribute('class', 'text-success');
			} else {
				updatePlayerFeedback.setAttribute('class', 'text-danger');
			}
		} catch (err) {
			console.error(err);
		}
	});
}

// User
const userForm = document.querySelector('#userForm');
const toggleOldPassword = document.querySelector('#toggleOldPassword');
const toggleNewPassword = document.querySelector('#toggleNewPassword');
const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');
const toggleAdminPassword = document.querySelector('#toggleAdminPassword');
const updateUserFeedback = document.querySelector('#update-user-feedback');
let useAdmin = false;

if (((toggleOldPassword || toggleNewPassword || toggleConfirmPassword) == (null || undefined)) && (toggleAdminPassword != (null || undefined)))
	useAdmin = true;

userForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	
	// Reset errors
	updateUserFeedback.textContent = '';
	updateUserFeedback.setAttribute('class', 'd-none');
	
	const username = userForm.username.value;
	const oldPassword = !useAdmin ? userForm.oldPassword.value : '';
	const newPassword = !useAdmin ? userForm.newPassword.value : '';
	const adminPassword = useAdmin ? userForm.adminPassword.value : '';

	// Check password
	if (!useAdmin) {
		updateUserFeedback.textContent = checkPassword();
		updateUserFeedback.setAttribute('class', 'text-danger');
	}

	if(updateUserFeedback.textContent != '') 
		return;

	try {
		const res = await fetch(`/api/auth/settings/user?ID=${ID}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({username, oldPassword, newPassword, adminPassword}),
		});
		const data = await res.json();
		
		updateUserFeedback.textContent = data.res ? data.res : data.err;
		if (data.res) {
			updateUserFeedback.setAttribute('class', 'text-success');
		} else {
			updateUserFeedback.setAttribute('class', 'text-danger');
		}
	} catch (err) {
		console.error(err);
	}
});

if (!useAdmin) {
	toggleOldPassword.addEventListener('click', () => {
		const inputType = userForm.oldPassword.getAttribute('type') == 'password' ? 'text' : 'password';
		userForm.oldPassword.setAttribute('type', inputType);
		toggleOldPassword.classList.toggle('bi-eye');
	});

	toggleNewPassword.addEventListener('click', () => {
		const inputType = userForm.newPassword.getAttribute('type') == 'password' ? 'text' : 'password';
		userForm.newPassword.setAttribute('type', inputType);
		toggleNewPassword.classList.toggle('bi-eye');
	});

	toggleConfirmPassword.addEventListener('click', () => {
		const inputType = userForm.confirmPassword.getAttribute('type') == 'password' ? 'text' : 'password';
		userForm.confirmPassword.setAttribute('type', inputType);
		toggleConfirmPassword.classList.toggle('bi-eye');
	});
} else {
	toggleAdminPassword.addEventListener('click', () => {
		const inputType = userForm.adminPassword.getAttribute('type') == 'password' ? 'text' : 'password';
		userForm.adminPassword.setAttribute('type', inputType);
		toggleAdminPassword.classList.toggle('bi-eye');
	});
}

function checkPassword(){
	var oldPw = userForm.oldPassword.value;
	var newPw = userForm.newPassword.value;
	var chkPw = userForm.confirmPassword.value;

	if(newPw.length < 6 || newPw.length > 20)
		return 'La password deve essere compresa tra 6 e 20 caratteri';
	if(!newPw.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/))
		return 'La Password deve contenere:\r\n- Almeno una lettera maiuscola\r\n- Almeno una lettera minuscola\r\n- Almeno un numero';		
	if(chkPw != newPw)
		return 'Le password inserite non corrispondono';
	if(oldPw == newPw)
		return 'Le password deve essere diversa da quella vecchia';
	return '';
}


// Policies
const policiesForm = document.querySelector('#policiesForm');
const policyList = document.querySelectorAll('.policy');
const updatePoliciesFeedback = document.querySelector('#update-policies-feedback');

if (policiesForm != null) {
	policiesForm.addEventListener('submit', async (e) => {
		e.preventDefault();
	
		updatePoliciesFeedback.textContent = '';
		updatePoliciesFeedback.setAttribute('class', 'd-none');

		const policies = [];
		
		for (var policy of policyList) {
			if (policy.checked) {
				policies.push(policy.name);		
			}
		}
		
		
		try {
			const res = await fetch(`/api/auth/settings/policies?ID=${ID}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({policy: policies}),
			});
			const data = await res.json();

			updatePoliciesFeedback.textContent = data.res ? data.res : data.err;
			if (data.res) {
				updatePoliciesFeedback.setAttribute('class', 'text-success');
			} else {
				updatePoliciesFeedback.setAttribute('class', 'text-danger');
			}
		} catch (err) {
			console.error(err);
		}
	});
}