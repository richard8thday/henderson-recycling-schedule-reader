# henderson-recycling-schedule-reader (deprecated) #

### Table of contents ###
* [What is this repository for?](#what-is-this-repository-for)
* [How do I get set up?](#how-do-i-get-set-up)
* [How do I integrate with Google Calendar?](#how-do-i-integrate-with-google-calendar)
* [Just give me the calendar already!](#just-give-me-the-calendar-already)
* [Who do I talk to?](#who-do-i-talk-to)

### What is this repository for? ###

From 2017-2019, the city of Henderson, TN had a website that displayed its Recycling Program pickup schedule. Schedule information was only available as static text on the site, which made it less than convenient to access—especially when you were walking out the door in the morning en route to work and couldn't remember if you needed to put out the recycling bin. In addition, the page was updated periodically and historical data was lost.

This project was a proof-of-concept for making the information easier to digest. It scraped the site and wrote the resultant data to AWS DynamoDB for further processing. Once deployed, a Lambda script was leveraged to run automatically and keep the database up to date.

It also wrote to [a public Google calendar that I created for your convenience](https://calendar.google.com/calendar?cid=OGRsNW5vYTJiMG1oM2hub3F1M3BiMWE4b2NAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ)... you know, if you just want the data and don't care much about the AWS part.

### How do I get set up? ###

* What you need
    1. [Node.js](https://nodejs.org) v6.5.0 or later.
	    1. **Important note!** AWS Lambda currently only supports Node.js 4.3 and 6.10. **I recommend installing [6.10.2 LTS](https://nodejs.org/en/blog/release/v6.10.2/)** to reduce headache.
    2. [Serverless](https://www.serverless.com) v1.9.0 or later.
    3. An [AWS account](https://aws.amazon.com). A free tier is available.
    4. (Optional) A [Google Calendar integration](#how-do-i-integrate-with-google-calendar)
* What you do
    1. Set up your environment, referencing the [serverless quickstart documentation](https://serverless.com/framework/docs/providers/aws/guide/quick-start)
    	* Make sure to [configure serverless to use your AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials#using-aws-profiles)
    2. Clone the repository
	    * ``` git clone https://github.com/richardleesimpson/henderson-recycling-schedule-reader.git ```
    3. From the directory, download dependencies with node
	    * ``` npm install ```
    5. Deploy the application to your AWS instance, which creates the resources you need to run the function
	    * ``` serverless deploy ```
    6. Verify that you can run the function
	    * ``` serverless invoke local --function getschedule ```
	7. (Optional) Set up an AWS Lambda trigger to run the function automatically.
	8. Celebrate. You have data now. Go forth and conquer!

### How do I integrate with Google Calendar? ###

Want to integrate with your own calendar? Don't bang your head against the wall like I did trying to figure it out. Follow these steps instead!

1. See [this handy tutorial](https://neal.codes/blog/google-calendar-api-on-g-suite/)  for setup.
2. Download your service account's private key and add it as **gcal/private_key.json**
3. Create a **gcal/config.json** file with the following format:
	* ``` { "calendar_id": "YOUR_CALENDAR_ID_HERE" } ```
4. Redeploy to your AWS instance. New calendar events should now be created when the process runs.

### Just give me the calendar already! ###

[As you wish.](https://calendar.google.com/calendar?cid=OGRsNW5vYTJiMG1oM2hub3F1M3BiMWE4b2NAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ)

### Who do I talk to? ###

* [richardleesimpson@gmail.com](mailto:richardleesimpson@gmail.com)
