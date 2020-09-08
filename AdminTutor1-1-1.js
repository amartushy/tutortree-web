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
					    	firstName = applicant.data().applicationFields.firstName,
					    	lastName = applicant.data().applicationFields.lastName,
					    	school = applicant.data().school



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
