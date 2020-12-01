//Global Variables__________________________________________________________________
var userDB = firebase.firestore()

//Core properties all users have
var globalUserId

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

        getUpcomingSessions()

    })
}

function getUpcomingSessions() {

    var currentTime = (new Date()).getTime() / 1000

    userDB.collection('userTest').doc(globalUserId).collection('sessions').onSnapshot( function(sessions) {

        const promises = []
        var sessionsObject = []

        sessions.forEach( function(doc) {
            var sessionDict = doc.data()

            if (sessionDict.status == 'confirmed' ) {
                var session = [sessionDict.end, sessionDict]
                sessionsObject.push(session)
            }

            const promise = doc.data()
            promises.push(promise)
        })

        Promise.all(promises).then(results => {

            buildUpcomingSessions(sessionsObject)
        })

    })
}

function buildUpcomingSessions(sessions) {
    var sortedSessions = sessions.sort(function(a, b) {
        return b[0] - a[0];
    })

    console.log(sortedSessions)

    var sessionDate = ''
    for(var i = 0; i < sortedSessions.length; i++) {
        const sessionInfo = sortedSessions[i][1]
        const endEpoch = sessionInfo.end
        const endDateObject = getFormattedDate(endEpoch)
        const endDateString = endDateObject[0] + ', ' + endDateObject[1] + ' ' + endDateObject[2]

        if ( sessionDate != endDateString ) {
            sessionDate = endDateString
            console.log(sessionDate)

            buildDateHeader(endDateString)
        }

        buildSessionBlock(sessionInfo)
    }
}

function buildDateHeader(endDateString) {
    var sessionsArea = document.getElementById('sessions-area')

    var sessionDateHeader = document.createElement('div')
    sessionDateHeader.setAttribute('class', 'session-date-header')

    var sessionTime = document.createElement('div')
    sessionTime.setAttribute('class', 'session-time')
    sessionTime.innerHTML = endDateString

    sessionDateHeader.appendChild(sessionTime)
    sessionsArea.appendChild(sessionDateHeader)

}
