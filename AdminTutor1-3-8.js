//Initialize database
var userDB = firebase.firestore()

//FILTERS
var tabFilters = ["pending", "waitlisted", "rejected", "accepted"]
var schoolFilters = ""

//______________________

//Tab filters
var allTab = document.getElementById('admin-tutor-all')
var rejectedTab = document.getElementById('admin-tutor-rejected')
var waitlistedTab = document.getElementById('admin-tutor-waitlisted')
var pendingTab = document.getElementById('admin-tutor-pending')
var approvedTab = document.getElementById('admin-tutor-approved')

//Tab filter onclick listeners
allTab.addEventListener('click', allApplicants)
rejectedTab.addEventListener('click', rejectedApplicants)
waitlistedTab.addEventListener('click', waitlistedApplicants)
pendingTab.addEventListener('click', pendingApplicants)
approvedTab.addEventListener('click', approvedApplicants)

//Tab filter functions
function allApplicants() {
	tabFilters = ["pending", "waitlisted", "rejected", "accepted"]
	showApplicants()
}

function rejectedApplicants() {
	tabFilters = ["rejected"]
	showApplicants()
}

function waitlistedApplicants() {
	tabFilters = ["waitlisted"]
	showApplicants()
}

function pendingApplicants() {
	tabFilters = ["pending"]
	showApplicants()
}

function approvedApplicants() {
	tabFilters = ["accepted"]
	showApplicants()
}
//__________________________

//School filters
var tutortreeButton = document.getElementById('tutortree-button')
var ucsdButton = document.getElementById('ucsd-button')
var uscButton = document.getElementById('usc-button')
var uclaButton = document.getElementById('ucla-button')
var pepperdineButton = document.getElementById('pepperdine-button')
var csunButton = document.getElementById('csun-button')
var ucsbButton = document.getElementById('ucsb-button')
var stanfordButton = document.getElementById('stanford-button')
var sjsuButton = document.getElementById('sjsu-button')
var berkeleyButton = document.getElementById('berkeley-button')
var oregonstateButton = document.getElementById('oregonstate-button')
var uoregonButton = document.getElementById('uoregon-button')

//School filter onclick listeners
tutortreeButton.addEventListener('click', tutortreeApplicants)
ucsdButton.addEventListener('click', tutortreeApplicants)
uscButton.addEventListener('click', tutortreeApplicants)
uclaButton.addEventListener('click', tutortreeApplicants)
pepperdineButton.addEventListener('click', tutortreeApplicants)
csunButton.addEventListener('click', tutortreeApplicants)
ucsbButton.addEventListener('click', tutortreeApplicants)
stanfordButton.addEventListener('click', tutortreeApplicants)
sjsuButton.addEventListener('click', tutortreeApplicants)
berkeleyButton.addEventListener('click', tutortreeApplicants)
oregonstateButton.addEventListener('click', tutortreeApplicants)
uoregonButton.addEventListener('click', tutortreeApplicants)

//School filter functions
function tutortreeApplicants() {
	tabFilters = ["pending", "waitlisted", "rejected", "accepted"]
	schoolFilters = ""
	showApplicants()
}

//Section to append all applicants
var applicantSection = document.getElementById('tutor-applicant-section')

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var userID = user.uid
		 
		//Check if user is admin, else redirect: TODO
		
		//Load all applicants with no filters applied
		tutortreeApplicants()
		
	//If user is not logged in (or an Admin) return them home
	} else {
		location.href = "https://www.jointutortree.com"
	}
})

function showApplicants() {
	userDB.collection("userTest").where("tutorApplicantStatus", "in", tabFilters).onSnapshot(function(allTutors) {

		//remove all children when updated
		while(applicantSection.firstChild) {
			applicantSection.removeChild(applicantSection.firstChild)
		}
		
		//Reinitialize Counter
		var count = 1
		allTutors.forEach(function(doc)  {
			var 	applicantID = doc.id,
			    	applicantCount = count,
			    	applicantName = doc.data().name,
				applicantEmail = doc.data().email,
				applicantPhone = doc.data().phoneNumber,
				applicantSchool = doc.data().school,
				applicantStatus = doc.data().tutorApplicantStatus
			
			buildApplicantBlock(applicantID, applicantCount, applicantName, applicantEmail, applicantPhone, applicantSchool, applicantStatus)
			count += 1		
		})
	})
}

function buildApplicantBlock(ID, count, name, email, phone, school, status) {
	console.log(status)
	
	//Main block that holds all applicant elements
	var applicantBlock = document.createElement('div')
	applicantBlock.setAttribute('id', ID)
	applicantBlock.setAttribute('onClick', 'showTutorModal("' + ID + '")')
	
	//Alternate background colors from gray to black based on if count is even or odd
	if (count % 2 == 0) {
		applicantBlock.setAttribute('class', 'applicant-block-gray')
	} else {
		applicantBlock.setAttribute('class', 'applicant-block-black')
	}
	applicantSection.appendChild(applicantBlock)
	
	//Count Block
	var applicantCount = document.createElement('div')
	applicantCount.setAttribute('class', 'applicant-count')
	applicantCount.innerHTML = count
	applicantBlock.appendChild(applicantCount)
	
	//Name Block
	var applicantName = document.createElement('div')
	applicantName.setAttribute('class', 'applicant-name')
	applicantName.innerHTML = name
	applicantBlock.appendChild(applicantName)

	//Email Block
	var applicantEmail = document.createElement('div')
	applicantEmail.setAttribute('class', 'applicant-contact')
	applicantEmail.innerHTML = email
	applicantBlock.appendChild(applicantEmail)
	
	//Phone Block
	var applicantPhone = document.createElement('div')
	applicantPhone.setAttribute('class', 'applicant-contact')
	applicantPhone.innerHTML = phone
	applicantBlock.appendChild(applicantPhone)
	
	//School Block
	var applicantSchool = document.createElement('div')
	applicantSchool.setAttribute('class', 'applicant-contact')
	applicantSchool.innerHTML = school
	applicantBlock.appendChild(applicantSchool)
	
	//Status Block
	var applicantStatus = document.createElement('div')
	if (status == "rejected") {
		applicantStatus.setAttribute('class', 'applicant-status-rejected')
		applicantStatus.innerHTML = "REJECTED"
	} else if (status == "waitlisted") {
		applicantStatus.setAttribute('class', 'applicant-status-waitlisted')
		applicantStatus.innerHTML = "WAITLISTED"
	} else if (status == "pending") {
		applicantStatus.setAttribute('class', 'applicant-status-pending')
		applicantStatus.innerHTML = "PENDING"
	} else if (status == "accepted") {
		applicantStatus.setAttribute('class', 'applicant-status-approved')
		applicantStatus.innerHTML = "APPROVED"
	}
	applicantBlock.appendChild(applicantStatus)

	//Actions Block
	var applicantActions = document.createElement('div')
	applicantActions.setAttribute('class', 'applicant-actions')
	applicantBlock.appendChild(applicantActions)

	var applicantTutorAccept = document.createElement('div')
	applicantTutorAccept.setAttribute('class', 'admin-tutor-accept')
	applicantTutorAccept.innerHTML = 'check-circle'
	applicantActions.appendChild(applicantTutorAccept)

	var applicantTutorReject = document.createElement('div')
	applicantTutorReject.setAttribute('class', 'admin-tutor-reject')
	applicantTutorReject.innerHTML = 'user-times'
	applicantActions.appendChild(applicantTutorReject)

	var applicantTutorWaitlist = document.createElement('div')
	applicantTutorWaitlist.setAttribute('class', 'admin-tutor-waitlist')
	applicantTutorWaitlist.innerHTML = 'hourglass-half'
	applicantActions.appendChild(applicantTutorWaitlist)

	var applicantTutorDelete = document.createElement('div')
	applicantTutorDelete.setAttribute('class', 'admin-tutor-delete')
	applicantTutorDelete.innerHTML = 'trash-alt'
	applicantActions.appendChild(applicantTutorDelete)
}

//TUTOR MODAL ELEMENTS________________________________________________________________________________

//Header Elements
var tutorImage = document.getElementById('tutor-image')
var tutorName = document.getElementById('tutor-name')
var tutorScore = document.getElementById('tutor-score')
var tutorTranscript = document.getElementById('tutor-transcript')
var tutorFaculty = document.getElementById('tutor-faculty')


//Tabs
var tutorApplicationTab = document.getElementById('tutor-application-tab')
var tutorInterviewTab = document.getElementById('tutor-interview-tab')
var tutorMoreTab = document.getElementById('tutor-more-tab')


//Sections
var tutorApplicationSection = document.getElementById('tutor-application')
var tutorInterviewSection = document.getElementById('tutor-interview')
var tutorMoreSection = document.getElementById('tutor-more')


//Tab Functions
tutorApplicationTab.addEventListener('click', function() {
	tutorApplicationSection.style.display = 'flex'
	tutorInterviewSection.style.display = 'none'
	tutorMoreSection.style.display = 'none'
})			     
tutorInterviewTab.addEventListener('click', function() {
	tutorApplicationSection.style.display = 'none'
	tutorInterviewSection.style.display = 'flex'
	tutorMoreSection.style.display = 'none'
})	
tutorMoreTab.addEventListener('click', function() {
	tutorApplicationSection.style.display = 'none'
	tutorInterviewSection.style.display = 'none'
	tutorMoreSection.style.display = 'flex'
})

//Application Section Elements
var tutorFirst = document.getElementById('tutor-first')
var tutorLast = document.getElementById('tutor-last')
var tutorEmail = document.getElementById('tutor-email')
var tutorMajor = document.getElementById('tutor-major')
var tutorSchool = document.getElementById('tutor-school')
var tutorYear = document.getElementById('tutor-year')
var tutorCourses = document.getElementById('tutor-courses')
var tutorWhy = document.getElementById('tutor-why')
var tutorGroups = document.getElementById('tutor-groups')


//Interview Section Elements
var tutorOnTime = document.getElementById('tutor-onTime')
var tutorChallenge = document.getElementById('tutor-challenge')
var tutorApproach = document.getElementById('tutor-approach')
var tutorSituation = document.getElementById('tutor-situation')
var tutorConfidence = document.getElementById('tutor-confidence')
var tutorPrepared = document.getElementById('tutor-prepared')
var tutorConcept = document.getElementById('tutor-concept')
var tutorOnline = document.getElementById('tutor-online')
var tutorTree = document.getElementById('tutor-tree')
var tutorQuestions = document.getElementById('tutor-questions')


//More Section Elements
var tutorApplied = document.getElementById('tutor-applied')
var tutorNotes = document.getElementById('tutor-notes')

var tutorRequestedInterview = document.getElementById('tutor-requested-interview')
var tutorCompletedInterview = document.getElementById('tutor-completed-interview')
var tutorUploadedTranscript = document.getElementById('tutor-uploaded-transcript')
var tutorUploadedFaculty = document.getElementById('tutor-uploaded-faculty')

var tutorRequestedIncomplete = document.getElementById('tutor-requested-incomplete')
var tutorRequestedComplete = document.getElementById('tutor-requested-complete')
var tutorCompletedIncomplete = document.getElementById('tutor-completed-incomplete')
var tutorCompletedComplete = document.getElementById('tutor-completed-complete')
var tutorTranscriptIncomplete = document.getElementById('tutor-transcript-incomplete')
var tutorTranscriptComplete = document.getElementById('tutor-transcript-complete')
var tutorFacultyIncomplete = document.getElementById('tutor-faculty-incomplete')
var tutorFacultyComplete = document.getElementById('tutor-faculty-complete')
	

//TUTOR MODAL FUNCTIONS_________________________________________________________________________

function showTutorModal(ID) {
	document.getElementById('tutor-info-modal').style.display = 'flex'
	//Stored values
	var assessmentScore = 0
	var interviewScore = 0
	var totalScore = 0
	
	//Core values for header
	userDB.collection("userTest").doc(ID).get().then(function(tutor) {
		tutorImage.src = tutor.data().profileImage
		tutorName.innerHTML = tutor.data().name
		tutorEmail.placeholder = tutor.data().email
		tutorMajor.placeholder = tutor.data().major
	})
	
	//Application snapshot values
	userDB.collection("userTest").doc(ID).collection("tutorApplication").doc("application").onSnapshot(function(doc) {
		//Set Scores
		assessmentScore = doc.data().assessmentScore
		interviewScore = doc.data().interviewScore
		totalScore = assessmentScore + interviewScore
		tutorScore.innerHTML = totalScore
		
		//Get bools
		var didRequest = doc.data().didRequestInterview
		var didComplete = doc.data().completedInterview
		var didTranscript = doc.data().uploadedTranscript
		var didFaculty = doc.data().uploadedFaculty
		
		
		//Get Files
		var facultyFile = doc.data().facultyFile
		var transcriptFile = doc.data().transcriptFile
		
		//Conditionally Display Elements
		displayProgress(didRequest, didComplete, didTranscript, didFaculty)
		
		//Open Transcript
		tutorTranscript.addEventListener('click', function() {
			window.open(transcriptFile)
		})
						 
		//Open Faculty Recommendation				 				
		tutorFaculty.addEventListener('click', function() {
			window.open(facultyFile)
		})
		
		//Application Tab Data
		tutorFirst.placeholder = doc.data().applicationFields.firstName
		tutorLast.placeholder = doc.data().applicationFields.lastName
		tutorSchool.placeholder = doc.data().applicationFields.schoolName
		tutorYear.placeholder = doc.data().applicationFields.year
		tutorCourses.placeholder = doc.data().applicationFields.courses
		tutorWhy.placeholder = doc.data().applicationFields.whytutor
		tutorGroups.placeholder = doc.data().applicationFields.groups
		
		//More Tab Data
		tutorApplied.innerHTML = "Date Applied: " + formatApplicantDate(doc.data().timeApplied)
		
		tutorNotes.placeholder = doc.data().meghanNotes
		tutorNotes.onblur = function() {
			userDB.collection("userTest")
				.doc(ID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "meghanNotes" : tutorNotes.value } )
		}
	})
	
	//Interview Snapshot Values
	userDB.collection("userTest").doc(ID).collection("tutorApplication").doc("interview").onSnapshot(function(doc) {
		//Populate Interview Notes Data
		tutorOnTime.placeholder = doc.data().interviewNotes.onTimeNotes
		tutorChallenge.placeholder = doc.data().interviewNotes.challengingNotes
		tutorApproach.placeholder = doc.data().interviewNotes.troubleNotes
		tutorSituation.placeholder = doc.data().interviewNotes.situationNotes
		tutorConfidence.placeholder = doc.data().interviewNotes.confidenceNotes
		tutorPrepared.placeholder = doc.data().interviewNotes.preparedNotes
		tutorConcept.placeholder = doc.data().interviewNotes.explainNotes
		tutorOnline.placeholder = doc.data().interviewNotes.onlineNotes
		tutorTree.placeholder = doc.data().interviewNotes.helpNotes
		tutorQuestions.placeholder = doc.data().interviewNotes.questionNotes
		
		setInterviewOnblurs()
	})
}



//Interview Onblurs_____________________________________________________________________________________________________

function setInterviewOnblurs(applicantID) {
	tutorTime.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("interview")
			.update( { "interviewNotes.onTimeNotes" : tutorTime.value } )
	}
	tutorChallenge.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("interview")
			.update( { "interviewNotes.challengingNotes" : tutorChallenge.value } )
	}
	tutorApproach.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("interview")
			.update( { "interviewNotes.troubleNotes" : tutorApproach.value } )
	}
	tutorSituation.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("interview")
			.update( { "interviewNotes.situationNotes" : tutorSituation.value } )
	}
	tutorConfidence.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("interview")
			.update( { "interviewNotes.confidenceNotes" : tutorConfidence.value } )
	}
	tutorPrepared.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("interview")
			.update( { "interviewNotes.preparedNotes" : tutorPrepared.value } )
	}
	tutorConcept.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("interview")
			.update( { "interviewNotes.explainNotes" : tutorConcept.value } )
	}
	tutorOnline.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("interview")
			.update( { "interviewNotes.onlineNotes" : tutorOnline.value } )
	}
	tutorTree.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("interview")
			.update( { "interviewNotes.helpNotes" : tutorTree.value } )
	}
	tutorQuestions.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("interview")
			.update( { "interviewNotes.questionNotes" : tutorQuestions.value } )
	}
}



//Application Onblurs_____________________________________________________________________________________________________


function setApplicationOnblurs(applicantID) {
	tutorFirst.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("application")
			.update( { "applicationFields.firstName" : tutorFirst.value } )
	}
	tutorLast.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("application")
			.update( { "applicationFields.lastName" : tutorLast.value } )
	}
	tutorSchool.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("application")
			.update( { "applicationFields.schoolName" : tutorSchool.value } )
	}
	tutorYear.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("application")
			.update( { "applicationFields.year" : tutorYear.value } )
	}
	tutorCourses.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("application")
			.update( { "applicationFields.courses" : tutorCourses.value } )
	}
	tutorWhy.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("application")
			.update( { "applicationFields.whyTutor" : tutorWhy.value } )
	}
	tutorGroups.onblur = function() {
		userDB.collection("userTest")
			.doc(applicantID)
			.collection("tutorApplication")
			.doc("application")
			.update( { "applicationFields.groups" : tutorGroups.value } )
	}
}



function displayProgress(didRequest, didComplete, didTranscript, didFaculty) {
	//Requested Interview 
	if(didRequest) {
		tutorRequestedComplete.style.display = "block"
		tutorRequestedIncomplete.style.display = "none"
	} else {
		tutorRequestedComplete.style.display = "none"
		tutorRequestedIncomplete.style.display = "block"
	}

	//Completed Interview 
	if(didComplete) {
		tutorCompletedComplete.style.display = "block"
		tutorCompletedIncomplete.style.display = "none"
	} else {
		tutorCompletedComplete.style.display = "none"
		tutorCompletedIncomplete.style.display = "block"
	}

	//Transcript 
	if(didTranscript) {
		tutorTranscript.style.display = "block"
		tutorTranscriptComplete.style.display = "block"
		tutorTranscriptIncomplete.style.display = "none"
	} else {
		tutorTranscript.style.display = "none"
		tutorTranscriptComplete.style.display = "none"
		tutorTranscriptIncomplete.style.display = "block"
	}

	//Faculty
	if (didFaculty) {
		tutorFaculty.style.display = "block"
		tutorFacultyComplete.style.display = "block"
		tutorFacultyIncomplete.style.display = "none"
	} else {
		tutorFaculty.style.display = "none"
		tutorFacultyComplete.style.display = "none"
		tutorFacultyIncomplete.style.display = "block"
	}
}

function formatApplicantDate(epochDate) {
	var applicantDate = new Date(epochDate * 1000)
	var formattedDate = applicantDate.toLocaleDateString("en-US", {month:'long', day: 'numeric',
			hour: 'numeric', minute:'numeric'})
	return formattedDate
}
	
