//Helper Functions ___________________________________________________________________________________________________________
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
