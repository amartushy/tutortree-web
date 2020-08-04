var userDB = firebase.firestore();
var nextButton = document.getElementById("app-submit")

nextButton.setAttribute("onClick", "createNewUser()")

tutorSignupPageViewed()

function createNewUser() {
  var email = document.getElementById("app-email").value
  var firstName = document.getElementById("app-first-name").value
  var lastName = document.getElementById("app-last-name").value
  var phoneNumber = document.getElementById("app-phone").value
  var password = document.getElementById('app-password').value
  var school = document.getElementById("app-school").value
  var howHeard = document.getElementById("app-how-heard").value
  var currentTime = new Date() / 1000
  
  if (email != "" && 
      firstName != "" &&
      lastName != "" &&
      phoneNumber != "" &&
      school != "" &&
      howHeard != "") {
      
          firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(function(data) {
              var userId = data.user.uid
              var newUserToUpdate = {}
              var newUserDict = {
                  "email" : email,
                  "firstName" : firstName,
                  "lastName" : lastName,
                  "phoneNumber" : phoneNumber,
                  "school" : school,
                  "howHeard" : howHeard,
                  "timeCreated" : currentTime,
                  "tutorApplicant" : true,
                  "application" : {
                      "didSubmitPreInterview" : false,
                      "didRequestInterview" : false,
                      "uploadedTranscript" : false,
                      "uploadedFaculty" : false,
                      "isApproved" : false,
                  },
                  "interview" : {
                      "challengingScore" : "0"
                  }
              }
              tutorAccountCreated(newUserDict)
              
              newUserToUpdate[userId] = newUserDict
              
              // Add a new user document to user collection
              userDB.collection("users").doc(userId).set(newUserDict)
              .then(function() {
                  console.log("Document successfully written!");
                  location.href = "https://www.jointutortree.com/tutor/onboarding-dashboard"
              })
          })
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
          });
  } else {
      alert("Please fill out all fields")
  }
}

