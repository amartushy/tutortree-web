//Profile Elements
var hiddenPhotoUploadButton = document.getElementById('hidden-photo-upload-button')
var profileImageBlock = document.getElementById('profile-image-block')
var usersProfilePhoto = document.getElementById('users-profile-photo')
var currentUsersName = document.getElementById('current-users-name')
var sessionsText = document.getElementById('sessions-text')
var averageText = document.getElementById('average-text')
var usersBio = document.getElementById('users-bio')
var updateProfileBlock = document.getElementById('update-profile-block')
var updateProfile = document.getElementById('update-profile')
var savedAlert = document.getElementById('saved-alert')

//Settings Elements
var emailToggle = document.getElementById('email-toggle')
var emailField = document.getElementById('email-field')
var smsToggle = document.getElementById('sms-toggle')
var smsField = document.getElementById('sms-field')
var currentBalance = document.getElementById('current-balance')
var transactionsButton = document.getElementById('transactions-button')

//Buttons for Modals
var depositButton = document.getElementById('deposit-button')
var signOutButton = document.getElementById('sign-out-button')
var tosButton = document.getElementById('tos-button')
var transactionsButton = document.getElementById('transactions-button')
var contactUsButton = document.getElementById('contact-us-button')

//Modals
var depositModal = document.getElementById('deposit-modal')
var transactionsModal = document.getElementById('financials-modal')
var tosModal = document.getElementById('tos-modal')
var contactModal = document.getElementById('contact-modal')

var profileTab = document.getElementById('profile-tab')

//Profile functions_____________________________________________________________________________
profileTab.addEventListener('click', function(){
    loadProfile()
    loadSettings()
})

function loadProfile() {
    updateProfileBlock.style.display = 'none'
    savedAlert.style.display = 'none'

    userDB.collection('userTest').doc(globalID).get().then(async function(doc) {
        var userData = doc.data()
        var userAverage = await getRatingForUser(globalID)
        var userSessions = await getCountOfSessions(globalID)

        //create Photo element because setting src doesn't work :/
	profileImageBlock.removeChild(profileImageBlock.firstChild)
        var usersProfilePhoto = document.createElement('img') 
        usersProfilePhoto.setAttribute('class', 'upload-image')
        usersProfilePhoto.src = userData.profileImage
        usersProfilePhoto.addEventListener('click', openPhotoUploadDialog)
        profileImageBlock.appendChild(usersProfilePhoto)

        currentUsersName.value = userData.name
        sessionsText.innerHTML = userSessions
        averageText.innerHTML = userAverage
        usersBio.value = userData.bio

        usersBio.onfocus = function() {
            updateProfileBlock.style.display = 'flex'
        }

        currentUsersName.onfocus = function() {
            updateProfileBlock.style.display = 'flex'
        }

    })

    updateProfile.addEventListener('click', function() {
        var newBio = usersBio.value
        var newName = currentUsersName.value

        userDB.collection("userTest").doc(globalID)
        .update( {"bio" : newBio,
                  "name" : newName }).then( function(){
                    savedAlert.style.display = 'flex'
                    $("#saved-alert").fadeOut(2000)
                  })
           
    updateProfileBlock.style.display = 'none'
    })
}

//Photo Upload
storageRef = storageService.ref()

function openPhotoUploadDialog() {
	hiddenPhotoUploadButton.click();
}

hiddenPhotoUploadButton.addEventListener('change', uploadProfileImage);

var selectedPhotoFile;
function uploadProfileImage(e) {
    selectedPhotoFile = e.target.files[0];
    handlePhotoUpload()
}

async function handlePhotoUpload() {
	const uploadTask = await storageRef.child(`images/${selectedPhotoFile.name}`).put(selectedPhotoFile);
	uploadAndUpdateFirebasePhoto()
}

//final submit button and update firebase
async function uploadAndUpdateFirebasePhoto() {
	var phototFileURL = ""
	await storageRef.child('/images/'+selectedPhotoFile.name)
		.getDownloadURL()
		.then(function(url) { phototFileURL = url.toString() })
	userDB.collection("userTest")
		.doc(globalID)
        .update( {"profileImage" : phototFileURL })
        .then(function() {
            userDB.collection('userTest').doc(globalID).get().then(async function(doc) {
                profileImageBlock.removeChild(profileImageBlock.firstChild)
                var usersProfilePhoto = document.createElement('img') 
                usersProfilePhoto.setAttribute('class', 'upload-image')
                usersProfilePhoto.src = userData.profileImage
                usersProfilePhoto.addEventListener('click', openPhotoUploadDialog)
                profileImageBlock.appendChild(usersProfilePhoto)
            })
        })
}

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
