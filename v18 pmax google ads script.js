// copyright Gordon Geraghty 2023 (c)
// EssenceMediacom was approved to use this script by the original creater 'Mike Rhodes' on 24-03-2023
// EssenceMediacom has updated this scirpt to includ more metrics, a longer date range and
// This script is works on the account level, not MCC. Any questions, please email me gordon.geraghty@essencemediacom.com for more info
// or connect on LinkedIn at https://www.linkedin.com/in/gordonkgeraghty/
//
// PLEASE NOTE: this script is designed for campaigns with a product feed (ie ecommerce accounts ONLY)
// Because all the data is held at the Listing Group level, it’s IMPOSSIBLE to get useful charts & data for Lead Gen accounts
// Please yell at Google, not me :)
//
// version 14 (added an editable date range which looks at the past 181 days and 1 day ago)
//
// INSTRUCTIONS:         ——— PLEASE READ ———
// 
// COPY this template Google Sheet:  
// https://docs.google.com/spreadsheets/d/1bS6gclUkGCA7lAimHmZf9NjbWU6UQhjMA2IOWNRcjeE/copy
//
// now grab the URL of YOUR sheet & enter it below in the line that starts 'let ss =' (put the URL between the single quotes)
//
//
// authorise, save & run your script
// once it’s all working, set the schedule to run daily
//
// thanks for reading :)

    function main() {

      // START EDITING
      let ss = SpreadsheetApp.openByUrl(' ');          // enter the URL of YOUR sheet over there <—
      var zombieDays = 366   // how many days data do you want to use to identify zombie (0 click) products?
      // STOP EDITING

      // Google Sheet Variables start
      var sheetSettings = SpreadsheetApp.openByUrl(ss).getSheetByName('settings');
      var sheetStartDate = sheetSettings.getRange('A1').getValues()[0][1]; // get the start date value from the sheet
      var sheetEndDate = sheetSettings.getRange('B1').getValues()[0][1]; // get the end date value from the sheet
      Logger.log(sheetStartDate + sheetEndDate);
      sheetStartDate = parseFloat(sheetStartDate);   
      sheetEndDate = parseFloat(sheetEndDate);  
      Logger.log('new StartDate: ' + sheetStartDate);
      Logger.log('new EndDate: ' + sheetEndDate);
      var campaignStartDate = sheetStartDate; // yyyymmdd (e.g. 20220908)
      var campaignEndDate = sheetEndDate; // yyyymmdd (e.g. 20220908)
      // Google Sheet Variables end

      // created date range
      // start date 181 days ago formatted as yyyymmdd (e.g. 20220908)
      var today = new Date();
      var yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      var startDate = new Date(yesterday);
      startDate.setDate(startDate.getDate() - 180);  // Output in format yyyymmdd (e.g. 20220908)
      var formattedStartDate = startDate.getFullYear() +
      ("0" + (startDate.getMonth() + 1)).slice(-2) +
      ("0" + startDate.getDate()).slice(-2);
      console.log(formattedStartDate);
      // end date range, yesterday formatted as yyyymmdd (e.g. 20220908)
      yesterday.setDate(today.getDate() - 1);
      var endDate = yesterday.getFullYear() + ("0" + (yesterday.getMonth() + 1)).slice(-2) + ("0" + yesterday.getDate()).slice(-2);
      console.log(endDate); // Output in format yyyymmdd (e.g. 20220908)
 
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
        let adgName     = ' ad_group.name ';
        let adStatus    = ' ad_group_ad.status ';
        let adPerf      = ' ad_group_ad_asset_view.performance_label ';
        let adType      = ' ad_group_ad_asset_view.field_type ';
        let aIdAsset    = ' asset.resource_name ';  
        let aId         = ' asset.id ';
        let assetType   = ' asset.type ';
        let aFinalUrl   = ' asset.final_urls ';
        let assetName   = ' asset.name ';
        let assetText   = ' asset.text_asset.text ';
        let assetSource = ' asset.source ' ; 
        let adUrl       = ' asset.image_asset.full_size.url ';
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
        let searchOnly  =	' AND campaign.advertising_channel_type = "SEARCH" ';   
        let agFilter    =	' AND asset_group_listing_group_filter.type != "SUBDIVISION" ';   
        let adgEnabled  = ' AND ad_group.status = "ENABLED" AND campaign.status = "ENABLED" AND ad_group_ad.status = "ENABLED" ';
        let asgEnabled  = ' asset_group.status = "ENABLED" AND campaign.status = "ENABLED" ';           
        let notInter    = ' AND segments.asset_interaction_target.interaction_on_this_asset != "TRUE" ';
        let inter       = ' AND segments.asset_interaction_target.interaction_on_this_asset = "TRUE" ';
        let date07      = ' segments.date DURING LAST_7_DAYS ';  
        let date30      = ' segments.date DURING LAST_30_DAYS ';  
        let order       = ' ORDER BY campaign.name '; 
        let orderImpr   = ' ORDER BY metrics.impressions DESC '; 
        
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
            ' WHERE segments.date BETWEEN ' + campaignStartDate + ' AND ' + campaignEndDate + date30 + pMaxOnly + order ; 
        
        let dv = [campName, aIdCamp, cost, conv, value, views, cpv, impr, clicks, chType, interAsset] // inter by day
        let dvQuery = 'SELECT ' + dv.join(',') + 
            ' FROM campaign ' +
            ' WHERE segments.date BETWEEN ' + campaignStartDate + ' AND ' + campaignEndDate + date30 + pMaxOnly + notInter + order ; 
        
        let p = [campName, prodTitle, cost, conv, value, impr,chType,prodID,prodC0,prodC1,prodC2,prodC3,prodC4,prodT1,prodT2,prodT3,prodT4,prodT5] // product totals 
        let pQuery = 'SELECT ' + p.join(',')  + 
            ' FROM shopping_performance_view  ' + 
            ' WHERE segments.date BETWEEN ' + campaignStartDate + ' AND ' + campaignEndDate + date30 + pMaxOnly + order ; 
        
        let ag = [segDate, campName, asgName, agStrength, agStatus, lgType, impr, clicks, cost, conv, value] // asset group by day
        let agQuery = 'SELECT ' + ag.join(',')  + 
            ' FROM asset_group_product_group_view ' +
            ' WHERE segments.date BETWEEN ' + campaignStartDate + ' AND ' + campaignEndDate + date30 + agFilter ;
      
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
        const report = AdsApp.report(q);
        report.exportToSheet(sh);  
      }