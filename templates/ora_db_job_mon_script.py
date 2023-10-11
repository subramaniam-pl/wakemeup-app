#Importing Required Libraries

import datetime
import cx_Oracle
import os
import re
import time
import sqlite3
import smtplib, sys
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import date

#Connect SQLite Database
sqlite_con = sqlite3.connect('wakemeup.db')

sqlite_cur = sqlite_con.cursor()

sqlite_cur.execute('''
    CREATE TABLE IF NOT EXISTS JOB_LIST (
    JOB_NAME    TEXT UNIQUE
                     NOT NULL,
    START_TIME  TEXT NOT NULL,
    FREQ_TYPE   TEXT NOT NULL,
    REPT_INTRVL TEXT NOT NULL,
    DURATION    TEXT NOT NULL
    );
''')

sqlite_cur.execute('''
CREATE TABLE IF NOT EXISTS job_fail_track (
    JOB_NAME        TEXT,
    JOB_STATUS      TEXT,
    JOB_START_TIME  TIMESTAMP,
    ADDITIONAL_INFO TEXT,
    LOG_TIME        TIMESTAMP
    );
''')

#Getting SMTP Mail server details
#sql = ("""select * from mail_master;""")

#sqlite_cur.execute(sql)

#result = sqlite_cur.fetchall()

#print("Mail Server Details")
smtp_serv = var_smtp_serv
print(smtp_serv)

smtp_port = var_smtp_port
#print(smtp_port)

sender_email = var_from_email
#print(sender_email)

receiver_email = var_to_email
#print(receiver_email)

smtp_uname = var_smtp_uname
#print(smtp_uname)

smtp_passwd = var_smtp_pswd
#print(smtp_passwd)

# Oracle Database connection Settings
ora_con = cx_Oracle.connect('var_db_conn_strng', encoding="US-ASCII", nencoding="UTF-8")

cur = ora_con.cursor()

#Array to store Jobs details 
# Column 0 - Job Name, Column 1 - Start Time of Job, Column 2 - Job Frequency Type, Column 3 - Job Repeat interval, Column 4 - Expected Duration of Job

sql = ("""select * from job_list;""")

sqlite_cur.execute(sql)

#jobs = sqlite_cur.fetchall()
jobs = [var_job_list]

#Script Execution Time

print(
    "=================================================================================================================================================")
now = datetime.datetime.now()
print("Job Check Time : ", now.strftime("%Y-%m-%d %H:%M:%S"))

# Total Number of Jobs to be checked

job_count = len([row[0] for row in jobs]) 

print("Total Number of Jobs to be Checked :", job_count)

if job_count == 0:
    print("No Jobs to be Checked.\n")

elif job_count > 0:
    # Initiate Loop for Number of Jobs to be checked

    i = 0

    while i < job_count:

        print("-------------------------------------------------------------------------")

        # Check if Job has a Running schedule in this time

        # Get Job Name
        job_name = jobs[i][0]

        print("\nChecking ", jobs[i][0] , "\n")

        
        # Get Job Frequency type

        job_freq = jobs[i][2]

        print("Job Frequency: " + job_freq)

        # Checking if it is a Weekly Job

        if job_freq == 'Weekly':


            # Get the current weekday name
            current_date = date.today()
            print('Current Day: ' + str(current_date.strftime('%A')))

            # Define a list of weekday names
            weekday_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

            job_day_name = jobs[i][3]
            print("Job Execution Weekday: " + job_day_name)

            # Check if today is Monday
            if current_date.strftime('%A') != job_day_name:
                # Print the job_day_name list
                print("Today is not " + job_day_name + ". Skipping this job")

                i += 1
                continue

        # Choosing case depends on Job Frequency

        if job_freq == 'Minute Interval' or job_freq == 'Hourly' or job_freq == 'Daily' or job_freq == 'Weekly':

            # Job existance check in Database

            print("\nChecking if Job exists in Database\n")

            sql = ("""SELECT job_name, state FROM dba_scheduler_jobs WHERE job_name='""" + job_name + """'""")

            cur.execute(sql)
            cur_list = cur.fetchall()

            exist_chk = cur.rowcount
            #print(exist_chk)

            if exist_chk == 1:


                # Job Disable Check

                print("Job exists \n\nChecking if the Job is Disabled\n")

                sql = ("""SELECT job_name, state FROM dba_scheduler_jobs WHERE state = 'DISABLED' and job_name='""" + job_name + """'""")

                cur.execute(sql)
                cur_list = cur.fetchall()

                disable_chk = cur.rowcount
                #print(disable_chk)

                if disable_chk == 1:

                    print("Job " + job_name + " is Disabled.\n")

                    print("Checking Tracker Table if the Disable status of Job " + job_name + " Notified already.\n")

                    #Execute select query on sqlite db
                    sql = ("""select * from job_fail_track where job_name='""" + job_name + """' and job_status='DISABLED';""")
                    #print(sql)
                    sqlite_cur.execute(sql)

                    rows = sqlite_cur.fetchall()
                    disable_notify_chk = len(rows)
                    #print(disable_notify_chk)

                    if disable_notify_chk == 0:
                    
                        #Update Tracker Table about the Disable status of the Job

                        sqlite_cur.execute("""INSERT INTO job_fail_track (JOB_NAME, JOB_STATUS, LOG_TIME) VALUES ('""" + job_name + """', 'DISABLED', '""" + str(now.strftime("%Y-%m-%d %H:%M:%S")) + """');""")
                        sqlite_con.commit()

                        sqlite_cur.execute("""select * from job_fail_track where job_name='""" + job_name + """' and job_status='DISABLED'""")

                        rows = sqlite_cur.fetchall()
                        disable_notify_chk = len(rows)

                        if disable_notify_chk == 1:
                            print("Disable Status of Job " + job_name + "updated in Tracker Table\n")

                            #Notify Disable of Job
                            print("Notifying about the Disable Status of Job")

                            # <------------------Emailing Portion----------------------------->

                            message = MIMEMultipart("alternative")
                            message["Subject"] = "Fatal Alert: Oracle Database job " + job_name + " Disabled."
                            message["From"] = sender_email
                            # message["To"] = receiver_email
                            message["To"] = ", ".join(receiver_email)

                            html = """\
                                                                            <html>
                                                                            <body>
                                                                                <p>Hi,<br><br>

                                                                                Oracle Database job <b> """ + job_name + """ </b> is Disabled. <br><br>
                                                                                Regards,<br>
                                                                                Python Automated Monitoring
                                                                                <hr>
                                                                                This is an automated message - Please do not reply directly to this email.
                                                                                </p>
                                                                            </body>
                                                                            </html>
                                                                            """
                            # print(html)

                            part1 = MIMEText(html, "html")

                            message.attach(part1)

                            try:
                                smtpObj = smtplib.SMTP(smtp_serv, smtp_port)
                                smtpObj.starttls()  # Delete
                                smtpObj.login(smtp_uname, smtp_passwd)  # Delete
                                smtpObj.sendmail(sender_email, receiver_email, message.as_string())
                                #   smtpObj.sendmail(sender_email, message["To"]+message["Cc"], message.as_string())
                                print('Email sent successfully!')
                            except Exception as e:
                                print('An error occurred while sending the email:', str(e))
                            finally:
                                smtpObj.quit()

                            # <------------------Emailing Portion----------------------------->

                    elif disable_notify_chk == 1:
                
                        print("Disable Status of Job " + job_name + " Notified already.\n")

                elif disable_chk == 0:

                    print("Job " + job_name + " is not disabled in the Database.\n")

                    # Check if it is Disabled in Tracker Table
                    print("Checking if it is previously recorded as Disabled in Tracker Table\n")

                    sqlite_cur.execute("""select * from job_fail_track where job_name='""" + job_name + """' and job_status='DISABLED'""")

                    rows = sqlite_cur.fetchall()
                    disable_notify_chk = len(rows)

                    if disable_notify_chk == 1:
                        print("Job " + job_name + " recorded as Disabled in Tracker Table\n")
                        print("Deleting it from Tracker Table\n")

                        sqlite_cur.execute("""DELETE FROM job_fail_track where job_name = '""" + job_name + """' and job_status='DISABLED';""")
                        sqlite_con.commit()

                        sqlite_cur.execute("""select * from job_fail_track where job_name='""" + job_name + """' and job_status='DISABLED';""")

                        rows = sqlite_cur.fetchall()
                        disable_del_chk = len(rows)

                        if disable_del_chk == 0:
                            print("Deleted from tracker table successfully")

                    elif disable_notify_chk == 0:
                        print("Job " + job_name + " not marked as Disabled in Tracker Table\n")

                

                    # Getting first start time of the job in a day

                    job_strt_time = datetime.datetime.strptime(jobs[i][1], "%I:%M %p").time()

                    print("Job First Start Time: " + job_strt_time.strftime('%H:%M'))

                    if job_freq != 'Weekly' and job_freq != 'Daily':

                        rept_intrvl =  datetime.datetime.strptime(jobs[i][3], "%H:%M:%S").time()
                        print("\nJob Repeat Interval: " + str(rept_intrvl))

                    # Checking if Current Time is greater the first start time

                    print("\nChecking if Current Time is greater the first start time")

                    # Get the current date and time
                    current_datetime = datetime.datetime.now()

                    # Extract the time component from the current date and time
                    current_time = current_datetime.time()

                    print("\nCurrent Time:", current_time)


                    if current_time >= job_strt_time:

                        print("\nCurrent Time is greater than first job start time")

                        # Finding Latest schedule for the Job

                        # Convert the current date and time to a datetime.datetime object
                        current_datetime = datetime.datetime.combine(current_datetime.date(), current_time)

                        # Convert the job start time to a datetime.datetime object
                        job_strt_datetime = datetime.datetime.combine(current_datetime.date(), job_strt_time)

                        print("\nFinding Latest Start Time of the Job\n")

                        if job_freq != 'Weekly' and job_freq != 'Daily':

                            # Convert the repeat interval to a datetime.timedelta object
                            rept_intrvl_timedelta = datetime.timedelta(hours=rept_intrvl.hour, minutes=rept_intrvl.minute, seconds=rept_intrvl.second)

                            # Add repeat Interval to job start time
                            latest_start_time = job_strt_datetime + rept_intrvl_timedelta

                            # Loop until future schedule of job found
                            while latest_start_time < current_datetime:
                            
                                latest_start_time = latest_start_time + rept_intrvl_timedelta

                            # Deduct 1 repeat interval from future schedule
                            if latest_start_time > current_datetime:
                                latest_start_time = latest_start_time - rept_intrvl_timedelta

                                print("\nLatest Start Time: " + str(latest_start_time))

                        elif job_freq == 'Weekly' or job_freq == 'Daily':

                            latest_start_time = job_strt_datetime
                            print("\nLatest Start Time: " + str(latest_start_time))

                        # Checking if Job Started as per the schedule
                        print("\nChecking if Job Started as per the Latest Scheduled Start Time.\n")

                        sql = ("""select job_name from DBA_SCHEDULER_RUNNING_JOBS where job_name='""" + job_name + """'""")

                        cur.execute(sql)
                        cur_list = cur.fetchall()

                        run_chk = cur.rowcount
                        #print(run_chk)


                        # If Yes Check if it is running within acceptable duration

                        if run_chk == 1:

                            print("Job " + job_name + " started as per the latest start time.\n\nChecking if it is running within acceptable duration\n")

                            job_duration =  datetime.datetime.strptime(jobs[i][4], "%H:%M:%S").time()
                            print("Acceptable duration of job " + job_name + " is " + str(job_duration))

                            # Convert the repeat interval to a datetime.timedelta object
                            duration_timedelta = datetime.timedelta(hours=job_duration.hour, minutes=job_duration.minute, seconds=job_duration.second)

                            # Expected Completion Time
                            expectd_compl_time = latest_start_time + duration_timedelta
                            print("\nExpected Completion Time: " + str(expectd_compl_time))

                            if expectd_compl_time < current_datetime:

                                #Checking if the Job is still running
                                print("\nChecking if Job is still running.\n")

                                sql = ("""select job_name from DBA_SCHEDULER_RUNNING_JOBS where job_name='""" + job_name + """'""")

                                cur.execute(sql)
                                cur_list = cur.fetchall()

                                delay_chk = cur.rowcount
                                #print(delay_chk)

                                if delay_chk == 1:
                                    print(job_name + " is running beyond acceptable duration.\n")
                                    print("Checking if delay status notified already\n")                               

                                    sqlite_cur.execute("""select * from job_fail_track where job_name='""" + job_name + """' and job_start_time = '"""+ str(latest_start_time) +"""' and job_status='DELAYED'""")

                                    rows = sqlite_cur.fetchall()
                                    delay_notify_chk = len(rows)

                                    #print(delay_notify_chk)

                                    if delay_notify_chk == 0:

                                        print("Delay of the job " + job_name + " started at " + str(latest_start_time) + " not notified already.\n")

                                        print("Updating tracker table.\n")
                                        
                                        #Update Tracker Table about the Disable status of the Job

                                        sqlite_cur.execute("""INSERT INTO job_fail_track (JOB_NAME, JOB_START_TIME, JOB_STATUS, LOG_TIME) 
                                            VALUES ('""" + job_name + """', '"""+ str(latest_start_time) +"""', 'DELAYED', '""" + str(now.strftime("%Y-%m-%d %H:%M:%S")) + """');""")
                                        sqlite_con.commit()

                                        sqlite_cur.execute("""select * from job_fail_track where job_name='""" + job_name + """' and job_start_time = '"""+ str(latest_start_time) +"""' and job_status='DELAYED'""")

                                        rows = sqlite_cur.fetchall()
                                        delay_tracker_chk = len(rows)

                                        if delay_tracker_chk == 1:
                                            print("Updated tracker table with the delay.\n")

                                            print("Notifying Delay")

                                            #<------------------Emailing Portion----------------------------->

                                            message = MIMEMultipart("alternative")
                                            message["Subject"] = "Warning: Oracle Database job " + job_name +" Delayed"
                                            message["From"] = sender_email
                                            #message["To"] = receiver_email
                                            message["To"] = ", ".join(receiver_email)

                                            html = """\
                                                <html>
                                                <body>
                                                    <p>Hi,<br><br>
                                                    
                                                    Oracle Database job <b> """+ job_name+""" </b> is Delayed. It is running beyond expected duration of """ + str(job_duration) + """.<br><br>
                                                    Job Start Time : """+ str(latest_start_time) +"""<br><br> 
                                                    Expected Completion Time : """+ str(expectd_compl_time) +"""<br><br>
                                                        

                                                    Regards,<br>
                                                    Python Automated Monitoring
                                                    <hr>
                                                    This is an automated message - Please do not reply directly to this email.
                                                    </p>
                                                </body>
                                                </html>
                                                """
                                            #print(html)

                                            part1 = MIMEText(html, "html")

                                            message.attach(part1)

                                            try:
                                                smtpObj = smtplib.SMTP(smtp_serv, smtp_port)
                                                smtpObj.starttls() #Delete
                                                smtpObj.login(smtp_uname, smtp_passwd) #Delete
                                                smtpObj.sendmail(sender_email, receiver_email, message.as_string())
                                                #   smtpObj.sendmail(sender_email, message["To"]+message["Cc"], message.as_string())
                                                print('Email sent successfully!')
                                            except Exception as e:
                                                print('An error occurred while sending the email:', str(e))
                                            finally:
                                                smtpObj.quit()

                                            #<------------------Emailing Portion----------------------------->



                                    elif delay_notify_chk == 1:
                                        print("Delay of the job " + job_name + " started at " + str(latest_start_time) + " notified already.\n")

                                elif delay_chk == 0:

                                    print(job_name + " is not Running, Checking if it is completed already\n")

                            elif expectd_compl_time >= current_datetime:

                                print("\nJob is running within acceptable duration.\n")


                        elif run_chk == 0:

                            print(job_name + " is not Running, Checking if it is completed already\n")

                            sql = ("""select job_name, actual_start_date, status, additional_info from dba_scheduler_job_run_details
                            where job_name='""" + job_name + """' and status in ('SUCCEEDED') and 
                            to_char(actual_start_date, 'RRRR-MM-DD HH24:MI') = to_char(to_date('""" + str(latest_start_time) + """', 'RRRR-MM-DD HH24:MI:SS'),'RRRR-MM-DD HH24:MI')""")

                            #print(sql)

                            cur.execute(sql)
                            cur_list = cur.fetchall()

                            comp_chk = cur.rowcount
                            #print(comp_chk)

                            if comp_chk == 1:
                                print("Job " + job_name + " Completed Sucessfully")
                            
                            elif comp_chk == 0:

                                #Checking if Job is Failed

                                

                                sql = ("""select job_name, actual_start_date, status, additional_info from dba_scheduler_job_run_details
                                where job_name='""" + job_name + """' and status <> ('SUCCEEDED') and
                                to_char(actual_start_date, 'RRRR-MM-DD HH24:MI') = to_char(to_date('""" + str(latest_start_time) + """', 'RRRR-MM-DD HH24:MI:SS'),'RRRR-MM-DD HH24:MI')""")

                                #print(sql)

                                cur.execute(sql)
                                cur_list = cur.fetchall()

                                fail_chk = cur.rowcount
                                #print(fail_chk)

                                if fail_chk == 1:

                                    print("Job " + job_name + " not having SUCCESSFUL completion status. Checking reason for the failure.\n") 
                                    print("Checking if failure of the Job " + job_name + " started at " + str(latest_start_time) + " notified already.\n")

                                    sql=("""select * from job_fail_track where job_name='""" + job_name + """' and job_start_time = '"""+ str(latest_start_time) +"""' and job_status = 'FAILED'""")

                                    sqlite_cur.execute(sql)
                                    rows = sqlite_cur.fetchall()
                                    nosuccess_notify_check = len(rows)

                                    if nosuccess_notify_check == 1:

                                        print("Failure of the Job " + job_name + " started at " + str(latest_start_time) + " notified already.\n")

                                    elif nosuccess_notify_check == 0:

                                        print("Failure of the Job " + job_name + " started at " + str(latest_start_time) + " not notified already.\n")
                                        print("Checking reason for the failure of job " + job_name + " started at " + str(latest_start_time) + "\n")

                                        sql = ("""select job_name, actual_start_date, status, additional_info, log_date from dba_scheduler_job_run_details
                                            where job_name='""" + job_name + """' and status <> ('SUCCEEDED') and 
                                            to_char(actual_start_date, 'RRRR-MM-DD HH24:MI') = to_char(to_date('""" + str(latest_start_time) + """', 'RRRR-MM-DD HH24:MI:SS'),'RRRR-MM-DD HH24:MI')""")

                                        #print(sql)

                                        cur.execute(sql)

                                        for job_name, actual_start_date, status, additional_info, log_date in cur:
                                            print("Job Name: ", job_name)
                                            print("Latest start time: ", actual_start_date)
                                            print("Failure Status: ", status)
                                            job_status = status
                                            print("Error Message: ", additional_info)
                                            addl_info_for_trk = additional_info
                                            print("Failure Time: ", log_date)
                                            #additional_info = additional_info.replace("\n", " ")
                                            #additional_info = re.sub('[^a-zA-Z0-9 \.\-\:\_]', '', additional_info)
                                            #additional_info = additional_info.replace(" ", "\ ")
                                            log_date = str(log_date)
                                            #log_date = log_date.replace(" ", "\ ")
                                            print(additional_info)
                                            print(log_date)
                                            addl_info_for_trk = addl_info_for_trk.replace("\n", " ")
                                            addl_info_for_trk = re.sub('[^a-zA-Z0-9 \.\-\:\_]', ' ', addl_info_for_trk)

                                        print("Updating Tracker table with failure details\n")

                                        sqlite_cur.execute("""INSERT INTO job_fail_track (JOB_NAME, JOB_START_TIME, JOB_STATUS, ADDITIONAL_INFO, LOG_TIME) 
                                            VALUES ('""" + job_name + """', '"""+ str(latest_start_time) +"""', 'FAILED', 
                                            '""" + str(addl_info_for_trk) + """','""" + str(now.strftime("%Y-%m-%d %H:%M:%S")) + """');""")
                                        
                                        sqlite_con.commit()

                                        print("Notifying the failure\n")

                                        #<------------------Emailing Portion----------------------------->

                                        message = MIMEMultipart("alternative")
                                        message["Subject"] = "Fatal Alert: Oracle Database job " + job_name +" failed"
                                        message["From"] = sender_email
                                        #message["To"] = receiver_email
                                        message["To"] = ", ".join(receiver_email)

                                        html = """\
                                            <html>
                                            <body>
                                                <p>Hi,<br><br>
                                                
                                                Oracle Database job <b> """+ job_name+""" </b> failed.<br><br>
                                                    Job Start Time : """+ str(actual_start_date) +"""<br><br> 
                                                    Failure time : """+ str(log_date) +"""<br><br>
                                                    Failure reason : """ + str(additional_info) + """<br><br>

                                                    <b> Please note that the failure reason in this email may not included all special characters due to Python restrictions. Please refer Database for Exact Error message </b><br><br>

                                                Regards,<br>
                                                Python Automated Monitoring
                                                <hr>
                                                This is an automated message - Please do not reply directly to this email.
                                                </p>
                                            </body>
                                            </html>
                                            """
                                        #print(html)

                                        part1 = MIMEText(html, "html")

                                        message.attach(part1)

                                        try:
                                            smtpObj = smtplib.SMTP(smtp_serv, smtp_port)
                                            smtpObj.starttls() #Delete
                                            smtpObj.login(smtp_uname, smtp_passwd) #Delete
                                            smtpObj.sendmail(sender_email, receiver_email, message.as_string())
                                            #   smtpObj.sendmail(sender_email, message["To"]+message["Cc"], message.as_string())
                                            print('Email sent successfully!')
                                        except Exception as e:
                                            print('An error occurred while sending the email:', str(e))
                                        finally:
                                            smtpObj.quit()

                                        #<------------------Emailing Portion----------------------------->

                                elif fail_chk == 0:

                                    print("Job " + job_name + " Not started as per the latest scheduled Time:" + str(latest_start_time) + "\n")
                                    print("Checking if failure of start notified already.\n")

                                    sql=("""select * from job_fail_track where job_name='""" + job_name + """' and job_start_time = '"""+ str(latest_start_time) +"""' and job_status='NOT STARTED'""")

                                    sqlite_cur.execute(sql)
                                    rows = sqlite_cur.fetchall()
                                    nostart_notify_check = len(rows)

                                    #print(nostart_notify_check)

                                    if nostart_notify_check == 1:
                                        print("Failure of start notified already.\n")

                                    elif nostart_notify_check == 0:
                                        print("Failure of start not notified already.\n")
                                        print("Updating tracker table about the job start failure.\n")

                                        sqlite_cur.execute("""INSERT INTO job_fail_track (JOB_NAME, JOB_START_TIME, JOB_STATUS, LOG_TIME) 
                                            VALUES ('""" + job_name + """', '"""+ str(latest_start_time) +"""', 'NOT STARTED', '""" + str(now.strftime("%Y-%m-%d %H:%M:%S")) + """');""")
                                        sqlite_con.commit()

                                        sqlite_cur.execute("""select * from job_fail_track where job_name='""" + job_name + """' and job_start_time = '"""+ str(latest_start_time) +"""' and job_status='NOT STARTED'""")

                                        rows = sqlite_cur.fetchall()
                                        nostart_tracker_chk = len(rows)

                                        if nostart_tracker_chk == 1:
                                            print("Updated tracker table with the failure of start.\n")

                                            print("Notifying about failure in start")

                                            #<------------------Emailing Portion----------------------------->

                                            message = MIMEMultipart("alternative")
                                            message["Subject"] = "Fatal Alert: Oracle Database job " + job_name +" not started."
                                            message["From"] = sender_email
                                            #message["To"] = receiver_email
                                            message["To"] = ", ".join(receiver_email)

                                            html = """\
                                                <html>
                                                <body>
                                                    <p>Hi,<br><br>
                                                    
                                                    Oracle Database job <b> """+ job_name+""" </b> not started as per scheduled time.<br><br>
                                                    Expected Start Time : """+ str(latest_start_time) +"""<br><br> 
                                                        
                                                    Regards,<br>
                                                    Python Automated Monitoring
                                                    <hr>
                                                    This is an automated message - Please do not reply directly to this email.
                                                    </p>
                                                </body>
                                                </html>
                                                """
                                            #print(html)

                                            part1 = MIMEText(html, "html")

                                            message.attach(part1)

                                            try:
                                                smtpObj = smtplib.SMTP(smtp_serv, smtp_port)
                                                smtpObj.starttls() #Delete
                                                smtpObj.login(smtp_uname, smtp_passwd) #Delete
                                                smtpObj.sendmail(sender_email, receiver_email, message.as_string())
                                                #   smtpObj.sendmail(sender_email, message["To"]+message["Cc"], message.as_string())
                                                print('Email sent successfully!')
                                            except Exception as e:
                                                print('An error occurred while sending the email:', str(e))
                                            finally:
                                                smtpObj.quit()

                                            #<------------------Emailing Portion----------------------------->

                    elif current_time < job_strt_time:

                        print("\nCurrent Time is Less than first start time. This is a Future Job")

            elif exist_chk == 0:
                print("\nJob " + job_name + " does not exists in Database.\n")

        i += 1

sqlite_cur.close()
sqlite_con.close()





