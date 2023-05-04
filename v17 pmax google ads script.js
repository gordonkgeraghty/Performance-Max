/ copyright Gordon Geraghty 2023 (c)
// for more training & resources to help you get great results at google ads
//
// Yes we also manage accounts - just email me gordon.geraghty@essencemediacom.com for more info
// or connect on LinkedIn at https://www.linkedin.com/in/gordonkgeraghty/
// gordon.geraghty@essencemediacom.com
//
//
// PLEASE NOTE: this script is designed for campaigns with a product feed (ie ecommerce accounts ONLY)
// Because all the data is held at the Listing Group level, it’s IMPOSSIBLE to get useful charts & data for Lead Gen accounts
// Please yell at Google, not me :)
//
// version 14 (added an editable date range which looks at the past 181 days and 1 day ago)
//
//
//
// INSTRUCTIONS:         ——— PLEASE READ ———
// 
// COPY this template Google Sheet:  
// https://docs.google.com/spreadsheets/d/1bS6gclUkGCA7lAimHmZf9NjbWU6UQhjMA2IOWNRcjeE/copy
//
// now grab the URL of YOUR sheet & enter it below in the line that starts 'let ss =' (put the URL between the single quotes)
//
// name your script: WebSavvy: pMax charts v13 (updates daily)
// name your sheet: {client name or code} - pMax charts v13 (updates daily)
//
// authorise, save & run your script
// once it’s all working, set the schedule to run daily
//
// thanks for reading :)
function main() {
    // START EDITING
      let ss = SpreadsheetApp.openByUrl(' ');          // enter the URL of YOUR sheet over there <—
      var campaignStartDate = ' 20210101 '; // yyyymmdd (e.g. 20220908)
      var campaignEndDate = ' 20230131 '; // yyyymmdd (e.g. 20220908)
      // STOP EDITING
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
      // no need to touch any code below this line ——————————————————————————
      // define commonly used query elements. wrap with spaces for safety
      let segDate     = ' segments.date ';
      let impr        = ' metrics.impressions ';
      let clicks      = ' metrics.clicks ';
      let cost        = ' metrics.cost_micros ';
      let conv        = ' metrics.conversions '; 
      let value       = ' metrics.conversions_value '; 
      let views       = ' metrics.video_views ';
      let cpv         = ' metrics.average_cpv ';
      let prodTitle   = ' segments.product_title ';
      let name        = ' campaign.name ';
      let campId      = ' campaign.id ';
      let cType       = ' campaign.advertising_channel_type ';
      let agId        = ' asset_group.id ';  
      let adPerformance = ' asset_group_asset.performance_label ';
      let assetText   = ' asset.text_asset.text ';
      let assetSource = ' asset.source ' ; 
      let assetFieldType   = ' asset_group_asset.field_type ';
      let assetType   = ' asset_group_asset.asset_type ';
      let agStrength  = ' asset_group.ad_strength ';
      let agStatus    = ' asset_group.status ';
      let agName      = ' asset_group.name ';
      let lgName      = ' asset_group_listing_group_filter.case_value.product_custom_attribute.value ';
      let lgType      = ' asset_group_listing_group_filter.type ';
      let pMaxOnly    = ' AND campaign.advertising_channel_type = "PERFORMANCE_MAX" '; 
      let agFilter    = ' AND asset_group_listing_group_filter.type != "SUBDIVISION" ';   
      let agEnabled   = ' asset_group.status = "ENABLED" AND campaign.status = "ENABLED" ';
      let date07      = ' segments.date DURING LAST_7_DAYS '
      let date30      = ' segments.date DURING LAST_30_DAYS '  
      var date180     = ' segments.date BETWEEN ' + campaignStartDate + ' AND ' + endDate
      console.log(date180);
      let order       = ' ORDER BY campaign.name';           
      // build queries
      let cd = [segDate, name, cost, conv, value, views, cpv, impr, cType]
      let campQuery = 'SELECT ' + cd.join(',') + 
          ' FROM campaign ' +
          ' WHERE segments.date BETWEEN ' + campaignStartDate + ' AND ' + campaignEndDate
          + pMaxOnly + order ; 
      let p = [name, prodTitle, cost, conv, value, impr, cType]
      let pQuery = 'SELECT ' + p.join(',')  + 
          ' FROM shopping_performance_view  ' + 
          ' WHERE segments.date BETWEEN ' + campaignStartDate + ' AND ' + campaignEndDate 
          + pMaxOnly + order ; 
      let ag = [segDate, name, agName, agStrength, agStatus, lgName, lgType, impr, clicks, cost, conv, value]   
      let agQuery = 'SELECT ' + ag.join(',')  + 
          ' FROM asset_group_product_group_view ' +
          ' WHERE segments.date BETWEEN ' + campaignStartDate + ' AND ' + campaignEndDate 
          + agFilter
      let ads = [assetFieldType, assetText, adPerformance, name, agName, agStrength, agStatus, assetSource, campId, agId]   
      let adsQuery = 'SELECT ' + ads.join(',')  + 
          ' FROM asset_group_asset ' +
          ' WHERE ' + agEnabled;
      // call report function to pull data & push to named tabs in the sheet
      runReport(campQuery, ss.getSheetByName('raw_campaigns'));  
      runReport(pQuery, ss.getSheetByName('raw_products_tot')); 
      runReport(agQuery, ss.getSheetByName('raw_asset_groups')); 
      runReport(adsQuery, ss.getSheetByName('raw_ads')); 
    }
    function runReport(q,sh) {
      const report = AdsApp.report(q);
      report.exportToSheet(sh);  
    }