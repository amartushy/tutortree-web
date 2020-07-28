//Ambassadors information
var emailField = document.getElementById('ambassador-email')
var firstNameField = document.getElementById('ambassador-email')
var lastNameField = document.getElementById('ambassador-email')
var phoneNumberField = document.getElementById('ambassador-email')
var passwordField = document.getElementById('ambassador-email')
var schoolField = document.getElementById('ambassador-email')
var yearField = document.getElementById('ambassador-email')
var majorField = document.getElementById('ambassador-email')
var nearCampusField = document.getElementById('ambassador-email')
var organizationsField = document.getElementById('ambassador-email')
var offCampusField = document.getElementById('ambassador-email')
var socialMediaField = document.getElementById('ambassador-email')
var followersField = document.getElementById('ambassador-email')
var socialHandleField = document.getElementById('ambassador-email')
var knowEmployeesField = document.getElementById('ambassador-email')
var howHeardField = document.getElementById('ambassador-email')

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
	firebase.auth().createUserWithEmailAndPassword(emailField.value, passwordField.value).then(function(data) {
              	var ambassadorID = data.user.uid
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
			"knowsEmployees" : knowEmployeesField.value,
			"howHeardField" : howHeardField.value,
                  
			"isAmbassador" : false,
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
              })
          })
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
          });
}








