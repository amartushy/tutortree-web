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



function create8CharID() {
		var result =''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    var charactersLength = characters.length
    
    for (i = 0; i < 8; i++) {
    		result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}
