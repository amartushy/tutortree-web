function loadBookingPageFromData(data, tutorID) {
    loadAvailabilities(data.availability)
    buildCalendarNav()
    buildCalendar(tutorsAvailability)

    tutorsPricePHH = data.pricePHH
    course = data.preferences.course 
    school = data.preferences.school
    student = globalUserId
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
    checkoutBalance.innerHTML = '$' + coreBalance
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

//Checkout variables
var checkoutTotal = 0.0
var course
var end
var howPaid //TODO
var isRefunded = false
var paid = 0
var rated = false
var school
var sessionFee = 3.95
var sessionLength
var start
var status = 'pending'
var student
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
    var calendarBack = document.getElementById('calendar-back')
    var calendarForward = document.getElementById('calendar-forward')
    
    calendarBack.addEventListener('click', () => {
        if (month==0) {
            year--
            month = 11
        } else {
            month--
        }
        buildCalendar(tutorsAvailability)
    })

    calendarForward.addEventListener('click', () => {
        if (month==11) {
            year++
            month = 0
        } else {
            month++
        }
        buildCalendar(tutorsAvailability)
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
