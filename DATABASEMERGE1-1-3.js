
    var userDB = firebase.firestore()
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
                    courses = doc.data().application.assessment.courses
                } catch {
                    console.log("no data")
                }

                var experience = "No entry"
                try {
                    experience = doc.data().application.assessment.experience
                } catch {
                    console.log("no data")
                }

                var groups = "No entry"
                try {
                    groups = doc.data().application.assessment.groups
                } catch {
                    console.log("no data")
                }

                var hours = "No entry"
                try {
                    hours = doc.data().application.assessment.hours
                } catch {
                    console.log("no data")
                }

                var major = "No entry"
                try {
                    major = doc.data().application.assessment.major
                } catch {
                    console.log("no data")
                }

                var qualities = "No entry"
                try {
                    qualities = doc.data().application.assessment.qualities
                } catch {
                    console.log("no data")
                }

                var whyTutor = "No entry"
                try {
                    whyTutor = doc.data().application.assessment.whyTutor
                } catch {
                    console.log("no data")
                }

                var year = "No entry"
                try {
                    year = doc.data().application.assessment.year
                } catch {
                    console.log("no data")
                }

                //Assessment Scores
                var experiencePoints = 0
                try {
                    experiencePoints = doc.data().application.assessment.experiencePoints
                } catch {
                    console.log("no data")
                }

                var qualitiesPoints = 0
                try {
                    qualitiesPoints = doc.data().application.assessment.qualitiesPoints
                } catch {
                    console.log("no data")
                }

                var whyTutorPoints = 0
                try {
                    whyTutorPoints = doc.data().application.assessment.whyTutorPoints
                } catch {
                    console.log("no data")
                }

                var yearPoints = 0
                try {
                    yearPoints = doc.data().application.assessment.yearPoints
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
                        "yearPoints" : yearPoints
                    }
                }


                //Interview Information
                //interview notes
                var challengingNotes = "No notes yet"
                try {
                    challengingNotes = doc.data().application.interview.challengingNotes
                } catch {
                    console.log("no notes")
                }

                var confidenceNotes = "No notes yet"
                try {
                    confidenceNotes = doc.data().application.interview.confidenceNotes
                } catch {
                    console.log("no notes")
                }

                var explainNotes = "No notes yet"
                try {
                    explainNotes = doc.data().application.interview.explainNotes
                } catch {
                    console.log("no notes")
                }

                var helpNotes = "No notes yet"
                try {
                    helpNotes = doc.data().application.interview.helpNotes
                } catch {
                    console.log("no notes")
                }

                var onTimeNotes = "No notes yet"
                try {
                    onTimeNotes = doc.data().application.interview.onTimeNotes
                } catch {
                    console.log("no notes")
                }

                var onlineNotes = "No notes yet"
                try {
                    onlineNotes = doc.data().application.interview.onlineNotes
                } catch {
                    console.log("no notes")
                }

                var preparedNotes = "No notes yet"
                try {
                    preparedNotes = doc.data().application.interview.preparedNotes
                } catch {
                    console.log("no notes")
                }

                var questionNotes = "No notes yet"
                try {
                    questionNotes = doc.data().application.interview.questionNotes
                } catch {
                    console.log("no notes")
                }

                var situationNotes = "No notes yet"
                try {
                    situationNotes = doc.data().application.interview.situationNotes
                } catch {
                    console.log("no notes")
                }

                var troubleNotes = "No notes yet"
                try {
                    troubleNotes = doc.data().application.interview.troubleNotes
                } catch {
                    console.log("no notes")
                }

                //interview scores
                var challengingScore = 0
                try {
                    challengingScore = doc.data().application.interview.challengingScore
                } catch {
                    console.log("no score available")
                }
                var confidenceScore = 0
                try {
                    confidenceScore = doc.data().application.interview.confidenceScore
                } catch {
                    console.log("no score available")
                }
                var explainScore = 0
                try {
                    explainScore = doc.data().application.interview.explainScore
                } catch {
                    console.log("no score available")
                }
                var helpScore = 0
                try {
                    helpScore = doc.data().application.interview.helpScore
                } catch {
                    console.log("no score available")
                }
                var onTimeScore = 0
                try {
                    onTimeScore = doc.data().application.interview.onTimeScore
                } catch {
                    console.log("no score available")
                }
                var onlineScore = 0
                try {
                    onlineScore = doc.data().application.interview.onlineScore
                } catch {
                    console.log("no score available")
                }
                var preparedScore = 0
                try {
                    preparedScore = doc.data().application.interview.preparedScore
                } catch {
                    console.log("no score available")
                }
                var questionScore = 0
                try {
                    questionScore = doc.data().application.interview.questionScore
                } catch {
                    console.log("no score available")
                }
                var situationScore = 0
                try {
                    situationScore = doc.data().application.interview.situationScore
                } catch {
                    console.log("no score available")
                }
                var troubleScore = 0
                try {
                    troubleScore = doc.data().application.interview.troubleScore
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
                try {
                    interviewScore = doc.data().application.interviewScore
                } catch {
                    console.log("no interview score data")
                }

                var assessmentScore = 0
                try {
                    assessmentScore = doc.data().application.assessmentScore
                } catch {
                    console.log("no assessment score data")
                }

                var facultyFile = "No file uploaded"
                try {
                    facultyFile = doc.data().application.facultyFile
                } catch {
                    console.log("no assessment score data")
                }

                var transcriptFile = "No file uploaded"
                try {
                    transcriptFile = doc.data().application.transcriptFile
                } catch {
                    console.log("no assessment score data")
                }


                var applicationData = {
                    "timeSubmitted" : doc.data().timeCreated,
                    "interviewScore" : interviewScore,
                    "assessmentScore" : assessmentScore,
                    "completedInterview" : doc.data().completedInterview,
                    "didRequestInterview" : doc.data().didRequestInterview,
                    "didSubmitPreInterview" : doc.data().didSubmitPreInterview,
                    "uploadedFaculty" : doc.data().uploadedFaculty,
                    "facultyFile" : facultyFile,
                    "uploadedTranscript" : doc.data().uploadedTranscript,
                    "transcriptFile" : transcriptFile,
                    "howHeard" : doc.data().howHeard,
                    "school" : doc.data().school
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
                    "school" : "Invalid School"
                }
                userDB.collection("userTest").doc(doc.id).set(appUserInfo, {merge : true})
                userDB.collection("userTest").doc(doc.id).collection("tutorApplication").doc("assessment").set(assessmentData, { merge: true })
                userDB.collection("userTest").doc(doc.id).collection("tutorApplication").doc("interview").set(interviewData, { merge: true })
                userDB.collection("userTest").doc(doc.id).collection("tutorApplication").doc("application").set(applicationData, { merge: true })
            })
        })
    }
