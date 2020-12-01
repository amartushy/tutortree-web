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
	loadNotifications()
	    
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


async function loadProfile() {

    var usersImageBlock = document.getElementById('users-image-block')
    var usersName = document.getElementById('users-name')
    var usersSchool = document.getElementById('users-school')
    var usersMajor = document.getElementById('users-major')
    var usersBio = document.getElementById('users-bio')
    
    while ( usersImageBlock.firstChild ) {
        usersImageBlock.removeChild(usersImageBlock.firstChild)
    }

    var usersProfileImage = document.createElement('img')
    usersProfileImage.setAttribute('class', 'user-profile-image')
    usersProfileImage.src = coreProfileImage
    usersImageBlock.appendChild(usersProfileImage)

    var cameraIcon = document.createElement('div')
    cameraIcon.setAttribute('class', 'users-photo-icon')
    cameraIcon.innerHTML = ''
    usersImageBlock.appendChild(cameraIcon)

    usersName.innerHTML = coreName
    usersBio.innerHTML = coreBio
    usersSchool.innerHTML = await getSchoolName(coreSchool)
    usersMajor.innerHTML = coreSubject
    
}

async function loadTutorProfile() {
    var usersSessions = document.getElementById('users-sessions')
    var usersAverage = document.getElementById('users-average')

    usersSessions.innerHTML = await getCountOfSessions(globalUserId)
    usersAverage.innerHTML = await getRatingForUser(globalUserId)
}

