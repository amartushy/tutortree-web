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

checkTutorRef = database.ref("updateDatabase/users/")

function signUp(){
	userEmail = document.getElementById('userEmail').value
  userPassword = document.getElementById('userPassword').value

  firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).then(
    function() {
    firebase.auth().onAuthStateChanged(function(user) {
    	if (user) {
      var userID = user.uid

      	checkTutorRef.once("value", function(snapshot) {
            console.log(userID)
            if(snapshot.child(userID+"/tutor/").val() == 1) {
            		location.href = "https://jointutortree.com/tutor/tutor-portal/"

            } else {
            		location.href = "https://jointutortree.com/student-portal/"
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
