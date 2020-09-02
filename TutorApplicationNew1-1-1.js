mpTutorSignupPageViewed()

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
          createNewUserTutorApplicant(tutorApplicantID)
        
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
	
      var cleanSchoolName = cleanSchoolName(schoolField.value)
      
      var newTutorDict = {
              "email" : emailField.value,
              "firstName" : firstNameField.value,
              "lastName" : lastNameField.value,
              "phoneNumber" : phoneNumberField.value,
              "school" : cleanSchoolName,
              "howHeard" : howHeardField.value,
              "timeSubmitted" : new Date() / 1000,
              "tutorApplicant" : true,
              "application" : {
                  "didSubmitPreInterview" : false,
                  "didRequestInterview" : false,
                  "completedInterview" : false,
                  "uploadedTranscript" : false,
                  "uploadedFaculty" : false,
                  "isApproved" : false,
              },
              "interview" : {
                  "challengingScore" : "0"
              }
          }
      var interviewData = {
                    "interviewNotes" : {
                        "challengingNotes" : "No notes yet",
                        "confidenceNotes" : "No notes yet",
                        "explainNotes" : "No notes yet",
                        "helpNotes" : "No notes yet",
                        "onTimeNotes" : "No notes yet",
                        "onlineNotes" : "No notes yet",
                        "preparedNotes" : "No notes yet",
                        "questionNotes" : "No notes yet",
                        "situationNotes" : "No notes yet",
                        "troubleNotes" : "No notes yet"
                    },

                    "interviewScores" : {
                        "challengingScore" : 0,
                        "confidenceScore" : 0,
                        "explainScore" : 0,
                        "helpScore" : 0,
                        "onTimeScore" : 0,
                        "onlineScore" : 0,
                        "preparedScore" : 0,
                        "questionScore" : 0,
                        "situationScore" : 0,
                        "troubleScore" : 0
                    }
                }
        var assessmentData = {
                    "assessmentFields" : {
                        "courses" : "No entry yet",
                        "experience" : "No entry yet",
                        "groups" : "No entry yet",
                        "hours" : "No entry yet",
                        "major" : "No entry yet",
                        "qualities" : "No entry yet",
                        "whyTutor" : "No entry yet",
                        "year" : "No entry yet",
			"mobileOS" : "No entry yet"
                    },

                    "assessmentScores" : {
                        "experiencePoints" : 0,
                        "qualitiesPoints" : 0,
                        "whyTutorPoints" : 0,
                        "yearPoints" : 0,
			                  "activitiesPoints" : 0
                    }
                }
	
	var applicationData = {
                    "email" : emailField.value,
                    "firstName" : firstNameField.value,
                    "lastName" : lastNameField.value,
                    "school" : cleanSchoolName,
                    "timeSubmitted" : new Date() / 1000,
                    "interviewScore" : 0,
                    "assessmentScore" : 0,
                    "completedInterview" : false,
                    "didRequestInterview" : false,
                    "didSubmitPreInterview" : false,
                    "uploadedFaculty" : false,
                    "facultyFile" : "No file",
                    "uploadedTranscript" : false,
                    "transcriptFile" : "No file",
                    "howHeard" : howHeardField.value,
		                "meghanNotes" : "No notes yet"
        }
     mpTutorAccountCreated( newTutorDict )
        
      // Update user collection with tutor info
      console.log("Document successfully written!");
      userDB.collection("userTest").doc(tutorApplicantID).collection("tutorApplication").doc("application").set(applicationData)
      userDB.collection("userTest").doc(tutorApplicantID).collection("tutorApplication").doc("assessment").set(assessmentData)
      userDB.collection("userTest").doc(tutorApplicantID).collection("tutorApplication").doc("interview").set(interviewData).then(function() {
           location.href = "https://www.jointutortree.com/tutor/onboarding-dashboard"
      })
}
function createNewUserTutorApplicant(tutorApplicantID) {

      var cleanSchoolName = cleanSchoolName(schoolField.value)	
	
        var newTutorDict = {
              "email" : emailField.value,
              "firstName" : firstNameField.value,
              "lastName" : lastNameField.value,
              "phoneNumber" : phoneNumberField.value,
              "school" : cleanSchoolName,
              "howHeard" : howHeardField.value,
              "timeSubmitted" : new Date() / 1000,
              "tutorApplicant" : true,
              "application" : {
                  "didSubmitPreInterview" : false,
                  "didRequestInterview" : false,
                  "completedInterview" : false,
                  "uploadedTranscript" : false,
                  "uploadedFaculty" : false,
                  "isApproved" : false,
              },
              "interview" : {
                  "challengingScore" : "0"
              }
          }
        
        var interviewData = {
                    "interviewNotes" : {
                        "challengingNotes" : "No notes yet",
                        "confidenceNotes" : "No notes yet",
                        "explainNotes" : "No notes yet",
                        "helpNotes" : "No notes yet",
                        "onTimeNotes" : "No notes yet",
                        "onlineNotes" : "No notes yet",
                        "preparedNotes" : "No notes yet",
                        "questionNotes" : "No notes yet",
                        "situationNotes" : "No notes yet",
                        "troubleNotes" : "No notes yet"
                    },

                    "interviewScores" : {
                        "challengingScore" : 0,
                        "confidenceScore" : 0,
                        "explainScore" : 0,
                        "helpScore" : 0,
                        "onTimeScore" : 0,
                        "onlineScore" : 0,
                        "preparedScore" : 0,
                        "questionScore" : 0,
                        "situationScore" : 0,
                        "troubleScore" : 0
                    }
                }
        var assessmentData = {
                    "assessmentFields" : {
                        "courses" : "No entry yet",
                        "experience" : "No entry yet",
                        "groups" : "No entry yet",
                        "hours" : "No entry yet",
                        "major" : "No entry yet",
                        "qualities" : "No entry yet",
                        "whyTutor" : "No entry yet",
                        "year" : "No entry yet"
                    },

                    "assessmentScores" : {
                        "experiencePoints" : 0,
                        "qualitiesPoints" : 0,
                        "whyTutorPoints" : 0,
                        "yearPoints" : 0,
			                  "activitiesPoints" : 0
                    }
                }
        var applicationData = {
                    "email" : emailField.value,
                    "firstName" : firstNameField.value,
                    "lastName" : lastNameField.value,
                    "school" : cleanSchoolName,
                    "timeSubmitted" : new Date() / 1000,
                    "interviewScore" : 0,
                    "assessmentScore" : 0,
                    "completedInterview" : false,
                    "didRequestInterview" : false,
                    "didSubmitPreInterview" : false,
                    "uploadedFaculty" : false,
                    "facultyFile" : "No file",
                    "uploadedTranscript" : false,
                    "transcriptFile" : "No file",
                    "howHeard" : howHeardField.value,
		                "meghanNotes" : "No notes yet"
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
                    "major" : "No major entered",
                    "maxHPW" : 20,
                    "name" : firstNameField.value + " " + lastNameField.value,
                    "phoneNumber" : phoneNumberField.value,
                    "pricePHH" : 10,
                    "profileImage" : "https://firebasestorage.googleapis.com/v0/b/tutortree-68061.appspot.com/o/images%2FTTLogo-Mint.png?alt=media&token=c8d6559e-7fa8-4fed-81cc-1f09d5da56a5",
                    "pushToken" : "",
                    "school" : "Invalid School",
		                "tutorApplicantStatus" : "pending"
                }
        
          mpTutorAccountCreated( newTutorDict )

          
  
        // Update user collection with tutor info
          userDB.collection("userTest").doc(tutorApplicantID).set(appUserInfo)
          .then(function() {
              console.log("Document successfully written!");
              userDB.collection("userTest").doc(tutorApplicantID).collection("tutorApplication").doc("application").set(applicationData)
              userDB.collection("userTest").doc(tutorApplicantID).collection("tutorApplication").doc("assessment").set(assessmentData)
              userDB.collection("userTest").doc(tutorApplicantID).collection("tutorApplication").doc("interview").set(interviewData).then(function() {
                   location.href = "https://www.jointutortree.com/tutor/onboarding-dashboard"
              })
          })
	
function cleanSchoolName(schoolField){

	var schoolFieldLower = schoolField.toLowerCase()
	var schoolFieldTrim = schoolFieldLower.trim()
	var schoolFieldNoComma = schoolFieldTrim.replace(",", "")

	//UC Berkeley
	if (schoolFieldNoComma.match(/.*berkeley.*/)) {
		return "berkeley"

	// USC
	} else if(schoolFieldNoComma.match(/.*usc.*/) || schoolFieldNoComma.match(/.*southern california.*/)) {
		return "usc"
	}
	// University of Oregon
	else if(schoolFieldNoComma.match(/.*university of oregon.*/) || schoolFieldNoComma.match(/.*uo.*/) || schoolFieldNoComma.match(/oregon/)) {
	 	return "uoregon"
	}
	// Oregon State
	else if(schoolFieldNoComma.match(/.*oregon state.*/)) {
	 	return "osu"
	}
	// Pepperdine
	else if(schoolFieldNoComma.match(/.*pepperdine.*/)) {
	 	return "pepperdine"
	}
	// San Jose State
	else if(schoolFieldNoComma.match(/.*san jos.*/) || schoolFieldNoComma.match(/.*sjsu.*/)) {
	 	return "sjsu"
	}
	// CSUN
	else if(schoolFieldNoComma.match(/.*northridge.*/) || schoolFieldNoComma.match(/.*csun.*/)) {
	 	return "csun"
	}
	// UCSB
	else if(schoolFieldNoComma.match(/.*santa barbara.*/) || schoolFieldNoComma.match(/.*ucsb.*/)) {
	 	return "ucsb"
	}
	// UCLA
	else if(schoolFieldNoComma.match(/.*ucla.*/) || schoolFieldNoComma.match(/.*los angeles.*/)) {
	 	return "ucla"
	}
	// UCSD
	else if(schoolFieldNoComma.match(/.*ucsd.*/) || schoolFieldNoComma.match(/.*uc san diego.*/) 
		|| schoolFieldNoComma.match(/.*university of california san diego.*/) || schoolFieldNoComma.match(/.*scripps.*/)) {
	 	return "ucsd"
	}
	// Stanford
	else if(schoolFieldNoComma.match(/.*stanford.*/)) {
	 	return "stanford"
	}	
	// return if no  match
	else {
	 	return schoolField
	}							
}
}
