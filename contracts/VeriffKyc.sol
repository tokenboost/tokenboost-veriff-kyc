pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract VeriffKyc is Ownable {

    enum Status {None, Approved, ResubmissionRequested, Declined, Expired, Abandoned}

    mapping(address => Status) statusOfAddress;
    mapping(bytes32 => bool) addressCountryCodeHashes;

    function updateStatusOf(address _address, Status _status) public onlyOwner {
        require(statusOfAddress[_address] != Status.Approved);

        statusOfAddress[_address] = _status;
    }

    function statusOf(address _address) public view returns (Status) {
        return statusOfAddress[_address];
    }

    function registerAddressCountryCodeHash(bytes32 _hash) public onlyOwner {
        addressCountryCodeHashes[_hash] = true;
    }

    function encoded(address _address, string _countryCode) public pure returns (bytes) {
        return abi.encodePacked(_address, _countryCode);
    }

    function hash(address _address, string _countryCode) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_address, _countryCode));
    }

    function countryVerified(address _address, string _countryCode) public view returns (bool) {
        bytes32 hash = keccak256(abi.encodePacked(_address, _countryCode));
        return addressCountryCodeHashes[hash];
    }
}
