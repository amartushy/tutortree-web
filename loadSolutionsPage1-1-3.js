var solutionsRef = database.ref("/updateDatabase/solutions/")


//UPLOAD NEW SOLUTION REQUEST MODAL
function loadNewSolutionModal(usersId) {

      var storageRef = storageService.ref();
			document.getElementById("new-question-modal-wrapper").style.display = "flex"
      

      var newSolutionSubject = document.getElementById("new-solution-subject")
      var newSolutionCourse = document.getElementById("new-solution-course")

      var newSolutionPhoto = document.getElementById("new-solution-photo")
      newSolutionPhoto.addEventListener('click', openNewSolutionDialog)
      var hiddenNewSolutionButton = document.getElementById("new-solution-select")
      hiddenNewSolutionButton.addEventListener('change', handleNewSolutionUploadChange);


      function openNewSolutionDialog() {
            hiddenNewSolutionButton.click();
      }

      var newSolutionPreviewFile;
      function handleNewSolutionUploadChange(e) {
           newSolutionPreviewFile = e.target.files[0];
           document.getElementById("new-solution-preview").innerHTML = newSolutionPreviewFile.name
      }

      document.getElementById('new-solution-upload').addEventListener('click', handleNewSolutionUpload);
      async function handleNewSolutionUpload(e) {
           const uploadTask = await storageRef.child(`problems/${newSolutionPreviewFile.name}`).put(newSolutionPreviewFile);
           uploadNewSolutionRequest()
      }

      //Final Submit Button and Update Firebase
      async function uploadNewSolutionRequest() {
           var problemFileURL = ""
           await storageRef.child('/problems/'+newSolutionPreviewFile.name).getDownloadURL().then(function(url) {
                  problemFileURL = url.toString()
           })
           var dictToUpdate = {}
           var newProblemDict = {
           						"title" : document.getElementById("new-solution-title").value,
                      "problemText" : document.getElementById("new-solution-text").value,
                      "problemURL" : problemFileURL,
                      "approved" : 0,
                      "solution" : 0,
                      "metadata" : {
                          "uploadedBy" : usersID,
                          "dateUploaded" : Math.round((new Date()).getTime() / 1000),
                          "views" : 0,
                          "upvotes" : 0,
                       		}
          } 
          var problemID = create8CharID()
           dictToUpdate[problemID] = newProblemDict
                console.log(dictToUpdate)
                solutionsRef.child("/"+newSolutionSubject.value+"/"+newSolutionCourse.value+"/").update(dictToUpdate)
                sendSolutionRequestEmail

     }
}

//Send email to info@ when new solution is requested
function sendSolutionRequestEmail(problemId) {
    var xhttp = new XMLHttpRequest();
    const message  = "Problem ID: " +problemId
    var title = "New Solution Request"
    var herokuURL = "https://tutortree-development.herokuapp.com/sendEmailTo/info@jointutortree.com/"+title+"/"+message
    console.log(herokuURL)
		xhttp.open("GET", herokuURL, true);
		xhttp.send();
}


//UPLOAD SOLUTION FROM TUTORS END
function loadUploadModal(tutorsID) {
		var storageRef = storageService.ref();
    
		var uploadSubjectMath = document.getElementById("mathematics")
    var uploadSubjectChemistry = document.getElementById("chemistry")
    var uploadSubjectBiology = document.getElementById("biology")
		var uploadSubjectPhysics = document.getElementById("physics")
    
    uploadSubjectMath.addEventListener('click', changeMath)
    uploadSubjectChemistry.addEventListener('click', changeChemistry)
    uploadSubjectBiology.addEventListener('click', changeBiology)
    uploadSubjectPhysics.addEventListener('click', changePhysics)
    
    var uploadSolutionSubject = ''
    function changeMath() {
        uploadSolutionSubject = 'Mathematics'
        document.getElementById("subject-header-block").innerHTML = "Subject: " + uploadSolutionSubject
    }
    function changeChemistry() {
        uploadSolutionSubject = 'Mathematics'
        document.getElementById("subject-header-block").innerHTML = "Subject: " + uploadSolutionSubject
    }
    function changeBiology() {
        uploadSolutionSubject = 'Mathematics'
        document.getElementById("subject-header-block").innerHTML = "Subject: " + uploadSolutionSubject
    }
    function changePhysics() {
        uploadSolutionSubject = 'Physics'
        document.getElementById("subject-header-block").innerHTML = "Subject: " + uploadSolutionSubject
    }

    // Designate Fields
    var uploadCourseHeader = document.getElementById("upload-course-header")
    var uploadTitle = document.getElementById("upload-title")
    var uploadProblemText = document.getElementById("upload-problem-text")
		
    
    //HANDLE PROBLEM FILE UPLOAD
		var uploadSolution = document.getElementById("upload-solution")
    uploadSolution.addEventListener('click', openProblemDialog)
    var hiddenFilebutton = document.getElementById('problem-select')
    hiddenFilebutton.addEventListener('change', handleProblemUploadChange);

    function openProblemDialog() {
      hiddenFilebutton.click();
    }
    
    var selectedSolutionFile;
    function handleProblemUploadChange(e) {
      selectedSolutionFile = e.target.files[0];
      document.getElementById("upload-solution-preview").innerHTML = selectedSolutionFile.name
    }
    
    document.getElementById('submit-solution-button').addEventListener('click', handleSolutionUpload);
    async function handleSolutionUpload(e) {
  			const uploadTask = await storageRef.child(`problems/${selectedSolutionFile.name}`).put(selectedSolutionFile);
  			uploadAndUpdateFirebase()
		}
    
    //Final Submit Button and Update Firebase
    async function uploadAndUpdateFirebase() {
    		var solutionFileURL = ""
    		await storageRef.child('/problems/'+selectedSolutionFile.name).getDownloadURL().then(function(url) {
    				solutionFileURL = url.toString()
    		})
        var dictToUpdate = {}
    		var newProblemDict = {
        		"title" : uploadTitle.value,
            "problemText" : uploadProblemText.value,
            "solutionURL" : solutionFileURL,
            "metadata" : {
            		"uploadedBy" : tutorsID,
                "dateUploaded" : Math.round((new Date()).getTime() / 1000),
                "views" : 0,
                "upvotes" : 0
                }
        
        		}
        dictToUpdate[create8CharID()] = newProblemDict
        console.log(dictToUpdate)
    		solutionsRef.child("/"+uploadSolutionSubject+"/"+uploadCourseHeader.value+"/").update(dictToUpdate)
    }
		
}




//LOAD SOLUTION FLOW: CLICK SUBJECT -> CLICK COURSE -> LOAD PROBLEMS FOR COURSE
solutionsRef.once("value", function(snapshot) {
		// load all subjects and add onclicks to load courses
    while(subjectOptionsArea.firstChild) {
        		subjectOptionsArea.removeChild(subjectOptionsArea.firstChild);
    }
		for (i=0; i< Object.keys(snapshot.val()).length; i++ ) {
    		var subject = Object.keys(snapshot.val())[i]
        
    		var subjectOption = document.createElement("div")
        subjectOption.setAttribute("class", "subject-option")
        subjectOption.innerHTML = subject
        subjectOption.setAttribute("onClick", "loadCourseOptions('"+subject+"')")
        //Should be doin gthis -->subjectOption.addEventListener("click", loadCourseOptions(subject))
    		subjectOptionsArea.appendChild(subjectOption)
    }
})


//load all courses for given subject and add onclicks to load problem area
function loadCourseOptions(subject) {
   	solutionsRef.once("value", function(snapshot) {
    		while(courseOptionsArea.firstChild) {
        		courseOptionsArea.removeChild(courseOptionsArea.firstChild);
   			}
    		for ( i=0; i < Object.keys(snapshot.child("/"+subject+"/").val()).length; i++ ) {
        		var course = Object.keys(snapshot.child("/"+subject+"/").val())[i]
            
        		var courseOption = document.createElement("div")
            courseOption.setAttribute("class", "course-choice")
            courseOption.innerHTML = course
            courseOption.setAttribute("onClick", "loadSolutionsArea('"+subject+"','"+course+"')")
            //Again, should be doing this --> courseOption.addEventListener("click", loadSolutionsArea(subject, course))
            courseOptionsArea.appendChild(courseOption) 
        }
    })
}
    
    
function loadSolutionsArea(subject, course) {
    solutionsRef.once("value", function(snapshot) {
    		while(solutionsArea.firstChild) {
        		solutionsArea.removeChild(solutionsArea.firstChild);
    		}
    		for ( problem in snapshot.child(subject+"/"+course+"/").val() ) {
        		problemRef = snapshot.child(subject+"/"+course+"/"+problem)
            // build header
            var headerString = subject + " - " + course + " Solutions"
            solutionsAreaHeader.innerHTML = headerString
        		//build the block
            var solutionBlock = document.createElement("div")
            solutionBlock.setAttribute("class", "solution-block")
            solutionsArea.appendChild(solutionBlock)
            
            var solutionTitleAndDescription = document.createElement("div")
            solutionTitleAndDescription.setAttribute("class", "solution-title-and-description")
            solutionBlock.appendChild(solutionTitleAndDescription)
            
            var solutionTitle = document.createElement("h4")
            solutionTitle.setAttribute("class", "solution-header")
            solutionTitle.innerHTML = problemRef.child("/title/").val()
            solutionTitleAndDescription.appendChild(solutionTitle)
            
            var solutionDescription = document.createElement("div")
            solutionDescription.setAttribute("class", "solution-description")
            solutionDescription.innerHTML = problemRef.child("/problemText/").val()
            solutionTitleAndDescription.appendChild(solutionDescription)
            
            var solutionLabelsAndViews = document.createElement("div")
            solutionLabelsAndViews.setAttribute("class", "solution-labels-and-views")
            solutionBlock.appendChild(solutionLabelsAndViews)
            
            var solutionLabelsBlock = document.createElement("div")
            solutionLabelsBlock.setAttribute("class", "solution-labels-block")
            solutionLabelsAndViews.appendChild(solutionLabelsBlock)
            
            var solutionLabels = document.createElement("div")
            solutionLabels.setAttribute("class", "solution-labels")
            solutionLabelsBlock.appendChild(solutionLabels)
            
            var isSolution  = problemRef.child("/solution/").val()
            if (isSolution == 0) {
            		var noSolutionLabel = document.createElement("div")
                noSolutionLabel.setAttribute("class", "no-solution-yet")
                noSolutionLabel.innerHTML = "No solution yet"
                solutionLabels.appendChild(noSolutionLabel)
            
            } else {
            		var solutionLabelText = document.createElement("div")
            		solutionLabelText.setAttribute("class", "solution-label-text")
            		solutionLabelText.innerHTML = "Text Solution"
            		solutionLabels.appendChild(solutionLabelText)
            }
      
            var solutionViewsAndUpvotes = document.createElement("div")
            solutionViewsAndUpvotes.setAttribute("class", "solution-views-and-upvotes")
            solutionLabelsAndViews.appendChild(solutionViewsAndUpvotes)
            
            var solutionViews = document.createElement("div")
            solutionViews.setAttribute("class", "views-count")
            solutionViews.innerHTML = problemRef.child("/metadata/views/").val() + " "
            solutionViewsAndUpvotes.appendChild(solutionViews)
            
            var solutionUpvotes = document.createElement("div")
            solutionUpvotes.setAttribute("class", "solution-upvotes")
            solutionUpvotes.innerHTML = problemRef.child("/metadata/views/").val() + " "
            solutionViewsAndUpvotes.appendChild(solutionUpvotes)
            
        }
		})	
}




//HELPER FUNCTIONS
function create8CharID() {
		var result =''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    var charactersLength = characters.length
    
    for (i = 0; i < 8; i++) {
    		result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}


