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
    sessionsChevron.setAttribute('id', 'session-chevron-' + sessionID)
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
            confirmSessionButton.innerHTML = 'Confirm'
            sessionBlockBottomLeft.appendChild(confirmSessionButton)
            confirmSessionButton.addEventListener('click', () => {
                confirmSession(sessionID, sessionInfo)
            })

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
            cancelSessionButton.setAttribute('onClick', 'declineSession("'+sessionID+'","'+sessionInfo+'")')
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
        var studentName = data.name
        var studentPhoto = data.profileImage

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


//Session Management_________________________________________________________________________________
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
const declineSessionScreen = document.getElementById('decline-session-screen')
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
    declineSessionScreen.style.display = 'none'
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
