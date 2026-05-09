// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract RitualizePFP is ERC721, Ownable {
    struct Profile {
        string username;
        string role;
        string tokenURI;
        uint256 mintedAt;
        uint256 tokenId;
    }

    uint256 private _nextTokenId = 1;
    uint8 public constant MAX_REROLLS = 2;
    mapping(address => bool) public hasMinted;
    mapping(address => uint8) public rerollsUsed;
    mapping(address => Profile) private _profiles;
    mapping(uint256 => string) private _tokenUris;

    error AlreadyMinted();
    error MintedIdentityLocked();
    error NoRerollsLeft();

    event RoleMinted(address indexed user, uint256 indexed tokenId, string username, string role, string tokenURI);
    event RerollConsumed(address indexed user, uint8 rerollsUsed, uint8 rerollsRemaining);

    constructor(address initialOwner) ERC721("Ritualize PFP", "RPFP") Ownable(initialOwner) {}

    function mint(string calldata username, string calldata role, string calldata uri) external returns (uint256 tokenId) {
        if (hasMinted[msg.sender]) revert AlreadyMinted();

        tokenId = _nextTokenId++;
        hasMinted[msg.sender] = true;

        _safeMint(msg.sender, tokenId);
        _tokenUris[tokenId] = uri;

        _profiles[msg.sender] = Profile({
            username: username,
            role: role,
            tokenURI: uri,
            mintedAt: block.timestamp,
            tokenId: tokenId
        });

        emit RoleMinted(msg.sender, tokenId, username, role, uri);
    }

    function consumeReroll() external {
        if (hasMinted[msg.sender]) revert MintedIdentityLocked();
        uint8 used = rerollsUsed[msg.sender];
        if (used >= MAX_REROLLS) revert NoRerollsLeft();
        unchecked {
            used += 1;
        }
        rerollsUsed[msg.sender] = used;
        emit RerollConsumed(msg.sender, used, MAX_REROLLS - used);
    }

    function rerollsRemaining(address user) external view returns (uint8) {
        uint8 used = rerollsUsed[user];
        if (used >= MAX_REROLLS) return 0;
        return MAX_REROLLS - used;
    }

    function profileOf(address user) external view returns (Profile memory) {
        return _profiles[user];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenUris[tokenId];
    }
}
