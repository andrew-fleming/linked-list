pragma solidity ^0.8.1;

contract NestedLinkedList{

    string public name = 'Nested Linked List';
    
    address constant HEAD = address(1);
    
    mapping(uint256 => mapping(address => address)) nextOperator; 
    mapping(uint256 => uint256) numOperators;
    mapping(uint256 => bool) headIsSet; 
    
    // Change order of functions to optimise gas. Must be called prior to adding operators.
    /**
    @notice Necessary function for setting the 'HEAD' of the linked list for a particular _tokenId. This
            removes the need to set the 'HEAD' address (address(1)) in the constructor. The nested mapping
            makes setting the 'HEAD' in the constructor troublesome; as, it would need to set the 'HEAD' on
            every _tokenId that will ever exist. This approach is cleaner.

    @dev Needs to reset after every _tokenId transfer.
     */
    function setHead(uint256 _tokenId) public {
        require(headIsSet[_tokenId] == false);
        nextOperator[_tokenId][HEAD] = address(1);
        headIsSet[_tokenId] = true;
    }
    
    /**
    @notice Adds operator to the linked list. The new operator will be at address[0] and all other
            operators will move up the linked list (0 => 1, 1 => 2, etc.).
     */
    function addOperator(uint256 _tokenId, address _operator) external {
            require(
                headIsSet[_tokenId] && 
                !isOperator(_tokenId, _operator)
                );   
            nextOperator[_tokenId][_operator] = nextOperator[_tokenId][address(1)];
            nextOperator[_tokenId][address(1)] = _operator;
            numOperators[_tokenId]++;
        }
    
    /**
    @notice Removes the target address (_operator) and replaces the address it points to with the
            previous address in the linked list.
     */
    function removeOperator(uint256 _tokenId, address _operator) external {
        require(isOperator(_tokenId, _operator));
        address prevOperator = _getPrevOperator(_tokenId, _operator);
        nextOperator[_tokenId][prevOperator] = nextOperator[_tokenId][_operator];
        nextOperator[_tokenId][_operator] = address(0);
        numOperators[_tokenId]--;
    }
    
    /**
    @notice Serves as a helper function for removeOperator() above. This function finds and returns the 
            address pointing at the target address (_operator).
     */
    function _getPrevOperator(uint256 _tokenId, address _operator) internal view returns(address) {
        address currentAddress = address(1);
        for(uint256 i; nextOperator[_tokenId][currentAddress] != address(1); i++) {
            if (nextOperator[_tokenId][currentAddress] == _operator) {
                return currentAddress;
            }
            currentAddress = nextOperator[_tokenId][currentAddress];
        }
        return address(0);
    }
    
    /**
    @notice Returns an array with operators in the reverse order in which they were added. 
     */
    function getOperators(uint256 _tokenId) external view returns (address[] memory) {
        address[] memory operators = new address[](numOperators[_tokenId]);
        address currentAddress = nextOperator[_tokenId][address(1)];
        for(uint256 i; currentAddress != address(1); i++) {
            operators[i] = currentAddress;
            currentAddress = nextOperator[_tokenId][currentAddress];
        }
        return operators;
    }

    /**
    @notice Function that returns a boolean. Returns 'true' if the address (_operator) is included in
            the linked list.
     */
    function isOperator(uint256 _tokenId, address _operator) public view returns(bool) {
        return nextOperator[_tokenId][_operator] != address(0);
    }

    /**
    @notice Getter function that returns the amount of operators a _tokenId has. 
     */
    function getNumOperators(uint256 _tokenId) public view returns(uint256) {
        return numOperators[_tokenId];
    }
    
}