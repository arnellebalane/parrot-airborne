const servicesUUID = {
    fa00: getUUID('fa00'),  // Command sending
    fb00: getUUID('fb00'),  // Command receiving
    fc00: getUUID('fc00'),  // Performance counter
    fd21: getUUID('fd21'),  // Normal BLE FTP
    fd51: getUUID('fd51'),  // Update BLE FTP
    fe00: getUUID('fe00')   // Update RFCOMM
};
let services = {};

const sendingCharacteristicsUUID = {
    fa10: getUUID('fa10'),  // Send command to device without ACK
    fa11: getUUID('fa11'),  // Send command to device with ACK
    fa12: getUUID('fa12'),  // Send high priority command to device
};
let sendingCharacteristics = {};

const receivingCharacteristicsUUID = {
    fb14: getUUID('fb14'),  // Receive commands with ACK
    fb15: getUUID('fb15'),  // Receive commands without ACK
};
let receivingCharacteristics = {};

document.onclick = initialize;

async function initialize() {
    const device = await requestDevice();
    console.log(device);

    const gatt = await connectGATT(device);
    console.log(gatt);

    services = await getServices(gatt, Object.keys(servicesUUID));
    console.log(services);

    sendingCharacteristics = await getCharacteristics(
        services.fa00, Object.keys(sendingCharacteristicsUUID));
    console.log(sendingCharacteristics);

    receivingCharacteristics = await getCharacteristics(
        services.fb00, Object.keys(receivingCharacteristicsUUID));
    console.log(receivingCharacteristics);
}

function getUUID(segment) {
    return `9a66${segment}-0800-9191-11e4-012d1540cb8e`;
}

function requestDevice() {
    return navigator.bluetooth.requestDevice({
        filters: [
            { namePrefix: 'Swat_' }
        ],
        optionalServices: Object.values(servicesUUID)
    });
}

function connectGATT(device) {
    return device.gatt.connect();
}

async function getServices(gatt, uuids) {
    const services = await Promise.all(uuids.map(
        uuid => gatt.getPrimaryService(getUUID(uuid))));
    return services.reduce((acc, service, i) => {
        acc[uuids[i]] = service;
        return acc;
    }, {});
}

async function getCharacteristics(service, uuids) {
    const characteristics = await Promise.all(uuids.map(
        uuid => service.getCharacteristic(getUUID(uuid))));
    return characteristics.reduce((acc, characteristic, i) => {
        acc[uuids[i]] = characteristic;
        return acc;
    }, {});
}
