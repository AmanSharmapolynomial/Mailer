const { MongoClient } = require("mongodb");
const XLSX = require("xlsx");

const fs = require("fs");
const citiess = require("../constants/cities");

const client = new MongoClient(process.env.connection_string);
const db = client.db("bot_conversations");
const workBook = XLSX.utils.book_new();
const logs = db.collection("logs");

const today = new Date();
const offset = today.getTimezoneOffset() * 60000; // Get the time zone offset in milliseconds
const startOfDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  0,
  0 - offset / 60000,
  0
);
// Start of the day (12:00 AM) adjusted for time zone
const endOfDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  23,
  59 - offset / 60000,
  59
);

const shona_logs = db.collection("shona_click_logs");
const SHEETDATA = async () => {

  //First Sheet
  const firstSheet = await shona_logs
    .find({ timestamp: { $gte: startOfDay, $lte: endOfDay } })
    .toArray();

  const FirstData = firstSheet.map(
    ({ conversation_id, timestamp, ip_address, clicked_query }) => ({
      conversation_id,
      timestamp: new Date(timestamp).toISOString(),
      ip_address,
      clicked_query
    })
  );
  const casingData = FirstData.map((obj) => {
    const newObj = {};
    for (let key in obj) {
      newObj[capitalizeFirstLetter(key)] = obj[key];
    }
    return newObj;
  });
  if (casingData.length > 0) {
    const workSheet1 = XLSX.utils.json_to_sheet(casingData);

    XLSX.utils.book_append_sheet(workBook, workSheet1, "click_logs");

    console.log("Button Sheet Created");
  }









  ////second sheet

  const secondSheet = await shona_logs
    .find({
      timestamp: { $gte: startOfDay, $lte: endOfDay },
      clicked_query: { $nin: ["Bangalore", "Pune", "Hyderabad", "Chennai"] }
    })
    .toArray(); // Finding all the documents of shona_logs except for the specified cities

  const map = new Map(); // Creating Map

  secondSheet.forEach((log) => {
    const { ip_address, clicked_query } = log;
    if (!map.has(clicked_query)) {
      map.set(clicked_query, new Set()); // Using Set to store unique IP addresses for each clicked_query
    }
    const ipAddresses = map.get(clicked_query);
    ipAddresses.add(ip_address);
  });

  // Create an array to store the result
  const result = [];

  // Iterate over the Map entries to construct the result
  for (const [Clicked_query, ipAddresses] of map.entries()) {
    const Count = ipAddresses.size; // Counting unique IP addresses for each clicked query
    result.push({ Clicked_query, Count });
  }

  if (result.length > 0) {
    const workSheet2 = XLSX.utils.json_to_sheet(result);

    XLSX.utils.book_append_sheet(workBook, workSheet2, "click_log_stats");

    console.log("Got data and created Second Excel sheet.");
  }


















  ////Third sheet

  const isoStartOfDay = startOfDay.toISOString();
  const isoEndOfDay = endOfDay.toISOString();

  // Query MongoDB using ISO string format for timestamps
  const thirdSheet = await logs
    .find({
      "meta_data.Timestamp": {
        $gte: isoStartOfDay,
        $lte: isoEndOfDay
      },
      bot_type: "Sales+CRM-Bot"
    })
    .toArray();

  //  converting timestamp to ISO string
  thirdSheet.forEach((item) => {
    item.meta_data.Timestamp = new Date(item.meta_data.Timestamp).toISOString();
    delete item.meta_data["Intent Name"];
  });
  const thirdSheetData = thirdSheet.map(({ meta_data }) => ({ ...meta_data }));

  if (thirdSheetData.length > 0) {
    const workSheet3 = XLSX.utils.json_to_sheet(thirdSheetData);

    XLSX.utils.book_append_sheet(workBook, workSheet3, "ThirdSheet");

    console.log("Got data and created Excel sheets.");
  }
















  /////Fourth Sheet

  const cities = ["Bangalore", "Pune", "Chennai", "Hyderabad"];
  const resultt = [];

  for (const City of cities) {
    // Fetch data from MongoDB for the current city and today's timestamp
    const cityData = await shona_logs
      .find({
        clicked_query: City,
        timestamp: { $gte: startOfDay, $lte: endOfDay }
      })
      .toArray();

    // Create a Set to store unique IP addresses
    const uniqueIPs = new Set();

    // Iterate over each log for the current city
    cityData.forEach((log) => {
      // Add the IP address to the Set
      uniqueIPs.add(log.ip_address);
    });

    // Push an object representing the city and the count of unique IP addresses to the result array
    resultt.push({ City, Count: uniqueIPs.size });
  }

  if (resultt.length > 0) {
    const workSheet4 = XLSX.utils.json_to_sheet(resultt);
    XLSX.utils.book_append_sheet(workBook, workSheet4, "City_click_logs_stats");
    console.log("Got data and created Second Excel sheet.");
  }

 //Fifth Sheet








  generateCitySubcityObjects(citiess)
    .then((citySubcityObjects) => {
      const workSheet5 = XLSX.utils.json_to_sheet(citySubcityObjects);

      XLSX.utils.book_append_sheet(
        workBook,
        workSheet5,
        "Subcity_click_logs_stats"
      );
      XLSX.writeFile(workBook, "./excelSheets/AllSheets.xlsx", {
        bookType: "xlsx"
      });
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
async function countUniqueOccurrences(subcity) {
  // Assuming you have a MongoDB collection named 'shona_logs'
  const cityData = await shona_logs.find({ clicked_query: subcity }).toArray();

  // Extract unique IP addresses
  const uniqueIPs = new Set(cityData.map((entry) => entry.ip_address));
  return uniqueIPs.size;
}
async function generateCitySubcityObjects(cityArray) {
  const citySubcityObjects = [];

  for (const city of Object.keys(cityArray)) {
    for (const subcity of cityArray[city]) {
      const uniqueCount = await countUniqueOccurrences(subcity);

      citySubcityObjects.push({
        city: city,
        subcity: subcity,
        uniqueCount: uniqueCount
      });
    }
  }

  return citySubcityObjects;
}

module.exports = SHEETDATA;
