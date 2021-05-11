import React, { useState } from 'react';
import { Tab } from '@alifd/next';
import { history } from 'ice';
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

  let defaultActiveKey = 1;
  if (props?.searchParams?.t) {
    if (props.searchParams.t > 0 && props.searchParams.t <=2 )
    {
      defaultActiveKey = props.searchParams.t;
    }
  }

  useMount(() => {
    if (props?.searchParams?.c == 1) {
      action.setState({ selectWalletDialogVisible: true });
    }
  });

  const onClickWallet = (() => {
    history.push('/wallet/detail');
  });

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
        defaultActiveKey= {defaultActiveKey}
        // activeKey= {activeTab}
      >
        
        <Tab.Item onClick={onClickWallet} title="Wallet" key="1"  style = {{marginRight:"20px"}}>
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
