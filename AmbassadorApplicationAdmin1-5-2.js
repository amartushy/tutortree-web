firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var ambassadorDB = firebase.firestore()
        var adminID = user.uid

        //Check if user is an admin, TODO
        ambassadorDB.collection("userTest").doc(adminID).get().then(function(doc) {
            console.log(doc.data().isAdmin)
        })
	    
    	//Get tab buttons
	var rejectedButton = document.getElementById('rejected-button')
	var pendingButton = document.getElementById('pending-button')
	var acceptedButton = document.getElementById('accepted-button')

	//Set eventlisteners
	rejectedButton.setAttribute('onClick', 'showRejectedApplicants()')
	pendingButton.setAttribute('onClick', 'showPendingApplicants()')
	acceptedButton.setAttribute('onClick', 'showAcceptedApplicants()')

        //Get all ambassadors and build blocks
    	var rejectedAmbassadorSection = document.getElementById('rejected-ambassador-section')

        ambassadorDB.collection("userTest").where("ambassadorApplicationStatus", "in", ["rejected", "pending", "approved"]).onSnapshot(function(allAmbassadors) {
            //reinitialize arrays on update
            pendingAmbassadorArray = []
	    approvedAmbassadorArray = []
	    rejectedAmbassadorArray = []
		
	    //remove all children when updated
            while(pendingAmbassadorArea.firstChild) {
                pendingAmbassadorArea.removeChild(pendingAmbassadorArea.firstChild)
            }
	    while(approvedAmbassadorSection.firstChild) {
                approvedAmbassadorSection.removeChild(approvedAmbassadorSection.firstChild)
            }
	    while(rejectedAmbassadorSection.firstChild) {
                rejectedAmbassadorSection.removeChild(rejectedAmbassadorSection.firstChild)
            }
		
            //loop through all ambassadors
            allAmbassadors.forEach(function(doc) {
    		console.log("ambassador found")
                var ambassadorID = doc.id,
                    email = doc.data().email,
                    school = doc.data().school,
		    status = doc.data().ambassadorApplicationStatus
		
			ambassadorDB.collection("userTest").doc(ambassadorID).collection("ambassadorApplication").doc("application").get().then(function(user) {
				var firstName =  user.data().firstName,
				lastName = user.data().lastName,
				timeApplied = user.data().dateApplied,
				memeURL = user.data().memeURL
				
				
				buildAmbassadorBlock(ambassadorID, 
                                      firstName, 
                                      lastName, 
                                      email,
				      school,
                                      timeApplied, 
                                      memeURL,
				      status)
			})
            })
        })
      
    } else {
	location.href = "https://www.jointutortree.com"
    }
})

var rejectedAmbassadorSection = document.getElementById('rejected-ambassador-section')
function showRejectedApplicants() {
	while(rejectedAmbassadorSection.firstChild) {
		rejectedAmbassadorSection.removeChild(rejectedAmbassadorSection.firstChild)
	}
	appendToRejectedAmbassadorArea()
}

var pendingAmbassadorArea = document.getElementById('pending-ambassador-section')
function showPendingApplicants() {
	while(pendingAmbassadorArea.firstChild) {
		pendingAmbassadorArea.removeChild(pendingAmbassadorArea.firstChild)
	}
	appendToPendingAmbassadorArea()
}

var approvedAmbassadorSection = document.getElementById('approved-ambassador-section')
function showAcceptedApplicants() {
	while(approvedAmbassadorSection.firstChild) {
		approvedAmbassadorSection.removeChild(approvedAmbassadorSection.firstChild)
	}
	appendToApprovedAmbassadorArea()
}

function buildAmbassadorBlock(ambassadorID, firstName, lastName, email, school, timeApplied, memeURL, status) {
      var ambassadorInfoBlock = document.createElement('div')
      ambassadorInfoBlock.setAttribute('class', 'ambassador-info-block')
      ambassadorInfoBlock.setAttribute('id', timeApplied)
	console.log("Ambassadors status: " + status)
      	
      //Name block
      var ambassadorNameBlock = document.createElement('div')
      ambassadorNameBlock.setAttribute('class', 'ambassador-name-block')
      ambassadorInfoBlock.appendChild(ambassadorNameBlock)
  
      var ambassadorNameHeader = document.createElement('h3')
      ambassadorNameHeader.setAttribute('class', 'ambapp-header')
      ambassadorNameHeader.innerHTML = firstName + " " + lastName
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
      ambassadorApplicationBlock.setAttribute('onClick', 'showAmbassadorInterview("'+ambassadorID+'")')
      ambassadorInfoBlock.appendChild(ambassadorApplicationBlock)
  
      var ambassadorApplicationHeader = document.createElement('h3')
      ambassadorApplicationHeader.setAttribute('class', 'ambapp-header')
      ambassadorApplicationHeader.innerHTML = "Application"
      ambassadorApplicationBlock.appendChild(ambassadorApplicationHeader)
  
      //Meme Block
      var ambassadorMemeBlock = document.createElement('div')
      ambassadorMemeBlock.setAttribute('class', 'ambassador-meme')
      ambassadorMemeBlock.setAttribute('onClick', 'showMeme("' + ambassadorID + '")')
      ambassadorInfoBlock.appendChild(ambassadorMemeBlock)
  
      var ambassadorMemeHeader = document.createElement('h3')
      ambassadorMemeHeader.setAttribute('class', 'ambapp-header')
      ambassadorMemeHeader.innerHTML = 'Meme'
      ambassadorMemeBlock.appendChild(ambassadorMemeHeader)
      
      var ambassadorPrivilegesBlock = document.createElement('div')
      ambassadorPrivilegesBlock.setAttribute('class', 'ambassador-privileges')
      ambassadorInfoBlock.appendChild(ambassadorPrivilegesBlock)
  
      var ambassadorApproveButton = document.createElement('div')
      ambassadorApproveButton.setAttribute('class', 'ambapp-approve')
      ambassadorApproveButton.setAttribute('onClick', 'setAmbassadorPrivileges("' + ambassadorID + '","'+ email +'", "approved")')
      ambassadorApproveButton.innerHTML = 'Approve'
	  
      var ambassadorRejectButton = document.createElement('div')
      ambassadorRejectButton.setAttribute('class', 'ambapp-reject')
      ambassadorRejectButton.setAttribute('onClick', 'setAmbassadorPrivileges("' + ambassadorID + '","'+ email +'", "rejected")')
      ambassadorRejectButton.innerHTML = 'Reject'
	
	if (status == "pending") {
		updatePendingAmbassadorArray(timeApplied)
		ambassadorPrivilegesBlock.appendChild(ambassadorApproveButton)
		ambassadorPrivilegesBlock.appendChild(ambassadorRejectButton)

	} else if (status == "approved"){
		updateApprovedAmbassadorArray(timeApplied)
		ambassadorPrivilegesBlock.appendChild(ambassadorRejectButton)

	} else if (status == "rejected") {
		updateRejectedAmbassadorArray(timeApplied)
		ambassadorPrivilegesBlock.appendChild(ambassadorApproveButton)
	}
      document.getElementById('hidden-ambassador-section').appendChild(ambassadorInfoBlock)

}

function setAmbassadorPrivileges(ID, email, privileges) {
	var ambassadorDB = firebase.firestore()
	ambassadorDB.collection("userTest").doc(ID).update( { "ambassadorApplicationStatus" : privileges } ).then(function(){
		ambassadorReviewed(email, privileges)
	})

}

function showMeme(ID) {
	var ambassadorDB = firebase.firestore()
	ambassadorDB.collection("userTest").doc(ID).collection("ambassadorApplication").doc("application").get().then(function(doc) {
		var memeLink = doc.data().memeURL
		window.open(memeLink)
	})
}

function showAmbassadorInterview(ambassadorID) {
	document.getElementById("ambassador-application-modal").style.display = "flex"
	
	var ambassadorDB = firebase.firestore()
	
	ambassadorDB.collection("userTest").doc(ambassadorID).get().then(function(doc) {
		document.getElementById("email").innerHTML = doc.data().email
		document.getElementById("phoneNumber").innerHTML = doc.data().phoneNumber
		document.getElementById("school").innerHTML = doc.data().school
		document.getElementById("major").innerHTML = doc.data().major
	})
	ambassadorDB.collection("userTest").doc(ambassadorID).collection("ambassadorApplication").doc("application").get().then(function(doc) {
		document.getElementById("firstName").innerHTML = doc.data().firstName
		document.getElementById("lastName").innerHTML = doc.data().lastName
		document.getElementById("year").innerHTML = doc.data().year
		document.getElementById("live").innerHTML = doc.data().livesNearCampus
		document.getElementById("favorite").innerHTML = doc.data().favoriteOffCampus
		document.getElementById("organizations").innerHTML = doc.data().organizations
		document.getElementById("platform").innerHTML = doc.data().socialMediaField
		document.getElementById("followers").innerHTML = doc.data().numberOfFollowers
		document.getElementById("link").innerHTML = doc.data().socialHandle
		document.getElementById("knowAnyone").innerHTML = doc.data().knowsEmployees
		document.getElementById("howHeard").innerHTML = doc.data().howHeardField
	})
}

//Sort applicants by date applied
function sortNumberApplicant(a,b) {
	return(a-b)
}
//Pending ambassadors
var pendingAmbassadorArray = []
function updatePendingAmbassadorArray(timestamp) {
	pendingAmbassadorArray.push(timestamp)
    	pendingAmbassadorArray.sort(sortNumberApplicant)
}

function appendToPendingAmbassadorArea() {
    var items = pendingAmbassadorArray.length
    var pendingAmbassadorSection = document.getElementById('pending-ambassador-section')
    
    for( i=0 ; i < items ; i++ ) {
    	var timestampID = pendingAmbassadorArray[i]
    	var pendingAmbassadorBlock = document.getElementById(timestampID)
	var blockClone = pendingAmbassadorBlock.cloneNode(true)
        pendingAmbassadorSection.appendChild(blockClone)
    }
}

//Approved ambassadors
var approvedAmbassadorArray = []
function updateApprovedAmbassadorArray(timestamp) {
	approvedAmbassadorArray.push(timestamp)
    	approvedAmbassadorArray.sort(sortNumberApplicant)
}

function appendToApprovedAmbassadorArea() {
    var items = approvedAmbassadorArray.length
    var approvedAmbassadorSection = document.getElementById('approved-ambassador-section')
    
    for( i=0 ; i < items ; i++ ) {
    	var timestampID = approvedAmbassadorArray[i]
    	var approvedAmbassadorBlock = document.getElementById(timestampID)
	var blockClone = approvedAmbassadorBlock.cloneNode(true)
        approvedAmbassadorSection.appendChild(blockClone)
    }
}

//Rejected Ambassadors
var rejectedAmbassadorArray = []
function updateRejectedAmbassadorArray(timestamp) {
	rejectedAmbassadorArray.push(timestamp)
    	rejectedAmbassadorArray.sort(sortNumberApplicant)
}

function appendToRejectedAmbassadorArea() {
    var items = rejectedAmbassadorArray.length
    var rejectedAmbassadorSection = document.getElementById('rejected-ambassador-section')
    
    for( i=0 ; i < items ; i++ ) {
    	var timestampID = rejectedAmbassadorArray[i]
    	var rejectedAmbassadorBlock = document.getElementById(timestampID)
	var blockClone = rejectedAmbassadorBlock.cloneNode(true)
        rejectedAmbassadorSection.appendChild(blockClone)
    }
}

          

