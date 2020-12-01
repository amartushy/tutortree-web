//Global Variables__________________________________________________________________
var userDB = firebase.firestore()

//Core properties all users have
var globalUserId,
    coreBio,
    coreEmail,
    coreIsEmailOn,
    coreIsSMSOn,
    coreIsTutor,
    coreName,
    corePhone,
    coreProfileImage,
    coreSchool,
    coreSubject




//Initialize elements on page load
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var ID = user.uid
		 
        loadCoreProperties(ID)
		
	//If user is not logged in return them to login screen
	} else {
		location.href = "https://parent-tutortree.webflow.io/login"
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
        coreIsTutor = data.isTutor
        coreName = data.name 
        corePhone = data.phoneNumber 
        coreProfileImage = data.profileImage 
        coreSchool = data.school 
        coreSubject = data.major 

        loadHeader()
        loadProfile()

        if (coreIsTutor) {
            loadTutorProfile()
        }
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


function loadProfile() {

    var usersImageBlock = document.getElementById('users-image-block')
    var usersName = document.getElementById('users-name')
    var usersSchool = document.getElementById('users-school')
    var usersMajor = document.getElementById('users-major')
    var usersBio = document.getElementById('users-bio')
    
    while ( usersImageBlock.firstChild ) {
        usersImageBlock.removeChild(usersImageBlock.firstChild)
    }

    var usersProfileImage = document.createElement('img')
    usersProfileImage.setAttribute('class', 'header-image')
    usersProfileImage.src = coreProfileImage
    usersImageBlock.appendChild(usersProfileImage)

    var cameraIcon = document.createElement('div')
    cameraIcon.setAttribute('class', 'users-photo-icon')
    cameraIcon.innerHTML = ''
    profileTab.appendChild(profileText)

    usersName.innerHTML = coreName
    usersBio.innerHTML = coreBio

    //TODO - Notifications

}


function loadTutorProfile() {
    var usersSessions = document.getElementById('users-sessions')
    var usersAverage = document.getElementById('users-average')

    usersSessions.innerHTML = getCountOfSessions(globalUserId)
    usersAverage.innerHTML = getRatingForUser(globalUserId)
}


function loadNotifications() {
    var usersEmail = document.getElementById('users-email')
    var usersPhone = document.getElementById('users-phone')

    usersEmail.innerHTML = coreEmail 
    usersPhone.innerHTML = corePhone 

    if (coreIsEmailOn) {
        usersEmail.style.display = 'block'
    }
}



//Helper Functions ___________________________________________________________________________________________________________
async function getRatingForUser(ID) {
    var rating = 0

    await userDB.collection('userTest').doc(ID).collection('sessions').get().then(function(session) {
        var ratingSum = 0
        var sessionsWithRating = 0

        session.forEach(function(doc) {
            if(doc.data().ratingFromOtherUser != null) {
                ratingSum += doc.data().ratingFromOtherUser
                sessionsWithRating += 1
                rating = ratingSum / sessionsWithRating
            }
        })
    })

    if (rating == 0) {
        return ('NEW')
    } else {
        return rating.toFixed(2)
    }
}

async function getCountOfSessions(ID) {
    var sessions = 0

    await userDB.collection('userTest').doc(ID).collection('sessions').get().then(function(session) {

        session.forEach(function(doc) {
            sessions += 1
        })
    })

    if (sessions == 0) {
        return ('NEW')
    } else {
        return sessions
    }
}
