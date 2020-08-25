
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var userDB = firebase.firestore()
		var userID = user.uid
		
		//Check if user is admin, else redirect: TODO
		
		//Get tab buttons
		var rejectedButton = document.getElementById('rejected-button')
		var pendingButton = document.getElementById('pending-button')
		var acceptedButton = document.getElementById('accepted-button')

		//Set eventlisteners
		rejectedButton.setAttribute('onClick', 'showRejectedApplicants()')
		pendingButton.setAttribute('onClick', 'showPendingApplicants()')
		acceptedButton.setAttribute('onClick', 'showAcceptedApplicants()')
		
		//Get all applicant information and build blocks
		var applicantArea = document.getElementById('applicant-section')

		userDB.collection("userTest").where("tutorApplicantStatus", "in", ["rejected", "pending", "accepted"]).onSnapshot(function(allTutors) {
			//Reinitialize arrays on status update
			rejectedApplicantArray = []
			pendingApplicantArray = []
			acceptedApplicantArray = []
			
			//remove all children when updated
			while(rejectedTutorSection.firstChild) {
				rejectedTutorSection.removeChild(rejectedTutorSection.firstChild)
			}
			while(pendingTutorSection.firstChild) {
				pendingTutorSection.removeChild(pendingTutorSection.firstChild)
			}
			while(acceptedTutorSection.firstChild) {
				acceptedTutorSection.removeChild(acceptedTutorSection.firstChild)
			}
			
			allTutors.forEach(function(doc)  {

				var applicantID = doc.id,
				    email = doc.data().email,
				    school = doc.data().school,
				    status = doc.data().tutorApplicantStatus
				console.log(status)
				userDB.collection("userTest").doc(applicantID).collection("tutorApplication").doc("application").onSnapshot(async function(applicant) {
					var 	didSubmitPreInterview = applicant.data().didSubmitPreInterview,
						didRequest = applicant.data().didRequestInterview,
						completedInterview = applicant.data().completedInterview,
						didTranscript = applicant.data().uploadedTranscript,
						didFaculty = applicant.data().uploadedFaculty,
						assessmentScore = applicant.data().assessmentScore,
						interviewScore = applicant.data().interviewScore,
						meghanNotes = applicant.data().meghanNotes,
					    	timeApplied = applicant.data().timeSubmitted,
					    	firstName = applicant.data().firstName,
					    	lastName = applicant.data().lastName



					await buildApplicantBlock(applicantID, 
					firstName,
					lastName,
					email, 
					school,
					timeApplied, 
					didSubmitPreInterview, 
					didRequest, 
					completedInterview,
					didTranscript, 
					didFaculty,
					assessmentScore,
					interviewScore,
					meghanNotes,
					status)
				})

			})
		})
	} else {
		location.href = "https://www.jointutortree.com"
	}
})
var rejectedTutorSection = document.getElementById('rejected-applicant-section')
function showRejectedApplicants() {
	while(rejectedTutorSection.firstChild) {
		rejectedTutorSection.removeChild(rejectedTutorSection.firstChild)
	}
	appendToRejectedSection()

}

var pendingTutorSection = document.getElementById('pending-applicant-section')
function showPendingApplicants() {
	while(pendingTutorSection.firstChild) {
		pendingTutorSection.removeChild(pendingTutorSection.firstChild)
	}
	appendToPendingSection()

}

var acceptedTutorSection = document.getElementById('accepted-applicant-section')
function showAcceptedApplicants() {
	while(acceptedTutorSection.firstChild) {
		acceptedTutorSection.removeChild(acceptedTutorSection.firstChild)
	}
	appendToAcceptedSection()
}

function buildApplicantBlock(applicantID, firstName, lastName, email, school, timeApplied, didSubmitPreInterview, didRequest, completedInterview, didTranscript, didFaculty, assessmentScore, interviewScore, meghanNotes, status) {
	console.log("Building block for user: " + applicantID)
	console.log("timestamp is : " + timeApplied)
	//Main Container
	var applicantBlock = document.createElement("div")
	applicantBlock.setAttribute('class', 'applicant-block')
	applicantBlock.setAttribute('id', timeApplied)

	//Name Block
	var nameBlock = document.createElement('div')
	nameBlock.setAttribute('class', 'name-block')

	var nameHeader = document.createElement('h4')
	nameHeader.setAttribute('class', 'applicants-name')
	nameHeader.innerHTML = firstName + " " + lastName
	nameBlock.appendChild(nameHeader)

	var emailHeader = document.createElement('div')
	emailHeader.setAttribute('class', 'applicants-email')
	emailHeader.innerHTML = email
	nameBlock.appendChild(emailHeader)
	
	var schoolNameHeader = document.createElement('div')
	schoolNameHeader.setAttribute('class', 'applicants-school')
	schoolNameHeader.innerHTML = school
	nameBlock.appendChild(schoolNameHeader)	

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

	if (didSubmitPreInterview) {
		var assessmentCompleted = document.createElement('div')
		assessmentCompleted.setAttribute('class', 'admin-complete')
		assessmentCompleted.innerHTML = 'check-circle'
		preInterviewBlock.appendChild(assessmentCompleted)
		preInterviewBlock.setAttribute('onClick', 'showAssessment("' + applicantID + '", "' + name +'")')
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
		requestedBlock.setAttribute('onClick', 'showInterview("' + applicantID + '", "' + name +'")')
	} else {
		var requestIncomplete = document.createElement('div')
		requestIncomplete.setAttribute('class', 'admin-incomplete')
		requestIncomplete.innerHTML = 'circle'
		requestedBlock.appendChild(requestIncomplete)
	}

	applicantBlock.appendChild(requestedBlock)

	//Completed interview Block
	var completedInterviewBlock = document.createElement('div')
	completedInterviewBlock.setAttribute('class', 'requested-block')

	var completedInterviewHeader = document.createElement('h4')
	completedInterviewHeader.setAttribute('class', 'applicant-header')
	completedInterviewHeader.innerHTML = "Completed Interview"
	completedInterviewBlock.appendChild(completedInterviewHeader)

	if (completedInterview) {
		var interviewCompleted = document.createElement('div')
		interviewCompleted.setAttribute('class', 'admin-complete')
		interviewCompleted.innerHTML = 'check-circle'
		completedInterviewBlock.appendChild(interviewCompleted)
		completedInterviewBlock.setAttribute('onClick', 'reverseInterviewCompleted("'+applicantID+'", "'+email+'")')		
	} else {
		var interviewIncomplete = document.createElement('div')
		interviewIncomplete.setAttribute('class', 'admin-incomplete')
		interviewIncomplete.innerHTML = 'circle'
		completedInterviewBlock.appendChild(interviewIncomplete)
		completedInterviewBlock.setAttribute('onClick', 'interviewCompleted("'+applicantID+'", "'+email+'")')		
	}
	

	applicantBlock.appendChild(completedInterviewBlock)	

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
	
	var facultyAdminParent = document.createElement('div')
	facultyAdminParent.setAttribute('class', 'faculty-admin-parent')

	var facultyAdminBlock = document.createElement('div')
	facultyAdminBlock.setAttribute('class', 'faculty-admin-block')
	facultyAdminBlock.setAttribute('onClick', 'openFacultyRecDialog("'+applicantID+'")')
	facultyAdminParent.appendChild(facultyAdminBlock)

	var facultyAdminHeader = document.createElement('h4')
	facultyAdminHeader.setAttribute('class', 'applicant-header')
	facultyAdminHeader.innerHTML = "Upload Rec"
	facultyAdminBlock.appendChild(facultyAdminHeader)

	var facultyAdminPreviewBlock = document.createElement('div')
	facultyAdminPreviewBlock.setAttribute('class', 'faculty-admin-preview-block')
	facultyAdminPreviewBlock.setAttribute('id',  applicantID )
	facultyAdminParent.appendChild(facultyAdminPreviewBlock)

	var facultyAdminFilePreview = document.createElement('div')
	facultyAdminFilePreview.setAttribute('class', 'faculty-admin-file-preview')
	facultyAdminFilePreview.setAttribute('id', applicantID + '-text')
	facultyAdminFilePreview.innerHTML = "file preview.png"
	facultyAdminPreviewBlock.appendChild(facultyAdminFilePreview)

	var submitFacultyAdminButton = document.createElement('div')
	submitFacultyAdminButton.setAttribute('class', 'submit-faculty-admin-block')
	submitFacultyAdminButton.innerHTML = 'Submit'
	submitFacultyAdminButton.setAttribute('onClick','handleFacultyRecUpload("'+applicantID+'","'+email+'")')
	facultyAdminPreviewBlock.appendChild(submitFacultyAdminButton)
	
	var facultyRecSuccessfullyUploadedMessage = document.createElement('div')
	facultyRecSuccessfullyUploadedMessage.setAttribute('class', 'faculty-rec-successfully-uploaded')
	facultyRecSuccessfullyUploadedMessage.setAttribute('id', applicantID + '-upload-completed')
	facultyRecSuccessfullyUploadedMessage.innerHTML = 'Successfully Uploaded!'
	facultyAdminParent.appendChild(facultyRecSuccessfullyUploadedMessage)

	applicantBlock.appendChild(facultyAdminParent)


	//Score Blocks
	var userDB = firebase.firestore()

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
	piaScoreField.readOnly = true
	piaScoreField.setAttribute('class', 'pia-score')
	piaScoreField.placeholder = assessmentScore
	piaScoreContainer.appendChild(piaScoreField)

	var interviewScoreContainer = document.createElement('div')
	interviewScoreContainer.setAttribute('class', 'interview-score-container')
	individualScores.appendChild(interviewScoreContainer)
	var interviewScoreHeader = document.createElement('div')
	interviewScoreHeader.setAttribute('class', 'pia-score-header')
	interviewScoreHeader.innerHTML = 'Interview:'
	interviewScoreContainer.appendChild(interviewScoreHeader)

	var interviewScoreField = document.createElement('input')
	interviewScoreField.readOnly = true
	interviewScoreField.setAttribute('class', 'interview-score-field')
	interviewScoreField.placeholder = interviewScore
	interviewScoreContainer.appendChild(interviewScoreField)

	applicantBlock.appendChild(formContainer)
	
	
	var noteContainer = document.createElement('form')
	noteContainer.setAttribute('class', 'notes-form')
	
	var notesHeader = document.createElement('div')
	notesHeader.setAttribute('class', 'notes-header')
	notesHeader.innerHTML = "Notes:"
	noteContainer.appendChild(notesHeader)
	
	var notesField = document.createElement('input')
	notesField.setAttribute('class', 'notes')
	notesField.value = meghanNotes
	noteContainer.appendChild(notesField)
	
	notesField.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("application")
			.update( { "meghanNotes" : notesField.value } )
	}
	
	applicantBlock.appendChild(noteContainer)
	
	//Approve/Reject/Delete tutor buttons
	var tutorPermissionsBlock = document.createElement('div')
	tutorPermissionsBlock.setAttribute('class', 'tutor-permissions-block')
	
	var approveTutorButton = document.createElement('div')
	approveTutorButton.setAttribute('class', 'approve-tutor-button')
	approveTutorButton.innerHTML = 'Approve'
	approveTutorButton.setAttribute('onclick', 'approveTutor("'+applicantID+'","'+email+'")')
	
	var rejectTutorButton = document.createElement('div')
	rejectTutorButton.setAttribute('class', 'reject-tutor-button')
	rejectTutorButton.innerHTML = 'Reject'
	rejectTutorButton.setAttribute('onclick', 'rejectTutor("'+applicantID+'","'+email+'")')
	
	var deleteTutorButton = document.createElement('div')
	deleteTutorButton.setAttribute('class', 'delete-tutor-button')
	deleteTutorButton.innerHTML = 'DELETE'
	deleteTutorButton.setAttribute('onclick', 'deleteTutor("'+applicantID+'")')
	
	applicantBlock.appendChild(tutorPermissionsBlock)
	if (status == "rejected") {
		console.log("status is rejected")
		updateRejectedArray(timeApplied)
		tutorPermissionsBlock.appendChild(approveTutorButton)
		tutorPermissionsBlock.appendChild(deleteTutorButton)

	} else if (status == "pending"){
		console.log("status is pending")
		updatePendingArray(timeApplied)
		tutorPermissionsBlock.appendChild(rejectTutorButton)
		tutorPermissionsBlock.appendChild(approveTutorButton)
		tutorPermissionsBlock.appendChild(deleteTutorButton)

	} else if (status == "accepted") {
		console.log("status is accepted")
		updateAcceptedArray(timeApplied)
		tutorPermissionsBlock.appendChild(rejectTutorButton)
		tutorPermissionsBlock.appendChild(deleteTutorButton)

	}
	//Append to hidden section for sorting and appending in top level forEach
	document.getElementById('hidden-applicant-section').appendChild(applicantBlock)
}

function approveTutor(applicantsID, applicantsEmail) {
	var userDB = firebase.firestore()
	//Update sorting field
	//Update iOS value isTutor
	userDB.collection("userTest")
		.doc(applicantsID)
		.update( {'tutorApplicantStatus' : "accepted",
			  'isTutor' : true})
	//Send Email
	var acceptanceMessage = "Your application to tutor has been approved! Your tutor coordinator will reach out soon with more information."
	sendEmailTo(applicantsEmail, 'Welcome to TutorTree!', acceptanceMessage)

	//Mixpanel?
	grantedTutorAccess(true, applicantsEmail)
	
}
								
function rejectTutor(applicantsID, applicantsEmail) {
	var userDB = firebase.firestore()
	//Update sorting field
	//Update iOS value isTutor
	userDB.collection("userTest")
		.doc(applicantsID)
		.update( {'tutorApplicantStatus' : "rejected",
			  'isTutor' : false})
	//Send Email
	var acceptanceMessage = "Unfortunately at this time we were unable to offer you a position as a tutor. Your tutor coordinator will reach out soon with more information."
	sendEmailTo(applicantsEmail, 'Tutor Application Status', acceptanceMessage)	  
}
								
function deleteTutor(applicantsID, applicantsEmail) {
	var userDB = firebase.firestore()
	//Update sorting field
	//Update iOS value isTutor
	userDB.collection("userTest")
		.doc(applicantsID)
		.update( {'tutorApplicantStatus' : "deleted",
			  'isTutor' : false})			  	
}																

function showAssessment(applicantsID, name) {
	document.getElementById("assessment-wrapper").style.display = 'flex'
	
	var tutorPIANameHeader = document.getElementById('pia-tutor-prospect-name')
	tutorPIANameHeader.innerHTML = name
	
	var userDB = firebase.firestore()
	userDB.collection("userTest").doc(applicantsID).get().then(function(doc) {
		document.getElementById('pia-email').innerHTML = doc.data().email
	})
	userDB.collection("userTest").doc(applicantsID).collection("tutorApplication").doc("application").get().then(function(doc) {
		document.getElementById('pia-school').innerHTML = doc.data().school
		document.getElementById('pia-first').innerHTML = doc.data().firstName
		document.getElementById('pia-last').innerHTML = doc.data().lastName
	})
	userDB.collection("userTest").doc(applicantsID).collection("tutorApplication").doc("assessment").get().then(function(doc) {
		//Fields
		document.getElementById('pia-year').innerHTML = doc.data().assessmentFields.year
		document.getElementById('pia-major').innerHTML = doc.data().assessmentFields.major
		document.getElementById('pia-hours').innerHTML = doc.data().assessmentFields.hours
		document.getElementById('pia-courses').innerHTML = doc.data().assessmentFields.courses
		document.getElementById('pia-experience').innerHTML = doc.data().assessmentFields.experience
		document.getElementById('pia-qualities').innerHTML = doc.data().assessmentFields.qualities
		document.getElementById('pia-why').innerHTML = doc.data().assessmentFields.whyTutor
		document.getElementById('pia-groups').innerHTML = doc.data().assessmentFields.groups
		
		//Assign points fields
		var yearPoints = document.getElementById('year-points')
		yearPoints.value = doc.data().assessmentScores.yearPoints
		yearPoints.onblur = async function() {
			await userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("assessment")
				.update( { "assessmentScores.yearPoints" : yearPoints.value } )
			getAssessmentPoints(applicantsID)
		}
		
		var experiencePoints = document.getElementById('experience-points')
		experiencePoints.value = doc.data().assessmentScores.experiencePoints
		experiencePoints.onblur = async function() {
			await userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("assessment")
				.update( { "assessmentScores.experiencePoints" : experiencePoints.value } )
			getAssessmentPoints(applicantsID)
		}
		var qualitiesPoints = document.getElementById('qualities-points')
		qualitiesPoints.value = doc.data().assessmentScores.qualitiesPoints
		qualitiesPoints.onblur = async function() {
			await userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("assessment")
				.update( { "assessmentScores.qualitiesPoints" : qualitiesPoints.value } )
			getAssessmentPoints(applicantsID)
		}
		var whyTutorPoints = document.getElementById('why-tutor-points')
		whyTutorPoints.value = doc.data().assessmentScores.whyTutorPoints
		whyTutorPoints.onblur = async function() {
			await userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("assessment")
				.update( { "assessmentScores.whyTutorPoints" : whyTutorPoints.value } )
			getAssessmentPoints(applicantsID)
		}
		var activitiesPoints = document.getElementById('activities-points')
		activitiesPoints.value = doc.data().assessmentScores.activitiesPoints
		activitiesPoints.onblur = async function() {
			await userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("assessment")
				.update( { "assessmentScores.activitiesPoints" : activitiesPoints.value } )
			getAssessmentPoints(applicantsID)
		}
	})
}

function showInterview(applicantsID, name) {
	document.getElementById("interview-wrapper").style.display = 'flex'
	
	var tutorInterviewNameHeader = document.getElementById('interview-tutor-prospect-name')
	tutorInterviewNameHeader.innerHTML = name 	

	var userDB = firebase.firestore()
	userDB.collection("userTest").doc(applicantsID).collection("tutorApplication").doc("interview").get().then(function(doc) {
		//Notes fields
		var onTimeNotes = document.getElementById('on-time-notes')
		onTimeNotes.value = doc.data().interviewNotes.onTimeNotes
		onTimeNotes.onblur = function() {
			userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewNotes.onTimeNotes" : onTimeNotes.value } )
		}
		
		var challengingNotes = document.getElementById('challenging-notes')
		challengingNotes.value = doc.data().interviewNotes.challengingNotes
		challengingNotes.onblur = function() {
			userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewNotes.challengingNotes" : challengingNotes.value } )
		}
		
		var troubleNotes = document.getElementById('trouble-notes')
		troubleNotes.value = doc.data().interviewNotes.troubleNotes
		troubleNotes.onblur = function() {
			userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewNotes.troubleNotes" : troubleNotes.value } )
		}
		
		var situationNotes = document.getElementById('situation-notes')
		situationNotes.value = doc.data().interviewNotes.situationNotes
		situationNotes.onblur = function() {
			userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewNotes.situationNotes" : situationNotes.value } )
		}
		var confidenceNotes = document.getElementById('confidence-notes')
		confidenceNotes.value = doc.data().interviewNotes.confidenceNotes
		confidenceNotes.onblur = function() {
			userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewNotes.confidenceNotes" : confidenceNotes.value } )
		}
		var preparedNotes = document.getElementById('prepared-notes')
		preparedNotes.value = doc.data().interviewNotes.preparedNotes
		preparedNotes.onblur = function() {
			userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewNotes.preparedNotes" : preparedNotes.value } )
		}
		var explainNotes = document.getElementById('explain-notes')
		explainNotes.value = doc.data().interviewNotes.explainNotes
		explainNotes.onblur = function() {
			userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewNotes.explainNotes" : explainNotes.value } )
		}
		var onlineNotes = document.getElementById('online-notes')
		onlineNotes.value = doc.data().interviewNotes.onlineNotes
		onlineNotes.onblur = function() {
			userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewNotes.onlineNotes" : onlineNotes.value } )
		}
		var helpNotes = document.getElementById('help-notes')
		helpNotes.value = doc.data().interviewNotes.helpNotes
		helpNotes.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewNotes.helpNotes" : helpNotes.value } )
		}
		var questionNotes = document.getElementById('question-notes')
		questionNotes.value = doc.data().interviewNotes.questionNotes
		questionNotes.onblur = function() {
			userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewNotes.questionNotes" : questionNotes.value } )
		}
		
		//Score Fields
		var onTimeScore = document.getElementById('on-time-score')
		onTimeScore.value = doc.data().interviewScores.onTimeScore
		onTimeScore.value = 0
		onTimeScore.onblur = async function() {
			await userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.onTimeScore" : onTimeScore.value } )
			getInterviewPoints(applicantsID)
		}
		var challengingScore = document.getElementById('challenging-score')
		challengingScore.value = doc.data().interviewScores.challengingScore
		challengingScore.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.challengingScore" : challengingScore.value } )
			getInterviewPoints(applicantsID)
		}
		var troubleScore = document.getElementById('trouble-score')
		troubleScore.value = doc.data().interviewScores.troubleScore
		troubleScore.onblur = async function() {
			await userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.troubleScore" : troubleScore.value } )
			getInterviewPoints(applicantsID)
		}
		var situationScore = document.getElementById('situation-score')
		situationScore.value = doc.data().interviewScores.situationScore
		situationScore.onblur = async function() {
			await userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.situationScore" : situationScore.value } )
			getInterviewPoints(applicantsID)
		}
		var confidenceScore = document.getElementById('confidence-score')
		confidenceScore.value = doc.data().interviewScores.confidenceScore
		confidenceScore.onblur = async function() {
			await userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.confidenceScore" : confidenceScore.value } )
			getInterviewPoints(applicantsID)
		}
		var preparedScore = document.getElementById('prepared-score')
		preparedScore.value = doc.data().interviewScores.preparedScore
		preparedScore.onblur = async function() {
			await userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.preparedScore" : preparedScore.value } )
			getInterviewPoints(applicantsID)
		}	
		var explainScore = document.getElementById('explain-score')
		explainScore.value = doc.data().interviewScores.explainScore
		explainScore.onblur = async function() {
			await userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.explainScore" : explainScore.value } )
			getInterviewPoints(applicantsID)
		}
		var onlineScore = document.getElementById('online-score')
		onlineScore.value = doc.data().interviewScores.onlineScore
		onlineScore.value = 0
		onlineScore.onblur = async function() {
			await userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.onlineScore" : onlineScore.value } )
			getInterviewPoints(applicantsID)
		}
		var helpScore = document.getElementById('help-score')
		helpScore.value = doc.data().interviewScores.helpScore
		helpScore.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.helpScore" : helpScore.value } )
			getInterviewPoints(applicantsID)
		}
		var questionScore = document.getElementById('question-score')
		questionScore.value = doc.data().interviewScores.questionScore
		questionScore.onblur = async function() {
			await userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.questionScore" : questionScore.value } )
			getInterviewPoints(applicantsID)
		}

	})
}

function getAssessmentPoints(applicantsID) {
	var userDB = firebase.firestore()
	userDB.collection("userTest").doc(applicantsID).collection("tutorApplication").doc("assessment").get().then(function(doc) {
		var yearPoints = doc.data().assessmentScores.yearPoints
		var experiencePoints = doc.data().assessmentScores.experiencePoints
		var qualitiesPoints = doc.data().assessmentScores.qualitiesPoints
		var whyTutorPoints = doc.data().assessmentScores.whyTutorPoints
		var activitiesPoints = doc.data().assessmentScores.activitiesPoints
		
		var assessmentPoints = parseInt(yearPoints) + 
		    parseInt(experiencePoints) + 
		    parseInt(qualitiesPoints) + 
		    parseInt(whyTutorPoints) + 
		    parseInt(activitiesPoints)
		userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "assessmentScore" : assessmentPoints } )
	})
}

function getInterviewPoints(applicantsID) {
	var userDB = firebase.firestore()
	userDB.collection("userTest").doc(applicantsID).collection("tutorApplication").doc("interview").get().then(function(doc) {
		var onTimeScore = doc.data().interviewScores.onTimeScore
		var challengingScore = doc.data().interviewScores.challengingScore
		var troubleScore = doc.data().interviewScores.troubleScore
		var situationScore = doc.data().interviewScores.situationScore
		var confidenceScore = doc.data().interviewScores.confidenceScore
		var preparedScore = doc.data().interviewScores.preparedScore
		var explainScore = doc.data().interviewScores.explainScore
		var onlineScore = doc.data().interviewScores.onlineScore
		var helpScore = doc.data().interviewScores.helpScore
		var questionScore = doc.data().interviewScores.questionScore

		var interviewScore = 
			parseInt(onTimeScore) + 
			parseInt(challengingScore) + 
			parseInt(troubleScore) + 
			parseInt(situationScore) + 
			parseInt(confidenceScore) + 
			parseInt(preparedScore) + 
			parseInt(explainScore) + 
			parseInt(onlineScore) + 
			parseInt(helpScore) +
			parseInt(questionScore)
		
		userDB.collection("userTest")
				.doc(applicantsID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScore" : interviewScore } )
	})

}

function showTranscript(applicantsID) {
	var userDB = firebase.firestore()
	userDB.collection("userTest").doc(applicantsID).collection("tutorApplication").doc("application").get().then(function(doc) {
		window.open(doc.data().transcriptFile)
	})
}

function showFaculty(applicantsID) {
	var userDB = firebase.firestore()
	userDB.collection("userTest").doc(applicantsID).collection("tutorApplication").doc("application").get().then(function(doc) {
		var facultyLink = doc.data().facultyFile
		window.open(facultyLink)
	})
}

//SORT AND APPEND APPLICANTS
function sortNumberApplicant(a,b) {
	return(a-b)
}

//Rjected Applicants
var rejectedApplicantArray = []
function updateRejectedArray(timestamp) {
	rejectedApplicantArray.push(timestamp)
	rejectedApplicantArray.sort(sortNumberApplicant)
}

function appendToRejectedSection() {
	console.log("rejected applicants: " + rejectedApplicantArray)
	var items = rejectedApplicantArray.length
	var rejectedTutorSection = document.getElementById('rejected-applicant-section')
    
	for( i=0 ; i < items ; i++ ) {
		var timestampID = rejectedApplicantArray[i]
		var rejectedApplicantBlock = document.getElementById(timestampID)
		var blockClone = rejectedApplicantBlock.cloneNode(true)
		rejectedTutorSection.appendChild(blockClone)
	}
}

//Pending Applicants
var pendingApplicantArray = []
function updatePendingArray(timestamp) {
	pendingApplicantArray.push(timestamp)
    	pendingApplicantArray.sort(sortNumberApplicant)
}

function appendToPendingSection() {
	console.log("pending applicants: " + pendingApplicantArray)
	var items = pendingApplicantArray.length
	var pendingTutorSection = document.getElementById('pending-applicant-section')

	for( i=0 ; i < items ; i++ ) {
		var timestampID = pendingApplicantArray[i]
		var pendingApplicantBlock = document.getElementById(timestampID)
		var blockClone = pendingApplicantBlock.cloneNode(true)
		pendingTutorSection.appendChild(blockClone)
	}
}

//Accepted Applicants
var acceptedApplicantArray = []
function updateAcceptedArray(timestamp) {
	acceptedApplicantArray.push(timestamp)
	acceptedApplicantArray.sort(sortNumberApplicant)
}

function appendToAcceptedSection() {
	console.log("accepted applicants: " + acceptedApplicantArray)
	var items = acceptedApplicantArray.length
	var acceptedTutorSection = document.getElementById('accepted-applicant-section')

	for( i=0 ; i < items ; i++ ) {
		var timestampID = acceptedApplicantArray[i]
		var acceptedApplicantBlock = document.getElementById(timestampID)
		var blockClone = acceptedApplicantBlock.cloneNode(true)
		acceptedTutorSection.appendChild(blockClone)
	}
}

function sendEmailTo(email, title, message) {
	var xhttp = new XMLHttpRequest();
    	var herokuURL = "https://tutortree2.herokuapp.com/sendEmailTo/"+email+"/"+title+"/"+message
   	console.log(herokuURL)
	xhttp.open("GET", herokuURL, true);
	xhttp.send();
}

var userDB = firebase.firestore()
storageRef = storageService.ref()

var globalPreviewID = ""
function openFacultyRecDialog(ID) {
	console.log("this is the id: " + ID)
	globalPreviewID = ID
	console.log("this is the global: " +globalPreviewID)
	hiddenFacultyRecButton.click();
}

var hiddenFacultyRecButton = document.getElementById("faculty-admin-select") 
hiddenFacultyRecButton.addEventListener('change', handleFacultyRecUploadChange);

var selectedFacultyRecFile;
function handleFacultyRecUploadChange(e) {
	selectedFacultyRecFile = e.target.files[0];
	document.getElementById(globalPreviewID).style.display = "flex"
	document.getElementById(globalPreviewID+"-text").innerHTML = selectedFacultyRecFile.name
}


async function handleFacultyRecUpload(ID, email) {
	console.log("I was clicked")
	const uploadTask = await storageRef.child(`faculty/${selectedFacultyRecFile.name}`).put(selectedFacultyRecFile);
	uploadAndUpdateFirebaseFacultyRec(ID, email)
}


//final submit button and update firebase
async function uploadAndUpdateFirebaseFacultyRec(ID, email) {
	var facultyRecFileURL = ""
	await storageRef.child('/faculty/'+selectedFacultyRecFile.name)
		.getDownloadURL()
		.then(function(url) { facultyRecFileURL = url.toString() })
	userDB.collection("userTest")
		.doc(ID)
		.collection("tutorApplication")
		.doc("application")
		.update( {"facultyFile" : facultyRecFileURL,
			"uploadedFaculty" : true })
	.then(function() {
		document.getElementById(globalPreviewID).style.display = "none"
		document.getElementById(ID + '-upload-completed').style.display = "block"
		facultyRecUploadByTutorCoordinator(email)
	})
}
