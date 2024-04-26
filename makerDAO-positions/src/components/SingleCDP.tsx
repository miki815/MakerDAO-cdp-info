import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";
import Web3 from "web3";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider
    }
}

const SingleCDP = () => {
    let { id, collT, coll, debt, owner } = useParams();

    const [price, setPrice] = useState(0);
    const navigate = useNavigate();

    const backToHomepage = () => {
        navigate(`/`);
    };


    useEffect(() => {
        const getPrices = async () => {
            try {
                const response = await axios.get('https:api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin,wrapped-bitcoin&vs_currencies=usd');

                if (collT.startsWith('USDC')) {
                    setPrice(response.data['usd-coin'].usd);
                } else if (collT.startsWith('WBTC')) {
                    setPrice(response.data['wrapped-bitcoin'].usd);
                } else if(collT.startsWith('ETH')){
                    setPrice(response.data['ethereum'].usd);
                } else{ // wstETH
                    setPrice(2139.57);
                }
            } catch (error) {
                console.error('Error getting live crypto prices:', error);
                if (collT.startsWith('ETH')) {
                    setPrice(3129.42);
                } else if (collT.startsWith('USDC')) {
                    setPrice(1.001);
                } else if (collT.startsWith('WBTC')) {
                    setPrice(64219);
                } else{
                    setPrice(2139.57);
                }
            }
        };

        getPrices();
    }, []);

    const liquidationRatio = collT.startsWith('USDC') ? 101 : 145;
    const collateralizationRatio = Number(debt) == 0 ? 0 : (Number(coll) * price / Number(debt)) * 100;
    const maxCollateralWithdrawal = (Number(coll) * price - (Number(debt) * liquidationRatio / 100)) / price;
    const maxDebtWithoutLiquidation = (Number(coll) * price) / (liquidationRatio / 100);
    const [signature, setSignature] = useState('');

    const signMessage = async () => {
        if (!window.ethereum) {
            alert('You must connect to Metamask before signing the message.');
            return;
        }

        try {
            const web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            const message = 'This is my CDP';
            const account = accounts[0];

            const signedMessage = await web3.eth.personal.sign(message, account, '12345');
            setSignature(signedMessage);
        } catch (error) {
            console.error('Signing message error:', error);
        }
    };

    return (
        <div className="container mt-5" style={{
            // backgroundColor: "#5A00B3",
            // backgroundSize: 'cover',
            // backgroundRepeat: 'no-repeat',
            // minHeight: '100vh'
        }}>
            <h1 className="mb-4 text-center"><i onClick={backToHomepage} className="bi bi-arrow-left"></i>  CDP Details - {id}</h1>
            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4 bg-light">
                        <div className="card-body">
                            <h5 className="card-title">Owner</h5>
                            <p className="card-text">{owner}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card mb-4 bg-light">
                        <div className="card-body">
                            {!signature &&
                                <>
                                    <h5 className="card-title">Is this your CDP? Sign message.</h5>
                                    <button className="btn btn-secondary card-text" onClick={signMessage}>Sign message</button>
                                </>
                            }
                            {signature &&
                                <>
                                    <h5 className="card-title">Signature</h5>
                                    <p className="card-text">{signature}</p>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4 bg-light">
                        <div className="card-body">
                            <h5 className="card-title">Collateral</h5>
                            <p className="card-text">{Number(coll).toLocaleString()} {collT}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card mb-4 bg-light">
                        <div className="card-body">
                            <h5 className="card-title">Debt</h5>
                            <p className="card-text">{Number(debt).toLocaleString()} DAI</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4 bg-light">
                        <div className="card-body">
                            <h5 className="card-title">Collateralization Ratio</h5>
                            <p className="card-text">{collateralizationRatio.toLocaleString()}%</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card mb-4 bg-light">
                        <div className="card-body">
                            <h5 className="card-title">Liquidation Ratio</h5>
                            <p className="card-text">{liquidationRatio}%</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4 bg-light">
                        <div className="card-body">
                            <h5 className="card-title">Max Collateral Withdrawal</h5>
                            <p className="card-text">{maxCollateralWithdrawal.toLocaleString()} {collT}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card mb-4 bg-light">
                        <div className="card-body">
                            <h5 className="card-title">Max Debt Without Liquidation</h5>
                            <p className="card-text">{maxDebtWithoutLiquidation.toLocaleString()} DAI</p>
                        </div>
                    </div>
                </div>
            </div>
            { <div>
                {/* <h2>Current Crypto Prices</h2>
                <p>Ethereum (ETH) Price: ${ethPrice}</p>
                <p>USD Coin (USDC) Price: ${usdcPrice}</p>
                <p>Wrapped Bitcoin (WBTC) Price: ${wbtcPrice}</p>
                <p>Wrapped ETH (wstETH) Price: ${wethPrice}</p> */}
            </div> }
        </div>
    );

}

export default SingleCDP