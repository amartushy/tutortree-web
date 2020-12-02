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
                var session = [sessionDict.start, sessionDict]
                upcomingSessions.push(session)

            } else if (sessionDict.status == 'pending') {
                const session = [sessionDict.start, sessionDict]
                pendingSessions.push(session)

            } else {
                const session = [sessionDict.start, sessionDict]
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
        const sessionInfo = sortedSessions[i][1]
        const endEpoch = sessionInfo.end
        const endDateObject = getFormattedDate(endEpoch)
        const endDateString = endDateObject[0] + ', ' + endDateObject[1] + ' ' + endDateObject[2]

        if ( sessionDate != endDateString ) {
            sessionDate = endDateString
            console.log(sessionDate)

            buildDateHeader(endDateString, upcomingSessionsArea)
        }

        await buildSessionBlock(sessionInfo, upcomingSessionsArea)
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
        const sessionInfo = sortedSessions[i][1]
        const endEpoch = sessionInfo.end
        const endDateObject = getFormattedDate(endEpoch)
        const endDateString = endDateObject[0] + ', ' + endDateObject[1] + ' ' + endDateObject[2]

        if ( sessionDate != endDateString ) {
            sessionDate = endDateString
            console.log(sessionDate)

            buildDateHeader(endDateString, pendingSessionsArea)
        }

        await buildSessionBlock(sessionInfo, pendingSessionsArea)
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
        const sessionInfo = sortedSessions[i][1]
        const endEpoch = sessionInfo.end
        const endDateObject = getFormattedDate(endEpoch)
        const endDateString = endDateObject[0] + ', ' + endDateObject[1] + ' ' + endDateObject[2]

        if ( sessionDate != endDateString ) {
            sessionDate = endDateString
            console.log(sessionDate)

            buildDateHeader(endDateString, pastSessionsArea)
        }

        await buildSessionBlock(sessionInfo, pastSessionsArea)
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
