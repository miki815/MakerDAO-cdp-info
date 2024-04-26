pragma solidity ^0.8.18;
// SPDX-License-Identifier: MIT

import {Test, console} from "forge-std/Test.sol";

interface VaultInfo {
    function getCdpInfo(uint256 _cdpId) external view returns (address, address, address, bytes32, uint256, uint256);
}

interface Vat {
    function ilks(bytes32) external view returns (uint256, uint256, uint256, uint256, uint256);
}

contract CdpInfo {
    address vaultInfoContractAddress = 0x68C61AF097b834c68eA6EA5e46aF6c04E8945B2d;
    address rateContractAddress = 0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B;

    struct CdpData {
        address urn;
        address owner;
        address userAddr;
        bytes32 ilk;
        uint256 collateral;
        uint256 debt;
    }

    function getCdpInfo(uint256 _cdpId) external view returns (address, address, address, bytes32, uint256, uint256) {
        VaultInfo makerDAOContract = VaultInfo(vaultInfoContractAddress);
        Vat rateContract = Vat(rateContractAddress);

        CdpData memory myCdp;
        (myCdp.urn, myCdp.owner, myCdp.userAddr, myCdp.ilk, myCdp.collateral, myCdp.debt) =
            makerDAOContract.getCdpInfo(_cdpId);
        (, uint256 rate,,,) = rateContract.ilks(myCdp.ilk);
        myCdp.debt = (myCdp.debt * rate) / 10 ** 18;
        return (myCdp.urn, myCdp.owner, myCdp.userAddr, myCdp.ilk, myCdp.collateral, myCdp.debt);
    }
}
