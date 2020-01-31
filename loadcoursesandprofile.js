tutorsNameField = document.getElementById("tutors-name")
tutorsEmailField = document.getElementById("tutors-email")
tutorsPhotoField = document.getElementById("tutors-photo")
tutorsPhotoUrlField = document.getElementById("tutors-photo-url")
emailCheckBox = document.getElementById("email-checkbox")
smsCheckBox = document.getElementById("sms-checkbox")
tutorsBioField = document.getElementById("tutors-bio")
tutorsRateField = document.getElementById("tutors-rate")
tutorsMaxHoursField = document.getElementById("tutors-max-hours")
tutorsBalanceField = document.getElementById("tutors-balance")
upcomingSessions = document.getElementById("upcomingdiv")

var dataRef = database.ref("updateDatabase/users/")
var schoolRef = dataRef.parent
var tutorRef = dataRef.child(userId)

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

//LOAD TUTORS PROFILE
function loadTutorProfile(userId) {
	tutorRef.on("value", function(snapshot) {
        //SET FIELDS
        console.log(snapshot.val())
        tutorsEmailField.value = snapshot.child("email").val()
        tutorsNameField.value = snapshot.child("name").val()
        tutorsPhotoUrlField.value = snapshot.child("profileURL").val()
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
        tutorsBalanceField.value = currentBalance.toFixed(2)
          
          
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

}