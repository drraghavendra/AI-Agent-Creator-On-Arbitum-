// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ARBToken
 * @dev Enhanced ERC20 token with burning, pausing, and role-based access control
 * @notice Optimized for security and gas efficiency
 */
contract ARBToken is ERC20, ERC20Burnable, ERC20Pausable, AccessControl, ReentrancyGuard {
    // Access control roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    // Token configuration
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 100 million tokens
    
    // State variables
    mapping(address => bool) public blacklisted;
    bool public transfersEnabled = true;
    
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event BlacklistUpdated(address indexed account, bool isBlacklisted);
    event TransfersToggled(bool enabled);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    /**
     * @dev Constructor that sets up the initial token supply and roles
     * @param initialSupply The initial supply to mint (must not exceed MAX_SUPPLY)
     */
    constructor(uint256 initialSupply) ERC20("ARB Token", "ARB") {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds maximum");
        require(initialSupply > 0, "Initial supply must be greater than 0");
        
        // Set up roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(BURNER_ROLE, msg.sender);
        
        // Mint initial supply
        _mint(msg.sender, initialSupply);
        emit TokensMinted(msg.sender, initialSupply);
    }

    // Required overrides for multiple inheritance
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
    }

    // Modifiers
    modifier notBlacklisted(address account) {
        require(!blacklisted[account], "Account is blacklisted");
        _;
    }

    modifier transfersAllowed() {
        require(transfersEnabled, "Transfers are currently disabled");
        _;
    }

    /**
     * @dev Mint tokens to a specified address (minter role only)
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) 
        external 
        onlyRole(MINTER_ROLE) 
        nonReentrant 
    {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply() + amount <= MAX_SUPPLY, "Minting would exceed max supply");
        
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Burn tokens from a specified address (burner role only)
     * @param from The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) 
        external 
        onlyRole(BURNER_ROLE) 
        nonReentrant 
    {
        require(from != address(0), "Cannot burn from zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(from) >= amount, "Insufficient balance to burn");
        
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }

    /**
     * @dev Batch mint tokens to multiple addresses
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to mint to each recipient
     */
    function batchMint(address[] calldata recipients, uint256[] calldata amounts) 
        external 
        onlyRole(MINTER_ROLE) 
        nonReentrant 
    {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "Empty arrays not allowed");
        require(recipients.length <= 100, "Too many recipients"); // Gas limit protection
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(totalSupply() + totalAmount <= MAX_SUPPLY, "Batch minting would exceed max supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Cannot mint to zero address");
            require(amounts[i] > 0, "Amount must be greater than 0");
            
            _mint(recipients[i], amounts[i]);
            emit TokensMinted(recipients[i], amounts[i]);
        }
    }

    /**
     * @dev Override transfer to include blacklist and transfer checks
     */
    function transfer(address to, uint256 amount) 
        public 
        override 
        notBlacklisted(msg.sender) 
        notBlacklisted(to) 
        transfersAllowed 
        returns (bool) 
    {
        return super.transfer(to, amount);
    }

    /**
     * @dev Override transferFrom to include blacklist and transfer checks
     */
    function transferFrom(address from, address to, uint256 amount) 
        public 
        override 
        notBlacklisted(from) 
        notBlacklisted(to) 
        transfersAllowed 
        returns (bool) 
    {
        return super.transferFrom(from, to, amount);
    }

    /**
     * @dev Add or remove address from blacklist (admin only)
     * @param account The address to blacklist/unblacklist
     * @param isBlacklisted Whether to blacklist or unblacklist the address
     */
    function updateBlacklist(address account, bool isBlacklisted) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(account != address(0), "Cannot blacklist zero address");
        blacklisted[account] = isBlacklisted;
        emit BlacklistUpdated(account, isBlacklisted);
    }

    /**
     * @dev Enable or disable all transfers (admin only)
     * @param enabled Whether to enable or disable transfers
     */
    function toggleTransfers(bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        transfersEnabled = enabled;
        emit TransfersToggled(enabled);
    }

    /**
     * @dev Pause the contract (pauser role only)
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause the contract (pauser role only)
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Emergency withdraw function for admin
     * @param token The token to withdraw (address(0) for ETH)
     * @param amount The amount to withdraw (0 for all)
     */
    function emergencyWithdraw(address token, uint256 amount) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
        nonReentrant 
    {
        if (token == address(0)) {
            // Withdraw ETH
            uint256 balance = address(this).balance;
            uint256 withdrawAmount = amount == 0 ? balance : amount;
            require(withdrawAmount <= balance, "Insufficient balance");
            
            (bool success, ) = payable(msg.sender).call{value: withdrawAmount}("");
            require(success, "ETH transfer failed");
        } else {
            // Withdraw ERC20 tokens
            IERC20 tokenContract = IERC20(token);
            uint256 balance = tokenContract.balanceOf(address(this));
            uint256 withdrawAmount = amount == 0 ? balance : amount;
            require(withdrawAmount <= balance, "Insufficient balance");
            
            require(tokenContract.transfer(msg.sender, withdrawAmount), "Token transfer failed");
        }
        
        emit EmergencyWithdraw(token, withdrawAmount);
    }

    /**
     * @dev Get the current total supply
     * @return The current total supply of tokens
     */
    function getCurrentSupply() external view returns (uint256) {
        return totalSupply();
    }

    /**
     * @dev Get the remaining mintable supply
     * @return The amount of tokens that can still be minted
     */
    function getRemainingMintableSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }

    /**
     * @dev Check if an address is blacklisted
     * @param account The address to check
     * @return Whether the address is blacklisted
     */
    function isBlacklisted(address account) external view returns (bool) {
        return blacklisted[account];
    }

    /**
     * @dev Get token information
     * @return name The token name
     * @return symbol The token symbol
     * @return decimals The token decimals
     * @return totalSupply The current total supply
     * @return maxSupply The maximum possible supply
     */
    function getTokenInfo() external view returns (
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 totalSupply,
        uint256 maxSupply
    ) {
        return (
            name(),
            symbol(),
            decimals(),
            totalSupply(),
            MAX_SUPPLY
        );
    }
}