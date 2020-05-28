var schoolRef = dataRef.parent

function loadAvailableCourses(studentId) {
schoolRef.once("value", function(snapshot) {
	//Set students university
						var studentsEmail = snapshot.child("users/"+studentId+"/email/").val()
						var studentsUniversity = ""
						
						//current Available Universities
						var universityNamesDict = {
									"University of Oregon" : "uoregon.edu",
            			"UCLA" : "ucla.edu",
            			"Oregon State University" : "oregonstate.edu",
									//"Chico State" : "csuchico.edu",
            			"University of Southern California" : "usc.edu",
           				"Cal" : "berkeley.edu"
						}
						var universityDict = {
									uoregon : "uoregon.edu",
            			ucla : "ucla.edu",
            			oregonstate : "oregonstate.edu",
									//chicostate : "csuchico.edu",
            			usc : "usc.edu",
           				berkeley : "berkeley.edu"
						}
						
						for (school in universityDict) {
									if(studentsEmail.includes(universityDict[school])) {
												studentsUniversity = school
												console.log(studentsUniversity)
												var schoolHeader = document.getElementById("university-header")
												if (studentsUniversity == "uoregon" ){
															schoolHeader.innerHTML = "University of Oregon"
												} else if (studentsUniversity == "ucla") {
															schoolHeader.innerHTML = "UC, Los Angeles"
												} else if (studentsUniversity == "oregonstate" ) {
															schoolHeader.innerHTML = "Oregon State University"
												} else if (studentsUniversity == "usc") {
													
												} else if (studentsUniversity == "berkeley") {
															schoolHeader.innerHTML = "Cal"
												}
									} else {
												studentsUniversity = "uoregon"
												schoolHeader = document.getElementById("university-header")
												schoolHeader.innerHTML = "University of Oregon"
									}
						}
						//Create new blocks for each subject
						for (subject in snapshot.child(studentsUniversity).val()) {
									var subjectBlock = document.createElement('div')
            			subjectBlock.setAttribute('class', 'course-container')
            			subjectBlock.setAttribute('id', subject)
            
	    						var courseButtonSection = document.createElement('div')
            			courseButtonSection.setAttribute('class', 'course-button-section')
            
									var subjectHeader = document.createElement("h3")
									subjectHeader.setAttribute('class', 'subject-heading')
									subjectHeader.innerText = subject

									subjectBlock.appendChild(subjectHeader)
									subjectBlock.appendChild(courseButtonSection)
									
									//Create labels for each course in that subject
									for (course in snapshot.child(studentsUniversity+"/"+subject).val()) {
												//var subjectBlock = document.getElementById(subject)
												var courseContainer = document.createElement("div")
            						var courseButton = document.createElement('button')
                				courseContainer.setAttribute('class', 'course-button-container')
                				courseButton.setAttribute('id', subject+'-'+course)

                				courseButton.setAttribute('class', 'new-course-button w-button')
                				courseButton.setAttribute("onClick", "launchCourseModal('"
                																			+studentsUniversity+"','"
                                                      +subject+"','"
                                                      +course+"','"
                																			+studentId+"')")
                				courseButton.innerHTML = course
										
												//Get count of tutors and apply label
												var tutorCount = 0
												for (tutor in snapshot.child(studentsUniversity+"/"+subject+"/"+course+"/tutors/").val()) {
															tutorCount++
												}
												var tutorLabel = document.createElement('p')
												tutorLabel.innerText = tutorCount + " tutors"
												tutorLabel.setAttribute("class", "tutor-label")
												courseButtonSection.appendChild(courseContainer)
												courseContainer.appendChild(courseButton)
												courseContainer.appendChild(tutorLabel)
										
												tutorCount = 0
									}
							
									document.getElementById("course-layout-area").appendChild(subjectBlock)
						}
			})			
}

function launchCourseModal(schoolId, subjectId, courseId, studentsId) {
			document.getElementById("schedule-wrapper").style.display = "flex"
			document.getElementById("course-header").innerHTML = subjectId + " : " + courseId
			
			var availabilityArea = document.getElementById("availability-area")
			while( availabilityArea.childNodes.length > 1 ) {
						availabilityArea.removeChild( availabilityArea.lastChild )
			}
			var dayButtonsArea = document.getElementById("day-buttons-area")
			while( dayButtonsArea.firstChild ) {
						dayButtonsArea.removeChild(dayButtonsArea.firstChild)
			}
			
			//initialize day buttons with onclicks
			var dayArray = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
			var firebaseArray = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
			var dayButtonsArea = document.getElementById("day-buttons-area")
			for (i = 0 ; i < 7; i++) {
						//get id of current day to append to each block
						var dayFromSeconds = new Date(getSecondsFromEpoch(i))
						var getDay = dayFromSeconds.getDay()
						
						var dayButton = document.createElement("div")
						dayButton.setAttribute("class", "day-choice")
						dayButton.setAttribute("id", getDay+"-day-choice")
						dayButtonsArea.appendChild(dayButton)
				
						var dayChoiceNum = document.createElement("div")
						dayChoiceNum.setAttribute("class", "day-choice-num")
						dayChoiceNum.setAttribute("id", getDay+"-day-choice-num")
						dayButton.appendChild(dayChoiceNum)
						
						var dayAndMonth = formatMonthAndDayFromEpoch(i)
						dayChoiceNum.innerHTML = dayAndMonth
				
						var dayChoiceDay = document.createElement("div")
						dayChoiceDay.setAttribute("class", "day-choice-day")
						dayChoiceDay.setAttribute("id", getDay+"-day-choice-day")
						dayButton.appendChild(dayChoiceDay)
			
						dayChoiceDay.innerHTML = dayArray[getDay]
				
						var dayArrayVal = document.createElement("div")
						dayArrayVal.setAttribute("id", i)
						dayButton.appendChild(dayArrayVal)
						
						
						var buttonVal = firebaseArray.indexOf(dayArray[getDay])

						dayButton.setAttribute("onClick", "loadTutorsAvailability('"
																	 + buttonVal + "','"
																	 + schoolId + "','" 
																	 + subjectId + "','"
																	 + courseId + "','"
																	 + studentsId + "')" )
			}
			dayButtonsArea.firstChild.click()
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

function loadTutorsAvailability(day, school, subject, course, studentId) {
			//Clear area for new tutors
			var availabilityArea = document.getElementById("availability-area")
			while(availabilityArea.childNodes.length > 1 ) {
						availabilityArea.removeChild(availabilityArea.lastChild)
			}
			// show which day is currently active
			var dayArray = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
			var firebaseArray = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
			var currentDay = firebaseArray[day]
			var buttonVal = dayArray.indexOf(currentDay)
			
			for( i = 0; i < 7; i++ ) {
					document.getElementById(i+"-day-choice").setAttribute("class", "day-choice")
			}
			
			document.getElementById(buttonVal+"-day-choice").setAttribute("class", "day-choice-active")
			
			//Get all possible tutors for that course
			var allTutorsForCourse = []
			courseRef = database.ref("/updateDatabase/"+school+"/"+subject+"/"+course)
			courseRef.once("value", function(snapshot) {
						for (tutor in snapshot.child("/tutors/").val()) {

								allTutorsForCourse.push(snapshot.child("/tutors/"+tutor).val())
						}
			})
	
			buildAllTutorBlocks(allTutorsForCourse, studentId, day, buttonVal)
												
}

function buildAllTutorBlocks(allTutorsForCourse, studentId, day, buttonVal) {
			tutorsRef = database.ref("/updateDatabase/users")
						tutorsRef.once("value", function(snapshot) {
								allTutorsForCourse.forEach(element => {
											
											var decimalAvailability = snapshot.child(element+"/availability/"+day).val()	
											console.log(element)
											console.log(decimalAvailability)
											if ( decimalAvailability > 0 ) {
														//build their block
														var tutorsImage = snapshot.child(element+"/profileURL/").val()
														var tutorsName = snapshot.child(element+"/name/").val()
														loadTutorsAvailabilityBlock(element, tutorsName, tutorsImage, studentId, decimalAvailability, buttonVal)
											}
								})
								
				})
}

function loadTutorsAvailabilityBlock( tutor, tutorsName, tutorsImage, student, decimalAvailability, day ) {
			var timeSlotArray = new Array(48)
			var binaryAvailability = convertToBinaryFromDecimal( decimalAvailability )
			timeSlotArray = binaryAvailability.split("")
	
			//build the block for tutors availability:
			var availabilityArea = document.getElementById("availability-area")
			
			var availabilityContainer = document.createElement("div")
			availabilityContainer.setAttribute("clas", "availability-container")
			availabilityArea.appendChild(availabilityContainer)
	
			var tutorsAvailabilityArea = document.createElement("div")
			tutorsAvailabilityArea.setAttribute("class", "tutors-availability-area")
			availabilityContainer.appendChild(tutorsAvailabilityArea)
																			
			for(i = 12; i < timeSlotArray.length; i++) {
						var timeSlot = document.createElement("div")
						if (timeSlotArray[i] == 1) {
									timeSlot.setAttribute("class", "available-block")
									timeSlot.innerHTML = "Available"
									//set onclick
									timeSlot.setAttribute("onClick", "loadCheckoutModal('"
																				+ tutor + "','"
																				+ student + "','"
																				+ tutorsName + "','"
																				+ tutorsImage + "','"
																				+ day + "','"
																				+ binaryAvailability + "','"
																				+ i + "')")
						} else {
									timeSlot.setAttribute("class", "not-available-block")
						}
						tutorsAvailabilityArea.appendChild(timeSlot)
			}
			
			//Build tutor's label block
			var tutorBadge = document.createElement("div")
			tutorBadge.setAttribute("class", "tutor-badge")
			availabilityContainer.appendChild(tutorBadge)
	
			var tutorsScheduleBlock = document.createElement("div")
			tutorsScheduleBlock.setAttribute("class", "tutors-schedule-block")
			tutorBadge.appendChild(tutorsScheduleBlock)
			
			var tutorsScheduleImage = document.createElement("img")
			tutorsScheduleImage.setAttribute("class", "tutors-schedule-image")
			tutorsScheduleBlock.appendChild(tutorsScheduleImage)
			tutorsScheduleImage.src = tutorsImage
	
			var tutorsScheduleContainer = document.createElement("div")
			tutorsScheduleContainer.setAttribute("class", "tutors-schedule-container")
			tutorsScheduleBlock.appendChild(tutorsScheduleContainer)
	
			var tutorsScheduleHeader = document.createElement("h5")
			tutorsScheduleHeader.setAttribute("class", "tutors-schedule-header")
			tutorsScheduleContainer.appendChild(tutorsScheduleHeader)	
			tutorsScheduleHeader.innerHTML = tutorsName
}

function convertToBinaryFromDecimal(decVal) {
		var binaryVal48 = twosComplement(decVal, 64).slice(0,48)
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



function loadCheckoutModal(tutorsId, studentsId, tutorsName, tutorsImage, day, binaryAvailability, timeSlot) {
	
			dataRef.once("value", function(snapshot) {
			document.getElementById("checkout-modal-wrapper").style.display = "flex"
				
			//Assignment of values and attributes
			var checkoutModal = document.querySelector(".checkout-modal-form")
			checkoutModal.setAttribute("id", studentsId)
				
			var checkoutTutorsImageBlock = document.getElementById("checkout-tutors-image-block")
			while (checkoutTutorsImageBlock.firstChild) {
						checkoutTutorsImageBlock.removeChild(checkoutTutorsImageBlock.firstChild)
			}
				
			var checkoutTutorsImage = document.createElement("img")
			checkoutTutorsImage.setAttribute("class", "checkout-tutors-image")
			checkoutTutorsImageBlock.appendChild(checkoutTutorsImage)
			checkoutTutorsImage.src = tutorsImage
	
			var tutorsNameHeader = document.querySelector(".tutors-name-header")
			tutorsNameHeader.setAttribute("id", tutorsId)
			tutorsNameHeader.innerHTML = tutorsName
			
			var checkoutCourse = document.getElementById("checkout-course")
			var course = document.getElementById("course-header").innerHTML
			checkoutCourse.innerHTML = course
			
			var checkoutDate = document.getElementById("checkout-date")
			checkoutDate.innerHTML = document.getElementById(day+"-day-choice-day").innerHTML 
															 + ", " + document.getElementById(day+"-day-choice-num").innerHTML
			
			
			var whichButton = document.getElementById(day+"-day-choice").children[2].id
			var checkoutTime = document.querySelector(".checkout-time")
			var start = getSecondsFromEpoch(whichButton)/1000 + timeSlot*1800
			checkoutTime.setAttribute("id", start)
			var timeDict = ["6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM",
											"9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
											"1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
											"5:00 PM", "5:30 PM", "6:00 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM",
											"9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"]
											
			checkoutTime.innerHTML = timeDict[timeSlot-12]
	
			var checkoutDuration = document.getElementById("checkout-duration")
			var durationArray = ['1']
			checkoutDuration.innerHTML = (durationArray.length*30) + " Minutes"
				
			var checkoutTotalAmount = document.getElementById("checkout-total-cost")
			var tutorsPPH = parseFloat(snapshot.child(tutorsId+"/PPH/").val())
			checkoutTotalAmount.innerHTML = "$" + (durationArray.length*tutorsPPH + 2.95)
			
			var checkoutAddMinutes = document.getElementById("checkout-add-minutes")
			checkoutAddMinutes.addEventListener('click', function(){
						durationArray.push('1')
						checkoutDuration.innerHTML = (durationArray.length*30) + " Minutes"
						checkoutTotalAmount.innerHTML = "$" + (durationArray.length*tutorsPPH + 2.95)
			})
	
			var checkoutMinusMinutes = document.getElementById("checkout-minus-minutes")
			checkoutMinusMinutes.addEventListener('click', function(){
						
									durationArray.pop()
									checkoutDuration.innerHTML = (durationArray.length*30) +" Minutes"
									checkoutTotalAmount.innerHTML = "$" + (durationArray.length*tutorsPPH + 2.95) 
			})
	
			var checkoutDiscount = document.getElementById("checkout-discount")
			checkoutDiscount = "$0.00"
	
			var closeCheckoutModal = document.getElementById("checkout-close-modal")
			
			closeCheckoutModal.addEventListener('click', function() {
						document.getElementById("checkout-modal-wrapper").style.display = "none"
			})
			
			
			var updateAndNotifyButton = document.getElementById("checkout-update-firebase")
																		
	})
}

async function createSession( braintreeId ) {
			dataRef.once("value", function(snapshot) {
						document.getElementById("schedule-wrapper").style.display = "none"
						document.getElementById("checkout-close-modal").addEventListener("click", function () {
										document.getElementById("schedule-wrapper").style.display = "flex"
						})
						
						//verify that tutor is still available

						//get necessary values
						var course = document.getElementById("checkout-course").innerHTML
						
						var start = document.querySelector(".checkout-time").id
						
						var tutor = document.querySelector(".tutors-name-header").id
						
						var student = document.querySelector(".checkout-modal-form").id
						
						var durationHTML = document.getElementById("checkout-duration").innerHTML
						var end = parseInt(start) + (parseInt(durationHTML.split(" ")[0]))*60

						var amountHTML = document.getElementById("checkout-total-cost").innerHTML
						amountHTML = amountHTML.split("")
						amountHTML.shift()
						var amount = parseFloat(amountHTML.join(""))
						
						var currentTime = new Date()
						var formattedDate = convertEpochTime(currentTime)
						
						//create session for student
						var studentsSessionDict = {
												"course" : course,
												"start" : start,
												"end" : end,
												"other" : tutor,
												"status" : 0,
												"student" : 1
												}

						var studentsUpdateDict = {}
						studentsUpdateDict[braintreeId] = studentsSessionDict
						dataRef.child(student+"/sessions/").update(studentsUpdateDict)
						console.log(studentsUpdateDict)

						var transactionDict = {
												"amount" : amount,
												"date" : formattedDate,
												"numberDate" : currentTime/1000,
												"type" : "Web",
												"usedBalance" : 0
												}

						//create spending for student
						var studentsSpendingDict = {}
						studentsSpendingDict[braintreeId] = transactionDict
						dataRef.child(student+"/spending/").update(studentsSpendingDict)
						console.log(studentsSpendingDict)

						//create income for tutor
						var tutorsIncomeDict = {}
						tutorsIncomeDict[braintreeId] = transactionDict
						dataRef.child(tutor+"/income/").update(tutorsIncomeDict)
						console.log(tutorsIncomeDict)

						//create session for tutor
						var tutorsSessionDict = {
												"course" : course,
												"start" : start,
												"end" : end,
												"other" : student,
												"status" : 0,
												"student" : 0
												}
						var tutorsUpdateDict = {}
						tutorsUpdateDict[braintreeId] = tutorsSessionDict
						dataRef.child(tutor+"/sessions/").update(tutorsUpdateDict)
						console.log(tutorsUpdateDict)
						
						//create connection for messaging
						var connectionsDict = {
												"course": course,
												"date" : start,
												"value" : 0,
												"weekInt" : 1
												}
						var updateConnectionDict = {}
						updateConnectionDict[braintreeId] = updateConnectionDict
						console.log(snapshot.child("/connections/"+student+":"+tutor).val())
						dataRef.child("/connections/"+student+":"+tutor).update(updateConnectionDict)
						
						//close modal
						document.getElementById("checkout-modal-wrapper").style.display = "none"
			})	
}

var checkoutButton = document.querySelector('#checkout-button');

braintree.dropin.create({
		authorization: 'production_yks4fjkg_j3thkst7k9j6mkvc',
		container: '#dropin-container',

		}, function (createErr, instance) {
					checkoutButton.addEventListener('click', function () {
					instance.requestPaymentMethod(function (requestPaymentMethodErr, payload) {
					// Submit payload.nonce to your server
					var nonce = payload.nonce
					
					var amountHTML = document.getElementById("checkout-total-cost").innerHTML
					amountHTML = amountHTML.split("")
					amountHTML.shift()
					var transactionAmount = parseFloat(amountHTML.join(""))

					checkoutWithNonceAndAmount(nonce, transactionAmount)

					
					})
			})
})
function sendTutorNotifications() {
				var tutor = document.querySelector(".tutors-name-header").id	
				var student = document.querySelector(".checkout-modal-form").id
				var course = document.getElementById("checkout-course").innerHTML
				var currentTime = new Date()
				var formattedDate = convertEpochTime(currentTime)
				
				
				//notify tutor of new session
				var studentsName = snapshot.child(student+"/name/").val()
						if(snapshot.child(tutor+'/smsNotifications/').val() == true) {
    							var tutorsNumber = snapshot.child(tutor+'/phone/').val()
									var sendMessage = "New Booking%0A"+studentsName+ " has booked you for " + course +" on "+ formattedDate +". This session is awaiting your confirmation. "
									sendSMSTo(tutorsNumber,sendMessage)
    				} 
						if(snapshot.child(tutor+'/emailNotifications/').val() == true) {
									var tutorsEmail = snapshot.child(tutor+'/email/').val()
									var titleMessage = "New Booking"
									var emailMessage = studentsName + " has booked you for " +course +" on " + formattedDate
									sendEmailTo(tutorsEmail, titleMessage, emailMessage)
						}
						if(snapshot.child(tutor+'/pushNotifications/').val() == true) {
									var tutorsToken = snapshot.child(tutor+'/token/').val()
									var titleMessage = "New Booking"
									var pushMessage = studentsName + " has booked you for " +course +" on " + formattedDate
									sendPushTo(tutorsToken, titleMessage, pushMessage)
						}
	
}

async function checkoutWithNonceAndAmount(nonce, amount) {
        var xhttp = new XMLHttpRequest();
        var herokuURL = "https://tutortree-development.herokuapp.com/checkoutWithNonceAndAmount/"+nonce+"/"+amount
				
				xhttp.onreadystatechange = function() {
						if (xhttp.readyState == XMLHttpRequest.DONE) {
								var response = xhttp.responseText
								createSession( response )
								await sendTutorNotifications()
						}
				}
	
        await xhttp.open("GET", herokuURL, true);
        await xhttp.send();
				return(xhttp.response)
}

//HELPER FUNCTION TO CONVERT TIME
function convertEpochTime(startEpoch) {
  var startDayandMonth = startEpoch.toLocaleDateString("en-US",{weekday:'long',
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
function sendPushTo(token, title, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree-development.herokuapp.com/sendNotification/"+title+"/"+message+"/"+token+"/1"
    xhttp.open("GET", herokuURL, true);
		xhttp.send();
}
function sendEmailTo(email, title, message) {
		var xhttp = new XMLHttpRequest();
    var herokuURL = "https://tutortree-development.herokuapp.com/sendEmailTo/"+email+"/"+title+"/"+message
    console.log(herokuURL)
		xhttp.open("GET", herokuURL, true);
		xhttp.send();
}

function create8CharID() {
		var result =''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var charactersLength = characters.length
    
    for (i = 0; i < 8; i++) {
    		result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

