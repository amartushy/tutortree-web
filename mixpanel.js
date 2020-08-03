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
        "User Type": "Tutor",
        "Pre Invertview Assessment Completed": false,
        "Tutor Interview Requested": false,
        "Tutor Interview Completed": false,
        "Submitted Transcript": false,
        "Submitted Faculty Rec": false,
        "Offered Tutoring Position": false,
        "Accepted Tutoring Position": false
	});
}

//This funciton executes when a tutor user submits their PIA

function preInterviewSubmission(fieldValue){
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
		"Academic Year": fieldValue.year,
		"Pre Invertview Assessment Completed": true,
		"Pre Invertview Assessment Completed Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user clicks the request virtual interview button

function requestVirtualInterview(){
	mixpanel.track("Tutor Interview Requested");

	mixpanel.people.set({
		"Tutor Interview Requested": true,
		"Tutor Interview Requested Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user uploads a file and clicks "submit transcript" button

function transcriptUpload(){
	mixpanel.track("Submitted Transcript");

	mixpanel.people.set({
		"Submitted Transcript": true,
		"Submitted Transcript Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user uploads their faculty rec and clicks "Submit Faculty Rec" button

function facultyRecUpload(){
	mixpanel.track("Submitted Faculty");

	mixpanel.people.set({
		"Submitted Faculty Rec": true,
		"Submitted Faculty Rec Date": new Date().toISOString()
	});

}

//This funciton executes when Meghan updates the values in the tutor dashboard
//funciton called after entering values into the interview # field

function interviewCompleted(){
	mixpanel.track("Tutor Interview Completed");

	mixpanel.people.set({
		"Tutor Interview Completed": true,
		"Tutor Interview Completed Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user is approvaed and offered a tutoring position
//Grant access button

function offeredTutoringPosition(){
	mixpanel.track("Offered Tutoring Position");

	mixpanel.people.set({
		"Offered Tutoring Position": true,
		"Offered Tutoring Position Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user accepts their tutoring position
//function in the app when you add tutor code, updates a boolean value, add this there

function acceptedTutoringPosition(){
	mixpanel.track("Accepted Tutoring Position");

	mixpanel.people.set({
		"Accepted Tutoring Position": true,
		"Accepted Tutoring Position Date": new Date().toISOString()
	});

}

/*
input tutor code -- considered fully onboarded 
price per hour
max hours per week
update schedule 
choose courses to tutor
bio

first session booked -- set this up
*/

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
        "User Type": "Student Ambassador",
        //"Ambassador Interview Completed": false,
        "Ambassador Approved": false
	});

}


//This funciton executes when a user loads the sign up page

function ambassadorReview(review){
	mixpanel.track("Ambassador Review");

	mixpanel.people.set({
		"Ambassador Approved": review.value
	});
}


//This funciton executes when a user loads the sign up page

function updateAmbassadorPrivileges(){
	mixpanel.track("Ambassador Privileges Updated",{
		"Ambassador": ID, //unique user id from database TODO add this to mixpanel "key" : data.user.uid
		"Status": privileges //
	});

}

/////////////////////////////////// STUDENT PROCESS ////////////////////////////////////


//This funciton executes when a user loads the sign up page

function studentSignUp(user){
	mixpanel.track("Student User Sign Up");
	
	mixpanel.people.set({
		"School Name": user.school,
        "$first_name": user.firstName,
        "$last_name": user.lastName,
        "$email": user.email,
        "User Type": "Student"
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
