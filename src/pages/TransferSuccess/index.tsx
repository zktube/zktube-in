import React from 'react';

import Header from '@/components/WalletHeader';
import TransferSuccessPage from './components/TransferSuccessPage';

import styles from './index.module.scss';

function TransferSuccess(props) {

  return (
    <>
      <Header />   
      <div className={styles.contentStyle}>
        <TransferSuccessPage  add ={props.add} amt={props.amt} load={props.load}/>
      </div>
    </>
  );
}

export default TransferSuccess;
