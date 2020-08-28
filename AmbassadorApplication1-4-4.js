ambassadorSignupPageViewed()

//Ambassadors information
var emailField = document.getElementById('ambassador-email')
var firstNameField = document.getElementById('ambassador-firstName')
var lastNameField = document.getElementById('ambassador-lastName')
var phoneNumberField = document.getElementById('ambassador-phone')
var passwordField = document.getElementById('ambassador-password')
var schoolField = document.getElementById('ambassador-school')
var yearField = document.getElementById('ambassador-year')
var majorField = document.getElementById('ambassador-major')
var nearCampusField = document.getElementById('ambassador-live')
var organizationsField = document.getElementById('ambassador-organizations')
var offCampusField = document.getElementById('ambassador-favorite')
var socialMediaField = document.getElementById('ambassador-social-media')
var followersField = document.getElementById('ambassador-followers')
var socialHandleField = document.getElementById('ambassador-link')
var ambassadorsMeme = ""
var knowEmployeesField = document.getElementById('ambassador-tutortree')
var howHeardField = document.getElementById('ambassador-how-heard')

//Navigation Forms
var basicInfoForm = document.getElementById('ambassador-basic')
var aboutYouForm = document.getElementById('ambassador-about')
var socialMediaForm = document.getElementById('ambassador-social')
var almostDoneForm = document.getElementById('ambassador-almost')

//Navigation Buttons
var basicNextButton = document.getElementById('ambassador-next-basic')
basicNextButton.setAttribute('onClick', 'showForm(1)')

var aboutBackbutton = document.getElementById('ambassador-back-about')
aboutBackbutton.setAttribute('onClick', 'showForm(0)')

var aboutNextButton = document.getElementById('ambassador-next-about')
aboutNextButton.setAttribute('onClick', 'showForm(2)')

var socialBackButton = document.getElementById('ambassador-back-social')
socialBackButton.setAttribute('onClick', 'showForm(1)')

var socialNextButton = document.getElementById('ambassador-next-social')
socialNextButton.setAttribute('onClick', 'showForm(3)')

var almostBackButton = document.getElementById('ambassador-back-almost')
almostBackButton.setAttribute('onClick', 'showForm(2)')

function showForm(formInt) {
	var formsArray = [basicInfoForm, aboutYouForm, socialMediaForm, almostDoneForm]
	
	if (formInt == 0) {
		for (i=0; i < formsArray.length; i++) {
			if (i == formInt) {
				formsArray[i].style.display = "flex"
			} else {
				formsArray[i].style.display = "none"
			}
		}
	} else if (formInt == 1) {
		if ( checkBasic() ) {
			for (i=0; i < formsArray.length; i++) {
				if (i == formInt) {
					formsArray[i].style.display = "flex"
				} else {
					formsArray[i].style.display = "none"
				}
			}
		}
	} else if (formInt == 2) {
		if ( checkAbout() ) {
			for (i=0; i < formsArray.length; i++) {
				if (i == formInt) {
					formsArray[i].style.display = "flex"
				} else {
					formsArray[i].style.display = "none"
				}
			}
		}
	} else if (formInt == 3) {
		if (checkSocial() ) {
			for (i=0; i < formsArray.length; i++) {
				if (i == formInt) {
					formsArray[i].style.display = "flex"
				} else {
					formsArray[i].style.display = "none"
				}
			}
		}
	} 
}

function checkBasic() {
	console.log("im called")
	if (emailField.value == "") {
		alert("Please enter your email")
		return false
	} else if (firstNameField.value == "") {
		alert("Please enter your first name")
		return false
	} else if (lastNameField.value == "") {
		alert("Please enter your last name")
		return false
	} else if (phoneNumberField.value == "") {
		alert("Please enter your phone number")
		return false
	} else if (passwordField.value == "") {
		alert("Please enter a good password")
		return false
	} else if (schoolField.value == "") {
		alert("Please select which school you go to")
		return false
	} else if (yearField.value == "") {
		alert("Please select what year you are in")
		return false
	} else {
		console.log("this is true")
		return true
	}
}

function checkAbout() {
	if (majorField.value == "") {
		alert("Please enter your major")
		return false
	} else if (nearCampusField.value == "") {
		alert("Please enter whether you're near campus")
		return false
	} else if (organizationsField.value == "") {
		alert("Please detail whether you're in any organizations")
		return false
	} else if (offCampusField.value == "") {
		alert("Please enter your favorite place to go off campus")
		return false
	} else {
		return true
	}
}

function checkSocial() {
	if (socialMediaField.value == "") {
		alert("Please enter you social media")
		return false
	} else if (followersField.value == "") {
		alert("Please enter the number of followers")
		return false
	} else if (socialHandleField.value == "") {
		alert("Please enter your social media link")
		return false
	} else if (ambassadorsMeme == "") {
		alert("Please upload a meme")
		return false
	} else {
		return	true
	}
}

function checkDone() {
	if (knowEmployeesField.value == "") {
		alert("Please enter whether you know any TT employees")
		return false
	} else if (howHeardField.value == "") {
		alert("Please select how you heard about us")
		return false
	} else {
		return	true
	}
}

var ambassadorRef = firebase.firestore()

var submitApplicationButton = document.getElementById('ambassador-submit')
submitApplicationButton.setAttribute("onClick", "createAmbassadorApplicant()")



function createAmbassadorApplicant() {
	
	//Check if they're a current user
	firebase.auth().signInWithEmailAndPassword(emailField.value, passwordField.value).then(function(data) {
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				//create new user
				console.log(user.uid)
				createFirestoreAmbassadorApplicant(user.uid)
			}
		})
	})
	.catch(function(error) {
		console.log(error.code, error.message)
		
		firebase.auth().createUserWithEmailAndPassword(emailField.value, passwordField.value).then(function(data) {
              	var ambassadorID = data.user.uid
		createNewUserAmbassadorApplicant(ambassadorID)

          })
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
          });
	})	
}

function createNewUserAmbassadorApplicant(ambassadorID) {
	var ambassadorApplication = {
		"favoriteOffCampus" : offCampusField.value,
		"howHeardField" : howHeardField.value,
		"knowsEmployees" : knowEmployeesField.value,
		"firstName" : firstNameField.value,
		"lastName" : lastNameField.value,
		"livesNearCampus" : nearCampusField.value,
		"memeURL" : ambassadorsMeme,
		"dateApplied" : new Date / 1000,
		"numberOfFollowers" : followersField.value,
		"organizations" : organizationsField.value,
		"socialHandle" : socialMediaField.value,
		"year" : yearField.value
	}

	var appUserInfo = {
		"agreedTOS" : true,
		"availability" : {
			"Monday" : 0,
			"Tuesday" : 0,
			"Wednesday" : 0,
			"Thursday" : 0,
			"Friday" : 0,
			"Saturday" : 0,
			"Sunday" : 0
		},
		"bio" : "Please enter a short description of yourself",
		"email" : emailField.value,
		"isAdmin" : false,
		"isEmailOn" : false,
		"isPushOn" : false,
		"isSMSOn" : false,
		"isTutor" : false,
		"major" : majorField.value,
		"maxHPW" : 20,
		"name" : firstNameField.value + " " + lastNameField,
		"phoneNumber" : phoneNumberField.value,
		"pricePHH" : 10,
		"profileImage" : "https://firebasestorage.googleapis.com/v0/b/tutortree-68061.appspot.com/o/images%2FTTLogo-Mint.png?alt=media&token=c8d6559e-7fa8-4fed-81cc-1f09d5da56a5",
		"pushToken" : "",
		"school" : schoolField.value,
		"ambassadorApplicationStatus" : "pending"
	}
	
	userDB.collection("ambassadorTest").doc(ambassadorID).set(appUserInfo, {merge: true})
	.then(function() {
			userDB.collection("ambassadorTest").doc(ambassadorID).collection("ambassadorApplication").doc("application").set(ambassadorApplication, { merge: true })

			console.log("Ambassador application successfully submitted");
			document.getElementById('ambassador-thanks').style.display = "flex"
			document.getElementById('ambassador-submit-form').style.display = "none"
		        
		        ambassadorAccountCreated(newAmbassadorDict)
		      
			var newAmbassadorMessage = "New Ambassador Application : " + firstNameField.value + " has submitted an application to be a TutorTree ambassador. Their email is " + emailField.value
			sendSMSTo("4582108156", newAmbassadorMessage)
		        sendSMSTo("5417311987", newAmbassadorMessage)
              })

	
}

function createFirestoreAmbassadorApplicant(ambassadorID) {
	var ambassadorApplication = {
		"favoriteOffCampus" : offCampusField.value,
		"howHeardField" : howHeardField.value,
		"knowsEmployees" : knowEmployeesField.value,
		"firstName" : firstNameField.value,
		"lastName" : lastNameField.value,
		"livesNearCampus" : nearCampusField.value,
		"memeURL" : ambassadorsMeme,
		"dateApplied" : new Date / 1000,
		"numberOfFollowers" : followersField.value,
		"organizations" : organizationsField.value,
		"socialHandle" : socialMediaField.value,
		"year" : yearField.value
	}
	
	var existingUserInfo = {
		"major" : majorField.value,
		"name" : firstNameField.value + " " + lastNameField.value,
		"phoneNumber" : phoneNumberField.value,
		"ambassadorApplicationStatus" : "pending"
		
	}
	userDB.collection("ambassadorTest").doc(ambassadorID).set(existingUserInfo, {merge : true})
	
	userDB.collection("ambassadorTest").doc(ambassadorID).collection("ambassadorApplication").doc("application").set(ambassadorApplication, { merge: true })
	.then(function() {
		console.log("Ambassador application successfully submitted");
		document.getElementById('ambassador-thanks').style.display = "flex"
		document.getElementById('ambassador-submit-form').style.display = "none"

		ambassadorAccountCreated(newAmbassadorDict)

		var newAmbassadorMessage = "New Ambassador Application : " + firstNameField.value + " has submitted an application to be a TutorTree ambassador. Their email is " + emailField.value
		sendSMSTo("4582108156", newAmbassadorMessage)
		sendSMSTo("5417311987", newAmbassadorMessage)
	})
}


//Associated Upload functions
var storageRef = storageService.ref()
document.getElementById("ambassador-meme").addEventListener('click', openMemeDialog)
var hiddenMemeButton = document.getElementById('meme-select')
hiddenMemeButton.addEventListener('change', handleMemeUploadChange);

function openMemeDialog() {
	hiddenMemeButton.click();
}

var selectedMemeFile;
function handleMemeUploadChange(e) {
	selectedMemeFile = e.target.files[0];
	document.getElementById("ambassador-meme-preview").style.display = "block"
	document.getElementById("ambassador-meme-preview").innerHTML = selectedMemeFile.name
	//document.getElementById("submit-transcript-button").addEventListener('click', handleTranscriptUpload )
	handleMemeUpload()
}

async function handleMemeUpload() {
	console.log("Uploading Meme..")
	const uploadTask = await storageRef.child(`ambassadorMemes/${selectedMemeFile.name}`).put(selectedMemeFile);
	uploadAndUpdateFirebaseMeme()
}

async function uploadAndUpdateFirebaseMeme() {
	var memeFileURL = ""
	await storageRef.child('/ambassadorMemes/'+selectedMemeFile.name)
		.getDownloadURL()
		.then(function(url) { memeFileURL = url.toString() })
	ambassadorsMeme = memeFileURL
	console.log(ambassadorsMeme)
}

function sendSMSTo(number, message) {
	var xhttp = new XMLHttpRequest();
	var herokuURL = "https://tutortree-development.herokuapp.com/sendSMSTo/+1"+number+"/"+message
	xhttp.open("GET", herokuURL, true);
	xhttp.send();
}









