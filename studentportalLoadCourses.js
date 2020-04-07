var courseRef = dataRef.parent

function loadStudentPortal(studentId) {
      courseRef.once("value", function(snapshot) {
      //set which university student is at
      var studentsEmail = snapshot.child("/users/" + studentId +/"email/").val()
      var studentsUniversity = ""
      
      var universityDict = {
      
                                         
                                         
                                     
                                    
                                         }
                                         
    
      })




}
