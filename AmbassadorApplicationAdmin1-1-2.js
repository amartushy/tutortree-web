firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var ambassadorDB = firebase.firestore()
        var adminID = user.uid

        //Check if user is an admin, TODO
        userDB.collection("users").doc(adminID).get().then(function(doc) {
            console.log(doc.data().admin)
        })

        //Get all applicant information and build blocks
        var pendingAmbassadorArea = document.getElementById('pending-ambassador-section')
        userDB.collection("ambassadors").where("isAmbassador", "==", false).onSnapshot(function(allAmbassadors) {
          
            //remove all children when updated
            ambassadorArray = []
            while(pendingAmbassadorArea.firstChild) {
                pendingAmbassadorArea.removeChild(pendingAmbassadorArea.firstChild)
            }
            //loop through all ambassadors
            allAmbassadors.forEach(function(doc) {
                var ambassadorID = doc.id,
                    firstName = doc.data().firstName,
                    lastName = doc.data().lastName,
                    email = doc.data().email,
                    school = doc.data().school,
                    timeApplied = doc.data().dateApplied,
                    memeURL = doc.data().memeURL
                
                buildAmbassadorBlock(ambassadorID, 
                                      firstName, 
                                      lastName, 
                                      email, 
                                      timeApplied, 
                                      memeURL)
            })
          	appendToPendingAmbassadorArea()
          
        })
      
    } else {
		    location.href = "https://www.jointutortree.com"
    }
})

function buildAmbassadorBlock(ambassadorID, firstName, lastName, email, school, timeApplied, memeURL) {
      var ambassadorInfoBlock = document.createElement('div')
      ambassadorInfoBlock.setAttribute('class', 'ambassador-info-block')
      
      //Name block
      var ambassadorNameBlock = document.createElement('div')
      ambassadorNameBlock.setAttribute('class', 'ambassador-name-block')
      ambassadorInfoBlock.appendChild(ambassadorNameBlock)
  
      var ambassadorNameHeader = document.createElement('h3')
      ambassadorNameHeader.setAttribute('class', 'ambapp-header')
      ambassadorNameHeader.innerHTML = firstName + " " lastName
      ambassadorNameBlock.appendChild(ambassadorNameHeader)
  
      var ambassadorDateApplied = document.createElement('div')
      ambassadorDateApplied.setAttribute('class', 'ambapp-text')
      var applicantDate = new Date(timeApplied * 1000)
      var formattedTimeApplied = applicantDate.toLocaleDateString("en-US", {month:'long', day: 'numeric',
          hour: 'numeric', minute:'numeric'})
      ambassadorDateApplied.innerHTML = formattedTimeApplied
      ambassadorNameBlock.appendChild(ambassadorDateApplied)
  
      var ambassadorEmail = document.createElement('div')      
      ambassadorEmail.setAttribute('class', 'ambapp-text')
      ambassadorEmail.innerHTML = email
      ambassadorNameBlock.appendChild(ambassadorEmail)
  
      //School Block
      var ambassadorSchoolBlock = document.createElement('div')
      ambassadorSchoolBlock.setAttribute('class', 'ambassador-school-block')
      ambassadorInfoBlock.appendChild(ambassadorSchoolBlock)
  
      var ambassadorSchoolHeader = document.createElement('h3')
      ambassadorSchoolHeader.setAttribute('class', 'ambapp-header')
      ambassadorSchoolHeader.innerHTML = "School"
      ambassadorSchoolBlock.appendChild(ambassadorSchoolHeader)
  
      var ambassadorSchool = document.createElement('div')
      ambassadorSchool.setAttribute('class', 'ambapp-text')
      ambassadorSchool.innerHTML = school
      ambassadorSchoolBlock.appendChild(ambassadorSchool)
      
      //Application Block
      var ambassadorApplicationBlock = document.createElement('div')
      ambassadorApplicationBlock.setAttribute('class', 'ambassador-application')
      ambassadorInfoBlock.appendChild(ambassadorApplicationBlock)
  
      var ambassadorApplicationHeader = document.createElement('h3')
      ambassadorApplicationHeader.innerHTML = "Application"
      ambassadorApplicationBlock.appendChild(ambassadorApplicationHeader)
  
      //Meme Block
      var ambassadorMemeBlock = document.createElement('div')
      ambassadorMemeBlock.setAttribute('class', 'ambassador-meme')
      ambassadorInfoBlock.appendChild(ambassadorMemeBlock)
  
      var ambassadorMemeHeader = document.createElement('div')
      ambassadorMemeHeader.setAttribute('class', 'ambapp-header')
      ambassadorMemeHeader.innerHTML = 'Meme'
      ambassadorMemeBlock.appendChild(ambassadorMemeHeader)
      
      var ambassadorPrivilegesBlock = document.createElement('div')
      ambassadorPrivilegesBlock.setAttribute('class', 'ambassador-privileges')
      ambassadorInfoBlock.appendChild(ambassadorPrivilegesBlock)
  
      var ambassadorApproveButton = document.createElement('div')
      ambassadorApproveButton.setAttribute('class', 'ambapp-approve')
      ambassadorApproveButton.innerHTML = 'Approve'
      ambassadorPrivilegesBlock.appendChild(ambassadorApproveButton)
  
      var ambassadorRejectButton = document.createElement('div')
      ambassadorRejectButton.setAttribute('class', 'ambapp-reject')
      ambassadorApproveButton.innerHTML = 'Reject'
      ambassadorApproveButton.appendChild(ambassadorRejectButton)

}

          

