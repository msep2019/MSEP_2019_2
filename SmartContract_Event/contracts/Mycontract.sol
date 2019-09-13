pragma solidity ^ 0.5.8;
contract MyContract{
    uint256 a;
    uint256 b;
    event Instructor(uint256 a, uint256 b);
    function MyNewContract(uint256 _a, uint256 _b) public {
       a = _a;
       b = _b;
       emit Instructor(_a, _b);
    }

    function add() view public returns(uint256) {
        uint256 c = a + b;
        return c;
    }
}