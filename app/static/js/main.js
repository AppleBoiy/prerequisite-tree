async function convertSpreadsheetToJson() {
    return new Promise( async (resolve, reject) => {
        try {
            const XLSX = require("xlsx");

            // get link input
            const spreadsheetLinkInput = "https://cmu.to/UP5em";

            // build list of array rows from spreadsheet to jsonData
            const response = await fetch(spreadsheetLinkInput);
            const data = await response.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
            // Define the range of rows and columns
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            range.s.r = 1; // Start from the first row
            range.e.r = 19; // End at the 20th row
            range.s.c = 1; // Start from the first column
            range.e.c = 8; // End at the 8th column
            // import data in list from to jsonData
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range });
            //console.log(jsonData);

            // Convert the jsonData into an array of objects
            const result = [];
            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                const obj = {};
                for (let j = 0; j < row.length; j++) {
                const headerCell = jsonData[0][j];
                    obj[headerCell] = row[j];
                }
                result.push(obj);
            }

            resolve(result);
        } catch (error) {
          reject(error);
        }
    });
}

async function handleHover() {
    // new data from spreadsheet
    const rawData = await convertSpreadsheetToJson();
    console.log(rawData)

}

handleHover().then(
    () => console.log("Get data success")
);
