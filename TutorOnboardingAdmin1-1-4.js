firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var userDB = firebase.firestore()
		var userID = user.uid
		
		//Check if user is an admin
		userDB.collection("users").doc(userID).get().then(function(doc) {
			console.log(doc.data().admin)
		})
		//Get all applicant information and build blocks
		userDB.collection("users").where("tutorApplicant", "==", true).onSnapshot(function(allTutors) {
			allTutors.forEach(function(doc) {
        			var applicantID = doc.data().getParent(),
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
	
	var nameHeader = document.createElement('h2')
	nameHeader.setAttribute('class', 'applicants-name')
	nameHeader.innerHTML = firstName + ' ' + lastName
	nameBlock.appendChild(nameHeader)
	
	var emailHeader = document.createElement('div')
	emailHeader.setAttribute('class', 'applicants-email')
	emailHeader.innerHTML = email
	nameBlock.appendChild(emailHeader)
	
	applicantBlock.appendChild(nameBlock)
	
	//Pre-interview block
	var preInterviewBlock = document.createElement('div')
	preInterviewBlock.setAttribute('class', 'pre-interview-block')
	
	var preInterviewHeader = document.creatElement('h4')
	preInterviewHeader.setAttribute('class', 'applicant-header')
	preInterviewHeader.innerHTML = "Assessment"
	preInterviewBlock.appendChild(preInterviewHeader)
	
	if (didSubmitPreInterview) {
		var assessmentCompleted = document.createElement('div')
		assessmentCompleted.setAttribute('class', 'admin-complete')
		assessmentCompleted.innerHTML = 
		preInterviewBlock.appendChild(preInterviewBlock)
		preInterviewBlock.setAttribute('onClick', 'showAssessment("'+applicantsID+'")')
	} else {
		var assessmentIncomplete = document.createElement('div')
		assessmentIncomplete.setAttribute('class', 'admin-incomplete')
		assessmentIncomplete.innerHTML = 
		preInterviewBlock.appendChild(assessmentIncomplete)
	}
	
	applicantBlock.appendChild(preInterviewBlock)
	
	//Requested Interview Block
	var requestedBlock = document.createElement('div')
	requestedBlock.setAttribute('class', 'requested-block')
	
	var requestedHeader = document.creatElement('h4')
	requestedHeader.setAttribute('class', 'applicant-header')
	requestedHeader.innerHTML = "Requested Interview"
	requestedBlock.appendChild(requestedHeader)
	
	if (didRequest) {
		var requestCompleted = document.createElement('div')
		requestCompleted.setAttribute('class', 'admin-complete')
		requestCompleted.innerHTML = 
		requestedBlock.appendChild(preInterviewBlock)
	} else {
		var requestIncomplete = document.createElement('div')
		requestIncomplete.setAttribute('class', 'admin-incomplete')
		requestIncomplete.innerHTML = 
		requestedBlock.appendChild(assessmentIncomplete)
	}
	
	applicantBlock(requestedBlock)
	
	//Transcript Block
	var transcriptBlock = document.createElement('div')
	transcriptBlock.setAttribute('class', 'transcript-block')
	
	var transcriptHeader = document.creatElement('h4')
	transcriptHeader.setAttribute('class', 'applicant-header')
	transcriptHeader.innerHTML = "Uploaded Transcript"
	transcriptBlock.appendChild(transcriptHeader)
	
	if (didTranscript) {
		var transcriptComplete = document.createElement('div')
		transcriptComplete.setAttribute('class', 'admin-complete')
		transcriptComplete.innerHTML = 
		transcriptBlock.appendChild(transcriptComplete)
		transcriptBlock.setAttribute('onClick', 'showTranscript("'+applicantsID+'")')
	} else {
		var transcriptIncomplete = document.createElement('div')
		transcriptIncomplete.setAttribute('class', 'admin-incomplete')
		transcriptIncomplete.innerHTML = 
		transcriptBlock.appendChild(transcriptComplete)
	}
	
	applicantBlock(transcriptBlock)
	
	//Uploaded Faculty Recommendation Block
	var facultyBlock = document.createElement('div')
	facultyBlock.setAttribute('class', 'faculty-rec-block')
	
	var facultyHeader = document.creatElement('h4')
	facultyHeader.setAttribute('class', 'applicant-header')
	facultyHeader.innerHTML = "Faculty Rec"
	facultyBlock.appendChild(facultyHeader)
	
	if (didFaculty) {
		var facultyComplete = document.createElement('div')
		facultyComplete.setAttribute('class', 'admin-complete')
		facultyComplete.innerHTML = 
		facultyBlock.appendChild(facultyComplete)
		transcriptBlock.setAttribute('onClick', 'showFaculty("'+applicantsID+'")')
	} else {
		var transcriptIncomplete = document.createElement('div')
		transcriptIncomplete.setAttribute('class', 'admin-incomplete')
		transcriptIncomplete.innerHTML = 
		transcriptBlock.appendChild(transcriptComplete)
	}
	
	applicantBlock(transcriptBlock)
	
	//Append to Body
	document.getElementById('applicant-section').appendChild(applicantBlock)
}

function showAssessment(applicantsID) {
	console.log(applicantsID)
}

function showTranscript(applicantsID) {
	console.log(applicantsID)
}

function showFaculty(applicantsID) {
	console.log(applicantsID)
}



