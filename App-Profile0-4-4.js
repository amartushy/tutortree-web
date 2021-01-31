//Global Variables__________________________________________________________________
var userDB = firebase.firestore()

//Core properties all users have
var globalUserId,
    coreAvailability,
    coreBio,
    coreBalance,
    coreEmail,
    coreIsEmailOn,
    coreIsSMSOn,
    coreIsTutor,
    coreMaxHours,
    coreName,
    corePhone,
    coreProfileImage,
    corePricePHH,
    coreSchool,
    coreSubject

//Initialize elements on page load
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var ID = user.uid
		 
        loadCoreProperties(ID)
		
	//If user is not logged in return them to login screen
	} else {
		location.href = 'https://app-tutortree.webflow.io/login'
	}
})

function loadCoreProperties(ID) {
    globalUserId = ID
	console.log(globalUserId)
    userDB.collection('userTest').doc(globalUserId).onSnapshot(function(doc) {
        var data = doc.data()

        coreBio = data.bio
	    coreBalance = data.currentBalance
        coreEmail = data.email
        coreIsEmailOn = data.isEmailOn 
        coreIsSMSOn = data.isSMSOn
        coreIsTutor = data.isTutor
        coreName = data.name 
        corePhone = data.phoneNumber 
        coreProfileImage = data.profileImage 
        coreSchool = data.school 
        coreSubject = data.major 
        coreTutorApplicantStatus = data.tutorApplicantStatus 

        loadHeader()
        loadProfile()
	    loadNotifications()
	    loadFinancials()
        
        if(coreTutorApplicantStatus == 'pending' ) {
            coreAvailability = data.availability
	        coreMaxHours = data.maxHPW
	        corePricePHH = data.pricePHH
            loadPendingApplicantProfile()
        }

        if (coreIsTutor) {
            coreAvailability = data.availability
            coreMaxHours = data.maxHPW
            corePricePHH = data.pricePHH
            loadTutorProfile()
        }
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

let experienceSection = document.getElementById('experience-section')
let availabilitySection = document.getElementById('availability-section')

async function loadProfile() {
    console.log('Loading User Profile')
    experienceSection.style.display = 'none'
    availabilitySection.style.display = 'none'

    var usersSessions = document.getElementById('users-sessions')
    var usersAverage = document.getElementById('users-average')

    var usersImageBlock = document.getElementById('users-image-block')
    var usersName = document.getElementById('users-name')
    var usersSchool = document.getElementById('users-school')
    var usersMajor = document.getElementById('users-major')
    var usersBio = document.getElementById('users-bio')
    
    while ( usersImageBlock.firstChild ) {
        usersImageBlock.removeChild(usersImageBlock.firstChild)
    }

    var usersProfileImage = document.createElement('img')
    usersProfileImage.setAttribute('class', 'user-profile-image')
    usersProfileImage.src = coreProfileImage
    usersImageBlock.appendChild(usersProfileImage)

    usersName.innerHTML = coreName
    usersBio.innerHTML = coreBio
    usersSchool.innerHTML = await getSchoolName(coreSchool)
    usersMajor.innerHTML = coreSubject

    usersSessions.innerHTML = await getCountOfSessions(globalUserId)
    usersAverage.style.display = 'none'   
    
    loadProfileReviews()
}

async function loadTutorProfile() {
    console.log('Loading Tutor Profile')
    experienceSection.style.display = 'block'
    availabilitySection.style.display = 'block'

    var usersAverage = document.getElementById('users-average')
    
	loadProfileExperience()
	loadProfileAvailability()
    
    usersAverage.innerHTML = await getRatingForUser(globalUserId)
    usersAverage.style.display = 'flex'
}

async function loadPendingApplicantProfile() {
    console.log('Loading Tutor Applicant Profile')

    experienceSection.style.display = 'block'
    availabilitySection.style.display = 'block'

    var usersAverage = document.getElementById('users-average')
    usersAverage.innerHTML = await getRatingForUser(globalUserId)
    usersAverage.style.display = 'flex'

    loadProfileExperience()
	loadProfileAvailability()
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


//Experience
var profileNoExperience = document.getElementById('profile-no-experience')
var profileExperienceContainer = document.getElementById('profile-experience-container')

function loadProfileExperience() {
    while(profileExperienceContainer.firstChild) {
        profileExperienceContainer.removeChild(profileExperienceContainer.firstChild)
    }
    profileNoExperience.style.display = 'block'

    userDB.collection('userTest').doc(globalUserId).get().then(function(doc) {
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

let allReviewsArea = document.getElementById('all-reviews-area')
let noReviewsText = document.getElementById('no-reviews-text')

function loadProfileReviews() {
    while(allReviewsArea.firstChild) {
        allReviewsArea.removeChild(allReviewsArea.firstChild)
    }
    noReviewsText.style.display = 'none'

    userDB.collection('userTest').doc(globalUserId).collection('reviews').get().then(function(reviews) {
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

var currentDate = getCurrentMonthAndYear()
var year = currentDate[0]
var month = currentDate[1]
var dayVal
var tutorsAvailability = []
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


function loadProfileAvailability() {
    setInitialState()
    loadAvailabilities()
    buildCalendarNav()
    buildCalendar(tutorsAvailability)
}

function setInitialState() {
    var timeslotsContainer = document.getElementById('timeslots-container')

    while(timeslotsContainer.firstChild) {
        timeslotsContainer.removeChild(timeslotsContainer.firstChild)
    }
    var noDateSelectedText = document.createElement('div')
    noDateSelectedText.setAttribute('class', 'no-date-selected-text')
    noDateSelectedText.innerHTML = "Select a date to see available times"
    timeslotsContainer.appendChild(noDateSelectedText)
}

function loadAvailabilities() {
    tutorsAvailability = []
    tutorsAvailability.push(coreAvailability.Sunday)
    tutorsAvailability.push(coreAvailability.Monday)
    tutorsAvailability.push(coreAvailability.Tuesday)
    tutorsAvailability.push(coreAvailability.Wednesday)
    tutorsAvailability.push(coreAvailability.Thursday)
    tutorsAvailability.push(coreAvailability.Friday)
    tutorsAvailability.push(coreAvailability.Saturday)
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
        buildCalendar(tutorsAvailability)
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



function loadNotifications() {
    const usersEmail = document.getElementById('email-field')
    const usersPhone = document.getElementById('sms-field')
    const emailToggle = document.getElementById('email-toggle')
    const smsToggle = document.getElementById('sms-toggle')
    const smsConfirmation = document.getElementById('sms-confirmation')

    usersEmail.placeholder = coreEmail 
    usersPhone.placeholder = corePhone 

    if (coreIsEmailOn) {
        usersEmail.style.display = 'block'
        emailToggle.setAttribute('class', 'toggle-selected')
    } else {
        usersEmail.style.display = 'none'
        emailToggle.setAttribute('class', 'toggle')
    }

    if (coreIsSMSOn) {
        usersPhone.style.display = 'block'
        smsToggle.setAttribute('class', 'toggle-selected')
    } else {
        usersPhone.style.display = 'none'
        smsToggle.setAttribute('class', 'toggle')
    }

    emailToggle.addEventListener('click', () => {
        userDB.collection('userTest').doc(globalUserId).get().then(function(doc) {
            const isEmailOn = doc.data().isEmailOn 
            userDB.collection('userTest').doc(globalUserId).update({"isEmailOn" : !isEmailOn})
        })
    })

    smsToggle.addEventListener('click', () => {
        userDB.collection('userTest').doc(globalUserId).get().then(function(doc) {
            const isSMSOn = doc.data().isSMSOn 
            userDB.collection('userTest').doc(globalUserId).update({"isSMSOn" : !isSMSOn})
        })
    })

    usersPhone.onblur = function() {
        const newNumber = usersPhone.value  
        userDB.collection('userTest').doc(globalUserId).update({'phoneNumber' : newNumber}).then( () => {
            smsConfirmation.style.display = 'flex'
            $('#sms-confirmation').delay(1500).fadeOut(2000)
        })
    }
}

//Billing__________________________________________________________________________________________________________________________________
function loadFinancials() {
    loadTransactions()

    const currentBalance = document.getElementById('current-balance')

    const depositButton = document.getElementById('deposit-button')
    const withdrawButton = document.getElementById('withdraw-button')
    const transactionsButton = document.getElementById('transactions-button')

    const transactionsTab = document.getElementById('transactions-tab')
    const subscriptionsTab = document.getElementById('subscriptions-tab')
    const paymentMethodsTab = document.getElementById('payment-methods-tab')
    
    const transactionsContent = document.getElementById('transactions-content')
    
    const billingPage = document.getElementById('billing')
    const billingBack = document.getElementById('billing-back')


    currentBalance.innerHTML = '$' + parseFloat(coreBalance).toFixed(2)

    depositButton.addEventListener('click', () => {
        loadDeposit()
    })
    transactionsButton.addEventListener('click', () => {
        billingPage.style.display = 'flex'
    })

    billingBack.addEventListener('click', () => {
        billingPage.style.display = 'none'
    })

    //Tabs
    transactionsTab.addEventListener('click', () => {
        transactionsTab.setAttribute('class', 'billing-tab-selected')
        subscriptionsTab.setAttribute('class', 'billing-tab-unselected')
        paymentMethodsTab.setAttribute('class', 'billing-tab-unselected')

        transactionsContent.style.display = 'block'
    })

    subscriptionsTab.addEventListener('click', () => {
        transactionsTab.setAttribute('class', 'billing-tab-unselected')
        subscriptionsTab.setAttribute('class', 'billing-tab-selected')
        paymentMethodsTab.setAttribute('class', 'billing-tab-unselected')
    })

    paymentMethodsTab.addEventListener('click', () => {
        transactionsTab.setAttribute('class', 'billing-tab-unselected')
        subscriptionsTab.setAttribute('class', 'billing-tab-unselected')
        paymentMethodsTab.setAttribute('class', 'billing-tab-selected')
    })
}


function loadTransactions() {
    userDB.collection('userTest').doc(globalUserId).collection('spending').onSnapshot(function(spending) {

        var promises = []
        var transactionsObject = []

        spending.forEach(function(doc) {
            const data = doc.data()
            const date = data.start
            const id = doc.id
            const transaction = [date, id, data]

            transactionsObject.push(transaction)
            promises.push(doc.data())
        })

        Promise.all(promises).then( () => {
            buildTransactions(transactionsObject)
        })
    })
}

function buildTransactions(transactions) {
    document.getElementById('number-results').innerHTML = transactions.length + ' Results'

    const summaryArea = document.getElementById('transaction-summary-area')

    while(summaryArea.firstChild) {
        summaryArea.removeChild(summaryArea.firstChild)
    }

    var sortedTransactions = transactions.sort(function(a,b) {
        return b[0] - a[0]
    })
    console.log(sortedTransactions)

    for( var i = 0; i < sortedTransactions.length; i++) {
        const date = sortedTransactions[i][0]
        const orderNumber = sortedTransactions[i][1]
        const amount = sortedTransactions[i][2].checkoutTotal
    
        const transactionSummary = document.createElement('div')
        transactionSummary.setAttribute('class', 'transaction-summary')
        summaryArea.appendChild(transactionSummary)

        const checkBox = document.createElement('div')
        checkBox.setAttribute('class', 'check-unselected')
        checkBox.innerHTML = ''
        transactionSummary.appendChild(checkBox)
        
        const orderNumberDiv = document.createElement('div')
        orderNumberDiv.setAttribute('class', 'transaction-order-number')
        orderNumberDiv.innerHTML = orderNumber
        transactionSummary.appendChild(orderNumberDiv)
 
        const billingDateDiv = document.createElement('div')
        billingDateDiv.setAttribute('class', 'transaction-billing-date')
        billingDateDiv.innerHTML = formatTransactionDate(date)
        transactionSummary.appendChild(billingDateDiv)

        const amountDiv = document.createElement('div')
        amountDiv.setAttribute('class', 'transaction-amount')
        amountDiv.innerHTML = '$' + amount
        transactionSummary.appendChild(amountDiv)
    }
}

function formatTransactionDate(date) {
    const dateObject = new Date(date * 1000)
    const month = dateObject.getMonth()
    const day = dateObject.getDate() + 1
    const year = dateObject.getFullYear()

    const yearString = month + '/' + day + '/' + year
    return yearString
}


//Deposit Functions____________________________________________________________________________________

var depositTotal
function loadDeposit() {
    depositNavigation()
    setInitialDepositState()

    depositTotal = 0
    var depositAmountField = document.getElementById('deposit-amount-field')
    var depositTotalText = document.getElementById('deposit-total-text') 
    var accountEmailField = document.getElementById('account-email')

    depositAmountField.placeholder = '$0.00'
    depositTotalText.innerHTML = '$' + depositTotal
    accountEmailField.innerHTML = coreEmail
    
    depositAmountField.onblur = () => {
        depositTotal = depositAmountField.value 
        depositTotalText.innerHTML = '$' + depositTotal
    }
    depositAmountField.addEventListener("keydown", function (e) {
        if (e.keyCode === 13) {
            $('#deposit-amount-field').blur()
            depositTotal = depositAmountField.value 
            depositTotalText.innerHTML = '$' + depositTotal
            depositAmountField.placeholder = '$' + depositTotal
            depositAmountField.value = ''
        }
    })
}

Webflow.push(function() {
    // Disable webflows submission onkeydown 13 (enter)
    $('#amount-form').submit(function() {
      return false
    })
})

function depositNavigation() {
    const profileBackButton = document.getElementById('profile-back-button')
    const checkoutWithCard = document.getElementById('checkout-with-card')
    const checkoutComplete = document.getElementById('checkout-complete')

    profileBackButton.addEventListener('click', () => {
        $('#deposit-page').fadeOut()
    })

    checkoutWithCard.addEventListener('click', () => {
        setProcessingInitialState()
    })

    checkoutComplete.addEventListener('click', () => {
        $('#deposit-page').fadeOut()
    })
}

function setInitialDepositState() {
    $("#processing-screen").hide()
    $("#processing-text").show()
    $("#confirmation-text").hide()
    $("#confirmation-check").hide()
    const depositPage = document.getElementById('deposit-page')
    depositPage.style.display = 'flex'

    $('#checkout-screen').fadeIn(400)
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
                var amount = depositTotal
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
                        createDeposit(howPaid, response)
                    }
            }
    }
    xhttp.open("GET", herokuURL, true);
    xhttp.send();

    return(xhttp.response)
}

function createDeposit(howPaid, transactionID) {
    var currentDateTime = new Date() / 1000
    var dateObject = getFormattedDate(currentDateTime)
    const dateCreated = dateObject[0] + ', ' + dateObject[1] + ' ' + dateObject[2]

    var depositDict = {
        'user' : globalUserId,
        'accountEmail' : coreEmail,
        'amount' : depositTotal,
        'date' : dateCreated,
        'dateEpoch' : currentDateTime,
        'howPaid' : howPaid
    }
    console.log(depositDict)

    var promises = []
    var depositPromise = userDB.collection('deposits').doc(transactionID).set(depositDict).then(function(){
        console.log("Global deposits written")
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    var userPromise = userDB.collection('userTest').doc(globalUserId).collection('deposits').doc(transactionID).set(depositDict).then(function(){
        console.log("User deposits written")
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

    promises.push(depositPromise, userPromise, balancePromise)

    Promise.all(promises).then( () => {
        console.log("All documents written successfully")
        sendReceiptTo(transactionID, depositTotal, coreEmail)
        $("#processing-text").hide(() => {
            $('#confirmation-text').fadeIn()
            $('#confirmation-check').fadeIn()
        })
    })
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

//Withdrawal Functions_____________________________________________________________________________________________________________________________
const withdrawalButton = document.getElementById('withdrawal-button')

const withdrawalPage = document.getElementById('withdrawal-page')
const withdrawalBackButton = document.getElementById('withdrawal-back-button')
const payoutOptions = document.getElementById('payout-options')
const payoutSelectionScreen = document.getElementById('payout-selection-screen')
const payoutFields = document.getElementById('payout-fields')

const paypalButton = document.getElementById('paypal-button')
const zelleButton = document.getElementById('zelle-button')
const venmoButton = document.getElementById('venmo-button')

var withdrawalBalance = document.getElementById('withdrawal-balance')
const paypalWithdrawalDiv = document.getElementById('paypal-withdrawal-div')
const zelleWithdrawalDiv = document.getElementById('zelle-withdrawal-div')
const venmoWithdrawalDiv = document.getElementById('venmo-withdrawal-div')

const paypalField = document.getElementById('paypal-field')
const zelleField = document.getElementById('zelle-field')
const venmoField = document.getElementById('venmo-field')

const confirmPaypal = document.getElementById('confirm-paypal')
const confirmZelle = document.getElementById('confirm-zelle')
const confirmVenmo = document.getElementById('confirm-venmo')

const withdrawalProcessingScreen = document.getElementById('withdrawal-processing-screen')
const withdrawalConfirmationText = document.getElementById('w-confirmation-text')
const withdrawalConfirmationCheck = document.getElementById('w-confirmation-check')
const withdrawalProcessingText = document.getElementById('w-processing-text')
const withdrawalCompleteButton = document.getElementById('withdrawal-complete')

withdrawalButton.addEventListener('click', () => {
    loadWithdrawalInitialState()
})

withdrawalBackButton.addEventListener('click', () => {
    withdrawalPage.style.display = 'none'
})

paypalButton.addEventListener('click', () => {
    paypalButton.setAttribute('class', 'payout-option-div-selected')
    zelleButton.setAttribute('class', 'payout-option-div')
    venmoButton.setAttribute('class', 'payout-option-div')

    $('#payout-fields').fadeIn()
    paypalWithdrawalDiv.style.display = 'block'
    zelleWithdrawalDiv.style.display = 'none'
    venmoWithdrawalDiv.style.display = 'none'
})

zelleButton.addEventListener('click', () => {
    paypalButton.setAttribute('class', 'payout-option-div')
    zelleButton.setAttribute('class', 'payout-option-div-selected')
    venmoButton.setAttribute('class', 'payout-option-div')

    $('#payout-fields').fadeIn()
    paypalWithdrawalDiv.style.display = 'none'
    zelleWithdrawalDiv.style.display = 'block'
    venmoWithdrawalDiv.style.display = 'none'
})

venmoButton.addEventListener('click', () => {
    paypalButton.setAttribute('class', 'payout-option-div')
    zelleButton.setAttribute('class', 'payout-option-div')
    venmoButton.setAttribute('class', 'payout-option-div-selected')

    $('#payout-fields').fadeIn()
    paypalWithdrawalDiv.style.display = 'none'
    zelleWithdrawalDiv.style.display = 'none'
    venmoWithdrawalDiv.style.display = 'block'
})

confirmPaypal.addEventListener('click', () => {
    $('#payout-selection-screen').fadeOut(400, () => {
        $('#withdrawal-processing-screen').fadeIn()

        withdrawalConfirmationText.style.display = 'none'
        withdrawalConfirmationCheck.style.display = 'none'
        withdrawalProcessingText.style.display = 'flex'
        withdrawFunds('paypal')
    })
})

confirmZelle.addEventListener('click', () => {
    $('#payout-selection-screen').fadeOut(400, () => {
        $('#withdrawal-processing-screen').fadeIn()
        
        withdrawalConfirmationText.style.display = 'none'
        withdrawalConfirmationCheck.style.display = 'none'
        withdrawalProcessingText.style.display = 'flex'
        withdrawFunds('zelle')
    })
})

confirmVenmo.addEventListener('click', () => {
    $('#payout-selection-screen').fadeOut(400, () => {
        $('#withdrawal-processing-screen').fadeIn()
        
        withdrawalConfirmationText.style.display = 'none'
        withdrawalConfirmationCheck.style.display = 'none'
        withdrawalProcessingText.style.display = 'flex'
        withdrawFunds('venmo')
    })
})

withdrawalCompleteButton.addEventListener('click', () => {
    withdrawalPage.style.display = 'none'
})

function loadWithdrawalInitialState() {
    paypalButton.setAttribute('class', 'payout-option-div')
    zelleButton.setAttribute('class', 'payout-option-div')
    venmoButton.setAttribute('class', 'payout-option-div')

    withdrawalPage.style.display = 'flex'
    payoutSelectionScreen.style.display = 'flex'
    payoutOptions.style.display = 'block'
    payoutFields.style.display = 'none'

    withdrawalBalance.innerHTML = parseFloat(coreBalance).toFixed(2)

    withdrawalProcessingScreen.style.display = 'none'
    withdrawalConfirmationText.style.display = 'none'
    withdrawalConfirmationCheck.style.display = 'none'
    withdrawalProcessingText.style.display = 'flex'

}

function withdrawFunds( howWithdraw) {
    var withdrawAmount = coreBalance
    var withdrawUsername

    if(howWithdraw == 'paypal') {
        withdrawUsername = paypalField.value 

    } else if(howWithdraw == 'zelle') {
        withdrawUsername = zelleField.value 

    } else if(howWithdraw == 'venmo') {

        withdrawUsername = venmoField.value 
    }

    var title = 'New Withdrawal Request'
    var smsMessage = coreName + ' has submitted a withdrawal request for $' + withdrawAmount + ' via ' + howWithdraw
    var message = coreName +' has submitted a new withdrawal request for: $' + withdrawAmount 
                + '\n Withdrawal Method: ' + howWithdraw
                + '\n Withdrawal Username: ' + withdrawUsername 
                + '\n Email: ' + coreEmail
                + '\n Name: ' + coreName
                + '\n UserID: ' + globalUserId
                + '\n Phone Number: ' + corePhone

    sendEmailTo('support@tutortree.com', title, message)
    sendSMSTo('4582108156', smsMessage)

    userDB.collection('userTest').doc(globalUserId).update( {'currentBalance' : 0 }).then( () => {
        loadCompletedState()
    })
}

function loadCompletedState() {
    payoutSelectionScreen.style.display = 'none'

    withdrawalProcessingScreen.style.display = 'flex'
    $("#w-processing-text").hide(() => {

        $('#w-confirmation-text').fadeIn()
        $('#w-confirmation-check').fadeIn()
    })
}

//Logout
let logOutButton = document.getElementById('log-out-button')

logOutButton.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        location.href = 'https://app-tutortree.webflow.io/login'
      }).catch((error) => {
        // An error happened.
        showErrorMessage(error.message)
      });
})


//Edit Profile Page_______________________________________________________________________________________________________________________
var editProfileButton = document.getElementById('edit-profile-button')
var editProfilePage = document.getElementById('edit-profile-page')
var editProfileBack = document.getElementById('edit-profile-back')

var aboutScreen = document.getElementById('about-screen')
var editImageBlock = document.getElementById('edit-image-block')
var editNameField = document.getElementById('edit-name-field')
var editBioField = document.getElementById('edit-bio-field')
var saveNameButton = document.getElementById('save-name-button')
var saveBioButton = document.getElementById('save-bio-button')

var coursesScreen = document.getElementById('courses-screen')
var schoolHeader = document.getElementById('school-header')
var changeSchoolButton = document.getElementById('change-school-button')
var coursesSchoolContainer = document.getElementById('courses-school-container')
var coursesContainer = document.getElementById('courses-container')


editProfileButton.addEventListener('click', () => {
    editProfilePage.style.display = 'flex'

    loadUserElements()
    if(coreIsTutor) {
        loadTutorElements()
    }
})

editProfileBack.addEventListener('click', () => {
    editProfilePage.style.display = 'none'
})

editNameField.onfocus = function() {
    $('#save-name-button').fadeIn()
}

editBioField.onfocus = function() {
    $('#save-bio-button').fadeIn()
}

saveNameButton.addEventListener('click', () => {
    userDB.collection('userTest').doc(globalUserId).update({
        'name' : editNameField.value
    }).then(() => {
        $('#save-name-button').fadeOut()
    })
})

saveBioButton.addEventListener('click', () => {
    userDB.collection('userTest').doc(globalUserId).update({
        'bio' : editBioField.value
    }).then(() => {
        $('#save-bio-button').fadeOut()
    })
})

function loadUserElements() {
    aboutScreen.style.display = 'flex'
    saveNameButton.style.display = 'none'
    saveBioButton.style.display = 'none'
    experienceScreen.style.display = 'none'
    saveMajorButton.style.display = 'none'
    availabilityScreen.style.display = 'none'
    coursesScreen.style.display = 'none'

    editNameField.value = coreName
    editBioField.value = coreBio
    editMajorField.value = coreSubject

    //Create Photo 
    editImageBlock.removeChild(editImageBlock.firstChild)
    editImageBlock.removeChild(editImageBlock.firstChild)

    var newImage = document.createElement('img')
    newImage.setAttribute('class', 'edit-profile-image')
    newImage.src = coreProfileImage
    editImageBlock.appendChild(newImage)
    newImage.addEventListener('click', function() {
        openPhotoUploadDialog()
    })

    var newIcon = document.createElement('div')
    newIcon.setAttribute('class', 'edit-photo-icon')
    newIcon.innerHTML = ''
    editImageBlock.appendChild(newIcon)
}

function loadTutorElements() {
    aboutScreen.style.display = 'flex'
    experienceScreen.style.display = 'flex'
    availabilityScreen.style.display = 'flex'
    coursesScreen.style.display = 'flex'

    loadExperience()
    loadAvailability()
    loadUsersSchools()
}

//Photo Upload
var storageRef = firebase.storage().ref();
var hiddenPhotoUploadButton = document.getElementById('hidden-photo-upload-button')

function openPhotoUploadDialog() {
	hiddenPhotoUploadButton.click();
}

hiddenPhotoUploadButton.addEventListener('change', uploadProfileImage);

var selectedPhotoFile;
function uploadProfileImage(e) {
    selectedPhotoFile = e.target.files[0];
    handlePhotoUpload()
}

async function handlePhotoUpload() {
	const uploadTask = await storageRef.child(`images/${selectedPhotoFile.name}`).put(selectedPhotoFile);
	uploadAndUpdateFirebasePhoto()
}

//final submit button and update firebase
async function uploadAndUpdateFirebasePhoto() {
	var phototFileURL = ""
	await storageRef.child('/images/'+selectedPhotoFile.name)
		.getDownloadURL()
		.then(function(url) { phototFileURL = url.toString() })
	userDB.collection("userTest")
		.doc(globalUserId)
        .update( {"profileImage" : phototFileURL })
        .then(function() {
            userDB.collection('userTest').doc(globalUserId).get().then(async function(doc) {
                //Create Photo 
                editImageBlock.removeChild(editImageBlock.firstChild)
                editImageBlock.removeChild(editImageBlock.firstChild)

                var newImage = document.createElement('img')
                newImage.setAttribute('class', 'edit-profile-image')
                newImage.src = doc.data().profileImage
                editImageBlock.appendChild(newImage)
                newImage.addEventListener('click', function() {
                    openPhotoUploadDialog()
                })

                var newIcon = document.createElement('div')
                newIcon.setAttribute('class', 'edit-photo-icon')
                newIcon.innerHTML = ''
                editImageBlock.appendChild(newIcon)
            })
        })
}


//Experience Screen__________________________________________________________________________
var experienceScreen = document.getElementById('experience-screen')
var editMajorField = document.getElementById('edit-major-field')
var saveMajorButton = document.getElementById('save-major-button')
var experienceContainer = document.getElementById('experience-container')
var addExperienceButton = document.getElementById('add-experience-button')
var addExperienceContainer = document.getElementById('add-experience-container')
var addExperienceTitle = document.getElementById('add-experience-title')
var addExperienceDescription = document.getElementById('add-experience-description')
var cancelExperienceButton = document.getElementById('cancel-experience-button')
var confirmExperienceButton = document.getElementById('confirm-experience-button')

editMajorField.onfocus = function() {
    $('#save-major-button').fadeIn()
}

saveMajorButton.addEventListener('click', () => {
    userDB.collection('userTest').doc(globalUserId).update({
        'major' : editMajorField.value
    }).then(() => {
        $('#save-major-button').fadeOut()
    })
})

function loadExperience() {
    while(experienceContainer.firstChild) {
        experienceContainer.removeChild(experienceContainer.firstChild)
    }
    addExperienceContainer.style.display = 'none'

    userDB.collection('userTest').doc(globalUserId).get().then(function(doc) {
        var experienceData = doc.data().experience 

        for(var experience in experienceData) {
            if ( experienceData.hasOwnProperty(experience) ){
                var title = experienceData[experience].title
                var description = experienceData[experience].description
                buildExperienceBlock(experience, title, description)
            }
        }
    })
}

function buildExperienceBlock(ID, title, description) {
    var experienceDiv = document.createElement('div')
    experienceDiv.setAttribute('class', 'experience-div')
    experienceContainer.appendChild(experienceDiv)
    
    var experienceHeaderDiv = document.createElement('div')
    experienceHeaderDiv.setAttribute('class', 'experience-header-div')
    experienceDiv.appendChild(experienceHeaderDiv)

    var experienceTitle = document.createElement('div')
    experienceTitle.setAttribute('class', 'experience-title')
    experienceTitle.innerHTML = title
    experienceHeaderDiv.appendChild(experienceTitle)

    var experienceMinus = document.createElement('div')
    experienceMinus.setAttribute('class', 'experience-minus')
    experienceMinus.innerHTML = ''
    experienceHeaderDiv.appendChild(experienceMinus)
    experienceMinus.addEventListener('click', () => {
        var experiencePath = 'experience.' + ID
        var deletedExperience = {}
        deletedExperience[experiencePath] = firebase.firestore.FieldValue.delete()

        userDB.collection('userTest').doc(globalUserId).update( deletedExperience ).then(function() {
            loadExperience()
        })
    })

    var experienceText = document.createElement('div')
    experienceText.setAttribute('class', 'experience-text')
    experienceText.innerHTML = description
    experienceDiv.appendChild(experienceText)
    
}

addExperienceButton.addEventListener('click', () => {
    $('#add-experience-container').fadeIn()
})

confirmExperienceButton.addEventListener('click', () => {
    addNewExperience()
})

cancelExperienceButton.addEventListener('click', () => {
    addExperienceTitle.value = ''
    addExperienceTitle.placeholder = 'Title'
    addExperienceDescription.value = ''
    addExperienceDescription.placeholder = 'Description'
    $('#add-experience-container').fadeOut()
})

function addNewExperience() {
    var title = addExperienceTitle.value
    var description = addExperienceDescription.value 
    var randomID = createTransactionID()
    var experiencePath = 'experience.' + randomID
    var newExperience = {}
    newExperience[experiencePath] = {'title' : title, 'description' : description}

    userDB.collection('userTest').doc(globalUserId).update(newExperience).then( () => {
        addExperienceTitle.value = ''
        addExperienceTitle.placeholder = 'Title'
        addExperienceDescription.value = ''
        addExperienceDescription.placeholder = 'Description'

        $('#add-experience-container').fadeOut()
    })
}

//Availability Screen___________________________________________________________________________________________________________________________
var availabilityScreen = document.getElementById('availability-screen')
var addNewAvailability = document.getElementById('add-new-availability')
var reduceRateButton = document.getElementById('reduce-rate-button')
var increaseRateButton = document.getElementById('increase-rate-button')
var editRateAmount = document.getElementById('edit-rate-amount')
var reduceHoursButton = document.getElementById('reduce-hours-button')
var increaseHoursButton = document.getElementById('increase-hours-button')
var editHoursAmount = document.getElementById('edit-hours-amount')

reduceRateButton.addEventListener('click', () => {
    userDB.collection('userTest').doc(globalUserId).update({
        'pricePHH' : firebase.firestore.FieldValue.increment(-0.50)
    }).then(function() {
        editRateAmount.innerHTML = parseFloat(corePricePHH).toFixed(2)
    })
})

increaseRateButton.addEventListener('click', () => {
    userDB.collection('userTest').doc(globalUserId).update({
        'pricePHH' : firebase.firestore.FieldValue.increment(0.50)
    }).then(function() {
        editRateAmount.innerHTML = parseFloat(corePricePHH).toFixed(2)
    })
})

reduceHoursButton.addEventListener('click', () => {
    userDB.collection('userTest').doc(globalUserId).update({
        'maxHPW' : firebase.firestore.FieldValue.increment(-1)
    }).then(function() {
        editHoursAmount.innerHTML = coreMaxHours
    })
})

increaseHoursButton.addEventListener('click', () => {
    userDB.collection('userTest').doc(globalUserId).update({
        'maxHPW' : firebase.firestore.FieldValue.increment(1)
    }).then(function() {
        editHoursAmount.innerHTML = coreMaxHours
    })
})

var availability = []
var timeOptions = ["6:00am", "6:30am", "7:00am", "7:30am", "8:00am","8:30am", "9:00am", "9:30am", "10:00am", "10:30am",
                    "11:00am", "11:30am", "12:00pm", "12:30pm", "1:00pm", "1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm", 
                    "4:00pm", "4:30pm", "5:00pm", "5:30pm", "6:00pm", "6:30pm", "7:00pm", "7:30pm", "8:00pm", "8:30pm", 
                    "9:00pm", "9:30pm", "10:00pm", "10:30pm", "11:00pm", "11:30pm", "12:00am", "12:30am"]
var dayIDs = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']   

function loadAvailability() {
    editRateAmount.innerHTML = parseFloat(corePricePHH).toFixed(2)
    editHoursAmount.innerHTML = coreMaxHours

    addNewAvailability.style.display = 'none'
    isEveryDay = false
    everydayToggle.setAttribute('class', 'toggle')

    availability = []
    availability.push(coreAvailability.Sunday)
    availability.push(coreAvailability.Monday)
    availability.push(coreAvailability.Tuesday)
    availability.push(coreAvailability.Wednesday)
    availability.push(coreAvailability.Thursday)
    availability.push(coreAvailability.Friday)
    availability.push(coreAvailability.Saturday)
    loadTimes()
}

function loadTimes() {

    //loop through each day in the day array
    for ( i =  0; i < availability.length; i++) {
        var dayID = dayIDs[i] + '-time-area'
        var dayContainer = document.getElementById(dayID)
        while(dayContainer.firstChild) {
            dayContainer.removeChild(dayContainer.firstChild)
        }

        var timesForDayArray = twosComplement(availability[i]).split("")

        //Loop through all 48 values in the day 
        for( j = 0; j < timesForDayArray.length; j++) {

            //Found first available timeslot
            if(timesForDayArray[j] == 1) {
                var startIndex = j
                var endIndex = j+1 

                //Loop through subsequent values until an endtime is found
                for( k = j; k < timesForDayArray.length; k++ ) {
                    if(timesForDayArray[k] == 0) {
                        buildTimeSlot(startIndex, endIndex, i)
                        j = k
                        break

                    } else {
                        endIndex = k+1
                    }
                }
            }
        }
    }
}

function buildTimeSlot(startIndex, endIndex, day) {
    var startTime = timeOptions[startIndex]
    var endTime = timeOptions[endIndex]

    var dayID = dayIDs[day] + '-time-area'
    var timeString = startTime + ' - ' + endTime

    var dayContainer = document.getElementById(dayID)
    var availabilityTimeDiv = document.createElement('div')
    availabilityTimeDiv.setAttribute('class', 'availability-time-div')
    dayContainer.appendChild(availabilityTimeDiv)

    var timeSlotMinus = document.createElement('div')
    timeSlotMinus.setAttribute('class', 'timeslot-minus')
    timeSlotMinus.innerHTML = ''
    timeSlotMinus.setAttribute('onClick', 'updateAvailability("'+day+'","'+startIndex+'","'+endIndex+'","'+true+'")')
    availabilityTimeDiv.appendChild(timeSlotMinus)

    var availabilityTime = document.createElement('div')
    availabilityTime.setAttribute('class', 'availability-time')
    availabilityTime.innerHTML = timeString 
    availabilityTimeDiv.appendChild(availabilityTime)
}

var addSundayTime = document.getElementById('add-sunday-time')
var addMondayTime = document.getElementById('add-monday-time')
var addTuesdayTime = document.getElementById('add-tuesday-time')
var addWednesdayTime = document.getElementById('add-wednesday-time')
var addThursdayTime = document.getElementById('add-thursday-time')
var addFridayTime = document.getElementById('add-friday-time')
var addSaturdayTime = document.getElementById('add-saturday-time')
addSundayTime.addEventListener('click', () => {
    availabilityDayIndex = 0
    openAddNewAvailability('Sunday')
})
addMondayTime.addEventListener('click', () => {
    availabilityDayIndex = 1
    openAddNewAvailability('Monday')
})
addTuesdayTime.addEventListener('click', () => {
    availabilityDayIndex = 2
    openAddNewAvailability('Tuesday')
})
addWednesdayTime.addEventListener('click', () => {
    availabilityDayIndex = 3
    openAddNewAvailability('Wednesday')
})
addThursdayTime.addEventListener('click', () => {
    availabilityDayIndex = 4
    openAddNewAvailability('Thursday')
})
addFridayTime.addEventListener('click', () => {
    availabilityDayIndex = 5
    openAddNewAvailability('Friday')
})
addSaturdayTime.addEventListener('click', () => {
    availabilityDayIndex = 6
    openAddNewAvailability('Saturday')
})

var startTimeDropdown = document.getElementById('start-time-dropdown')
startTimeDropdown.addEventListener('click', () => {
    $('start-options-container').fadeIn()
})
var endTimeDropdown = document.getElementById('end-time-dropdown')
endTimeDropdown.addEventListener('click', () => {
    $('end-options-container').fadeIn()
})


var startOptionsContainer = document.getElementById('start-options-container')
var endOptionsContainer = document.getElementById('end-options-container')
var startTimeText = document.getElementById('start-time-text')
var endTimeText = document.getElementById('end-time-text')

function openAddNewAvailability(day) {
    while(startOptionsContainer.firstChild) {
        startOptionsContainer.removeChild(startOptionsContainer.firstChild)
    }
    while(endOptionsContainer.firstChild) {
        endOptionsContainer.removeChild(endOptionsContainer.firstChild)
    }
    startTimeText.innerHTML = 'Time..'
    endTimeText.innerHTML = 'Time...'

    var endTimeOption = document.createElement('div')
    endTimeOption.innerHTML = 'Select Start Time'
    endOptionsContainer.appendChild(endTimeOption)
    endTimeOption.setAttribute('class', 'time-option-top')

    $('#add-new-availability').fadeIn()
    var addAvailabilityHeader = document.getElementById('add-availability-header')
    addAvailabilityHeader.innerHTML = 'Add Availability For ' + day

    for(i=0; i<timeOptions.length; i++) {
        var startTimeOption = document.createElement('div')
        startTimeOption.innerHTML = timeOptions[i]
        startOptionsContainer.appendChild(startTimeOption)
        startTimeOption.setAttribute('onClick', 'updateStartAndEndTimes(true, "' + i + '")')

        if(i==0) {
            startTimeOption.setAttribute('class', 'time-option-top')
        } else if( i==timeOptions.length) {
            startTimeOption.setAttribute('class', 'time-option-bottom')
        } else {
            startTimeOption.setAttribute('class', 'time-option')
        }
    }
}

var availabilityDayIndex
var availabilityStartIndex
var availabilityEndIndex
var isEveryDay
function updateStartAndEndTimes(isStart, index) {

    if(isStart) {
        availabilityStartIndex = index
        startTimeText.innerHTML = timeOptions[index]
        $('start-options-container').fadeOut()
        loadEndTimes(index)
    } else {
        availabilityEndIndex = index
        endTimeText.innerHTML = timeOptions[index]
        $('end-options-container').fadeOut()
    }
}

function loadEndTimes(startIndex) {
    var nextIndex = parseInt(startIndex) + 1
    while(endOptionsContainer.firstChild) {
        endOptionsContainer.removeChild(endOptionsContainer.firstChild)
    }

    for(i=nextIndex; i<timeOptions.length; i++) {
        var endTimeOption = document.createElement('div')
        endTimeOption.innerHTML = timeOptions[i]
        endOptionsContainer.appendChild(endTimeOption)
        endTimeOption.setAttribute('onClick', 'updateStartAndEndTimes(false, "' + i + '")')

        if(i==0) {
            endTimeOption.setAttribute('class', 'time-option-top')
        } else if( i==timeOptions.length) {
            endTimeOption.setAttribute('class', 'time-option-bottom')
        } else {
            endTimeOption.setAttribute('class', 'time-option')
        }
    }
}

var everydayToggle = document.getElementById('everyday-toggle')
var cancelNewAvailability = document.getElementById('cancel-new-availability')
var confirmNewAvailability = document.getElementById('confirm-new-availability')
var dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']  

everydayToggle.addEventListener('click', () => {
    if(isEveryDay == false) {
        isEveryDay = true
        everydayToggle.setAttribute('class', 'toggle-selected')
    } else {
        isEveryDay = false
        everydayToggle.setAttribute('class', 'toggle')
    }
})
cancelNewAvailability.addEventListener('click', () => {
    $('#add-new-availability').fadeOut()
})

confirmNewAvailability.addEventListener('click', () => {
    console.log(availabilityDayIndex)
    console.log(availabilityStartIndex)
    console.log(availabilityEndIndex)
    console.log('Everyday: ' + isEveryDay)
    if (!isEveryDay) {
        updateAvailability(availabilityDayIndex, availabilityStartIndex, availabilityEndIndex, false)
    } else {
        updateEveryday(availabilityStartIndex, availabilityEndIndex)
    }
})


function updateAvailability(dayIndex, startIndex, endIndex, isRemoving) {
    var availabilityArray = twosComplement(availability[dayIndex]).split("")

    for ( i = startIndex; i < endIndex; i++) {
        if(isRemoving) {
            availabilityArray[i] = "0"
        } else {
            availabilityArray[i] = "1"
        }
    }
    var binaryString = '0000000000000000' + availabilityArray.join('')
    const decimalAvailability = parseInt( binaryString, 2)
    var availabilityPath = 'availability.' + dayArray[dayIndex]
    var updateDay = {}
    updateDay[availabilityPath] = decimalAvailability
    userDB.collection('userTest').doc(globalUserId).update(updateDay).then(() => {
        $('#add-new-availability').fadeOut()
        loadAvailability()
    })
}

function updateEveryday(startIndex, endIndex) {
    var updateDict = {}

    for (i = 0; i < 7; i++) {
        var availabilityArray = twosComplement(availability[i]).split("")
        for ( j = startIndex; j < endIndex; j++) {
            availabilityArray[j] = "1"
        }
        var binaryString = '0000000000000000' + availabilityArray.join('')
        updateDict[dayArray[i]] = parseInt( binaryString, 2)
    }

    var finalDict = {}
    finalDict['availability'] = updateDict
    userDB.collection('userTest').doc(globalUserId).update(finalDict).then(() => {
        $('#add-new-availability').fadeOut()
        loadAvailability()
    })
}


//Course Screen__________________________________________________________________________________________________________________________
var middleSchoolBlock = document.getElementById('middle-school-block')
var highSchoolBlock = document.getElementById('high-school-block')
var addCollegeButton = document.getElementById('add-college-button')
var collegesArea = document.getElementById('colleges-area')

function loadUsersSchools() {
    while(collegesArea.firstChild) {
        collegesArea.removeChild(collegesArea.firstChild)
    }
    loadNewSchools()

    userDB.collection('userTest').doc(globalUserId).get().then(function(doc) {
        var schoolData = doc.data().schoolPreferences

        for (var schoolID in schoolData) {
            if(schoolData.hasOwnProperty(schoolID)) {

                userDB.collection('schools').doc(schoolID).get().then(function(school) {
                    buildSchool(school.id, school.data())
                })
            }
        }
    })
}

function buildSchool(school, schoolData) {
    var collegeContainer = document.createElement('div')
    collegeContainer.setAttribute('class', 'college-container')
    collegesArea.appendChild(collegeContainer)

    var schoolBlock = document.createElement('div')
    schoolBlock.setAttribute('class', 'school-block')
    schoolBlock.addEventListener('click', () => {
        var courseContainer = document.getElementById(`courses-container-${school}`)
        if(courseContainer.style.display == 'none') {
            $(`#courses-container-${school}`).fadeIn()
        } else {
            $(`#courses-container-${school}`).fadeOut()
        }
    })
    collegeContainer.appendChild(schoolBlock)

    var schoolHeader = document.createElement('div')
    schoolHeader.setAttribute('class', 'filter-header')
    schoolBlock.appendChild(schoolHeader)

    var schoolHeaderLogoContainer = document.createElement('div')
    schoolHeaderLogoContainer.setAttribute('class', 'school-header-logo-container')
    schoolHeader.appendChild(schoolHeaderLogoContainer)

    var schoolHeaderLogo = document.createElement('img')
    schoolHeaderLogo.setAttribute('class', 'school-header-logo')
    schoolHeaderLogo.src = schoolData.icon 
    schoolHeaderLogoContainer.appendChild(schoolHeaderLogo)

    var schoolHeaderText = document.createElement('div')
    schoolHeaderText.setAttribute('class', 'school-header-text')
    schoolHeaderText.innerHTML = schoolData.title
    schoolHeaderLogoContainer.appendChild(schoolHeaderText)

    var schoolChevron = document.createElement('div')
    schoolChevron.setAttribute('class', 'filter-chevron')
    schoolChevron.innerHTML = ''
    schoolHeader.appendChild(schoolChevron)

    var coursesContainer = document.createElement('div')
    coursesContainer.setAttribute('class', 'courses-container')
    coursesContainer.setAttribute('id', `courses-container-${school}`)
    collegeContainer.appendChild(coursesContainer)
    coursesContainer.style.display = 'none'

    userDB.collection("schools").doc(school).collection('courses').onSnapshot(function(subject) {
        subject.forEach(function(doc) {
            buildSubjectBlock(school, doc.id, doc.data())
        })
    })
}


function buildSubjectBlock(school, subject, courseDict) {
    var subjectID = subject.replace(/\s+/g, '');

    var courseContainer = document.getElementById(`courses-container-${school}`)

    var courseDiv = document.createElement('div')
    courseDiv.setAttribute('class', 'course-div')
    courseContainer.appendChild(courseDiv)

    var courseHeader = document.createElement('div')
    courseHeader.setAttribute('class', 'course-header')
    courseHeader.addEventListener('click', () => {
        var courseContainer = document.getElementById(`course-container-${subjectID}`)
        if(courseContainer.style.display == 'none') {
            $(`#course-container-${subjectID}`).fadeIn()
        } else {
            $(`#course-container-${subjectID}`).fadeOut()
        }
        
    })
    courseDiv.appendChild(courseHeader)

    var courseHeaderText = document.createElement('div')
    courseHeaderText.setAttribute('class', 'course-header-text')
    courseHeaderText.innerHTML = subject
    courseHeader.appendChild(courseHeaderText)

    var courseChevron = document.createElement('div')
    courseChevron.setAttribute('class', 'course-chevron')
    courseChevron.innerHTML = ''
    courseHeader.appendChild(courseChevron)

    var courseBlockContainer = document.createElement('course-block-container')
    courseBlockContainer.setAttribute('class', 'course-block-container')
    courseBlockContainer.setAttribute('id', `course-container-${subjectID}`)
    courseBlockContainer.style.display = 'none'
    courseDiv.appendChild(courseBlockContainer)

    for ( var course in courseDict ) {
        if (courseDict.hasOwnProperty(course)) {
            var courseBlock = document.createElement('div')
            courseBlock.setAttribute('class', 'course-block')
            courseBlock.setAttribute('id', `${school}-${subject}-${course}`)
            courseBlock.setAttribute('onClick', 'updateTutorForCourse("' +school+ '","'+ subject + '","' + course  + '")')
            for(var tutor in courseDict[course].tutors) {
                if (tutor == globalUserId) {
                    courseBlock.setAttribute('class', 'course-block-selected')
                    courseBlockContainer.style.display = 'flex'
                }
            }
            courseBlock.innerHTML = course 
            courseBlockContainer.appendChild(courseBlock)
        }
    }
}

function updateTutorForCourse(school, subject, course) {
    console.log(school)
    console.log(subject)
    console.log(course)
    userDB.collection('schools').doc(school).collection('courses').doc(subject).get().then(function(doc) {
        const courseInfo = doc.data()

        var isTutor = false

        if (courseInfo[course].tutors != null) {
        	isTutor = courseInfo[course]["tutors"][globalUserId] != null
        }

        if (isTutor) {
            var tutorPath =  course  + '.tutors.' + globalUserId 
            var tutorDict = {}
            tutorDict[tutorPath] = firebase.firestore.FieldValue.delete()
            userDB.collection('schools').doc(school).collection('courses').doc(subject).update( tutorDict ).then(function() {
                var courseBlock = document.getElementById(`${school}-${subject}-${course}`)
                courseBlock.setAttribute('class', 'course-block')
	        })

            var numTutorPath = course + '.info.numTutors' 
            var numTutorDict = {}
            numTutorDict[numTutorPath] = firebase.firestore.FieldValue.increment(-1)
            userDB.collection('schools').doc(school).collection('courses').doc(subject).update( numTutorDict )

        } else {
            var tutorPath = course + '.tutors.' + globalUserId 
            var tutorDict = {}
            tutorDict[tutorPath] = globalUserId
            userDB.collection('schools').doc(school).collection('courses').doc(subject).update( tutorDict ).then(function() {
		        var courseBlock = document.getElementById(`${school}-${subject}-${course}`)
                courseBlock.setAttribute('class', 'course-block-selected')
	        })

            var numTutorPath = course + '.info.numTutors' 
            var numTutorDict = {}
            numTutorDict[numTutorPath] = firebase.firestore.FieldValue.increment(1)
            userDB.collection('schools').doc(school).collection('courses').doc(subject).update( numTutorDict )
        }
    })
}

var allSchoolsArea = document.getElementById('all-schools-area')
var allSchoolsContainer = document.getElementById('all-schools-container')
var addSchoolButton = document.getElementById('add-school-button')
var allSchoolIDs = []

var addSchoolBlock = document.getElementById('add-school-block')
addSchoolBlock.addEventListener('click', () => {
    $('#all-schools-area').fadeIn()
})

//Request School
var requestSchoolButton = document.getElementById('request-school-button')
var addSchoolContainer = document.getElementById('add-school-container')
var requestConfirmation = document.getElementById('request-confirmation')
var addSchoolName = document.getElementById('add-school-name')
var addSchoolCourses = document.getElementById('add-school-courses')
var addSchoolToggle = document.getElementById('add-school-toggle')
var addSchoolCancel = document.getElementById('add-school-cancel')
var addSchoolSubmit = document.getElementById('add-school-submit')
var isNotify

requestSchoolButton.addEventListener('click', () => {
    $('#add-school-container').fadeIn()
})
addSchoolCancel.addEventListener('click', () => {
    $('#add-school-container').fadeOut()
})
addSchoolToggle.addEventListener('click', () => {
    if(isNotify == false) {
        isNotify = true
        addSchoolToggle.setAttribute('class', 'toggle-selected')
    } else {
        isNotify = false
        addSchoolToggle.setAttribute('class', 'toggle')
    }
})

addSchoolSubmit.addEventListener('click', () => {
    var schoolName = addSchoolName.value 
    var courses = addSchoolCourses.value
    
    if(schoolName == '') {
        showErrorMessage("Please enter the school's name")
    } else if (courses == '') {
        showErrorMessage("Please enter what courses you'd like to tutor")
    } else {
        var message = 'School Name: ' + schoolName + ', Courses Message: ' + courses + ' Tutor Info: ' + coreName +', '+coreEmail+', notify: '+isNotify
        sendEmailTo('support@tutortree.com', 'New School Request', message)
        $('#add-school-container').fadeOut(200, () => {
            $('#request-confirmation').fadeIn().delay(5000).fadeOut("slow")
        })
    }
})

//Load Additional Schools
var selectedSchool
var selectedSchoolTitle
function loadNewSchools() {
    isNotify = false
    while(allSchoolsContainer.firstChild) {
        allSchoolsContainer.removeChild(allSchoolsContainer.firstChild)
    }

    //Set initial states
    addSchoolContainer.style.display = 'none'
    requestConfirmation.style.display = 'none'
    addSchoolToggle.setAttribute('class', 'toggle')
    allSchoolsArea.style.display = 'none'
    addSchoolButton.style.display = 'none'

    userDB.collection("schools").get().then(function(schools) {
        schools.forEach(function(doc) {
            allSchoolIDs.push(doc.id)
            var schoolData = doc.data()

            var coursesSchoolButton = document.createElement('div')
            coursesSchoolButton.setAttribute('class', 'courses-school-button')
            coursesSchoolButton.setAttribute('id', `courses-school-button-${doc.id}`)
            coursesSchoolButton.addEventListener('click', () => {
                addSchoolButton.innerHTML = 'Add ' + schoolData.title 
                selectedSchool = doc.id
                selectedSchoolTitle = schoolData.title
                updateSchoolClasses(doc.id)
                $('#add-school-button').fadeIn()
            })
            allSchoolsContainer.appendChild(coursesSchoolButton)

            var coursesSchoolImage = document.createElement('img')
            coursesSchoolImage.setAttribute('class', 'courses-school-image')
            coursesSchoolImage.src = schoolData.icon 
            coursesSchoolButton.appendChild(coursesSchoolImage)

            var coursesSchoolText = document.createElement('div')
            coursesSchoolText.setAttribute('class', 'courses-school-text')
            coursesSchoolText.innerHTML = schoolData.title 
            coursesSchoolButton.appendChild(coursesSchoolText)
        })
    })
}

addSchoolButton.addEventListener('click', () => {
    var schoolDict = {}
    var schoolPath = 'schoolPreferences.' + selectedSchool
    schoolDict[schoolPath] = selectedSchoolTitle
    userDB.collection('userTest').doc(globalUserId).update(schoolDict).then( () => {
        loadUsersSchools()
    })
})

function updateSchoolClasses(school) {
    allSchoolIDs.forEach(function(id) {
        console.log(id)
        var targetElement = document.getElementById(`courses-school-button-${id}`)

        if(id == school) {
            targetElement.setAttribute('class', 'courses-school-button-selected')
        } else {
            targetElement.setAttribute('class', 'courses-school-button')
        }
    })
}
