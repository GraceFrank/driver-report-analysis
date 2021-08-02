// const { getTrips, getDriver, getVehicle } = require('api');
// const { convertStringToNumber: Number, pick } = require('./util');

// /**
//  * This function should return the data for drivers in the specified format
//  *
//  * @returns {any} Driver report data
//  */
// async function driverReport() {
//   try {
//     //get trips
//     const trips = await getTrips();
//     //loop trips
//     const drivers = {};
//     for (const trip of trips) {
//       const tripDetails = {
//         user: trip.user.name,
//         created: trip.created,
//         pickup: trip.pickup.address,
//         destination: trip.destination.address,
//         billed: trip.billedAmount,
//         isCash: trip.isCash,
//       };
//       if (!drivers[driverID]) {
//         try {
//           const driver = await getDriver(driverID);
//           const { name, id, phone, vehicleID } = driver;
//           drivers[driverID] = {
//             name,
//             id,
//             phone,
//             noOfTrips: 0,
//             noOfVehicles: vehicleID.length,
//             vehicles: await getVehicles(vehicleID),
//             noOfCashTrips: 0,
//             noOfNonCashTrips: 0,
//             totalAmountEarned: 0,
//             totalCashAmount: 0,
//             totalNonCashAmount: 0,
//             trips: [],
//           };
//         } catch (err) {
//           continue;
//         }
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }
// async function getVehicles(vehicleIDs) {
//   return vehicleIDs.map((vehicleId) => {
//     try {
//       const vehicle = await getVehicle(vehicleId);
//       if (vehicle)
//         return { manufacturer: vehicle.manufacturer, plate: vehicle.plate };
//     } catch (err) {
//       console.log(err);
//     }
//   });
// }

// module.exports = driverReport;
