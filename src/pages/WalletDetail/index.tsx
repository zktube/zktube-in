import React from 'react';
import { Tab } from '@alifd/next';
import { useMount } from 'ahooks';
import store from '@/store';
import WalletHeader from '@/components/WalletHeader';

import Wallet from './components/Wallet';
import Transactions from './components/Transactions';
import SelectWalletDialog from '../MyWallet/components/SelectWalletDialog';
import MetaDialog from '../MyWallet/components/MetaDialog';
import UnMetaDialog from '../MyWallet/components/UnMetaDialog';
import ErrorNetworkDialog from '../MyWallet/components/ErrorNetworkDialog';

import styles from './index.module.scss';

const WalletDetail = (props) => {
  const [, action] = store.useModel('wallet');

  useMount(() => {
    if (props?.searchParams?.c == 1) {
      console.log('WalletDetail', props.searchParams.c);
      action.setState({ selectWalletDialogVisible: true });
    }
  });

  const transactionPage = props.transaction;
  return (
    <div>
     
     <span className= {styles.header}>
      <WalletHeader/>
     </span>
      <hr/>
      <Tab 
        shape="pure"
        size="medium"
        navClassName={styles.navStyle}
        contentClassName={styles.contentStyle}
        unmountInactiveTabs
        defaultActiveKey= {transactionPage !== "2" ? "1" : "2"}
      >
        
        <Tab.Item title="Wallet" key="1"  style = {{marginRight:"20px"}}>
          <Wallet/>
        </Tab.Item>
        <Tab.Item title="Transactions" key="2">
          <Transactions />
        </Tab.Item>
      </Tab>
      <SelectWalletDialog />
      <MetaDialog />
      <UnMetaDialog />
      <ErrorNetworkDialog />

      {/* <WalletFooter/> */}

    </div>
  );
};

export default WalletDetail;
