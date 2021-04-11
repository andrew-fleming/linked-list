pragma solidity ^0.8.1;

contract Petter{

    string public name = 'Petter';
    
    address constant HEAD = address(1);
    
    mapping(uint256 => mapping(address => address)) nextPetter; 
    mapping(uint256 => uint256) numPetters;
    mapping(uint256 => bool) headIsSet; 
    
    // Change order of functions to optimise gas. Must be called prior to adding petters.
    /**
    @notice Necessary function for setting the 'HEAD' of the linked list for a particular _tokenId. This
            removes the need to set the 'HEAD' address (address(1)) in the constructor. The nested mapping
            makes setting the 'HEAD' in the constructor troublesome; as, it would need to set the 'HEAD' on
            every _tokenId that will ever exist. This approach is cleaner.

    @dev Needs to reset after every _tokenId transfer.
     */
    function setHead(uint256 _tokenId) public {
        require(headIsSet[_tokenId] == false);
        nextPetter[_tokenId][HEAD] = address(1);
        headIsSet[_tokenId] = true;
    }
    
    /**
    @notice Adds petter to the linked list. The new petter will be at address[0] and all other
            petters will move up the linked list (0 => 1, 1 => 2, etc.).
     */
    function addPetter(uint256 _tokenId, address _petter) external {
            require(
                headIsSet[_tokenId] && 
                !isPetter(_tokenId, _petter)
                );   
            nextPetter[_tokenId][_petter] = nextPetter[_tokenId][address(1)];
            nextPetter[_tokenId][address(1)] = _petter;
            numPetters[_tokenId]++;
        }
    
    /**
    @notice Removes the target address (_petter) and replaces the address it points to with the
            previous address in the linked list.
     */
    function removePetter(uint256 _tokenId, address _petter) external {
        require(isPetter(_tokenId, _petter));
        address prevPetter = _getPrevPetter(_tokenId, _petter);
        nextPetter[_tokenId][prevPetter] = nextPetter[_tokenId][_petter];
        nextPetter[_tokenId][_petter] = address(0);
        numPetters[_tokenId]--;
    }
    
    /**
    @notice Serves as a helper function for removePetter() above. This function finds and returns the 
            address pointing at the target address (_petter).
     */
    function _getPrevPetter(uint256 _tokenId, address _petter) internal view returns(address) {
        address currentAddress = address(1);
        for(uint256 i; nextPetter[_tokenId][currentAddress] != address(1); i++) {
            if (nextPetter[_tokenId][currentAddress] == _petter) {
                return currentAddress;
            }
            currentAddress = nextPetter[_tokenId][currentAddress];
        }
        return address(0);
    }
    
    /**
    @notice Returns an array with petters in the reverse order in which they were added. 
     */
    function getPetters(uint256 _tokenId) external view returns (address[] memory) {
        address[] memory petters = new address[](numPetters[_tokenId]);
        address currentAddress = nextPetter[_tokenId][address(1)];
        for(uint256 i; currentAddress != address(1); i++) {
            petters[i] = currentAddress;
            currentAddress = nextPetter[_tokenId][currentAddress];
        }
        return petters;
    }

    /**
    @notice Function that returns a boolean. Returns 'true' if the address (_petter) is included in
            the linked list.
     */
    function isPetter(uint256 _tokenId, address _petter) public view returns(bool) {
        return nextPetter[_tokenId][_petter] != address(0);
    }

    /**
    @notice Getter function that returns the amount of petters a _tokenId has. 
     */
    function getNumPetters(uint256 _tokenId) public view returns(uint256) {
        return numPetters[_tokenId];
    }
    
}