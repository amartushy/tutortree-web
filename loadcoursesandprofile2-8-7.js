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
	    var courseButtonSection = document.createElement('div')
            var subjectHeader = document.createElement("h3")
	    
            subjectBlock.setAttribute('class', 'course-container')
            subjectBlock.setAttribute('id', subject)
		//new:
	    courseButtonSection.setAttribute('class', 'course-button-section')
            subjectHeader.setAttribute('class', 'subject-heading')
            subjectHeader.innerText = subject
            subjectBlock.appendChild(subjectHeader)
	    subjectBlock.appendChild(courseButtonSection)
          
            for(course in snapshot.child(tutorsUniversity+"/"+subject).val()) {
          	//var subjectBlock = document.getElementById(subject)
		var courseContainer = document.createElement("div")
                var courseButton = document.createElement('button')
		courseContainer.setAttribute('class', 'course-button-container')
                courseButton.setAttribute('id', subject+'-'+course)
                courseButton.setAttribute('onClick', 'userDidRegisterForCourse("'+tutorsUniversity+'","'+subject+'","'+course+'","'+userId+'")')
                courseButton.setAttribute('class', 'new-course-button w-button')
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
                tutorLabel.innerText = tutorCount + " tutors"
                tutorLabel.setAttribute('class', 'tutor-label')
		    
		courseButtonSection.appendChild(courseContainer)
		courseContainer.appendChild(courseButton)
		courseContainer.appendChild(tutorLabel)

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

function sortNumber(a,b) {
	return(a-b)
}

var upcomingArray = []
function updateUpcomingArray(timestamp) {
		upcomingArray.push(timestamp)
    upcomingArray.sort(sortNumber)
}

// LOAD UPCOMING SESSIONS
function loadUpcomingSessions(userID) {
dataRef.once("value", function(snapshot) {
    //var currentTime = Math.round((new Date()).getTime() / 1000);
    var todaysEpoch = new Date()
    var currentTime = todaysEpoch.setHours(0,0,0,0)/1000
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
	var cancelButton = document.createElement("button")
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
	cancelButton.setAttribute('class', 'cancel-session-button cancel-session w-button')
	rescheduleButton.setAttribute('class', 'reschedule-button w-button')
	rescheduleButton.setAttribute('onClick', 'initializeReschedule("'+userId+'","'+sessionId+'")')
	cancelButton.setAttribute("onClick", "userCanceledSession('"+userId+"', '"+sessionId+"')")
	
	cancelButton.setAttribute('id', sessionId+"cancel-button")
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
 	
	//Create Zoom input element
	var zoomForm = document.createElement("FORM")
	zoomForm.setAttribute("class", "zoom-form")
		
	var zoomContainerForm = document.createElement("FORM")
	zoomContainerForm.setAttribute("class", "zoom-container-form")
	zoomForm.appendChild(zoomContainerForm)
		
	var zoomLogoAndUpdate = document.createElement("div")
	zoomLogoAndUpdate.setAttribute("class", "zoom-logo-and-update")
	zoomContainerForm.appendChild(zoomLogoAndUpdate)
		
	var zoomLogo = document.createElement("img")
	zoomLogo.setAttribute("class", "zoom-logo")
	zoomLogoAndUpdate.appendChild(zoomLogo)	
	zoomLogo.src = snapshot.child('M7nAacU7kANeklFALvsvkLGsbrp1/profileURL/').val()	
		
	var updateIdButton = document.createElement("div")
	updateIdButton.setAttribute("class", "update-id-button")
	zoomLogoAndUpdate.appendChild(updateIdButton)
	updateIdButton.setAttribute("onClick", "updateZoomCredentials('"+sessionId+"','"+studentId+"','"+userId+"')")
	updateIdButton.style.display = 'none'
	updateIdButton.innerHTML = "Update ID's"
		
	var zoomIdBlock = document.createElement("div")
	zoomIdBlock.setAttribute("class", "zoom-id-block")
	zoomContainerForm.appendChild(zoomIdBlock)
		
	var meetingIdBlock = document.createElement("div")
	meetingIdBlock.setAttribute("class", "meeting-id-block")
	zoomIdBlock.appendChild(meetingIdBlock)
		
	var meetingIdHeader = document.createElement("h5")
	meetingIdHeader.setAttribute("class", "meeting-id-header")
	meetingIdHeader.innerHTML = "Meeting ID:"
	meetingIdBlock.appendChild(meetingIdHeader)
		
	var meetingIdInput = document.createElement("INPUT")
	meetingIdInput.setAttribute("type", "text")
	meetingIdInput.setAttribute("class", "meeting-id-input")
	meetingIdInput.setAttribute("id", sessionId+"-meetingId")
	meetingIdBlock.appendChild(meetingIdInput)
	meetingIdInput.onfocus = function() {
    		updateIdButton.style.display = 'block'	
	}
		
	var passwordIdBlock = document.createElement("div")
	passwordIdBlock.setAttribute("class", "password-id-block")
	zoomIdBlock.appendChild(passwordIdBlock)
		
	var meetingPasswordHeader = document.createElement("h5")
	meetingPasswordHeader.setAttribute("class", "meeting-password-header")
	passwordIdBlock.appendChild(meetingPasswordHeader)	
	meetingPasswordHeader.innerHTML = "Meeting Password:"
		
	var meetingPasswordInput = document.createElement("INPUT")
	meetingPasswordInput.setAttribute("type", "text")
	meetingPasswordInput.setAttribute("class", "meeting-password-input")
	meetingPasswordInput.setAttribute("id", sessionId+"-passwordId")	
	passwordIdBlock.appendChild(meetingPasswordInput)
	meetingPasswordInput.onfocus =  function() {
    		updateIdButton.style.display = 'block'	
	}
		
	if(snapshot.child(userId+'/sessions/'+sessionId+'/onlineSession/') == null) {
		var onlineDict = {}
		var credentialsDict =
			{
			'meetingId' : '000000000',
			'passwordId' : '000000'
			}
		onlineDict['onlineSession'] = credentialsDict
		dataRef.child(userId+'/sessions/'+sessionId).update(onlineDict)
	}
	else {
		meetingIdInput.placeholder = snapshot.child(userId+'/sessions/'+sessionId+'/onlineSession/meetingId').val()
		meetingPasswordInput.placeholder = snapshot.child(userId+'/sessions/'+sessionId+'/onlineSession/passwordId').val()
	}
			    
			    
			    
	if (isPending == 1) {
		upcomingSection.appendChild(upcomingBlock)
		rescheduleButton.innerHTML = "RESCHEDULE"
		cancelButton.innerHTML = "CANCEL"
		
		pendingContainer.appendChild(rescheduleButton)
		pendingContainer.appendChild(cancelButton)
		upcomingBlock.appendChild(zoomForm)

		updateUpcomingArray(startTimeEpoch)
		
	} else  {
		hasPending = true
		pendingButton.innerHTML = "CONFIRM"
		cancelButton.innerHTML = "CANCEL"
		
		pendingButton.setAttribute("onClick", "userConfirmedSession('"+userId+"','"+sessionId+"')")
		pendingButton.setAttribute('id', sessionId+"-button")
		
		pendingContainer.appendChild(pendingButton)
		pendingContainer.appendChild(cancelButton)
		
		pendingContainer.setAttribute('id', sessionId+"-container")
        	pendingSection.appendChild(upcomingBlock)
		}
        }
      }
	
      appendToUpcoming()
	
      if (hasUpcoming == false) {
	      
	      	var noUpcomingBlock = document.createElement("div")
		var noUpcomingContainer = document.createElement("div")
	     	var noUpcomingImage = document.createElement("img")
	      	var noUpcomingSection = document.createElement("div")
	      	var noUpcomingHeader = document.createElement("h3")
		
		noUpcomingBlock.setAttribute("class", "upcoming-block")
		noUpcomingContainer.setAttribute("class", "no-sessions-area")
	      	noUpcomingImage.setAttribute("class", "students-image")
	      	noUpcomingSection.setAttribute("class", "no-sessions-title")
	      	noUpcomingHeader.setAttribute("class", "no-sessions-header")
	      
	      	noUpcomingImage.src = snapshot.child('XwbsnUHFYOZabc8IwGybfELFqKC2/profileURL/').val()
	      
	      	noUpcomingBlock.appendChild(noUpcomingContainer)
	      	noUpcomingContainer.appendChild(noUpcomingImage)
	      	noUpcomingContainer.appendChild(noUpcomingSection)
	      	noUpcomingSection.appendChild(noUpcomingHeader)
	      	
	      	noUpcomingHeader.innerHTML = "No Upcoming Sessions"
	      
	      	upcomingSection.appendChild(noUpcomingBlock)
        }
      if (hasPending == false) {

		var noPendingBlock = document.createElement("div")
		var noPendingContainer = document.createElement("div")
	     	var noPendingImage = document.createElement("img")
	      	var noPendingSection = document.createElement("div")
	      	var noPendingHeader = document.createElement("h3")
		
		noPendingBlock.setAttribute("class", "upcoming-block")
		noPendingContainer.setAttribute("class", "no-sessions-area")
	      	noPendingImage.setAttribute("class", "students-image")
	      	noPendingSection.setAttribute("class", "no-sessions-title")
	      	noPendingHeader.setAttribute("class", "no-sessions-header")
	      	
	      	noPendingImage.src = snapshot.child('XwbsnUHFYOZabc8IwGybfELFqKC2/profileURL/').val()
	      
	      	noPendingBlock.appendChild(noPendingContainer)
	      	noPendingContainer.appendChild(noPendingImage)
	      	noPendingContainer.appendChild(noPendingSection)
	      	noPendingSection.appendChild(noPendingHeader)
	      	
	      	noPendingHeader.innerHTML = "No Pending Sessions"
	      
	      	pendingSection.appendChild(noPendingBlock)
        }
    })

}

async function updateZoomCredentials(session, student, tutor) {
	var meetingId = document.getElementById(session+"-meetingId").value
	var passwordId = document.getElementById(session+"-passwordId").value
	var onlineDict = {}
		var credentialsDict =
			{
			'meetingId' : meetingId,
			'passwordId' : passwordId
			}
	onlineDict['onlineSession'] = credentialsDict
	await dataRef.child(tutor+'/sessions/'+session).update(onlineDict)
	
	location.reload()
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
	
	//UPDATE PROFILE BUTTON
    	var updateProfile = document.getElementById('update-profile')
    	updateProfile.setAttribute('onClick', 'userDidUpdateProfile("'+userId+'")')

	
	tutorRef.on("value", function(snapshot) {
        //SET FIELDS
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
                totalSpending -= parseFloat(spendingString)
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
		emailButton.style.backgroundColor = "#ADDCCB"
	} else {
		emailButton.innerHTML = "OFF"
		emailButton.style.backgroundColor = "#EC7764"
	}
	var smsNotifications = snapshot.child("smsNotifications").val()
	smsButton.setAttribute('onClick', 'updateUserSMS("' + userId + '")')
	if (smsNotifications) {
		smsButton.innerHTML = "ON"
		smsButton.style.backgroundColor = "#ADDCCB"
	} else {
		smsButton.innerHTML = "OFF"
		smsButton.style.backgroundColor = "#EC7764"
	}
        
          
    }, function (error) {
        console.log("Error: " + error.code);
    });
	
      


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
var weekdayArray = [mondayArray, tuesdayArray, wednesdayArray, thursdayArray, fridayArray, saturdayArray, sundayArray]
                    
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

