//Upcoming Functions________________________________________________________________________________________________________________
var sessionModal = document.getElementById('session-modal')
var otherImageModal = document.getElementById('other-image-modal')
var otherNameModal = document.getElementById('other-name-modal')
var sessionDateHeader = document.getElementById('session-date-header')
var sessionTimeHeader = document.getElementById('session-time-header')
var confirmSessionButton = document.getElementById('confirm-session-button')
var receiveText = document.getElementById('receive-text')
var declineSessionButton = document.getElementById('decline-session-button')
var rescheduleSessionButton = document.getElementById('reschedule-session-button')
var refundSessionButton = document.getElementById('refund-session-button')


upcoming.addEventListener('click', function(){
    getSessions()
})

function getSessions() {
    var currentTime = (new Date()).getTime() / 1000

    userDB.collection('userTest').doc(globalTutorID).collection('sessions').onSnapshot( function(sessions) {
        
        //Remove elements on session changes
        while(pastSessionsArea.firstChild) {
            noPastSessions.style.display = 'block'
            pastSessionsArea.removeChild(pastSessionsArea.firstChild)
        }
        while(pendingSessionsArea.firstChild) {
            noPendingSessions.style.display = 'block'
            pendingSessionsArea.removeChild(pendingSessionsArea.firstChild)
        }
        while(upcomingSessionsArea.firstChild) {
            noUpcomingSessions.style.display = 'block'
            upcomingSessionsArea.removeChild(upcomingSessionsArea.firstChild)
        }

        sessions.forEach( function(doc) {
            var sessionDict = doc.data()

            //Build past sessions 
            if (sessionDict.status == 'confirmed' && sessionDict.end < currentTime && sessionDict.rated == false) {
                noPastSessions.style.display = 'none'
                buildPastSessionBlock(sessionDict, doc.id)
            }

            //Build pending sessions
            else if (sessionDict.status == 'pending') {
                noPendingSessions.style.display = 'none'
                buildSessionBlock(sessionDict, doc.id, 'pending')
            }

            //Build upcoming sessions
            else if (sessionDict.status == 'confirmed' && sessionDict.end > currentTime) {
                noUpcomingSessions.style.display = 'none'
                buildSessionBlock(sessionDict, doc.id, 'confirmed')
            }
        })
    })
}

function buildPastSessionBlock(session, sessionID) {
    var otherUserID = session.student,
        otherImage,
        otherName
    if (otherUserID == globalTutorID) {
        otherUserID = session.tutor
    }

    userDB.collection('userTest').doc(otherUserID).get().then(function(doc) {
        otherImage = doc.data().profileImage
        otherName = doc.data().name

        var rateSessionBlock = document.createElement('div')
        var connectionImage = document.createElement('img')
        var sessionName = document.createElement('div')
        var rateSessionStars = document.createElement('div')
        var starOne = document.createElement('div')
        var starTwo = document.createElement('div')
        var starThree = document.createElement('div')
        var starFour = document.createElement('div')
        var starFive = document.createElement('div')
        var rateSessionButton = document.createElement('div')

        rateSessionBlock.setAttribute('class', 'rate-session-block')
        connectionImage.setAttribute('class', 'connection-image')
        sessionName.setAttribute('class', 'session-name')
        rateSessionStars.setAttribute('class', 'rate-session-stars')
        starOne.setAttribute('class', 'connection-star-unfilled')
        starTwo.setAttribute('class', 'connection-star-unfilled')
        starThree.setAttribute('class', 'connection-star-unfilled')
        starFour.setAttribute('class', 'connection-star-unfilled')
        starFive.setAttribute('class', 'connection-star-unfilled')
        rateSessionButton.setAttribute('class', 'rate-session-button')

        pastSessionsArea.appendChild(rateSessionBlock)
        rateSessionBlock.appendChild(connectionImage)
        rateSessionBlock.appendChild(sessionName)
        rateSessionBlock.appendChild(rateSessionStars)
        rateSessionStars.appendChild(starOne)
        rateSessionStars.appendChild(starTwo)
        rateSessionStars.appendChild(starThree)
        rateSessionStars.appendChild(starFour)
        rateSessionStars.appendChild(starFive)
        rateSessionBlock.appendChild(rateSessionButton)

        connectionImage.src = otherImage
        sessionName.innerHTML = otherName
        starOne.innerHTML = ''
        starTwo.innerHTML = ''
        starThree.innerHTML = ''
        starFour.innerHTML = ''
        starFive.innerHTML = ''
        rateSessionButton.innerHTML = 'Confirm Rating'

        var rating = 0
        starOne.addEventListener('mouseover', function() {
            rating = 1
            rateSessionButton.style.display = 'block'
            starOne.setAttribute('class', 'connection-star-filled')
            starTwo.setAttribute('class', 'connection-star-unfilled')
            starThree.setAttribute('class', 'connection-star-unfilled')
            starFour.setAttribute('class', 'connection-star-unfilled')
            starFive.setAttribute('class', 'connection-star-unfilled')
        })
        starTwo.addEventListener('mouseover', function() {
            rating = 2
            rateSessionButton.style.display = 'block'
            starOne.setAttribute('class', 'connection-star-filled')
            starTwo.setAttribute('class', 'connection-star-filled')
            starThree.setAttribute('class', 'connection-star-unfilled')
            starFour.setAttribute('class', 'connection-star-unfilled')
            starFive.setAttribute('class', 'connection-star-unfilled')
        })
        starThree.addEventListener('mouseover', function() {
            rating = 3
            rateSessionButton.style.display = 'block'
            starOne.setAttribute('class', 'connection-star-filled')
            starTwo.setAttribute('class', 'connection-star-filled')
            starThree.setAttribute('class', 'connection-star-filled')
            starFour.setAttribute('class', 'connection-star-unfilled')
            starFive.setAttribute('class', 'connection-star-unfilled')
        })
        starFour.addEventListener('mouseover', function() {
            rating = 4
            rateSessionButton.style.display = 'block'
            starOne.setAttribute('class', 'connection-star-filled')
            starTwo.setAttribute('class', 'connection-star-filled')
            starThree.setAttribute('class', 'connection-star-filled')
            starFour.setAttribute('class', 'connection-star-filled')
            starFive.setAttribute('class', 'connection-star-unfilled')
        })
        starFive.addEventListener('mouseover', function() {
            rating = 5
            rateSessionButton.style.display = 'block'
            starOne.setAttribute('class', 'connection-star-filled')
            starTwo.setAttribute('class', 'connection-star-filled')
            starThree.setAttribute('class', 'connection-star-filled')
            starFour.setAttribute('class', 'connection-star-filled')
            starFive.setAttribute('class', 'connection-star-filled')
        })

        rateSessionButton.style.display = 'none'
        rateSessionButton.addEventListener('click', function() {

            userDB.collection('userTest').doc(otherUserID).collection('sessions').doc(sessionID)
                .update({'ratingFromOtherUser' : rating})

            userDB.collection('userTest').doc(globalTutorID).collection('sessions').doc(sessionID)
                .update({'rated': true})

        })
    })
}

function buildSessionBlock(session, sessionID, status) {
    console.log(session)
    var otherUserID = session.student,
        otherImage,
        otherName,
        start = session.start,
        end = session.end,
        course = session.course,
        sessionArea,
        statusClass
    
    if (otherUserID == globalTutorID) {
        otherUserID = session.tutor
    }

    if (status == 'confirmed') {
        statusClass = 'session-status-confirmed'
        sessionArea = upcomingSessionsArea
    } else {
        statusClass = 'session-status-pending'
        sessionArea = pendingSessionsArea
    }

    userDB.collection('userTest').doc(otherUserID).get().then(function(doc) {
        otherImage = doc.data().profileImage
        otherName = doc.data().name

        //DOM Elements
        var sessionBlock = document.createElement('div')
        var connectionImage = document.createElement('img')
        var sessionInfo = document.createElement('div')
        var sessionName = document.createElement('div')
        var sessionCourseAndStatus = document.createElement('div')
        var sessionCourseTitle = document.createElement('div')
        var sessionStatus = document.createElement('div')
        var sessionDate = document.createElement('div')

        sessionBlock.setAttribute('class', 'tutor-session-block')
        connectionImage.setAttribute('class', 'connection-image')
        sessionInfo.setAttribute('class', 'session-info')
        sessionName.setAttribute('class', 'session-name')
        sessionCourseAndStatus.setAttribute('class', 'session-course-and-status')
        sessionCourseTitle.setAttribute('class', 'session-course-title')
        sessionStatus.setAttribute('class', statusClass)
        sessionDate.setAttribute('class', 'session-date')

        sessionArea.appendChild(sessionBlock)
        sessionBlock.appendChild(connectionImage)
        sessionBlock.appendChild(sessionInfo)
        sessionInfo.appendChild(sessionName)
        sessionInfo.appendChild(sessionCourseAndStatus)
        sessionCourseAndStatus.appendChild(sessionCourseTitle)
        sessionCourseAndStatus.appendChild(sessionStatus)
        sessionInfo.appendChild(sessionDate)

        connectionImage.src = otherImage
        sessionName.innerHTML = otherName
        sessionCourseTitle.innerHTML = course
        sessionStatus.innerHTML = status
        sessionDate.innerHTML = formatSessionDate(start, end)

        sessionBlock.setAttribute('onClick', 'openSessionManagement("' + session + '","' + sessionID + '","' + otherImage + '","' + otherName +'")')
    })
}

function openSessionManagement(session, otherImage, otherName) {
    sessionModal.style.display = 'flex'

    var otherImageDiv = document.createElement('img')
    otherImageDiv.setAttribute('class', 'connection-image')
    otherImageDiv.src = otherImage
    otherImageModal.removeChild(otherImageModal.firstChild)
    otherImageModal.appendChild(otherImageDiv)

    var dateObject = getFormattedDate(session.start)
    var timeObject = getFormattedTime(session.start, session.end)

    otherNameModal.innerHTML = otherName
    sessionDateHeader.innerHTML = dateObject[0] + ", " + dateObject[1] + " " + dateObject[2]
    sessionTimeHeader.innerHTML = timeObject[0] + " to " + timeObject[1]
    receiveText.innerHTML = session.tutorsFee * 0.85

    confirmSessionButton.addEventListener('click', function() {
        confirmSession(session, sessionID)
    })
    declineSessionButton.addEventListener('click', function() {
        declineSession(session, sessionID)
    })
    rescheduleSessionButton.addEventListener('click', function() {
        alert('This feature is not available yet')
    })
    refundSessionButton.addEventListener('click', function() {
        refundSession(session, sessionID)
    })
}

