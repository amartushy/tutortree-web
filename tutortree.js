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

var currentTime = Math.round((new Date()).getTime() / 1000);
var dataRef = database.ref("updateDatabase/users/")
var schoolref = dataRef.parent

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  	userId = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                   // this value to authenticate with your backend server, if
                   // you have one. Use User.getToken() instead.
    var ref = dataRef.child(userId)

    //LOAD UNIVERSITIES AVAILABLE COURSES
    courseLayoutArea = document.getElementById("course-layout-area")
    schoolref.once("value", function(snapshot) {
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
          console.log("current users university: "+tutorsUniversity)
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
              courseButton.setAttribute('onClick', 
              		'userDidRegisterForCourse("'+tutorsUniversity+'","'
                  +subject+'","'+course+'","'+userId+'")')
              courseButton.setAttribute('class', 'course-button w-button')
              courseButton.innerHTML = course
              
              var tutorCount = 0
              courseButton.setAttribute('registered',false)
              for(tutor in snapshot.child(tutorsUniversity+"/"+subject+"/"+
              course+"/tutors").val()){
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
 
    //LOAD UPCOMING SESSIONS
    dataRef.once("value", function(snapshot) {
    	var currentTime = Math.round((new Date()).getTime() / 1000);
      var hasUpcoming = false
      var upcomingSection = document.getElementById('upcoming-section')

      for (sessionId in snapshot.child(userId+"/sessions").val()) {
				if(snapshot.child(userId+"/sessions/"+sessionId+"/start").val() > currentTime){
        	hasUpcoming = true
          var upcomingBlock = document.createElement("div");
          var upcomingStudent = document.createElement("h2")
          var upcomingCourse = document.createElement("button")
          var upcomingDate = document.createElement("h3")
          var studentId = snapshot.child(userId+"/sessions/"+sessionId+'/other').val()
          var startTime = snapshot.child(userId+'/sessions/'+sessionId+'/course/start').val()
          var endTime = snapshot.child(userId+'/sessions/'+sessionId+'/course/end').val()
          upcomingCourse.setAttribute('class', 'course-button w-button')
          upcomingBlock.setAttribute('class', 'upcoming-block')
          upcomingStudent.setAttribute('class', 'upcoming-header')
          upcomingDate.setAttribute('class', 'upcoming-date')
          
          upcomingStudent.innerHTML = snapshot.child(studentId+'/name/').val()
          upcomingCourse.innerHTML = snapshot.child(userId+'/sessions/'+sessionId+'/course').val()
          upcomingDate.innerHTML = startTime + endTime
          upcomingBlock.appendChild(upcomingStudent)
          upcomingBlock.appendChild(upcomingCourse)
          upcomingSection.appendChild(upcomingBlock)
         
        }
      }
      if (hasUpcoming == false) {
        	upcomingSection.innerHTML = "No upcoming sessions"
        }
    })

    //LOAD PROFILE
		ref.on("value", function(snapshot) {
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
    
  } else {
    textField.value = "Something's Wrong"
  }
  
  //UPDATE PROFILE BUTTON
	var updateProfile = document.getElementById('update-profile')
	updateProfile.setAttribute('onClick', 'userDidUpdateProfile("'+userId+'")')
});


//ONCLICK FUNCTION TO UPDATE TUTORS REGISTRATION
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
        
    } else if(registered === "false"){
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
      
//UPDATE DATABASE WITH NEW PROFILE INFORMATION
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

//UPDATE DATABASE NOTIFICATIONS
$(document).ready(function()
{
  $('#email-checkbox').change(function() 
  {
    if(this.checked == true)
    {
    	console.log("email notifications are on")
    } else {
    	console.log("email notifications off")
    }
  })
})
$(document).ready(function()
{
  $('#sms-checkbox').change(function() 
  {
    if(this.checked == true)
    {
    	console.log("sms notifications are on")
    } else {
    	console.log("sms notifications off")
    }
	})
})
