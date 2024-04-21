// These instructions are only needed if you are customizing the starting column to detect changes, or the first visible sheet is not the one to monitor
// otherwise, just use the System menu in the spreadsheet
// 
// //System installation:
// 1. Fill the configuration section below and save this file
// 2. Run installOnce() or run the System-Install menu in the sheet

// CONFIGURATION:
const g_firstColIndex = 2;    //First column to detect color changes (A=1, B=2, ...)
const g_sheetName = "";       //if empty, will use the first visible sheet
// END OF CONFIGURATION

const g_bDebug=false;

function installOnce() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var listTriggers = ScriptApp.getProjectTriggers();

  if (listTriggers.length == 3) {
    log("Already was installed!");
    setInstalled(true);
    return;
  }

  setInstalled(false);
  if (listTriggers.length != 0) {
    log("Cleaning up previous triggers...");
    listTriggers.forEach(t => ScriptApp.deleteTrigger(t));
  }

  onTimeBased(); //call now so it asks for the right permissions.
  ScriptApp.newTrigger("onEditEvent").forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger("onChangeEvent").forSpreadsheet(ss).onChange().create();
  ScriptApp.newTrigger("onTimeBased").timeBased().everyMinutes(10).create();
  setInstalled(true);
  log("Installed OK!");

  function setInstalled(bInstall) {
    if (bInstall)
      PropertiesService.getScriptProperties().setProperty("installed", "true");
    else
      PropertiesService.getScriptProperties().deleteProperty("installed");
  }
}

function installOnceFromMenu() {
  installOnce();
  showLogs();
}


function onOpen() {
  openSidebar();
  if (PropertiesService.getScriptProperties().getProperty("installed") == "true")
    return;
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('System') // Create a new menu in the spreadsheet UI
    .addItem('Install', 'installOnceFromMenu')
    .addToUi();
}

var g_logs = [];

function log(str) {
  Logger.log(str);
  g_logs.push(str);
}

function showLogs() {
  const str = g_logs.join('\n');
  if (str)
    SpreadsheetApp.getUi().alert(str);
}

