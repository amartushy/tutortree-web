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
												document.getElementById("university-header").innerHTML = "All Courses for " + studentsUniversity
										
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
			var dayArray = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
			for (i = 0 ; i < 7; i++) {
						var dayButton = document.createElement("div")
						dayButton.setAttribute("class", "day-choice")
						dayButton.setAttribute("id", i+"-day-choice")
						document.getElementById("day-buttons-area").appendChild(dayButton)
				
						var dayChoiceNum = document.createElement("div")
						dayChoiceNum.setAttribute("class", "day-choice-num")
						dayChoiceNum.setAttribute("id", i+"-day-choice-num")
						dayButton.appendChild(dayChoiceNum)
						var dayAndMonth = formatMonthAndDayFromEpoch(i)
						dayChoiceNum.innerHTML = dayAndMonth
				
						var dayChoiceDay = document.createElement("div")
						dayChoiceDay.setAttribute("class", "day-choice-day")
						dayChoiceDay.setAttribute("id", i+"-day-choice-day")
						dayButton.appendChild(dayChoiceDay)
						var dayFromSeconds = new Date(getSecondsFromEpoch(i))
						var getDay = dayFromSeconds.getDay()
						dayChoiceDay.innerHTML = dayArray[getDay]
				
						dayButton.setAttribute("onClick", "loadTutorsAvailability('"
																	 + i + "','"
																	 + schoolId + "','" 
																	 + subjectId + "','"
																	 + courseId + "','"
																	 + studentsId + "')" )
			}
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
			//Remove previous availabilities
			var availabilityArea = document.getElementById("availability-area")
			while(availabilityArea.childNodes.length > 1 ) {
						availabilityArea.removeChild(availabilityArea.lastChild)
			}
			document.getElementById(day+"-day-choice").setAttribute("class", "day-choice-active")
			
			}
			//Get all possible tutors for that course
			var allTutorsForCourse = []
			courseRef = database.ref("/updateDatabase/"+school+"/"+subject+"/"+course)
			courseRef.once("value", function(snapshot) {
						for (tutor in snapshot.child("/tutors/").val()) {
								console.log(tutor)
								allTutorsForCourse.push(snapshot.child("/tutors/"+tutor).val())
						}
			})
	
			tutorsRef = database.ref("/updateDatabase/users")
			tutorsRef.once("value", function(snapshot) {
					for (i = 0; i < allTutorsForCourse.length; i++) {
								var tutorVal = allTutorsForCourse[i]
								var decimalAvailability = snapshot.child(tutorVal+"/availability/"+day).val()
								if ( decimalAvailability > 0 ) {
											//build their block
											console.log(decimalAvailability)
											loadTutorsAvailabilityBlock(tutorVal, studentId, decimalAvailability)
								}
					}
			})
}

async function loadTutorsAvailabilityBlock( tutor, student, decimalAvailability ) {
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
						} else {
									timeSlot.setAttribute("class", "not-available-block")
						}
						tutorsAvailabilityArea.appendChild(timeSlot)
			}
	
			//Get tutors info
			const tutorNameRef = dataRef.child(tutor+"/name/")
			const tutorsNameSnapshot = await tutorNameRef.once('value')
			var tutorsName = tutorsNameSnapshot.val()
	
			const tutorImageRef = dataRef.child(tutor+"/profileURL/")
			const tutorsImageSnapshot = await tutorImageRef.once('value')
			var tutorImage = tutorsImageSnapshot.val()
			
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
			tutorsScheduleImage.src = tutorImage
	
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
