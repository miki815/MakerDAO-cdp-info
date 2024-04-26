// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {CdpInfo} from "../src/CdpInfo.sol";
import {Test, console} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";

contract RaffleTest is Test {
    /** Events */
    event EnteredRaffle(address indexed player);

    CdpInfo cdpInfo;

    address urn;
    address owner;
    address userAddr;
    bytes32 ilk;
    uint256 collateral;
    uint256 debt;

    address public USER = makeAddr("player");
    uint256 public constant STARTING_USER_BALANCE = 10 ether;

    function setUp() external {
        cdpInfo = new CdpInfo();
    }

    function testCdpInfo() public {
        (urn, owner, userAddr, ilk, collateral, debt) = cdpInfo.getCdpInfo(31214);
        console.log("debt: ", debt);
        assert(urn == 0x02F1331e06feBDABE36AfE2F97d938015AC09D81);
        assert(owner == 0xD848F54280F8fE8661b796E3Bb8D8922C87af452);
        assert(userAddr ==  0x7d6149aD9A573A6E2Ca6eBf7D4897c1B766841B4);
        assert(ilk == 0x4554482d43000000000000000000000000000000000000000000000000000000);
        assert(collateral == 144000000000000000000000);
        assert(debt == 127072154900189172015527632999685239);
    }

}