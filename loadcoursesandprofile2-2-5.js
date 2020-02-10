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
	var ratingCount = 0

	for (sessionId in snapshot.child("/sessions").val()) {
		sessionCount++
	}
	for (ratingId in snapshot.child("/ratings/").val() {
	     if (ratingId.length == 8) {
		averageScore += ratingId.val()
		ratingCount++
		}
	}
	sessionLabel.innerHTML = sessionCount
	averageLabel.innerHTML = (averageScore/averageCount)
	hourlyLabel.innerHTML = "$" + snapshot.child("/PPH/")*2
	
	
		
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
