tutorsNameField = document.getElementById("tutors-name")
tutorsEmailField = document.getElementById("tutors-email")
tutorsPhotoField = document.getElementById("tutors-photo-container")
emailButton = document.getElementById("email-notifications")
smsButton = document.getElementById("sms-notifications")
smsCheckBox = document.getElementById("sms-checkbox")
tutorsBioField = document.getElementById("tutors-bio")
tutorsRateField = document.getElementById("tutors-rate")
tutorsMaxHoursField = document.getElementById("tutors-max-hours")
tutorsBalanceField = document.getElementById("tutors-balance")
upcomingSessions = document.getElementById("upcomingdiv")

var dataRef = database.ref("updateDatabase/users/")
var schoolRef = dataRef.parent


//LOAD UNIVERSITIES AVAILABLE COURSES
function loadAvailableCourses(userId) {
    courseLayoutArea = document.getElementById("course-layout-area")
    yourCoursesArea = document.getElementById("your-courses")
	
    schoolRef.once("value", function(snapshot) {
    console.log(snapshot.val())
    	//set which university
        var tutorsEmail = snapshot.child("users/" + userId + "/email").val()
        var tutorsUniversity = ""
        var universityDict = {
      	    uoregon : "uoregon.edu",
            ucla : "ucla.edu",
            oregonstate : "oregonstate.edu",
            usc : "usc.edu",
            berkeley : "berkeley.edu"
        }
        for (school in universityDict) {
      		if (tutorsEmail.includes(universityDict[school])) {
                tutorsUniversity = school
                console.log("current users university: " + tutorsUniversity)
			}}
      
        //create new blocks for each course
        for(subject in snapshot.child(tutorsUniversity).val()) {
	    var isTutorRegistered = false
      	    var subjectBlock = document.createElement('div')
            var subjectHeader = document.createElement("h2")
            subjectBlock.setAttribute('class', 'course-container')
            subjectBlock.setAttribute('id', subject)
            subjectHeader.setAttribute('class', 'subject-heading')
            subjectHeader.innerText = subject
            subjectBlock.appendChild(subjectHeader)
          
            for(course in snapshot.child(tutorsUniversity+"/"+subject).val()) {
          	//var subjectBlock = document.getElementById(subject)
                var courseButton = document.createElement('button')
                courseButton.setAttribute('id', subject+'-'+course)
                courseButton.setAttribute('onClick', 'userDidRegisterForCourse("'+tutorsUniversity+'","'+subject+'","'+course+'","'+userId+'")')
                courseButton.setAttribute('class', 'course-button w-button')
                courseButton.innerHTML = course
              
                var tutorCount = 0
                courseButton.setAttribute('registered',false)
                for(tutor in snapshot.child(tutorsUniversity+"/"+subject+"/"+course+"/tutors").val()) {
              		if(userId == tutor){
			isTutorRegistered = true
                  	courseButton.setAttribute('registered', true)
                    	courseButton.style.backgroundColor = "#295A53"
                    }
              		tutorCount++
                }
		
                var tutorLabel = document.createElement('p')
                tutorLabel.innerText =tutorCount + " tutors"
                tutorLabel.setAttribute('class', 'tutor-label')
                courseButton.appendChild(tutorLabel)
                subjectBlock.appendChild(courseButton)
                tutorCount = 0
	    
        }
	if (isTutorRegistered){
		yourCoursesArea.appendChild(subjectBlock)
	} else {
		courseLayoutArea.appendChild(subjectBlock)  
	}
   
      }
    })

}
// LOAD UPCOMING SESSIONS
function loadUpcomingSessions(userID) {
dataRef.once("value", function(snapshot) {
    var currentTime = Math.round((new Date()).getTime() / 1000);
    var hasUpcoming = false
    var hasPending = false
    var upcomingSection = document.getElementById('upcoming-section')
    var pendingSection = document.getElementById('pending-section')
    
    for (sessionId in snapshot.child(userId+"/sessions").val()) {
    	if(snapshot.child(userId+"/sessions/"+sessionId+"/start").val() > currentTime){
	console.log(sessionId)
      	hasUpcoming = true
		
	//Create elements
        var upcomingBlock = document.createElement("div")
	var studentContainer = document.createElement("div")
	var studentImage = document.createElement("img")
	var headerAndDate = document.createElement("div")
	var pendingContainer = document.createElement("div")
        var upcomingStudent = document.createElement("h3")
        var upcomingCourse = document.createElement("button")
	var pendingButton = document.createElement("button")
	var rescheduleButton = document.createElement("button")
        var upcomingDate = document.createElement("h4")
        var studentId = snapshot.child(userId+"/sessions/"+sessionId+'/other').val()
        var isPending = snapshot.child(userId+"/sessions/"+sessionId+'/status').val()
	
        //TIME FORMATTING
        var startTimeEpoch = snapshot.child(userId+'/sessions/'+sessionId+'/start').val()
        var endTimeEpoch = snapshot.child(userId+'/sessions/'+sessionId+'/end').val()
        var startTime = new Date(startTimeEpoch*1000)
        var endTime = new Date(endTimeEpoch*1000)
        var startDayandHour = startTime.toLocaleDateString("en-US", {weekday:'long',
        		hour: 'numeric', minute:'numeric'})
	var getEndMinutes = endTime.getMinutes()
	var endMinutes = "00"
	if (getEndMinutes > 0) {
		endMinutes = getEndMinutes
	}
        var endHour = ((endTime.getHours() + 24) % 12 || 12) +":"+ endMinutes
        
	//Set Webflow classes and Id's
        upcomingCourse.setAttribute('class', 'upcoming-course confirmed-session w-button')
	studentContainer.setAttribute('class', 'student-container')
	studentImage.setAttribute('class', 'students-image')
	headerAndDate.setAttribute('class', 'header-and-date')
	pendingContainer.setAttribute('class', 'pending-and-course')
        upcomingBlock.setAttribute('class', 'upcoming-block '+sessionId+'')
	upcomingBlock.setAttribute('id', startTimeEpoch)
        upcomingStudent.setAttribute('class', 'upcoming-header')
	pendingButton.setAttribute('class', 'pending-course pending-session w-button')
	rescheduleButton.setAttribute('class', 'reschedule-button w-button')
	rescheduleButton.setAttribute('onClick', 'initializeReschedule("'+userId+'","'+sessionId+'")')
        upcomingDate.setAttribute('class', 'date-and-time')
        
	//Data assignment
        upcomingStudent.innerHTML = snapshot.child(studentId+'/name/').val()
        upcomingCourse.innerHTML = snapshot.child(userId+'/sessions/'+sessionId+'/course').val()
        upcomingDate.innerHTML = startDayandHour+ " until "+ endHour
	if (snapshot.child(studentId+'/profileURL/').val().length > 100) {
		studentImage.src =  snapshot.child(studentId+'/profileURL/').val()
	} else {	
		studentImage.src = snapshot.child('XwbsnUHFYOZabc8IwGybfELFqKC2/profileURL/').val()
	}
	
	//Build the Block
	headerAndDate.appendChild(upcomingStudent)
	headerAndDate.appendChild(upcomingDate)
	pendingContainer.appendChild(upcomingCourse)
	headerAndDate.appendChild(pendingContainer)
	studentContainer.appendChild(studentImage)
	studentContainer.appendChild(headerAndDate)
	upcomingBlock.appendChild(studentContainer)
 	
	if (isPending == 1) {
		upcomingSection.appendChild(upcomingBlock)
		rescheduleButton.innerHTML = "RESCHEDULE"
		pendingContainer.appendChild(rescheduleButton)
		updateUpcomingArray(startTimeEpoch)
	} else {
		hasPending = true
		pendingButton.innerHTML = "PENDING"
		pendingButton.setAttribute("onClick", "userConfirmedSession('"+userId+"','"+sessionId+"')")
		pendingButton.setAttribute('id', sessionId+"-button")
		pendingContainer.appendChild(pendingButton)
		pendingContainer.setAttribute('id', sessionId+"-container")
        	pendingSection.appendChild(upcomingBlock)
		
	}
        }
      }
	
      appendToUpcoming()
	
      if (hasUpcoming == false) {
            upcomingSection.innerHTML = "No upcoming sessions"
        }
      if (hasPending == false) {
            pendingSection.innerHTML = "No pending sessions"
        }
    })

}

//ASSIGNMENT VARS FOR RESCHEDULING
var daySeconds = 0
var startSeconds = 0
var endSeconds = 0

//Get references to each day button
var firstDay = document.getElementById("day1")
var secondDay = document.getElementById("day2")
var thirdDay = document.getElementById("day3")
var fourthDay = document.getElementById("day4")
var fifthDay = document.getElementById("day5")
var sixthDay = document.getElementById("day6")
var seventhDay = document.getElementById("day7")

// Add attributes to day buttons
firstDay.setAttribute("onClick", "updateFromDayButton(0)")
secondDay.setAttribute("onClick", "updateFromDayButton(1)")
thirdDay.setAttribute("onClick", "updateFromDayButton(2)")
fourthDay.setAttribute("onClick", "updateFromDayButton(3)")
fifthDay.setAttribute("onClick", "updateFromDayButton(4)")
sixthDay.setAttribute("onClick", "updateFromDayButton(5)")
seventhDay.setAttribute("onClick", "updateFromDayButton(6)")

//Get references to time slots
var startHour = document.getElementById("start-hour")
var startMinute = document.getElementById("start-minute")
var endHour = document.getElementById("end-hour")
var endMinute = document.getElementById("end-minute")

//Initialize Arrays
var dayButtonArray = [firstDay, secondDay, thirdDay, fourthDay, fifthDay, sixthDay, seventhDay]
var dayArray = ["day1","day2","day3","day4","day5","day6","day7"]
var monthArray = ["month1","month2","month3","month4","month5","month6","month7"]
var weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

var allSessions = document.querySelectorAll(".reschedule-button")
allSessions.forEach(element => element.setAttribute("onClick", "initializeReschedule()"))

var modalWrapper = document.getElementById("reschedule-wrapper")
var confirmRescheduleButton = document.getElementById("confirm-reschedule")



//LOAD TUTORS PROFILE
var tutorsBalanceButton = document.getElementById("tutors-balance-button")
function loadTutorProfile(userId) {
    var tutorRef = dataRef.child(userId)
	
    	tutorRef.once("value", function(snapshot) {
	var createPhoto = document.createElement("img")
	createPhoto.setAttribute('class', 'profile-image')
	createPhoto.src = snapshot.child("/profileURL/").val()
        tutorsPhotoField.appendChild(createPhoto)
	})
	
	tutorRef.on("value", function(snapshot) {
        //SET FIELDS
        console.log(snapshot.val())
        tutorsEmailField.value = snapshot.child("email").val()
        tutorsNameField.value = snapshot.child("name").val()
        tutorsBioField.value = snapshot.child("bio").val()
        tutorsRateField.value = snapshot.child("PPH").val()
        tutorsMaxHoursField.value = snapshot.child("MAX").val()
		
	//UPDATE SESSIONS, AVERAGE, AND HOURLY LABELS
	var sessionsLabel = document.getElementById("sessions-label")
	var averageLabel = document.getElementById("average-label")
	var hourlyLabel = document.getElementById("hourly-label")
	
	var sessionCount = 0
	var averageScore = 0
	var averageCount = 0

	for (sessionId in snapshot.child("/sessions").val()) {
		sessionCount++
	}
	for (ratingId in snapshot.child("/ratings/").val()) {
	     if (ratingId.length == 8) {
		
		averageScore += snapshot.child("/ratings/"+ratingId).val()
		averageCount++
		}
	}
	sessionsLabel.innerHTML = sessionCount
	averageLabel.innerHTML = (averageScore/averageCount).toFixed(2)
	hourlyLabel.innerHTML = "$" + parseFloat(tutorsRateField.value)*2
	
	
		
        //CALCULATE CURRENT BALANCE
        var totalIncome = 0
        var totalSpending = 0
        var currentBalance = 0
        for(incomeId in snapshot.child("income").val()) {
            amountString = snapshot.child("income/"+incomeId+"/amount").val()
            totalIncome += parseFloat(amountString)
        }
        for(spendingId in snapshot.child("spending").val()) {
            spendingString = snapshot.child("spending/"+spendingId+"/amount").val()
            totalSpending += parseFloat(spendingString)
            if(snapshot.child("spending/"+spendingId+"/usedBalance").val()=="0"){
                totalSpending -=parseFloat(spendingString)
            }
        }
        currentBalance = totalIncome - totalSpending
        tutorsBalanceButton.innerHTML = "$" + currentBalance.toFixed(2) + " Withdraw Balance"
        //WITHDRAW BALANCE BUTTON
    	var withdrawButton = document.getElementById('withdraw-balance')
    	withdrawButton.setAttribute('onClick', 'venmoWithdrawal("'+userId+'","'+currentBalance+'")')
          
        //UPDATE NOTIFICATIONS
        var emailNotifications = snapshot.child("emailNotifications").val()
	emailButton.setAttribute('onClick', 'updateUserEmail("' + userId + '")')
        if (emailNotifications) {
		emailButton.innerHTML = "ON"
		emailButton.style.backgroundColor = "#EC7764"
	} else {
		emailButton.innerHTML = "OFF"
		emailButton.style.backgroundColor = "#ADDCCB"
	}
	var smsNotifications = snapshot.child("smsNotifications").val()
	smsButton.setAttribute('onClick', 'updateUserSMS("' + userId + '")')
	if (smsNotifications) {
		smsButton.innerHTML = "ON"
		smsButton.style.backgroundColor = "#EC7764"
	} else {
		smsButton.innerHTML = "OFF"
		smsButton.style.backgroundColor = "#ADDCCB"
	}
        
          
    }, function (error) {
        console.log("Error: " + error.code);
    });
      
    //UPDATE PROFILE BUTTON
    var updateProfile = document.getElementById('update-profile')
    updateProfile.setAttribute('onClick', 'userDidUpdateProfile("'+userId+'")')

}

//AVAILABILITY AND ASSOCIATED FUNCTIONS
var availabilityArray = []
var mondayArray = new Array(48)
var tuesdayArray = new Array(48)
var wednesdayArray = new Array(48)
var thursdayArray = new Array(48)
var fridayArray = new Array(48)
var saturdayArray = new Array(48)
var sundayArray = new Array(48)
var weekdayArray = [mondayArray, tuesdayArray, wednesdayArray, thursdayArray,
										fridayArray, saturdayArray, sundayArray]
                    
// Initialize all arrays from firebase 
function availabilityInit(userId) {
	availRef = dataRef.child(userId+'/availability/')
  availRef.once("value", function(snapshot) {
    for( i=0; i<7; i++) {
        var decimalAvailability = snapshot.child(i).val()
        var binaryAvailability = convertToHexFromBinary(decimalAvailability)
        availabilityArray.push(decimalAvailability)
        weekdayArray[i] = binaryAvailability.split("")
     }
     initializeButtons(0, userId)
     initializeButtons(1, userId)
     initializeButtons(2, userId)
     initializeButtons(3, userId)
     initializeButtons(4, userId)
     initializeButtons(5, userId)
     initializeButtons(6, userId)
	})
}

//Set buttons backgrounds and define their onlick functions
function initializeButtons(day, userId) {
		var dayArrayBinary = weekdayArray[day]
		for( i = 0; i < weekdayArray[day].length; i++) {
    		var id = day+"-"+i
        var getButton = document.getElementById(id)
				try {
        		getButton.setAttribute('onClick', 'updateDayArray("'+day+'","'+i+'","'+userId+'")')
    				if(weekdayArray[day][i] == 1) {
        				getButton.style.backgroundColor = "#2D3C61"
        		}
        } catch {console.log("no button exists with id: "+id)}
    }
}

//Onlick function for each button
function updateDayArray(dayString, timeSlotString, userId) {
		var day = parseFloat(dayString)
    var timeSlot = parseFloat(timeSlotString)
    var buttonId = day + "-" + timeSlot
    var getButtonById = document.getElementById(buttonId)
		var dayArray = weekdayArray[day]
		var tutorsAvailabilityRef = dataRef.child(userId+'/availability/')
		var updateAvaDict = {}
    
    if (parseFloat(dayArray[timeSlot]) == 0) {
    		dayArray[timeSlot] = "1"
        console.log(dayArray)
        getButtonById.style.backgroundColor = "#2D3C61"
        
        updateAvaDict[dayString] = getHexFromBinaryArray(dayArray)
        tutorsAvailabilityRef.update(updateAvaDict)

		} else if (parseFloat(dayArray[timeSlot]) == 1) {
    		dayArray[timeSlot] = "0"
        console.log(dayArray)
        getButtonById.style.backgroundColor = "#F8F8F4"
        
        updateAvaDict[dayString] = getHexFromBinaryArray(dayArray)
        tutorsAvailabilityRef.update(updateAvaDict)
    }
}

function getHexFromBinaryArray(binaryArray) {
			var binaryString = binaryArray.join('')
			console.log(binaryString)
      var decimalString = parseInt(binaryString, 2)
      var firebaseDecimal = decimalString * 65536
      return( firebaseDecimal ) 
}

function convertToHexFromBinary(hexVal) {
		var binaryVal48 = twosComplement(hexVal, 64).slice(0,48)
		return binaryVal48
}
//Helper functions to get twos complement of any hex value
function twosComplement(value, bitCount) {
  let binaryStr;
  
  if (value >= 0) {
    let twosComp = value.toString(2);
    binaryStr    = padAndChop(twosComp, '0', (bitCount || twosComp.length));
  } else {
    binaryStr = (Math.pow(2, bitCount) + value).toString(2);
    
    if (Number(binaryStr) < 0) {
      return undefined
    }
  }
  return binaryStr;
}
function padAndChop(str, padChar, length) {
  return (Array(length).fill(padChar).join('') + str).slice(length*-1);
}

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
    
    var updatedBlock = document.getElementsByClassName("upcoming-block "+sessionID)
    //upcomingSection.appendChild(updatedBlock)
    
    //removeAllFromUpcoming()
    updateUpcomingArray(updatedBlock.id)
    appendToUpcoming()
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

//ASSOCIATED SORT UPCOMING FUNCTIONS
var upcomingArray = []
function updateUpcomingArray(timestamp) {
		upcomingArray.push(timestamp)
    upcomingArray.sort(sortNumber)
}
function sortNumber(a,b) {
	return(a-b)
}
function appendToUpcoming() {
		var items = upcomingArray.length
    var upcomingSection = document.getElementById('upcoming-section-1')
		for( i=0 ; i < items ; i++ ) {
    		var timestampID = upcomingArray[i]
    		var upcomingBlock = document.getElementById(timestampID)
        console.log(timestampID)
        upcomingSection.appendChild(upcomingBlock)
    }
}

//ASSOCIATED RESCHEDULEING FUNCTIONS
function initializeReschedule(userId,sessionId) {
		firstDay.innerHTML = "Today"
		for ( i = 1; i < 7; i++){
    		var dayFromSeconds = new Date(getSecondsFromEpoch(i))
    		var getDay = dayFromSeconds.getDay()
    		dayButtonArray[i].innerHTML = weekDays[getDay]
    }
    for( i = 0; i < 7; i++) {
    		var dayAndMonth = formatMonthAndDayFromEpoch(i)
        document.getElementById(monthArray[i]).innerHTML = dayAndMonth
    }
    modalWrapper.style.display = "flex"
    confirmRescheduleButton.removeAttribute("onClick")
		confirmRescheduleButton.setAttribute("onClick", "reschedule('"+userId+"','"+sessionId+"')")
    
}	
function formatMonthAndDayFromEpoch(day) {
		var todaysEpoch = new Date()
    todaysEpoch.setHours(0,0,0,0)
    var secondsToAdd = 86400*day
    var todaysSeconds = todaysEpoch.getTime()/1000
    var daySeconds = todaysSeconds+secondsToAdd
    
    var whichDay = new Date(daySeconds*1000)
    var monthString = whichDay.getMonth()+1
    var dayString = whichDay.getDate()
    var formattedString =  monthString + "/" + dayString
    return ( formattedString )
}

function getSecondsFromEpoch(day) {
		var todaysEpoch = new Date()
    todaysEpoch.setHours(0,0,0,0)
    var secondsToAdd = 86400*day
    var todaysSeconds = todaysEpoch.getTime()/1000
    var daySeconds = todaysSeconds+secondsToAdd
    
    var outputSeconds = daySeconds*1000
    return(outputSeconds)
}


function updateFromDayButton(day) {	
		var clickedDay = dayButtonArray[day]
    clickedDay.style.backgroundColor = "#EC7764"
    for ( i = 0; i < 7; i++){
    		if (i != day) {
        		dayButtonArray[i].style.backgroundColor = "#7EC9E7"
        }
    }
    
    daySeconds = getSecondsFromEpoch(day)
    console.log("Epoch Midnight: " +daySeconds)
}

function outputSecondsFromHour(value) {
		var secondsFromMidnight = value*3600*1000
    return(secondsFromMidnight)
}

function outputSecondsFromMinute(value) {
		return(value*60*1000)
}


function reschedule(userId,sessionId) {
		//Get start and end epoch's
		var getStartHour = outputSecondsFromHour(startHour.value)
    var getStartMinute = outputSecondsFromMinute(startMinute.value)
    startSeconds = getStartHour + getStartMinute
    var getEndHour = outputSecondsFromHour(endHour.value)
    var getEndMinutes = outputSecondsFromMinute(endMinute.value)
    endSeconds = getEndHour + getEndMinutes
    
		var startEpoch = daySeconds + startSeconds
    var endEpoch = daySeconds + endSeconds
    
    var sessionRef = dataRef.child('/'+userId+'/')
    
    var startEpochSeconds = startEpoch/1000
    var endEpochSeconds = endEpoch/1000
    
    		
    var updateStartDict = {start:startEpochSeconds}
    var updateEndDict = {end:endEpochSeconds}
   	sessionRef.child('/sessions/'+sessionId).update(updateStartDict)
    sessionRef.child('/sessions/'+sessionId).update(updateEndDict)
   
    location.reload()
}
