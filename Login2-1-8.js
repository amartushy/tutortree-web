signInButton = document.getElementById("signIn");
signInButton.addEventListener("click", signUp);
passwordReset = document.getElementById("reset-password")
passwordReset.addEventListener("click", sendPasswordReset)

function sendPasswordReset() {

	var auth = firebase.auth();
	var emailAddress = document.getElementById('reset-email').value

	auth.sendPasswordResetEmail(emailAddress).then(function() {
		// Email sent.
		alert("Thank you! A password reset link has been sent to " + emailAddress)
		document.getElementById('password-reset-modal').style.display = 'none'
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
				
				userDB.collection("userTest").doc(userID).get().then(function(doc) {		
					if(doc.data().isAdmin) {
						document.getElementById('admin-nav-panel').style.display = 'flex'
						document.getElementById('login-section').style.display = 'none'
						document.getElementById('admin-header').innerHTML = 'Welcome back, ' + doc.data().name + '!'
						//admin navigation
						document.getElementById('admin-nav').addEventListener('click', function() {
							location.href = 'https://www.jointutortree.com/admin'
						})

						//tutor navigation
						document.getElementById('applicants-nav').addEventListener('click', function() {
							location.href = 'https://www.jointutortree.com/tutor/admin-tutor'
						})

						//metrics navigation
						document.getElementById('metrics-nav').addEventListener('click', function() {
							location.href = 'https://www.jointutortree.com/metrics'
						})
						
						//ambassador navigation
						document.getElementById('ambassador-nav').addEventListener('click', function() {
							location.href = 'https://www.jointutortree.com/ambassador-admin'
						})
						
						//Tutortree Navigation
						document.getElementById('tutortree-nav').addEventListener('click', function() {
							location.href = 'https://www.jointutortree.com/tutor/tutor-dashboard'
						})
						
					} else if (doc.data().tutorApplicantStatus == "pending") {
						location.href = 'https://www.jointutortree.com/tutor/onboarding-dashboard'
						mpUserWebsiteLogin(userEmail, doc.data().tutorApplicant)
					} else if (doc.data().tutorApplicantStatus == "rejected") {
						location.href = 'https://www.jointutortree.com/tutor/onboarding-dashboard'
						mpUserWebsiteLogin(userEmail, doc.data().tutorApplicant)
					} else if (doc.data().tutorApplicantStatus == "accepted") {
						location.href = 'https://www.jointutortree.com/tutor/tutor-dashboard'
						mpUserWebsiteLogin(userEmail, doc.data().tutorApplicant)
					} else if (doc.data().isTutor) {
						location.href = 'https://www.jointutortree.com/tutor/tutor-dashboard'
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
