//MODEL
//


function updateColumnA(ss, sheet, rowStart, rowEnd) {
  const startRow = Math.max(sheet.getFrozenRows() + 1, 2, rowStart); //assumes at least one row for header. considers more if frozen
  const lastRow = rowEnd || sheet.getLastRow();
  assert(lastRow >= startRow);
  const firstColIndex = g_firstColIndex;
  const lastColIndex = sheet.getLastColumn();
  assert(lastColIndex >= firstColIndex);
  var rangeA = sheet.getRange(startRow, 1, lastRow - startRow + 1, 1);
  const valuesAOld = rangeA.getValues();
  const formulasAOld = rangeA.getFormulas();
  const bkAOld = rangeA.getBackgrounds();
  const backgrounds = sheet.getRange(startRow, firstColIndex, lastRow - startRow + 1, lastColIndex - firstColIndex + 1)
    .getBackgrounds();

  if (g_bDebug)
    log("startRow:" + startRow + " lastRow:" + lastRow);
  
  var dataANew = {
    bk: [],
    colorFont: [],
    value: [],
    bClearedPending: false,
    bChanged: false,
  };

  processRows(sheet, startRow, firstColIndex, rangeA, backgrounds, valuesAOld, formulasAOld, bkAOld, dataANew);

  if (dataANew.bChanged) {
    rangeA.setBackgrounds(dataANew.bk);
    rangeA.setFontColors(dataANew.colorFont)
    rangeA.setValues(dataANew.value);
    if (dataANew.bClearedPending)
      ss.toast("💙");
    if (g_bDebug)
      ss.toast(dataANew.value.length);
  } else {
    if (g_bDebug)
      ss.toast(0);
  }
}

function processRows(sheet, startRow, firstColIndex, rangeA, backgrounds, valuesAOld, formulasAOld, bkAOld, dataANew) {
  const idSheet = sheet.getSheetId();
  const formulasOld = rangeA.getFormulas();
  assert(formulasOld.length == backgrounds.length);
  assert(formulasOld.length == valuesAOld.length);
  assert(valuesAOld.length == bkAOld.length);
  assert(valuesAOld.length == formulasAOld.length);

  // ↓
  for (var i = 0; i < backgrounds.length; i++) {
    const row = backgrounds[i];
    var columnColoredFirst = null;
    var colorFont = "#000000";
    var bk = "#ffffff";
    var val = valuesAOld[i][0];
    if (val) {
      // →
      for (var j = 0; j < row.length; j++) {
        if (row[j] && row[j] !== "#ffffff") {
          columnColoredFirst = firstColIndex + j;
          var rangeCellFound = sheet.getRange(startRow + i, columnColoredFirst);
          const coloredCellAddress = rangeCellFound.getA1Notation();
          colorFont = rangeCellFound.getFontColorObject().asRgbColor().asHexString();
          bk = row[j];
          val =
            '=HYPERLINK("#gid='
            + idSheet + '&range=' + coloredCellAddress + '", "' + val + '")';
          break;
        }
      }
    }

    if (!columnColoredFirst && formulasOld[i][0])
      dataANew.bClearedPending = true;

    dataANew.bk.push([bk]);
    dataANew.colorFont.push([colorFont]);
    dataANew.value.push([val]);

    if ((val != valuesAOld[i][0] && val != formulasAOld[i][0]) || (bk || "").toLowerCase() != (bkAOld[i][0] || "").toLowerCase()) {
      if (g_bDebug) {
        log(i);
        log(valuesAOld[i][0]);
        log(formulasAOld[i][0]);
        log(val);
        log(bkAOld[i][0]);
        log(bk);
      }
      dataANew.bChanged = true;
    }
  }
}



