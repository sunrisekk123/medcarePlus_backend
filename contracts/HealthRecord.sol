// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

contract HealthRecord {
    struct HealthRecordStruct{
        address clinicAddress;
        string appointmentId;
        string doctor;
        string datetime;
        string record;
        string remarks;
        uint index;
    }
    struct MedicalProviderStruct{
        address clinicAddress;
        string date;
        string time;
        bytes status;
    }

    constructor() public{}

    mapping(address => HealthRecordStruct[]) private healthRecordInfoStruct;
    mapping(address => MedicalProviderStruct[]) private allowMedicalProviderList;
    address[] private healthRecordIndex;

    event LogNewHealthRecord(
        address indexed userAddress,
        address clinicAddress,
        string appointment,
        string doctor,
        string datetime,
        string record,
        string remarks
    );
    event LogAllowMedicalProvider(
        address indexed userAddress,
        address clinicAddress,
        string date,
        string time,
        bytes status
    );

    modifier onlyBy(address userAddress, address clinicAddress) {
        uint indexOf = 0;
        for(uint i=0; i<allowMedicalProviderList[userAddress].length; i++){
            if(allowMedicalProviderList[userAddress][i].clinicAddress == clinicAddress){
                indexOf = i;
                break;
            }
        }
        require(
            msg.sender == allowMedicalProviderList[userAddress][indexOf].clinicAddress,
            "Sender not authorized."
        );
        _;
    }

    function insertHealthRecord(
        address userAddress,
        address clinicAddress,
        string memory appointmentId,
        string memory doctor,
        string memory datetime,
        string memory record,
        string memory remarks
    ) public onlyBy(userAddress, clinicAddress) returns(uint index){
        if(!verifyHealthProvider(userAddress, clinicAddress)) revert();

        healthRecordInfoStruct[userAddress].push(
            HealthRecordStruct(
                clinicAddress,
                appointmentId,
                doctor,
                datetime,
                record,
                remarks,
                healthRecordIndex.push(userAddress)-1
            )
        );

        emit LogNewHealthRecord(
            userAddress,
            clinicAddress,
            appointmentId,
            doctor,
            datetime,
            record,
            remarks
        );
        return healthRecordIndex.length-1;
    }

    function insertHealthProvider(address userAddress, address clinicAddress, string memory date, string memory time, bytes memory status) public returns(bool isSuccess){
        bool alreadyInserted = false;
        for(uint i=0; i<allowMedicalProviderList[userAddress].length; i++){
            if(allowMedicalProviderList[userAddress][i].clinicAddress == clinicAddress){
                alreadyInserted = true;
                if((keccak256(allowMedicalProviderList[userAddress][i].status)) != (keccak256(status))){
                    allowMedicalProviderList[userAddress][i].status = status;
                    emit LogAllowMedicalProvider(
                        userAddress,
                        clinicAddress,
                        date,
                        time,
                        status
                    );
                }
                break;
            }
        }
        if(!alreadyInserted){
            allowMedicalProviderList[userAddress].push(MedicalProviderStruct(clinicAddress, date, time, status));
            emit LogAllowMedicalProvider(
                userAddress,
                clinicAddress,
                date,
                time,
                status
            );
        }
        return true;
    }

    function removeHealthProvider(address userAddress, address clinicAddress, string memory date, string memory time, bytes memory status) public returns(bool isSuccess){
        bool alreadyInserted = false;
        for(uint i=0; i<allowMedicalProviderList[userAddress].length; i++){
            if(allowMedicalProviderList[userAddress][i].clinicAddress == clinicAddress){
                alreadyInserted = true;
                allowMedicalProviderList[userAddress][i].status = status;
            }
        }
        if(!alreadyInserted){
            allowMedicalProviderList[userAddress].push(MedicalProviderStruct(clinicAddress, date, time, status));
        }
        emit LogAllowMedicalProvider(
            userAddress,
            clinicAddress,
            date,
            time,
            status
        );
        return true;
    }

    function verifyHealthProvider(address userAddress, address clinicAddress) public view returns(bool isTrue){
        bool isExist = false;
        for(uint i=0; i<allowMedicalProviderList[userAddress].length; i++){
            if(allowMedicalProviderList[userAddress][i].clinicAddress == clinicAddress){
                if((keccak256(allowMedicalProviderList[userAddress][i].status) != keccak256("0x4e"))){ // "N"
                    isExist = true;
                    break;
                }
            }
        }
        return isExist;
    }
}
