firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var userDB = firebase.firestore()
		var userID = user.uid
		
		//Check if user is an admin
		userDB.collection("users").doc(userID).get().then(async function(doc) {
			console.log(doc.data().admin)
		})
		
		//Get all applicant information and build blocks
		var applicantArea = document.getElementById('applicant-section')
		userDB.collection("users").where("tutorApplicant", "==", true).onSnapshot(function(allTutors) {
			applicantArray = []
			while(applicantArea.firstChild) {
				applicantArea.removeChild(applicantArea.firstChild)
			}
			
			allTutors.forEach(function(doc) {
        			var applicantID = doc.id,
				    firstName = doc.data().firstName,
				    lastName = doc.data().lastName,
				    email = doc.data().email,
				    timeApplied = doc.data().timeCreated,
				    didSubmitPreInterview = doc.data().application.didSubmitPreInterview,
				    didRequest = doc.data().application.didRequestInterview,
				    didTranscript = doc.data().application.uploadedTranscript,
				    didFaculty = doc.data().application.uploadedFaculty,
				    //assessmentScore = doc.data().application.assessmentScore,
				    assessmentScore = await getAssessmentPoints(doc.id),
				    interviewScore = doc.data().application.interviewScore,
				    completed = false
				buildApplicantBlock(applicantID, 
						    firstName, 
						    lastName, 
						    email, 
						    timeApplied, 
						    didSubmitPreInterview, 
						    didRequest, 
						    didTranscript, 
						    didFaculty,
						    completed,
						    assessmentScore,
						    interviewScore)
			})
			appendToApplicantArea()
		})
		
		//Get all COMPLETED applicant information and build blocks
		var completedApplicantArea = document.getElementById('completed-applicant-section')
		userDB.collection("users").where("tutorApplicationApproved", "==", true).onSnapshot(function(allTutors) {
			completedApplicantArray = []
			while(completedApplicantArea.firstChild) {
				completedApplicantArea.removeChild(completedApplicantArea.firstChild)
			}
			
			allTutors.forEach(function(doc) {
        			var applicantID = doc.id,
				    firstName = doc.data().firstName,
				    lastName = doc.data().lastName,
				    email = doc.data().email,
				    timeApplied = doc.data().timeCreated,
				    didSubmitPreInterview = doc.data().application.didSubmitPreInterview,
				    didRequest = doc.data().application.didRequestInterview,
				    didTranscript = doc.data().application.uploadedTranscript,
				    didFaculty = doc.data().application.uploadedFaculty,
				    assessmentScore = doc.data().application.assessmentScore,
				    interviewScore = doc.data().application.interviewScore,
				    completed = true
				    
				buildApplicantBlock(applicantID, 
						    firstName, 
						    lastName, 
						    email, 
						    timeApplied, 
						    didSubmitPreInterview, 
						    didRequest, 
						    didTranscript, 
						    didFaculty,
						    completed,
						    assessmentScore,
						    interviewScore)
			})
			appendToCompletedApplicantArea()
		})
	} else {
		location.href = "https://www.jointutortree.com"
	}
})

function buildApplicantBlock(applicantID, firstName, lastName, email, timeApplied, didSubmitPreInterview, didRequest, didTranscript, didFaculty, completed, assessmentScore, interviewScore) {
	//Main Container
	var applicantBlock = document.createElement("div")
	applicantBlock.setAttribute('class', 'applicant-block')
	applicantBlock.setAttribute('id', timeApplied)
	if (completed) {
		updateCompletedApplicantArray(timeApplied)
	} else {
		updateApplicantArray(timeApplied)
	}

	//Name Block
	var nameBlock = document.createElement('div')
	nameBlock.setAttribute('class', 'name-block')

	var nameHeader = document.createElement('h4')
	nameHeader.setAttribute('class', 'applicants-name')
	nameHeader.innerHTML = firstName + ' ' + lastName
	nameBlock.appendChild(nameHeader)

	var emailHeader = document.createElement('div')
	emailHeader.setAttribute('class', 'applicants-email')
	emailHeader.innerHTML = email
	nameBlock.appendChild(emailHeader)

	var dateHeader = document.createElement('div')
	dateHeader.setAttribute('class', 'applicant-date')
	var applicantDate = new Date(timeApplied * 1000)
	var formattedTimeApplied = applicantDate.toLocaleDateString("en-US", {month:'long', day: 'numeric',
			hour: 'numeric', minute:'numeric'})
	dateHeader.innerHTML = formattedTimeApplied
	nameBlock.appendChild(dateHeader)

	applicantBlock.appendChild(nameBlock)

	//Pre-interview block
	var preInterviewBlock = document.createElement('div')
	preInterviewBlock.setAttribute('class', 'pre-interview-block')

	var preInterviewHeader = document.createElement('h4')
	preInterviewHeader.setAttribute('class', 'applicant-header')
	preInterviewHeader.innerHTML = "Assessment"
	preInterviewBlock.appendChild(preInterviewHeader)

	console.log(didSubmitPreInterview)

	if (didSubmitPreInterview) {
		var assessmentCompleted = document.createElement('div')
		assessmentCompleted.setAttribute('class', 'admin-complete')
		assessmentCompleted.innerHTML = 'check-circle'
		preInterviewBlock.appendChild(assessmentCompleted)
		preInterviewBlock.setAttribute('onClick', 'showAssessment("'+applicantID+'")')
	} else {
		var assessmentIncomplete = document.createElement('div')
		assessmentIncomplete.setAttribute('class', 'admin-incomplete')
		assessmentIncomplete.innerHTML = 'circle'
		preInterviewBlock.appendChild(assessmentIncomplete)
	}

	applicantBlock.appendChild(preInterviewBlock)

	//Requested Interview Block
	var requestedBlock = document.createElement('div')
	requestedBlock.setAttribute('class', 'requested-block')

	var requestedHeader = document.createElement('h4')
	requestedHeader.setAttribute('class', 'applicant-header')
	requestedHeader.innerHTML = "Requested Interview"
	requestedBlock.appendChild(requestedHeader)

	if (didRequest) {
		var requestCompleted = document.createElement('div')
		requestCompleted.setAttribute('class', 'admin-complete')
		requestCompleted.innerHTML = 'check-circle'
		requestedBlock.appendChild(requestCompleted)
	} else {
		var requestIncomplete = document.createElement('div')
		requestIncomplete.setAttribute('class', 'admin-incomplete')
		requestIncomplete.innerHTML = 'circle'
		requestedBlock.appendChild(requestIncomplete)
	}

	applicantBlock.appendChild(requestedBlock)

	//Transcript Block
	var transcriptBlock = document.createElement('div')
	transcriptBlock.setAttribute('class', 'transcript-block')

	var transcriptHeader = document.createElement('h4')
	transcriptHeader.setAttribute('class', 'applicant-header')
	transcriptHeader.innerHTML = "Uploaded Transcript"
	transcriptBlock.appendChild(transcriptHeader)

	if (didTranscript) {
		var transcriptComplete = document.createElement('div')
		transcriptComplete.setAttribute('class', 'admin-complete')
		transcriptComplete.innerHTML = 'check-circle'
		transcriptBlock.appendChild(transcriptComplete)
		transcriptBlock.setAttribute('onClick', 'showTranscript("'+applicantID+'")')
	} else {
		var transcriptIncomplete = document.createElement('div')
		transcriptIncomplete.setAttribute('class', 'admin-incomplete')
		transcriptIncomplete.innerHTML = 'circle'
		transcriptBlock.appendChild(transcriptIncomplete)
	}

	applicantBlock.appendChild(transcriptBlock)

	//Uploaded Faculty Recommendation Block
	var facultyBlock = document.createElement('div')
	facultyBlock.setAttribute('class', 'faculty-rec-block')

	var facultyHeader = document.createElement('h4')
	facultyHeader.setAttribute('class', 'applicant-header')
	facultyHeader.innerHTML = "Faculty Rec"
	facultyBlock.appendChild(facultyHeader)

	if (didFaculty) {
		var facultyComplete = document.createElement('div')
		facultyComplete.setAttribute('class', 'admin-complete')
		facultyComplete.innerHTML = 'check-circle'
		facultyBlock.appendChild(facultyComplete)
		facultyBlock.setAttribute('onClick', 'showFaculty("'+applicantID+'")')
	} else {
		var facultyIncomplete = document.createElement('div')
		facultyIncomplete.setAttribute('class', 'admin-incomplete')
		facultyIncomplete.innerHTML = 'circle'
		facultyBlock.appendChild(facultyIncomplete)
	}

	applicantBlock.appendChild(facultyBlock)

	//Score Blocks
	var userDB = firebase.firestore()
	console.log(assessmentScore)
	console.log(interviewScore)

	var formContainer = document.createElement('form')
	formContainer.setAttribute('class', 'score-form')
	var mainScore = document.createElement('div')
	mainScore.setAttribute('class', 'main-score')
	mainScore.innerHTML = parseInt(assessmentScore) + parseInt(interviewScore)
		formContainer.appendChild(mainScore)

	var individualScores = document.createElement('div')
	individualScores.setAttribute('class', 'individual-scores')
		formContainer.appendChild(individualScores)

	var piaScoreContainer = document.createElement('div')
	piaScoreContainer.setAttribute('class', 'pia-score-container')
		individualScores.appendChild(piaScoreContainer)

	var piaScoreHeader = document.createElement('div')
	piaScoreHeader.setAttribute('class', 'pia-score-header')
	piaScoreHeader.innerHTML = 'PIA:'
		piaScoreContainer.appendChild(piaScoreHeader)
	var piaScoreField = document.createElement('input')
	piaScoreField.setAttribute('class', 'pia-score')
	piaScoreField.placeholder = assessmentScore
	piaScoreField.onblur = function() {
		userDB.collection("users")
			.doc(applicantID)
			.update( { "application.assessmentScore" : piaScoreField.value } )
	}
	
		piaScoreContainer.appendChild(piaScoreField)

	var interviewScoreContainer = document.createElement('div')
	interviewScoreContainer.setAttribute('class', 'interview-score-container')
		individualScores.appendChild(interviewScoreContainer)
	var interviewScoreHeader = document.createElement('div')
	interviewScoreHeader.setAttribute('class', 'pia-score-header')
	interviewScoreHeader.innerHTML = 'Interview:'
		interviewScoreContainer.appendChild(interviewScoreHeader)

	var interviewScoreField = document.createElement('input')
	interviewScoreField.setAttribute('class', 'interview-score-field')
	interviewScoreField.placeholder = interviewScore
	interviewScoreField.onblur = function() {
		userDB.collection("users")
			.doc(applicantID)
			.update( { "application.interviewScore" : interviewScoreField.value } )
	}
		interviewScoreContainer.appendChild(interviewScoreField)

	applicantBlock.appendChild(formContainer)


	//Grant Access Code Block
	var accessButton = document.createElement('div')
	accessButton.setAttribute('class', 'applicant-access-button')

	if (completed) {
		accessButton.innerHTML = 'Remove Access'
	} else {
		accessButton.innerHTML = 'Grant Access'
	}
	accessButton.setAttribute('onclick', 'grantTutorPrivileges("'+applicantID+'","'+email+'")')
	applicantBlock.appendChild(accessButton)

	//Append to Body
	document.getElementById('applicant-section').appendChild(applicantBlock)
}


function showAssessment(applicantsID) {
	document.getElementById("assessment-wrapper").style.display = 'flex'
	
	var userDB = firebase.firestore()
	userDB.collection("users").doc(applicantsID).get().then(function(doc) {
		//Fields
		document.getElementById('pia-first').innerHTML = doc.data().firstName
		document.getElementById('pia-last').innerHTML = doc.data().lastName
		document.getElementById('pia-email').innerHTML = doc.data().email
		document.getElementById('pia-year').innerHTML = doc.data().application.assessment.year
		document.getElementById('pia-major').innerHTML = doc.data().application.assessment.major
		document.getElementById('pia-hours').innerHTML = doc.data().application.assessment.hours
		document.getElementById('pia-school').innerHTML = doc.data().school
		document.getElementById('pia-courses').innerHTML = doc.data().application.assessment.courses
		document.getElementById('pia-experience').innerHTML = doc.data().application.assessment.experience
		document.getElementById('pia-qualities').innerHTML = doc.data().application.assessment.qualities
		document.getElementById('pia-why').innerHTML = doc.data().application.assessment.whyTutor
		document.getElementById('pia-groups').innerHTML = doc.data().application.assessment.groups
		
		//Assign points fields
		var yearPoints = document.getElementById('year-points')
		yearPoints.placeholder = doc.data().application.assessment.yearPoints
		yearPoints.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.assessment.yearPoints" : yearPoints.value } )
		}
		
		var experiencePoints = document.getElementById('experience-points')
		experiencePoints.placeholder = doc.data().application.assessment.experiencePoints
		experiencePoints.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.assessment.experiencePoints" : experiencePoints.value } )
		}
		var qualitiesPoints = document.getElementById('qualities-points')
		qualitiesPoints.placeholder = doc.data().application.assessment.qualitiesPoints
		qualitiesPoints.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.assessment.qualitiesPoints" : qualitiesPoints.value } )
		}
		var whyTutorPoints = document.getElementById('why-tutor-points')
		whyTutorPoints.placeholder = doc.data().application.assessment.whyTutorPoints
		whyTutorPoints.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.assessment.whyTutorPoints" : whyTutorPoints.value } )
		}
		var activitiesPoints = document.getElementById('activities-points')
		activitiesPoints.placeholder = doc.data().application.assessment.activitiesPoints
		activitiesPoints.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.assessment.activitiesPoints" : activitiesPoints.value } )
		}
		
	})
}

function getAssessmentPoints(applicantsID) {
	var userDB = firebase.firestore()
	userDB.collection("users").doc(applicantsID).get().then(function(doc) {
		var yearPoints = doc.data().application.assessment.yearPoints
		var experiencePoints = doc.data().application.assessment.experiencePoints
		var qualitiesPoints = doc.data().application.assessment.qualitiesPoints
		var whyTutorPoints = doc.data().application.assessment.whyTutorPoints
		var activitiesPoints = doc.data().application.assessment.activitiesPoints
		
		var assessmentPoints = parseInt(yearPoints) + parseInt(experiencePoints) + parseInt(qualitiesPoints) + parseInt(whyTutorPoints) + parseInt(activitiesPoints)
		userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.assessment.assessmentPoints" : assessmentPoints } )
	})
}

function showTranscript(applicantsID) {
	var userDB = firebase.firestore()
	userDB.collection("users").doc(applicantsID).get().then(function(doc) {
		window.open(doc.data().application.transcriptFile)
	})
}

function showFaculty(applicantsID) {
	var userDB = firebase.firestore()
	userDB.collection("users").doc(applicantsID).get().then(function(doc) {
		var facultyLink = doc.data().application.facultyFile
		window.open(facultyLink)
	})
}

function grantTutorPrivileges(applicantsID, applicantsEmail) {
	var userDB = firebase.firestore()
	userDB.collection("users").doc(applicantsID).get().then(function(doc) {
		console.log(doc.data().tutorApplicant)
		console.log(doc.data().tutorApplicationApproved)
		
		userDB.collection("users")
		.doc(applicantsID)
		.update( {'tutorApplicant' : !doc.data().tutorApplicant,
		  	  'tutorApplicationApproved' : !doc.data().tutorApplicationApproved } )
		
		if(!doc.data().tutorApplicationApproved) {
			var acceptanceMessage = "Your application to tutor has been approved. Your tutor coordinator will reach out soon with more information."
			sendEmailTo(applicantsEmail, 'Welcome to TutorTree!', acceptanceMessage)
		} else {
			var declinedMessage = "Unfortunately at this time your application to tutor has been declined. Your tutor coordinator will reach out soon with more information."
			sendEmailTo(applicantsEmail, 'Tutor Application Status', declinedMessage)
		}
	})
	
}


//Sort applicants by date applied
function sortNumberApplicant(a,b) {
	return(a-b)
}

var applicantArray = []
function updateApplicantArray(timestamp) {
		applicantArray.push(timestamp)
    applicantArray.sort(sortNumberApplicant)
}

function appendToApplicantArea() {
    var items = applicantArray.length
    var applicantSection = document.getElementById('applicant-section')
    
    for( i=0 ; i < items ; i++ ) {
    	var timestampID = applicantArray[i]
    	var applicantBlock = document.getElementById(timestampID)
        applicantSection.appendChild(applicantBlock)
    }
}

var completedApplicantArray = []
function updateCompletedApplicantArray(timestamp) {
		completedApplicantArray.push(timestamp)
    completedApplicantArray.sort(sortNumberApplicant)
}

function appendToCompletedApplicantArea() {
	var items = completedApplicantArray.length
	var completedApplicantSection = document.getElementById('completed-applicant-section')

	for( i=0 ; i < items ; i++ ) {
		var timestampID = completedApplicantArray[i]
		var applicantBlock = document.getElementById(timestampID)
		completedApplicantSection.appendChild(applicantBlock)
	}
}

function sendEmailTo(email, title, message) {
	var xhttp = new XMLHttpRequest();
    	var herokuURL = "https://tutortree-development.herokuapp.com/sendEmailTo/"+email+"/"+title+"/"+message
   	console.log(herokuURL)
	xhttp.open("GET", herokuURL, true);
	xhttp.send();
}



