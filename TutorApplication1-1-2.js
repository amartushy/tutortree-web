tutorSignupPageViewed()

var emailField = document.getElementById("app-email")
var firstNameField = document.getElementById("app-first-name")
var lastNameField = document.getElementById("app-last-name")
var phoneNumberField = document.getElementById("app-phone")
var passwordField = document.getElementById('app-password')
var schoolField = document.getElementById("app-school")
var howHeardField = document.getElementById("app-how-heard")

var userDB = firebase.firestore();
var nextButton = document.getElementById("app-submit")

nextButton.setAttribute("onClick", "checkApplicantStatus()")


function checkApplicantStatus() {
  //Check if they're a current user
  try {
      firebase.auth().signInEmailAndPassword(emailField.value, passwordField.value).then(function(data) {
          firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                 //Create new tutor applicant
                var tutorApplicantID = user.uid
                createFirestoreTutorApplicant(tutorApplicantID)
                 
              }
          })
      })
    
  } catch {
      firebase.auth().createUserWithEmailAndPassword(emailField.value, passwordField.value).then(function(data) {
          //Create User and Tutor Applicant
          var tutorApplicantID = data.user.uid
          createFirestoreTutorApplicant(tutorApplicantID)
        
      })
      .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage)
      });
  }
}

function createFirestoreTutorApplicant(tutorApplicantID) {
    var tutorToUpdate = {}
        var newTutorDict = {
              "email" : emailField.value,
              "firstName" : firstNameField.value,
              "lastName" : lastNameField.value,
              "phoneNumber" : phoneNumberField.value,
              "school" : schoolField.value,
              "howHeard" : howHeardField.value,
              "timeCreated" : new Date() / 1000
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

          tutorToUpdate[tutorApplicantID] = newTutorDict
  
        // Update user collection with tutor info
          userDB.collection("users").doc(tutorApplicantID).update(newUserDict)
          .then(function() {
              console.log("Document successfully written!");
              location.href = "https://www.jointutortree.com/tutor/onboarding-dashboard"
          })

  
}
                                                                                         
function createNewUser() {
      
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

