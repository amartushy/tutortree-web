//Onclick to update course registrations
function userDidRegisterForCourse(tutorsUniversity, subject, course, userId) {
    var currentButton = document.getElementById(subject+'-'+course)
    var registered = currentButton.getAttribute('registered')
    var tutorsCourseRef = dataRef.child('/'+userId+'/courses/')
    var schoolTutorsRef = dataRef.parent.child('/'+tutorsUniversity+'/'+
                                            '/'+subject+'/'+course+'/tutors/')
    var keyString = subject+':'+course

    if(registered === "true"){
        currentButton.setAttribute('registered', false)
        currentButton.style.backgroundColor = '#ADDCCB'
        tutorsCourseRef.child(subject+":"+course).remove()
        schoolTutorsRef.child(userId).remove()
    
    } else if(registered === "false") {
        currentButton.setAttribute('registered', true)
        currentButton.style.backgroundColor = '#295A53'
        var addCourseDict = {}
        var addTutorDict = {}
        addCourseDict[subject+":"+course] = keyString
        addTutorDict[userId] = userId
        tutorsCourseRef.update(addCourseDict)
    
        schoolTutorsRef.once('value', function(snapshot) {
            var schoolAndSubject = snapshot.val()
            console.log(schoolAndSubject)
            if (schoolAndSubject === null) {
                schoolTutorsRef.update(addTutorDict)
            } else {
                schoolTutorsRef.update(addTutorDict)
            }
        })
    
    } else {
        console.log("ERROR: no registration value")
    }
}

//Update database with new basic profile information
function userDidUpdateProfile(userId) {
    var newName = tutorsNameField.value
    var newMaxHours = tutorsMaxHoursField.value
    var newRate = Math.round(tutorsRateField.value)
    var newBio = tutorsBioField.value
    
    console.log("tutors new name: " + newName)
    console.log("tutors new hours: " + newMaxHours)
    console.log("tutors new rate: " + newRate)
    console.log("tutors new bio: " + newBio)
    var tutorsRef = dataRef.child(userId).update(
    		{'name':newName,
        'MAX':newMaxHours,
        'PPH':newRate,
        'bio':newBio,
        })
}

//WITHDRAW PARTIAL BALANCE FUNCTION
function venmoWithdrawal(userId, balance) {
		var amountToWithdraw = document.getElementById('amount-to-withdraw')
  	var venmoUsername = document.getElementById('venmo-username')
    var spendingId = create8CharID()
    var currentTime = Date.now()/1000
    var pending = 0
    var withdrawDict = {
    		'amount' : amountToWithdraw.value,
        'numberDate' : currentTime,
        'status' : pending,
        'type' : 'Withdrawal',
        'uid' : userId,
        'venmo' : venmoUsername.value
    		}
    var spendingDict = { }
    spendingDict[spendingId] = withdrawDict
    var spendingRef = dataRef.child('/'+userId+'/spending/')
  	var withdrawRef = database.ref('updateDatabase/withdrawals/')
    
    if((parseFloat(withdrawDict['amount']) > 0) && (parseFloat(withdrawDict['amount']) < balance) ) {
    		amountToWithdraw.value = ''
    		venmoUsername.value = ''
        console.log(spendingId)
        spendingRef.update(spendingDict)
        withdrawRef.update(spendingDict)
        alert("Thank you for your withdrawal! Please allow 24 hours for processing.")
    } else {
    		alert("Sorry, there was an error. There are either insufficent funds or the amount type is invalid.")
    }
    
    console.log(withdrawDict)
}
//HELPER FUNCITON TO CREATE SPENDING ID
function create8CharID() {
		var result =''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var charactersLength = characters.length
    
    for (i = 0; i < 8; i++) {
    		result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

//CONFIRM PENDING SESSION
function userConfirmedSession(userId, sessionID) {
		var sessionRef = dataRef.child(userId+"/sessions/"+sessionID)
    console.log(sessionRef)
    sessionRef.update( {status:1} )
    dataRef.once("value", function(snapshot) {
    var studentsId = snapshot.child(userId+"/sessions/"+sessionID+'/other/').val()
    var tutorsName = snapshot.child(userId+'/name/').val()
    var startTimeEpoch = snapshot.child(userId+'/sessions/'+sessionID+'/start').val()
    var dateAndTime = convertEpochTime(startTimeEpoch)
    
    
    if(snapshot.child(studentsId+'/smsNotifications/').val() == true) {
    		var studentsNumber = snapshot.child(studentsId+'/phone/').val()
        var sendMessage = "Booking Confirmed%0A"+tutorsName+ " has confirmed your session on "+dateAndTime
    		sendSMSTo(studentsNumber,sendMessage)
    } 
    if(snapshot.child(studentsId+'/emailNotifications/').val() == true) {
    		var studentsEmail = snapshot.child(studentsId+'/email/').val()
        var emailMessage = tutorsName+ " has confirmed your session on "+dateAndTime
        sendEmailTo(studentsEmail,sendMessage)
    }
    if(snapshot.child(studentsId+'/pushNotifications/').val() == true) {
    		var studentsToken = snapshot.child(studentsId+'/token/').val()
        var pushMessage = tutorsName+ " has confirmed your session on "+dateAndTime
        sendPushTo(studentsToken,pushMessage)
    }
    })
    var upcomingSection = document.getElementById('upcoming-section')
    var pendingContainer = document.getElementById(sessionID+"-container")
    var pendingButton = document.getElementById(sessionID+"-button")
    var updatedBlock = document.getElementById(sessionID)
    upcomingSection.appendChild(updatedBlock)
    pendingContainer.removeChild(pendingButton)
    
}

//HELPER FUNCTION TO CONVERT TIME
function convertEpochTime(startEpoch) {
  var startTime = new Date(startEpoch*1000)
  var startDayandMonth = startTime.toLocaleDateString("en-US",{weekday:'long',
  hour:'numeric', minute:'numeric', month:'long',day:'numeric',})
	var output = String(startDayandMonth).split(", ")
  var sendMessage = output[0] + ", " + output[1] +" at "+ output[2]
  
  return(sendMessage)
}

//NOTIFICATIONS PUSH FUNCTIONS
function sendSMSTo(number, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree-development.herokuapp.com/sendSMSTo/+1"+number+"/"+message
		xhttp.open("GET", herokuURL, true);
		xhttp.send();
}
function sendPushTo(token, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree-development.herokuapp.com/sendNotification/Booking%20Confirmed"+"/"+message+"/"+token+"/1"
    xhttp.open("GET", herokuURL, true);
		xhttp.send();
}
function sendEmailTo(email, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree-development.herokuapp.com/sendEmailTo/"+email+"/Booking%20Confirmed/"+message
    console.log(herokuURL)
		xhttp.open("GET", herokuURL, true);
		xhttp.send();
}


//UPDATE EMAIL NOTIFICATIONS
function updateUserEmail() {
	var emailRef = dataRef.child(userId)
 	var emailButton = document.getElementById("email-notifications")
  
    emailRef.once("value", function(snapshot) {
    		console.log(snapshot.child('emailNotifications/').val())
    		if (snapshot.child('emailNotifications/').val() == true) {
        		emailRef.update( {emailNotifications : false} )
            emailButton.innerHTML = "OFF"
            emailButton.style.backgroundColor = "#EC7764"
            
        } else {
        		emailRef.update( {emailNotifications : true} )
            emailButton.innerHTML = "ON "
            emailButton.style.backgroundColor = "#ADDCCB"
        }
    })
}

//UPDATE SMS NOTIFICATIONS
function updateUserSMS() {
	var smsRef = dataRef.child(userId)
 	var smsButton = document.getElementById("sms-notifications")
  
    smsRef.once("value", function(snapshot) {
    		if (snapshot.child('smsNotifications/').val() == true) {
        		smsRef.update( {emailNotifications : false} )
            smsButton.innerHTML = "OFF"
            smsButton.style.backgroundColor = "#EC7764"
            
        } else {
        		smsRef.update( {emailNotifications : true} )
            smsButton.innerHTML = "ON "
            smsButton.style.backgroundColor = "#ADDCCB"
        }
    })
}


