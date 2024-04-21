//Controllers
//


function onTimeBased() {
  return onChangeEvent(null);
}

function onChangeEvent(e) {
  //Note Session.getEffectiveUser() is the system admin
  if (e && e.changeType == "EDIT")
    return; //handled by the other trigger
  //handles manual color changes, paste, manual formatting, adding/removing rows, columns
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getSheet(ss);
  var rowStart = null;
  var rowEnd = null;
  if (e) {
    var sheetActive = ss.getActiveSheet();
    if (sheetActive) {
      if (sheetActive.getSheetId() != sheet.getSheetId())
        return;
      var range = sheetActive.getActiveRange();
      if (range) {
        rowStart = range.getRow();
        rowEnd = range.getLastRow();
      }
    }
  }
  updateColumnA(ss, sheet, rowStart, rowEnd);
}

function onEditEvent(e) {
  //Note Session.getEffectiveUser() is the system admin
  var rowStart = null;
  var rowEnd = null;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getSheet(ss);
  if (e && e.range) {
    if (e.range.getGridId() != sheet.getSheetId())
      return;
    //note: cant optimize by column range since a value before the range could be the one used to format "A"
    rowStart = e.range.getRow();
    rowEnd = e.range.getLastRow();
  }

  updateColumnA(ss, sheet, rowStart, rowEnd);
}


