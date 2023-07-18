const HealthRecord = artifacts.require("HealthRecord");
const Appointment = artifacts.require("Appointment");

module.exports = function(deployer){
    deployer.deploy(HealthRecord);
    deployer.deploy(Appointment);
}