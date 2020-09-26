//Initialize database
var userDB = firebase.firestore()

//FILTERS
var tabFilters = ["pending", "waitlisted", "rejected", "accepted", "deleted"]
var schoolFilters = "All Schools"

//______________________

//Tab filters
var allTab = document.getElementById('admin-tutor-all')
var deletedTab = document.getElementById('admin-tutor-deleted')
var rejectedTab = document.getElementById('admin-tutor-rejected')
var waitlistedTab = document.getElementById('admin-tutor-waitlisted')
var pendingTab = document.getElementById('admin-tutor-pending')
var approvedTab = document.getElementById('admin-tutor-approved')

//Tab filter onclick listeners
allTab.addEventListener('click', allApplicants)
deletedTab.addEventListener('click', deletedApplicants)
rejectedTab.addEventListener('click', rejectedApplicants)
waitlistedTab.addEventListener('click', waitlistedApplicants)
pendingTab.addEventListener('click', pendingApplicants)
approvedTab.addEventListener('click', approvedApplicants)

//Tab filter functions
function allApplicants() {
	tabFilters = ["pending", "waitlisted", "rejected", "accepted", "deleted"]
	showApplicants()
	
	allTab.className = 'admin-tutor-filters-selected'
	deletedTab.className = 'admin-tutor-filters'
	rejectedTab.className = 'admin-tutor-filters'
	waitlistedTab.className = 'admin-tutor-filters'
	pendingTab.className = 'admin-tutor-filters'
	approvedTab.className = 'admin-tutor-filters'
}

function deletedApplicants() {
	tabFilters = ["deleted"]
	showApplicants()
	
	allTab.className = 'admin-tutor-filters'
	deletedTab.className = 'admin-tutor-filters-selected'
	rejectedTab.className = 'admin-tutor-filters'
	waitlistedTab.className = 'admin-tutor-filters'
	pendingTab.className = 'admin-tutor-filters'
	approvedTab.className = 'admin-tutor-filters'
}

function rejectedApplicants() {
	tabFilters = ["rejected"]
	showApplicants()
	
	allTab.className = 'admin-tutor-filters'
	deletedTab.className = 'admin-tutor-filters'
	rejectedTab.className = 'admin-tutor-filters-selected'
	waitlistedTab.className = 'admin-tutor-filters'
	pendingTab.className = 'admin-tutor-filters'
	approvedTab.className = 'admin-tutor-filters'
}

function waitlistedApplicants() {
	tabFilters = ["waitlisted"]
	showApplicants()
	
	allTab.className = 'admin-tutor-filters'
	deletedTab.className = 'admin-tutor-filters'
	rejectedTab.className = 'admin-tutor-filters'
	waitlistedTab.className = 'admin-tutor-filters-selected'
	pendingTab.className = 'admin-tutor-filters'
	approvedTab.className = 'admin-tutor-filters'
}

function pendingApplicants() {
	tabFilters = ["pending"]
	showApplicants()
	
	allTab.className = 'admin-tutor-filters'
	deletedTab.className = 'admin-tutor-filters'
	rejectedTab.className = 'admin-tutor-filters'
	waitlistedTab.className = 'admin-tutor-filters'
	pendingTab.className = 'admin-tutor-filters-selected'
	approvedTab.className = 'admin-tutor-filters'
}

function approvedApplicants() {
	tabFilters = ["accepted"]
	showApplicants()
	
	allTab.className = 'admin-tutor-filters'
	deletedTab.className = 'admin-tutor-filters'
	rejectedTab.className = 'admin-tutor-filters'
	waitlistedTab.className = 'admin-tutor-filters'
	pendingTab.className = 'admin-tutor-filters'
	approvedTab.className = 'admin-tutor-filters-selected'
}

//__________________________

//School filters
var tutortreeButton = document.getElementById('tutortree-button')
var ucsdButton = document.getElementById('ucsd-button')
var sdsuButton = document.getElementById('sdsu-button')
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

tutortreeButton.addEventListener('click', function() {
	schoolFilters = 'All Schools'
	showApplicants()
	schoolFilterBackground('tutortree')
})
ucsdButton.addEventListener('click', function() {
	schoolFilters = 'ucsd'
	showApplicants()
	schoolFilterBackground('ucsd')
})
sdsuButton.addEventListener('click', function() {
	schoolFilters = 'sdsu'
	showApplicants()
	schoolFilterBackground('sdsu')
})
uscButton.addEventListener('click', function() {
	schoolFilters = 'usc'
	showApplicants()
	schoolFilterBackground('usc')
})
uclaButton.addEventListener('click', function() {
	schoolFilters = 'ucla'
	showApplicants()
	schoolFilterBackground('ucla')
})
pepperdineButton.addEventListener('click', function() {
	schoolFilters = 'pepperdine'
	showApplicants()
	schoolFilterBackground('pepperdine')
})
csunButton.addEventListener('click', function() {
	schoolFilters = 'csun'
	showApplicants()
	schoolFilterBackground('csun')
})
ucsbButton.addEventListener('click', function() {
	schoolFilters = 'ucsb'
	showApplicants()
	schoolFilterBackground('ucsb')
})
stanfordButton.addEventListener('click', function() {
	schoolFilters = 'stanford'
	showApplicants()
	schoolFilterBackground('stanford')
})
sjsuButton.addEventListener('click', function() {
	schoolFilters = 'sjsu'
	showApplicants()
	schoolFilterBackground('sjsu')
})
berkeleyButton.addEventListener('click', function() {
	schoolFilters = 'berkeley'
	showApplicants()
	schoolFilterBackground('berkeley')
})
oregonstateButton.addEventListener('click', function() {
	schoolFilters = 'oregonstate'
	showApplicants()
	schoolFilterBackground('oregonstate')
})
uoregonButton.addEventListener('click', function() {
	schoolFilters = 'uoregon'
	showApplicants()
	schoolFilterBackground('uoregon')
})

function schoolFilterBackground(school) {
	var schoolOptions = ['uoregon', 'oregonstate', 'stanford', 'berkeley', 'sjsu', 'ucsb', 'ucla', 'usc', 'pepperdine', 'sdsu', 'ucsd', 'tutortree']	
				 
	for( var i = 0;  i < schoolOptions.length; i++) {
		console.log(school)
		console.log(schoolOptions[i])
		if (schoolOptions[i] == school) {
			document.getElementById(schoolOptions[i] + '-button').className = 'admin-tutor-logo-holder-selected'
		} else {
			document.getElementById(schoolOptions[i] + '-button').className = 'admin-tutor-logo-holder'
		}
	}
}

//Section to append all applicants
var applicantSection = document.getElementById('tutor-applicant-section')

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var userID = user.uid
		 
		//Check if user is admin, else redirect: TODO
		
		//Load all applicants with no filters applied
		showApplicants()
		
		while(applicantSection.firstChild) {
			applicantSection.removeChild(applicantSection.firstChild)
		}
		
	//If user is not logged in (or an Admin) return them home
	} else {
		location.href = "https://www.jointutortree.com"
	}
})

//Calls when a tab is clicked, builds applicant blocks for filters
function showApplicants() {
	
	if (schoolFilters == "All Schools") {
		userDB.collection("userTest").where("tutorApplicantStatus", "in", tabFilters).get().then(async function(allTutors) {
			//remove all children when updated
			while(applicantSection.firstChild) {
				applicantSection.removeChild(applicantSection.firstChild)
			}
			//Reinitialize Counter
			const promises = []
			var applicantsArray = []
			var applicantEmails = []
			allTutors.forEach(function(doc)  {
				var 	applicantID = doc.id,
					applicantName = doc.data().name,
					applicantEmail = doc.data().email,
					applicantDate,
					applicantFirstName,
					applicantSchool = doc.data().school,
					applicantStatus = doc.data().tutorApplicantStatus
				applicantEmails.push(applicantEmail)
				var docRef = userDB.collection('userTest').doc(applicantID).collection('tutorApplication').doc('application')
				const promise = docRef.get().then(function(app) {
					console.log(applicantID)
					applicantDate = app.data().timeSubmitted
					console.log('then: ' + applicantDate)
					applicantFirstName = app.data().applicationFields.firstName
					applicantsArray.push([applicantDate, [applicantID, applicantName, applicantEmail, applicantSchool, applicantStatus, applicantFirstName]])
				})

				promises.push(promise)
			})

			Promise.all(promises).then(results => {
				console.log(applicantEmails)
				buildApplicants(applicantsArray)
			})
		})
		
	} else {
		userDB.collection("userTest").where("school", "==", schoolFilters).where("tutorApplicantStatus", "in", tabFilters).get().then(async function(allTutors) {

			//remove all children when updated
			while(applicantSection.firstChild) {
				applicantSection.removeChild(applicantSection.firstChild)
			}
			//Reinitialize Counter
			const promises = []
			var applicantsArray = []
			allTutors.forEach(function(doc)  {
				var 	applicantID = doc.id,
					applicantName = doc.data().name,
					applicantEmail = doc.data().email,
					applicantDate,
					applicantFirstName,
					applicantSchool = doc.data().school,
					applicantStatus = doc.data().tutorApplicantStatus

				var docRef = userDB.collection('userTest').doc(applicantID).collection('tutorApplication').doc('application')
				const promise = docRef.get().then(function(app) {
					applicantDate = app.data().timeSubmitted
					applicantFirstName = app.data().applicationFields.firstName
					applicantsArray.push([applicantDate, [applicantID, applicantName, applicantEmail, applicantSchool, applicantStatus, applicantFirstName]])
				})

				promises.push(promise)
			})

			Promise.all(promises).then(results => {
				console.log(results)
				buildApplicants(applicantsArray)
			})
		})
	}
}

function buildApplicants(applicantsArray) {
	var sortedApplicants = applicantsArray.sort(function(a, b) {
  		return b[0] - a[0];
	})
	
	sortedApplicants.forEach(function (applicant, count) {
		var applicantID = sortedApplicants[count][1][0],
			name = sortedApplicants[count][1][1],
			email = sortedApplicants[count][1][2],
			date = sortedApplicants[count][0],
			school = sortedApplicants[count][1][3],
			status = sortedApplicants[count][1][4],
		    	first = sortedApplicants[count][1][5]
		
		buildApplicantBlock(applicantID, count, name, email, date, school, status, first)
	})
}

function buildApplicantBlock(ID, count, name, email, date, school, status, first) {
	
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
	
	//Date Block
	var applicantDate = document.createElement('div')
	applicantDate.setAttribute('class', 'applicant-date-object')
	applicantDate.innerHTML = formatApplicantDate(date)
	applicantBlock.appendChild(applicantDate)
	
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
	} else if (status == "deleted") {
		applicantStatus.setAttribute('class', 'applicant-status-deleted')
		applicantStatus.innerHTML = "DELETED"
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
	applicantTutorAccept.setAttribute('onClick', 'updateApplicantStatus("accepted","' + ID + '","' + first + '","' + email + '")')
	applicantTutorAccept.innerHTML = 'check-circle'
	applicantActions.appendChild(applicantTutorAccept)

	var applicantTutorReject = document.createElement('div')
	applicantTutorReject.setAttribute('class', 'admin-tutor-reject')
	applicantTutorReject.setAttribute('onClick', 'updateApplicantStatus("rejected","' + ID + '","' + first + '","' + email + '")')
	applicantTutorReject.innerHTML = 'user-times'
	applicantActions.appendChild(applicantTutorReject)

	var applicantTutorWaitlist = document.createElement('div')
	applicantTutorWaitlist.setAttribute('class', 'admin-tutor-waitlist')
	applicantTutorWaitlist.setAttribute('onClick', 'updateApplicantStatus("waitlisted","' + ID + '","' + first +'","' + email +'")')
	applicantTutorWaitlist.innerHTML = 'hourglass-half'
	applicantActions.appendChild(applicantTutorWaitlist)

	var applicantTutorDelete = document.createElement('div')
	applicantTutorDelete.setAttribute('class', 'admin-tutor-delete')
	applicantTutorDelete.setAttribute('onClick', 'updateApplicantStatus("deleted","' + ID + '","' + first +'","' + email +'")')
	applicantTutorDelete.innerHTML = 'trash-alt'
	applicantActions.appendChild(applicantTutorDelete)
}

function updateApplicantStatus(status, ID, first, email) {
	userDB.collection('userTest')
		.doc(ID)
		.update( {'tutorApplicantStatus' : status,
			  'isTutor' : false } )
	
	
	if(status == 'accepted') {
		sendTutorAcceptanceEmail(email, first)
		
		userDB.collection('userTest')
		.doc(ID)
		.update( {'isTutor' : true } )
		
		mpIsFirstApprovedTutorAppResolution(email)
		
	} else if (status == 'rejected') {
		sendTutorRejectionEmail(email, first)
		
		mpIsRejectedTutorAppResolution(email)
	}
	
	showApplicants()
	
}

function sendTutorAcceptanceEmail(email, name) {
	var xhttp = new XMLHttpRequest();
    	var herokuURL = "https://tutortree2.herokuapp.com/sendTutorAcceptanceEmail/"+email+"/"+name
   	console.log(herokuURL)
	xhttp.open("GET", herokuURL, true);
	xhttp.send();
}

function sendTutorRejectionEmail(email, name) {
	var xhttp = new XMLHttpRequest();
    	var herokuURL = "https://tutortree2.herokuapp.com/sendTutorRejectionEmail/"+email+"/"+name
   	console.log(herokuURL)
	xhttp.open("GET", herokuURL, true);
	xhttp.send();
}

//TUTOR MODAL ELEMENTS________________________________________________________________________________

//Header Elements
var tutorImage = document.getElementById('tutor-image')
var tutorName = document.getElementById('tutor-name')
var tutorScore = document.getElementById('tutor-score')
var tutorTranscript = document.getElementById('transcript-div')
var tutorFaculty = document.getElementById('faculty-div')


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
var tutorHow = document.getElementById('tutor-how')
var tutorReferral = document.getElementById('tutor-referral')

var applicationScore = document.getElementById('application-score')
var majorScore = document.getElementById('major-score')
var yearScore = document.getElementById('year-score')
var whyScore = document.getElementById('why-score')
var groupsScore = document.getElementById('groups-score')

var majorMinus = document.getElementById('major-minus')
var majorPlus = document.getElementById('major-plus')
var yearMinus = document.getElementById('year-minus')
var yearPlus = document.getElementById('year-plus')
var whyMinus = document.getElementById('why-minus')
var whyPlus = document.getElementById('why-plus')
var groupsMinus = document.getElementById('groups-minus')
var groupsPlus = document.getElementById('groups-plus')

var updateApplicationResponses = document.getElementById('update-application-responses')
updateApplicationResponses.addEventListener('click', function() {
	var firstVal = tutorFirst.value,
	    lastVal = tutorLast.value,
	    majorVal = tutorMajor.value,
	    schoolVal = tutorSchool.value,
	    yearVal = tutorYear.value,
	    coursesVal = tutorCourses.value,
	    whyVal = tutorWhy.value,
	    groupsVal = tutorGroups.value,
	    howVal = tutorHow.value,
	    referralVal = tutorReferral.value
	
	
	userDB.collection("userTest")
			.doc(globalApplicantID)
			.collection("tutorApplication")
			.doc("application")
			.update( { 
				"applicationFields.firstName" : tutorFirst.value,
				"applicationFields.lastName" : tutorLast.value,
				"applicationFields.major" : tutorMajor.value,
				"applicationFields.schoolName" : tutorSchool.value,
				"applicationFields.year" : tutorYear.value,
				"applicationFields.courses" : tutorCourses.value,
				"applicationFields.whyTutor" : tutorWhy.value,
				"applicationFields.groups" : tutorGroups.value,
				"applicationFields.howHeard" : tutorHow.value,
				"applicationFields.referredBy" : tutorReferral.value
				} )
	
	updateApplicationResponses.style.display = "none"
})

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

var interviewScoreHeader = document.getElementById('interview-score')
var onTimeScore = document.getElementById('onTime-score')
var challengeScore = document.getElementById('challenge-score')
var approachScore = document.getElementById('approach-score')
var situationScore = document.getElementById('situation-score')
var confidenceScore = document.getElementById('confidence-score')
var preparedScore = document.getElementById('prepared-score')
var conceptScore = document.getElementById('concept-score')
var onlineScore = document.getElementById('online-score')
var treeScore = document.getElementById('tree-score')
var questionsScore = document.getElementById('questions-score')

var onTimeMinus = document.getElementById('onTime-minus')
var onTimePlus = document.getElementById('onTime-plus')
var challengeMinus = document.getElementById('challenge-minus')
var challengePlus = document.getElementById('challenge-plus')
var approachMinus = document.getElementById('approach-minus')
var approachPlus = document.getElementById('approach-plus')
var situationMinus = document.getElementById('situation-minus')
var situationPlus = document.getElementById('situation-plus')
var confidenceMinus = document.getElementById('confidence-minus')
var confidencePlus = document.getElementById('confidence-plus')
var preparedMinus = document.getElementById('prepared-minus')
var preparedPlus = document.getElementById('prepared-plus')
var conceptMinus = document.getElementById('concept-minus')
var conceptPlus = document.getElementById('concept-plus')
var onlineMinus = document.getElementById('online-minus')
var onlinePlus = document.getElementById('online-plus')
var treeMinus = document.getElementById('tree-minus')
var treePlus = document.getElementById('tree-plus')
var questionsMinus = document.getElementById('questions-minus')
var questionsPlus = document.getElementById('questions-plus')

var updateInterviewResponses = document.getElementById('update-interview-responses')
updateInterviewResponses.addEventListener('click', function() {

	userDB.collection("userTest")
			.doc(globalApplicantID)
			.collection("tutorApplication")
			.doc("interview")
			.update( { 
				"interviewNotes.onTimeNotes" : tutorOnTime.value,
				"interviewNotes.challengingNotes" : tutorChallenge.value,
				"interviewNotes.troubleNotes" : tutorApproach.value,
				"interviewNotes.situationNotes" : tutorSituation.value,
				"interviewNotes.confidenceNotes" : tutorConfidence.value,
				"interviewNotes.preparedNotes" : tutorPrepared.value,
				"interviewNotes.explainNotes" : tutorConcept.value,
				"interviewNotes.onlineNotes" : tutorOnline.value,
				"interviewNotes.helpNotes" : tutorTree.value,
				"interviewNotes.questionNotes" : tutorQuestions.value
				} )
	
	updateInterviewResponses.style.display = "none"
})


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
	
tutorCompletedInterview.addEventListener('click', function() {
	userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.get()
		.then(function(doc) {
			didCompleteInterview = doc.data().completedInterview
			tutorEmail = doc.data().email
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "completedInterview" : !didCompleteInterview } )
					.then(function() {
						if (didCompleteInterview) {
							mpInterviewCompleted(globalApplicantID, tutorEmail)
						} else {
							mpReverseInterviewCompleted(globalApplicantID, tutorEmail)
						}
					})
		})
})

//TUTOR MODAL FUNCTIONS_________________________________________________________________________

var globalApplicantID = ''

function showTutorModal(ID) {
	globalApplicantID = ID
	console.log(globalApplicantID)
	
	document.getElementById('tutor-info-modal').style.display = 'flex'
	//Stored values
	var assessmentScore = 0
	var interviewScore = 0
	var totalScore = 0
	
	//Core values for header
	userDB.collection("userTest").doc(ID).get().then(function(tutor) {
		tutorImage.src = tutor.data().profileImage
		tutorName.innerHTML = tutor.data().name
		tutorEmail.value = tutor.data().email
		tutorMajor.value = tutor.data().major
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
		
		while(tutorTranscript.firstChild) {
			tutorTranscript.removeChild(tutorTranscript.firstChild)
		}
		while(tutorFaculty.firstChild) {
			tutorFaculty.removeChild(tutorFaculty.firstChild)
		}
		//Display header transcript and faculty buttons
		if (didTranscript) {
			var transcriptButton = document.createElement('div')
			transcriptButton.innerHTML = 'file-alt'
			transcriptButton.setAttribute('class', 'tutor-transcript')
			transcriptButton.addEventListener('click', function() {
				window.open(doc.data().transcriptFile)
			})
			tutorTranscript.appendChild(transcriptButton)
		}
		
		if (didFaculty) {
			var facultyButton = document.createElement('div')
			facultyButton.innerHTML = 'graduation-cap'
			facultyButton.setAttribute('class', 'tutor-faculty')
			facultyButton.addEventListener('click', function() {
				window.open(doc.data().facultyFile)
			})
			tutorFaculty.appendChild(facultyButton)
		}
		
		//Conditionally Display Elements
		displayProgress(didRequest, didComplete, didTranscript, didFaculty)
		
		//Application Tab Data
		tutorFirst.value = doc.data().applicationFields.firstName
		tutorLast.value = doc.data().applicationFields.lastName
		tutorSchool.value = doc.data().applicationFields.schoolName
		tutorYear.value = doc.data().applicationFields.year
		tutorCourses.value = doc.data().applicationFields.courses
		tutorWhy.value = doc.data().applicationFields.whyTutor
		tutorGroups.value = doc.data().applicationFields.groups
		tutorHow.value = doc.data().applicationFields.howHeard
		tutorReferral.value = doc.data().applicationFields.referredBy
		
		applicationScore.innerHTML = doc.data().assessmentScore
		interviewScoreHeader.innerHTML = doc.data().interviewScore
		majorScore.innerHTML = doc.data().applicationPoints.majorPoints
		yearScore.innerHTML = doc.data().applicationPoints.yearPoints
		whyScore.innerHTML = doc.data().applicationPoints.whyTutorPoints
		groupsScore.innerHTML = doc.data().applicationPoints.groupsPoints
		
		setApplicationScoring()
		setApplicationFocuses()
		
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
		tutorOnTime.value = doc.data().interviewNotes.onTimeNotes
		tutorChallenge.value = doc.data().interviewNotes.challengingNotes
		tutorApproach.value = doc.data().interviewNotes.troubleNotes
		tutorSituation.value = doc.data().interviewNotes.situationNotes
		tutorConfidence.value = doc.data().interviewNotes.confidenceNotes
		tutorPrepared.value = doc.data().interviewNotes.preparedNotes
		tutorConcept.value = doc.data().interviewNotes.explainNotes
		tutorOnline.value = doc.data().interviewNotes.onlineNotes
		tutorTree.value = doc.data().interviewNotes.helpNotes
		tutorQuestions.value = doc.data().interviewNotes.questionNotes
		
		onTimeScore.innerHTML = doc.data().interviewScores.onTimeScore
		challengeScore.innerHTML = doc.data().interviewScores.challengingScore
		situationScore.innerHTML = doc.data().interviewScores.situationScore
		approachScore.innerHTML = doc.data().interviewScores.troubleScore
		confidenceScore.innerHTML = doc.data().interviewScores.confidenceScore
		preparedScore.innerHTML = doc.data().interviewScores.preparedScore
		conceptScore.innerHTML = doc.data().interviewScores.explainScore
		onlineScore.innerHTML = doc.data().interviewScores.onlineScore
		treeScore.innerHTML = doc.data().interviewScores.helpScore
		questionsScore.innerHTML = doc.data().interviewScores.questionScore
		
		
		setInterviewOnfocuses()
		setInterviewScoring()
		
	})
}



//Interview Onblurs_____________________________________________________________________________________________________

function setInterviewOnfocuses() {
	tutorOnTime.onfocus = function() {
		updateInterviewResponses.style.display = 'block'
	}
	tutorChallenge.onfocus = function() {
		updateInterviewResponses.style.display = 'block'
	}
	tutorApproach.onfocus = function() {
		updateInterviewResponses.style.display = 'block'
	}
	tutorSituation.onfocus = function() {
		updateInterviewResponses.style.display = 'block'
	}
	tutorConfidence.onfocus = function() {
		updateInterviewResponses.style.display = 'block'
	}
	tutorPrepared.onfocus = function() {
		updateInterviewResponses.style.display = 'block'
	}
	tutorConcept.onfocus = function() {
		updateInterviewResponses.style.display = 'block'
	}
	tutorOnline.onfocus = function() {
		updateInterviewResponses.style.display = 'block'
	}
	tutorTree.onfocus = function() {
		updateInterviewResponses.style.display = 'block'
	}
	tutorQuestions.onfocus = function() {
		updateInterviewResponses.style.display = 'block'
	}
}



//Application Onblurs_____________________________________________________________________________________________________

function setApplicationFocuses() {
	tutorFirst.onfocus = function() {
		updateApplicationResponses.style.display = "flex"
	}
	tutorLast.onfocus = function() {
		updateApplicationResponses.style.display = "flex"
	}
	tutorSchool.onfocus = function() {
		updateApplicationResponses.style.display = "flex"
	}
	tutorMajor.onfocus = function() {
		updateApplicationResponses.style.display = "flex"
	}
	tutorYear.onfocus = function() {
		updateApplicationResponses.style.display = "flex"
	}
	tutorCourses.onfocus = function() {
		updateApplicationResponses.style.display = "flex"
	}
	tutorWhy.onfocus = function() {
		updateApplicationResponses.style.display = "flex"
	}
	tutorGroups.onfocus = function() {
		updateApplicationResponses.style.display = "flex"
	}
	tutorHow.onfocus = function() {
		updateApplicationResponses.style.display = "flex"
	}
	tutorReferral.onfocus = function() {
		updateApplicationResponses.style.display = "flex"
	}
}

function setApplicationScoring() {
	
	majorMinus.addEventListener('click', function() {
		decrementApplicationScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().applicationPoints.majorPoints) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "applicationPoints.majorPoints" : valueToUpdate } )
		})
	})
	
	majorPlus.addEventListener('click', function() {
		incrementApplicationScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().applicationPoints.majorPoints) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "applicationPoints.majorPoints" : valueToUpdate } )
		})
	})
	
	yearMinus.addEventListener('click', function() {
		decrementApplicationScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().applicationPoints.yearPoints) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "applicationPoints.yearPoints" : valueToUpdate } )
		})
	})
	yearPlus.addEventListener('click', function() {
		incrementApplicationScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().applicationPoints.yearPoints) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "applicationPoints.yearPoints" : valueToUpdate } )
		})
	})
	whyMinus.addEventListener('click', function() {
		decrementApplicationScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().applicationPoints.whyTutorPoints) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "applicationPoints.whyTutorPoints" : valueToUpdate } )
		})
	})
	whyPlus.addEventListener('click', function() {
		incrementApplicationScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().applicationPoints.whyTutorPoints) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "applicationPoints.whyTutorPoints" : valueToUpdate } )
		})
	})
	groupsMinus.addEventListener('click', function() {
		decrementApplicationScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().applicationPoints.groupsPoints) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "applicationPoints.groupsPoints" : valueToUpdate } )
		})
	})
	groupsPlus.addEventListener('click', function() {
		incrementApplicationScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().applicationPoints.groupsPoints) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "applicationPoints.groupsPoints" : valueToUpdate } )
		})
	})
	
}

function incrementInterviewScore() {
	userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScore) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "interviewScore" : valueToUpdate } )
		})
	
}

function incrementApplicationScore() {
	userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().assessmentScore) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "assessmentScore" : valueToUpdate } )
		})
	
}

function decrementInterviewScore() {
	userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScore) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "interviewScore" : valueToUpdate } )
		})
	
}

function decrementApplicationScore() {
	userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().assessmentScore) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("application")
				.update( { "assessmentScore" : valueToUpdate } )
		})
	
}

function setInterviewScoring() {
	onTimeMinus.addEventListener('click', function() {
		decrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.onTimeScore) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.onTimeScore" : valueToUpdate } )
		})
	})
	onTimePlus.addEventListener('click', function() {
		incrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.onTimeScore) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.onTimeScore" : valueToUpdate } )
		})
	})
	
	challengeMinus.addEventListener('click', function() {
		decrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.challengingScore) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.challengingScore" : valueToUpdate } )
		})
	})
	challengePlus.addEventListener('click', function() {
		incrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.challengingScore) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.challengingScore" : valueToUpdate } )
		})
	})
	
	approachMinus.addEventListener('click', function() {
		decrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.troubleScore) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.troubleScore" : valueToUpdate } )
		})
	})
	approachPlus.addEventListener('click', function() {
		incrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.troubleScore) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.troubleScore" : valueToUpdate } )
		})
	})
	
	situationMinus.addEventListener('click', function() {
		decrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.situationScore) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.situationScore" : valueToUpdate } )
		})
	})
	situationPlus.addEventListener('click', function() {
		incrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.situationScore) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.situationScore" : valueToUpdate } )
		})
	})
	
	confidenceMinus.addEventListener('click', function() {
		decrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.confidenceScore) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.confidenceScore" : valueToUpdate } )
		})
	})
	confidencePlus.addEventListener('click', function() {
		incrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.confidenceScore) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.confidenceScore" : valueToUpdate } )
		})
	})
	
	preparedMinus.addEventListener('click', function() {
		decrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.preparedScore) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.preparedScore" : valueToUpdate } )
		})
	})
	preparedPlus.addEventListener('click', function() {
		incrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.preparedScore) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.preparedScore" : valueToUpdate } )
		})
	})
	
	conceptMinus.addEventListener('click', function() {
		decrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.explainScore) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.explainScore" : valueToUpdate } )
		})
	})
	conceptPlus.addEventListener('click', function() {
		incrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.explainScore) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.explainScore" : valueToUpdate } )
		})
	})
	
	onlineMinus.addEventListener('click', function() {
		decrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.onlineScore) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.onlineScore" : valueToUpdate } )
		})
	})
	onlinePlus.addEventListener('click', function() {
		incrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.onlineScore) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.onlineScore" : valueToUpdate } )
		})
	})
	
	treeMinus.addEventListener('click', function() {
		decrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.helpScore) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.helpScore" : valueToUpdate } )
		})
	})
	treePlus.addEventListener('click', function() {
		incrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.helpScore) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.helpScore" : valueToUpdate } )
		})
	})
	
	questionsMinus.addEventListener('click', function() {
		decrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.questionScore) - 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.questionScore" : valueToUpdate } )
		})
	})
	questionsPlus.addEventListener('click', function() {
		incrementInterviewScore()
		
		userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("interview")
		.get()
		.then(function(doc) {
			valueToUpdate = parseInt(doc.data().interviewScores.questionScore) + 1
			userDB.collection("userTest")
				.doc(globalApplicantID)
				.collection("tutorApplication")
				.doc("interview")
				.update( { "interviewScores.questionScore" : valueToUpdate } )
		})
	})
	
	
}

function showTranscript(transcriptFile) {
	window.open(transcriptFile)
}

function showFaculty(facultyFile) {
	window.open(facultyFile)
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
		tutorTranscriptComplete.style.display = "block"
		tutorTranscriptIncomplete.style.display = "none"
	} else {
		tutorTranscriptComplete.style.display = "none"
		tutorTranscriptIncomplete.style.display = "block"
	}

	//Faculty
	if (didFaculty) {
		tutorFacultyComplete.style.display = "block"
		tutorFacultyIncomplete.style.display = "none"
	} else {
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


//Upload documents functions ___________________________________________________________________________________________

storageRef = storageService.ref()

//Faculty Upload
var facultyButton = document.getElementById('upload-faculty')
facultyButton.addEventListener('click', openFacultyRecDialog)

function openFacultyRecDialog() {
	hiddenFacultyRecButton.click();
}

var hiddenFacultyRecButton = document.getElementById("faculty-admin-select") 
hiddenFacultyRecButton.addEventListener('change', handleFacultyRecUploadChange);

var selectedFacultyRecFile;
function handleFacultyRecUploadChange(e) {
	console.log('hidden button clicked for : ' + globalApplicantID)
	selectedFacultyRecFile = e.target.files[0];
	document.getElementById("faculty-preview-block").style.display = "flex"
	document.getElementById("faculty-preview").innerHTML = selectedFacultyRecFile.name
}

document.getElementById('submit-faculty').addEventListener('click', handleFacultyRecUpload)
async function handleFacultyRecUpload() {
	const uploadTask = await storageRef.child(`faculty/${selectedFacultyRecFile.name}`).put(selectedFacultyRecFile);
	uploadAndUpdateFirebaseFacultyRec()
}

//final submit button and update firebase
async function uploadAndUpdateFirebaseFacultyRec() {
	var facultyRecFileURL = ""
	await storageRef.child('/faculty/'+selectedFacultyRecFile.name)
		.getDownloadURL()
		.then(function(url) { facultyRecFileURL = url.toString() })
	userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.update( {"facultyFile" : facultyRecFileURL,
			"uploadedFaculty" : true })
	.then(function() {
		document.getElementById("faculty-preview-block").style.display = "none"
	})
}


//Transcript Upload
var transcriptButton = document.getElementById('upload-transcript')
transcriptButton.addEventListener('click', openTranscriptRecDialog)

function openTranscriptRecDialog() {
	hiddenTranscriptButton.click();
}

var hiddenTranscriptButton = document.getElementById("transcript-admin-select") 
hiddenTranscriptButton.addEventListener('change', handleTranscriptUploadChange);

var selectedTranscriptFile;
function handleTranscriptUploadChange(e) {
	console.log('hidden button clicked for : ' + globalApplicantID)
	selectedTranscriptFile = e.target.files[0];
	document.getElementById("transcript-preview-block").style.display = "flex"
	document.getElementById("transcript-preview").innerHTML = selectedTranscriptFile.name
}

document.getElementById('submit-transcript').addEventListener('click', handleTranscriptUpload)
async function handleTranscriptUpload() {
	const uploadTask = await storageRef.child(`faculty/${selectedTranscriptFile.name}`).put(selectedTranscriptFile);
	uploadAndUpdateFirebaseTranscript()
}

//final submit button and update firebase
async function uploadAndUpdateFirebaseTranscript() {
	var transcriptFileURL = ""
	await storageRef.child('/faculty/'+selectedTranscriptFile.name)
		.getDownloadURL()
		.then(function(url) { transcriptFileURL = url.toString() })
	userDB.collection("userTest")
		.doc(globalApplicantID)
		.collection("tutorApplication")
		.doc("application")
		.update( {"transcriptFile" : transcriptFileURL,
			"uploadedTranscript" : true })
	.then(function() {
		document.getElementById("transcript-preview-block").style.display = "none"
	})
}

	
