// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    string public name;
    string public email;
    string public phone;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event ProfileUpdated(string name, string email, string phone);

    constructor(uint initBalance, string memory _name, string memory _email, string memory _phone) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        name = _name;
        email = _email;
        phone = _phone;
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        require(msg.sender == owner, "You are not the owner of this account");

        balance += _amount;
        assert(balance == _previousBalance + _amount);

        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        balance -= _withdrawAmount;
        assert(balance == (_previousBalance - _withdrawAmount));

        emit Withdraw(_withdrawAmount);
    }

    function userProfile() public view returns (string memory, string memory, string memory) {
        string memory defaultName = "Chethan";
        string memory defaultEmail = "chethan@example.com";
        string memory defaultPhone = "1234";
        
        // Return default details if any of the profile fields are empty
        if (bytes(name).length == 0 || bytes(email).length == 0 || bytes(phone).length == 0) {
            return (defaultName, defaultEmail, defaultPhone);
        }
        
        return (name, email, phone);
    }

    function updateProfile(string memory _name, string memory _email, string memory _phone) public {
        require(msg.sender == owner, "You are not the owner of this account");
        name = _name;
        email = _email;
        phone = _phone;
        emit ProfileUpdated(name, email, phone);
    }
}
