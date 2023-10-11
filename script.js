// function to show Information page

function showInfoPage() {
    resetsysForm();
    resetdbinfoForm();
    resetJobFreqForm();
    document.getElementById('dbtype').classList.add('d-none');
    document.getElementById('sysinfo').classList.add('d-none');
    document.getElementById('dbinfo').classList.add('d-none');
    document.getElementById('form1area').classList.add('d-none');
    document.getElementById('form2area').classList.add('d-none');
    document.getElementById('jobdet-area').classList.add('d-none');
    document.getElementById('logdet-area').classList.add('d-none');
    document.getElementById('pynext-area').classList.add('d-none');
    document.getElementById('pyinfo-area').classList.add('d-none');
    document.getElementById('info-area').classList.remove('d-none');
}

function showFormPage() {
    resetMonTypeForm();
    resetsysForm();
    resetdbinfoForm();
    resetJobFreqForm();
    document.getElementById('form1area').classList.remove('d-none');
    document.getElementById('dbtype').classList.add('d-none');
    document.getElementById('sysinfo').classList.add('d-none');
    document.getElementById('dbinfo').classList.add('d-none');
    document.getElementById('form2area').classList.add('d-none');
    document.getElementById('jobdet-area').classList.add('d-none');
    document.getElementById('logdet-area').classList.add('d-none');
    document.getElementById('pynext-area').classList.add('d-none');
    document.getElementById('pyinfo-area').classList.add('d-none');
    document.getElementById('info-area').classList.add('d-none');
}

// function for System selection

function enableSystype(answer) {
    
    console.log(answer);
   switch (answer) {
    case 'dbjob':{
        document.getElementById('dbtype').classList.remove('d-none');
        document.getElementById('sysinfo').classList.add('d-none');
        document.getElementById('form2area').classList.add('d-none');
        document.getElementById('jobdet-area').classList.add('d-none');
        document.getElementById('logdet-area').classList.add('d-none');
        document.getElementById('pynext-area').classList.add('d-none');
        document.getElementById('info-area').classList.add('d-none');
    }
    break;
    case 'logfile':{
        document.getElementById('sysinfo').classList.remove('d-none');
        document.getElementById('dbtype').classList.add('d-none');
        document.getElementById('dbinfo').classList.add('d-none');
        document.getElementById('form2area').classList.add('d-none');
        document.getElementById('jobdet-area').classList.add('d-none');
        document.getElementById('logdet-area').classList.add('d-none');
        document.getElementById('pynext-area').classList.add('d-none');
        document.getElementById('info-area').classList.add('d-none');
    }
    break;
    default: {
        document.getElementById('dbtype').classList.add('d-none');
        document.getElementById('sysinfo').classList.add('d-none');
        document.getElementById('dbinfo').classList.add('d-none');
        document.getElementById('form2area').classList.add('d-none');
        document.getElementById('jobdet-area').classList.add('d-none');
        document.getElementById('logdet-area').classList.add('d-none');
        document.getElementById('pynext-area').classList.add('d-none');
        document.getElementById('info-area').classList.add('d-none');
    }
   }
   resetsysForm();
};



// function for Job Frequenct Selection


function enablefreqtype(answer) {
    resetJobFreqForm();
    console.log(answer);
   switch (answer) {
    case 'minutely':{
        document.getElementById('min-freq').classList.remove('d-none');
        document.getElementById('hourly-freq').classList.add('d-none');
        document.getElementById('daily-freq').classList.add('d-none');
        document.getElementById('weekly-freq').classList.add('d-none');
    }
    break;
    case 'daily':{
        document.getElementById('min-freq').classList.add('d-none');
        document.getElementById('hourly-freq').classList.add('d-none');
        document.getElementById('daily-freq').classList.remove('d-none');
        document.getElementById('weekly-freq').classList.add('d-none');
    }
    break;
    case 'hourly':{
        document.getElementById('min-freq').classList.add('d-none');
        document.getElementById('hourly-freq').classList.remove('d-none');
        document.getElementById('daily-freq').classList.add('d-none');
        document.getElementById('weekly-freq').classList.add('d-none');
    }
    break;
    case 'weekly':{
        document.getElementById('min-freq').classList.add('d-none');
        document.getElementById('hourly-freq').classList.add('d-none');
        document.getElementById('daily-freq').classList.add('d-none');
        document.getElementById('weekly-freq').classList.remove('d-none');
        
    }
    break;
    default: {
        document.getElementById('min-freq').classList.add('d-none');
        document.getElementById('hourly-freq').classList.add('d-none');
        document.getElementById('daily-freq').classList.add('d-none');
        document.getElementById('weekly-freq').classList.add('d-none');
    }
   }
};


function resetsysForm() {
    const dbform = document.getElementById('db');
    dbform.reset();
  };

function resetMonTypeForm() {
    const monform = document.getElementById('montype');
    monform.reset();
  };  


function resetJobFreqForm() {
    const minFreqForm = document.getElementById('min-freq-form');
    minFreqForm.reset();
    const hourlyFreqForm = document.getElementById('hourly-freq-form');
    hourlyFreqForm.reset();
  };

function resetdbinfoForm() {
    const dbinfoform = document.getElementById('db-info');
    dbinfoform.reset();
  };

// function for Existing DB selection

function enableDBinfo(answer) {
    resetdbinfoForm()
    console.log(answer);
    if(answer == 'oracle' || answer == 'sql') {
        // document.getElementById('existDb').classList.remove('d-none');
        document.getElementById('dbinfo').classList.remove('d-none');
    }
};


document.addEventListener("DOMContentLoaded", function() {
    // Radio button Action on DB Selection
    var radioButtons = document.getElementsByName("dbRadioGroup");
    var div1 = document.getElementById("dbinfo");
    var div2 = document.getElementById("form2area");
    var div3 = document.getElementById("jobdet-area");
    var div4 = document.getElementById("showExistDb");

    // Add event listener to each radio button
    radioButtons.forEach(function(radioButton) {
      radioButton.addEventListener("click", function() {
        if (this.value === "existingDb") {
          console.log(this.value);
          div1.classList.add('d-none');
          div2.classList.remove('d-none');
          div3.classList.remove('d-none');
          div4.classList.remove('d-none');
        } else if (this.value === "newDb") {
          console.log(this.value);
          div1.classList.remove('d-none');
          div2.classList.add('d-none');
          div3.classList.add('d-none');
        } else {
          div1.classList.add('d-none');
          div2.classList.add('d-none');
          div3.classList.add('d-none');
        }
      });
    });
  });

function checkNumber() {
    var input = document.getElementById('dbport').value;
    
    if (isNaN(input)) {
      alert("Please enter a valid number.");
    }
};


function dbinfoNxtAction() {

var inputDbHost = document.getElementById('dbhost').value;
var inputDbPort = document.getElementById('dbport').value;
var inputDbName = document.getElementById('dbname').value;
var inputDbUName = document.getElementById('dbuname').value;
var inputDbPass = document.getElementById('dbpass').value;

if (!inputDbHost || !inputDbPort || !inputDbName || !inputDbUName || !inputDbPass) {
    document.getElementById('dbMandateErrorText').style.display = 'block';
} else {
    document.getElementById('dbMandateErrorText').style.display = 'none';
    document.getElementById('form2area').classList.remove('d-none');

    //Storing DBInfo inputs in to an array
    var dbInfoForPy = [];
    dbInfoForPy = [inputDbHost,inputDbPort,inputDbName,inputDbUName,inputDbPass];
    console.log(dbInfoForPy);

    document.getElementById('dbinfo-nxt').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent page refresh
      
        // Add your button click logic here

        console.log("Button clicked!");
      });
    }
};

// Serial No for Job List Table
var slNo = 0;

// Set Empty array Python input

var jobListForTbl = [];

// Set Empty array for Table display

var jobListForPy = [];

//function to append array with list of values

function appendJobListForPy(value) {
    jobListForPy.push(value);
}

//function to append array with list of values

function appendJobListForTbl(value) {
    jobListForTbl.push(value);
}

function enablejobtbl() {
    document.getElementById('jobdet-area').classList.remove('d-none');
    document.getElementById('pynext-area').classList.remove('d-none');

    // Get the input values
    var jobname = document.getElementById('jobName').value;
    var jobnamePy = "'" + jobname.toUpperCase() + "'" ;
    var freqtype = document.getElementById('jobFreqType').value;
    
    console.log(freqtype);

    // Convert minutely in to Minute Interval
        switch(freqtype) {
            case 'minutely':{
                jobFreqType = "Minute Interval";
                jobFreqTypePy = "'Minute Interval'";
            }
            break;
            case 'hourly': {
                jobFreqType = "Hourly";
                jobFreqTypePy = "'Hourly'";
            }
            break;
            case 'daily': {
                jobFreqType = "Daily";
                jobFreqTypePy = "'Daily'";
            }
            break;
            case 'weekly': {
                jobFreqType = "Weekly";
                jobFreqTypePy = "'Weekly'";
            }
        }
    
    var jobStartTime = document.getElementById('jobMinStartTime').value + document.getElementById('jobHlyStartTime').value 
        + document.getElementById('jobDlyStartTime').value + document.getElementById('jobWklyStartTime').value;
    
    //Convert Time in AM/PM Format

    var timeParts = jobStartTime.split(':');
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);

    var suffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var jobStartTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ' ' + suffix;
    var jobStartTimePy = "'" + jobStartTime + "'"


    jobReptIntrvlPy = "'00:00:00'"

    // Repeat Interval Conversion

    switch(freqtype) {
        case 'minutely':{
            var minReptIntrvl =  document.getElementById('minReptIntrvl').value;
            jobReptIntrvl = "Every " + minReptIntrvl + " Min(s)";
            jobReptIntrvlPy = "'00:" + minReptIntrvl + ":00'"
        }
        break;
        case 'hourly': {
            var hlyReptIntrvl = document.getElementById('hlyReptIntrvl').value;
            jobReptIntrvl = "Every " + hlyReptIntrvl + " Hr(s)";
            jobReptIntrvlPy = "'" + hlyReptIntrvl + ":00:00'"
        }
        break;
        case 'daily': {
            jobReptIntrvl = "Every Day";
            jobReptIntrvlPy = "'00:00:00'"
        }
        break;
        case 'weekly': {
            jobReptIntrvl = "Every " + document.getElementById('weekdaySelect').value;
            jobReptIntrvlPy = "'" + document.getElementById('weekdaySelect').value + "'"
        }
        break;

    }

    // Maximum Duration Conversion

    switch(freqtype) {
        case 'minutely':{
            var jobDurn = document.getElementById('jobDurnMin').value + " Mins";
            var jobDurnPy = "'00:" + document.getElementById('jobDurnMin').value + ":00'";
        }
        break;
        case 'hourly':{
            var jobDurn = document.getElementById('jobDurnHrlyMin').value + " Mins";
            var jobDurnPy = "'00:" + document.getElementById('jobDurnHrlyMin').value + ":00'";
        }
        break;
        case 'daily':{
            var jobDurn = document.getElementById('jobDurnDlyHr').value + " Hr(s) " + document.getElementById('jobDurnDlyMin').value + " Min(s)";
            var jobDurnPy = "'" + document.getElementById('jobDurnDlyHr').value + ":" + document.getElementById('jobDurnDlyMin').value + ":00'";
        }
        break;
        case 'weekly':{
            var jobDurn = document.getElementById('jobDurnWklyHr').value + " Hr(s) " + document.getElementById('jobDurnWklyMin').value + " Min(s)";
            var jobDurnPy = "'" + document.getElementById('jobDurnWklyHr').value + ":" + document.getElementById('jobDurnWklyMin').value + ":00'";
        }
        break;
    }

     

    // Create a new row
    var row = document.createElement('tr');

    // Create and append the jobname cell
    var jobnameCell = document.createElement('td');
    jobnameCell.textContent = jobname;
    row.appendChild(jobnameCell);

     // Create and append the Job Start Time cell
    var jobStartTimeCell = document.createElement('td');
    jobStartTimeCell.textContent = jobStartTime;
    row.appendChild(jobStartTimeCell);

    // Create and append the frequency type cell
    var freqTypeCell = document.createElement('td');
    freqTypeCell.textContent = jobFreqType;
    row.appendChild(freqTypeCell);

    // Create and append the Job Repeat Interval cell
    var jobReptIntrvlCell = document.createElement('td');
    jobReptIntrvlCell.textContent = jobReptIntrvl;
    row.appendChild(jobReptIntrvlCell);

    // Create and append the Job Duration cell
    var jobDurnCell = document.createElement('td');
    jobDurnCell.textContent = jobDurn;
    row.appendChild(jobDurnCell);

    appendJobListForTbl([jobname, jobStartTime, jobFreqType, jobReptIntrvl, jobDurn]);
    appendJobListForPy([jobnamePy, jobStartTimePy, jobFreqTypePy, jobReptIntrvlPy, jobDurnPy]);

    console.log(jobListForTbl);
    console.log(jobListForPy);
    
    
    // Function Display content of Job List Array as Table

    

    function generateTable(){

        // Remove Job Details area if Job List Array is empty
        
        if (jobListForTbl.length == 0) {
            document.getElementById('jobdet-area').classList.add('d-none');
            document.getElementById('pynext-area').classList.add('d-none');
        } else {

        // Check if table exists
        var tablechk = document.querySelector('#jobList');
        if (tablechk) {
        // Table exists, so delete it
        tablechk.parentNode.removeChild(tablechk);
        }

        //const jobListTable = document.getElementById('joblist');
        const table = document.createElement('table');
        table.id = 'jobList';

        // Create Table Header

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>Sl No</th><th>Job Name</th><th>Job Start Time</th><th>Frequency Type</th><th>Job Repeat Interval</th><th>Maximum Duration of Job</th><th></th>'; // Add Sl No column header
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create Table Rows

        const tbody = document.createElement('tbody');

        console.log("Total No of Rows: " + jobListForTbl.length)

        for (var i = 0; i < jobListForTbl.length; i++) {
            const row = document.createElement('tr');
            const serialNoCell = document.createElement('td');
            serialNoCell.textContent = i + 1; // Set initial Sl No Value
            console.log(serialNoCell);
            row.appendChild(serialNoCell);
            // console.log(row);

            j = 0;

            console.log("Total No of Columns: " + jobListForTbl[j].length);

            
            for (var j in jobListForTbl[i]) {
                var cell = document.createElement('td');
                console.log(jobListForTbl[i][j]);
                cell.textContent = jobListForTbl[i][j];
                row.appendChild(cell);
                // console.log(row);                
            };

            // Create delete icon at end of each row
            const deleteCell = document.createElement('td');
            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add('delete-icon');
            //deleteIcon.textContent = '❌' // Delete icon
            deleteIcon.innerHTML = '&#10006;'; // X symbol
            deleteIcon.addEventListener('click', function(event) {
                var row = event.target.parentNode.parentNode;
                var index = Array.prototype.indexOf.call(row.parentNode.children, row);
                jobListForTbl.splice(index, 1); // Remove row from array
                row.parentNode.removeChild(row); // Remove row from table
                // console.log(jobListForTbl);
                generateTable(); // Regenerate the table after deleting the row
            });
            deleteCell.appendChild(deleteIcon);
            row.appendChild(deleteCell);

            tbody.appendChild(row);

            function updateSerialNumbers() {
                const table = document.querySelector('jobList');
                const rows = table.querySelectorAll('tbody');
                rows.forEach((row, index) => {
                    const serialNoCell = row.querySelector('td:first-child');
                    serialNoCell.textContent = index + 1; // Update the serial number value
                });
            };


            table.appendChild(tbody);

            //jobListTable.appendChild(table);
            var area = document.getElementById('jobdet-area');
            area.appendChild(table);
        }

    }  
    }
    

    // Populate Values stored in Array in a Table
    generateTable();

    // Clear all variable values;

    jobname = '';
    freqtype = '';
    jobFreqType = '';
    jobStartTime = '';
    jobReptIntrvl = '';
    minReptIntrvl = '';
    jobDurn = '';

    // Clear the input fields of DB Job Info
    clrJobInput();

    //Prevent Page Refresh
    document.getElementById('jobinfo-add').addEventListener('click', function(event) 
    {
        event.preventDefault(); // Prevents page refresh
      
        // Add your button click logic here
        console.log("Button clicked!");

        
      });
    
};



function enablesystbl() {
    document.getElementById('logdet-area').classList.remove('d-none');
    document.getElementById('logfile-add').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent page refresh
      
        // Add your button click logic here
        console.log("Button clicked!");
      });

};

// Show Weekdays if Weekly option selected

    // Get the select element
    var select = document.getElementById('weekdaySelect');

    // Define an array of weekdays
    var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Loop through the weekdays array
    for (var i = 0; i < weekdays.length; i++) {
    // Create a new option element
    var option = document.createElement('option');
    
    // Set the value and text content of the option
    option.value = weekdays[i];
    option.textContent = weekdays[i];
    
    // Append the option to the select element
    select.appendChild(option);
    };

// Temporaray verification of Scheduler - Can be deleted

    function scheduleJob() {
        // Get the input values
        var jobName = document.getElementById('jobInput').value;
        var jobTime = document.getElementById('timeInput').value;
        var scheduleType = document.getElementById('scheduleSelect').value;
        var day = document.getElementById('daySelect').value;
        
        // Create a new list item
        var listItem = document.createElement('li');
        
        // Set the text content of the list item based on the schedule type
        if (scheduleType === 'once') {
        listItem.textContent = jobName + ' at ' + jobTime + ' (Once)';
        } else if (scheduleType === 'daily') {
        listItem.textContent = jobName + ' at ' + jobTime + ' (Daily)';
        } else if (scheduleType === 'hourly') {
        listItem.textContent = jobName + ' at ' + jobTime + ' (Hourly)';
        } else if (scheduleType === 'custom') {
        var customHours = document.getElementById('customHoursInput').value;
        listItem.textContent = jobName + ' at ' + jobTime + ' (Every ' + customHours + ' hours)';
        } else if (scheduleType === 'weekly') {
        listItem.textContent = jobName + ' at ' + jobTime + ' (Every ' + day + ')';
        }
        
        // Append the list item to the job list
        var jobList = document.getElementById('jobList');
        jobList.appendChild(listItem);
        
        // Clear the input fields
        document.getElementById('jobInput').value = '';
        document.getElementById('timeInput').value = '';
        document.getElementById('customHoursInput').value = '';
        
        // Hide the custom hours input field
        document.getElementById('customHoursInput').style.display = 'none';
    }
    
    // Show the custom hours input field when "Custom" option is selected
    document.getElementById('scheduleSelect').addEventListener('change', function() {
        var customHoursInput = document.getElementById('customHoursInput');
        var customHoursTxt = document.getElementById('customHoursTxt');
        if (this.value === 'custom') {
        customHoursInput.style.display = 'inline-block';
        customHoursTxt.style.display = 'inline-block';
        } else {
        customHoursInput.style.display = 'none';
        customHoursTxt.style.display = 'none';
        }
    });
    
    // Show the day select field when "Weekly" option is selected
    document.getElementById('scheduleSelect').addEventListener('change', function() {
        var daySelect = document.getElementById('daySelect');
        if (this.value === 'weekly') {
        daySelect.style.display = 'inline-block';
        } else {
        daySelect.style.display = 'none';
        }
    });
  

  
// Create list between 1 to 23 to select repeat interval for hourly jobs

var selectHlyReptIntrvl = document.getElementById('hlyReptIntrvl');

for (var i = 1; i <= 23; i++) {
  var option = document.createElement('option');
  option.value = i;
  option.text = i;
  selectHlyReptIntrvl.appendChild(option);
}

// Create list between 0 to 23 to select hour for Daily Job Duration Hour input field

var selectHrs = document.getElementById('jobDurnDlyHr');

for (var i = 0; i <= 23; i++) {
  var option = document.createElement('option');
  option.value = i;
  option.text = i;
  selectHrs.appendChild(option);
}

// Create list between 0 to 23 to select hour for Weekly Job Duration Hour input field

var selectHrs = document.getElementById('jobDurnWklyHr');

for (var i = 0; i <= 23; i++) {
  var option = document.createElement('option');
  option.value = i;
  option.text = i;
  selectHrs.appendChild(option);
}

// Verify Repeat interval for Hourly jobs has minimum 1 Hr interval

var numberInput = document.getElementById('minReptIntrvl');
var minReptErrorText = document.getElementById('minReptErrorText');

numberInput.addEventListener('blur', function() {
var inputValue = parseFloat(numberInput.value);
var minValue = parseFloat(numberInput.min);

if (inputValue < minValue) {
    minReptErrorText.style.display = 'block';
    document.getElementById('minReptIntrvl').style.backgroundColor = 'red';
    document.getElementById('minReptIntrvl').style.color = 'white';
    document.getElementById('jobinfo-add').disabled = true;
} else {
    minReptErrorText.style.display = 'none';
    document.getElementById('minReptIntrvl').style.backgroundColor = '';
    document.getElementById('minReptIntrvl').style.color = '';
    document.getElementById('jobinfo-add').disabled = false;
}
});   

// Verify all Mandatory values are entered on clicking Add button for minute interval jobs

function addJobToTbl() {

var inputJobName = document.getElementById('jobName').value;
var inputFreqType = document.getElementById('jobFreqType').value;

if (!inputJobName || !inputFreqType) {
    document.getElementById('minMandateErrorText').style.display = 'block';
    } else {
        console.log(inputJobName);

        switch(inputFreqType) {
            case 'minutely':{
                var inputStartTime = document.getElementById('jobMinStartTime').value;
                var inputReptIntrvl = document.getElementById('minReptIntrvl').value;
                var inputjobDurn = document.getElementById('jobDurnMin').value;


                console.log(inputjobDurn);


                if (!inputJobName || !inputFreqType || !inputStartTime || !inputReptIntrvl || !inputjobDurn) {
                    //event.preventDefault(); // Prevent form submission
                    document.getElementById('minMandateErrorText').style.display = 'block';
                    } else {
                        document.getElementById('minMandateErrorText').style.display = 'none';
                        enablejobtbl();
                }

            }
            break;
            case 'hourly':{
                
                var inputStartTime = document.getElementById('jobHlyStartTime').value;
                var inputReptIntrvl = document.getElementById('hlyReptIntrvl').value;
                var inputjobDurn = document.getElementById('jobDurnHrlyMin').value;


                console.log(inputjobDurn);


                if (!inputJobName || !inputFreqType || !inputStartTime || !inputReptIntrvl || !inputjobDurn) {
                    console.log(inputjobDurn);
                    //event.preventDefault(); // Prevent form submission
                    document.getElementById('minMandateErrorText').style.display = 'block';
                    } else {
                        document.getElementById('minMandateErrorText').style.display = 'none';
                        enablejobtbl();
                }
            }
            break;
            case 'daily':{
                
                var inputStartTime = document.getElementById('jobDlyStartTime').value;
                var inputjobDurn = document.getElementById('jobDurnDlyHr').value + document.getElementById('jobDurnDlyMin').value;


                console.log(inputjobDurn);


                if (!inputJobName || !inputFreqType || !inputStartTime || !inputjobDurn) {
                    console.log(inputjobDurn);
                    //event.preventDefault(); // Prevent form submission
                    document.getElementById('minMandateErrorText').style.display = 'block';
                    } else {
                        document.getElementById('minMandateErrorText').style.display = 'none';
                        enablejobtbl();
                }
            }
            break;
            case 'weekly':{
                
                var inputStartDay = document.getElementById('weekdaySelect').value;
                var inputStartTime = document.getElementById('jobWklyStartTime').value;
                var inputjobDurn = document.getElementById('jobDurnWklyHr').value + document.getElementById('jobDurnWklyMin').value;


                console.log(inputStartDay);


                if (!inputJobName || !inputFreqType || !inputStartDay || !inputStartTime || !inputjobDurn) {
                    console.log(inputStartDay);
                    //event.preventDefault(); // Prevent form submission
                    document.getElementById('minMandateErrorText').style.display = 'block';
                    } else {
                        document.getElementById('minMandateErrorText').style.display = 'none';
                        enablejobtbl();
                }
            }

            
        }
    }
};


// Clear form 

function clrJobInput() {
    const jobInfoForm = document.getElementById('db-job-info');
    jobInfoForm.reset();

    const minFreqForm = document.getElementById('min-freq-form');
    minFreqForm.reset();

    const hrlyFreqForm = document.getElementById('hourly-freq-form');
    hrlyFreqForm.reset();

    const dlyFreqForm = document.getElementById('daily-freq-form');
    dlyFreqForm.reset();

    const wklyFreqForm = document.getElementById('weekly-freq-form');
    wklyFreqForm.reset();

    document.getElementById('minMandateErrorText').style.display = 'none';
};

// Function to download Job details in to csv

function downldcsv() {
    document.getElementById('form1area').classList.remove('d-none');
}

// Function to get Inputs Related to Python

function pyNext(){
    document.getElementById('form1area').classList.add('d-none');
    document.getElementById('dbtype').classList.add('d-none');
    document.getElementById('sysinfo').classList.add('d-none');
    document.getElementById('dbinfo').classList.add('d-none');
    document.getElementById('form2area').classList.add('d-none');
    document.getElementById('jobdet-area').classList.add('d-none');
    document.getElementById('logdet-area').classList.add('d-none');
    document.getElementById('pynext-area').classList.add('d-none');
    document.getElementById('pyinfo-area').classList.remove('d-none');
};

//Generate Final Python Script

function generatePyFile() {

    // Read file part
    const filePath = 'templates/ora_db_job_mon_script.py';
    const dbhost = document.getElementById('dbhost').value;
    const dbport = document.getElementById('dbport').value;
    const dbname = document.getElementById('dbname').value;
    const dbuname = document.getElementById('dbuname').value;
    const dbpass = document.getElementById('dbpass').value;
    const smtphost = "'" + document.getElementById('smtpHost').value + "'";
    const smtpport = document.getElementById('smtpPort').value;
    const fromemail = "'" + document.getElementById('fromEmail').value + "'";
    const pdtymail = document.getElementById('pDtyEmail').value;
    var toemail = document.getElementById('toEmail').value;
    const smtp_uname = "'" + document.getElementById('smtpUname').value + "'";
    const smtp_pswd = "'" + document.getElementById('smtpPswd').value + "'";
    

    toemail = pdtymail + ',' + toemail;

    var toemails = toemail.split(',').map(function(email) {
        return "'" + email.trim() + "'";
    });

    var to_emails = toemails.map(function(item) {
        return "[" + item + "]";
    });

    console.log(toemails);

    console.log(jobListForPy);

    var modifiedjobListForPy = jobListForPy.map(function(item) {
        return "[" + item + "]";
    });



    console.log(modifiedjobListForPy);

    const reader = new FileReader();
    const ora_db_conn_strng = dbuname + '/'+ dbpass +'@//' + dbhost + ':'+ dbport +'/' + dbname;
    

    const findReplacePairs = [
        { find: 'var_db_conn_strng', replace: ora_db_conn_strng },
        { find: 'var_job_list', replace: modifiedjobListForPy},
        { find: 'var_smtp_serv', replace: smtphost},
        { find: 'var_smtp_port', replace: smtpport},
        { find: 'var_smtp_uname', replace: smtp_uname},
        { find: 'var_smtp_pswd', replace: smtp_pswd},
        { find: 'var_from_email', replace: fromemail},
        { find: 'var_to_email', replace: toemails},
        // Add more find and replace pairs as needed
      ];

    fetch(filePath)
        .then(response => response.text())
        .then(existingContent => {
            let updatedContent = existingContent;
            findReplacePairs.forEach(pair => {
                const findRegExp = new RegExp(pair.find.replace(/,/g, '\\,'), 'g');
                updatedContent = updatedContent.replace(findRegExp, pair.replace);

            });
            
            // Create a Blob object with the text data
            const blob = new Blob([updatedContent], { type: 'text/plain' });
            // Create a temporary URL for the Blob
            const url = URL.createObjectURL(blob);

          // Create a download link
          var link = document.createElement('a');
          link.href = url;
          link.download = 'ora_job_mon.py';

          // Simulate a click on the download link
          link.click();

          // Clean up the temporary URL and link
          URL.revokeObjectURL(url);
          link.remove();

          // Clean up Job Details table
          
        });
  }


  // Open a connection to the database
