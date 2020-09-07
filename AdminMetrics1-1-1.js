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
