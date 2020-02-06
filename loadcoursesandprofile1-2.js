tutorsNameField = document.getElementById("tutors-name")
tutorsEmailField = document.getElementById("tutors-email")
tutorsPhotoField = document.getElementById("tutors-photo")
emailCheckBox = document.getElementById("email-checkbox")
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
      		var subjectBlock = document.createElement('div')
            var subjectHeader = document.createElement("h2")
            subjectBlock.setAttribute('class', 'course-container')
            subjectBlock.setAttribute('id', subject)
            subjectHeader.setAttribute('class', 'subject-heading')
            subjectHeader.innerText = subject
            courseLayoutArea.appendChild(subjectBlock)
            subjectBlock.appendChild(subjectHeader)
          
            for(course in snapshot.child(tutorsUniversity+"/"+subject).val()) {
          		var subjectBlock = document.getElementById(subject)
                var courseButton = document.createElement('button')
                courseButton.setAttribute('id', subject+'-'+course)
                courseButton.setAttribute('onClick', 'userDidRegisterForCourse("'+tutorsUniversity+'","'+subject+'","'+course+'","'+userId+'")')
                courseButton.setAttribute('class', 'course-button w-button')
                courseButton.innerHTML = course
              
                var tutorCount = 0
                courseButton.setAttribute('registered',false)
                for(tutor in snapshot.child(tutorsUniversity+"/"+subject+"/"+course+"/tutors").val()) {
              		if(userId == tutor){
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
   
      }
    })

}
// LOAD UPCOMING SESSIONS
function loadUpcomingSessions(userID) {
	dataRef.once("value", function(snapshot) {
  	var currentTime = Math.round((new Date()).getTime() / 1000);
    var hasUpcoming = false
    var upcomingSection = document.getElementById('upcoming-section')
    
    for (sessionId in snapshot.child(userId+"/sessions").val()) {
    	if(snapshot.child(userId+"/sessions/"+sessionId+"/start").val() > currentTime){
      	hasUpcoming = true
        var upcomingBlock = document.createElement("div");
        var upcomingStudent = document.createElement("h3")
        var upcomingCourse = document.createElement("button")
        var upcomingDate = document.createElement("h4")
        var studentId = snapshot.child(userId+"/sessions/"+sessionId+'/other').val()
        
        //TIME FORMATTING
        var startTimeEpoch = snapshot.child(userId+'/sessions/'+sessionId+'/start').val()
        var endTimeEpoch = snapshot.child(userId+'/sessions/'+sessionId+'/end').val()
        var startTime = new Date(startTimeEpoch*1000)
        var endTime = new Date(endTimeEpoch*1000)
        var startDayandHour = startTime.toLocaleDateString("en-US", {weekday:'long',
        		hour: 'numeric', minute:'numeric'})
        var endMinutes = (endTime.getMinutes = '0') ? "00":endTime.getMinutes
        var endHour = ((endTime.getHours() + 24) % 12 || 12) +":"+ endMinutes
        
        
        upcomingCourse.setAttribute('class', 'upcoming-course confirmed-session w-button')
        upcomingBlock.setAttribute('class', 'upcoming-block')
        upcomingStudent.setAttribute('class', 'upcoming-header')
        upcomingDate.setAttribute('class', 'date-and-time')
          
        upcomingStudent.innerHTML = snapshot.child(studentId+'/name/').val()
        upcomingCourse.innerHTML = snapshot.child(userId+'/sessions/'+sessionId+'/course').val()
        upcomingDate.innerHTML = startDayandHour+ " until "+ endHour
        upcomingBlock.appendChild(upcomingStudent)
        upcomingBlock.appendChild(upcomingCourse)
        upcomingBlock.appendChild(upcomingDate)
        upcomingSection.appendChild(upcomingBlock)
        }
      }
      if (hasUpcoming == false) {
            upcomingSection.innerHTML = "No upcoming sessions"
        }
    })

}


//LOAD TUTORS PROFILE
var tutorsBalanceButton = document.getElementById("tutors-balance-button")
function loadTutorProfile(userId) {
    var tutorRef = dataRef.child(userId)

	tutorRef.on("value", function(snapshot) {
        //SET FIELDS
        console.log(snapshot.val())
        tutorsEmailField.value = snapshot.child("email").val()
        tutorsNameField.value = snapshot.child("name").val()
        tutorsBioField.value = snapshot.child("bio").val()
        tutorsRateField.value = snapshot.child("PPH").val()
        tutorsMaxHoursField.value = snapshot.child("MAX").val()
        
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
          
          
        //UPDATE NOTIFICATIONS
        var emailNotifications = snapshot.child("emailNotifications").val()
        if (emailNotifications){
            emailCheckBox.checked = true
        } else {
            emailCheckBox.checked = false
        }
        var smsNotifications = snapshot.child("smsNotifications").val()
        if (smsNotifications) {
            smsCheckBox.checked = true
        } else {
            smsCheckBox.checked = false
        }
          
    }, function (error) {
        console.log("Error: " + error.code);
    });
      
    //UPDATE PROFILE BUTTON
    var updateProfile = document.getElementById('update-profile')
    updateProfile.setAttribute('onClick', 'userDidUpdateProfile("'+userId+'")')
	
    //WITHDRAW BALANCE BUTTON
    var withdrawButton = document.getElementById('withdraw-balance')
    withdrawButton.setAttribute('onClick', 'venmoWithdrawal("'+userId+'","'+currentBalance+'")')

}
