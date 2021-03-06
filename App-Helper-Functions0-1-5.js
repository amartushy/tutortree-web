//Helper Functions ___________________________________________________________________________________________________________
function loadAuthHeader() {
    document.getElementById("home").addEventListener('click', () => {
        location.href = "https://app-tutortree.webflow.io/app-home"
    })
    
    document.getElementById("messages").addEventListener('click', () => {
        location.href = "https://app-tutortree.webflow.io/messages"
    })
    
    document.getElementById("sessions").addEventListener('click', () => {
        location.href = "https://app-tutortree.webflow.io/sessions"
    })
    
    document.getElementById("profile").addEventListener('click', () => {
        location.href = "https://app-tutortree.webflow.io/user-profile"
    })
}

function loadNonAuthHeader() {
    document.getElementById("non-auth-log-in").addEventListener('click', () => {
        location.href = "https://app-tutortree.webflow.io/login"
    })
    document.getElementById("non-auth-create-account").addEventListener('click', () => {
        //no page yet
    })
    document.getElementById("non-auth-home").addEventListener('click', () => {
        location.href = "https://app-tutortree.webflow.io/"
    })
}

async function getRatingForUser(ID) {
    var rating = 0

    await userDB.collection('userTest').doc(ID).collection('sessions').get().then(function(session) {
        var ratingSum = 0
        var sessionsWithRating = 0

        session.forEach(function(doc) {
            if(doc.data().ratingFromOtherUser != null) {
                ratingSum += doc.data().ratingFromOtherUser
                sessionsWithRating += 1
                rating = ratingSum / sessionsWithRating
            }
        })
    })

    if (rating == 0) {
        return ('NEW')
    } else {
        return rating.toFixed(2)
    }
}

async function getCountOfSessions(ID) {
    var sessions = 0

    await userDB.collection('userTest').doc(ID).collection('sessions').get().then(function(session) {

        session.forEach(function(doc) {
            sessions += 1
        })
    })

    if (sessions == 0) {
        return ('NEW')
    } else {
        return sessions
    }
}

async function getSchoolName(school) {
    var schoolTitle = ''

    await userDB.collection('schools').doc(school).get().then(function(doc) {
        schoolTitle = doc.data().title 
    })

    return schoolTitle
}

async function getSchoolImage(school) {
    var schoolIcon = ''

    await userDB.collection('schools').doc(school).get().then(function(doc) {
        schoolIcon = doc.data().icon 
    })

    return schoolIcon
}

function getFormattedDate(timeEpoch) {
    var time = parseFloat(timeEpoch)
    var d = new Date(0);
    d.setUTCSeconds(time);
  
    var dayLong = d.toLocaleDateString("en-US", {weekday: "long"}); 
    var month = d.toLocaleDateString("en-US", {month: "short"});
    var dayInt = d.toLocaleDateString("en-US", {day: "numeric"});

    var suffix
    if (dayInt == 1 || dayInt == 21 ||dayInt == 31) {
        suffix = "st"
    } else if( dayInt == 2 || dayInt == 22) {
        suffix = "nd"
    } else if (dayInt == 3 || dayInt == 23) {
        suffix = "rd"
    } else {
        suffix = "th"
    }
    dayWithSuffix = dayInt + suffix
    var dateObject = [dayLong, month, dayWithSuffix]
    return (dateObject)
}

function getFormattedTime(startEpoch, endEpoch) {
    console.log(startEpoch)
    var start = parseFloat(startEpoch)
    var end = parseFloat(endEpoch)
    var startTime = new Date(start*1000)
    var endTime = new Date(end*1000)

    var startHour = startTime.getHours()
    var endHour = endTime.getHours()
    var startAMPM = "am"
    var endAMPM = "am"
    if (startHour > 12) {
        startHour = startHour - 12
        startAMPM = "pm"
    }
    if (endHour > 12) {
        endHour = endHour - 12
        endAMPM = "pm"
    }

    var startMinutes = "00"
    var endMinutes = "00"
    if (startTime.getMinutes() >  0) {
        startMinutes = startTime.getMinutes()
    }
    if (endTime.getMinutes() > 0) {
        endMinutes = endTime.getMinutes()
    }
    startString = startHour + ":" + startMinutes + startAMPM
    endString = endHour + ":" + endMinutes + endAMPM

    var timeObject = [startString, endString]
    return(timeObject)
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


function createTransactionID(){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 8; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function showErrorMessage(message) {
    var errorMessageDiv = document.getElementById('error-message')
    errorMessageDiv.innerHTML = message

    $('#error-message').fadeIn().delay(5000).fadeOut("slow")
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

function getFirstName(fullName) {
    let nameArray = fullName.split(" ")
    let firstName = nameArray[0]
    return firstName
}


//NOTIFICATIONS PUSH FUNCTIONS
function sendSMSTo(number, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree2.herokuapp.com/sendSMSTo/+1"+number+"/"+message
		xhttp.open("GET", herokuURL, true);
		xhttp.send();
}
function sendPushTo(token, title, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree2.herokuapp.com/sendNotification/"+title+"/"+message+"/"+token+"/1"
    xhttp.open("GET", herokuURL, true);
		xhttp.send();
}
function sendEmailTo(email, title, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree2.herokuapp.com/sendEmailTo/"+email+"/"+title+"/"+message
		xhttp.open("GET", herokuURL, true);
		xhttp.send();
}
function sendReceiptTo(transactionID, amount, email) {
    var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree2.herokuapp.com/sendReceiptTo/"+transactionID+"/"+amount+"/"+email
    xhttp.open("GET", herokuURL, true);
    xhttp.send();
}  
function sendRefund(ID) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree2.herokuapp.com/refund/"+ID
		xhttp.open("GET", herokuURL, true);
		xhttp.send();
}
