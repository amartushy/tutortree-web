/*

This script organizes all event and user tracking functions for mixpanel. 

It is split into a few sections, separated by user journey:

1) Tutor Signup, Hiring & Vetting Process
2) Ambassador Signup, Hiring & Vetting Process
3) Student Signup Process

//test by duplicating the sign up pages and 


*/

/////////////////////////////////// TUTOR PROCESS ////////////////////////////////////

//This funciton executes when a user loads the tutor sign up page

function tutorSignupPageViewed(){
	mixpanel.track("Tutor Sign Up Page View");

}

//This funciton executes when a user signs up for a tutor account


function tutorAccountCreated(user){
	//alias maps the random unique user id assigned by mp to the users email
	mixpanel.alias(user.email);
	//adding super property here to always track School and reference
	mixpanel.register({
		"School Name": user.school,
		"How Heard": user.howHeard
	});
	//tracks the event of tutor signing up
	mixpanel.track("Tutor Sign Up",{
		"School Name": user.school,
		"How Heard": user.howHeard
	});
	//
	mixpanel.people.set({
		"School Name": user.school,
        	"$first_name": user.firstName,
        	"$last_name": user.lastName,
        	"$email": user.email,
        	"$phone": user.phoneNumber,
        	"How Heard": user.howHeard,
        	"Tutor User": true,
        	"Pre Invertview Assessment Completed": false,
        	"Tutor Interview Requested": false,
        	"Tutor Interview Completed": false,
        	"Submitted Transcript": false,
        	"Submitted Faculty Rec": false,
		"Tutor Reached Offer Stage": false,
		"Tutor Application Stage": "Applied",
		"Tutor Application Resolution": "Not yet offered",
        	"Tutor Accepted Position": false,
		"Tutor Application Date": new Date().toISOString()
	});
}

//This funciton executes when a tutor user submits their PIA

function preInterviewSubmission(fieldValue){
	mixpanel.identify();
	
	mixpanel.register({
		"Major": fieldValue.major,
		"Academic Year": fieldValue.year
	});

	mixpanel.track("Pre Invertview Assessment",{
		"Major": fieldValue.major,
		"Academic Year": fieldValue.year
	});
	
	mixpanel.people.set({
		"Major": fieldValue.major,
		"Groups Involved": fieldValue.groups,
		"Tutoring Experience": fieldValue.experience,
		"Courses Seeking to Tutor": fieldValue.courses,
		"Amount of Hours Interested Tutoring Weekly": fieldValue.hours,
		"Tutoring Qualities": fieldValue.qualities,
		"Interest in Tutoring": fieldValue.whyTutor,	
		"Academic Year": fieldValue.year,
		"Pre Invertview Assessment Completed": true,
		"Pre Invertview Assessment Completed Date": new Date().toISOString(),
		"Mobile OS": fieldValue.mobileOS,
		"Tutor Application Stage": "Submitted PIA"		
	});

}

//This funciton executes when a tutor user clicks the request virtual interview button

function requestVirtualInterview(){
	mixpanel.identify();
	
	mixpanel.track("Tutor Interview Requested");

	mixpanel.people.set({
		"Tutor Interview Requested": true,
		"Tutor Application Stage": "Requested Interview",		
		"Tutor Interview Requested Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user uploads a file and clicks "submit transcript" button

function transcriptUpload(){
	mixpanel.identify();	
	
	mixpanel.track("Submitted Transcript");

	mixpanel.people.set({
		"Submitted Transcript": true,
		"Tutor Application Stage": "Submitted Transcript",		
		"Submitted Transcript Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user uploads their faculty rec and clicks "Submit Faculty Rec" button

function facultyRecUpload(){
	mixpanel.identify();
	
	mixpanel.track("Submitted Faculty Rec", {
		"Faculty Rec Submitted by Tutor Prospect": true
	});

	mixpanel.people.set({
		"Submitted Faculty Rec": true,
		"Tutor Application Stage": "Submitted Faculty Rec",		
		"Submitted Faculty Rec Date": new Date().toISOString()
	});

}

function facultyRecUploadByTutorCoordinator(email){
	mixpanel.identify(email)
	;	
	mixpanel.track("Submitted Faculty Rec", {
		"Faculty Rec Submitted by Tutor Prospect": false
	});

	mixpanel.people.set({
		"Submitted Faculty Rec": true,
		"Tutor Application Stage": "Submitted Faculty Rec",		
		"Submitted Faculty Rec Date": new Date().toISOString()
	});

}

//This funciton executes when Meghan updates the values in the tutor dashboard
//function called after entering values into the interview # field

function MPinterviewCompleted(applicantsID, email){

	mixpanel.identify(email);
	
	mixpanel.people.set({
		"Tutor Interview Completed": true,
		"Tutor Application Stage": "Completed Interview",		
		"Tutor Interview Completed Date": new Date().toISOString()
	});	

	
	mixpanel.track("Tutor Interview Completed");

}

function MPreverseInterviewCompleted(applicantsID, email){
	
	mixpanel.identify(email);

	mixpanel.people.set({
		"Tutor Interview Completed": false,
		"Tutor Application Stage": "Reversed Interview",
		"Tutor Interview Completed Date": null
	});
	
	var userDB = firebase.firestore()
	
	userDB.collection("users")
		.doc(applicantsID)
		.update( { "application.completedInterview" : false } )	
	
	mixpanel.track("Tutor Reverse Interview Completed");

}

//This funciton executes when a tutor user is approvaed but still might need to complete some steps to be granted access
//Approved button

function isFirstApprovedTutorAppResolution(email){
	mixpanel.identify(email);
	
	mixpanel.track("Tutor Application Resolution", {
		"Tutor Application Resolution" : "Approved"
	});
	
	mixpanel.people.set({
		"Tutor Application Resolution" : "Extended Offer",
		"Tutor Application Stage": "Offered",		
		"Reached Resolution Stage": true,
		"Resolution Stage Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user is waitlisted
//Wait listed button

function isWaitListedTutorAppResolution(email){
	mixpanel.identify(email);
	
	mixpanel.track("Tutor Application Resolution", {
		"Tutor Application Resolution" : "Wait Listed"
	});
	
	mixpanel.people.set({
		"Tutor Application Resolution" : "Wait Listed",
		"Tutor Application Stage": "Offered",		
		"Reached Resolution Stage": true,
		"Resolution Stage Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user is rejected
//Rejcted button

function isRejectedTutorAppResolution(email){
	mixpanel.identify(email);
	
	mixpanel.track("Tutor Application Resolution", {
		"Tutor Application Resolution" : "Rejected"
	});
	
	mixpanel.people.set({
		"Tutor Application Resolution" : "Rejected",
		"Tutor Application Stage": "Offered",		
		"Reached Resolution Stage": true,
		"Resolution Stage Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user accepts their tutoring position 
//function in the app when you add tutor code, updates a boolean value, add this there
//Nick

function tutorAcceptedPosition(email){
	mixpanel.identify(email);
	
	mixpanel.track("Tutor Accepted Position");

	mixpanel.people.set({
		"Tutor Accepted Position": true,
		"Tutor Application Resolution" : "Tutor Accepted Position",
		"Tutor Application Stage": "Tutor Accepted Position",			
		"Tutor Accepted Position Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user sets up their available hours
//Goal - know if a tutor has set up hours or not
//Nick

function tutorSetUpHours(hours){
	mixpanel.identify();
	
	mixpanel.track("Tutor Set up Hours Available", {
		"Number of Hours Available Per Week": hours
	});

	mixpanel.people.set({
		"Number of Hours Available Per Week": hours,
		"Tutor Set Up Hours Available Per Week": true,
		"Most Recent Tutor Setup Hours Date": new Date().toISOString()
	});
	
	mixpanel.people.set_once({
		"First Tutor Setup Hours Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user selects which courses they will tutor
//Goal - Know if we need to hire more tutors and coverage of subjects per campus by understanding distribution of courses and subjects a tutor signs up for
//Nick

function tutorCourseSelect(courses){
	mixpanel.identify();	
	
	mixpanel.track("Tutor Selected Courses", {
		"Courses Tutoring": courses.list,
		"Subjects Tutoring": subjects.list
	});

	mixpanel.people.set({
		"Courses Tutoring": courses.list,
		"Tutor Selected Courses": true,
		"Num of Courses Tutoring": len(courses.list),
		"Num of Subjects Tutoring": len(subjects.list),		
		"Most Recent Tutor Selected Courses Date": new Date().toISOString()
	});
	
	mixpanel.people.set_once({
		"First Tutor Selected Courses Date": new Date().toISOString()
	});

}

function userWebsiteLogin(email, tutorApplicant){
	mixpanel.identify(email);
	
	mixpanel.track("User Signed into Site", {
		"Is Tutor" : tutorApplicant
	})
	
	mixpanel.people.set({
		"User Logged into Website" : true
	});

}

//This funciton executes when a student books a session
//function in the app when you add tutor code, updates a boolean value, add this there
//Nick

function sessionBooked(student, tutor){
	mixpanel.identify();	
	
	mixpanel.track("Session Booked", {
		"Student Name": student.name,
		"Tutor Name": tutor.name
	});
	
	mixpanel.people.track_charge(paymentAmount, {
    		'$time': new Date().toISOString()
	});
	
	mixpanel.people.increment("Total Sessions Booked");
	
	mixpanel.people.set_once({
		"First Booked Session Date": new Date().toISOString()
	})

}




/////////////////////////////////// AMBASSADOR PROCESS ////////////////////////////////////

//This funciton executes when a user views the ambassador sign up page

function ambassadorSignupPageViewed(){
	mixpanel.track("Ambassador Sign Up Page Viewed");
}


//This funciton executes when a user signs up for an ambassador 

function ambassadorAccountCreated(user){
	mixpanel.alias(user.email);

	mixpanel.track("Ambassador Sign Up",{
		"School Name": user.school,
		"How Heard": user.howHeard
	});
	//
	mixpanel.people.set({
		"School Name": user.school,
        	"$first_name": user.firstName,
        	"$last_name": user.lastName,
        	"$email": user.email,
        	"$phone": user.phoneNumber,
        	"How Heard": user.howHeardField,
        	"Lives Near Campus": user.livesNearCampus,
        	"Organization Involvement": user.organizations,
        	"Favorite Off Campus Location": user.favoriteOffCampus,
        	"Largest Social Media Following Service": user.socialMediaField,
        	"Number of Followers at Largerst Social Media Service": user.numberOfFollowers,
        	"Knows Anyone at TutorTree": user.knowsEmployees,
        	"Social Handle": user.socialHandle,
        	"Ambassador User": true,
        	//"Ambassador Interview Completed": false,
        	"Ambassador Hiring Status": "Not yet Interviewed"
	});

}


//This funciton executes when a user loads the sign up page

function ambassadorReviewed(email, acceptedOrRejected){
	mixpanel.identify(email);
	
	mixpanel.track("Ambassador Reviewed");

	mixpanel.people.set({
		"Ambassador Hiring Status": acceptedOrRejected
	});
}


/////////////////////////////////// STUDENT PROCESS ////////////////////////////////////


//This funciton executes when a user loads the sign up page

function studentSignUp(studentUser){
	mixpanel.alias(user.email);
	
	mixpanel.track("Student User Sign Up");
	
	mixpanel.register({
		"Student Major": user.major,
		
	});
	
	mixpanel.people.set({
		"School Name": user.school,
        	"$first_name": user.firstName,
        	"$last_name": user.lastName,
        	"$email": user.email,
        	"Student User": true
	});
}

//This funciton executes when a user loads the sign up page

function studentViewsSubjectPage(studentUser, subject){
	
	mixpanel.track("Student Views Subject Page", {
		"Student major": studentUser.major,
		
	});
	
}

//This funciton executes when a user loads the sign up page

function studentSelectsSubject(studentUser, subject){
	
	mixpanel.identify();
	
	mixpanel.track("Student Selects Courses Page", {
		"Subject Viewed": subject.name,
		"Student major": studentUser.major,
		
	});
	
}

//This funciton executes when a user loads the sign up page

function signupPageViewed(){

}


/////////////////////////////////// OTHER ////////////////////////////////////

//This funciton executes when a user logs into their account
//Identify function allows for cross-platform mapping of user 

function userLogin(user){
	mixpanel.identify(user.email);
	
	
	if(user.tutorApplicant){
		mixpanel.people.set_once({
			"Tutor Downloaded and Signed into App": true,
			"First Tutor Sign in Date": new Date().toISOString()
		})
	}
	elseif()

}

//This funciton executes when a user loads the sign up page

function sessionBooked(){
	mixpanel.people.increment("Total Sessions Booked");
	mixpanel.people.set_once("")

}



//This funciton executes when a user loads the sign up page

function signupPageViewed(){

}

//This funciton executes when a user loads the sign up page

function signupPageViewed(){

}
