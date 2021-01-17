//Profile____________________________________________________________________________________________________________________________________________________

async function loadTutorProfile(data, ID) {
	
    loadButtons(data, ID)
    //loadSimilarTutors()
    loadProfileExperience(data, ID)
    loadReviews(data, ID)
    loadProfileAvailability(ID, data)
	
	
    //Load image
    const tutorContainer = document.getElementById('tutor-image-container')
    tutorContainer.removeChild(tutorContainer.firstChild)
    var tutorImage = document.createElement('img')
    tutorImage.setAttribute('class', 'tutor-profile-image')
    tutorImage.src = data.profileImage
    tutorContainer.appendChild(tutorImage)

    //get first name
    var tutorsName = data.name 
    const nameArray = tutorsName.split(" ")
    const firstName = nameArray[0]

    //load name, school, major, bio
    document.getElementById('tutor-profile-name').innerHTML = data.name
    document.getElementById('tutor-profile-school').innerHTML = await getSchoolName(data.school)
    document.getElementById('tutor-profile-name').innerHTML = tutorsName
    document.getElementById('tutor-profile-major').innerHTML = data.major
    document.getElementById('bio-header').innerHTML = 'Meet ' + firstName
    document.getElementById('tutor-profile-bio').innerHTML = data.bio

    //load sessions and average
    document.getElementById('tutor-profile-sessions').innerHTML = await getCountOfSessions(ID)
    document.getElementById('tutor-profile-average').innerHTML = await getRatingForUser(ID)

    //load hourly
    document.getElementById('tutor-profile-hourly').innerHTML = data.pricePHH * 2

}


//Tab Navigation
var tab1 = document.getElementById('tab-1')
tab1.addEventListener('click', () => {
    changeTabClasses(1)
    $("html, body").animate({ scrollTop: $("#bio-section").offset().top }, 500);
})

var tab2 = document.getElementById('tab-2')
tab2.addEventListener('click', () => {
    changeTabClasses(2)
    $("html, body").animate({ scrollTop: $("#experience-section").offset().top }, 500);
})

var tab3 = document.getElementById('tab-3')
tab3.addEventListener('click', () => {
    changeTabClasses(3)
    $("html, body").animate({ scrollTop: $("#reviews-section").offset().top }, 500);
})

var tab4 = document.getElementById('tab-4')
tab4.addEventListener('click', () => {
    changeTabClasses(4)
    $("html, body").animate({ scrollTop: $("#availability-section").offset().top }, 500);
})

function changeTabClasses(id) {
    for ( i = 1; i < 5; i++ ) {
        if( id == i) {
            document.getElementById(`tab-${i}`).setAttribute('class', 'profile-tab-selected')
        } else {
            document.getElementById(`tab-${i}`).setAttribute('class', 'profile-tab-unselected')
        }
    }
}

function loadButtons(data, tutorID) {
    //load pin tutor button
    loadisTutorPinned(tutorID)
    
    //load like button
    loadisTutorLiked(tutorID)

    //load report button

    //load message button
    let messageButton = document.getElementById('message-button')
    var messageButtonClone = messageButton.cloneNode(true)
    messageButton.parentNode.replaceChild(messageButtonClone, messageButton)
    messageButtonClone.innerHTML = `Message ${getFirstName(data.name)}`
    messageButtonClone.addEventListener('click', () => {
        openMessageModal(data, tutorID)
    })

    //load book session button
    const sessionBookingPage = document.getElementById('session-booking-page')
    const bookSessionButton = document.getElementById('book-session-button')

    bookSessionButton.addEventListener('click', () => {
    	sessionBookingPage.style.display = 'flex'
    	tutorProfile.style.display = 'none'
	
	loadBookingPageFromData(data, tutorID)
    })
}

let pinTutorButton = document.getElementById('pin-tutor')
function loadisTutorPinned(tutorID) {
    console.log(corePinnedTutors)
    if(corePinnedTutors != null) { 
        for (const [id, status] of Object.entries(corePinnedTutors)) {
            console.log('pinned id', id)
            //User has this tutor pinned currently
            if ( id == tutorID && status == 'active') {
                pinTutorButton.setAttribute('class', 'pin-tutor-active')
                pinTutorButton.setAttribute('onClick', `pinTutor("${tutorID}",${true})`)
                //exit loop as the tutor has been matched
                break
                
            //User has never pinned tutor before and does not have them pinned currently
            } else {
                pinTutorButton.setAttribute('class', 'pin-tutor')
                pinTutorButton.setAttribute('onClick', `pinTutor("${tutorID}",${false})`)
            }
        } 

    //User has never pinned a tutor before
    } else {
        pinTutorButton.setAttribute('class', 'pin-tutor')
        pinTutorButton.setAttribute('onClick', `pinTutor("${tutorID}",${false})`)
    }
}

function pinTutor(tutorID, isPinned) {
    let pinDict = {}
    let pinPath = 'pinnedTutors.' + tutorID
    pinDict[pinPath] = (isPinned ? 'inactive' : 'active')

    if(isPinned) {
        userDB.collection('userTest').doc(globalUserId).update(pinDict).then( () => {
            loadPinnedTutors()
            pinTutorButton.setAttribute('class', 'pin-tutor')
            pinTutorButton.setAttribute('onClick', `pinTutor("${tutorID}",${false})`)
        })

    } else {
        userDB.collection('userTest').doc(globalUserId).update(pinDict).then( () => {
            loadPinnedTutors()
            pinTutorButton.setAttribute('class', 'pin-tutor-active')
            pinTutorButton.setAttribute('onClick', `pinTutor("${tutorID}",${true})`)
        })
    }
}

let likeTutorButton = document.getElementById('like-tutor-button')
function loadisTutorLiked(tutorID) {
    console.log(coreLikedTutors)
    if(coreLikedTutors != null) { 
        for (const [id, status] of Object.entries(coreLikedTutors)) {
            //User has this tutor liked currently
            if(id == tutorID && status == 'active') {
                likeTutorButton.setAttribute('class', 'pin-tutor-active')
                likeTutorButton.setAttribute('onClick', `likeTutor("${tutorID}",${true})`)
                //exit loop as the tutor has been matched
                break
            } else {
                likeTutorButton.setAttribute('class', 'pin-tutor')
                likeTutorButton.setAttribute('onClick', `likeTutor("${tutorID}",${false})`)
            }
        } 

    //User has never liked a tutor before
    } else {
        likeTutorButton.setAttribute('class', 'pin-tutor')
        likeTutorButton.setAttribute('onClick', `likeTutor("${tutorID}",${false})`)
    }
}


function likeTutor(tutorID, isLiked) {
    let likeDict = {}
    let likePath = 'likedTutors.' + tutorID
    likeDict[likePath] = (isLiked ? 'inactive' : 'active')

    if(isLiked) {
        userDB.collection('userTest').doc(globalUserId).update(likeDict).then( () => {
            updateTutorsLikes(tutorID, false, globalUserId)
            likeTutorButton.setAttribute('class', 'pin-tutor')
            likeTutorButton.setAttribute('onClick', `likeTutor("${tutorID}",${false})`)
        })

    } else {
        userDB.collection('userTest').doc(globalUserId).update(likeDict).then( () => {
            updateTutorsLikes(tutorID, true, globalUserId)
            likeTutorButton.setAttribute('class', 'pin-tutor-active')
            likeTutorButton.setAttribute('onClick', `likeTutor("${tutorID}",${true})`)
        })
    }
}

function updateTutorsLikes(tutorID, isIncrementing, likedBy) {
    //decrementing if false:
    var user = likedBy
    var userDict = {}

    if(isIncrementing) {
        userDict[user] = 'active'
        var updateDict = {
            'numLikes' : firebase.firestore.FieldValue.increment(1)
        }
        updateDict['likedBy'] = userDict

        userDB.collection('userTest').doc(tutorID).update(updateDict)
    } else {
        userDict[user] = 'inactive'
        var updateDict = {
            'numLikes' : firebase.firestore.FieldValue.increment(-1)
        }
        updateDict['likedBy'] = userDict

        userDB.collection('userTest').doc(tutorID).update(updateDict)
    }
}

function openMessageModal(data, tutorID) {
    const messageModalClose = document.getElementById('message-modal-close')
    const messageModal = document.getElementById('message-modal')
    const messageModalHeader = document.getElementById('message-modal-header')
    const messageSendButton = document.getElementById('send-button')
    const messageDiv = document.getElementById('message-div')
    const messageCompletionDiv = document.getElementById('message-completion-div')

    messageModal.style.display = 'flex'
    messageDiv.style.display = 'flex'
    messageCompletionDiv.style.display = 'none'

    messageModalHeader.innerHTML = 'Message ' + getFirstName(data.name)

    messageModalClose.addEventListener('click', () => {
        messageModal.style.display = 'none'
    })

    var messageSendButtonClone = messageSendButton.cloneNode(true)
    messageSendButton.parentNode.replaceChild(messageSendButtonClone, messageSendButton)
    messageSendButtonClone.addEventListener('click', () => {
        updateConnections(data, tutorID)
        messageDiv.style.display = 'none'
        messageCompletionDiv.style.display = 'flex'
    })
}

function updateConnections(data, tutorID) {
    const connectionID = tutorID + ":" + globalUserId

    var messageRef = userDB.collection('messages').doc(connectionID)
    messageRef.get().then(function(doc) {
        if (doc.exists) {
            //If connection exists then add to messages collection
            console.log("Document Exists:", doc.data())
            sendConnectionMessage(tutorID, connectionID, "student")
        } else {
            //if not, create document and add fields and messages collection
            console.log("Document does not exist, creating new one")
            var updateDict = {
                "members" : [globalUserId, tutorID],
                "student" : globalUserId,
                "tutor" : tutorID
            }
            userDB.collection('messages').doc(connectionID).set(updateDict).then(function() {
                sendConnectionMessage(tutorID, connectionID, "student")
            })
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function sendConnectionMessage(otherID, connectionID, senderType) {
    var today = new Date()
    var timeStamp = (today.getTime() / 1000).toString()
    var updateDict = {
        'message' : document.getElementById('message-field').value,
        'sender' : globalUserId,
        'senderType' : senderType
    }
    userDB.collection('messages').doc(connectionID).collection('messages').doc(timeStamp).set(updateDict)
    sendMessagingNotifications(otherID, coreName, document.getElementById('message-field').value)
    document.getElementById('message-field').value = ""
}

function sendMessagingNotifications(otherID, currentName, message) {
    userDB.collection('userTest').doc(otherID).get().then(function(doc) {
        var userData = doc.data()

        var isSMSOn = userData.isSMSOn
        var isPushOn = userData.isPushOn

        if(isSMSOn) {
            var phoneNumber = userData.phoneNumber
            var smsMessage = "New Message From " + currentName + ": " + message
            sendSMSTo(phoneNumber, smsMessage)
        }

        if(isPushOn) {
            var token = userData.pushToken
            var title = "New Message From " + currentName
            sendPushTo(token, title, message)
        }
    })
}
//Experience
var profileNoExperience = document.getElementById('profile-no-experience')
var profileExperienceContainer = document.getElementById('profile-experience-container')

function loadProfileExperience(tutorData, tutorID) {
    while(profileExperienceContainer.firstChild) {
        profileExperienceContainer.removeChild(profileExperienceContainer.firstChild)
    }
    profileNoExperience.innerHTML = `${getFirstName(tutorData.name)} hasn't added any experience yet`
    profileNoExperience.style.display = 'block'

    userDB.collection('userTest').doc(tutorID).get().then(function(doc) {
        var experienceData = doc.data().experience 

        for(var experience in experienceData) {
            if ( experienceData.hasOwnProperty(experience) ){
                profileNoExperience.style.display = 'none'

                var title = experienceData[experience].title
                var description = experienceData[experience].description
                buildProfileExperienceBlock(title, description)
            }
        }
    })
}

function buildProfileExperienceBlock(title, description) {
    var experienceDiv = document.createElement('div')
    experienceDiv.setAttribute('class', 'experience-div')
    profileExperienceContainer.appendChild(experienceDiv)

    var experienceHeaderDiv = document.createElement('div')
    experienceHeaderDiv.setAttribute('class', 'experience-header-div')
    experienceDiv.appendChild(experienceHeaderDiv)

    var experienceTitle = document.createElement('div')
    experienceTitle.setAttribute('class', 'experience-title-profile')
    experienceTitle.innerHTML = title
    experienceHeaderDiv.appendChild(experienceTitle)

    var experienceText = document.createElement('div')
    experienceText.setAttribute('class', 'experience-text-profile')
    experienceText.innerHTML = description
    experienceDiv.appendChild(experienceText)
}


//Reviews
var writeReviewButton = document.getElementById('write-review-button')
var writeReviewDiv = document.getElementById('write-review-div')
writeReviewButton.addEventListener('click', () => {
    $('#write-review-div').fadeIn()
})

var rating = 0

var starOne = document.getElementById('star-1')
starOne.addEventListener('mouseover', () => {
    updateStars(1)
})
var starTwo = document.getElementById('star-2')
starTwo.addEventListener('mouseover', () => {
    updateStars(2)
})
var starThree = document.getElementById('star-3')
starThree.addEventListener('mouseover', () => {
    updateStars(3)
})
var starFour = document.getElementById('star-4')
starFour.addEventListener('mouseover', () => {
    updateStars(4)
})
var starFive = document.getElementById('star-5')
starFive.addEventListener('mouseover', () => {
    updateStars(5)
})

function updateStars(index) {
    for( i = 1; i <= 5; i++) {
        if( i <= index) {
            document.getElementById(`star-${i}`).setAttribute('class', 'review-star-selected')
            rating = i
            console.log(rating)
        } else{ 
            document.getElementById(`star-${i}`).setAttribute('class', 'review-star-unselected')
        }
    }
}

var writeReviewHeader = document.getElementById('write-review-header')
let reviewScreen = document.getElementById('review-screen')
function setReviewInitialState(tutorData, tutorID) {
    noReviewsText.innerHTML = `${getFirstName(tutorData.name)} doesn't have any reviews yet`
    noReviewsText.style.display = 'none'

    for( i = 1; i <= 5; i++) {
        document.getElementById(`star-${i}`).setAttribute('class', 'review-star-unselected')
    }

    let confirmationScreen = document.getElementById('review-confirmation-screen')
    writeReviewDiv.style.display = 'none'
    confirmationScreen.style.display = 'none'
    reviewScreen.style.display = 'flex'

    writeReviewHeader.innerHTML = `Leave a review for ${tutorData.name}`

    var submitReviewButton = document.getElementById('submit-review-button')
    submitReviewButtonClone = submitReviewButton.cloneNode(true)
    submitReviewButton.parentNode.replaceChild(submitReviewButtonClone, submitReviewButton)
    submitReviewButtonClone.addEventListener('click', () => {
        submitReview(tutorData, tutorID)
    })
}

function submitReview(tutorData, tutorID) {
    let currentDate = new Date()
    let currentDateInt = currentDate / 1000
    let dateObject = getFormattedDate(currentDateInt)
    let month = currentDate.getMonth()
    let year = currentDate.getFullYear()
    let dateString = months[month] + ' ' +dateObject[2] + ', ' + year
    var reviewDict = {
        'reviewer' : globalUserId,
        'date' : currentDateInt,
        'dateString' : dateString,
        'rating' : rating,
        'review' : document.getElementById('write-review-text').value,
        'reviewerName' : coreName
    }


    let randomID = createTransactionID()
    userDB.collection('userTest').doc(tutorID).collection('reviews').doc(randomID).set(reviewDict).then(() => {
        var tutorsName = tutorData.name 
        const nameArray = tutorsName.split(" ")
        const firstName = nameArray[0]
        var reviewConfirmationText = document.getElementById('review-confirmation-text')
        reviewConfirmationText.innerHTML = `Thanks for reviewing ${firstName}!`
        reviewScreen.style.display = 'none'

        $('#review-confirmation-screen').fadeIn().delay(5000).fadeOut("slow")
    })
}


let allReviewsArea = document.getElementById('all-reviews-area')
let noReviewsText = document.getElementById('no-reviews-text')


function loadReviews(tutorData, tutorID) {
    setReviewInitialState(tutorData, tutorID)

    while(allReviewsArea.firstChild) {
        allReviewsArea.removeChild(allReviewsArea.firstChild)
    }

    userDB.collection('userTest').doc(tutorID).collection('reviews').get().then(function(reviews) {
        if( reviews.size > 0) {
            reviews.forEach(function(review) {
                let reviewData = review.data()
    
                userDB.collection('userTest').doc(reviewData.reviewer).get().then(function(doc) {
                    let reviewersImage = doc.data().profileImage
                    buildReviewBlock(reviewData, reviewersImage)
                })
            })
        } else {
            noReviewsText.style.display = 'block'
        }
    })


}

function buildReviewBlock(data, image) {
    let reviewContainer = document.createElement('div')
    reviewContainer.setAttribute('class', 'review-container')
    allReviewsArea.append(reviewContainer)
    
    let reviewHeader = document.createElement('div')
    reviewHeader.setAttribute('class', 'review-header')
    reviewContainer.append(reviewHeader)

    let reviewImage = document.createElement('img')
    reviewImage.setAttribute('class', 'review-image')
    reviewImage.src = image
    reviewHeader.append(reviewImage)

    let reviewInfo = document.createElement('div')
    reviewInfo.setAttribute('class', 'review-info')
    reviewHeader.append(reviewInfo)

    let reviewName = document.createElement('div')
    reviewName.setAttribute('class', 'review-name')
    reviewName.innerHTML = data.reviewerName
    reviewInfo.append(reviewName)

    let reviewInfoLower = document.createElement('div')
    reviewInfoLower.setAttribute('class', 'review-info-lower')
    reviewInfo.append(reviewInfoLower)

    let numStars = parseInt(data.rating)
    for( i = 0; i < numStars; i++) {
        let reviewStar = document.createElement('div')
        reviewStar.setAttribute('class', 'review-star')
        reviewStar.innerHTML = ''
        reviewInfoLower.append(reviewStar)
    }
    let reviewDate = document.createElement('div')
    reviewDate.setAttribute('class', 'review-date')
    reviewDate.innerHTML = data.dateString
    reviewInfoLower.append(reviewDate)

    let reviewText = document.createElement('div')
    reviewText.setAttribute('class', 'review-text')
    reviewText.innerHTML = data.review
    reviewContainer.append(reviewText)
}


//Availability

function loadProfileAvailability(tutorID, tutorData) {
    
    loadCheckoutFromProfile(tutorData, tutorID)
    setProfileAvailabilityInitialState()
    loadAvailabilities(tutorData.availability)
    buildProfileCalendarNav()
    buildProfileCalendar(tutorsAvailability)

    setNavigation(true)
}

function loadCheckoutFromProfile(tutorData, tutorID) {
    tutorsPricePHH = tutorData.pricePHH
    courseVal = corePreferences.course
    schoolVal = corePreferences.school
    subjectVal = corePreferences.subject
    tutor = tutorID 
    currentBalance = parseFloat(coreBalance).toFixed(2)

    let profileCheckoutName = document.getElementById('profile-checkout-name')
    const checkoutHourly = document.getElementById('profile-checkout-hourly')
    const bookingImageContainer = document.getElementById('booking-image-container')
    const checkoutSubject = document.getElementById('checkout-subject')
    const checkoutCourse = document.getElementById('checkout-course')
    const checkoutFullName = document.getElementById('checkout-full-name')
    const checkoutSessionFee = document.getElementById('checkout-session-fee')
    const checkoutBalance = document.getElementById('checkout-balance')

    profileCheckoutName.innerHTML = getFirstName(tutorData.name) + "'s Availability"
    checkoutHourly.innerHTML = tutorData.pricePHH * 2

    bookingImageContainer.removeChild(bookingImageContainer.firstChild)
    var bookingImage = document.createElement('img')
    bookingImage.setAttribute('class', 'booking-profile-image')
    bookingImage.src = tutorData.profileImage
    bookingImageContainer.appendChild(bookingImage)

    checkoutFullName.innerHTML = tutorData.name
    checkoutSubject.innerHTML = subjectVal
    checkoutCourse.innerHTML = courseVal
    checkoutSessionFee.innerHTML = '$' + sessionFee
    checkoutBalance.innerHTML = '$' + parseFloat(coreBalance).toFixed(2)
}

function setProfileAvailabilityInitialState() {
    var sessionDateHeader = document.getElementById('profile-session-date-header')
    var sessionTimeText = document.getElementById('profile-session-time-text')
    var checkoutContinue = document.getElementById('profile-checkout-continue')
    var timeslotsContainer = document.getElementById('profile-timeslots-container')
    let profileCheckoutHourly = document.getElementById('profile-checkout-hourly')
    let profileCheckoutPreTotal = document.getElementById('profile-checkout-pre-total')
    
    sessionDateHeader.innerHTML = 'Select a Date'
    sessionTimeText.innerHTML = 'Select a Time'
    profileCheckoutHourly.innerHTML = parseFloat(tutorsPricePHH * 2).toFixed(2)
    profileCheckoutPreTotal.innerHTML = '0.00'
    checkoutContinue.style.display = 'none'

    while(timeslotsContainer.firstChild) {
        timeslotsContainer.removeChild(timeslotsContainer.firstChild)
    }
    var noDateSelectedText = document.createElement('div')
    noDateSelectedText.setAttribute('class', 'no-date-selected-text')
    noDateSelectedText.innerHTML = "Select a date to see available times"
    timeslotsContainer.appendChild(noDateSelectedText)
}

function buildProfileCalendarNav() {

    var profileCalendarBack = document.getElementById('profile-calendar-back')
    var profileCalendarBackClone = profileCalendarBack.cloneNode(true)
    profileCalendarBack.parentNode.replaceChild(profileCalendarBackClone, profileCalendarBack)
    profileCalendarBackClone.addEventListener('click', () => {
        if (month==0) {
            year--
            month = 11
        } else {
            month--
        }
        buildProfileCalendar(tutorsAvailability)
    })

    var profileCalendarForward = document.getElementById('profile-calendar-forward')
    var profileCalendarForwardClone = profileCalendarForward.cloneNode(true)
    profileCalendarForward.parentNode.replaceChild(profileCalendarForwardClone, profileCalendarForward)
    profileCalendarForwardClone.addEventListener('click', () => {
        if (month==11) {
            year++
            month = 0
        } else {
            month++
        }
        buildProfileCalendar(tutorsAvailability)
    })
}


function buildProfileCalendar(availability) {
    var calendarHeader = document.getElementById('profile-calendar-header')
    calendarHeader.innerHTML = months[month] + " " + year

    var dayRowContainer = document.getElementById('profile-day-row-container')
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
                dayDiv.setAttribute('id', 'profile-dayDiv-' + dayCounter)
                dayRow.appendChild(dayDiv)

                var dayNumber = document.createElement('div')
                dayNumber.setAttribute('class', 'day-number')
                dayNumber.innerHTML = dayCounter
                dayDiv.appendChild(dayNumber)
    
                var dayCircle = document.createElement('div')
                if(availability[j] > 0) {
                    dayCircle.setAttribute('class', 'availability-circle')
                    dayDiv.setAttribute('onClick', 'profileDaySelected("'+j+'","'+dayCounter+'","'+daysInMonth+'")')
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

function profileDaySelected(dayInt, dayOfMonth, daysInMonth) {
    dayVal = dayOfMonth
    sessionIndices = []
    const checkoutPreTotal = document.getElementById('profile-checkout-pre-total')
    checkoutPreTotal.innerHTML = 0.0
    //Change CSS
    const sessionDateHeader = document.getElementById('profile-session-date-header')
    sessionDateHeader.innerHTML = formatSessionDate(dayInt, dayOfMonth, month)
    const sessionTimeText = document.getElementById('profile-session-time-text')
    sessionTimeText.innerHTML = 'Select a Time'

    const selectedDay = document.getElementById('profile-dayDiv-' + dayOfMonth)
    selectedDay.setAttribute('class', 'day-div-selected')
    selectedDay.childNodes[0].setAttribute('class', 'day-number-selected')
    selectedDay.childNodes[1].setAttribute('class', 'availability-circle-selected')

    for(i=1; i<=daysInMonth; i++) {
        if(i!=dayOfMonth) {
            var dayDiv = document.getElementById('profile-dayDiv-' + i)
            dayDiv.setAttribute('class', 'day-div')
            var divChildren = dayDiv.childNodes
            divChildren[0].setAttribute('class', 'day-number')
            if(divChildren[1].classList.contains('availability-circle-selected')) {
                divChildren[1].setAttribute('class', 'availability-circle')
            }
        }
    }

    //Show Availability
    availabilityArray = twosComplement(tutorsAvailability[dayInt]).split("")
    loadProfileTimeslots()
}

function loadProfileTimeslots() {
    const timeslotsContainer = document.getElementById('profile-timeslots-container')
    while(timeslotsContainer.firstChild) {
        timeslotsContainer.removeChild(timeslotsContainer.firstChild)
    }

    for(i=0; i<availabilityArray.length; i++) {
        if(availabilityArray[i] == 1) {
            var bookingTimeslot = document.createElement('div')
            bookingTimeslot.setAttribute('class', 'booking-timeslot')
            bookingTimeslot.setAttribute('onClick', 'profileTimeslotSelected("'+i+'")')
            bookingTimeslot.setAttribute('id', 'profile-timeslot-'+i)
            timeslotsContainer.appendChild(bookingTimeslot)
            bookingTimeslot.innerHTML = timeOptions[i]
        }
    }
}



function profileTimeslotSelected(index) {
    const timeslotsContainer = document.getElementById('profile-timeslots-container')
    const previousIndex = parseInt(index)-1
    const nextIndex = parseInt(index)+1
    var children = timeslotsContainer.childNodes

    if(sessionIndices.length == 0) {
        sessionIndices.push(parseInt(index))
        sessionIndices.sort()
        var timeslot = document.getElementById('profile-timeslot-'+index)
        timeslot.setAttribute('class', 'booking-timeslot-selected')

        if(availabilityArray[nextIndex]==1) {
            var nextTimeslot = document.getElementById('profile-timeslot-'+nextIndex)
            nextTimeslot.setAttribute('class', 'booking-timeslot-option')
        }

    } else if (index < sessionIndices[0] || index > sessionIndices[sessionIndices.length-1]+1 || sessionIndices.includes(parseInt(index))) {
        for(i=0; i<children.length; i++) {
            children[i].setAttribute('class', 'booking-timeslot')
        }
        sessionIndices = []
        sessionIndices.push(parseInt(index))
        sessionIndices.sort()
        var timeslot = document.getElementById('profile-timeslot-'+index)
        timeslot.setAttribute('class', 'booking-timeslot-selected')

        if(availabilityArray[nextIndex]==1) {
            var nextTimeslot = document.getElementById('profile-timeslot-'+nextIndex)
            nextTimeslot.setAttribute('class', 'booking-timeslot-option')
        }
    }  else if (availabilityArray[index]==1) {
        sessionIndices.push(parseInt(index))
        sessionIndices.sort()
        var timeslot = document.getElementById('profile-timeslot-'+index)
        timeslot.setAttribute('class', 'booking-timeslot-selected')

        if(availabilityArray[nextIndex]==1) {
            var nextTimeslot = document.getElementById('profile-timeslot-'+nextIndex)
            nextTimeslot.setAttribute('class', 'booking-timeslot-option')
        }
    }

    var sessionTimeText = document.getElementById('profile-session-time-text')
    if (sessionIndices.length>1) {
        var lastSessionIndex = sessionIndices[sessionIndices.length-1]+1
        console.log(lastSessionIndex)
        sessionTimeText.innerHTML = timeOptions[sessionIndices[0]]+" to "+timeOptions[lastSessionIndex]
    } else {
        sessionTimeText.innerHTML = timeOptions[sessionIndices[0]]+" to "+timeOptions[sessionIndices[0]+1]
    }

    updateStartAndEnd()
    updateProfileCheckout()
}

function updateProfileCheckout() {
    checkoutTotal = tutorsPricePHH * sessionIndices.length + sessionFee
    tutorsFee = tutorsPricePHH * sessionIndices.length

    const checkoutPreTotal = document.getElementById('profile-checkout-pre-total')
    const profileCheckoutPreTotal = document.getElementById('profile-checkout-pre-total')
    const checkoutFinalTotal = document.getElementById('checkout-final-total')
    checkoutPreTotal.innerHTML = tutorsPricePHH * sessionIndices.length
    checkoutFinalTotal.innerHTML = '$' + checkoutTotal
    
    let profileCheckoutContinue = document.getElementById('profile-checkout-continue')
    if(profileCheckoutContinue.style.display == 'none') {
        $('#profile-checkout-continue').fadeIn()
    }

    var currentTotal = document.getElementById('current-total')
    var newBalance = document.getElementById('new-balance')

    currentTotal.innerHTML = '$' + checkoutTotal
    if(currentBalance>checkoutTotal) {
        newBalance.innerHTML = '$' + parseFloat(currentBalance - checkoutTotal).toFixed(2)
    }
}
