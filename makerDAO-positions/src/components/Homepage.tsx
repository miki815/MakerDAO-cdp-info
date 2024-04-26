import { useEffect, useRef, useState } from "react";
import Web3 from "web3";
import ListGroup from "./ListGroup";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Buffer } from "buffer";

declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider
    }
}

function Homepage() {

    const [selectedCollateralType, setSelectedCollateralType] = useState('ETH');
    const [cdpId, setCdpId] = useState('');
    const [cdpDataArray, setCdpDataArray] = useState([]);
    const [callsInProgress, setCallsInProgress] = useState(0);
    const [progressArray, setProgressArray] = useState([0, 0]);
    const offset = useRef(0);
    const semaphore = useRef(false);
    const isPlus = useRef(true);
    const activeSearch = useRef(false);
    const progressStyle = {
        height: '25px',
        width: `${cdpDataArray.length * 5}%`,
        transition: 'width 0.5s'
    };

    const progressBarStyle = {
        height: '25px',
    }


    const web3 = new Web3(window.ethereum);
    const contractAddress = "0x68C61AF097b834c68eA6EA5e46aF6c04E8945B2d";
    const contractABI = [{ "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "_getProxyOwner", "outputs": [{ "internalType": "address", "name": "userAddr", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_cdpId", "type": "uint256" }], "name": "getCdpInfo", "outputs": [{ "internalType": "address", "name": "urn", "type": "address" }, { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "userAddr", "type": "address" }, { "internalType": "bytes32", "name": "ilk", "type": "bytes32" }, { "internalType": "uint256", "name": "collateral", "type": "uint256" }, { "internalType": "uint256", "name": "debt", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
    const cdpContract = new web3.eth.Contract(contractABI, contractAddress);

    const rateContractABI = [{ "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": true, "inputs": [{ "indexed": true, "internalType": "bytes4", "name": "sig", "type": "bytes4" }, { "indexed": true, "internalType": "bytes32", "name": "arg1", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "arg2", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "arg3", "type": "bytes32" }, { "indexed": false, "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "LogNote", "type": "event" }, { "constant": true, "inputs": [], "name": "Line", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "cage", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "can", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "dai", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "debt", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "usr", "type": "address" }], "name": "deny", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "ilk", "type": "bytes32" }, { "internalType": "bytes32", "name": "what", "type": "bytes32" }, { "internalType": "uint256", "name": "data", "type": "uint256" }], "name": "file", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "what", "type": "bytes32" }, { "internalType": "uint256", "name": "data", "type": "uint256" }], "name": "file", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "ilk", "type": "bytes32" }, { "internalType": "address", "name": "src", "type": "address" }, { "internalType": "address", "name": "dst", "type": "address" }, { "internalType": "uint256", "name": "wad", "type": "uint256" }], "name": "flux", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "i", "type": "bytes32" }, { "internalType": "address", "name": "u", "type": "address" }, { "internalType": "int256", "name": "rate", "type": "int256" }], "name": "fold", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "ilk", "type": "bytes32" }, { "internalType": "address", "name": "src", "type": "address" }, { "internalType": "address", "name": "dst", "type": "address" }, { "internalType": "int256", "name": "dink", "type": "int256" }, { "internalType": "int256", "name": "dart", "type": "int256" }], "name": "fork", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "i", "type": "bytes32" }, { "internalType": "address", "name": "u", "type": "address" }, { "internalType": "address", "name": "v", "type": "address" }, { "internalType": "address", "name": "w", "type": "address" }, { "internalType": "int256", "name": "dink", "type": "int256" }, { "internalType": "int256", "name": "dart", "type": "int256" }], "name": "frob", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "address", "name": "", "type": "address" }], "name": "gem", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "i", "type": "bytes32" }, { "internalType": "address", "name": "u", "type": "address" }, { "internalType": "address", "name": "v", "type": "address" }, { "internalType": "address", "name": "w", "type": "address" }, { "internalType": "int256", "name": "dink", "type": "int256" }, { "internalType": "int256", "name": "dart", "type": "int256" }], "name": "grab", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "rad", "type": "uint256" }], "name": "heal", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "usr", "type": "address" }], "name": "hope", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "ilks", "outputs": [{ "internalType": "uint256", "name": "Art", "type": "uint256" }, { "internalType": "uint256", "name": "rate", "type": "uint256" }, { "internalType": "uint256", "name": "spot", "type": "uint256" }, { "internalType": "uint256", "name": "line", "type": "uint256" }, { "internalType": "uint256", "name": "dust", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "ilk", "type": "bytes32" }], "name": "init", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "live", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "src", "type": "address" }, { "internalType": "address", "name": "dst", "type": "address" }, { "internalType": "uint256", "name": "rad", "type": "uint256" }], "name": "move", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "usr", "type": "address" }], "name": "nope", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "usr", "type": "address" }], "name": "rely", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "sin", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "ilk", "type": "bytes32" }, { "internalType": "address", "name": "usr", "type": "address" }, { "internalType": "int256", "name": "wad", "type": "int256" }], "name": "slip", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "u", "type": "address" }, { "internalType": "address", "name": "v", "type": "address" }, { "internalType": "uint256", "name": "rad", "type": "uint256" }], "name": "suck", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "address", "name": "", "type": "address" }], "name": "urns", "outputs": [{ "internalType": "uint256", "name": "ink", "type": "uint256" }, { "internalType": "uint256", "name": "art", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "vice", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "wards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }];

    const rateContractAddress = "0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B"
    const rateContract = new web3.eth.Contract(rateContractABI, rateContractAddress);

    const handleCollateralTypeChange = (event) => {
        setSelectedCollateralType(event.target.value);
    };

    const handleCdpIdChange = (event) => {
        const inputValue = event.target.value;
        if (/^\d*$/.test(inputValue) && Number(inputValue) <= 31701 && Number(inputValue) >= 0){
            setCdpId(inputValue);
        }
    };

    const startSearch = () => {
        activeSearch.current = true;
        setCdpDataArray([]);
        setProgressArray([Number(cdpId), Number(cdpId)]);
        offset.current = 0;
        isPlus.current = true;
        setCallsInProgress(10);
    }

    useEffect(() => {
        //  console.log('Calls in progress:', callsInProgress);
        if (activeSearch.current) {
            if (callsInProgress == 10) setCallsInProgress(0);
            let myId = 0;
            if (cdpDataArray.length < 20) {
                if (callsInProgress < 5) {
                    setCallsInProgress(prevCallsInProgress => prevCallsInProgress + 1);
                    if (!semaphore.current) {
                        semaphore.current = true;
                        myId = isPlus.current ? Number(cdpId) + offset.current : Number(cdpId) - offset.current;
                        console.log(myId);
                        setProgressArray(prevArray => {
                            if (myId % 10 == 0 && myId > 0 && myId < 31702) {
                                if (isPlus.current) prevArray[1] = myId;
                                else prevArray[0] = myId;
                            }
                            return [...prevArray];
                        });
                        if (isPlus.current) offset.current += 1;
                        isPlus.current = !isPlus.current;

                        semaphore.current = false;

                        getCdpInfo(myId).then(() => {
                            setCallsInProgress(prevCallsInProgress => prevCallsInProgress - 1);
                        });
                    }
                }
            }
            else activeSearch.current = false;
        }
    }, [callsInProgress]);


    const getCdpInfo = async (param) => {
        try {
            if (window.ethereum) {
                if (param > 0 && param < 31702) {
                    const result = await cdpContract.methods.getCdpInfo(param).call() as { urn: string, owner: string, userAddr: string, ilk: string, collateral: string, debt: Number, id: string };
                    const rateInfo = await rateContract.methods.ilks(result.ilk).call() as { rate: string };
                    const multiplier = Number(rateInfo.rate) / 10 ** 27;
                    result.debt = (Number(result.debt) / 10 ** 18) * multiplier;
                    result.ilk = Buffer.from(result.ilk.replace(/^0x/, ''), 'hex').toString().replace(/\x00/g, '');
                    result.collateral = web3.utils.fromWei(result.collateral, 'ether');
                    if (result.ilk.startsWith(selectedCollateralType)) {
                        result.id = param.toString();
                        console.log(result);
                        setCdpDataArray(prevArray => [...prevArray, result]);
                    }
                }
            } else {
                console.error("MetaMask is not installed.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="cdpId" className="form-label">Rough CDP ID [0, 31701]: </label>
                        <input type="number" max={31701} id="cdpId" className="form-control" value={cdpId} onChange={handleCdpIdChange} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="collId" className="form-label">Collateral Type:</label>
                        <select id="collId" className="form-select" aria-label="Collateral type select" onChange={handleCollateralTypeChange} value={selectedCollateralType}>
                            <option value="ETH">ETH</option>
                            <option value="WBTC">WBTC</option>
                            <option value="WSTETH">wstETH</option>
                            <option value="USDC">USDC</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="row pb-4">
                <div className="col-md-12 text-center">
                    <button className='btn btn-success' onClick={startSearch}>Search</button>
                </div>
            </div>
            <div className="text-center">
                {activeSearch.current && <h2><i className="bi bi-arrow-up"></i> {progressArray.join('---')} <i className="bi bi-arrow-down"></i></h2>}
                {/* <h2>{((offset.current * 2 / 30000) * 100).toLocaleString()}%</h2> */}
            </div>
            <div className="row pb-4">
                <div className="col-md-12 text-center">
                    <div className="progress bg-light" role="progressbar" aria-label="progress" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100} style={progressBarStyle}>
                        <div className="progress-bar bg-success" style={progressStyle}>{cdpDataArray.length < 20 ? cdpDataArray.length : 20}/20</div>
                    </div>
                </div>
            </div>
            <div className="row pb-4">
                <div className="col-md-12 text-center">
                    <ListGroup items={cdpDataArray} heading="Closest collateral debt positions" />
                </div>
            </div>

        </div>
    );

}

export default Homepage;