var solutionsRef = database.ref("/updateDatabase/solutions/")


//UPLOAD NEW SOLUTION REQUEST MODAL
function loadNewSolutionModal(usersId) {

      	var storageRef = storageService.ref();
	document.getElementById("new-question-modal-wrapper").style.display = "flex"
      

      	var newSolutionSubject = document.getElementById("new-solution-subject")
     	var newSolutionCourse = document.getElementById("new-solution-course")
	var newSolutionWeek = document.getElementById("new-solution-week")

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
                solutionsRef.child("/"+newSolutionSubject.value+"/"+newSolutionCourse.value+"/"+newSolutionWeek.value+"/").update(dictToUpdate)
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




//LOAD SOLUTION FLOW: CLICK SUBJECT -> CLICK COURSE -> CLICK WEEK -> LOAD PROBLEMS FOR COURSE
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
    	subjectOptionsArea.appendChild(subjectOption)
			
	loadSolutionsArea("undefined", "undefined", "undefined")
    	}
})


//load all courses for given subject and add onclicks to load problem area
function loadCourseOptions(subject) {
	loadSolutionsArea(subject, "undefined", "undefined")
   	solutionsRef.once("value", function(snapshot) {
    		while(courseOptionsArea.firstChild) {
        		courseOptionsArea.removeChild(courseOptionsArea.firstChild);
   		}
    		for ( i=0; i < Object.keys(snapshot.child("/"+subject+"/").val()).length; i++ ) {
        		var course = Object.keys(snapshot.child("/"+subject+"/").val())[i]
            
        		var courseOption = document.createElement("div")
            		courseOption.setAttribute("class", "course-choice")
            		courseOption.innerHTML = course
            		courseOption.setAttribute("onClick", "loadWeekOptions('"+subject+"','"+course+"')")
            		//Again, should be doing this --> courseOption.addEventListener("click", loadSolutionsArea(subject, course))
            		courseOptionsArea.appendChild(courseOption) 
        }
    })
}

//load all weeks available for that subject and course
function loadWeekOptions(subject, course) {
	loadSolutionsArea(subject, course, "undefined")
	
	solutionsRef.once("value", function(snapshot) {
		while(weekOptionsArea.firstChild) {
			weekOptionsArea.removeChild(weekOptionsArea.firstChild);
		}
		for ( i=0; i <Object.keys(snapshot.child("/"+subject+"/"+course+"/").val()).length; i++) {
			var week = Object.keys(snapshot.child("/"+subject+"/"+course+"/").val())[i]
			
			var weekOption = document.createElement("div")
			weekOption.setAttribute("class", "week-option")
			weekOption.innerHTML = week
			weekOption.setAttribute("onClick", "loadSolutionsArea('"+subject+"','"+course+"','"+week+"')")
			weekOptionsArea.appendChild(weekOption)
		}	
	})	
}
    
function loadSolutionsArea(subject, course, week) {
	console.log(subject, course, week)
    	solutionsRef.once("value", function(snapshot) {
    		while(solutionsArea.firstChild) {
        		solutionsArea.removeChild(solutionsArea.firstChild);
    		}
    		//load all existing problems
		if(subject == "undefined") {
			while(solutionsAreaHeader.firstChild) {
				solutionsAreaHeader.removeChild(solutionsAreaHeader.firstChild)
			}
			//build header
			var subjectLabel = document.createElement("div")
			subjectLabel.setAttribute("class", "solution-nav-header")
			subjectLabel.innerHTML = "All Solutions"
			solutionsAreaHeader.appendChild(subjectLabel)
			
			//loop through subjects
			for(subjectOp in snapshot.val()) {
				//loop through courses for that subject
				for (courseOp in snapshot.child(subjectOp).val()) {
					//loop through weeks for that course
					for (weekOp in snapshot.child(subjectOp+"/"+courseOp).val()) {
						//loop through problems and build the blocks
						for (problem in snapshot.child(subjectOp+"/"+courseOp+"/"+weekOp).val()){
							var problemRef = snapshot.child(subjectOp+"/"+courseOp+"/"+weekOp)
							
							var problemId = problem
							var problemTitle = problemRef.child(problem+"/title/").val()
							var problemText = problemRef.child(problem+"/problemText/").val()
							var isSolution = problemRef.child(problem+"/solution/").val()
							var problemViews = problemRef.child(problem+"/metadata/views/").val()
							var problemUpvotes = problemRef.child(problem+"/metadata/upvotes/").val()
							
							buildProblemBlock(subjectOp, courseOp, weekOp, problemId, problemTitle, problemText, isSolution, problemViews, 
									  problemUpvotes)
						}
					}
				}
			}	

		
		//load all problems for a subject
		} else if (course == "undefined") {
			//build header
			while(solutionsAreaHeader.firstChild) {
				solutionsAreaHeader.removeChild(solutionsAreaHeader.firstChild)
			}
			var subjectLabel = document.createElement("div")
			subjectLabel.setAttribute("class", "solution-nav-header")
			subjectLabel.innerHTML = subject
			solutionsAreaHeader.appendChild(subjectLabel)
			
			//loop through courses for defined subject
			for (courseOp in snapshot.child(subject).val()) {
				//loop through weeks for that course
				for (weekOp in snapshot.child(subject+"/"+courseOp).val()) {
					//loop through problems and build the blocks
					for (problem in snapshot.child(subject+"/"+courseOp+"/"+weekOp).val()){
						var problemRef = snapshot.child(subject+"/"+courseOp+"/"+weekOp)
							
						var problemId = problem
						var problemTitle = problemRef.child(problem+"/title/").val()
						var problemText = problemRef.child(problem+"/problemText/").val()
						var isSolution = problemRef.child(problem+"/solution/").val()
						var problemViews = problemRef.child(problem+"/metadata/views/").val()
						var problemUpvotes = problemRef.child(problem+"/metadata/upvotes/").val()
		
						buildProblemBlock(subject, courseOp, weekOp, problemId, problemTitle, problemText, isSolution, problemViews, 
								  problemUpvotes)
					}
				}	
			}	
		
		//load all problems for a subject and course
		} else if (week == "undefined") {
			//build header
			while(solutionsAreaHeader.firstChild) {
				solutionsAreaHeader.removeChild(solutionsAreaHeader.firstChild)
			}
			var subjectLabel = document.createElement("div")
			subjectLabel.setAttribute("class", "solution-nav-header")
			subjectLabel.innerHTML = subject
			solutionsAreaHeader.appendChild(subjectLabel)
			
			var courseLabel = document.createElement("div")
			courseLabel.setAttribute("class", "solution-nav-header")
			courseLabel.innerHTML = course
			solutionsAreaHeader.appendChild(courseLabel)
			
			//loop through weeks for given subject and course
			for (weekOp in snapshot.child(subject+"/"+course).val()) {
				//loop through problems and build the blocks
				for (problem in snapshot.child(subject+"/"+course+"/"+weekOp).val()){
					var problemRef = snapshot.child(subject+"/"+course+"/"+weekOp)
							
						var problemId = problem
						var problemTitle = problemRef.child(problem+"/title/").val()
						var problemText = problemRef.child(problem+"/problemText/").val()
						var isSolution = problemRef.child(problem+"/solution/").val()
						var problemViews = problemRef.child(problem+"/metadata/views/").val()
						var problemUpvotes = problemRef.child(problem+"/metadata/upvotes/").val()
						
						buildProblemBlock(subject, course, weekOp, problemId, problemTitle, problemText, isSolution, problemViews, 
								  problemUpvotes)
				}
			}	

		//load problems for a given subject, course, and week
		} else {
			//build header
			while(solutionsAreaHeader.firstChild) {
				solutionsAreaHeader.removeChild(solutionsAreaHeader.firstChild)
			}
			var subjectLabel = document.createElement("div")
			subjectLabel.setAttribute("class", "solution-nav-header")
			subjectLabel.innerHTML = subject
			solutionsAreaHeader.appendChild(subjectLabel)
			
			var courseLabel = document.createElement("div")
			courseLabel.setAttribute("class", "solution-nav-header")
			courseLabel.innerHTML = course
			solutionsAreaHeader.appendChild(courseLabel)
			
			var weekLabel = document.createElement("div")
			weekLabel.setAttribute("class", "solution-nav-header")
			weekLabel.innerHTML = week
			solutionsAreaHeader.appendChild(weekLabel)
			
			for (problem in snapshot.child(subject+"/"+course+"/"+week).val()){
				var problemRef = snapshot.child(subject+"/"+course+"/"+week)
							
				var problemId = problem
				var problemTitle = problemRef.child(problem+"/title/").val()
				var problemText = problemRef.child(problem+"/problemText/").val()
				var isSolution = problemRef.child(problem+"/solution/").val()
				var problemViews = problemRef.child(problem+"/metadata/views/").val()
				var problemUpvotes = problemRef.child(problem+"/metadata/upvotes/").val()
				
				buildProblemBlock(subject, course, week, problemId, problemTitle, problemText, isSolution, problemViews, 
						  problemUpvotes)
			}		
		} 
	})	
}
function buildProblemBlock(subject, course, week, problemId, problemTitle, problemText, isSolution, problemViews, problemUpvotes) {
	var arrayToLog = [subject,course,week,problemId,problemTitle,problemText,isSolution,problemViews,problemUpvotes]
	console.log(arrayToLog)

        var solutionBlock = document.createElement("div")
        solutionBlock.setAttribute("class", "solution-block")
        solutionsArea.appendChild(solutionBlock)

        var solutionTitleAndDescription = document.createElement("div")
        solutionTitleAndDescription.setAttribute("class", "solution-title-and-description")
        solutionBlock.appendChild(solutionTitleAndDescription)

        var solutionTitle = document.createElement("h4")
        solutionTitle.setAttribute("class", "solution-header")
        solutionTitle.innerHTML = problemTitle
        solutionTitleAndDescription.appendChild(solutionTitle)

        var solutionDescription = document.createElement("div")
        solutionDescription.setAttribute("class", "solution-description")
        solutionDescription.innerHTML = problemText
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

        if (isSolution == "0") {
            	var noSolutionLabel = document.createElement("div")
                noSolutionLabel.setAttribute("class", "no-solution-yet")
                noSolutionLabel.innerHTML = "No solution yet"
                solutionLabels.appendChild(noSolutionLabel)
		solutionBlock.setAttribute("onClick", "openAnswerModal('"+subject+"','"+course+"','"+week+"','"+problemId+"')")

        } else {
            	var solutionLabelText = document.createElement("div")
            	solutionLabelText.setAttribute("class", "solution-label-text")
            	solutionLabelText.innerHTML = "Text Solution"
            	solutionLabels.appendChild(solutionLabelText)
		solutionBlock.setAttribute("onClick", "openSolutionModal('"+subject+"','"+course+"','"+week+"','"+problemId+"')")
		
	}
	
	var solutionViewsAndUpvotes = document.createElement("div")
        solutionViewsAndUpvotes.setAttribute("class", "solution-views-and-upvotes")
        solutionLabelsAndViews.appendChild(solutionViewsAndUpvotes)

        var solutionViews = document.createElement("div")
        solutionViews.setAttribute("class", "views-count")
        solutionViews.innerHTML = problemViews + " "
        solutionViewsAndUpvotes.appendChild(solutionViews)

        var solutionUpvotes = document.createElement("div")
        solutionUpvotes.setAttribute("class", "solution-upvotes")
        solutionUpvotes.innerHTML = problemUpvotes + " "
        solutionViewsAndUpvotes.appendChild(solutionUpvotes)
	
}
		


function openAnswerModal(subject, course, week, problem) {
	console.log(subject,course,week, problem)
    	var storageRef = storageService.ref();
    	var answerRef = solutionsRef.child(subject+"/"+course+"/"+week+"/"+problem)
	//open modal
    	document.getElementById("answer-view-wrapper").style.display = "flex"
	
    	var answerArea = document.getElementById("answer-area")
    	while (answerArea.firstChild) {
        	answerArea.removeChild(answerArea.firstChild)
    	}


    	answerRef.once("value", function(snapshot) {
        	//get vals
        	var answerURL = snapshot.child("/problemURL/").val()
        	var answerText = snapshot.child("/problemText/").val()

        	//build header
        	var headerArea = document.getElementById("answer-identifiers")
        	while(headerArea.firstChild) {
            		headerArea.removeChild(headerArea.firstChild)
        	}

        	var subjectLabel = document.createElement("div")
		subjectLabel.setAttribute("class", "answer-nav-header")
		subjectLabel.innerHTML = subject
		headerArea.appendChild(subjectLabel)
			
		var courseLabel = document.createElement("div")
		courseLabel.setAttribute("class", "answer-nav-header")
		courseLabel.innerHTML = course
		headerArea.appendChild(courseLabel)
			
		var weekLabel = document.createElement("div")
		weekLabel.setAttribute("class", "answer-nav-header")
		weekLabel.innerHTML = week
        	headerArea.appendChild(weekLabel)
        
        	var titleLabel = document.createElement("div")
       	 	titleLabel.setAttribute("class", "answer-nav-header")
        	titleLabel.innerHTML = snapshot.child("title")
        	headerArea.appendChild(titleLabel)

        	//build the block

        	var answerPreviewHeader = document.createElement("h4")
        	answerPreviewHeader.setAttribute("class", "answer-preview-header")
		answerPreviewHeader.innerHTML = "Problem:"
		answerArea.appendChild(answerPreviewHeader)

		var previewImage = document.createElement("img")
		previewImage.setAttribute("class", "answer-preview")
		previewImage.src = answerURL
		answerArea.appendChild(previewImage)

		var previewTextHeader = document.createElement("h4")
		previewTextHeader.setAttribute("class", "answer-preview-header")
		previewTextHeader.innerHTML = "Problem Text:"
		answerArea.appendChild(previewTextHeader)

		var previewText = document.createElement("div")
		previewText.setAttribute("class", "answer-preview-text")
		previewText.innerHTML = answerText
		answerArea.appendChild(previewText)

		var previewSolutionHeader = document.createElement("h4")
		previewSolutionHeader.setAttribute("class", "upload-preview-header")
		previewSolutionHeader.innerHTML = "Solution:"
		answerArea.appendChild(previewSolutionHeader)

		var uploadButtonArea = document.createElement("div")
		uploadButtonArea.setAttribute("class", "upload-div")
		answerArea.appendChild(uploadButtonArea)

		var answerUploadButton = document.createElement("div")
		answerUploadButton.setAttribute("class", "answer-upload")
		answerUploadButton.innerHTML = "Upload Solution"
		//setOnclick
		uploadButtonArea.appendChild(answerUploadButton)

		var answerPreview = document.createElement("div")
		answerPreview.setAttribute("class", "answer-preview-file")
		answerPreview.style.display = "none"
		uploadButtonArea.appendChild(answerPreview)

		//upload functions
      		answerUploadButton.addEventListener('click', openNewSolutionDialog)
		var hiddenFilebutton = document.getElementById('solution-select')
		hiddenFilebutton.addEventListener('change', handleSolutionUploadChange);

		function openProblemDialog() {
		    hiddenFilebutton.click();
		}
          
          	var selectedSolutionFile;
          	function handleSolutionUploadChange(e) {
            		selectedSolutionFile = e.target.files[0];
            		answerPreview.innerHTML = selectedSolutionFile.name
          	}
          
          	document.getElementById("submit-answer-button").addEventListener('click', handleSolutionUpload);
          	async function handleSolutionUpload(e) {
                    	const uploadTask = await storageRef.child(`solutions/${selectedSolutionFile.name}`).put(selectedSolutionFile);
                    	uploadAndUpdateFirebase()
              	}
          
          	//Final Submit Button and Update Firebase
          	async function uploadAndUpdateFirebase() {
                  	var solutionFileURL = ""
                  	await storageRef.child('/solutions/'+selectedSolutionFile.name).getDownloadURL().then(function(url) {
                          	solutionFileURL = url.toString()
                  	})
              	var dictToUpdate = {}
                var newSolutionDict = {
                        "solutionURL" : solutionFileURL,
                        "metadata" : {
                              	"uploadedBy" : tutorsID,
                              	"dateUploaded" : Math.round((new Date()).getTime() / 1000),
                              	}
                      	}
              	dictToUpdate["solution"] = newProblemDict
              	console.log(dictToUpdate)
              	answerRef.child("/"+subject+"/"+course+"/"+week).update(dictToUpdate)
          }
    })
}


//MODALS
function openSolutionModal(subject, course, week, problem) {
    var solutionRef = solutionsRef.child(subject+"/"+course+"/"+week+"/"+problem)
    //open modal
    document.getElementById("solution-view-wrapper").style.display = "flex"

    solutionRef.once("value", function(snapshot) {
        //get vals
        var problemURL = snapshot.child(problemURL).val()
        var problemText = snapshot.child(problemText).val()
        var solutionURL = snapshot.child(solution+"/"+solutionURL).val()
        var currentViews = snapshot.child("/metadata/views/").val()
        var currentUpvotes = snapshot.child("metadata/views/").val()

        //build header
        var headerArea = document.getElementById("solution-identifiers")

		while(headerArea.firstChild) {
			headerArea.removeChild(headerArea.firstChild)
        }
        
		var subjectLabel = document.createElement("div")
		subjectLabel.setAttribute("class", "solution-nav-header")
		subjectLabel.innerHTML = subject
		headerArea.appendChild(subjectLabel)
			
		var courseLabel = document.createElement("div")
		courseLabel.setAttribute("class", "solution-nav-header")
		courseLabel.innerHTML = course
		headerArea.appendChild(courseLabel)
			
		var weekLabel = document.createElement("div")
		weekLabel.setAttribute("class", "solution-nav-header")
		weekLabel.innerHTML = week
        headerArea.appendChild(weekLabel)
        
        var titleLabel = document.createElement("div")
        titleLabel.setAttribute("solution-nav-header")
        titleLabel.innerHTML = snapshot.child("title")
        headerArea.appendChild(titleLabel)

        //build the block
        var previewArea = document.getElementById("solution-area")
        while(previewArea.firstChild){
                previewArea.removeChild(previewArea.firstChild)
        }

        var previewHeader = document.createElement("h4")
        previewHeader.setAttribute("class", "problem-preview-header")
        previewHeader.innerHTML = "Problem:"
        previewArea.appendChild(previewHeader)

        var previewImage = document.createElement("img")
        previewImage.setAttribute("class", "problem-preview")
        previewImage.src = problemURL
        previewArea.appendChild(previewImage)

        var previewTextHeader = document.createElement("h4")
        previewTextHeader.setAttribute("class", "problem-preview-header")
        previewTextHeader.innerHTML = "Problem Text:"
        previewArea.appendChild(previewTextHeader)

        var previewText = document.createElement("div")
        previewText.setAttribute("class", "problem-preview-text")
        previewText.innerHTML = problemText
        previewArea.appendChild(previewText)

        var previewSolutionHeader = document.createElement("h4")
        previewSolutionHeader.setAttribute("class", "solution-preview-header")
        previewSolutionHeader.innerHTML = "Solution:"
        previewArea.appendChild(previewSolutionHeader)

        var previewSolutionImage = document.createElement("img")
        previewSolutionImage.setAttribute("class", "solution-preview")
        previewSolutionImage.src = solutionURL
        previewArea.appendChild(previewSolutionImage)

        //update views
        var updateViewCount = currentViews + 1
        solutionRef.child("/metadata/").update({"views" : updateViewCount})

        //create upvote button
        var upvoteButton = document.getElementById("solution-preview-upvote")
        var downvoteButton = document.getElementById("solution-preview-downvote")
        
        upvoteButton.addEventListener('click', function(){
                if (userID.length > 1) {
                    var updateUpvotes = currentUpvotes + 1
                    document.getElementById("upvote-counter").innerHTML = udateUpvotes
                } else {
                    alert("Please login to rate solutions")
                }
        })

        downvoteButton.addEventListener('click', function(){
            if (userID.length > 1) {
                var updateDownvotes = currentUpvotes - 1
                document.getElementById("upvote-counter").innerHTML = updateDownvotes
            } else {
                alert("Please login to rate solutions")
            }
    })
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


