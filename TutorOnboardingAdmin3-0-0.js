 firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var userDB = firebase.firestore()
		var userID = user.uid

		
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
				    school = doc.data().school,
				    timeApplied = doc.data().timeCreated,
				    didSubmitPreInterview = doc.data().application.didSubmitPreInterview,
				    didRequest = doc.data().application.didRequestInterview,
				    completedInterview = doc.data().application.completedInterview,
				    didTranscript = doc.data().application.uploadedTranscript,
				    didFaculty = doc.data().application.uploadedFaculty,
				    assessmentScore = doc.data().application.assessmentScore,
				    interviewScore = doc.data().application.interviewScore,
				    completed = false,
				    meghanNotes = doc.data().application.meghanNotes,
				    isFirstApproved = doc.data().application.isFirstApproved,
				    isWaitListed = doc.data().application.isWaitListed,
				    isRejected = doc.data().application.isRejected
				buildApplicantBlock(applicantID, 
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
						    completed,
						    assessmentScore,
						    interviewScore,
						    meghanNotes,
						    isFirstApproved,
						    isWaitListed,
						    isRejected)
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
				    school = doc.data().school,				    
				    timeApplied = doc.data().timeCreated,
				    didSubmitPreInterview = doc.data().application.didSubmitPreInterview,
				    didRequest = doc.data().application.didRequestInterview,
				    completedInterview = doc.data().application.completedInterview,
				    didTranscript = doc.data().application.uploadedTranscript,
				    didFaculty = doc.data().application.uploadedFaculty,
				    assessmentScore = doc.data().application.assessmentScore,
				    interviewScore = doc.data().application.interviewScore,
				    completed = true,
				    meghanNotes = doc.data().application.meghanNotes,
				    isFirstApproved = doc.data().application.isFirstApproved,
				    isWaitListed = doc.data().application.isWaitListed,
				    isRejected = doc.data().application.isRejected
				buildApplicantBlock(applicantID, 
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
						    completed,
						    assessmentScore,
						    interviewScore,
						    meghanNotes,
						    isFirstApproved,
						    isWaitListed,
						    isRejected)
			})
			appendToCompletedApplicantArea()
		})
	} else {
		location.href = "https://www.jointutortree.com"
	}
})

function buildApplicantBlock(applicantID, firstName, lastName, email, school, timeApplied, didSubmitPreInterview, didRequest, completedInterview, didTranscript, didFaculty, completed, assessmentScore, interviewScore, meghanNotes, isFirstApproved, isWaitListed, isRejected) {
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

	console.log(didSubmitPreInterview)

	if (didSubmitPreInterview) {
		var assessmentCompleted = document.createElement('div')
		assessmentCompleted.setAttribute('class', 'admin-complete')
		assessmentCompleted.innerHTML = 'check-circle'
		preInterviewBlock.appendChild(assessmentCompleted)
		preInterviewBlock.setAttribute('onClick', 'showAssessment("'+applicantID+'", "'+firstName+'", "'+lastName+'")')
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
		requestedBlock.setAttribute('onClick', 'showInterview("'+applicantID+'", "'+firstName+'", "'+lastName+'")')
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
	piaScoreField.readOnly = true
	piaScoreField.setAttribute('class', 'pia-score')
	piaScoreField.placeholder = assessmentScore
	/*
	piaScoreField.onblur = function() {
		userDB.collection("users")
			.doc(applicantID)
			.update( { "application.assessmentScore" : piaScoreField.value } )
	}
	*/
	
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
	/*
	interviewScoreField.onblur = function() {
		userDB.collection("users")
			.doc(applicantID)
			.update( { "application.interviewScore" : interviewScoreField.value } )
	}
	*/
		interviewScoreContainer.appendChild(interviewScoreField)

	applicantBlock.appendChild(formContainer)
	
	//Approved, wait-listed or rejected block
	var approveWaitListRejectedBlock = document.createElement('div')
	approveWaitListRejectedBlock.setAttribute('class', 'approve-wait-list-rejected-block')
	
	//approved block
	var approvedBlock = document.createElement('div')
	approvedBlock.setAttribute('class', 'approved-block')
	approveWaitListRejectedBlock.appendChild(approvedBlock)

	var approvedHeader = document.createElement('h5')
	approvedHeader.setAttribute('class', 'approved-tutor-header')
	approvedHeader.innerHTML = "Approved"
	approvedBlock.appendChild(approvedHeader)

	if (isFirstApproved) {
		var approvedTrue = document.createElement('div')
		approvedTrue.setAttribute('class', 'admin-complete')
		approvedTrue.innerHTML = 'check-circle'
		approvedBlock.appendChild(approvedTrue)
		approvedBlock.setAttribute('onClick', 'updateisFirstApprovedStatus("'+applicantID+'", "'+email+'", false)')
	} else {
		var approvedFalse = document.createElement('div')
		approvedFalse.setAttribute('class', 'admin-incomplete')
		approvedFalse.innerHTML = 'circle'
		approvedBlock.appendChild(approvedFalse)
		approvedBlock.setAttribute('onClick', 'updateisFirstApprovedStatus("'+applicantID+'", "'+email+'", true)')
	}

	//approveWaitListRejectedBlock.appendChild(approvedBlock)	
	
	//wait-list block
	var waitListBlock = document.createElement('div')
	waitListBlock.setAttribute('class', 'wait-list-block')
	approveWaitListRejectedBlock.appendChild(waitListBlock)

	var waitListHeader = document.createElement('h5')
	waitListHeader.setAttribute('class', 'wait-list-header')
	waitListHeader.innerHTML = "Wait List"
	waitListBlock.appendChild(waitListHeader)

	if (isWaitListed) {
		var waitListTrue = document.createElement('div')
		waitListTrue.setAttribute('class', 'admin-complete')
		waitListTrue.innerHTML = 'check-circle'
		waitListBlock.appendChild(waitListTrue)
		waitListBlock.setAttribute('onClick', 'updateisWaitListStatus("'+applicantID+'", "'+email+'", false)')
	} else {
		var waitListFalse = document.createElement('div')
		waitListFalse.setAttribute('class', 'admin-incomplete')
		waitListFalse.innerHTML = 'circle'
		waitListBlock.appendChild(waitListFalse)
		waitListBlock.setAttribute('onClick', 'updateisWaitListStatus("'+applicantID+'", "'+email+'", true)')		
	}
	
	//approveWaitListRejectedBlock.appendChild(waitListBlock)
	
	//rejected block
	var rejectedBlock = document.createElement('div')
	rejectedBlock.setAttribute('class', 'rejected-block')
	approveWaitListRejectedBlock.appendChild(rejectedBlock)

	var rejectedHeader = document.createElement('h5')
	rejectedHeader.setAttribute('class', 'rejected-header')
	rejectedHeader.innerHTML = "Rejected"
	rejectedBlock.appendChild(rejectedHeader)

	if (isRejected) {
		var rejectedTrue = document.createElement('div')
		rejectedTrue.setAttribute('class', 'admin-complete')
		rejectedTrue.innerHTML = 'check-circle'
		rejectedBlock.appendChild(rejectedTrue)
		rejectedBlock.setAttribute('onClick', 'updateisRejectedStatus("'+applicantID+'", "'+email+'", false)')
	} else {
		var rejectedFalse = document.createElement('div')
		rejectedFalse.setAttribute('class', 'admin-incomplete')
		rejectedFalse.innerHTML = 'circle'
		rejectedBlock.appendChild(rejectedFalse)
		rejectedBlock.setAttribute('onClick', 'updateisRejectedStatus("'+applicantID+'", "'+email+'", true)')		
	}
	//approveWaitListRejectedBlock.appendChild(rejectedBlock)	
	

	applicantBlock.appendChild(approveWaitListRejectedBlock)	

	
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
		userDB.collection("users")
			.doc(applicantID)
			.update( { "application.meghanNotes" : notesField.value } )
	}
	
	applicantBlock.appendChild(noteContainer)
	
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


function showAssessment(applicantsID, firstName, lastName) {
	document.getElementById("assessment-wrapper").style.display = 'flex'
	
	var tutorPIANameHeader = document.getElementById('pia-tutor-prospect-name')
	tutorPIANameHeader.innerHTML = firstName + ' ' + lastName
	
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
		yearPoints.value = doc.data().application.assessment.yearPoints
		yearPoints.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.assessment.yearPoints" : yearPoints.value } )
			getAssessmentPoints(applicantsID)
		}
		
		var experiencePoints = document.getElementById('experience-points')
		experiencePoints.value = doc.data().application.assessment.experiencePoints
		experiencePoints.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.assessment.experiencePoints" : experiencePoints.value } )
			getAssessmentPoints(applicantsID)
		}
		var qualitiesPoints = document.getElementById('qualities-points')
		qualitiesPoints.value = doc.data().application.assessment.qualitiesPoints
		qualitiesPoints.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.assessment.qualitiesPoints" : qualitiesPoints.value } )
			getAssessmentPoints(applicantsID)
		}
		var whyTutorPoints = document.getElementById('why-tutor-points')
		whyTutorPoints.value = doc.data().application.assessment.whyTutorPoints
		whyTutorPoints.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.assessment.whyTutorPoints" : whyTutorPoints.value } )
			getAssessmentPoints(applicantsID)
		}
		var activitiesPoints = document.getElementById('activities-points')
		activitiesPoints.value = doc.data().application.assessment.activitiesPoints
		activitiesPoints.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.assessment.activitiesPoints" : activitiesPoints.value } )
			getAssessmentPoints(applicantsID)
		}
		
	})
}

function showInterview(applicantsID, firstName, lastName) {
	document.getElementById("interview-wrapper").style.display = 'flex'
	
	var tutorInterviewNameHeader = document.getElementById('interview-tutor-prospect-name')
	tutorInterviewNameHeader.innerHTML = firstName + ' ' + lastName	

	var userDB = firebase.firestore()
	userDB.collection("users").doc(applicantsID).get().then(function(doc) {
		//Notes fields
		var onTimeNotes = document.getElementById('on-time-notes')
		try{
			onTimeNotes.value = doc.data().application.interview.onTimeNotes
		} catch {
			onTimeNotes.value = ""
		}
		onTimeNotes.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.onTimeNotes" : onTimeNotes.value } )
		}
		var challengingNotes = document.getElementById('challenging-notes')
		try{
			challengingNotes.value = doc.data().application.interview.challengingNotes
		} catch {
			challengingNotes.value = ""
		}
		challengingNotes.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.challengingNotes" : challengingNotes.value } )
		}
		var troubleNotes = document.getElementById('trouble-notes')
		try{
			troubleNotes.value = doc.data().application.interview.troubleNotes
		} catch {
			troubleNotes.value = ""
		}
		troubleNotes.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.troubleNotes" : troubleNotes.value } )
		}
		var situationNotes = document.getElementById('situation-notes')
		try{
			situationNotes.value = doc.data().application.interview.situationNotes
		} catch {
			situationNotes.value = ""
		}
		situationNotes.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.situationNotes" : situationNotes.value } )
		}
		var confidenceNotes = document.getElementById('confidence-notes')
		try{
			confidenceNotes.value = doc.data().application.interview.confidenceNotes
		} catch {
			confidenceNotes.value = ""
		}
		confidenceNotes.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.confidenceNotes" : confidenceNotes.value } )
		}
		var preparedNotes = document.getElementById('prepared-notes')
		try{
			preparedNotes.value = doc.data().application.interview.preparedNotes
		} catch {
			preparedNotes.value = ""
		}
		preparedNotes.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.preparedNotes" : preparedNotes.value } )
		}
		var explainNotes = document.getElementById('explain-notes')
		try{
			explainNotes.value = doc.data().application.interview.explainNotes
		} catch {
			explainNotes.value = ""
		}
		explainNotes.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.explainNotes" : explainNotes.value } )
		}
		var onlineNotes = document.getElementById('online-notes')
		try{
			onlineNotes.value = doc.data().application.interview.onlineNotes
		} catch {
			onlineNotes.value = ""
		}
		onlineNotes.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.onlineNotes" : onlineNotes.value } )
		}
		var helpNotes = document.getElementById('help-notes')
		try{
			helpNotes.value = doc.data().application.interview.helpNotes
		} catch {
			helpNotes.value = ""
		}
		helpNotes.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.helpNotes" : helpNotes.value } )
		}
		var questionNotes = document.getElementById('question-notes')
		try{
			questionNotes.value = doc.data().application.interview.questionNotes
		} catch {
			questionNotes.value = ""
		}
		questionNotes.onblur = function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.questionNotes" : questionNotes.value } )
		}
		
		//Score Fields
		var onTimeScore = document.getElementById('on-time-score')
		try{
			onTimeScore.value = doc.data().application.interview.onTimeScore
		} catch {
			onTimeScore.value = 0
		}
		onTimeScore.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.onTimeScore" : onTimeScore.value } )
			getInterviewPoints(applicantsID)
		}
		var challengingScore = document.getElementById('challenging-score')
		try{
			challengingScore.value = doc.data().application.interview.challengingScore
		} catch {
			challengingScore.value = 0
		}
		challengingScore.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.challengingScore" : challengingScore.value } )
			getInterviewPoints(applicantsID)
		}
		var troubleScore = document.getElementById('trouble-score')
		try{
			troubleScore.value = doc.data().application.interview.troubleScore
		} catch {
			troubleScore.value = 0
		}
		troubleScore.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.troubleScore" : troubleScore.value } )
			getInterviewPoints(applicantsID)
		}
		var situationScore = document.getElementById('situation-score')
		try{
			situationScore.value = doc.data().application.interview.situationScore
		} catch {
			situationScore.value = 0
		}
		situationScore.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.situationScore" : situationScore.value } )
			getInterviewPoints(applicantsID)
		}
		var confidenceScore = document.getElementById('confidence-score')
		try{
			confidenceScore.value = doc.data().application.interview.confidenceScore
		} catch {
			confidenceScore.value = 0
		}
		confidenceScore.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.confidenceScore" : confidenceScore.value } )
			getInterviewPoints(applicantsID)
		}
		var preparedScore = document.getElementById('prepared-score')
		try{
			preparedScore.value = doc.data().application.interview.preparedScore
		} catch {
			preparedScore.value = 0
		}
		preparedScore.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.preparedScore" : preparedScore.value } )
			getInterviewPoints(applicantsID)
		}	
		var explainScore = document.getElementById('explain-score')
		try{
			explainScore.value = doc.data().application.interview.explainScore
		} catch {
			explainScore.value = 0
		}
		explainScore.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.explainScore" : explainScore.value } )
			getInterviewPoints(applicantsID)
		}
		var onlineScore = document.getElementById('online-score')
		try{
			onlineScore.value = doc.data().application.interview.onlineScore
		} catch {
			onlineScore.value = 0
		}
		onlineScore.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.onlineScore" : onlineScore.value } )
			getInterviewPoints(applicantsID)
		}
		var helpScore = document.getElementById('help-score')
		try{
			helpScore.value = doc.data().application.interview.helpScore
		} catch {
			helpScore.value = 0
		}
		helpScore.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.helpScore" : helpScore.value } )
			getInterviewPoints(applicantsID)
		}
		var questionScore = document.getElementById('question-score')
		try{
			questionScore.value = doc.data().application.interview.questionScore
		} catch {
			questionScore.value = 0
		}
		console.log("questionScore.value before function " + questionScore.value)
		questionScore.onblur = async function() {
			await userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interview.questionScore" : questionScore.value } )
			getInterviewPoints(applicantsID)
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
				.update( { "application.assessmentScore" : assessmentPoints } )
	})
}

function getInterviewPoints(applicantsID) {
	var userDB = firebase.firestore()
	userDB.collection("users").doc(applicantsID).get().then(function(doc) {
		try{
			var onTimeScore = doc.data().application.interview.onTimeScore
		} catch {
			onTimeScore = 0
		}
		try{
			var challengingScore = doc.data().application.interview.challengingScore
		} catch {
			challengingScore = 0
		}
		try{
			var troubleScore = doc.data().application.interview.troubleScore
		} catch {
			troubleScore = 0
		}
		try{
			var situationScore = doc.data().application.interview.situationScore
		} catch {
			situationScore = 0
		}
		try{
			var confidenceScore = doc.data().application.interview.confidenceScore
		} catch {
			confidenceScore = 0
		}
		try{
			var preparedScore = doc.data().application.interview.preparedScore
		} catch {
			preparedScore = 0
		}
		try{
			var explainScore = doc.data().application.interview.explainScore
		} catch {
			explainScore = 0
		}
		try{
			var onlineScore = doc.data().application.interview.onlineScore
		} catch {
			onlineScore = 0
		}
		try{
			var helpScore = doc.data().application.interview.helpScore
		} catch {
			helpScore = 0
		}
		try{
			var questionScore = doc.data().application.interview.questionScore
		} catch {
			questionScore = 0
		}

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
		
		userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.interviewScore" : interviewScore } )
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
			grantedTutorAccess(true, applicantsEmail)
		} else {
			var declinedMessage = "Unfortunately at this time your application to tutor has been declined. Your tutor coordinator will reach out soon with more information."
			sendEmailTo(applicantsEmail, 'Tutor Application Status', declinedMessage)
			grantedTutorAccess(false, applicantsEmail)
		}
	})
	
}

function updateisFirstApprovedStatus(applicantsID, email, booleanValue) {
	var userDB = firebase.firestore()

	userDB.collection("users").doc(applicantsID).get().then(function(doc) {
		
		userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.isFirstApproved" : booleanValue } )
	})
	isFirstApprovedTutorAppResolution(booleanValue, email)
}

function updateisWaitListStatus(applicantsID, email, booleanValue) {
	var userDB = firebase.firestore()

	userDB.collection("users").doc(applicantsID).get().then(function(doc) {
		
		userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.isWaitListed" : booleanValue } )
	})
	isWaitListedTutorAppResolution(booleanValue, email)
}

function updateisRejectedStatus(applicantsID, email, booleanValue) {
	var userDB = firebase.firestore()

	userDB.collection("users").doc(applicantsID).get().then(function(doc) {
		
		userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.isRejected" : booleanValue } )
	})
	isRejectedTutorAppResolution(booleanValue, email)
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
		userDB.collection("users")
			.doc(ID)
			.update( {"application.facultyFile" : facultyRecFileURL,
			  	"application.uploadedFaculty" : true })
		.then(function() {
			document.getElementById(globalPreviewID).style.display = "none"
			document.getElementById(ID + '-upload-completed').style.display = "block"
			facultyRecUploadByTutorCoordinator(email)
		})
	}
