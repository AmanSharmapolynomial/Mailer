"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("mongodb"),
    MongoClient = _require.MongoClient;

var XLSX = require("xlsx");

var fs = require("fs");

var citiess = require("../constants/cities");

var client = new MongoClient(process.env.connection_string);
var db = client.db("bot_conversations");
var workBook = XLSX.utils.book_new();
var logs = db.collection("logs");
var today = new Date();
var offset = today.getTimezoneOffset() * 60000; // Get the time zone offset in milliseconds

var startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0 - offset / 60000, 0); // Start of the day (12:00 AM) adjusted for time zone

var endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59 - offset / 60000, 59);
var shona_logs = db.collection("shona_click_logs");

var SHEETDATA = function SHEETDATA() {
  var firstSheet, FirstData, casingData, workSheet1, secondSheet, map, result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, Clicked_query, ipAddresses, Count, workSheet2, isoStartOfDay, isoEndOfDay, thirdSheet, thirdSheetData, workSheet3, cities, resultt, _loop, _i, _cities, workSheet4;

  return regeneratorRuntime.async(function SHEETDATA$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(shona_logs.find({
            timestamp: {
              $gte: startOfDay,
              $lte: endOfDay
            }
          }).toArray());

        case 2:
          firstSheet = _context2.sent;
          FirstData = firstSheet.map(function (_ref) {
            var conversation_id = _ref.conversation_id,
                timestamp = _ref.timestamp,
                ip_address = _ref.ip_address,
                clicked_query = _ref.clicked_query;
            return {
              conversation_id: conversation_id,
              timestamp: new Date(timestamp).toISOString(),
              ip_address: ip_address,
              clicked_query: clicked_query
            };
          });
          casingData = FirstData.map(function (obj) {
            var newObj = {};

            for (var key in obj) {
              newObj[capitalizeFirstLetter(key)] = obj[key];
            }

            return newObj;
          });

          if (casingData.length > 0) {
            workSheet1 = XLSX.utils.json_to_sheet(casingData);
            XLSX.utils.book_append_sheet(workBook, workSheet1, "click_logs");
            console.log("Button Sheet Created");
          } ////second sheet


          _context2.next = 8;
          return regeneratorRuntime.awrap(shona_logs.find({
            timestamp: {
              $gte: startOfDay,
              $lte: endOfDay
            },
            clicked_query: {
              $nin: ["Bangalore", "Pune", "Hyderabad", "Chennai"]
            }
          }).toArray());

        case 8:
          secondSheet = _context2.sent;
          // Finding all the documents of shona_logs except for the specified cities
          map = new Map(); // Creating Map

          secondSheet.forEach(function (log) {
            var ip_address = log.ip_address,
                clicked_query = log.clicked_query;

            if (!map.has(clicked_query)) {
              map.set(clicked_query, new Set()); // Using Set to store unique IP addresses for each clicked_query
            }

            var ipAddresses = map.get(clicked_query);
            ipAddresses.add(ip_address);
          }); // Create an array to store the result

          result = []; // Iterate over the Map entries to construct the result

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 15;

          for (_iterator = map.entries()[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _step$value = _slicedToArray(_step.value, 2), Clicked_query = _step$value[0], ipAddresses = _step$value[1];
            Count = ipAddresses.size; // Counting unique IP addresses for each clicked query

            result.push({
              Clicked_query: Clicked_query,
              Count: Count
            });
          }

          _context2.next = 23;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](15);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 23:
          _context2.prev = 23;
          _context2.prev = 24;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 26:
          _context2.prev = 26;

          if (!_didIteratorError) {
            _context2.next = 29;
            break;
          }

          throw _iteratorError;

        case 29:
          return _context2.finish(26);

        case 30:
          return _context2.finish(23);

        case 31:
          if (result.length > 0) {
            workSheet2 = XLSX.utils.json_to_sheet(result);
            XLSX.utils.book_append_sheet(workBook, workSheet2, "click_log_stats");
            console.log("Got data and created Second Excel sheet.");
          } ////Third sheet


          isoStartOfDay = startOfDay.toISOString();
          isoEndOfDay = endOfDay.toISOString(); // Query MongoDB using ISO string format for timestamps

          _context2.next = 36;
          return regeneratorRuntime.awrap(logs.find({
            "meta_data.Timestamp": {
              $gte: isoStartOfDay,
              $lte: isoEndOfDay
            },
            bot_type: "Sales+CRM-Bot"
          }).toArray());

        case 36:
          thirdSheet = _context2.sent;
          //  converting timestamp to ISO string
          thirdSheet.forEach(function (item) {
            item.meta_data.Timestamp = new Date(item.meta_data.Timestamp).toISOString();
            delete item.meta_data["Intent Name"];
          });
          thirdSheetData = thirdSheet.map(function (_ref2) {
            var meta_data = _ref2.meta_data;
            return _objectSpread({}, meta_data);
          });

          if (thirdSheetData.length > 0) {
            workSheet3 = XLSX.utils.json_to_sheet(thirdSheetData);
            XLSX.utils.book_append_sheet(workBook, workSheet3, "ThirdSheet");
            console.log("Got data and created Excel sheets.");
          } /////Fourth Sheet


          cities = ["Bangalore", "Pune", "Chennai", "Hyderabad"];
          resultt = [];

          _loop = function _loop() {
            var City, cityData, uniqueIPs;
            return regeneratorRuntime.async(function _loop$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    City = _cities[_i];
                    _context.next = 3;
                    return regeneratorRuntime.awrap(shona_logs.find({
                      clicked_query: City,
                      timestamp: {
                        $gte: startOfDay,
                        $lte: endOfDay
                      }
                    }).toArray());

                  case 3:
                    cityData = _context.sent;
                    // Create a Set to store unique IP addresses
                    uniqueIPs = new Set(); // Iterate over each log for the current city

                    cityData.forEach(function (log) {
                      // Add the IP address to the Set
                      uniqueIPs.add(log.ip_address);
                    }); // Push an object representing the city and the count of unique IP addresses to the result array

                    resultt.push({
                      City: City,
                      Count: uniqueIPs.size
                    });

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            });
          };

          _i = 0, _cities = cities;

        case 44:
          if (!(_i < _cities.length)) {
            _context2.next = 50;
            break;
          }

          _context2.next = 47;
          return regeneratorRuntime.awrap(_loop());

        case 47:
          _i++;
          _context2.next = 44;
          break;

        case 50:
          if (resultt.length > 0) {
            workSheet4 = XLSX.utils.json_to_sheet(resultt);
            XLSX.utils.book_append_sheet(workBook, workSheet4, "City_click_logs_stats");
            console.log("Got data and created Second Excel sheet.");
          } //Fifth Sheet


          generateCitySubcityObjects(citiess).then(function (citySubcityObjects) {
            var workSheet5 = XLSX.utils.json_to_sheet(citySubcityObjects);
            XLSX.utils.book_append_sheet(workBook, workSheet5, "Subcity_click_logs_stats");
            XLSX.writeFile(workBook, "./excelSheets/AllSheets.xlsx", {
              bookType: "xlsx"
            });
          })["catch"](function (err) {
            console.error("Error:", err);
          });

        case 52:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[15, 19, 23, 31], [24,, 26, 30]]);
};

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function countUniqueOccurrences(subcity) {
  var cityData, uniqueIPs;
  return regeneratorRuntime.async(function countUniqueOccurrences$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(shona_logs.find({
            clicked_query: subcity
          }).toArray());

        case 2:
          cityData = _context3.sent;
          // Extract unique IP addresses
          uniqueIPs = new Set(cityData.map(function (entry) {
            return entry.ip_address;
          }));
          return _context3.abrupt("return", uniqueIPs.size);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function generateCitySubcityObjects(cityArray) {
  var citySubcityObjects, _i2, _Object$keys, city, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, subcity, uniqueCount;

  return regeneratorRuntime.async(function generateCitySubcityObjects$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          citySubcityObjects = [];
          _i2 = 0, _Object$keys = Object.keys(cityArray);

        case 2:
          if (!(_i2 < _Object$keys.length)) {
            _context4.next = 35;
            break;
          }

          city = _Object$keys[_i2];
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context4.prev = 7;
          _iterator2 = cityArray[city][Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context4.next = 18;
            break;
          }

          subcity = _step2.value;
          _context4.next = 13;
          return regeneratorRuntime.awrap(countUniqueOccurrences(subcity));

        case 13:
          uniqueCount = _context4.sent;
          citySubcityObjects.push({
            city: city,
            subcity: subcity,
            uniqueCount: uniqueCount
          });

        case 15:
          _iteratorNormalCompletion2 = true;
          _context4.next = 9;
          break;

        case 18:
          _context4.next = 24;
          break;

        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](7);
          _didIteratorError2 = true;
          _iteratorError2 = _context4.t0;

        case 24:
          _context4.prev = 24;
          _context4.prev = 25;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 27:
          _context4.prev = 27;

          if (!_didIteratorError2) {
            _context4.next = 30;
            break;
          }

          throw _iteratorError2;

        case 30:
          return _context4.finish(27);

        case 31:
          return _context4.finish(24);

        case 32:
          _i2++;
          _context4.next = 2;
          break;

        case 35:
          return _context4.abrupt("return", citySubcityObjects);

        case 36:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[7, 20, 24, 32], [25,, 27, 31]]);
}

module.exports = SHEETDATA;