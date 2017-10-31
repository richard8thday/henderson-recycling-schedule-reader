const cheerio = require('cheerio');
const moment = require('moment');

function extractPickupsFromHTML(html) {
  // Load the html string
  const $ = cheerio.load(html);

  // Get relevant paragraph elements. Unfortunately, this is as specific as the poorly-laid-out website will allow us to get
  const elements = $('html > body > table > tbody > tr > td > table > tbody > tr > td > p');

  // Create a list to hold data
  const data = [];

  // Iterate over elements
  elements.each((i, el) => {
    // If the element contains a break, it is the list of dates
    if ($(el).children('br').length > 0) {
      // Split the dates by newline
      let dates = $($(el).text().split("\n"));
      
      // Iterate over the dates in the element
      dates.each((j, v) => {
        // Retrieve the value
        let value = v.trim();

        // Convert to a date
        let date = moment(value, 'MMM DD, YYYY').toISOString();

        // Add the date to the list
        data.push(date);
      });
    }
  });

  return data;
}

module.exports = {
  extractPickupsFromHTML
};