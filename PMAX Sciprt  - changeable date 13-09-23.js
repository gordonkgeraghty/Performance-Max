function main() {

  // START EDITING
  let ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1j3Ofm55gO_TZaNaEoejobiRW7E3oQE4LDriA5RKPuhs/edit#gid=289764811');          // enter the URL of YOUR sheet over there <—
  var zombieDays = 366   // how many days data do you want to use to identify zombie (0 click) products?
  // STOP EDITING

   // Google Sheet Variables start
   var sheetSettings = ss.getSheetByName('Settings');
   if(!sheetSettings) {
   Logger.log("Settings sheet not found in the template.");
   return;
   }
   var sheetStartDate = sheetSettings.getRange('A2').getValues()[0][0]; // get the start date value from the sheet
   var sheetEndDate = sheetSettings.getRange('B2').getValues()[0][0]; // get the end date value from the sheet
   Logger.log(sheetStartDate + sheetEndDate);
   var campaignStartDate = Utilities.formatDate(new Date(sheetStartDate), "GMT", "yyyy-MM-dd"); // yyyymmdd (e.g. 2022-09-08)
   var campaignEndDate = Utilities.formatDate(new Date(sheetEndDate), "GMT", "yyyy-MM-dd"); // yyyymmdd (e.g. 2022-09-08)
   // Google Sheet Variables end
   Logger.log("Campaign Start Date: " + campaignStartDate);
   Logger.log("Campaign End Date: " + campaignEndDate);

  // don’t change any code below this line ——————————————————————————
            // define query elements. wrap with spaces for safety
            let impr        = ' metrics.impressions ';
            let clicks      = ' metrics.clicks ';
            let cost        = ' metrics.cost_micros ';
            let conv        = ' metrics.conversions '; 
            let value       = ' metrics.conversions_value '; 
            let allConv     = ' metrics.all_conversions '; 
            let allValue    = ' metrics.all_conversions_value '; 
            let views       = ' metrics.video_views ';
            let cpv         = ' metrics.average_cpv ';
            let segDate     = ' segments.date ';  
            let prodTitle   = ' segments.product_title ';
            let prodID      = ' segments.product_item_id ';
            let prodC0      = ' segments.product_custom_attribute0 ';
            let prodC1      = ' segments.product_custom_attribute1 ';
            let prodC2      = ' segments.product_custom_attribute2 ';
            let prodC3      = ' segments.product_custom_attribute3 ';
            let prodC4      = ' segments.product_custom_attribute4 '; 
            let prodT1      = ' segments.product_type_l1 ';
            let prodT2      = ' segments.product_type_l2 ';
            let prodT3      = ' segments.product_type_l3 ';
            let prodT4      = ' segments.product_type_l4 ';
            let prodT5      = ' segments.product_type_l5 ';
            let campName    = ' campaign.name ';
            let chType      = ' campaign.advertising_channel_type ';
            let aIdAsset    = ' asset.resource_name ';  
            let aId         = ' asset.id ';
            let assetType   = ' asset.type ';
            let aFinalUrl   = ' asset.final_urls ';
            let assetName   = ' asset.name ';
            let assetText   = ' asset.text_asset.text ';
            let assetSource = ' asset.source ' ; 
            let ytTitle     = ' asset.youtube_video_asset.youtube_video_title ';
            let ytId        = ' asset.youtube_video_asset.youtube_video_id ';
            let agId        = ' asset_group.id ';    
            let assetFtype  = ' asset_group_asset.field_type ';
            let adPmaxPerf  = ' asset_group_asset.performance_label ';  
            let agStrength  = ' asset_group.ad_strength ';
            let agStatus    = ' asset_group.status ';
            let asgName     = ' asset_group.name ';
            let lgType      = ' asset_group_listing_group_filter.type ';  
            let aIdCamp     = ' segments.asset_interaction_target.asset ';
            let interAsset  = ' segments.asset_interaction_target.interaction_on_this_asset ';
            let pMaxOnly    =	' AND campaign.advertising_channel_type = "PERFORMANCE_MAX" ';  
            let agFilter    =	' AND asset_group_listing_group_filter.type != "SUBDIVISION" ';   
            let adgEnabled  = ' AND ad_group.status = "ENABLED" AND campaign.status = "ENABLED" AND ad_group_ad.status = "ENABLED" ';
            let asgEnabled  = ' asset_group.status = "ENABLED" AND campaign.status = "ENABLED" ';           
            let notInter    = ' AND segments.asset_interaction_target.interaction_on_this_asset != "TRUE" ';
            let inter       = ' AND segments.asset_interaction_target.interaction_on_this_asset = "TRUE" ';
            let order       = ' ORDER BY campaign.name '; 
            let orderImpr   = ' ORDER BY metrics.impressions DESC '; 
    // define query elements
      function runReport(q,sh) {
      const report = AdsApp.report(q);
      report.exportToSheet(sh);  
    }
    
    //  Date stuff for Zombie products
    let MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
    let now = new Date();
    let from = new Date(now.getTime() - zombieDays * MILLIS_PER_DAY);       // xx days in the past  
    let to = new Date(now.getTime() - 1 * MILLIS_PER_DAY);                  // yesterday
    let timeZone = AdsApp.currentAccount().getTimeZone();
    let zombieRange = ' segments.date BETWEEN "' + Utilities.formatDate(from, timeZone, 'yyyy-MM-dd') + '" AND "' + Utilities.formatDate(to, timeZone, 'yyyy-MM-dd') + '"'
    
    // build queries                     
    let cd = [segDate, campName, cost, conv, value, views, cpv, impr, clicks, chType] // campaign by day
    let campQuery = 'SELECT ' + cd.join(',') + 
        ' FROM campaign ' +
        ' WHERE segments.date BETWEEN "' + campaignStartDate + '" AND "' + campaignEndDate + '"' + pMaxOnly + order ; 
    
    let dv = [segDate, campName, aIdCamp, cost, conv, value, views, cpv, impr, chType, interAsset] // inter by day
    let dvQuery = 'SELECT ' + dv.join(',') + 
        ' FROM campaign ' +
        ' WHERE segments.date BETWEEN "' + campaignStartDate + '" AND "' + campaignEndDate + '"' + pMaxOnly + notInter + order ; 
    
    let p = [campName, prodTitle, cost, conv, value, impr,chType,prodID,prodC0,prodC1,prodC2,prodC3,prodC4,prodT1,prodT2,prodT3,prodT4,prodT5] // product totals 
    let pQuery = 'SELECT ' + p.join(',')  + 
        ' FROM shopping_performance_view  ' + 
        ' WHERE segments.date BETWEEN "' + campaignStartDate + '" AND "' + campaignEndDate + '"' + pMaxOnly + order ; 
    
    let ag = [segDate, campName, asgName, agStrength, agStatus, lgType, impr, clicks, cost, conv, value] // asset group by day
    let agQuery = 'SELECT ' + ag.join(',')  + 
        ' FROM asset_group_product_group_view ' +
        ' WHERE segments.date BETWEEN "' + campaignStartDate + '" AND "' + campaignEndDate + '"' + agFilter ;
  
    let assets = [aId, aFinalUrl, assetSource, assetType, ytTitle, ytId, assetText, aIdAsset, assetName] // names, IDs, URLs for all ad assets in account
    let assetQuery = 'SELECT ' + assets.join(',')  + 
        ' FROM asset ' ;
    
    let ads = [campName, asgName, agId, aIdAsset, assetFtype, adPmaxPerf, agStrength, agStatus, assetSource] // pMax ads
    let adsQuery = 'SELECT ' + ads.join(',') +
        ' FROM asset_group_asset ' ;
    
    let zombies = [prodID, clicks, impr, prodTitle] // zombie (0click) products - last xx days, set xx days at top of script
    let zQuery = 'SELECT ' + zombies.join(',') +
        ' FROM shopping_performance_view ' +
        ' WHERE metrics.clicks < 1 AND ' + zombieRange + orderImpr ;  
    
    // call report function to pull data & push it to the named tabs in the sheet
    runReport(campQuery,  ss.getSheetByName('r_camp'));  
    runReport(dvQuery,    ss.getSheetByName('r_dv'));     
    runReport(pQuery,     ss.getSheetByName('r_prod_t')); 
    runReport(agQuery,    ss.getSheetByName('r_ag'));   
    runReport(assetQuery, ss.getSheetByName('r_allads'));
    runReport(adsQuery,   ss.getSheetByName('r_ads'));   
    runReport(zQuery,     ss.getSheetByName('zombies'));  
    
  } // end main
  // query & export report data to named sheet
function runReport(q,sh) {
  Logger.log("Executing query: " + q);
  const report = AdsApp.report(q);
  report.exportToSheet(sh);  
}