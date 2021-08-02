const { getTrips, getDriver, getVehicle } = require('api');
const { normalizeAmount: Number, pick, roundNumber } = require('./utils');

/**
 * This function should return the data for drivers in the specified format
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  try {
    //get trips
    const trips = await getTrips();
    //loop trips
    const drivers = {};
    for (const trip of trips) {
      const { driverID } = trip;

      const tripDetails = {
        user: trip.user.name,
        id: driverID,
        created: trip.created,
        pickup: trip.pickup.address,
        destination: trip.destination.address,
        billed: trip.billedAmount,
        isCash: trip.isCash,
      };
      if (!drivers[driverID]) {
        try {
          const driver = await getDriver(driverID);
          const { name, phone, vehicleID } = driver;
          const vehicles = await getVehicles(vehicleID);
          drivers[driverID] = {
            fullName: name,
            id: driverID,
            phone,
            noOfTrips: 0,
            noOfVehicles: vehicleID.length,
            vehicles,
            noOfCashTrips: 0,
            noOfNonCashTrips: 0,
            totalAmountEarned: 0,
            totalCashAmount: 0,
            totalNonCashAmount: 0,
            trips: [],
          };
        } catch (err) {
          continue;
        }
      }
      const driver = drivers[driverID];
      driver.trips.push(tripDetails);
      if (trip.isCash) {
        driver.noOfCashTrips += 1;
        driver.totalCashAmount = roundNumber(
          driver.totalCashAmount + Number(trip.billedAmount),
        );
      } else {
        driver.noOfNonCashTrips += 1;
        driver.totalNonCashAmount = roundNumber(
          driver.totalNonCashAmount + Number(trip.billedAmount),
        );
      }
      driver.totalAmountEarned = roundNumber(
        driver.totalAmountEarned + Number(trip.billedAmount),
      );
    }
    return Object.values(drivers);
  } catch (err) {
    console.log(err);
  }
}

async function getVehicles(vehicleIDs) {
  return await Promise.all(
    vehicleIDs.map(async (vehicleId) => {
      return getVehicle(vehicleId)
        .then((vehicle) => {
          return { manufacturer: vehicle.manufacturer, plate: vehicle.plate };
        })
        .catch((err) => console.log(err));
    }),
  );
}

// driverReport().then((data) => console.log(data));

module.exports = driverReport;
