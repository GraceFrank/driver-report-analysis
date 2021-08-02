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
    const drivers = new Map();

    for (const trip of trips) {
      const { driverID } = trip;

      const tripDetails = {
        user: trip.user.name,
        created: trip.created,
        pickup: trip.pickup.address,
        destination: trip.destination.address,
        billed: trip.billedAmount,
        isCash: trip.isCash,
      };
      if (!drivers.has(driverID)) {
        try {
          const driver = await getDriver(driverID);
          const { name, phone, vehicleID } = driver;
          const vehicles = await getVehicles(vehicleID);
          drivers.set(driverID, {
            name,
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
          });
        } catch (err) {
          continue;
        }
      }
      const driver = drivers.get(driverID);
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
    return [...drivers.values()];
  } catch (err) {
    console.log(err);
  }
}

async function getVehicles(vehicleIDs) {
  const vehicles = [];

  const vehiclesPromise = vehicleIDs.map(getVehicle);

  for await (const res of vehiclesPromise) {
    vehicles.push({
      manufacturer: res.manufacturer,
      plate: res.plate,
    });
  }
  return vehicles;
}

module.exports = driverReport;

driverReport().then(console.log);
