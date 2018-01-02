// Conversion Tracker Script

// Select the account
// Spreadsheet init
// Select the current Max Clicks Campaign that is enabled
// Grab the current Conversions and Conversion Rate
// Conditional check to see if the conversions are over 0
// Conditional check to see if the conversion rate is above or below the provided conversion or conversion rate variable

function main() {
    // select the current account
    var currentAccount = AdWordsApp.currentAccount();
    var accountName = currentAccount.getName();

    // spreadsheet init
    // add spreadsheet link here
    var spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1tVgxuqdEaVoaSGMbu-8q2d9Ck8taShzGMzkus9JMzqk/edit?usp=sharing';
        // Log spreadsheet url
        Logger.log('Using spreadsheet - %s.', spreadsheet_url);
        // open ss
        var spreadsheet = SpreadsheetApp.openByUrl(spreadsheet_url);
        // init sheet - update for the sheet number
        var sheet = spreadsheet.getSheets()[0];
    
    var emailForNotify = sheet.getRange(2,5);
    // Email function to pass string and send through to email provided
    function notify(string) {
        MailApp.sendEmail(emailForNotify, accountName, string);
    };

    // Grab Spreadsheet Data from the google spreadsheet
    var account = sheet.getRange(2,2);
    // Spreadsheet variable to apply for tracking (Conversion amount you want to be above)
    var conversionVariable = sheet.getRange(2,3);

    // Selector for the current enabled campaign
    var campaignSelector = AdWordsApp
        .campaigns()
        .withCondition("Status = ENABLED");
    // Get all the enabled campaigns
    var campaignIterator = campaignSelector.get();
    // Loop over the enabled campaigns - log out the data needed - add stats to the spreadsheet
    while(campaignIterator.hasNext()) {
        var campaign = campaignIterator.next();

       Logger.log("Campaign Name: " + campaign.getName());
       // Get the bidding strategy to make sure the campaign is Max Clicks ("TARGET_SPEND")
       var currentBiddingStrategy = campaign.getBiddingStrategyType();
       Logger.log("Current Bidding Strategy: " + currentBiddingStrategy);
       // Get the current conversion and conversion rate stats
       var currentStats = campaign.getStatsFor("THIS_MONTH");
       var currentClicks = currentStats.getClicks();
       var currentCost = currentStats.getCost();
       var currentConversions = currentStats.getConversions();
       var currentConversionRate = currentStats.getConversionRate();

       // Get the range to input the stats data into the spreadsheet (array, range, setvalues)
       var statsArray = [[currentClicks, currentCost, currentConversions, currentConversionRate]];
       var statsRange = sheet.getRange('B4:E4');
       statsRange.setValues(statsArray);
    }

    // Grab the cells from the spreadsheet to input tracking information
    var conversionCell = sheet.getRange(6,3);
    var conversionRateCell = sheet.getRange(6,4);

    if(currentConversions <= 0 && currentBiddingStrategy === "TARGET_SPEND") {
        Logger.log("Campaign currently has no conversions");
        // notify("Campaign currently has no conversions");
    }
    else if(currentConversions > conversionVariable) {
        Logger.log("Campaign is tracking above Conversion Variable");
        // notify("Campaign conversions currently tracking above the Conversion Variable");
        conversionCell.setValues("GOOD");
    }
    else if(currentConversions < conversionVariable) {
        Logger.log("Campaign conversions is not tracking above Conversion Variable");
        // notify("Campaign conversions currently tracking below Conversion Variable for this account");
        conversionCell.setValues("BAD");
    }
    else {
        Logger.log("An error has occured, please look into this account");
        // notify("Campaign conversions currently has an error with Conversion Tracking");
    }

    if(currentConversionRate < conversionRateVariable) {
        Logger.log("Conversion Rate is below conversion rate variable");
        // notify("Campaign conversion rate currently tracking below conversion rate tracking variable");
        conversionRateCell.setValues("BAD");
    }
    else if(currentConversionRate > conversionRateVariable) {
        Logger.log("Conversion Rate is tracking above conversion rate variable");
        // notify("Campaign conversion rate currently tracking above conversion rate tracking variable");
        conversionRateCell.setValues("GOOD");
    }
    else {
        Logger.log("Campaign conversion rate has thrown an error - please look into this account");
        // notify("Campaign conversion rate currently has thrown an error on this account - please look into this.")
    }
}