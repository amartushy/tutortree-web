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
	
	for (i=0; i < formsArray.length; i++) {
		if (i == formInt) {
			formsArray[i].style.display = "flex"
		} else {
			formsArray[i].style.display = "none"
		}
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
		createFirestoreAmbassadorApplicant(ambassadorID)

          })
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
          });
	})	
}

function createFirestoreAmbassadorApplicant(ambassadorID) {
	var ambassadorToUpdate = {}
              	var newAmbassadorDict = {
                  	"email" : emailField.value,
                  	"firstName" : firstNameField.value,
                  	"lastName" : lastNameField.value,
                  	"phoneNumber" : phoneNumberField.value,
			"school" : schoolField.value,
			"year" : yearField.value,
			"major" : majorField.value,
			"livesNearCampus" : nearCampusField.value,
			"organizations" : organizationsField.value,
			"favoriteOffCampus" : offCampusField.value,
			"socialMediaField" : socialMediaField.value,
			"numberOfFollowers" : followersField.value,
			"socialHandle" : socialHandleField.value,
			"memeURL" : ambassadorsMeme,
			"knowsEmployees" : knowEmployeesField.value,
			"howHeardField" : howHeardField.value,
                  
			"status" : "pending",
			"metadata" : {
				"dateApplied" : new Date / 1000
				}
              	}
              ambassadorToUpdate[ambassadorID] = newAmbassadorDict
              
              ambassadorRef.collection("ambassadors").doc(ambassadorID).set(newAmbassadorDict)
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









