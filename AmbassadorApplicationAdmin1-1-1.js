firebase.auth().onAuthStateChanged(function(user) {
if (user) {
var userDB = firebase.firestore()

var userID = user.uid

//Check if user is an admin
userDB.collection("users").doc(userID).get().then(function(doc) {
console.log(doc.data().admin)
})

//Get all applicant information and build blocks
var applicantArea = document.getElementById('applicant-section')
userDB.collection("users").where("tutorApplicant", "==", true).onSnapshot(function(allTutors) {
applicantArray = []
while(applicantArea.firstChild) {
applicantArea.removeChild(applicantArea.firstChild)
}
