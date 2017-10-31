# henderson-recycling-schedule-reader #

### Table of contents ###
* [What is this repository for?](#what-is-this-repository-for)
* [How do I get set up?](#how-do-i-get-set-up)
* [Who do I talk to?](#who-do-i-talk-to)

### What is this repository for? ###

The city of Henderson, TN has a website that displays its Recycling Program pickup schedule. Schedule information is only available as static text on the site, which makes it less than convenient to access—especially when you are walking out the door in the morning en route to work and can't remember if you need to put out the recycling bin. In addition, the page is updated periodically and historical data is lost.

This project is the first piece of making this information easier to digest. It scrapes the site and writes the resultant data to AWS DynamoDB for further processing. Once deployed, a Lambda script can be leveraged to run this automatically and keep the database up to date.

Improvements I'd like to do:

* Read data from previous runs to compare with newly scraped data
* Send new/updated data to another endpoint like a calendar

### How do I get set up? ###

* What you need
    1. [Node.js](https://nodejs.org) v6.5.0 or later
    2. [Serverless](https://www.serverless.com) v1.9.0 or later
    3. An [AWS account](https://aws.amazon.com). A free tier is available.
* What you do
    1. Set up your environment, referencing the [serverless quickstart documentation](https://serverless.com/framework/docs/providers/aws/guide/quick-start)
    2. Clone the repository
	    * ``` git clone https://github.com/richard8thday/henderson-recycling-schedule-reader.git ```
    3. From the directory, download dependencies with node
	    * ``` npm install ```
    5. Deploy the application to your AWS instance, which creates the resources you need to run the function
	    * ``` serverless deploy ```
    6. Verify that you can run the function
	    * ``` serverless invoke local --function getschedule ```
	7. Celebrate. You have data now. Go forth and conquer!

### Who do I talk to? ###

* [richard@8thdaysoftware.com](mailto:richard@8thdaysoftware.com)