pragma solidity >=0.4.21 <0.6.0;
contract SimpleContract {
   event SimpleEvent(address from, uint a, uint b, uint result);

   function add(uint a, uint b) private pure returns (uint){
       uint result;
       result = a + b;
       return result;
   }

   function calculate(uint a, uint b) public {
      uint result;
      result = add(a, b);
      emit SimpleEvent(msg.sender, a, b, result);
   }
}