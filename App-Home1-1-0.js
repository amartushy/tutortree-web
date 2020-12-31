document.getElementById("tutor-1").addEventListener('click', () => {
	location.href = "https://app-tutortree.webflow.io/tutor-profile"
})

//Global Variables__________________________________________________________________
var userDB = firebase.firestore()

var globalUserId,
    coreBio,
    coreEmail,
    coreIsEmailOn,
    coreIsSMSOn,
    coreisTutor,
    coreName,
    corePhone,
    coreProfileImage


//Initialize elements on page load
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var ID = user.uid
		 
        loadCoreProperties(ID)
		
	//If user is not logged in return them to login screen
	} else {
		location.href = "https://app-tutortree.webflow.io/login"
	}
})

function loadCoreProperties(ID) {
    globalUserId = ID
	console.log(globalUserId)
    userDB.collection('userTest').doc(globalUserId).onSnapshot(function(doc) {
        var data = doc.data()

        coreBio = data.bio
        coreEmail = data.email
        coreIsEmailOn = data.isEmailOn 
        coreIsSMSOn = data.coreIsSMSOn
        coreisTutor = data.isTutor
        coreName = data.name 
        corePhone = data.phoneNumber 
        coreProfileImage = data.profileImage 

        loadHeader()

    })
}

function loadHeader() {

    var profileTab = document.getElementById('profile')

    while( profileTab.firstChild) {
        profileTab.removeChild(profileTab.lastChild)
    }

    var usersPhoto = document.createElement('img')
    usersPhoto.setAttribute('class', 'header-image')
    usersPhoto.src = coreProfileImage
    profileTab.appendChild(usersPhoto)

    var profileText = document.createElement('div')
    profileText.setAttribute('class', 'header-text')
    profileText.innerHTML = 'Profile'
    profileTab.appendChild(profileText)
}





const adrianProfile = document.getElementById('adrian-profile')
adrianProfile.setAttribute('onClick', 'getTutorData("wR441Js4g6RM3u8tsDe3kmujsUs2")')

const tutorProfile = document.getElementById('tutor-profile')
const homeBack = document.getElementById('home-back')

homeBack.addEventListener('click', () => {
    tutorProfile.style.display = 'none'
})

function getTutorData(tutorID) {
    tutorProfile.style.display = 'flex'


    userDB.collection('userTest').doc(tutorID).get().then(function(doc) {
        const data = doc.data()

        loadTutorProfile(data, tutorID)
        loadButtons(data, tutorID)
        //loadSimilarTutors()
        //loadReviews()
        //loadAvailability(data)
    })
}

async function loadTutorProfile(data, ID) {
    //Load image
    const tutorContainer = document.getElementById('tutor-image-container')
    tutorContainer.removeChild(tutorContainer.firstChild)
    var tutorImage = document.createElement('img')
    tutorImage.setAttribute('class', 'tutor-profile-image')
    tutorImage.src = data.profileImage
    tutorContainer.appendChild(tutorImage)

    //get first name
    var tutorsName = data.name 
    const nameArray = tutorsName.split(" ")
    const firstName = nameArray[0]

    //load name, school, major, bio
    document.getElementById('tutor-profile-name').innerHTML = data.name
    document.getElementById('tutor-profile-school').innerHTML = await getSchoolName(data.school)
    document.getElementById('tutor-profile-name').innerHTML = tutorsName
    document.getElementById('tutor-profile-major').innerHTML = data.major
    document.getElementById('bio-header').innerHTML = 'Meet ' + firstName
    document.getElementById('tutor-profile-bio').innerHTML = data.bio

    //load sessions and average
    document.getElementById('tutor-profile-sessions').innerHTML = await getCountOfSessions(ID)
    document.getElementById('tutor-profile-average').innerHTML = await getRatingForUser(ID)

    //load hourly
    document.getElementById('tutor-profile-hourly').innerHTML = data.pricePHH * 2

}

function loadButtons(data, tutorID) {
    //load favorite button

    //load report button

    //load message button
    document.getElementById('message-button').addEventListener('click', () => {
        openMessageModal(data, tutorID)
    })

    //load book session button
}

function openMessageModal(data, tutorID) {
    const messageModalClose = document.getElementById('message-modal-close')
    const messageModal = document.getElementById('message-modal')
    const messageModalHeader = document.getElementById('message-modal-header')
    const messageSendButton = document.getElementById('send-button')
    const messageDiv = document.getElementById('message-div')
    const messageCompletionDiv = document.getElementById('message-completion-div')

    messageModal.style.display = 'flex'
    messageDiv.style.display = 'flex'
    messageCompletionDiv.style.display = 'none'

    var tutorsName = data.name 
    const nameArray = tutorsName.split(" ")
    const firstName = nameArray[0]
    messageModalHeader.innerHTML = 'Message ' + firstName

    messageModalClose.addEventListener('click', () => {
        messageModal.style.display = 'none'
    })

    messageSendButton.addEventListener('click', () => {
        updateConnections(data, tutorID)
        messageDiv.style.display = 'none'
        messageCompletionDiv.style.display = 'flex'
    })
}

function updateConnections(data, tutorID) {
    const connectionID = tutorID + ":" + globalUserId

    var messageRef = userDB.collection('messages').doc(connectionID)
    messageRef.get().then(function(doc) {
        if (doc.exists) {
            //If connection exists then add to messages collection
            console.log("Document Exists:", doc.data())
            sendConnectionMessage(tutorID, connectionID, "student")
        } else {
            //if not, create document and add fields and messages collection
            console.log("Document does not exist, creating new one")
            var updateDict = {
                "members" : [globalUserId, tutorID],
                "student" : globalUserId,
                "tutor" : tutorID
            }
            userDB.collection('messages').doc(connectionID).set(updateDict).then(function() {
                sendConnectionMessage(tutorID, connectionID, "student")
            })
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function sendConnectionMessage(otherID, connectionID, senderType) {
    var today = new Date()
    var timeStamp = (today.getTime() / 1000).toString()
    var updateDict = {
        'message' : document.getElementById('message-field').value,
        'sender' : globalUserId,
        'senderType' : senderType
    }
    userDB.collection('messages').doc(connectionID).collection('messages').doc(timeStamp).set(updateDict)
    sendMessagingNotifications(otherID, coreName, document.getElementById('message-field').value)
    document.getElementById('message-field').value = ""
}

function sendMessagingNotifications(otherID, currentName, message) {
    userDB.collection('userTest').doc(otherID).get().then(function(doc) {
        var userData = doc.data()

        var isSMSOn = userData.isSMSOn
        var isPushOn = userData.isPushOn

        if(isSMSOn) {
            var phoneNumber = userData.phoneNumber
            var smsMessage = "New Message From " + currentName + ": " + message
            sendSMSTo(phoneNumber, smsMessage)
        }

        if(isPushOn) {
            var token = userData.pushToken
            var title = "New Message From " + currentName
            sendPushTo(token, title, message)
        }
    })
}
