pragma solidity ^ 0.5.8;
contract MyContract {
    //event Log(address addr);
    // constructor () public {
    // }
    event Log(address addr);

    event SimpleEvent(string msg);

    function add(uint256 a, uint256 b) public pure returns(uint256) {
        return a + b;
    }

    function logevent() public{
        emit Log(msg.sender);
    }
    function fireEvent() public {
        emit SimpleEvent('fired a message');
    }
}