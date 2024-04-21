//UTILITIES
//

function getSheet(ss) {
  if (g_sheetName)
    return ss.getSheetByName(g_sheetName);
  var sheets = ss.getSheets();
  var sheet = null;

  for (var i = 0; i < sheets.length; i++) {
    if (!sheets[i].isSheetHidden()) {
      sheet = sheets[i];
      break;
    }
  }
  assert(sheet);
  return sheet;
}

function assert(expression) {
  if (!expression) {
    Logger.log(getStackTrace("assert failed!"));
    throw new Error("bye");
  }
}

const getStackTrace = function(message) {
  let s = `Error: ${message}\n`;
  (new Error()).stack
               .split('\n')
               .forEach((token)=>
               {s += `\t${token.trim()}\n`}
  );      
  return s;
}
