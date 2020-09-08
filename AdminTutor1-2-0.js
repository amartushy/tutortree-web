//Initialize database
var userDB = firebase.firestore()

//Tab filters
var allTab = document.getElementById('admin-tutor-all')
var rejectedTab = document.getElementById('admin-tutor-rejected')
var waitlistedTab = document.getElementById('admin-tutor-waitlisted')
var pendingTab = document.getElementById('admin-tutor-pending')
var approvedTab = document.getElementById('admin-tutor-approved')

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

//Add school onclick listeners
tutortreeButton.addEventListener('click', tutortreeApplicants)

//School filter functions
function tutortreeApplicants() {
	tabFilters = ["pending", "waitlisted", "rejected", "approved"]
	schoolFilters = ""
	showApplicants()
}

//Section to append all applicants
var applicantSection = document.getElementById('tutor-applicant-section')

//FILTERS
var tabFilters = ["pending", "waitlisted", "rejected", "approved"]
var schoolFilters = ""

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var userID = user.uid
		 
		//Check if user is admin, else redirect: TODO
		
		
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
	} else if (status == "approved") {
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
