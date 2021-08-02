const { getTrips, getDriver } = require('api');
const {
  normalizeAmount: Number,
  pick,
  round,
  roundNumber,
} = require('./utils');

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
    const drivers = {};

    for (const trip of trips) {
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
      if (!drivers[driverID]) {
        try {
          const driver = await getDriver(driverID);
          drivers[driverID] = {
            ...driver,
            totalAmountEarned: 0,
            cars: [],
            noOfTrips: 0,
          };
        } catch (err) {
          continue;
        }
      }

      //update driver details
      const driver = drivers[driverID];
      driver.totalAmountEarned += roundNumber(Number(trip.billedAmount));
      driver.noOfTrips += 1;
    }

    let highestEarningDriver = { totalAmountEarned: 0 };
    let mostTripsByDriver = { noOfTrips: 0 };
    let numberOfMultipleCarDrivers = 0;
    //find driver driver with highest number of cars
    for (const driverID in drivers) {
      const driver = drivers[driverID];
      if (driver.vehicleID.length > 2) {
        numberOfMultipleCarDrivers += 1;
      }
      if (
        Number(driver.totalAmountEarned) >
        highestEarningDriver.totalAmountEarned
      ) {
        highestEarningDriver = driver;
      }

      if (driver.noOfTrips > mostTripsByDriver.noOfTrips) {
        mostTripsByDriver = driver;
      }
    }

    analysis.billedTotal = roundNumber(analysis.billedTotal);
    analysis.nonCashBilledTotal = roundNumber(analysis.nonCashBilledTotal);

    return {
      ...analysis,
      highestEarningDriver: pick(highestEarningDriver, [
        'name',
        'email',
        'phone',
        'noOfTrips',
        'totalAmountEarned',
      ]),
      mostTripsByDriver: pick(mostTripsByDriver, [
        'name',
        'email',
        'phone',
        'noOfTrips',
        'totalAmountEarned',
      ]),
    };
  } catch (err) {
    console.log(err);
  }
}

module.exports = analysis;

analysis().then((data) => console.log(data));
