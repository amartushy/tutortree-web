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
var tutorSchoolOther = document.getElementById("myInput")
var tutorHowHeard = document.getElementById("tutor-how-heard")

//Application -> applicationFields
var tutorMajor = document.getElementById("tutor-major")
var tutorCourses = document.getElementById("tutor-courses")
var tutorWhyTutor = document.getElementById("tutor-whyTutor")
var tutorGroups = document.getElementById("tutor-groups")
var tutorYear = document.getElementById("tutor-year")

//Navigation Buttons
var tutorBecomeNext = document.getElementById("tutor-become-next")
var tutorAboutBack = document.getElementById("tutor-about-back")
var tutorAboutNext = document.getElementById("tutor-about-next")
var tutorAlmostBack = document.getElementById("tutor-almost-back")
var tutorAppSubmit = document.getElementById("tutor-app-submit")

//Variable displays
var referralField = document.getElementById('referral-field')

//Show referral field if necessary
$("#tutor-how-heard").change(function () {
	if (tutorHowHeard.value == "referral") {
		referralField.style.display = "block"
	} else {
		referralField.style.display = "none"
	}
 });

//Show school input if changed
$("#tutor-school").change(function () {
	if (tutorSchool.value == "other") {
		document.getElementById('other-school-input').style.display = "block"
	} else {
		document.getElementById('other-school-input').style.display = "none"
	}
 });

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
	} else if ( tutorWhyTutor.value == "" ) {
		 alert("Please describe why you'd like to be a tutor")  
	} else if ( tutorGroups.value == "" ) {
		 alert("Please describe if you're in any campus groups")  
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

tutorAppSubmit.setAttribute('onClick', 'checkApplicantStatus()')

var userDB = firebase.firestore();

function checkApplicantStatus() {
  //Check if they're a current user
      firebase.auth().signInWithEmailAndPassword(tutorEmail.value, tutorPassword.value).then(function(data) {
          firebase.auth().onAuthStateChanged(function(user) {
              if (user) {

                 //Create new tutor applicant
                var tutorApplicantID = user.uid
                createFirestoreTutorApplicant(tutorApplicantID)
		      
              }
          })
      })
    
  .catch(function(error) {
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
  })
}

function assignMixpanelSignUp(isExisting, referralCode) {
	//Update Mixpanel
	
	
	if(tutorSchool.value == "other"){
		var schoolName = tutorSchoolOther.value
	} else {
		var schoolName = tutorSchool.value
	}

	var newTutorDict = {
	      "email" : tutorEmail.value,
	      "firstName" : tutorFirst.value,
	      "lastName" : tutorLast.value,
	      "phoneNumber" : tutorPhone.value,
	      "school" : schoolName,
	      "howHeard" : tutorHowHeard.value,
	      "timeSubmitted" : new Date() / 1000,
	      "tutorApplicant" : true,
	      "courses" : tutorCourses.value,
	      "referredBy" : referralField.value,
	      "major" : tutorMajor.value,
	      "whyTutor" : tutorWhyTutor.value,
	      "groups" : tutorGroups.value,
	      "year" : tutorYear.value,
	      "referralCode" : referralCode
	  }

	if (!isExisting) {
		mpTutorSignUpNewUser(newTutorDict)
	} else {
		mpExistingTutorSignUp(newTutorDict)
	}
}


function createFirestoreTutorApplicant(tutorApplicantID) {

	if(tutorSchool.value == "other"){
		var schoolName = tutorSchoolOther.value
	} else {
		var schoolName = tutorSchool.value
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
		    "email" : tutorEmail.value,
                    "school" : schoolName,
                    "timeSubmitted" : new Date() / 1000,
                    "interviewScore" : 0,
                    "assessmentScore" : 0,
                    "completedInterview" : false,
                    "didRequestInterview" : false,
                    "didSubmitPreInterview" : true,
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
				"referredBy" : referralField.value,
				"major" : tutorMajor.value,
				"whyTutor" : tutorWhyTutor.value,
				"groups" : tutorGroups.value,
				"schoolName" : schoolName,
				"year" : tutorYear.value
			},
			"applicationPoints" : {
				"majorPoints" : 0,
				"groupsPoints" : 0,
				"whyTutorPoints" : 0,
				"yearPoints" : 0
			}
        }
  
        
      // Update user collection with tutor info
      console.log("Document successfully written!");
      userDB.collection("userTest").doc(tutorApplicantID).collection("tutorApplication").doc("application").set(applicationData)
      userDB.collection("userTest").doc(tutorApplicantID).collection("tutorApplication").doc("assessment").set(assessmentData)
      userDB.collection("userTest").doc(tutorApplicantID).collection("tutorApplication").doc("interview").set(interviewData).then(function() {
	   assignMixpanelSignUp(true)
	      console.log('called true')
           location.href = "https://www.jointutortree.com/tutor/onboarding-dashboard"
      })
}
function createNewUserTutorApplicant(tutorApplicantID) {
	
	if(tutorSchool.value == "other"){
		var schoolName = tutorSchoolOther.value
	} else {
		var schoolName = tutorSchool.value
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
                    "school" : schoolName,
                    "timeSubmitted" : new Date() / 1000,
                    "interviewScore" : 0,
                    "assessmentScore" : 0,
                    "completedInterview" : false,
                    "didRequestInterview" : false,
                    "didSubmitPreInterview" : true,
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
				"referredBy" :referralField.value,
				"major" : tutorMajor.value,
				"groups" : tutorGroups.value,
				"whyTutor" : tutorWhyTutor.value,
				"schoolName" : schoolName,
				"year" : tutorYear.value
			},
			"applicationPoints" : {
				"majorPoints" : 0,
				"whyTutorPoints" : 0,
				"groupsPoints" : 0,
				"yearPoints" : 0
			}
        }
	var referralCode = tutorFirst.value + appendRandomLetters()
	
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
		    "referralCode" : referralCode,
                    "school" : 	tutorSchool.value,
		    "tutorApplicantStatus" : "pending",
		    "currentBalance" : 0
                }
          
        // Update user collection with tutor info
          userDB.collection("userTest").doc(tutorApplicantID).set(appUserInfo)
          .then(function() {
              console.log("Document successfully written!");		  
              userDB.collection("userTest").doc(tutorApplicantID).collection("tutorApplication").doc("application").set(applicationData)
              userDB.collection("userTest").doc(tutorApplicantID).collection("tutorApplication").doc("assessment").set(assessmentData)
              userDB.collection("userTest").doc(tutorApplicantID).collection("tutorApplication").doc("interview").set(interviewData).then(function() {
		      console.log('called false')
		      assignMixpanelSignUp(false, referralCode)
                   location.href = "https://www.jointutortree.com/tutor/onboarding-dashboard"
              })
          })
}

function appendRandomLetters() {
    var result =''
    var characters = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
    var charactersLength = characters.length
    
    for (i = 0; i < 3; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}
