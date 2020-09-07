firebase.auth().onAuthStateChanged(function(user) {
	var assessmentIncomplete = document.getElementById("assessment-incomplete")
  	var assessmentComplete = document.getElementById("assessment-complete")
	var interviewIncomplete = document.getElementById("interview-incomplete")
	var interviewComplete = document.getElementById("interview-complete")
	var transcriptIncomplete = document.getElementById("transcript-incomplete")
	var transcriptComplete = document.getElementById("transcript-complete")
	var facultyIncomplete = document.getElementById("faculty-incomplete")
	var facultyComplete = document.getElementById("faculty-complete")

  if (user) {
	var userDB = firebase.firestore()
	var userID = user.uid
	console.log("user is signed in with uid: " + userID)

	userDB.collection("userTest").doc(userID).get().then(function(doc) {
		tutorApplicantStatus = capitalizeFirstLetter(doc.data().tutorApplicantStatus)

		document.getElementById("tutor-hiring-status").innerHTML = tutorApplicantStatus

	})

	userDB.collection("userTest").doc(userID).collection("tutorApplication").doc("application").onSnapshot(function(doc) {
    	//Change header to include name
	document.getElementById("onboarding-header").innerHTML = "Welcome back, "+doc.get("applicationFields.firstName")	
		
	//Assessment completion view
	if (doc.get("didSubmitPreInterview") == false) {
		assessmentIncomplete.style.display = "block"
		assessmentComplete.style.display = "none"              
        } else {
        	assessmentIncomplete.style.display = "none"
            	assessmentComplete.style.display = "block"
        } 
	document.getElementById("onboarding-assessment")
        	.setAttribute('onClick', 'assessmentForm("'+userID+'")')  
		
        //Interview completion view
        if (doc.get("didRequestInterview") == false) {
        	interviewIncomplete.style.display = "block"
            	interviewComplete.style.display = "none"
        } else {
        	interviewIncomplete.style.display = "none"
            	interviewComplete.style.display = "block"        
        }
        document.getElementById("schedule-interview")
            	.setAttribute('onClick', 'scheduleInterview("'+userID+'")')

	//Upload transcript view
	if (doc.get("uploadedTranscript") == false ) {
		console.log("uh")
	    	transcriptIncomplete.style.display = "block"
            	transcriptComplete.style.display = "none"
	} else {
		console.log("what")
	    	transcriptIncomplete.style.display = "none"
            	transcriptComplete.style.display = "block"
	}
	document.getElementById("upload-transcript").addEventListener('click', openTranscriptDialog)
		
	//Upload faculty view
	if (doc.get("uploadedFaculty") == false ) {
	    	facultyIncomplete.style.display = "block"
            	facultyComplete.style.display = "none"
	} else {
	    	facultyIncomplete.style.display = "none"
            	facultyComplete.style.display = "block"
	}
	document.getElementById("upload-faculty-rec").addEventListener('click', openFacultyDialog)
		
    });
    storageRef = storageService.ref()
	  
    	//HANDLE FILE UPLOADS
	function openTranscriptDialog() {
     	 	hiddenTranscriptButton.click();
    	}
	function openFacultyDialog() {
		hiddenFacultyButton.click();
	}
	  
    	var hiddenTranscriptButton = document.getElementById("transcript-select")
   	hiddenTranscriptButton.addEventListener('change', handleTranscriptUploadChange);
	var hiddenFacultyButton = document.getElementById("faculty-select")
	hiddenFacultyButton.addEventListener('change', handleFacultyUploadChange);
	
	var selectedTranscriptFile;
	function handleTranscriptUploadChange(e) {
		selectedTranscriptFile = e.target.files[0];
		document.getElementById("transcript-preview-block").style.display = "flex"
		document.getElementById("transcript-file-preview").innerHTML = selectedTranscriptFile.name
		document.getElementById("submit-transcript-button").addEventListener('click', handleTranscriptUpload )
	}
	  
	var selectedFacultyFile;
	function handleFacultyUploadChange(e) {
		selectedFacultyFile = e.target.files[0];
		document.getElementById("faculty-preview-block").style.display = "flex"
		document.getElementById("faculty-file-preview").innerHTML = selectedFacultyFile.name
		document.getElementById("submit-faculty").addEventListener('click', handleFacultyUpload )		
	}

	async function handleTranscriptUpload() {
		console.log("I was clicked")
		const uploadTask = await storageRef.child(`transcripts/${selectedTranscriptFile.name}`).put(selectedTranscriptFile);
		uploadAndUpdateFirebaseTranscript()
	}
	async function handleFacultyUpload() {
		const uploadTask = await storageRef.child(`faculty/${selectedFacultyFile.name}`).put(selectedFacultyFile);
		uploadAndUpdateFirebaseFaculty()
	}

	//Final Submit Button and Update Firebase
	async function uploadAndUpdateFirebaseTranscript() {
		var transcriptFileURL = ""
		await storageRef.child('/transcripts/'+selectedTranscriptFile.name)
			.getDownloadURL()
			.then(function(url) { transcriptFileURL = url.toString() })
		userDB.collection("userTest")
			.doc(userID)
			.collection("tutorApplication")
			.doc("application")
			.update( {"transcriptFile" : transcriptFileURL,
			  	"uploadedTranscript" : true })
		.then(function() {
			document.getElementById("transcript-preview-block").style.display = "none"
			mpTranscriptUpload()
		})
	}
	  
	async function uploadAndUpdateFirebaseFaculty() {
		var facultyFileURL = ""
		await storageRef.child('/faculty/'+selectedFacultyFile.name)
			.getDownloadURL()
			.then(function(url) { facultyFileURL = url.toString() })
		userDB.collection("userTest")
			.doc(userID)
			.collection("tutorApplication")
			.doc("application")
			.update( {"facultyFile" : facultyFileURL,
			 	"uploadedFaculty" : true })
		.then(function() {
			document.getElementById("faculty-preview-block").style.display = "none"
			mpFacultyRecUpload()
		})
	}	

	//IF USER IS NOT LOGGED IN	  
	} else {
		location.href = "https://www.jointutortree.com"
	}
});


//Pre-interview functions
var isFormShowing = false
function assessmentForm(userID) {
	var userDB = firebase.firestore()
	userDB.collection("userTest").doc(userID).collection("tutorApplication").doc("application").get().then(function(doc) {
		if (doc.get("didSubmitPreInterview") ) {
		    	alert("You've already submitted a pre-interview")
		} else {
			if (isFormShowing ) {
				console.log(isFormShowing)
				document.getElementById("assessment-form-block")
					.style.display = "none"
				isFormShowing = false
			} else  {
				console.log(isFormShowing)
				document.getElementById("assessment-form-block")
					.style.display = "block"
				isFormShowing = true
			}
		}
	})
    	document.getElementById("submit-assessment")
        	.setAttribute('onClick', 'submitAssessment("'+userID+'")')
}

function submitAssessment(userID) {
	var userDB = firebase.firestore()
	userDB.collection("userTest").doc(userID).collection("tutorApplication").doc("assessment").get().then(function(doc) {
    
        var major = document.getElementById("major")
        var year = document.getElementById("year")
        var email = document.getElementById("email")
        var hours = document.getElementById("hours")
        var courses = document.getElementById("courses")
        var experience = document.getElementById("experience")
        var qualities = document.getElementById("qualities")
        var whyTutor = document.getElementById("whyTutor")
        var groups = document.getElementById("groups")
	var mobileOS = document.getElementById("mobile-os")

        var timeSubmitted = new Date()
	
	var mixpanelDict = {
		"major" : major,
		"groups" : groups,
		"experience" : experience,
		"courses" : courses,
		"hours" : hours,
		"qualities" : qualities,
		"whyTutor" : whyTutor,
		"year" : year,
		"mobileOS" : mobileOS
	}
	
	var assessmentData = {
                    "assessmentFields" : {
                        "courses" : courses.value,
                        "experience" : experience.value,
                        "groups" : groups.value,
                        "hours" : hours.value,
                        "major" : major.value,
                        "qualities" : qualities.value,
                        "whyTutor" : whyTutor.value,
                        "year" : year.value,
			"mobileOS" : mobileOS.value
                    },

                    "assessmentScores" : {
                        "experiencePoints" : 0,
                        "qualitiesPoints" : 0,
                        "whyTutorPoints" : 0,
                        "yearPoints" : 0,
			                  "activitiesPoints" : 0
                    }
                }
        userDB.collection("userTest")
		.doc(userID)
		.collection("tutorApplication")
		.doc("assessment")
		.update( assessmentData )
		
	userDB.collection("userTest")
		.doc(userID)
		.collection("tutorApplication")
		.doc("application")
		.update( {"didSubmitPreInterview" : true } )
        .then(function() {
            	console.log("sent")
		document.getElementById("assessment-completion").style.display = "flex"
		document.getElementById("assessment-form-block").style.display = "none"
		
		//mpPreInterviewSubmission(mixpanelDict)		
        });
})
}

//Schedule Interview
var isScheduleShowing = false
function scheduleInterview(userID) {
	
	if (isScheduleShowing) {
		document.getElementById("request-interview-form")
			.style.display = "none"
		isScheduleShowing = false
	} else {
		document.getElementById("request-interview-form")
			.style.display = "block"
		isScheduleShowing = true	
	}	
	
	var applicantsName = ''
	var applicantsEmail = ''
	var applicantsSchool = ''
	var userDB = firebase.firestore()
	
	userDB.collection("userTest").doc(userID).collection("tutorApplication").doc("application").get().then(function(doc) {
		applicantsName = doc.data().applicationFields.firstName + ' ' + doc.data().applicationFields.lastName
		applicantsSchool = doc.data().school
		applicantsEmail = doc.data().email
		destinationSchool = doc.data().destinationSchool
		})
	document.getElementById("submit-interview-request").addEventListener('click', function() {
		userDB.collection("userTest")
		.doc(userID)
		.collection("tutorApplication")
		.doc("application")
		.update( { "didRequestInterview" : true } )
		//document.getElementById("interview-complete").style.display = "flex"
		//document.getElementById("request-interview-form").style.display = "none"
		var messageString = applicantsName + ' has opened the calendly window to schedule an interview. Please check your email to confirm this user has actually scheduled. Their email is ' + applicantsEmail + ', their school is ' + applicantsSchool
		sendEmailTo('mcloftus@jointutortree.com', 'Calendly Window Opened - Look out for an interview', messageString)
		mpRequestVirtualInterview()
		
	})
}

function sendEmailTo(email, title, message) {
	var xhttp = new XMLHttpRequest();
    	var herokuURL = "https://tutortree2.herokuapp.com/sendEmailTo/"+email+"/"+title+"/"+message
   	console.log(herokuURL)
	xhttp.open("GET", herokuURL, true);
	xhttp.send();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
