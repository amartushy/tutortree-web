//Global Variables__________________________________________________________________
var globalDB = firebase.firestore()
var userDB = firebase.firestore().collection('userTest')

var globalAdminID,
    adminCoreBalance,
    adminName,
    adminEmail,
    adminPhone,
    adminProfileImage

//Initialize elements on page load
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		globalAdminID = user.uid
        
        loadAdminProperties(globalAdminID)
	    loadAuthHeader()
		
	//If user is not logged in return them to login screen
	} else {
		location.href = "https://app-tutortree.webflow.io/login"
	}
})

function loadAdminProperties(adminID) {

    userDB.doc(adminID).onSnapshot(function(doc) {
        let data = doc.data()

        var isAdmin = data.isAdmin
        if(!isAdmin) {
            location.href = "https://app-tutortree.webflow.io/login"

        } else {
            adminCoreBalance = data.currentBalance,
            adminName = data.name,
            adminEmail = data.email,
            adminPhone = data.phoneNumber,
            adminProfileImage = data.profileImage

            loadInterviews()
        }
    })
}


//Tabs
const upcomingTab = document.getElementById('upcoming-tab')
const pendingTab = document.getElementById('pending-tab')
const pastTab = document.getElementById('past-tab')

const upcomingInterviewsArea = document.getElementById('upcoming-interviews-area')
const pendingInterviewsArea = document.getElementById('pending-interviews-area')
const pastInterviewsArea = document.getElementById('past-interviews-area')

upcomingTab.addEventListener('click', () => {
    upcomingInterviewsArea.style.display = 'block'
    pendingInterviewsArea.style.display = 'none'
    pastInterviewsArea.style.display = 'none'

    upcomingTab.setAttribute('class', 'sessions-tab-selected')
    pendingTab.setAttribute('class', 'sessions-tab-unselected')
    pastTab.setAttribute('class', 'sessions-tab-unselected')
})

pendingTab.addEventListener('click', () => {
    upcomingInterviewsArea.style.display = 'none'
    pendingInterviewsArea.style.display = 'block'
    pastInterviewsArea.style.display = 'none'

    upcomingTab.setAttribute('class', 'sessions-tab-unselected')
    pendingTab.setAttribute('class', 'sessions-tab-selected')
    pastTab.setAttribute('class', 'sessions-tab-unselected')
})

pastTab.addEventListener('click', () => {
    upcomingInterviewsArea.style.display = 'none'
    pendingInterviewsArea.style.display = 'none'
    pastInterviewsArea.style.display = 'block'

    upcomingTab.setAttribute('class', 'sessions-tab-unselected')
    pendingTab.setAttribute('class', 'sessions-tab-unselected')
    pastTab.setAttribute('class', 'sessions-tab-selected')
})


// var isNewEvents = false
// var loadNewEvents = document.getElementById('load-new-events')
// loadNewEvents.addEventListener('click', () => {
//     isNewEvents = false
//     loadSessions()
// })


function loadInterviews() {
    var currentTime = (new Date()).getTime() / 1000

    globalDB.collection('interviews').onSnapshot( function(interviews) {
        var promises = []
        var upcomingInterviews = []
        var pendingInterviews = []
        var pastInterviews = []

        interviews.forEach( function(doc) {
            var interviewData = doc.data()

            if (interviewData.status == 'confirmed' && interviewData.end > currentTime) {
                let interview = [interviewData.start, doc.id, interviewData]
                upcomingInterviews.push(interview)

            } else if (interviewData.status == 'pending') {
                let interview = [interviewData.start, doc.id, interviewData]
                pendingInterviews.push(interview)

            } else {
                let interview = [interviewData.start, doc.id, interviewData]
                pastInterviews.push(interview)
            }

            const promise = doc.data()
            promises.push(promise)
        })

        Promise.all(promises).then( () => {
            buildUpcomingInterviews(upcomingInterviews)
            buildPendingInterviews(pendingInterviews)
            buildPastInterviews(pastInterviews)
        })
    })
}


async function buildUpcomingInterviews(interviews) {

    while (upcomingInterviewsArea.firstChild) {
        upcomingInterviewsArea.removeChild(upcomingInterviewsArea.firstChild)
    }

    if (interviews.length == 0) {
        buildEmptyInterviewsState(upcomingInterviewsArea, 'No upcoming interviews')
    }

    var sortedInterviews = interviews.sort(function(a, b) {
        return b[0] - a[0];
    })

    var interviewDate = ''
    for(var i = 0; i < sortedInterviews.length; i++) {
        const interviewID = sortedInterviews[i][1]
        const interviewInfo = sortedInterviews[i][2]
        const endEpoch = interviewInfo.end
        const endDateObject = getFormattedDate(endEpoch)
        const endDateString = endDateObject[0] + ', ' + endDateObject[1] + ' ' + endDateObject[2]

        if ( interviewDate != endDateString ) {
            interviewDate = endDateString
            buildDateHeader(endDateString, upcomingInterviewsArea)
        }

        await buildInterviewBlock(interviewID, interviewInfo, upcomingInterviewsArea)
    }
}


async function buildPendingInterviews(interviews) {
    const pendingBubble = document.getElementById('pending-bubble')

    while (pendingInterviewsArea.firstChild) {
        pendingInterviewsArea.removeChild(pendingInterviewsArea.firstChild)
    }

    if (interviews.length == 0) {
        buildEmptyInterviewsState(pendingInterviewsArea, 'No pending interviews')
        pendingBubble.style.display = 'none'
    }

    if (interviews.length > 0) {
        pendingBubble.innerHTML = interviews.length
        pendingBubble.style.display = 'flex'
    }

    var sortedInterviews = interviews.sort(function(a, b) {
        return b[0] - a[0];
    })

    var interviewDate = ''
    for(var i = 0; i < sortedInterviews.length; i++) {
        const interviewID = sortedInterviews[i][1]
        const interviewInfo = sortedInterviews[i][2]
        const endEpoch = interviewInfo.end
        const endDateObject = getFormattedDate(endEpoch)
        const endDateString = endDateObject[0] + ', ' + endDateObject[1] + ' ' + endDateObject[2]

        if ( interviewDate != endDateString ) {
            interviewDate = endDateString
            buildDateHeader(endDateString, pendingInterviewsArea)
        }

        await buildInterviewBlock(interviewID, interviewInfo, pendingInterviewsArea)
    }
}


async function buildPastInterviews(interviews) {
    
    while (pastInterviewsArea.firstChild) {
        pastInterviewsArea.removeChild(pastInterviewsArea.firstChild)
    }

    if (interviews.length == 0) {
        buildEmptyInterviewsState(pastInterviewsArea, 'No past interviews')
    }

    var sortedInterviews = interviews.sort(function(a, b) {
        return b[0] - a[0];
    })

    var interviewDate = ''
    for(var i = 0; i < sortedInterviews.length; i++) {
        const interviewID = sortedInterviews[i][1]
        const interviewInfo = sortedInterviews[i][2]
        const endEpoch = interviewInfo.end
        const endDateObject = getFormattedDate(endEpoch)
        const endDateString = endDateObject[0] + ', ' + endDateObject[1] + ' ' + endDateObject[2]

        if ( interviewDate != endDateString ) {
            interviewDate = endDateString
            buildDateHeader(endDateString, pastInterviewsArea)
        }

        await buildInterviewBlock(interviewID, interviewInfo, pastInterviewsArea)
    }
}

function buildEmptyInterviewsState(DOMElement, text) {
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



//Build Interview Functions__________________________________________________________________________
async function buildInterviewBlock(interviewID, interviewInfo, DOMElement) {

    //Assign variables
    var currentTime = (new Date()).getTime() / 1000
    const timeObject = getFormattedTime(interviewInfo.start, interviewInfo.end)
    const timeString = timeObject[0] + ' to ' + timeObject[1]
    const applicantSchool = interviewInfo.applicantsSchool 

    var applicantID = interviewInfo.applicant

    //Build session block upper
    var sessionBlock = document.createElement('div')
    sessionBlock.setAttribute('class', 'session-block')
    DOMElement.appendChild(sessionBlock)

    var sessionBlockTop = document.createElement('div')
    sessionBlockTop.setAttribute('class', 'session-block-top')
    sessionBlockTop.setAttribute('onClick', 'toggleSessionBlockBottom("'+interviewID+'")')
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
    sessionInfoCourse.innerHTML = applicantSchool
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
    sessionsChevron.setAttribute('id', 'session-chevron-' + interviewID)
    sessionsChevron.innerHTML = ""
    detailsDiv.appendChild(sessionsChevron)

    //Build session block bottom
    var sessionBlockBottom = document.createElement('div')
    sessionBlockBottom.setAttribute('class', 'session-block-bottom')
    sessionBlockBottom.setAttribute('id', 'session-block-bottom-' + interviewID)
    sessionBlockBottom.style.display = 'none'
    sessionBlock.appendChild(sessionBlockBottom)

    var sessionBlockBottomLeft = document.createElement('div')
    sessionBlockBottomLeft.setAttribute('class', 'session-block-bottom-left')
    sessionBlockBottom.appendChild(sessionBlockBottomLeft)

    var sessionDividerLeft = document.createElement('div')
    sessionDividerLeft.setAttribute('class', 'session-divider-left')
    sessionBlockBottomLeft.appendChild(sessionDividerLeft)

    //Interview is pending, allow any admin to confirm interview
    if(interviewInfo.status == 'pending') {
        var confirmSessionButton = document.createElement('div')
        confirmSessionButton.setAttribute('class', 'confirm-session')
        confirmSessionButton.innerHTML = 'Confirm'
        sessionBlockBottomLeft.appendChild(confirmSessionButton)
        confirmSessionButton.addEventListener('click', () => {
            confirmInterview(interviewID, interviewInfo)
        })

    //interview is upcoming, only allow interview that has confirmed it to manage
    } else if(interviewInfo.status == 'confirmed' && interviewInfo.end > currentTime && interviewInfo.interviewer == globalAdminID) {
        var rescheduleSessionButton = document.createElement('div')
        rescheduleSessionButton.setAttribute('class', 'reschedule-session')
        rescheduleSessionButton.addEventListener('click', () => {
            rescheduleInterview(interviewID, interviewInfo)
        })
        rescheduleSessionButton.innerHTML = 'Reschedule'
        sessionBlockBottomLeft.appendChild(rescheduleSessionButton)

        var cancelSessionButton = document.createElement('div')
        cancelSessionButton.setAttribute('class', 'cancel-session')
        cancelSessionButton.addEventListener('click', () => {
            cancelInterview(interviewID, interviewInfo)
        })
        cancelSessionButton.innerHTML = "Cancel Interview"
        sessionBlockBottomLeft.appendChild(cancelSessionButton)
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

    if(interviewInfo.zoomLink != 'No link has been set') {
        createSessionInfoText('This is a Zoom meeting', sessionInfoLocationContainer)
        var sessionInfoMeetingLink = document.createElement('div')
        sessionInfoMeetingLink.setAttribute('class', 'session-info-lower')
        sessionBlockBottomRight.appendChild(sessionInfoMeetingLink)

        let zoomLinkContainer = document.createElement('div')
        zoomLinkContainer.setAttribute('class', 'session-info-lower')
        sessionBlockBottomRight.appendChild(zoomLinkContainer)

        const zoomString = 'Attendees can join this session from a computer, tablet or smartphone'
        createSessionInfoHeader(zoomString, zoomLinkContainer)
        createSessionInfoText(interviewInfo.zoomLink, zoomLinkContainer)

        if(interviewInfo.hasOwnProperty('password')) {
            var sessionInfoPasswordContainer = document.createElement('div')
            sessionInfoPasswordContainer.setAttribute('class', 'session-info-lower')
            sessionBlockBottomRight.appendChild(sessionInfoPasswordContainer)
            createSessionInfoHeader('Password', sessionInfoPasswordContainer)
            createSessionInfoText(interviewInfo.zoomPassword, sessionInfoPasswordContainer)
        }
    } else {

        createSessionInfoText(interviewInfo.zoomLink, sessionInfoLocationContainer)
    }

    if(interviewInfo.status == 'confirmed' && interviewInfo.end > currentTime && interviewInfo.interviewer == globalAdminID) {
        let editLocationIcon = document.createElement('div')
        editLocationIcon.setAttribute('class', 'edit-location-icon')
        editLocationIcon.innerHTML = ''
        editLocationIcon.addEventListener('click', () => {
            let locationContainer = document.getElementById(`add-location-container-${interviewID}`)
            if (locationContainer.style.display == 'none') {
                $(`#add-location-container-${interviewID}`).fadeIn()
            } else {
                $(`#add-location-container-${interviewID}`).fadeOut()
            }
        })
        locationTextDiv.appendChild(editLocationIcon)

        buildLocationDiv(sessionInfoLocationContainer, interviewID, interviewInfo)
    }

    var sessionInfoPhoneNumberContainer = document.createElement('div')
    sessionInfoPhoneNumberContainer.setAttribute('class', 'session-info-lower')
    sessionBlockBottomRight.appendChild(sessionInfoPhoneNumberContainer)
    createSessionInfoHeader('Contact Phone Number', sessionInfoPhoneNumberContainer)

    await userDB.doc(applicantID).get().then(function(doc) {
        var data = doc.data()

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
function buildLocationDiv(DOMElement, interviewID, interviewInfo) {
    let addLocationContainer = document.createElement('div')
    addLocationContainer.setAttribute('class', 'add-location-container')
    addLocationContainer.setAttribute('id', `add-location-container-${interviewID}`)
    addLocationContainer.style.display = 'none'
    DOMElement.appendChild(addLocationContainer)

    let sessionsButtonsDiv = document.createElement('div')
    sessionsButtonsDiv.setAttribute('class', 'sessions-button-div')
    addLocationContainer.appendChild(sessionsButtonsDiv)

    let inPersonButton = document.createElement('div')
    inPersonButton.setAttribute('class', 'sessions-button-inactive')
    inPersonButton.setAttribute('id', `in-person-button-${interviewID}`)
    inPersonButton.setAttribute('onClick', `updateLocationButtons(false, "${interviewID}")`)
    inPersonButton.innerHTML = 'In-Person'
    sessionsButtonsDiv.appendChild(inPersonButton)

    let zoomButton = document.createElement('div')
    zoomButton.setAttribute('class', 'sessions-button-inactive')
    zoomButton.setAttribute('id', `zoom-button-${interviewID}`)
    zoomButton.setAttribute('onClick', `updateLocationButtons(true, "${interviewID}")`)
    zoomButton.innerHTML = 'Zoom'
    sessionsButtonsDiv.appendChild(zoomButton)

    //Zoom div
    let sessionsZoomDiv = document.createElement('div')
    sessionsZoomDiv.setAttribute('class', 'sessions-zoom-div')
    sessionsZoomDiv.setAttribute('id', `zoom-div-${interviewID}`)
    sessionsZoomDiv.style.display = 'none'
    addLocationContainer.appendChild(sessionsZoomDiv)

    createSessionInfoHeader('Zoom Link', sessionsZoomDiv)

    let locationFieldContainer = document.createElement('div')
    locationFieldContainer.setAttribute('class', 'location-field-container')
    sessionsZoomDiv.appendChild(locationFieldContainer)

    let locationField = document.createElement('input')
    locationField.setAttribute('class', 'add-location-field')
    locationField.setAttribute('id', `zoom-link-field-${interviewID}`)
    locationField.addEventListener('focus', () => {
        $(`#location-save-button-${interviewID}`).fadeIn()
    })
    locationField.placeholder = 'Paste link here..'
    locationFieldContainer.appendChild(locationField)

    let locationSaveButton = document.createElement('div')
    locationSaveButton.setAttribute('class', 'sessions-button-active')
    locationSaveButton.setAttribute('id', `location-save-button-${interviewID}`)
    locationSaveButton.innerHTML = 'Save'
    locationSaveButton.addEventListener('click', () => {
        console.log(`this is the sessionID: ${interviewID}`)
        updateSessionLocation(interviewID, interviewInfo)
    })
    locationSaveButton.style.display = 'none'
    locationFieldContainer.appendChild(locationSaveButton)

    //In Person Div
    let sessionsInPersonDiv = document.createElement('div')
    sessionsInPersonDiv.setAttribute('class', 'sessions-zoom-div')
    sessionsInPersonDiv.setAttribute('id', `in-person-div-${interviewID}`)
    sessionsInPersonDiv.style.display = 'none'
    addLocationContainer.appendChild(sessionsInPersonDiv)

    createSessionInfoHeader('Meeting Area', sessionsInPersonDiv)

    let meetingLocationFieldContainer = document.createElement('div')
    meetingLocationFieldContainer.setAttribute('class', 'location-field-container')
    sessionsInPersonDiv.appendChild(meetingLocationFieldContainer)

    let meetingLocationField = document.createElement('input')
    meetingLocationField.setAttribute('class', 'add-location-field')
    meetingLocationField.setAttribute('id', `in-person-link-field-${interviewID}`)
    meetingLocationField.addEventListener('focus', () => {
        $(`#meeting-location-save-button-${interviewID}`).fadeIn()
    })
    meetingLocationField.placeholder = 'Edit Location..'
    meetingLocationFieldContainer.appendChild(meetingLocationField)

    let meetingLocationSaveButton = document.createElement('div')
    meetingLocationSaveButton.setAttribute('class', 'sessions-button-active')
    meetingLocationSaveButton.setAttribute('id', `meeting-location-save-button-${interviewID}`)
    meetingLocationSaveButton.innerHTML = 'Save'
    meetingLocationSaveButton.addEventListener('click', () => {
        console.log(`this is the sessionID: ${interviewID}`)
        updateSessionLocation(interviewID, interviewInfo)
    })
    meetingLocationSaveButton.style.display = 'none'
    meetingLocationFieldContainer.appendChild(meetingLocationSaveButton)
}

var isZoomSession = false
function updateLocationButtons(isZoom, interviewID) {
    isZoomSession = isZoom
    console.log(isZoomSession)

    let inPersonButton = document.getElementById(`in-person-button-${interviewID}`)
    let zoomButton = document.getElementById(`zoom-button-${interviewID}`)

    if(isZoom) {
        inPersonButton.setAttribute('class', 'sessions-button-inactive')
        zoomButton.setAttribute('class', 'sessions-button-active')

        document.getElementById(`in-person-div-${interviewID}`).style.display = 'none'
        $(`#zoom-div-${interviewID}`).fadeIn()
    } else {
        inPersonButton.setAttribute('class', 'sessions-button-active')
        zoomButton.setAttribute('class', 'sessions-button-inactive')

        document.getElementById(`zoom-div-${interviewID}`).style.display = 'none'
        $(`#in-person-div-${interviewID}`).fadeIn()
    }
}


function updateSessionLocation(interviewID, interviewInfo) {
    let locationField = document.getElementById(`zoom-link-field-${interviewID}`)
    let meetingLocationField = document.getElementById(`in-person-link-field-${interviewID}`)
    var updateDict = {}
    var promises = []

    if (isZoomSession) {
        let zoomDict = {
            'location' : 'zoom',
            'zoomLink' : locationField.value 
        }
        updateDict = zoomDict

    } else {
        let inPersonDict = {
            'location' : meetingLocationField.value 
        }
        updateDict = inPersonDict
    }

    // var applicantPromise = userDB.doc(interviewInfo.tutor).collection('sessions').doc(interviewID).update(updateDict).then( ()=> {
    //     console.log('Tutor doc written')
    // }).catch(function(error) {
    //     console.error("Error writing document: ", error);
    // });

    // var globalPromise = userDB.collection('interviews').doc(interviewID).update(updateDict).then( ()=> {
    //     console.log('Global doc written')
    // }).catch(function(error) {
    //     console.error("Error writing document: ", error);
    // });

    // promises.push(studentPromise, tutorPromise, globalPromise)

    Promise.all(promises).then(() => {
        console.log('All documents written')
        $(`#add-location-container-${interviewID}`).fadeOut()

        loadSessions()
    })
}

function toggleSessionBlockBottom(interviewID) {
    var element = document.getElementById(`session-block-bottom-${interviewID}`)

    if(element.style.display == 'flex') {
        element.style.display = 'none'
    } else {
        element.style.display = 'flex'
    }

    rotateChevron(interviewID)
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
