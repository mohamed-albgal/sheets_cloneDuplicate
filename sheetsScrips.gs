


function importTemplateAndDuplicate(targetID) {
/*
  **this will delete everything in the new spreadsheet**
  call this to copy this master sheet (@template) to any spreadsheet
  get the clone ID from the spreadsheet's url
  enter it into the run function
  this will then:
     copy the template into the clone
     delete all pre-existing sheets (tabs)
     create new sheets(tabs) each being named as the first word of the spreadsheet's title
     
*/
    const thisSheet = SpreadsheetApp.getActiveSpreadsheet();
    const clone = SpreadsheetApp.openById(targetID);
    const sheets = thisSheet.getSheets()
    const templateIndex = getTemplateIndex(sheets);
    const template = thisSheet.getSheets()[templateIndex];
    template.copyTo(clone);
    //take control of the clone's content
    SpreadsheetApp.setActiveSpreadsheet(clone);
    deleteExistingSheets();
    duplicateTemplateForWholeMonth();
}

function getTemplateIndex(sheets) {
  //template is not always the first sheet in the set of sheets, need to find it
  //assumes template tab name contains "@template"
  return sheets.findIndex( x => x.getName().includes("@template"));
}

function deleteExistingSheets() {
  const thisSheet = SpreadsheetApp.getActiveSpreadsheet(); 
  const sheets = thisSheet.getSheets();
  const templateIndex = getTemplateIndex(sheets);
  sheets.forEach((x,i) => { if ( i !== templateIndex) thisSheet.deleteSheet(x);});
}

function duplicateTemplateForWholeMonth(){
  const thisSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = thisSheet.getSheets();
  const name = thisSheet.getName().match(/[^\d\W]/g).join('');
  const templateIndex = getTemplateIndex(sheets);
  const template = sheets[templateIndex];
  const year = new Date().getFullYear().toString();
  const numberOfDays = ['February', 'April','June','September','November'].includes(name) ? 30 : 31;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  for( let i = 0; i < numberOfDays ; i++ ) {
    let wholeDate = `${name} ${i + 1} ${year}`;
    let index = new Date(wholeDate).getDay();
    let day = days[index];
    let sh = thisSheet.insertSheet(wholeDate ,i, {template: template})
    sh.getRange('A1').setValue(`${day || ""}   ${wholeDate}`);
  }
  //remove the template, since each sheet is inserted right before the template, its always at the end
  thisSheet.deleteSheet(sheets.pop());
}

function run(){
  const ui = SpreadsheetApp.getUi();
  const id = ui.prompt(
    `Enter the spreadsheet ID, homes. Make sure its title begins with a title-cased month. 
    Note: this is a nuclear operation, you better not love anything located in the target
    spreadsheet`).getResponseText();
  if(id)
    importTemplateAndDuplicate(id);
  else ui.alert("no changes made.");
}
