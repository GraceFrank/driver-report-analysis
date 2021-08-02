const { getTrips, getDriver } = require('api');
const { normalizeAmount: Number, pick, roundNumber } = require('./utils');

/**
 * This function should return the trip data analysis
 *
 * @returns {any} Trip data analysis
 */
async function analysis() {
  try {
    const trips = await getTrips();

    const analysis = {
      noOfCashTrips: 0,
      noOfNonCashTrips: 0,
      billedTotal: 0,
      cashBilledTotal: 0,
      nonCashBilledTotal: 0,
      noOfDriversWithMoreThanOneVehicle: 2,
    };
    let highestEarningDriver = { totalAmountEarned: 0 };
    let mostTripsByDriver = { noOfTrips: 0 };
    let numberOfMultipleCarDrivers = 0;
    const drivers = new Map();

    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i];
      if (trip.isCash) {
        analysis.noOfCashTrips += 1;
        analysis.cashBilledTotal += Number(trip.billedAmount);
      } else {
        analysis.noOfNonCashTrips += 1;
        analysis.nonCashBilledTotal += Number(trip.billedAmount);
      }

      analysis.billedTotal += Number(trip.billedAmount);

      const { driverID } = trip;

      //Fetch Driver if non existent
      if (!drivers.has(driverID)) {
        try {
          const driver = await getDriver(driverID);
          drivers.set(driverID, {
            ...driver,
            totalAmountEarned: 0,
            noOfTrips: 0,
          });
          //driver with vehicles more than 2
          if (driver.vehicleID.length > 2) {
            numberOfMultipleCarDrivers += 1;
          }
        } catch (err) {
          continue;
        }
      }

      //update driver details
      const driver = drivers.get(driverID);
      driver.totalAmountEarned += roundNumber(Number(trip.billedAmount));
      driver.noOfTrips += 1;

      //highest earning driver
      if (
        Number(driver.totalAmountEarned) >
        highestEarningDriver.totalAmountEarned
      ) {
        highestEarningDriver = driver;
      }

      //Most trip driver
      if (driver.noOfTrips > mostTripsByDriver.noOfTrips) {
        mostTripsByDriver = driver;
      }
    }

    analysis.billedTotal = roundNumber(analysis.billedTotal);
    analysis.nonCashBilledTotal = roundNumber(analysis.nonCashBilledTotal);

    return {
      ...analysis,
      highestEarningDriver: pick(highestEarningDriver),
      mostTripsByDriver: pick(mostTripsByDriver),
    };
  } catch (err) {
    console.log(err);
  }
}

module.exports = analysis;
