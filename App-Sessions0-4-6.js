//Global Variables__________________________________________________________________
var userDB = firebase.firestore()

var globalUserId,
    coreBalance,
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
		
	loadAuthHeader()
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
	
	coreBalance = data.currentBalance
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


//Tabs
const upcomingTab = document.getElementById('upcoming-tab')
const pendingTab = document.getElementById('pending-tab')
const pastTab = document.getElementById('past-tab')

const upcomingSessionsArea = document.getElementById('upcoming-sessions-area')
const pendingSessionsArea = document.getElementById('pending-sessions-area')
const pastSessionsArea = document.getElementById('past-sessions-area')

upcomingTab.addEventListener('click', () => {
    upcomingSessionsArea.style.display = 'block'
    pendingSessionsArea.style.display = 'none'
    pastSessionsArea.style.display = 'none'

    upcomingTab.setAttribute('class', 'sessions-tab-selected')
    pendingTab.setAttribute('class', 'sessions-tab-unselected')
    pastTab.setAttribute('class', 'sessions-tab-unselected')
})

pendingTab.addEventListener('click', () => {
    upcomingSessionsArea.style.display = 'none'
    pendingSessionsArea.style.display = 'block'
    pastSessionsArea.style.display = 'none'

    upcomingTab.setAttribute('class', 'sessions-tab-unselected')
    pendingTab.setAttribute('class', 'sessions-tab-selected')
    pastTab.setAttribute('class', 'sessions-tab-unselected')
})

pastTab.addEventListener('click', () => {
    upcomingSessionsArea.style.display = 'none'
    pendingSessionsArea.style.display = 'none'
    pastSessionsArea.style.display = 'block'

    upcomingTab.setAttribute('class', 'sessions-tab-unselected')
    pendingTab.setAttribute('class', 'sessions-tab-unselected')
    pastTab.setAttribute('class', 'sessions-tab-selected')
})


//Load user data and populate sessions
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		globalUserId = user.uid
		 
        userDB.collection('userTest').doc(globalUserId).onSnapshot(function(doc) {
            var data = doc.data()

            loadSessions()
            upcomingTab.click()
        })
		
	//If user is not logged in return them to login screen
	} else {
		location.href = "https://parent-tutortree.webflow.io/login"
	}
})

var isNewEvents = false
var loadNewEvents = document.getElementById('load-new-events')
loadNewEvents.addEventListener('click', () => {
    isNewEvents = false
    loadSessions()
})

function loadSessions() {
    noUpcomingSessions.style.display = 'none'
    noPendingSessions.style.display = 'none'
    noPastSessions.style.display = 'none'

    loadNewEvents.style.display = 'none'

    var currentTime = (new Date()).getTime() / 1000

    userDB.collection('userTest').doc(globalUserId).collection('sessions').onSnapshot( function(sessions) {
        if(isNewEvents) {
            loadNewEvents.style.display = 'flex'
        }
        isNewEvents = true

        var promises = []
        var upcomingSessions = []
        var pendingSessions = []
        var pastSessions = []

        sessions.forEach( function(doc) {
            var sessionDict = doc.data()

            if (sessionDict.status == 'confirmed' && sessionDict.end > currentTime) {
                var session = [sessionDict.start, doc.id, sessionDict]
                upcomingSessions.push(session)

            } else if (sessionDict.status == 'pending') {
                const session = [sessionDict.start, doc.id, sessionDict]
                pendingSessions.push(session)

            } else {
                const session = [sessionDict.start, doc.id, sessionDict]
                pastSessions.push(session)
            }

            const promise = doc.data()
            promises.push(promise)
        })

        Promise.all(promises).then(results => {
            if(pendingSessions.length == 0) {
                noPendingSessions.style.display = 'flex'
            }
            if(pastSessions.length == 0) {
                noPastSessions.style.display = 'flex'
            }
            buildUpcomingSessions(upcomingSessions)
            buildPendingSessions(pendingSessions)
            buildPastSessions(pastSessions)
        })
    })
}


async function buildUpcomingSessions(sessions) {

    while (upcomingSessionsArea.firstChild) {
        upcomingSessionsArea.removeChild(upcomingSessionsArea.firstChild)
    }

    if (sessions.length == 0) {
        buildEmptySessionsState(upcomingSessionsArea, 'No upcoming sessions')
    }

    var sortedSessions = sessions.sort(function(a, b) {
        return b[0] - a[0];
    })

    var sessionDate = ''
    for(var i = 0; i < sortedSessions.length; i++) {
        const sessionID = sortedSessions[i][1]
        const sessionInfo = sortedSessions[i][2]
        const endEpoch = sessionInfo.end
        const endDateObject = getFormattedDate(endEpoch)
        const endDateString = endDateObject[0] + ', ' + endDateObject[1] + ' ' + endDateObject[2]

        if ( sessionDate != endDateString ) {
            sessionDate = endDateString
            buildDateHeader(endDateString, upcomingSessionsArea)
        }

        await buildSessionBlock(sessionID, sessionInfo, upcomingSessionsArea)
    }
}


async function buildPendingSessions(sessions) {
    const pendingBubble = document.getElementById('pending-bubble')

    while (pendingSessionsArea.firstChild) {
        pendingSessionsArea.removeChild(pendingSessionsArea.firstChild)
    }

    if (sessions.length == 0) {
        buildEmptySessionsState(pendingSessionsArea, 'No pending sessions')
    }

    if (sessions.length > 0) {
        pendingBubble.innerHTML = sessions.length
        pendingBubble.style.display = 'flex'

    } else {
        pendingBubble.style.display = 'none'
    }

    var sortedSessions = sessions.sort(function(a, b) {
        return b[0] - a[0];
    })

    var sessionDate = ''
    for(var i = 0; i < sortedSessions.length; i++) {
        const sessionID = sortedSessions[i][1]
        const sessionInfo = sortedSessions[i][2]
        const endEpoch = sessionInfo.end
        const endDateObject = getFormattedDate(endEpoch)
        const endDateString = endDateObject[0] + ', ' + endDateObject[1] + ' ' + endDateObject[2]

        if ( sessionDate != endDateString ) {
            sessionDate = endDateString
            buildDateHeader(endDateString, pendingSessionsArea)
        }

        await buildSessionBlock(sessionID, sessionInfo, pendingSessionsArea)
    }
}


let noPastSessions = document.getElementById('no-past-sessions')

async function buildPastSessions(sessions) {
    
    while (pastSessionsArea.firstChild) {
        pastSessionsArea.removeChild(pastSessionsArea.firstChild)
    }

    if (sessions.length == 0) {
        buildEmptySessionsState(pastSessionsArea, 'No past sessions')
    }

    var sortedSessions = sessions.sort(function(a, b) {
        return b[0] - a[0];
    })

    var sessionDate = ''
    for(var i = 0; i < sortedSessions.length; i++) {
        const sessionID = sortedSessions[i][1]
        const sessionInfo = sortedSessions[i][2]
        const endEpoch = sessionInfo.end
        const endDateObject = getFormattedDate(endEpoch)
        const endDateString = endDateObject[0] + ', ' + endDateObject[1] + ' ' + endDateObject[2]

        if ( sessionDate != endDateString ) {
            sessionDate = endDateString
            buildDateHeader(endDateString, pastSessionsArea)
        }

        await buildSessionBlock(sessionID, sessionInfo, pastSessionsArea)
    }
}

function buildEmptySessionsState(DOMElement, text) {
    let emptySessionsDiv = document.createElement('div')
    emptySessionsDiv.setAttribute('class', 'empty-sessions-div')
    DOMElement.appendChild(emptySessionsDiv)

    let emptySessionsIcon = document.createElement('div')
    emptySessionsIcon.setAttribute('class', 'empty-sessions-icon')
    emptySessionsIcon.innerHTML = ''
    emptySessionsDiv.appendChild(emptySessionsIcon)

    let emptySessionsText = document.createElement('div')
    emptySessionsText.setAttribute('class', 'empty-sessions-text')
    emptySessionsText.innerHTML = text
    emptySessionsDiv.appendChild(emptySessionsText)
}


function buildDateHeader(endDateString, DOMElement) {
    var sessionDateHeader = document.createElement('div')
    sessionDateHeader.setAttribute('class', 'session-date-header')

    var sessionTime = document.createElement('div')
    sessionTime.setAttribute('class', 'session-time')
    sessionTime.innerHTML = endDateString

    sessionDateHeader.appendChild(sessionTime)
    DOMElement.appendChild(sessionDateHeader)

}



//Build sessions functions__________________________________________________________________________
async function buildSessionBlock(sessionID, sessionInfo, DOMElement) {
    //Assign variables
    var currentTime = (new Date()).getTime() / 1000
    const timeObject = getFormattedTime(sessionInfo.start, sessionInfo.end)
    const timeString = timeObject[0] + ' to ' + timeObject[1]
    const courseString = sessionInfo.course 

    var otherId = sessionInfo.student
    if (otherId == globalUserId) {
        otherId = sessionInfo.tutor
    }

    //Build session block upper
    var sessionBlock = document.createElement('div')
    sessionBlock.setAttribute('class', 'session-block')
    DOMElement.appendChild(sessionBlock)

    var sessionBlockTop = document.createElement('div')
    sessionBlockTop.setAttribute('class', 'session-block-top')
    sessionBlockTop.setAttribute('onClick', 'toggleSessionBlockBottom("'+sessionID+'")')
    sessionBlock.appendChild(sessionBlockTop)

    var sessionTime = document.createElement('div')
    sessionTime.setAttribute('class', 'session-time')
    sessionTime.innerHTML = timeString
    sessionBlockTop.appendChild(sessionTime)

    var sessionInfoBlock = document.createElement('div')
    sessionInfoBlock.setAttribute('class', 'session-info-block')
    sessionBlockTop.appendChild(sessionInfoBlock)

    var sessionInfoImage = document.createElement('img')
    sessionInfoImage.setAttribute('class', 'session-info-image')
    sessionInfoBlock.appendChild(sessionInfoImage)

    var sessionInfoText = document.createElement('div')
    sessionInfoText.setAttribute('class', 'session-info-text')
    sessionInfoBlock.appendChild(sessionInfoText)

    var sessionHeader = document.createElement('div')
    sessionHeader.setAttribute('class', 'session-header')
    sessionInfoText.appendChild(sessionHeader)

    var sessionInfoCourse = document.createElement('div')
    sessionInfoCourse.setAttribute('class', 'session-info')
    sessionInfoCourse.innerHTML = courseString
    sessionInfoText.appendChild(sessionInfoCourse)

    var detailsDiv = document.createElement('div')
    detailsDiv.setAttribute('class', 'details-div')
    sessionBlockTop.appendChild(detailsDiv)

    var sessionDetails = document.createElement('div')
    sessionDetails.setAttribute('class', 'sessions-details')
    sessionDetails.innerHTML = "Details"
    detailsDiv.appendChild(sessionDetails)

    var sessionsChevron = document.createElement('div')
    sessionsChevron.setAttribute('class', 'sessions-chevron')
    sessionsChevron.setAttribute('id', 'session-chevron-' + sessionID)
    sessionsChevron.innerHTML = ""
    detailsDiv.appendChild(sessionsChevron)

    //Build session block bottom
    var sessionBlockBottom = document.createElement('div')
    sessionBlockBottom.setAttribute('class', 'session-block-bottom')
    sessionBlockBottom.setAttribute('id', 'session-block-bottom-' + sessionID)
    sessionBlockBottom.style.display = 'none'
    sessionBlock.appendChild(sessionBlockBottom)

    var sessionBlockBottomLeft = document.createElement('div')
    sessionBlockBottomLeft.setAttribute('class', 'session-block-bottom-left')
    sessionBlockBottom.appendChild(sessionBlockBottomLeft)

    var sessionDividerLeft = document.createElement('div')
    sessionDividerLeft.setAttribute('class', 'session-divider-left')
    sessionBlockBottomLeft.appendChild(sessionDividerLeft)

    if(sessionInfo.tutor == globalUserId) {
        if(sessionInfo.status == 'pending') {
            var confirmSessionButton = document.createElement('div')
            confirmSessionButton.setAttribute('class', 'confirm-session')
            confirmSessionButton.innerHTML = 'Confirm'
            sessionBlockBottomLeft.appendChild(confirmSessionButton)
            confirmSessionButton.addEventListener('click', () => {
                confirmSession(sessionID, sessionInfo)
            })

            var rescheduleSessionButton = document.createElement('div')
            rescheduleSessionButton.setAttribute('class', 'reschedule-session')
            rescheduleSessionButton.addEventListener('click', () => {
                rescheduleSession(sessionID, sessionInfo)
            })
            rescheduleSessionButton.innerHTML = 'Reschedule'
            sessionBlockBottomLeft.appendChild(rescheduleSessionButton)
    
            var cancelSessionButton = document.createElement('div')
            cancelSessionButton.setAttribute('class', 'cancel-session')
            cancelSessionButton.addEventListener('click', () => {
                cancelSession(sessionID, sessionInfo)
            })
            cancelSessionButton.innerHTML = "Can't make it?"
            sessionBlockBottomLeft.appendChild(cancelSessionButton)
            
        } else if(sessionInfo.status == 'confirmed' && sessionInfo.end > currentTime) {
            var rescheduleSessionButton = document.createElement('div')
            rescheduleSessionButton.setAttribute('class', 'reschedule-session')
            rescheduleSessionButton.addEventListener('click', () => {
                rescheduleSession(sessionID, sessionInfo)
            })
            rescheduleSessionButton.innerHTML = 'Reschedule'
            sessionBlockBottomLeft.appendChild(rescheduleSessionButton)
    
            var cancelSessionButton = document.createElement('div')
            cancelSessionButton.setAttribute('class', 'cancel-session')
            cancelSessionButton.addEventListener('click', () => {
                cancelSession(sessionID, sessionInfo)
            })
            cancelSessionButton.innerHTML = "Can't make it?"
            sessionBlockBottomLeft.appendChild(cancelSessionButton)
        }
    }

    var sessionBlockBottomRight = document.createElement('div')
    sessionBlockBottomRight.setAttribute('class', 'session-block-bottom-right')
    sessionBlockBottom.appendChild(sessionBlockBottomRight)

    var sessionInfoEmailContainer = document.createElement('div')
    sessionInfoEmailContainer.setAttribute('class', 'session-info-lower')
    sessionBlockBottomRight.appendChild(sessionInfoEmailContainer)
    createSessionInfoHeader('Email', sessionInfoEmailContainer)

    var sessionInfoLocationContainer = document.createElement('div')
    sessionInfoLocationContainer.setAttribute('class', 'session-info-lower')
    sessionBlockBottomRight.appendChild(sessionInfoLocationContainer)

    let locationTextDiv = document.createElement('div')
    locationTextDiv.setAttribute('class', 'location-text-div')
    sessionInfoLocationContainer.appendChild(locationTextDiv)

    createSessionInfoHeader('Location', locationTextDiv)
    let editLocationIcon = document.createElement('div')
    editLocationIcon.setAttribute('class', 'edit-location-icon')
    editLocationIcon.innerHTML = ''
    editLocationIcon.addEventListener('click', () => {
        let locationContainer = document.getElementById(`add-location-container-${sessionID}`)
        if (locationContainer.style.display == 'none') {
            $(`#add-location-container-${sessionID}`).fadeIn()
        } else {
            $(`#add-location-container-${sessionID}`).fadeOut()
        }
    })
    locationTextDiv.appendChild(editLocationIcon)


    if(sessionInfo.hasOwnProperty('location')) {

        if(sessionInfo.location == 'zoom') {
            createSessionInfoText('This is a Zoom meeting', sessionInfoLocationContainer)
            var sessionInfoMeetingLink = document.createElement('div')
            sessionInfoMeetingLink.setAttribute('class', 'session-info-lower')
            sessionBlockBottomRight.appendChild(sessionInfoMeetingLink)

            let zoomLinkContainer = document.createElement('div')
            zoomLinkContainer.setAttribute('class', 'session-info-lower')
            sessionBlockBottomRight.appendChild(zoomLinkContainer)

            const zoomString = 'Attendees can join this session from a computer, tablet or smartphone'
            createSessionInfoHeader(zoomString, zoomLinkContainer)
            createSessionInfoText(sessionInfo.zoomLink, zoomLinkContainer)

            if(sessionInfo.hasOwnProperty('password')) {
                var sessionInfoPasswordContainer = document.createElement('div')
                sessionInfoPasswordContainer.setAttribute('class', 'session-info-lower')
                sessionBlockBottomRight.appendChild(sessionInfoPasswordContainer)
                createSessionInfoHeader('Password', sessionInfoPasswordContainer)
                createSessionInfoText(sessionInfo.password, sessionInfoPasswordContainer)
            }
        } else {
            createSessionInfoText(sessionInfo.location, sessionInfoLocationContainer)
        }
    } else {
        createSessionInfoText('No location has been set', sessionInfoLocationContainer)
    }
    buildLocationDiv(sessionInfoLocationContainer, sessionID, sessionInfo)

    var sessionInfoPhoneNumberContainer = document.createElement('div')
    sessionInfoPhoneNumberContainer.setAttribute('class', 'session-info-lower')
    sessionBlockBottomRight.appendChild(sessionInfoPhoneNumberContainer)
    createSessionInfoHeader('Contact Phone Number', sessionInfoPhoneNumberContainer)

    await userDB.collection('userTest').doc(otherId).get().then(function(doc) {
        var data = doc.data()
        let studentPhone = data.phoneNumber

        sessionHeader.innerHTML = data.name
        sessionInfoImage.src = data.profileImage
        createSessionInfoText(data.email, sessionInfoEmailContainer)
        if( data.phoneNumber == '' || data.phoneNumber == '123456789') {
            let phoneText = `${getFirstName(data.name)} hasn't added a number yet`
            createSessionInfoText(phoneText, sessionInfoPhoneNumberContainer)
        } else {
            createSessionInfoText(data.phoneNumber, sessionInfoPhoneNumberContainer)
        }
    })
}

//Location Setting
function buildLocationDiv(DOMElement, sessionID, sessionInfo) {
    let addLocationContainer = document.createElement('div')
    addLocationContainer.setAttribute('class', 'add-location-container')
    addLocationContainer.setAttribute('id', `add-location-container-${sessionID}`)
    addLocationContainer.style.display = 'none'
    DOMElement.appendChild(addLocationContainer)

    let sessionsButtonsDiv = document.createElement('div')
    sessionsButtonsDiv.setAttribute('class', 'sessions-button-div')
    addLocationContainer.appendChild(sessionsButtonsDiv)

    let inPersonButton = document.createElement('div')
    inPersonButton.setAttribute('class', 'sessions-button-inactive')
    inPersonButton.setAttribute('id', `in-person-button-${sessionID}`)
    inPersonButton.setAttribute('onClick', `updateLocationButtons(false, "${sessionID}")`)
    inPersonButton.innerHTML = 'In-Person'
    sessionsButtonsDiv.appendChild(inPersonButton)

    let zoomButton = document.createElement('div')
    zoomButton.setAttribute('class', 'sessions-button-inactive')
    zoomButton.setAttribute('id', `zoom-button-${sessionID}`)
    zoomButton.setAttribute('onClick', `updateLocationButtons(true, "${sessionID}")`)
    zoomButton.innerHTML = 'Zoom'
    sessionsButtonsDiv.appendChild(zoomButton)

    //Zoom div
    let sessionsZoomDiv = document.createElement('div')
    sessionsZoomDiv.setAttribute('class', 'sessions-zoom-div')
    sessionsZoomDiv.setAttribute('id', `zoom-div-${sessionID}`)
    sessionsZoomDiv.style.display = 'none'
    addLocationContainer.appendChild(sessionsZoomDiv)

    createSessionInfoHeader('Zoom Link', sessionsZoomDiv)

    let locationFieldContainer = document.createElement('div')
    locationFieldContainer.setAttribute('class', 'location-field-container')
    sessionsZoomDiv.appendChild(locationFieldContainer)

    let locationField = document.createElement('input')
    locationField.setAttribute('class', 'add-location-field')
    locationField.setAttribute('id', `zoom-link-field-${sessionID}`)
    locationField.addEventListener('focus', () => {
        $(`#location-save-button-${sessionID}`).fadeIn()
    })
    locationField.placeholder = 'Paste link here..'
    locationFieldContainer.appendChild(locationField)

    let locationSaveButton = document.createElement('div')
    locationSaveButton.setAttribute('class', 'sessions-button-active')
    locationSaveButton.setAttribute('id', `location-save-button-${sessionID}`)
    locationSaveButton.innerHTML = 'Save'
    locationSaveButton.addEventListener('click', () => {
        console.log(`this is the sessionID: ${sessionID}`)
        updateSessionLocation(sessionID, sessionInfo)
    })
    locationSaveButton.style.display = 'none'
    locationFieldContainer.appendChild(locationSaveButton)

    //In Person Div
    let sessionsInPersonDiv = document.createElement('div')
    sessionsInPersonDiv.setAttribute('class', 'sessions-zoom-div')
    sessionsInPersonDiv.setAttribute('id', `in-person-div-${sessionID}`)
    sessionsInPersonDiv.style.display = 'none'
    addLocationContainer.appendChild(sessionsInPersonDiv)

    createSessionInfoHeader('Meeting Area', sessionsInPersonDiv)

    let meetingLocationFieldContainer = document.createElement('div')
    meetingLocationFieldContainer.setAttribute('class', 'location-field-container')
    sessionsInPersonDiv.appendChild(meetingLocationFieldContainer)

    let meetingLocationField = document.createElement('input')
    meetingLocationField.setAttribute('class', 'add-location-field')
    meetingLocationField.setAttribute('id', `in-person-link-field-${sessionID}`)
    meetingLocationField.addEventListener('focus', () => {
        $(`#meeting-location-save-button-${sessionID}`).fadeIn()
    })
    meetingLocationField.placeholder = 'Edit Location..'
    meetingLocationFieldContainer.appendChild(meetingLocationField)

    let meetingLocationSaveButton = document.createElement('div')
    meetingLocationSaveButton.setAttribute('class', 'sessions-button-active')
    meetingLocationSaveButton.setAttribute('id', `meeting-location-save-button-${sessionID}`)
    meetingLocationSaveButton.innerHTML = 'Save'
    meetingLocationSaveButton.addEventListener('click', () => {
        console.log(`this is the sessionID: ${sessionID}`)
        updateSessionLocation(sessionID, sessionInfo)
    })
    meetingLocationSaveButton.style.display = 'none'
    meetingLocationFieldContainer.appendChild(meetingLocationSaveButton)
}


var isZoomSession = false
function updateLocationButtons(isZoom, sessionID) {
    isZoomSession = isZoom
    console.log(isZoomSession)

    let inPersonButton = document.getElementById(`in-person-button-${sessionID}`)
    let zoomButton = document.getElementById(`zoom-button-${sessionID}`)

    if(isZoom) {
        console.log('zoom is true')
        inPersonButton.setAttribute('class', 'sessions-button-inactive')
        zoomButton.setAttribute('class', 'sessions-button-active')

        document.getElementById(`in-person-div-${sessionID}`).style.display = 'none'
        $(`#zoom-div-${sessionID}`).fadeIn()
    } else {
        console.log('zoom is false')
        inPersonButton.setAttribute('class', 'sessions-button-active')
        zoomButton.setAttribute('class', 'sessions-button-inactive')

        document.getElementById(`zoom-div-${sessionID}`).style.display = 'none'
        $(`#in-person-div-${sessionID}`).fadeIn()
    }
}


function updateSessionLocation(sessionID, sessionInfo) {
    console.log(sessionInfo)
    let locationField = document.getElementById(`zoom-link-field-${sessionID}`)
    let meetingLocationField = document.getElementById(`in-person-link-field-${sessionID}`)
    var updateDict = {}
    var promises = []

    if (isZoomSession) {
        let zoomDict = {
            'location' : 'zoom',
            'zoomLink' : locationField.value 
        }
        updateDict = zoomDict
        console.log(updateDict)

    } else {
        let inPersonDict = {
            'location' : meetingLocationField.value 
        }
        updateDict = inPersonDict
        console.log(inPersonDict)
    }

    var studentPromise = userDB.collection('userTest').doc(sessionInfo.student).collection('sessions').doc(sessionID).update(updateDict).then( ()=> {
        console.log('Student doc written')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    var tutorPromise = userDB.collection('userTest').doc(sessionInfo.tutor).collection('sessions').doc(sessionID).update(updateDict).then( ()=> {
        console.log('Tutor doc written')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    var globalPromise = userDB.collection('globalSessions').doc(sessionID).update(updateDict).then( ()=> {
        console.log('Global doc written')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    promises.push(studentPromise, tutorPromise, globalPromise)

    Promise.all(promises).then(() => {
        console.log('All documents written')
        $(`#add-location-container-${sessionID}`).fadeOut()

        loadSessions()
    })
}


function toggleSessionBlockBottom(sessionID) {
    var elementID = 'session-block-bottom-' + sessionID
    var element = document.getElementById(elementID)

    if(element.style.display == 'flex') {
        element.style.display = 'none'
    } else {
        element.style.display = 'flex'
    }

    rotateChevron(sessionID)
}

function rotateChevron(sessionID) {
    var chevronID = 'session-chevron-' + sessionID
    var chevron = document.getElementById(chevronID)

    if (chevron.classList.contains('sessions-chevron')) {
        chevron.setAttribute('class', 'sessions-chevron-down')
    } else {
        chevron.setAttribute('class', 'sessions-chevron')
    }

}

function createSessionInfoHeader(text, DOMElement) {
    var sessionInfoHeader = document.createElement('div')
    sessionInfoHeader.setAttribute('class', 'session-header')
    sessionInfoHeader.innerHTML = text
    DOMElement.appendChild(sessionInfoHeader)
}

function createSessionInfoText(text, DOMElement) {
    var sessionInfoText = document.createElement('div')
    sessionInfoText.setAttribute('class', 'session-info')
    sessionInfoText.innerHTML = text
    DOMElement.appendChild(sessionInfoText)
}


//Session Confirmation_________________________________________________________________________________
const sessionsManagementPage = document.getElementById('sessions-management-page')
const sessionsBack = document.getElementById('sessions-back')
const completionBack = document.getElementById('completion-back')

sessionsBack.addEventListener('click', () => {
    sessionsManagementPage.style.display = 'none'
})
completionBack.addEventListener('click', () => {
    sessionsManagementPage.style.display = 'none'
})

const confirmSessionScreen = document.getElementById('confirm-session-screen')
const rescheduleSessionScreen = document.getElementById('reschedule-session-screen')
const cancelSessionScreen = document.getElementById('cancel-session-screen')
const completionScreen = document.getElementById('completion-screen')

function confirmSession(sessionID, sessionInfo) {
    window.scrollTo(0, 0);
    console.log(sessionID)
    userDB.collection('userTest').doc(sessionInfo.student).get().then(function(doc) {
        var data = doc.data()
        var studentName = data.name
        var studentPhoto = data.profileImage

        var studentImageContainer = document.getElementById('student-image-container')
        studentImageContainer.removeChild(studentImageContainer.firstChild)

        var studentImage = document.createElement('img')
        studentImage.setAttribute('class', 'student-profile-image')
        studentImage.src = studentPhoto 
        studentImageContainer.appendChild(studentImage)

        var studentNameHeader = document.getElementById('student-name')
        studentNameHeader.innerHTML = studentName

    })

    sessionsManagementPage.style.display = 'flex'
    confirmSessionScreen.style.display = 'flex'
    rescheduleSessionScreen.style.display = 'none'
    cancelSessionScreen.style.display = 'none'
    completionScreen.style.display = 'none'
    $("#processing-text").show()
    $('#confirmation-text').hide()
    $('#confirmation-check').hide()

    const sessionDate = document.getElementById('session-date')
    const sessionTime = document.getElementById('session-time')
    const sessionSubject = document.getElementById('session-subject')
    const sessionCourse = document.getElementById('session-course')
    const sessionTotal = document.getElementById('session-total')

    var dateObject = getFormattedDate(sessionInfo.start)
    var dateString = dateObject[0]+', '+dateObject[1]+' '+dateObject[2]
    sessionDate.innerHTML = dateString 

    var timeObject = getFormattedTime(sessionInfo.start, sessionInfo.end)
    var timeString = timeObject[0]+' to '+timeObject[1]
    sessionTime.innerHTML = timeString

    sessionSubject.innerHTML = sessionInfo.subject 
    sessionCourse.innerHTML = sessionInfo.course 
    
    var amountForTutor = parseFloat(sessionInfo.tutorsFee) * 0.85
    sessionTotal.innerHTML = '$' + amountForTutor.toFixed(2)

    var confirmSession = document.getElementById('confirm-session')
    var confirmSessionClone = confirmSession.cloneNode(true)
    confirmSession.parentNode.replaceChild(confirmSessionClone, confirmSession)
    confirmSessionClone.addEventListener('click', () => {
        $('#confirm-session-screen').fadeOut(400, () => {
            $('#completion-screen').fadeIn()
            processConfirmation(sessionID, sessionInfo, dateString)
        })
    })
}

function processConfirmation(sessionID, sessionInfo, sessionDate) {
    sessionInfo['status'] = 'confirmed'
    var depositTotal = parseFloat(sessionInfo.tutorsFee) * 0.85
    var promises = []

    var incomePromise = userDB.collection('userTest').doc(sessionInfo.tutor).collection('income').doc(sessionID).set(sessionInfo).then(function() {
        console.log('Income doc written')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    var spendingPromise = userDB.collection('userTest').doc(sessionInfo.student).collection('spending').doc(sessionID).set(sessionInfo).then(function() {
        console.log('Spending doc written')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    var studentPromise = userDB.collection('userTest').doc(sessionInfo.student).collection('sessions').doc(sessionID).update({'status' : 'confirmed'}).then( ()=> {
        console.log('Student doc written')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    var tutorPromise = userDB.collection('userTest').doc(sessionInfo.tutor).collection('sessions').doc(sessionID).update({'status' : 'confirmed'}).then( ()=> {
        console.log('Tutor doc written')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    var globalPromise = userDB.collection('globalSessions').doc(sessionID).update({'status' : 'confirmed'}).then( ()=> {
        console.log('Global doc written')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    var balancePromise = userDB.collection('userTest').doc(globalUserId).update({
        'currentBalance' : coreBalance + parseFloat(depositTotal)
    }).then(function() {
        console.log('Balance updated')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    var notificationPromise = userDB.collection('userTest').doc(sessionInfo.student).get().then(function(doc) {
        var userData = doc.data()

        var isSMSOn = userData.isSMSOn
        var isPushOn = userData.isPushOn
        var isEmailOn = userData.isEmailOn

        if(isSMSOn) {
            var phoneNumber = userData.phoneNumber
            var smsMessage = coreName + ' has confirmed your session on ' + sessionDate 
            sendSMSTo(phoneNumber, smsMessage)
        }

        if(isPushOn) {
            var token = userData.pushToken
            var pushTitle = "Session Confirmed"
            var pushMessage = coreName + ' has confirmed your session on ' + sessionDate 
            sendPushTo(token, pushTitle, pushMessage)
        }

        if(isEmailOn) {
            var email = userData.email 
            var emailTitle = 'Session Confirmed'
            var emailMessage = coreName + ' has confirmed your session on ' + sessionDate 
            sendEmailTo(email, emailTitle, emailMessage)
        }

        console.log('Notifications sent')
    })

    promises.push(incomePromise, spendingPromise, studentPromise, tutorPromise, globalPromise, balancePromise, notificationPromise)

    Promise.all(promises).then(() => {
        console.log('All documents written')
        isNewEvents = false
        loadSessions()
        $("#processing-text").hide(() => {
            $('#confirmation-text').fadeIn()
            $('#confirmation-check').fadeIn()
        })
    })

}


//Reschedule Functions_______________________________________________________________________________________________
var currentDate = getCurrentMonthAndYear()
var year = currentDate[0]
var month = currentDate[1]
var dayVal
var start
var end
var fullAvailability = [281474976708608, 
                        281474976708608, 
                        281474976708608, 
                        281474976708608, 
                        281474976708608, 
                        281474976708608, 
                        281474976708608]

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function setInitialState() {
    var sessionDateHeader = document.getElementById('session-date-header')
    var sessionTimeText = document.getElementById('session-time-text')
    var timeslotsContainer = document.getElementById('timeslots-container')

    sessionDateHeader.innerHTML = 'Select a Date'
    sessionTimeText.innerHTML = 'Select a Time'

    while(timeslotsContainer.firstChild) {
        timeslotsContainer.removeChild(timeslotsContainer.firstChild)
    }
    var noDateSelectedText = document.createElement('div')
    noDateSelectedText.setAttribute('class', 'no-date-selected-text')
    noDateSelectedText.innerHTML = "Select a date to choose a new time"
    timeslotsContainer.appendChild(noDateSelectedText)
}

function buildCalendarNav() {

    var confirmSession = document.getElementById('confirm-session')
    var confirmSessionClone = confirmSession.cloneNode(true)
    confirmSession.parentNode.replaceChild(confirmSessionClone, confirmSession)
    confirmSessionClone.addEventListener('click', () => {
        $('#confirm-session-screen').fadeOut(400, () => {
            $('#completion-screen').fadeIn()
            processConfirmation(sessionID, sessionInfo, dateString)
        })
    })


    var calendarBack = document.getElementById('calendar-back')
    var calendarBackClone = calendarBack.cloneNode(true)
    calendarBack.parentNode.replaceChild(calendarBackClone, calendarBack)
    calendarBackClone.addEventListener('click', () => {
        if (month==0) {
            year--
            month = 11
        } else {
            month--
        }
        buildCalendar(fullAvailability)
    })

    var calendarForward = document.getElementById('calendar-forward')
    var calendarForwardClone = calendarForward.cloneNode(true)
    calendarForward.parentNode.replaceChild(calendarForwardClone, calendarForward)
    calendarForwardClone.addEventListener('click', () => {
        if (month==11) {
            year++
            month = 0
        } else {
            month++
        }
        buildCalendar(fullAvailability)
    })
}

function buildCalendar(availability) {
    var calendarHeader = document.getElementById('calendar-header')
    calendarHeader.innerHTML = months[month] + " " + year

    var dayRowContainer = document.getElementById('day-row-container')
    while(dayRowContainer.firstChild) {
        dayRowContainer.removeChild(dayRowContainer.firstChild)
    }
    var daysInMonth = getDaysInMonth(year, month+1)
    var firstDay = firstDayOfMonth(year, month)
    var counter = 0
    var dayCounter = 1
    for(i=0; i<6; i++) {
        var dayRow = document.createElement('div')
        dayRow.setAttribute('class', 'day-row')
        dayRowContainer.appendChild(dayRow)

        for(j=0; j<7; j++) {
            var dayDiv = document.createElement('div')
            if( counter >= firstDay && dayCounter <= daysInMonth){
                dayDiv.setAttribute('class', 'day-div')
                dayDiv.setAttribute('id', 'dayDiv-' + dayCounter)
                dayRow.appendChild(dayDiv)

                var dayNumber = document.createElement('div')
                dayNumber.setAttribute('class', 'day-number')
                dayNumber.innerHTML = dayCounter
                dayDiv.appendChild(dayNumber)
    
                var dayCircle = document.createElement('div')
                if(availability[j] > 0) {
                    dayCircle.setAttribute('class', 'availability-circle')
                    dayDiv.setAttribute('onClick', 'daySelected("'+j+'","'+dayCounter+'","'+daysInMonth+'")')
                } else {
                    dayCircle.setAttribute('class', 'availability-circle-clear')
                }
                dayDiv.appendChild(dayCircle)
                dayCounter++
            } else {
                dayDiv.setAttribute('class', 'day-div-empty')
                dayRow.appendChild(dayDiv)
            }

            counter++
        }
    }
}

var timeOptions = ["6:00am", "6:30am", "7:00am", "7:30am", "8:00am","8:30am", "9:00am", "9:30am", "10:00am", "10:30am",
                    "11:00am", "11:30am", "12:00pm", "12:30pm", "1:00pm", "1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm", 
                    "4:00pm", "4:30pm", "5:00pm", "5:30pm", "6:00pm", "6:30pm", "7:00pm", "7:30pm", "8:00pm", "8:30pm", 
                    "9:00pm", "9:30pm", "10:00pm", "10:30pm", "11:00pm", "11:30pm", "12:00am"]
var availabilityArray = []
var sessionIndices = []

function daySelected(dayInt, dayOfMonth, daysInMonth) {
    dayVal = dayOfMonth
    sessionIndices = []

    //Change CSS
    const sessionDateHeader = document.getElementById('session-date-header')
    sessionDateHeader.innerHTML = formatSessionDate(dayInt, dayOfMonth, month)

    const selectedDay = document.getElementById('dayDiv-' + dayOfMonth)
    selectedDay.setAttribute('class', 'day-div-selected')
    selectedDay.childNodes[0].setAttribute('class', 'day-number-selected')
    selectedDay.childNodes[1].setAttribute('class', 'availability-circle-selected')

    for(i=1; i<=daysInMonth; i++) {
        if(i!=dayOfMonth) {
            var dayDiv = document.getElementById('dayDiv-' + i)
            dayDiv.setAttribute('class', 'day-div')
            var divChildren = dayDiv.childNodes
            divChildren[0].setAttribute('class', 'day-number')
            if(divChildren[1].classList.contains('availability-circle-selected')) {
                divChildren[1].setAttribute('class', 'availability-circle')
            }
        }
    }

    //Show Availability
    availabilityArray = twosComplement(fullAvailability[dayInt]).split("")
    loadTimeslots()
}

function loadTimeslots() {
    const timeslotsContainer = document.getElementById('timeslots-container')
    while(timeslotsContainer.firstChild) {
        timeslotsContainer.removeChild(timeslotsContainer.firstChild)
    }

    for(i=0; i<availabilityArray.length; i++) {
        if(availabilityArray[i] == 1) {
            var bookingTimeslot = document.createElement('div')
            bookingTimeslot.setAttribute('class', 'booking-timeslot')
            bookingTimeslot.setAttribute('onClick', 'timeslotSelected("'+i+'")')
            bookingTimeslot.setAttribute('id', 'timeslot-'+i)
            timeslotsContainer.appendChild(bookingTimeslot)
            bookingTimeslot.innerHTML = timeOptions[i]
        }
    }
}

function timeslotSelected(index) {
    const timeslotsContainer = document.getElementById('timeslots-container')
    const previousIndex = parseInt(index)-1
    const nextIndex = parseInt(index)+1
    var children = timeslotsContainer.childNodes

    if(sessionIndices.length == 0) {
        sessionIndices.push(parseInt(index))
        sessionIndices.sort()
        var timeslot = document.getElementById('timeslot-'+index)
        timeslot.setAttribute('class', 'booking-timeslot-selected')

        if(availabilityArray[nextIndex]==1) {
            var nextTimeslot = document.getElementById('timeslot-'+nextIndex)
            nextTimeslot.setAttribute('class', 'booking-timeslot-option')
        }

    } else if (index < sessionIndices[0] || index > sessionIndices[sessionIndices.length-1]+1 || sessionIndices.includes(parseInt(index))) {
        for(i=0; i<children.length; i++) {
            children[i].setAttribute('class', 'booking-timeslot')
        }
        sessionIndices = []
        sessionIndices.push(parseInt(index))
        sessionIndices.sort()
        var timeslot = document.getElementById('timeslot-'+index)
        timeslot.setAttribute('class', 'booking-timeslot-selected')

        if(availabilityArray[nextIndex]==1) {
            var nextTimeslot = document.getElementById('timeslot-'+nextIndex)
            nextTimeslot.setAttribute('class', 'booking-timeslot-option')
        }
    }  else if (availabilityArray[index]==1) {
        sessionIndices.push(parseInt(index))
        sessionIndices.sort()
        var timeslot = document.getElementById('timeslot-'+index)
        timeslot.setAttribute('class', 'booking-timeslot-selected')

        if(availabilityArray[nextIndex]==1) {
            var nextTimeslot = document.getElementById('timeslot-'+nextIndex)
            nextTimeslot.setAttribute('class', 'booking-timeslot-option')
        }
    }

    var sessionTimeText = document.getElementById('session-time-text')
    if (sessionIndices.length>1) {
        var lastSessionIndex = sessionIndices[sessionIndices.length-1]+1
        console.log(lastSessionIndex)
        sessionTimeText.innerHTML = timeOptions[sessionIndices[0]]+" to "+timeOptions[lastSessionIndex]
    } else {
        sessionTimeText.innerHTML = timeOptions[sessionIndices[0]]+" to "+timeOptions[sessionIndices[0]+1]
    }

    updateStartAndEnd()
}


//Availability Helper Functions__________________________________________________________________________
function updateStartAndEnd() {
    var dateObject = new Date(year, month, dayVal)
    var epoch = dateObject.getTime() / 1000
    start = epoch + 21600 + sessionIndices[0]*1800
    if (sessionIndices.length>1) {
        end = epoch + 21600 + sessionIndices[sessionIndices.length-1]*1800 + 1800
    } else {
        end = start + 1800
    }
}

function formatSessionDate(dayInt, dayOfMonth, month) {
    var suffix
    if (dayOfMonth == 1 || dayOfMonth == 21 ||dayOfMonth == 31) {
        suffix = "st"
    } else if( dayOfMonth == 2 || dayOfMonth == 22) {
        suffix = "nd"
    } else if (dayOfMonth == 3 || dayOfMonth == 23) {
        suffix = "rd"
    } else {
        suffix = "th"
    }
    
    const sessionString = days[dayInt] + ", " + months[month] + " " + dayOfMonth + suffix
    return sessionString
}

function getCurrentMonthAndYear() {
    var currentDate = new Date()
    var currentMonth = currentDate.getMonth()
    var currentYear = currentDate.getFullYear()
    return [currentYear, currentMonth]
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate()
}

function firstDayOfMonth(year, month) {
    var firstDate = new Date(year, month, 1)
    return firstDate.getDay()
}

function twosComplement(value) {
    let binaryStr;
    
    if (value >= 0) {
      let twosComp = value.toString(2);
      binaryStr = padAndChop(twosComp, '0', (64 || twosComp.length));
    } else {
      binaryStr = (Math.pow(2, 64) + value).toString(2);
      
      if (Number(binaryStr) < 0) {
        return undefined
      }
    }
    
    return binaryStr.slice(16,64)
}

function padAndChop(str, padChar, length) {
    return (Array(length).fill(padChar).join('') + str).slice(length * -1);
}


function rescheduleSession(sessionID, sessionInfo) {
    console.log(sessionID)
    var rescheduleDepositText = document.getElementById('reschedule-deposit-text')
    sessionsManagementPage.style.display = 'flex'
    confirmSessionScreen.style.display = 'none'
    rescheduleSessionScreen.style.display = 'block'
    cancelSessionScreen.style.display = 'none'
    completionScreen.style.display = 'none'
    rescheduleDepositText.style.display = 'none'

    if(sessionInfo.status == 'pending') {
        var depositTotal = parseFloat(sessionInfo.tutorsFee) * 0.85
        rescheduleDepositText.style.display = 'flex'
        rescheduleDepositText.innerHTML = 'Rescheduling this session will confirm it and credit your account with $'+ parseFloat(depositTotal).toFixed(2)
    }

    setInitialState()
    buildCalendarNav()
    buildCalendar(fullAvailability)

    var rescheduleSession = document.getElementById('reschedule-session')
    var rescheduleSessionClone = rescheduleSession.cloneNode(true)
    rescheduleSession.parentNode.replaceChild(rescheduleSessionClone, rescheduleSession)
    rescheduleSessionClone.addEventListener('click', () => {
        $('#reschedule-session-screen').fadeOut(400, () => {
            $('#completion-screen').fadeIn()
        })
        processReschedule(sessionID, sessionInfo)
    })
}

function processReschedule(sessionID, sessionInfo) {
    var sessionDate = document.getElementById('session-date-header').innerHTML
    var sessionTime = document.getElementById('session-time-text').innerHTML
    var promises = []

    //store previous status
    var previousStatus = sessionInfo.status
    var depositTotal = parseFloat(sessionInfo.tutorsFee) * 0.85

    //update sessionInfo with new start, end, and status as confirmed
    sessionInfo['start'] = start
    sessionInfo['end'] = end
    sessionInfo['status'] = 'confirmed' 

    //if session is pending:
    if(previousStatus == 'pending') {
        var balancePromise = userDB.collection('userTest').doc(globalUserId).update({
            'currentBalance' : coreBalance + parseFloat(depositTotal)
        }).then(function() {
            console.log('Balance updated')
        }).catch(function(error) {
            console.error("Error writing document: ", error);
        });

        var incomePromise = userDB.collection('userTest').doc(sessionInfo.tutor).collection('income').doc(sessionID).set(sessionInfo).then(function() {
            console.log('Income doc written')
        }).catch(function(error) {
            console.error("Error writing document: ", error);
        });
    
        var spendingPromise = userDB.collection('userTest').doc(sessionInfo.student).collection('spending').doc(sessionID).set(sessionInfo).then(function() {
            console.log('Spending doc written')
        }).catch(function(error) {
            console.error("Error writing document: ", error);
        });
        promises.push(balancePromise, incomePromise, spendingPromise)
    }

    //update student sessions
    var studentPromise = userDB.collection('userTest').doc(sessionInfo.student).collection('sessions').doc(sessionID).update(
        {'status' : 'confirmed', 'start' : start,'end' : end }).then( ()=> {
        console.log('Student doc written')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    //update tutor sessions
    var tutorPromise = userDB.collection('userTest').doc(sessionInfo.tutor).collection('sessions').doc(sessionID).update(
        {'status' : 'confirmed', 'start' : start,'end' : end }).then( ()=> {
        console.log('Tutor doc written')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    //update global sessions
    var globalPromise = userDB.collection('globalSessions').doc(sessionID).update(
        {'status' : 'confirmed', 'start' : start,'end' : end }).then( ()=> {
        console.log('Global doc written')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    //notify student of new time
    var notificationPromise = userDB.collection('userTest').doc(sessionInfo.student).get().then(function(doc) {
        var userData = doc.data()

        var isSMSOn = userData.isSMSOn
        var isPushOn = userData.isPushOn
        var isEmailOn = userData.isEmailOn

        if(isSMSOn) {
            var phoneNumber = userData.phoneNumber
            var smsMessage = coreName + ' has rescheduled your session to ' + sessionDate+' from '+sessionTime
            sendSMSTo(phoneNumber, smsMessage)
        }

        if(isPushOn) {
            var token = userData.pushToken
            var pushTitle = "Session Confirmed"
            var pushMessage = coreName + ' has rescheduled your session to ' + sessionDate+' from '+sessionTime
            sendPushTo(token, pushTitle, pushMessage)
        }

        if(isEmailOn) {
            var email = userData.email 
            var emailTitle = 'Session Confirmed'
            var emailMessage = coreName + ' has rescheduled your session to ' + sessionDate+' from '+sessionTime
            sendEmailTo(email, emailTitle, emailMessage)
        }

        console.log('Notifications sent')
    })

    promises.push(studentPromise, tutorPromise, globalPromise, notificationPromise)

    Promise.all(promises).then(() => {
        console.log('All documents written')
        isNewEvents = false
        loadSessions()
        $("#processing-text").hide(() => {
            if(previousStatus == 'pending'){
                document.getElementById('finished-text').innerHTML = 'This session has been rescheduled and your account has been credited'
            } else {
                document.getElementById('finished-text').innerHTML = 'This session has been successfully rescheduled and the student has been notified'
            }
            $('#confirmation-text').fadeIn()
            $('#confirmation-check').fadeIn()
        })
    })
}




//Cancel Session_______________________________________________________________________________________________________________________________
function cancelSession(sessionID, sessionInfo) {
    sessionsManagementPage.style.display = 'flex'
    confirmSessionScreen.style.display = 'none'
    rescheduleSessionScreen.style.display = 'none'
    cancelSessionScreen.style.display = 'flex'
    completionScreen.style.display = 'none'

    var cancelSessionButton = document.getElementById('cancel-session-button')
    cancelSessionClone = cancelSessionButton.cloneNode(true)
    cancelSessionButton.parentNode.replaceChild(cancelSessionClone, cancelSessionButton)
    cancelSessionClone.addEventListener('click', () => {
        $('#cancel-session-screen').fadeOut(400, () => {
            $('#completion-screen').fadeIn()
            processCancellation(sessionID, sessionInfo)
        })
    })
}

function processCancellation(sessionID, sessionInfo) {
    var cancellationField = document.getElementById('cancellation-field')
    var cancellationReason = cancellationField.value

    var sessionDate = document.getElementById('session-date-header').innerHTML
    var sessionTime = document.getElementById('session-time-text').innerHTML
    var promises = []
    var depositTotal = parseFloat(sessionInfo.tutorsFee) * 0.85

    //if session is confirmed
    if(sessionInfo.status == 'confirmed') {
        //deduct balance
        var balancePromise = userDB.collection('userTest').doc(globalUserId).update({
            'currentBalance' : coreBalance - parseFloat(depositTotal)
        }).then(function() {
            console.log('Balance updated')
        }).catch(function(error) {
            console.error("Error writing document: ", error);
        });

        promises.push(balancePromise)
    }

    //update student sessions
    var studentPromise = userDB.collection('userTest').doc(sessionInfo.student).collection('sessions').doc(sessionID).update({'status' : 'cancelled'}).then( ()=> {
        console.log('Student doc written')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    //update tutor sessions
    var tutorPromise = userDB.collection('userTest').doc(sessionInfo.tutor).collection('sessions').doc(sessionID).update({'status' : 'cancelled'}).then( ()=> {
        console.log('Tutor doc written')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    //update global sessions
    var globalPromise = userDB.collection('globalSessions').doc(sessionID).update({'status' : 'cancelled'}).then( ()=> {
        console.log('Global doc written')
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    //email support@
    var cancellationTitle = 'Tutor Cancelled Session'
    sendEmailTo('support@tutortree.com', cancellationTitle, cancellationReason)

    //notify student
    var notificationPromise = userDB.collection('userTest').doc(sessionInfo.student).get().then(function(doc) {
        var userData = doc.data()

        var isSMSOn = userData.isSMSOn
        var isPushOn = userData.isPushOn
        var isEmailOn = userData.isEmailOn

        if(isSMSOn) {
            var phoneNumber = userData.phoneNumber
            var smsMessage = coreName + ' has cancelled your session for ' + sessionDate+' from '+sessionTime
            sendSMSTo(phoneNumber, smsMessage)
        }

        if(isPushOn) {
            var token = userData.pushToken
            var pushTitle = "Session Confirmed"
            var pushMessage = coreName + ' has cancelled your session for ' + sessionDate+' from '+sessionTime
            sendPushTo(token, pushTitle, pushMessage)
        }

        if(isEmailOn) {
            var email = userData.email 
            var emailTitle = 'Session Confirmed'
            var emailMessage = coreName + ' has cancelled your session for ' + sessionDate+' from '+sessionTime
            sendEmailTo(email, emailTitle, emailMessage)
        }
        console.log('Notifications sent')
    })

    //refund student
    sendRefund(sessionID)

    promises.push(studentPromise, tutorPromise, globalPromise, notificationPromise)

    Promise.all(promises).then(() => {
        console.log('All documents written')
        isNewEvents = false
        loadSessions()
        $("#processing-text").hide(() => {
            document.getElementById('finished-text').innerHTML = 'This session has been cancelled and your student has been refunded.'
            $('#confirmation-text').fadeIn()
            $('#confirmation-check').fadeIn()
        })
    })
}






