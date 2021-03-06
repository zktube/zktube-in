import React from 'react';
import { Select, Button } from '@alifd/next';
import {Link} from "ice";
import logo from '@/assets/logo.png';
import styles from './index.module.scss';
import store from '@/store';
import { ethers } from 'ethers';
import DISCORD from '@/assets/discord.png';
import TELEGRAM from '@/assets/telegram.png';
import TWITTER from '@/assets/twwiter.png';
import FACEBOOK from '@/assets/facebook.png';
import MEDIUM from '@/assets/medium.png';


const { Option } = Select;

const WalletHeader = () => {
  const [wallet, action] = store.useModel('wallet');
  const telegram = "https://t.me/zkTubeGlobal";
  const discord = "https://discord.gg/ZhcSuxhX4S";
  const twitter = "https://twitter.com/zktubeofficial";
  const medium = "https://zktube.medium.com";
  const facebook = "https://www.facebook.com/zkTube.official/";


  function onChange(value) {
    console.log('value', value);
  }

  function onClick() {
    action.setState({ selectWalletDialogVisible: true });
  }

  function compressAccount(account: string) {
    if (account.length > 10) {
      return account.substring(0, 6) + '...' + account.substring(account.length-4, account.length);
    } else {
      return account;
    }
  }

  return (
    <header className={styles.header} style={{}} >
       <Link to="/wallet/detail"> 
        <img src={logo} alt="logo" width="10%" className={styles.logo} style={{padding: "10px"}}/>
       </Link> 
      <Link to ="/wallet/detail" className={styles.wallet}  style={{color: "white"}}>
        My Wallet
      </Link>
      <a href="https://rinkeby-browser.zktube.io/" target="_blank" className={styles.wallet} style={{color: "white"}}>
        zkTube Scan
      </a>
      <input className={styles.menubtn} type="checkbox" id="menubtn" />
      <label className={styles.menuicon} htmlFor="menubtn"><span className={styles.navicon}></span></label>
      <ul className={styles.menu} style={{padding: "0px", marginRight: "100px"}}>
        <li>
        <a href={discord} target="_blank" title={discord}>
          <img src={DISCORD}/>
        </a>
          {/* <div className={styles.boxselect} style={{marginRight: "20px", width: "170px", height: "40px"}}>
            <Select onChange={onChange} defaultValue="Rinkeby testnet"> */}
              {/* <Option value="ETHMain network">
                <div className={styles.statuspoint} style = {{ display: "inline-block",width: "12px",height: "12px", borderRadius: "25px",
                  backgroundColor: "green",marginRight: "7px",marginBottom: "3px",verticalAlign: "middle"}} />
                ETHMain network
              </Option>
              <Option value="Ropsten test network">
                <div className={styles.statuspoint} style = {{ display: "inline-block",width: "12px",height: "12px", borderRadius: "25px",
                  backgroundColor: "green",marginRight: "7px",marginBottom: "3px",verticalAlign: "middle"}}/>
                Ropsten test network
              </Option> */}
              {/* <Option value="Rinkeby testnet">
                <div className={styles.statuspoint} style = {{ display: "inline-block",width: "12px",height: "12px", borderRadius: "25px",
                  backgroundColor: "green",marginRight: "7px",marginBottom: "3px",verticalAlign: "middle"}} />
                Rinkeby testnet */}
              {/* </Option>
            </Select> */}
          {/* </div> */}
        </li>
        <li>
          <a href={telegram} target="_blank" title={telegram}>
            <img src={TELEGRAM} />
          </a> 
        </li>
        <li>
          <a href={twitter} target="_blank" title={twitter}>
            <img src={TWITTER} />
          </a> 
        </li>
        <li>
          <a href= {facebook} target="_blank" title={facebook}>
            <img src={FACEBOOK} />
          </a>
        </li>
        <li>
          <a href= {medium} target="_blank" title={medium}>
            <img src={MEDIUM}/>
          </a>
        </li>
        {/* <li> 
          {wallet.account == null ? (
            <div className={styles.boxbtn}>
              <Button type="primary" onClick={onClick} style={{borderRadius: "25px", height: "35px"}}>
                Connect to a wallet
              </Button>
            </div>
          ) : (
            <div className={styles.account}>
              <span className={styles.ethAssets}>{wallet?.ethL1Balance ? (Number(ethers.utils.formatEther(wallet.ethL1Balance))?.toFixed(2)) : 0}ETH</span>
              <span className={styles.ethAddress}>{wallet?.account && (compressAccount(wallet.account)) }</span>
            </div>
          )}
        </li> */}
      </ul>
    </header>
    // <div className={styles.list}>
    //   <div className={styles.boxselect}>
    //     <Select onChange={onChange} defaultValue="ETHMain network">
    //       <Option value="ETHMain network">
    //         <div className={styles.statuspoint} />
    //         ETHMain network
    //       </Option>
    //       <Option value="Ropsten test network">
    //         <div className={styles.statuspoint} />
    //         Ropsten test network
    //       </Option>
    //     </Select>
    //   </div>
    //   <div className={styles.boxbtn}>
    //     <Button type="primary" onClick={onClick} className = {styles.round}>
    //       Connect to a wallet
    //     </Button>
    //   </div>
    // </div>
  );
};
export default WalletHeader;
