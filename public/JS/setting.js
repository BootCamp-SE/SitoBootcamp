const url = window.location.href;
const ID = url.substring(url.lastIndexOf('/') + 1);
const settingFeedback = document.getElementById('save-feedback');

// constant player policy
const acceptedPolicy = ['administrator', 'manageruser'];
const lockinput = document.getElementsByClassName('settingLock');

var user;
var player;

getUser();

// send id to get user
async function getUser() {
	try {
		const res = await fetch(`/api/user?ID=${ID}`, {
			method: 'GET',
		});
		const data = await res.json();
		user = !data.err ? data : data.err;
		lockWidget(checkPolicy(user));
	} catch (err) {
		console.log(err);
	}
}

// send id to get user
async function getPlayer() {
	try {
		const res = await fetch(`/api/player?ID=${ID}`, {
			method: 'GET',
		});
		const data = await res.json();
		player = !data.err ? data : data.err;
	} catch (err) {
		console.log(err);
	}
}

// this function return if policy contains 'manageruser'
function checkPolicy(data) {
	return acceptedPolicy.some(p => {
		return data.policy.includes(p);
	});
}

// disable or enabled element
function lockWidget(isCorrectPolicy){
	for (var x = 0; x < lockinput.length; x++)
		lockinput[x].disabled = !isCorrectPolicy;
}
