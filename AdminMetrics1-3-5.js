var schoolDB = firebase.firestore()

var oregonstate = document.getElementById('oregonstate')
var ucsb = document.getElementById('ucsb')
var sjsu = document.getElementById('sjsu')
var uoregon = document.getElementById('uoregon')
var stanford = document.getElementById('stanford')
var csun = document.getElementById('csun')
var ucla = document.getElementById('ucla')
var pepperdine = document.getElementById('pepperdine')
var berkeley = document.getElementById('berkeley')
var ucsd = document.getElementById('ucsd')
var usc = document.getElementById('usc')
var tutortree = document.getElementById('tutortree')

oregonstate.setAttribute('onClick', 'showTutorsForSchool("oregonstate")')
ucsb.setAttribute('onClick', 'showTutorsForSchool("ucsb")')
sjsu.setAttribute('onClick', 'showTutorsForSchool("sjsu")')
uoregon.setAttribute('onClick', 'showTutorsForSchool("uoregon")')
stanford.setAttribute('onClick', 'showTutorsForSchool("stanford")')
csun.setAttribute('onClick', 'showTutorsForSchool("csun")')
ucla.setAttribute('onClick', 'showTutorsForSchool("ucla")')
pepperdine.setAttribute('onClick', 'showTutorsForSchool("pepperdine")')
berkeley.setAttribute('onClick', 'showTutorsForSchool("berkeley")')
ucsd.setAttribute('onClick', 'showTutorsForSchool("ucsd")')
usc.setAttribute('onClick', 'showTutorsForSchool("usc")')
tutortree.setAttribute('onClick', 'showTTMetrics()')

var subjectArea = document.getElementById('subject-area')

var totalTutors = 0
var totalCourses = 0
var totalCoursesWithTutors = 0
var totalCumulativeCount = 0

function showTTMetrics() {
    totalTutors = 0
    totalCourses = 0
    totalCoursesWithTutors = 0
    totalCumulativeCount = 0
    
    schoolDB.collection("schools").onSnapshot(function(school) {
        while(subjectArea.firstChild) {
            subjectArea.removeChild(subjectArea.firstChild)
        }
        console.log(school)
        school.forEach(function(doc) {
            var schoolTitle = doc.data().title
            var schoolPath = doc.id
            getTutors(schoolPath, schoolTitle)
        })
    })
}

async function getTutors(schoolPath, schoolTitle) {
    var tutorsArray = []
    var countOfTutors = 0
    var coursesCount = 0
    var coursesWithTutors = 0
    var cumulativeCount = 0
    await schoolDB.collection("schools").doc(schoolPath).collection('courses').onSnapshot(function(subjects) {
        subjects.forEach(function(subject) {
            var courseDict = subject.data()
            for ( var course in courseDict ) {
                if (courseDict.hasOwnProperty(course)) {
                    coursesCount += 1
                    if( courseDict[course].info.numTutors != 0) {
                        coursesWithTutors += 1
                    }
                    cumulativeCount += courseDict[course].info.numTutors
                    for (var tutor in courseDict[course].tutors) {
                        if (!tutorsArray.includes(tutor)) {
                            tutorsArray.push(tutor)
                            console.log(tutorsArray)
                        }
                    }
                }
            }
        })
        totalTutors += countOfTutors
        totalCourses += coursesCount
        totalCoursesWithTutors += coursesWithTutors
        totalCumulativeCount += cumulativeCount
        
        countOfTutors = tutorsArray.length
        buildSchoolMetrics(tutorsArray, countOfTutors, coursesCount, coursesWithTutors, cumulativeCount,  schoolTitle)
    })
}




async function buildSchoolMetrics(tutorsArray, countOfTutors, coursesCount, coursesWithTutors, cumulativeCount, schoolTitle) {

    var schoolMetrics = document.createElement('div')
    schoolMetrics.setAttribute('class', 'school-metrics')
    subjectArea.appendChild(schoolMetrics)
    
    var schoolMetricsHeader = document.createElement('div')
    schoolMetricsHeader.setAttribute('class', 'school-metrics-header')
    schoolMetrics.appendChild(schoolMetricsHeader)
    
    var schoolTitleElement = document.createElement('h3')
    schoolTitleElement.setAttribute('class', 'school-title')
    schoolTitleElement.innerHTML = schoolTitle
    console.log(schoolTitle)
    schoolMetricsHeader.appendChild(schoolTitleElement)
    
    //Metrics Block
    var metricsBlock = document.createElement('div')
    metricsBlock.setAttribute('class', 'metrics-block')
    schoolMetricsHeader.appendChild(metricsBlock)

    var numTutors = document.createElement('h3')
    numTutors.setAttribute('class', 'metrics-header')
    numTutors.innerHTML = countOfTutors + " Tutors"
    metricsBlock.appendChild(numTutors)
    
    var countCourses = document.createElement('h4')
    countCourses.setAttribute('class', 'metrics-subheader')
    countCourses.innerHTML = coursesCount + " Courses"
    metricsBlock.appendChild(countCourses)
    
    var coursesWithBlock = document.createElement('h4')
    coursesWithBlock.setAttribute('class', 'metrics-subheader')
    coursesWithBlock.innerHTML = coursesWithTutors + " Courses with Tutors"
    metricsBlock.appendChild(coursesWithBlock)
    
    var cumulativeBlock = document.createElement('h4')
    cumulativeBlock.setAttribute('class', 'metrics-subheader')
    cumulativeBlock.innerHTML = cumulativeCount + " Cumulative Tutor-Courses"
    metricsBlock.appendChild(cumulativeBlock)
    
    //Tutors images
    var tutorsBlock = document.createElement('tutors-block')
    tutorsBlock.setAttribute('class', 'tutors-block')
    schoolMetrics.appendChild(tutorsBlock)
    
    for ( i = 0; i < tutorsArray.length; i++) {
        await schoolDB.collection('userTest').doc( tutorsArray[i] ).onSnapshot(function(tutor) {
            var tutorBlockMetrics = document.createElement('div')
            tutorBlockMetrics.setAttribute('class', 'tutor-block-metrics')
            tutorsBlock.appendChild(tutorBlockMetrics)
            
            var tutorImage = document.createElement('img')
            tutorImage.setAttribute('class', 'tutor-image')
            tutorBlockMetrics.appendChild(tutorImage)
            tutorImage.src = tutor.data().profileImage
            tutorBlockMetrics.appendChild(tutorImage)
            
            var tutorsNameMetrics = document.createElement('h5')
            tutorsNameMetrics.setAttribute('class', 'tutors-name-metrics')
            tutorsNameMetrics.innerHTML = tutor.data().name
            tutorBlockMetrics.appendChild(tutorsNameMetrics)
        })
    }
}


function showTutorsForSchool(schoolTitle) {

    while(subjectArea.firstChild) {
        subjectArea.removeChild(subjectArea.firstChild)
    }

    schoolDB.collection("schools").doc(schoolTitle).collection('courses').onSnapshot(function(subject) {
        subject.forEach(function(doc) {
            buildSubjectBlock(schoolTitle, doc.id, doc.data())
        })
    })
}


async function buildSubjectBlock(schoolTitle, subject, courseDict) {

        console.log(courseDict)
        var subjectBlock = document.createElement('div')
        subjectBlock.setAttribute('class','subject-block')
        subjectArea.appendChild(subjectBlock)

        var subjectTitle = document.createElement('h3')
        subjectTitle.setAttribute('class', 'subject-title')
        subjectTitle.innerHTML = subject
        subjectBlock.appendChild(subjectTitle)

        var courseArray = document.createElement('div')
        courseArray.setAttribute('class', 'course-array')
        subjectBlock.appendChild(courseArray)

        for (var course in courseDict) {
            if (courseDict.hasOwnProperty(course)) {
                console.log(course + " -> " + courseDict[course]);

                var courseBlock = document.createElement('div')
                courseBlock.setAttribute('class', 'course-block-metrics')
                courseArray.appendChild(courseBlock)

                var courseTitle = document.createElement('div')
                courseTitle.setAttribute('class', 'course-title')
                courseTitle.innerHTML = course
                courseBlock.appendChild(courseTitle)

                var numTutors = document.createElement('div')
                numTutors.setAttribute('class', 'num-tutors')
                numTutors.innerHTML = courseDict[course].info.numTutors
                courseBlock.appendChild(numTutors)

                for (var tutor in courseDict[course].tutors) {
                    console.log(tutor)

                    var tutorBlock = document.createElement('div')
                    tutorBlock.setAttribute('class', 'tutor-block-metrics')
                    courseBlock.appendChild(tutorBlock)
                    console.log('appending tutor: ' + tutor)

                    var tutorImage = document.createElement('img')
                    tutorImage.setAttribute('class', 'tutor-image')
                    tutorBlock.appendChild(tutorImage)

                    var tutorName = document.createElement('h5')
                    tutorName.setAttribute('class', 'tutors-name-metrics' )
                    tutorBlock.appendChild(tutorName)

                    await schoolDB.collection('userTest').doc(tutor).get().then(function(doc) {
                        tutorImage.src = doc.data().profileImage
                        tutorName.innerHTML = doc.data().name
                    })
                }
            }
        }
}
