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

	userDB.collection("users").doc(userID)
    		.onSnapshot(function(doc) {
    	//Change header to include name
	document.getElementById("onboarding-header").innerHTML = "Welcome back, "+doc.get("firstName")	
		
	//Assessment completion view
	if (doc.get("application.didSubmitPreInterview") == false) {
		assessmentIncomplete.style.display = "block"
		assessmentComplete.style.display = "none"              
        } else {
        	assessmentIncomplete.style.display = "none"
            	assessmentComplete.style.display = "block"
        } 
	document.getElementById("onboarding-assessment")
        	.setAttribute('onClick', 'assessmentForm("'+userID+'")')  
		
        //Interview completion view
        if (doc.get("application.didRequestInterview") == false) {
        	interviewIncomplete.style.display = "block"
            	interviewComplete.style.display = "none"
        } else {
        	interviewIncomplete.style.display = "none"
            	interviewComplete.style.display = "block"        
        }
        document.getElementById("schedule-interview")
            	.setAttribute('onClick', 'scheduleInterview("'+userID+'")')

	//Upload transcript view
	if (doc.get("application.uploadedTranscript") == false ) {
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
	if (doc.get("application.uploadedFaculty") == false ) {
	    	facultyIncomplete.style.display = "block"
            	facultyComplete.style.display = "none"
	} else {
	    	facultyIncomplete.style.display = "none"
            	facultyComplete.style.display = "block"
	}
	document.getElementById("upload-faculty-rec").addEventListener('click', openFacultyDialog)
	
	if( doc.get("application.isapproved") == true ) {
		document.getElementById("final-block").style.display = "flex"
	}
		
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
		userDB.collection("users")
			.doc(userID)
			.update( {"application.transcriptFile" : transcriptFileURL,
			  	"application.uploadedTranscript" : true })
		.then(function() {
			document.getElementById("transcript-preview-block").style.display = "none"
			transcriptUpload()
		})
	}
	  
	async function uploadAndUpdateFirebaseFaculty() {
		var facultyFileURL = ""
		await storageRef.child('/faculty/'+selectedFacultyFile.name)
			.getDownloadURL()
			.then(function(url) { facultyFileURL = url.toString() })
		userDB.collection("users")
			.doc(userID)
			.update( {"application.facultyFile" : facultyFileURL,
			 	"application.uploadedFaculty" : true })
		.then(function() {
			document.getElementById("faculty-preview-block").style.display = "none"
			facultyRecUpload()
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
	userDB.collection("users").doc(userID).get().then(function(doc) {
		if (doc.get("application.didSubmitPreInterview") ) {
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
	userDB.collection("users").doc(userID).get().then(function(doc) {
    
        var firstName = doc.get("firstName")
	document.getElementById('firstName').value = firstName
        var lastName = doc.get("lastName")
	document.getElementById('lastName').value = lastName
        var major = document.getElementById("major")
        var year = document.getElementById("year")
        var email = document.getElementById("email")
        var hours = document.getElementById("hours")
        var school = doc.get("school")
	document.getElementById('school').value = school
        var courses = document.getElementById("courses")
        var experience = document.getElementById("experience")
        var qualities = document.getElementById("qualities")
        var whyTutor = document.getElementById("whyTutor")
        var groups = document.getElementById("groups")
	var mobileOS = document.getElementById("mobile-os")

        var timeSubmitted = new Date()

        var preInterviewData = {
            "metadata" : {
                "timeSubmitted" : timeSubmitted,
                "approved" : false
            },
            "firstName" : firstName,
            "lastName" : lastName,
            "major" : major.value,
            "year" : year.value,
            "email" : email.value,
            "hours" : hours.value,
            "school" : school,
            "courses" : courses.value,
            "experience" : experience.value,
            "qualities" : qualities.value,
            "whyTutor" : whyTutor.value,
            "groups" : groups.value,
	    "mobileOS" : mobileOS.value
        }
        userDB.collection("users")
		.doc(userID)
		.update( {"application.assessment" : preInterviewData,
		       	  "application.didSubmitPreInterview" : true } )
	
        .then(function() {
            	console.log("sent")
		document.getElementById("assessment-completion").style.display = "flex"
		document.getElementById("assessment-form-block").style.display = "none"
		
		preInterviewSubmission(preInterviewData)
		
		var url = 'https://script.google.com/macros/s/AKfycbyn1b2w9_CFJ3zOFT-fapH2WMdOQVC1DfRjLy6REiM5jl1MQMY/exec'
		var $form = $('form#assessment-form')

		var jqxhr = $.ajax ({
			url: url,
			method: "GET",
			dataType: "json",
			data: $form.serializeArray(),

			success: function (rooms) {
				console.log("submitted")
			}
		})		
        });
})
}

//Schedule Interview
var isScheduleShowing = false
function scheduleInterview(userID) {
	var applicantsName = ''
	var applicantsEmail = ''
	var userDB = firebase.firestore()
	userDB.collection("users").doc(userID).get().then(function(doc) {
		applicantsName = doc.data().firstName + ' ' + doc.data().lastName
		applicantsEmail = doc.data().email
		if ( doc.get("application.didRequestInterview") ) {
			alert("Your tutor coordinator has been notified. Please check your email for a time to meet.")
		} else {
			if ( doc.get("application.didSubmitPreInterview") ) {
				if (isScheduleShowing) {
					document.getElementById("request-interview-form")
						.style.display = "none"
					isScheduleShowing = false
		    		} else {
					document.getElementById("request-interview-form")
						.style.display = "block"
					isScheduleShowing = true	
				}
			} else {
				alert("Please complete your Pre-Interview Assessment before scheduling an interview")
			}
			
		}
	})
	document.getElementById("submit-interview-request").addEventListener('click', function() {
		userDB.collection("users")
		.doc(userID)
		.update( { "application.didRequestInterview" : true } )
		document.getElementById("interview-complete").style.display = "flex"
		document.getElementById("request-interview-form").style.display = "none"
		var messageString = applicantsName + ' has completed their PIA and is requesting to schedule an interview. Their email is ' + applicantsEmail
		sendEmailTo('mcloftus@jointutortree.com', 'New Interview Schedule Request', messageString)
		requestVirtualInterview()
	})
}

function sendEmailTo(email, title, message) {
	var xhttp = new XMLHttpRequest();
    	var herokuURL = "https://tutortree-development.herokuapp.com/sendEmailTo/"+email+"/"+title+"/"+message
   	console.log(herokuURL)
	xhttp.open("GET", herokuURL, true);
	xhttp.send();
}

