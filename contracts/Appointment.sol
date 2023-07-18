pragma solidity >=0.4.22 <0.9.0;

contract Appointment {
    struct AppointmentInfoStruct{
        address userAddress;
        address clinicAddress;
        string doctor;
        string date;
        string time;
        bytes status;
        uint index;
    }

    mapping(string => AppointmentInfoStruct) private appointmentInfoStruct;
    string[] private appointmentIndex;

    event LogNewAppointment(
        string indexed appointmentId,
        address userAddress,
        address clinicAddress,
        uint index,
        string doctor,
        string date,
        string time,
        bytes status
    );
    event LogUpdateAppointment(
        string indexed appointmentId,
        address userAddress,
        address clinicAddress,
        uint index,
        string doctor,
        string date,
        string time,
        bytes status);

    constructor() public{}

    function isAppointmentExist(string memory appointmentId) public view returns(bool isIndeed){
        if(appointmentIndex.length == 0) return false;
        return ((keccak256(abi.encodePacked((appointmentIndex[appointmentInfoStruct[appointmentId].index])))) == (keccak256(abi.encodePacked((appointmentId)))));
    }

    function insertAppointment(
        string memory appointmentId,
        address userAddress,
        address clinicAddress,
        string memory doctor,
        string memory date,
        string memory time,
        bytes memory status
    ) public returns(uint index){
        if(isAppointmentExist(appointmentId)) revert();
        appointmentInfoStruct[appointmentId].userAddress = userAddress;
        appointmentInfoStruct[appointmentId].clinicAddress = clinicAddress;
        appointmentInfoStruct[appointmentId].doctor = doctor;
        appointmentInfoStruct[appointmentId].date = date;
        appointmentInfoStruct[appointmentId].time = time;
        appointmentInfoStruct[appointmentId].status = status;
        appointmentInfoStruct[appointmentId].index = appointmentIndex.push(appointmentId)-1;

        emit LogNewAppointment(
            appointmentId,
            userAddress,
            clinicAddress,
            appointmentInfoStruct[appointmentId].index,
            doctor,
            date,
            time,
            status
        );
        return appointmentIndex.length-1;
    }

    modifier onlyBy(string memory id) {
        require(
            msg.sender == appointmentInfoStruct[id].userAddress || msg.sender == appointmentInfoStruct[id].clinicAddress,
            "Sender not authorized."
        );
        _;
    }

    function getAppointment(
        string memory appointmentId
    )public view onlyBy(appointmentId) returns(address userAddress, address clinicAddress, string memory doctor, string memory date, string memory time, uint index, bytes memory status){
        if(!isAppointmentExist(appointmentId)) revert();

        return(
            appointmentInfoStruct[appointmentId].userAddress,
            appointmentInfoStruct[appointmentId].clinicAddress,
            appointmentInfoStruct[appointmentId].doctor,
            appointmentInfoStruct[appointmentId].date,
            appointmentInfoStruct[appointmentId].time,
            appointmentInfoStruct[appointmentId].index,
            appointmentInfoStruct[appointmentId].status
        );
    }

    function updateAppointmentStatus(
        string memory appointmentId, bytes memory status
    )public returns(bool success){
        if(!isAppointmentExist(appointmentId)) revert();
        appointmentInfoStruct[appointmentId].status = status;
        emit LogUpdateAppointment(
            appointmentId,
            appointmentInfoStruct[appointmentId].userAddress,
            appointmentInfoStruct[appointmentId].clinicAddress,
            appointmentInfoStruct[appointmentId].index,
            appointmentInfoStruct[appointmentId].doctor,
            appointmentInfoStruct[appointmentId].date,
            appointmentInfoStruct[appointmentId].time,
            status
        );
        return true;
    }

    function updateAppointmentDateTime(
        string memory appointmentId, string memory date, string memory time
    )public returns(bool success){
        if(!isAppointmentExist(appointmentId)) revert();
        appointmentInfoStruct[appointmentId].date = date;
        appointmentInfoStruct[appointmentId].time = time;
        emit LogUpdateAppointment(
            appointmentId,
            appointmentInfoStruct[appointmentId].userAddress,
            appointmentInfoStruct[appointmentId].clinicAddress,
            appointmentInfoStruct[appointmentId].index,
            appointmentInfoStruct[appointmentId].doctor,
            date,
            time,
            appointmentInfoStruct[appointmentId].status
        );
        return true;
    }

    function getAppointmentCount() public view returns(uint count){
        return appointmentIndex.length;
    }

    function getAppointmentAtIndex(uint index) public view returns(string memory appointmentId){
        if(index-1 >appointmentIndex.length) revert();
        return appointmentIndex[index];
    }

}
