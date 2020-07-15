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
    
	//Assessment completion view
	if (doc.get("preInterview") == false) {
		assessmentIncomplete.style.display = "block"
		assessmentComplete.style.display = "none"
            
	document.getElementById("onboarding-assessment")
        	.setAttribute('onClick', 'assessmentForm("'+userID+'")')                
        } else {
        	assessmentIncomplete.style.display = "none"
            	assessmentComplete.style.display = "block"
        } 
		
        //Interview completion view
        if (doc.get("interview") == false) {
        	interviewIncomplete.style.display = "block"
            	interviewComplete.style.display = "none"
        } else {
        	interviewIncomplete.style.display = "none"
            	interviewComplete.style.display = "block"        
        }
        document.getElementById("schedule-interview")
            	.setAttribute('onClick', 'scheduleInterview()')

	//Upload transcript view
	if (doc.get("transcript") == false ) {
	    	transcriptIncomplete.style.display = "block"
            	transcriptComplete.style.display = "none"
	} else {
	    	transcriptIncomplete.style.display = "none"
            	transcriptComplete.style.display = "block"
	}
	document.getElementById("upload-transcript").addEventListener('click', openTranscriptDialog)
		
	//Upload faculty view
	if (doc.get("transcript") == false ) {
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
		document.getElementById("submit-transcript").addEventListener('click', handleTranscriptUpload )
	}
	  
	var selectedFacultyFile;
	function handleFacultyUploadChange(e) {
		selectedFacultyFile = e.target.files[0];
		document.getElementById("faculty-preview-block").style.display = "flex"
		document.getElementById("faculty-file-preview").innerHTML = selectedFacultyFile.name
		document.getElementById("submit-faculty").addEventListener('click', handleFacultyUpload )		
	}

	async function handleTranscriptUpload() {
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
		.update( {"transcriptFile" : transcriptFileURL,
			  "transcript" : true })
		document.getElementById("transcript-preview-block").style.display = "none"

	}
	  
	async function uploadAndUpdateFirebaseFaculty() {
		var facultyFileURL = ""
		await storageRef.child('/faculty/'+selectedFacultyFile.name)
			.getDownloadURL()
			.then(function(url) { facultyFileURL = url.toString() })
		userDB.collection("users")
		.doc(userID)
		.update( {"facultyFile" : facultyFileURL,
			 "faculty" : true })
		document.getElementById("faculty-preview-block").style.display = "none"

	}	

	//IF USER IS NOT LOGGED IN	  
	} else {
		location.href = "https://www.jointutortree.com"
	}
});


//Pre-interview functions
var isFormShowing = false
function assessmentForm(userID) {
    if (isFormShowing) {
        console.log(isFormShowing)
        document.getElementById("assessment-form-block")
        .style.display = "none"
        isFormShowing = false
    } else {
        console.log(isFormShowing)
        document.getElementById("assessment-form-block")
        .style.display = "block"
        isFormShowing = true
    }

    document.getElementById("submit-assessment")
        .setAttribute('onClick', 'submitAssessment("'+userID+'")')
}

function submitAssessment(userID) {
		var userDB = firebase.firestore()

		userDB.collection("users").doc(userID).get().then(function(doc) {
    
        var firstName = doc.get("firstName")
        var lastName = doc.get("lastName")
        var major = document.getElementById("major")
        var year = document.getElementById("year")
        var email = document.getElementById("email")
        var hours = document.getElementById("hours")
        var school = doc.get("school")
        var courses = document.getElementById("courses")
        var experience = document.getElementById("experience")
        var qualities = document.getElementById("qualities")
        var whyTutor = document.getElementById("whyTutor")
        var groups = document.getElementById("groups")

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
        }
        userDB.collection("users").doc(userID).update( {"assessment" : preInterviewData} )
        .then(function() {
            console.log("sent")
        });
        //https://script.google.com/macros/s/AKfycbyn1b2w9_CFJ3zOFT-fapH2WMdOQVC1DfRjLy6REiM5jl1MQMY/exec
		})
}


//Schedule Interview Functions
function scheduleInterview() {
	var userDB = firebase.firestore()
    	userDB.collection("users").doc(userID).get().then(function(doc) {
    		var hasSubmittedAssessment = doc.get("preInterview")
		var isApproved = doc.get("interview")
        if (hasSubmittedAssessment) {
		if (isApproved) {
			alert("Your tutor coordinator has been notified. Please check your email for a time to meet.")
		} else {
			document.getElementById("request-interview-form").style.display = "block"
		}
        } else {
        		alert("Please complete your Pre-Interview Assessment before scheduling an interview")
        }
    })
}

//Upload Unofficial Transcript
function uploadTranscript() {


}