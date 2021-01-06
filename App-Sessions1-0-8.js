//Global Variables__________________________________________________________________
var userDB = firebase.firestore()
var globalUserId


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

function loadSessions() {

    var currentTime = (new Date()).getTime() / 1000

    userDB.collection('userTest').doc(globalUserId).collection('sessions').onSnapshot( function(sessions) {

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

async function buildPastSessions(sessions) {
while (pastSessionsArea.firstChild) {
    pastSessionsArea.removeChild(pastSessionsArea.firstChild)
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

    var sessionHeader = document.createElement('div')
    sessionHeader.setAttribute('class', 'session-header')
    sessionInfoBlock.appendChild(sessionHeader)

    var sessionInfoText = document.createElement('div')
    sessionInfoText.setAttribute('class', 'session-info')
    sessionInfoText.innerHTML = courseString
    sessionInfoBlock.appendChild(sessionInfoText)

    var detailsDiv = document.createElement('div')
    detailsDiv.setAttribute('class', 'details-div')
    sessionBlockTop.appendChild(detailsDiv)

    var sessionDetails = document.createElement('div')
    sessionDetails.setAttribute('class', 'sessions-details')
    sessionDetails.innerHTML = "Details"
    detailsDiv.appendChild(sessionDetails)

    var sessionsChevron = document.createElement('div')
    sessionsChevron.setAttribute('class', 'sessions-chevron')
    sessionsChevron.innerHTML = ""
    detailsDiv.appendChild(sessionsChevron)

    //Build session block bottom
    var sessionBlockBottom = document.createElement('div')
    sessionBlockBottom.setAttribute('class', 'session-block-bottom')
    sessionBlockBottom.setAttribute('id', 'session-block-bottom-' + sessionID)
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
            confirmSessionButton.setAttribute('onClick', 'confirmSession("'+sessionID+'","'+sessionInfo+'")')
            confirmSessionButton.innerHTML = 'Confirm'
            sessionBlockBottomLeft.appendChild(confirmSessionButton)

            var rescheduleSessionButton = document.createElement('div')
            rescheduleSessionButton.setAttribute('class', 'reschedule-session')
            rescheduleSessionButton.setAttribute('onClick', 'rescheduleSession("'+sessionID+'","'+sessionInfo+'")')
            rescheduleSessionButton.innerHTML = 'Reschedule'
            sessionBlockBottomLeft.appendChild(rescheduleSessionButton)
    
            var cancelSessionButton = document.createElement('div')
            cancelSessionButton.setAttribute('class', 'cancel-session')
            cancelSessionButton.setAttribute('onClick', 'cancelSession("'+sessionID+'","'+sessionInfo+'")')
            cancelSessionButton.innerHTML = "Can't make it?"
            sessionBlockBottomLeft.appendChild(cancelSessionButton)
            
        } else if(sessionInfo.status == 'confirmed' && sessionInfo.end > currentTime) {
            var rescheduleSessionButton = document.createElement('div')
            rescheduleSessionButton.setAttribute('class', 'reschedule-session')
            rescheduleSessionButton.setAttribute('onClick', 'rescheduleSession("'+sessionID+'","'+sessionInfo+'")')
            rescheduleSessionButton.innerHTML = 'Reschedule'
            sessionBlockBottomLeft.appendChild(rescheduleSessionButton)
    
            var cancelSessionButton = document.createElement('div')
            cancelSessionButton.setAttribute('class', 'cancel-session')
            cancelSessionButton.setAttribute('onClick', 'cancelSession("'+sessionID+'","'+sessionInfo+'")')
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
    createSessionInfoHeader('Location', sessionInfoLocationContainer)

    if(sessionInfo.hasOwnProperty('location')) {

        if(sessionInfo.location == 'Zoom') {
            createSessionInfoText('This is a Zoom meeting', sessionInfoLocationContainer)
            var sessionInfoMeetingLink = document.createElement('div')
            sessionInfoMeetingLink.setAttribute('class', 'session-info-lower')
            sessionBlockBottomRight.appendChild(sessionInfoMeetingLink)
            const zoomString = 'Attendees can join this session from a computer, tablet or smartphone'
            createSessionInfoHeader(zoomString, sessionInfoLocationContainer)
            createSessionInfoText(sessionInfo.location, sessionInfoMeetingLink)

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

    var sessionInfoPhoneNumberContainer = document.createElement('div')
    sessionInfoPhoneNumberContainer.setAttribute('class', 'session-info-lower')
    sessionBlockBottomRight.appendChild(sessionInfoPhoneNumberContainer)
    createSessionInfoHeader('Contact Phone Number',sessionInfoPhoneNumberContainer )

    var sessionInfoNotesContainer = document.createElement('div')
    sessionInfoNotesContainer.setAttribute('class', 'session-info-lower')
    sessionBlockBottomRight.appendChild(sessionInfoNotesContainer)
    createSessionInfoHeader('Notes', sessionInfoNotesContainer)
    if(sessionInfo.hasOwnProperty('notes')) {
        createSessionInfoText(sessionInfo.notes, sessionInfoNotesContainer)
    } else {
        createSessionInfoText('No notes yet', sessionInfoNotesContainer)
    }

    await userDB.collection('userTest').doc(otherId).get().then(function(doc) {
        var data = doc.data()
        sessionHeader.innerHTML = data.name
        createSessionInfoText(data.email, sessionInfoEmailContainer)
        createSessionInfoText(data.phoneNumber, sessionInfoPhoneNumberContainer)
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
