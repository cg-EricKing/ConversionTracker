// DashHound Conversion Tracking Script

// Select the current account
// Select the current Max Clicks Campaign that is enabled
// Grab the current Conversions and Conversion Rate
// Conditional check to see if the conversions are over 0
// Conditional check to see if the conversion rate is above or below the provided conversion or conversion rate variable

function main() {
    // select the current account
    var currentAccount = AdWordsApp.currentAccount();
    var accountName = currentAccount.getName();
    
    var conversionVariable = 0;

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

       Logger.log("Campaign Stats: " + "Conversions: " + currentConversions + "ConversionRate: " + currentConversionRate +
        "Cost: " + currentCost + "currentClicks: " + currentClicks);
    }

    if(currentConversions <= 0 && currentBiddingStrategy === "TARGET_SPEND") {
        Logger.log("Campaign currently has no conversions");
    }
    else if(currentConversions > conversionVariable) {
        Logger.log("Campaign is tracking above Conversion Variable");
    }
    else if(currentConversions < conversionVariable) {
        Logger.log("Campaign conversions is not tracking above Conversion Variable");
    }
    else {
        Logger.log("An error has occured, please look into this account");
    }

    if(currentConversionRate < conversionRateVariable) {
        Logger.log("Conversion Rate is below conversion rate variable");
    }
    else if(currentConversionRate > conversionRateVariable) {
        Logger.log("Conversion Rate is tracking above conversion rate variable");
    }
    else {
        Logger.log("Campaign conversion rate has thrown an error - please look into this account");
    }
}