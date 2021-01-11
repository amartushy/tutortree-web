

//Globals
var checkoutTotal = 0.0
var course
var end
var school
var sessionFee = 3.95
var start
var subject
var tutor
var tutorsFee

var currentDate = getCurrentMonthAndYear()
var year = currentDate[0]
var month = currentDate[1]
var dayVal
var tutorsAvailability = []
var tutorsPricePHH = 0.0
var currentBalance
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


function loadBookingPageFromData(data, tutorID) {
    setInitialState()
    setNavigation()
    loadAvailabilities(data.availability)
    buildCalendarNav()
    buildCalendar(tutorsAvailability)
    
    tutorsPricePHH = data.pricePHH
    course = data.preferences.course 
    school = data.preferences.school
    subject = data.preferences.subject
    tutor = tutorID 
    currentBalance = parseFloat(coreBalance).toFixed(2)

    const checkoutName = document.getElementById('checkout-name')
    const checkoutHourly = document.getElementById('checkout-hourly')
    const bookingImageContainer = document.getElementById('booking-image-container')
    const checkoutSubject = document.getElementById('checkout-subject')
    const checkoutCourse = document.getElementById('checkout-course')
    const checkoutFullName = document.getElementById('checkout-full-name')
    const checkoutSessionFee = document.getElementById('checkout-session-fee')
    const checkoutBalance = document.getElementById('checkout-balance')

    checkoutName.innerHTML = data.name.split(" ")[0] + "'s Availability"
    checkoutHourly.innerHTML = data.pricePHH * 2

    bookingImageContainer.removeChild(bookingImageContainer.firstChild)
    var bookingImage = document.createElement('img')
    bookingImage.setAttribute('class', 'booking-profile-image')
    bookingImage.src = data.profileImage
    bookingImageContainer.appendChild(bookingImage)

    checkoutFullName.innerHTML = data.name
    checkoutSubject.innerHTML = subject
    checkoutCourse.innerHTML = course
    checkoutSessionFee.innerHTML = '$' + sessionFee
    checkoutBalance.innerHTML = '$' + parseFloat(coreBalance).toFixed(2)
}

function setInitialState() {
    var sessionDateHeader = document.getElementById('session-date-header')
    var sessionTimeText = document.getElementById('session-time-text')
    var checkoutContinue = document.getElementById('checkout-continue')
    var timeslotsContainer = document.getElementById('timeslots-container')

    sessionDateHeader.innerHTML = 'Select a Date'
    sessionTimeText.innerHTML = 'Select a Time'

    while(timeslotsContainer.firstChild) {
        timeslotsContainer.removeChild(timeslotsContainer.firstChild)
    }
    var noDateSelectedText = document.createElement('div')
    noDateSelectedText.setAttribute('class', 'no-date-selected-text')
    noDateSelectedText.innerHTML = "Select a date to see available times"
    timeslotsContainer.appendChild(noDateSelectedText)
}

function setNavigation() {
    const sessionBookingPage = document.getElementById('session-booking-page')
    const tutorProfile = document.getElementById('tutor-profile')
    const availabilityScreen = document.getElementById('availability-screen')
    const checkoutScreen = document.getElementById('checkout-screen')
    const processingScreen = document.getElementById('processing-screen')

    const profileBackButton = document.getElementById('profile-back-button')
    const checkoutContinue = document.getElementById('checkout-continue')
    const availabilityBack = document.getElementById('availability-back')
    const processingHome = document.getElementById('processing-home')

    availabilityScreen.style.display = 'block'
    checkoutScreen.style.display = 'none'
    processingScreen.style.display = 'none'

    
    checkoutContinue.addEventListener('click', () => {
        $('#availability-screen').fadeOut(400, function(){
            $('#checkout-screen').fadeIn()
        })
    })

    availabilityBack.addEventListener('click', () => {
        $('#checkout-screen').fadeOut(400, function(){
            $('#availability-screen').fadeIn()
        })
    })

    profileBackButton.addEventListener('click', () => {
        sessionBookingPage.style.display = 'none'
        tutorProfile.style.display = 'flex'
    })

    processingHome.addEventListener('click', () => {
        $('#session-booking-page').fadeOut()
        tutorProfile.style.display = 'none'
    })
}

function loadAvailabilities(availabilityData) {
    tutorsAvailability = []
    tutorsAvailability.push(availabilityData.Sunday)
    tutorsAvailability.push(availabilityData.Monday)
    tutorsAvailability.push(availabilityData.Tuesday)
    tutorsAvailability.push(availabilityData.Wednesday)
    tutorsAvailability.push(availabilityData.Thursday)
    tutorsAvailability.push(availabilityData.Friday)
    tutorsAvailability.push(availabilityData.Saturday)
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

var timeOptions = ["6:00am", "6:30am", "7:00am", "7:30am", "8:00am","8:30am", "9:00am", "9:30am", "10:00am", "10:30am",
                    "11:00am", "11:30am", "12:00pm", "12:30pm", "1:00pm", "1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm", 
                    "4:00pm", "4:30pm", "5:00pm", "5:30pm", "6:00pm", "6:30pm", "7:00pm", "7:30pm", "8:00pm", "8:30pm", 
                    "9:00pm", "9:30pm", "10:00pm", "10:30pm", "11:00pm", "11:30pm", "12:00am"]
var availabilityArray = []
var sessionIndices = []

function daySelected(dayInt, dayOfMonth, daysInMonth) {
    dayVal = dayOfMonth
    sessionIndices = []
    const checkoutPreTotal = document.getElementById('checkout-pre-total')
    checkoutPreTotal.innerHTML = 0.0
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
    availabilityArray = twosComplement(tutorsAvailability[dayInt]).split("")
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
    updateCheckout()
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



//Checkout Functions______________________________________________________________________________
function updateCheckout() {
    checkoutTotal = tutorsPricePHH * sessionIndices.length + sessionFee
    tutorsFee = tutorsPricePHH * sessionIndices.length

    const checkoutPreTotal = document.getElementById('checkout-pre-total')
    const checkoutFinalTotal = document.getElementById('checkout-final-total')
    checkoutPreTotal.innerHTML = tutorsPricePHH * sessionIndices.length
    checkoutFinalTotal.innerHTML = '$' + checkoutTotal

    var currentTotal = document.getElementById('current-total')
    var newBalance = document.getElementById('new-balance')

    currentTotal.innerHTML = '$' + checkoutTotal
    if(currentBalance>checkoutTotal) {
        newBalance.innerHTML = '$' + parseFloat(currentBalance - checkoutTotal).toFixed(2)
    }
}

const checkoutWithCard = document.getElementById('checkout-with-card')
const checkoutWithBalance = document.getElementById('checkout-with-balance')

checkoutWithBalance.addEventListener('click', () => {
    if(currentBalance>=checkoutTotal) {
        var newBalance = coreBalance - checkoutTotal
        userDB.collection('userTest').doc(globalUserId).update({'currentBalance' : newBalance}).then(function(doc) {
            var transactionID = createTransactionID()
            console.log("Transaction ID: " + transactionID)
            setProcessingInitialState()
            createSession('TutorTree Balance', transactionID)
        })
    } else {
        showErrorMessage("You don't have enough funds in your TutorTree account.")
    }
})

function createSession(howPaid, transactionID) {
    var checkoutDict = {
        'checkoutTotal' : checkoutTotal,
        'course' : course,
        'end' : end,
        'howPaid' : howPaid,
        'isRefunded' : false,
        'paid' : 0,
        'rated' : false,
        'school' : school,
        'sessionFee' : 3.95,
        'sessionLength' : sessionIndices.length * 30,
        'start' : start,
        'status' : 'pending',
        'student' : globalUserId,
        'subject' : subject,
        'tutor' : tutor,
        'tutorsFee' : tutorsFee
    }

    var promises = []
    var studentPromise = userDB.collection('userTest').doc(globalUserId).collection('sessions').doc(transactionID).set(checkoutDict).then(function() {
        console.log("Student doc written");
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    var tutorPromise = userDB.collection('userTest').doc(tutor).collection('sessions').doc(transactionID).set(checkoutDict).then(function() {
        console.log("Tutor doc written");
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    var globalPromise = userDB.collection('globalSessions').doc(transactionID).set(checkoutDict).then(function() {
        console.log("Global doc written");
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    var notificationPromise = userDB.collection('userTest').doc(tutor).get().then(function(doc) {
        var sessionDate = document.getElementById('session-date-header').innerHTML
        var sessionTime = document.getElementById('session-time-text').innerHTML
        var tutorData = doc.data()
        var isPushOn = tutorData.isPushOn
        var phoneNumber = tutorData.phoneNumber
        var message = coreName+" booked a session with you for "+sessionDate+" from "+sessionTime+". This session is awaiting your confirmation."

        sendSMSTo(phoneNumber, message)
        var adminMessage = coreName+" booked a session on the website for "+sessionDate
        sendSMSTo('4582108156', adminMessage)

        if(isPushOn) {
            var token = tutorData.pushToken
            var title = "New Booking Request"
            sendPushTo(token, title, message)
        }
        console.log("Notifications Sent")
    })

    var connectionID = tutor+":"+globalUserId
    var connectionPromise = userDB.collection('messages').doc(connectionID).get().then(function(doc) {
        if(doc.exists) {
            console.log("Connection already exists, done writing")
        } else {
            var updateDict = {
                "members" : [globalUserId, tutor],
                "student" : globalUserId,
                "tutor" : tutor
            }
            userDB.collection('messages').doc(connectionID).set(updateDict).then(function(doc) {
                console.log("Connection didn't exist, done creating")
            })
        }
    })
    promises.push(studentPromise, tutorPromise, globalPromise, notificationPromise, connectionPromise)

    Promise.all(promises).then(results => {
        console.log('All documents written successfully')
        sendReceiptTo(transactionID, checkoutTotal, coreEmail)
        $("#processing-text").hide(() => {
            $('#confirmation-text').fadeIn()
            $('#confirmation-check').fadeIn()
        })
    })
}


braintree.client.create({
    authorization: 'production_yks4fjkg_j3thkst7k9j6mkvc'
    }, function (clientErr, clientInstance) {
    if (clientErr) {
        console.error(clientErr);
        return;
    }

    // This example shows Hosted Fields, but you can also use this
    // client instance to create additional components here, such as
    // PayPal or Data Collector.

    braintree.hostedFields.create({
        client: clientInstance,
        styles: {
            'input': {
                'font-size': '14px'
            },
            'input.invalid': {
                'color': 'red'
            },
            'input.valid': {
                'color': 'green'
            }
        },
        fields: {
            number: {
                selector: '#card-number',
                placeholder: '4111 1111 1111 1111'
            },
            cvv: {
                selector: '#cvv',
                placeholder: '123'
            },
            expirationDate: {
                selector: '#expiration-date',
                placeholder: '10/2022'
            }
        }
    }, function (hostedFieldsErr, hostedFieldsInstance) {
        if (hostedFieldsErr) {
            console.error(hostedFieldsErr);
            return;
        }

        var checkoutWithCard = document.getElementById('checkout-with-card')

        checkoutWithCard.addEventListener('click', function (event) {
            event.preventDefault();
            setProcessingInitialState()

            hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
                if (tokenizeErr) {
                    console.error(tokenizeErr);
                    processingErrorResetScreens()
                    showErrorMessage("Something went wrong. Please try again")
                return;
                }
                var nonce = payload.nonce
                var amount = checkoutTotal
                setProcessingInitialState()
                checkoutWithNonceAndAmount(nonce, amount, "Credit Card")
            });
        }, false);
    })
})

async function checkoutWithNonceAndAmount(nonce, amount, howPaid) {
    var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree2.herokuapp.com/checkoutWithNonceAndAmount/"+nonce+"/"+amount
            
    xhttp.onreadystatechange = function() {
            if (xhttp.readyState == XMLHttpRequest.DONE) {
                    var response = xhttp.responseText
                    console.log(response)
                    if(response == 'Declined') {
                        processingErrorResetScreens()
                        showErrorMessage('Your payment method was declined.')
                    } else {
                        createSession(howPaid, response)
                    }
            }
    }
    xhttp.open("GET", herokuURL, true);
    xhttp.send();

    return(xhttp.response)
}

function showErrorMessage(message) {
    var errorMessageDiv = document.getElementById('error-message')
    errorMessageDiv.innerHTML = message

    $('#error-message').fadeIn().delay(5000).fadeOut("slow")
}

function setProcessingInitialState() {
    $("#checkout-screen").hide( () => {
        $("#processing-screen").show()
        $("#processing-text").show()
        $("#confirmation-text").hide()
        $("#confirmation-check").hide()
    })
}

function processingErrorResetScreens() {
    $("#processing-screen").show( () => {
        $("#checkout-screen").hide()
        $("#processing-text").show()
        $("#confirmation-text").hide()
        $("#confirmation-check").hide()
    })
}
