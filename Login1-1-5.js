signInButton = document.getElementById("signIn");
signInButton.addEventListener("click", signUp);
passwordReset = document.getElementById("password-reset")
passwordReset.addEventListener("click", sendPasswordReset)

function sendPasswordReset() {

	var auth = firebase.auth();
	var emailAddress = document.getElementById('userEmail').value

	auth.sendPasswordResetEmail(emailAddress).then(function() {
		// Email sent.
		alert("Thank you! A password reset link has been sent to " + emailAddress)
	}).catch(function(error) {
		// An error happened.
		console.log("Wrong email or an error occurred")
	});
}


function signUp(){
	userEmail = document.getElementById('userEmail').value
	userPassword = document.getElementById('userPassword').value

	firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).then( function() {
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				userDB = firebase.firestore()
				var userID = user.uid
				
				userDB.collection("users").doc(userID).get().then(function(doc) {		
					if(doc.data().admin) {
						document.getElementById('admin-nav-panel').style.display = 'flex'
						document.getElementById('login-section').style.display = 'none'
						
						//admin navigation
						document.getElementById('admin-nav').addEventListener('click', function() {
							location.href = 'https://www.jointutortree.com/admin'
						})

						//tutor navigation
						document.getElementById('applicants-nav').addEventListener('click', function() {
							location.href = 'https://www.jointutortree.com/tutor/tutor-admin'
						})

						//metrics navigation
						document.getElementById('metrics-nav').addEventListener('click', function() {
							alert('Not available yet, sorry Jack :(')
						})
						
						//ambassador navigation
						document.getElementById('ambassador-nav').addEventListener('click', function() {
							location.href = 'https://www.jointutortree.com/ambassador-admin'
						})
						
					} else if (doc.data().tutorApplicant) {
						location.href = 'https://www.jointutortree.com/tutor/onboarding-dashboard'
						userWebsiteLogin(userEmail, doc.data().tutorApplicant)
					} else if (doc.data().tutorApplicationApproved) {
						location.href = 'https://www.jointutortree.com/tutor/tutor-portal'
					}
											   
				})
			} else {
				console.log("no user logged in")
			}
		});
	}).catch(function(error){
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log("errorCode: " + errorCode +"\n"+ "errorMessage: " + errorMessage)
		alert("Sorry, your username or password is incorrect")
	});
}
