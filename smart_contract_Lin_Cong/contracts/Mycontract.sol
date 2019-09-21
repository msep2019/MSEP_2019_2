pragma solidity ^ 0.5.8;
contract MyContract{
    event log(address addr);
    function MyNewContract() public {
       emit log(address(this));
    }

    function add(uint256 a, uint256 b) public pure returns(uint256) {
        return a + b;
    }
}