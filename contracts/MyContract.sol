pragma solidity >=0.4.22 <0.9.0;

contract MyContract {
    uint256 private myNumber;

    function getNumber() public view returns (uint256) {
        return myNumber;
    }

    function setNumber(uint256 _number) public {
        myNumber = _number;
    }
}