const cheerio = require('cheerio');
const moment = require('moment');

function extractPickupsFromHTML(html) {
  // Load the html string
  const $ = cheerio.load(html);

  // Create a list to hold data
  const data = [];

  // Get all the elements on the page, since there is no consistent or well-defined structure
  const elements = $('*');

  // Iterate over elements on the page
  elements.each((i, el) => {
    // Retrieve the text value
    let value = $(el).text().trim().replace(/ *\([^)]*\) */g, '');

    // Attempt date conversion
    let date = getValidDate(value);

    // If the date conversion was successful, add it to the list
    if (date != null) {
      data.push(date);
    }
  });

  // Return the distinct list of dates on the page
  return data.filter(function(elem, pos) {
    return data.indexOf(elem) == pos;
  });
}

function getValidDate(value) {
  // Define an array of supported date formats
  const supportedFormats = [
    'MMM D, YYYY',
    'MMM DD, YYYY',
    'MMMM D, YYYY',
    'MMMM DD, YYYY'
  ];

  // Iterate over supported formats
  for (var i = 0; i < supportedFormats.length; i++) {
    // If moment can convert to a date using strict parsing of this format, return the date
    if (moment(value, supportedFormats[i], true).isValid()) {
      return moment(value, supportedFormats[i], true).toISOString();
    }
  }

  // If the date could not be parsed from our supported formats, return null
  return null;
}

module.exports = {
  extractPickupsFromHTML
};