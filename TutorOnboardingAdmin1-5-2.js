firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var userDB = firebase.firestore()
		var userID = user.uid
		
		//Check if user is an admin
		userDB.collection("users").doc(userID).get().then(function(doc) {
			console.log(doc.data().admin)
		})
		
		//Get all applicant information and build blocks
		var applicantArea = document.getElementById('applicant-section')
		userDB.collection("users").where("tutorApplicant", "==", true).onSnapshot(function(allTutors) {
			while(applicantArea.firstChild) {
				applicantArea.removeChild(applicantArea.firstChild)
				console.log("removed")
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
				    didFaculty = doc.data().application.uploadedFaculty
				    
				buildApplicantBlock(applicantID, 
						    firstName, 
						    lastName, 
						    email, 
						    timeApplied, 
						    didSubmitPreInterview, 
						    didRequest, 
						    didTranscript, 
						    didFaculty)
        		})
		})
	} else {
		location.href = "https://www.jointutortree.com"
	}
})

function buildApplicantBlock(applicantID, firstName, lastName, email, timeApplied, didSubmitPreInterview, didRequest, didTranscript, didFaculty) {
	//Main Container
	var applicantBlock = document.createElement("div")
	applicantBlock.setAttribute('class', 'applicant-block')
	applicantBlock.setAttribute('id', timeApplied)
	
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
	
	//Grant Access Code Block
	var accessButton = document.createElement('div')
	accessButton.setAttribute('class', 'applicant-access-button')
	accessButton.innerHTML = 'Grant Access'
	accessButton.setAttribute('onclick', 'grantTutorPrivileges("'+applicantID+'")')
	
	applicantBlock.appendChild(accessButton)
	
	//Append to Body
	document.getElementById('applicant-section').appendChild(applicantBlock)
}

function showAssessment(applicantsID) {
	document.getElementById("assessment-wrapper").style.display = 'flex'
	
	var userDB = firebase.firestore()
	userDB.collection("users").doc(applicantsID).get().then(function(doc) {
		document.getElementById('pia-score').innerHTML = doc.data.PIAscore
		document.getElementById('pia-first').innerHTML = doc.data().firstName
		document.getElementById('pia-last').innerHTML = doc.data().lastName
		document.getElementById('pia-email').innerHTML = doc.data().email
		document.getElementById('pia-year').innerHTML = doc.data().year
		document.getElementById('pia-major').innerHTML = doc.data().major
		document.getElementById('pia-hours').innerHTML = doc.data().hours
		document.getElementById('pia-school').innerHTML = doc.data().school
		document.getElementById('pia-courses').innerHTML = doc.data().courses
		document.getElementById('pia-experience').innerHTML = doc.data().experience
		document.getElementById('pia-qualities').innerHTML = doc.data().qualites
		document.getElementById('pia-why').innerHTML = doc.data().whyTutor
		document.getElementById('pia-groups').innerHTML = doc.data().groups
		
		var updateScoreButton = document.createElement('div')
		updateScoreButton.setAttribute('class', 'update-pia-score')
		updateScoreButton.innerHTML = 'Update'
		
		var scoreField = document.getElementById('pia-score')
		updateScoreButton.addEventListener('click', function() {
			userDB.collection("users")
				.doc(applicantsID)
				.update( { "application.PIAscore" : scoreField.value } )
			updateScoreButton.style.display = 'none'
		})
		
		scoreField.onfocus = function() {
			updateScoreButton.style.display = 'block'
			document.getElementById('pia-score-block').appendChild(updateScoreButton)
		}
	})
}

function showTranscript(applicantsID) {
	console.log(applicantsID)
}

function showFaculty(applicantsID) {
	console.log(applicantsID)
}

function grantTutorPrivileges(applicantsID) {
	console.log(applicantsID)
}



