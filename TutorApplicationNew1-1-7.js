mpTutorSignupPageViewed()

//Application Sections
var tutorApplicationOne = document.getElementById("tutor-application-1")
var tutorApplicationTwo = document.getElementById("tutor-application-2")
var tutorApplicationThree = document.getElementById("tutor-application-3")

//Core Properties needed for iOS
var tutorEmail = document.getElementById("tutor-email")
var tutorPhone = document.getElementById("tutor-phone")

//Application values
var tutorFirst = document.getElementById("tutor-first")
var tutorLast = document.getElementById("tutor-last")
var tutorPassword = document.getElementById('tutor-password')
var tutorSchool = document.getElementById("tutor-school")
var tutorHowHeard = document.getElementById("tutor-how-heard")

//Application -> applicationFields
var tutorMajor = document.getElementById("tutor-major")
var tutorCourses = document.getElementById("tutor-courses")
var tutorQualities = document.getElementById("tutor-qualities")
var tutorYear = document.getElementById("tutor-year")

//Navigation Buttons
var tutorBecomeNext = document.getElementById("tutor-become-next")
var tutorAboutBack = document.getElementById("tutor-about-back")
var tutorAboutNext = document.getElementById("tutor-about-next")
var tutorAlmostBack = document.getElementById("tutor-almost-back")
var tutorAppSubmit = document.getElementById("tutor-app-submit")

//Navigation Button Functions
tutorBecomeNext.addEventListener('click', function(e) {
	if ( tutorEmail.value == "" ) {
		alert('Please enter your email')
	} else if ( tutorFirst.value == "" ) {
		 alert('Please enter your first name')  
	} else if ( tutorLast.value == "" ) {
		 alert('Please enter your last name')  
	} else if ( tutorPhone.value == "" ) {
		 alert('Please enter your phone number')  
	} else if ( tutorPassword.value == "" ) {
		 alert('Please enter password')  
	} else if ( tutorSchool.value == "" ) {
		 alert('Please select what school you go to')  
	} else if ( tutorHowHeard.value == "" ) {
		 alert('Please enter how you heard of TutorTree')  
	} else {
		tutorApplicationOne.style.display = "none"
		tutorApplicationTwo.style.display = "flex"
	}
})

tutorAboutBack.addEventListener('click', function(e) {
	tutorApplicationTwo.style.display = 'none'
	tutorApplicationOne.style.display = 'flex'
})

tutorAboutNext.addEventListener('click', function(e) {
	if ( tutorMajor.value == "" ) {
		alert('Please enter your major')
	} else if ( tutorCourses.value == "" ) {
		 alert('Please enter the courses you would like to tutor')  
	} else if ( tutorQualities.value == "" ) {
		 alert('Please describe your strengths as a tutor')  
	} else if ( tutorYear.value == "" ) {
		 alert('Please select what year you are')  
	} else {
		tutorApplicationTwo.style.display = "none"
		tutorApplicationThree.style.display = "flex"
	}
})

tutorAlmostBack.addEventListener('click', function(e) {
	tutorApplicationTwo.style.display = "flex"
	tutorApplicationThree.style.display = "none"
})


var userDB = firebase.firestore();

function checkApplicantStatus() {
  //Check if they're a current user
  try {
      firebase.auth().signInEmailAndPassword(tutorEmail.value, tutorPassword.value).then(function(data) {
          firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                 //Create new tutor applicant
                var tutorApplicantID = user.uid
                createFirestoreTutorApplicant(tutorApplicantID)
              }
          })
      })
    
  } catch {
      firebase.auth().createUserWithEmailAndPassword(tutorEmail.value, tutorPassword.value).then(function(data) {
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
	
      var cleanSchoolName = cleanSchoolName(tutorSchool.value)
      
      var newTutorDict = {
              "email" : tutorEmail.value,
              "firstName" : tutorFirst.value,
              "lastName" : tutorLast.value,
              "phoneNumber" : tutorPhone.value,
              "school" : cleanSchoolName,
              "howHeard" : tutorHowHeard.value,
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
		    "email" : tutorEmail.value
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
		    "meghanNotes" : "No notes yet",
			"applicationFields" : {
				"courses" : tutorCourses.value,
				"firstName" : tutorFirst.value,
				"lastName" : tutorLast.value,
				"howHeard" : tutorHowHeard.value,
				"major" : tutorMajor.value,
				"qualities" : tutorQualities.value,
				"schoolName" : tutorSchool.value,
				"year" : tutorYear.value
			},
			"applicationPoints" : {
				"majorPoints" : 0,
				"qualitiesPoints" : 0,
				"yearPoints" : 0
			}
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

      var cleanSchoolName = cleanSchoolName(tutorSchool.value)	
	
        var newTutorDict = {
              "email" : tutorEmail.value,
              "firstName" : tutorFirst.value,
              "lastName" : tutorLast.value,
              "phoneNumber" : tutorPhone.value,
              "school" : cleanSchoolName,
              "howHeard" : tutorHowHeard.value,
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
                    "email" : tutorEmail.value,
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
		    "meghanNotes" : "No notes yet",
			"applicationFields" : {
				"courses" : tutorCourses.value,
				"firstName" : tutorFirst.value,
				"lastName" : tutorLast.value,
				"howHeard" : tutorHowHeard.value,
				"major" : tutorMajor.value,
				"qualities" : tutorQualities.value,
				"schoolName" : tutorSchool.value,
				"year" : tutorYear.value
			},
			"applicationPoints" : {
				"majorPoints" : 0,
				"qualitiesPoints" : 0,
				"yearPoints" : 0
			}
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
                    "email" : tutorEmail.value,
                    "isAdmin" : false,
                    "isEmailOn" : false,
                    "isPushOn" : false,
                    "isSMSOn" : false,
                    "isTutor" : false,
                    "major" : "No major entered",
                    "maxHPW" : 20,
                    "name" : tutorFirst.value + " " + tutorLast.value,
                    "phoneNumber" : tutorPhone.value,
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
