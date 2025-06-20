// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IdeaAccelerator {
    // ------------------------
    // STAKING SYSTEM
    // ------------------------

    mapping(address => uint256) public stakes;
    address[] public stakers;
    uint256 public totalStaked;

    uint256 public constant MIN_STAKE = 0.5 ether;

    modifier onlyStaker() {
        require(stakes[msg.sender] >= MIN_STAKE, "Stake required");
        _;
    }

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    function stake() external payable {
        require(msg.value >= MIN_STAKE, "Minimum 0.5 required");

        if (stakes[msg.sender] == 0) {
            stakers.push(msg.sender);
        }

        stakes[msg.sender] += msg.value;
        totalStaked += msg.value;

        emit Staked(msg.sender, msg.value);
    }

    function unstake() external onlyStaker {
        uint256 amount = stakes[msg.sender];
        require(amount > 0, "Nothing to unstake");

        // Ensure no unfunded grants depending on this staker's weight
        for (uint256 i = 1; i < grantCount; i++) {
            GrantRequest storage grant = grants[i];
            if (!grant.funded && grant.approvals[msg.sender]) {
                // Removing this staker could drop approvalWeight < 65%
                uint256 newWeight = grant.approvalWeight - amount;
                if (newWeight * 100 >= (totalStaked - amount) * 65) {
                    continue; // Still safe
                } else {
                    revert("Unstake breaks active grant quorum");
                }
            }
        }

        stakes[msg.sender] = 0;
        totalStaked -= amount;
        payable(msg.sender).transfer(amount);

        emit Unstaked(msg.sender, amount);
    }

    // ------------------------
    // GRANT REQUEST SYSTEM
    // ------------------------

    struct GrantRequest {
        address requester;
        string metadataURI;
        uint256 amountRequested;
        uint256 approvalWeight;
        bool funded;
        mapping(address => bool) approvals;
    }

    uint256 public grantCount = 1;
    mapping(uint256 => GrantRequest) private grants;

    event GrantRequested(uint256 indexed grantId, address indexed requester, uint256 amount, string metadataURI);
    event GrantApproved(uint256 indexed grantId, address indexed approver, uint256 newWeight);
    event GrantFunded(uint256 indexed grantId, address indexed recipient, uint256 amount);

    function requestGrant(string calldata metadataURI, uint256 amountWei) external onlyStaker {
        require(bytes(metadataURI).length > 0, "Metadata required");
        require(amountWei <= address(this).balance, "Too much requested");

        GrantRequest storage grant = grants[grantCount];
        grant.requester = msg.sender;
        grant.metadataURI = metadataURI;
        grant.amountRequested = amountWei;
        grant.funded = false;

        emit GrantRequested(grantCount, msg.sender, amountWei, metadataURI);

        grantCount++;
    }

    function approveGrant(uint256 grantId) external onlyStaker {
        GrantRequest storage grant = grants[grantId];
        require(!grant.funded, "Already funded");
        require(!grant.approvals[msg.sender], "Already approved");

        grant.approvals[msg.sender] = true;
        grant.approvalWeight += stakes[msg.sender];

        emit GrantApproved(grantId, msg.sender, grant.approvalWeight);

        if (grant.approvalWeight * 100 >= totalStaked * 65) {
            grant.funded = true;
            totalStaked -= grant.amountRequested;

            (bool sent, ) = payable(grant.requester).call{value: grant.amountRequested}("");
            require(sent, "Transfer failed");

            emit GrantFunded(grantId, grant.requester, grant.amountRequested);
        }
    }

    // ------------------------
    // READ-ONLY HELPERS
    // ------------------------

    function getGrant(uint256 grantId) external view returns (
        address requester,
        string memory metadataURI,
        uint256 amountRequested,
        uint256 approvalWeight,
        bool funded
    ) {
        GrantRequest storage grant = grants[grantId];
        return (
            grant.requester,
            grant.metadataURI,
            grant.amountRequested,
            grant.approvalWeight,
            grant.funded
        );
    }

    function getStakers() external view returns (address[] memory) {
        return stakers;
    }

    function hasApproved(uint256 grantId, address approver) external view returns (bool) {
        return grants[grantId].approvals[approver];
    }
}