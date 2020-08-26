
    var userDB = firebase.firestore()
    
    
    var timeCreatedButton = document.getElementById('update-time-created')
    timeCreatedButton.setAttribute('onClick', 'updateTimeCreated()') 


	function updateTimeCreated() {
		
		userDB.collection('userTest').onSnapshot(function(applicants) {
			applicants.forEach(function(tutor) {
				var timeCreated = new Date() /1000
				
				try {
					userDB.collection('userTest').doc(tutor.id).collection('tutorApplication').doc('application').get().then(function(doc) {
						console.log(doc.timeCreated)
					})
					
				} catch {
					
					console.log('no time created')
				}
				
			})
			
			
		})
	}


    var applicationButton = document.getElementById('update-application-fields')
    applicationButton.setAttribute('onClick', 'updateApplication()') 

	function updateApplication() {
		userDB.collection("users").onSnapshot(function(applicants) {
			applicants.forEach(function(doc) {
				var firstName = "No first name"
				var lastName = "No last name"
				var mobileOS = "No Entry"
				var timeSubmitted = new Date() /1000
				
				try {
					if (doc.data().firstName != null) {
						firstName = doc.data().firstName
					}
				} catch {
					console.log("no first name")
				}
				
				try {
					if (doc.data().lastName != null) {
						lastName = doc.data().lastName
					}
				} catch {
					console.log("no last name")
				}
				
				try {
					if (doc.data().application.assessment.mobileOS != null) {
						mobileOS = doc.data().application.assessment.mobileOS
					}
				} catch {
					console.log("no first name")
				}
				
				userDB.collection("userTest")
					.doc(doc.id)
					.collection("tutorApplication")
					.doc("application")
					.update({"firstName" : firstName,
						"lastName" : lastName,
						"assessment" : firebase.firestore.FieldValue.delete()})
				
				userDB.collection("userTest")
					.doc(doc.id)
					.collection("tutorApplication")
					.doc("assessment")
					.update({"assessmentFields.mobileOS" : mobileOS,
						"mobileOS" : firebase.firestore.FieldValue.delete()})
			})
		})
	}
    
    
    var updateButton = document.getElementById('update-user-test')
    updateButton.setAttribute('onClick', 'updateUserTest()')

    function updateUserTest() {
        userDB.collection("users").onSnapshot(function(applicants) {
            applicants.forEach(function(doc) {
								var applicantsID = doc.id
                
                //var PIAData = doc.data().application
                //var interviewData = doc.data().application.interview


                //Requisite values for iOS functionality
                var email = "email@email.com"
                var major = "Please enter your major"
                var concatName = "Please enter your name"                
                if (doc.data().email != null) {
                    email = doc.data().email
                } else {
                    console.log("no email for user, user id is: " +  doc.id)
                    return
                }
                try {
                		if (doc.data().application.assessment.major != null) {
                    		major = doc.data().application.assessment.major
                    } else {
                        console.log("no major entered")
                    }
                } catch {
                		console.log("no assessment")
                }
                
                if (doc.data().firstName != null) {
                    concatName = doc.data().firstName 
                } else if (doc.data().lastName != null) {
                		concatName = doc.data().firstName + " " + doc.data().lastName
                } else {
                		console.log("no name entered")
                }

                //Assessment Information
                //Assessment Text Fields
                var courses = "No entry"
                try { 
			if (doc.data().application.assessment.courses != null) {
				courses = doc.data().application.assessment.courses
			}
                } catch {
                    console.log("no data")
                }

                var experience = "No entry"
                try {
			if (doc.data().application.assessment.experience != null) {
				experience = doc.data().application.assessment.experience
			}
                } catch {
                    console.log("no data")
                }

                var groups = "No entry"
                try {
			if (doc.data().application.assessment.groups != null) {
				groups = doc.data().application.assessment.groups
			}
                } catch {
                    console.log("no data")
                }

                var hours = "No entry"
                try {
			if (doc.data().application.assessment.hours != null) {
				hours = doc.data().application.assessment.hours
			}
                } catch {
                    console.log("no data")
                }

                var qualities = "No entry"
                try {
			if (doc.data().application.assessment.qualities != null) {
				qualities = doc.data().application.assessment.qualities
			}
                } catch {
                    console.log("no data")
                }

                var whyTutor = "No entry"
                try {
			if (doc.data().application.assessment.whyTutor != null) {
				whyTutor = doc.data().application.assessment.whyTutor
			}
                } catch {
                    console.log("no data")
                }

                var year = "No entry"
                try {
			if (doc.data().application.assessment.year != null) {
				year = doc.data().application.assessment.year
			}
                } catch {
                    console.log("no data")
                }

                //Assessment Scores
                var experiencePoints = 0
		try {
			if (doc.data().application.assessment.experiencePoints != null) {
			    experiencePoints = doc.data().application.assessment.experiencePoints
			} else {
			    console.log("no data")
			}
		} catch {
			console.log("no data")
		}

                var qualitiesPoints = 0
		try {
			if (doc.data().application.assessment.qualitiesPoints != null) {
			    qualitiesPoints = doc.data().application.assessment.qualitiesPoints
			} else {
			    console.log("no data")
			}
		} catch {
			console.log("no data")
		}

                var whyTutorPoints = 0
		try {
			if (doc.data().application.assessment.whyTutorPoints != null) {
                    		whyTutorPoints = doc.data().application.assessment.whyTutorPoints
                	} else {
                    		console.log("no data")
                	}
		} catch {
                    	console.log("no data")
		}
		    
		var activitiesPoints = 0
		try {
			if (doc.data().application.assessment.activitiesPoints != null) {
                    		activitiesPoints = doc.data().application.assessment.activitiesPoints
                	} else {
                    		console.log("no data")
                	}
		} catch {
                    	console.log("no data")
		}

                var yearPoints = 0
		try {
			if (doc.data().application.assessment.yearPoints != null) {
			    yearPoints = doc.data().application.assessment.yearPoints
			} else {
			    console.log("no data")
			}
		} catch {
			console.log("no data")
		}

                var assessmentData = {
                    "assessmentFields" : {
                        "courses" : courses,
                        "experience" : experience,
                        "groups" : groups,
                        "hours" : hours,
                        "major" : major,
                        "qualities" : qualities,
                        "whyTutor" : whyTutor,
                        "year" : year
                    },

                    "assessmentScores" : {
                        "experiencePoints" : experiencePoints,
                        "qualitiesPoints" : qualitiesPoints,
                        "whyTutorPoints" : whyTutorPoints,
                        "yearPoints" : yearPoints,
			"activitiesPoints" : activitiesPoints
                    }
                }


                //Interview Information
                //interview notes
                var challengingNotes = "No notes yet"
                try {
			if (doc.data().application.interview.challengingNotes != null) {
				challengingNotes = doc.data().application.interview.challengingNotes
			}
                } catch {
                    console.log("no notes")
                }

                var confidenceNotes = "No notes yet"
                try {
			if (doc.data().application.interview.confidenceNotes != null) {
				confidenceNotes = doc.data().application.interview.confidenceNotes
			}
                } catch {
                    console.log("no notes")
                }

                var explainNotes = "No notes yet"
                try {
			if (doc.data().application.interview.explainNotes != null) {
				explainNotes = doc.data().application.interview.explainNotes
			}
                } catch {
                    console.log("no notes")
                }

                var helpNotes = "No notes yet"
                try {
			if (doc.data().application.interview.helpNotes != null) {
				helpNotes = doc.data().application.interview.helpNotes
			}
                } catch {
                    console.log("no notes")
                }

                var onTimeNotes = "No notes yet"
                try {
			if (doc.data().application.interview.onTimeNotes != null) {
				onTimeNotes = doc.data().application.interview.onTimeNotes
			}
                } catch {
                    console.log("no notes")
                }

                var onlineNotes = "No notes yet"
                try {
			if (doc.data().application.interview.onlineNotes != null) {
				onlineNotes = doc.data().application.interview.onlineNotes
			}
                } catch {
                    console.log("no notes")
                }

                var preparedNotes = "No notes yet"
                try {
			if (doc.data().application.interview.preparedNotes != null) {
				preparedNotes = doc.data().application.interview.preparedNotes
			}
                } catch {
                    console.log("no notes")
                }

                var questionNotes = "No notes yet"
                try {
			if (doc.data().application.interview.questionNotes != null) {
				questionNotes = doc.data().application.interview.questionNotes
			}
                } catch {
                    console.log("no notes")
                }

                var situationNotes = "No notes yet"
                try {
			if (doc.data().application.interview.situationNotes != null) {
				situationNotes = doc.data().application.interview.situationNotes
			}
                } catch {
                    console.log("no notes")
                }

                var troubleNotes = "No notes yet"
                try {
			if (doc.data().application.interview.troubleNotes != null) {
				troubleNotes = doc.data().application.interview.troubleNotes
			}
                } catch {
                    console.log("no notes")
                }

                //interview scores
                var challengingScore = 0
                try {
			if (doc.data().application.interview.challengingScore != null) {
				challengingScore = doc.data().application.interview.challengingScore
			}
                } catch {
                    console.log("no score available")
                }
                var confidenceScore = 0
                try {
			if (doc.data().application.interview.confidenceScore != null) {
				confidenceScore = doc.data().application.interview.confidenceScore
			}
                } catch {
                    console.log("no score available")
                }
                var explainScore = 0
                try {
			if (doc.data().application.interview.explainScore != null) {
				explainScore = doc.data().application.interview.explainScore
			}
                } catch {
                    console.log("no score available")
                }
                var helpScore = 0
                try {
			if (doc.data().application.interview.helpScore != null) {
				helpScore = doc.data().application.interview.helpScore
			}
                } catch {
                    console.log("no score available")
                }
                var onTimeScore = 0
                try {
			if (doc.data().application.interview.onTimeScore != null) {
				onTimeScore = doc.data().application.interview.onTimeScore
			}
                } catch {
                    console.log("no score available")
                }
                var onlineScore = 0
                try {
			if (doc.data().application.interview.onlineScore != null) {
				onlineScore = doc.data().application.interview.onlineScore
			}
                } catch {
                    console.log("no score available")
                }
                var preparedScore = 0
                try {
			if (doc.data().application.interview.preparedScore != null) {
				preparedScore = doc.data().application.interview.preparedScore
			}
                } catch {
                    console.log("no score available")
                }
                var questionScore = 0
                try {
			if (doc.data().application.interview.questionScore != null) {
				questionScore = doc.data().application.interview.questionScore
			}
                } catch {
                    console.log("no score available")
                }
                var situationScore = 0
                try {
			if (doc.data().application.interview.situationScore != null) {
				situationScore = doc.data().application.interview.situationScore
			}
                } catch {
                    console.log("no score available")
                }
                var troubleScore = 0
                try {
			if (doc.data().application.interview.troubleScore != null) {
				troubleScore = doc.data().application.interview.troubleScore
			}
                } catch {
                    console.log("no score available")
                }

                var interviewData = {
                    "interviewNotes" : {
                        "challengingNotes" : challengingNotes,
                        "confidenceNotes" : confidenceNotes,
                        "explainNotes" : explainNotes,
                        "helpNotes" : helpNotes,
                        "onTimeNotes" : onTimeNotes,
                        "onlineNotes" : onlineNotes,
                        "preparedNotes" : preparedNotes,
                        "questionNotes" : questionNotes,
                        "situationNotes" : situationNotes,
                        "troubleNotes" : troubleNotes
                    },

                    "interviewScores" : {
                        "challengingScore" : challengingScore,
                        "confidenceScore" : confidenceScore,
                        "explainScore" : explainScore,
                        "helpScore" : helpScore,
                        "onTimeScore" : onTimeScore,
                        "onlineScore" : onlineScore,
                        "preparedScore" : preparedScore,
                        "questionScore" : questionScore,
                        "situationScore" : situationScore,
                        "troubleScore" : troubleScore
                    }
                }

                //Application Info
                var interviewScore = 0
                if (doc.data().application.interviewScore != null) {
                    interviewScore = doc.data().application.interviewScore
                } else {
                    console.log("no interview score data")
                }

                var assessmentScore = 0
                if (doc.data().application.assessmentScore != null) {
                    assessmentScore = doc.data().application.assessmentScore
                } else {
                    console.log("no assessment score data")
                }

                var facultyFile = "No file uploaded"
                if (doc.data().application.facultyFile != null) {
                    facultyFile = doc.data().application.facultyFile
                } else {
                    console.log("no assessment score data")
                }

                var transcriptFile = "No file uploaded"
                if (doc.data().application.transcriptFile != null) {
                    transcriptFile = doc.data().application.transcriptFile
                } else {
                    console.log("no assessment score data")
                }
		var completedInterview = false
		if (doc.data().application.completedInterview != null) {
			completedInterview = doc.data().application.completedInterview	
		} else {
			console.log("no data")
		}
		var didRequestInterview = false
		if (doc.data().application.didRequestInterview != null) {
			didRequestInterview = doc.data().application.didRequestInterview	
		} else {
			console.log("no data")
		}
		var didSubmitPreInterview = false
		if (doc.data().application.didSubmitPreInterview != null) {
			didSubmitPreInterview = doc.data().application.didSubmitPreInterview	
		} else {
			console.log("no data")
		}
		var uploadedFaculty = false
		if (doc.data().application.uploadedFaculty != null) {
			uploadedFaculty = doc.data().application.uploadedFaculty	
		} else {
			console.log("no data")
		}
		var uploadedTranscript = false
		if (doc.data().application.uploadedTranscript != null) {
			uploadedTranscript = doc.data().application.uploadedTranscript	
		} else {
			console.log("no data")
		}
		var meghanNotes = "No notes yet"
		if (doc.data().application.meghanNotes != null) {
			meghanNotes = doc.data().application.meghanNotes	
		} else {
			console.log("no data")
		}


                var applicationData = {
                    "timeSubmitted" : doc.data().timeCreated,
                    "interviewScore" : interviewScore,
                    "assessmentScore" : assessmentScore,
                    "completedInterview" : completedInterview,
                    "didRequestInterview" : didRequestInterview,
                    "didSubmitPreInterview" : didSubmitPreInterview,
                    "uploadedFaculty" : uploadedFaculty,
                    "facultyFile" : facultyFile,
                    "uploadedTranscript" : uploadedTranscript,
                    "transcriptFile" : transcriptFile,
                    "howHeard" : doc.data().howHeard,
                    "school" : doc.data().school,
		    "meghanNotes" : meghanNotes
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
                    "email" : email,
                    "isAdmin" : false,
                    "isEmailOn" : false,
                    "isPushOn" : false,
                    "isSMSOn" : false,
                    "isTutor" : false,
                    "major" : major,
                    "maxHPW" : 20,
                    "name" : concatName,
                    "phoneNumber" : "1234567890",
                    "pricePHH" : 10,
                    "profileImage" : "https://firebasestorage.googleapis.com/v0/b/tutortree-68061.appspot.com/o/images%2FTTLogo-Mint.png?alt=media&token=c8d6559e-7fa8-4fed-81cc-1f09d5da56a5",
                    "pushToken" : "",
                    "school" : "Invalid School",
		    "tutorApplicantStatus" : "pending"
                }
                userDB.collection("userTest").doc(doc.id).set(appUserInfo, {merge : true})
                userDB.collection("userTest").doc(doc.id).collection("tutorApplication").doc("assessment").set(assessmentData, { merge: true })
                userDB.collection("userTest").doc(doc.id).collection("tutorApplication").doc("interview").set(interviewData, { merge: true })
                userDB.collection("userTest").doc(doc.id).collection("tutorApplication").doc("application").set(applicationData, { merge: true })
            })
        })
    }
