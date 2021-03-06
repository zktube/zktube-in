import React, { useCallback, useState, useEffect } from 'react';
import { Dialog } from '@alifd/next';

import Icon from '@/components/Icon';
import store from '@/store';

import styles from './index.module.scss';

declare const window: any;
const SelectWalletDialog = () => {
  const [hasMask, setHasMask] = useState(false);
  const [wallet, action] = store.useModel('wallet');

  function onClose() {
    action.setState({ selectWalletDialogVisible: false });
  }

  const onBtnClick = useCallback(() => {
    action.setState({ selectWalletDialogVisible: false });
    if (hasMask) {
      action.checkNetworkSupport().then((networkSupport) => {
        if (networkSupport) {
          action.setState({ metaDialogVisible: true });
          const initResult = action.init();
          initResult.then((wallet1) => {
            if (wallet1) {
              action.refreshEthBalance();
              const promAssets = action.refreshL2Assets();
              promAssets.then((val) => {
                if (val?.verified?.balances?.ETH && Number(val.verified.balances.ETH) > 0.0) {
                  action.signKey();
                }
              });
            }
          });
        } else {
          action.setState({ metaDialogVisible: false });
          action.setState({ errorNetworkVisible: true });
        }
      });
    } else {
      action.setState({ unMetaDialogVisible: true });
    }
  }, [wallet]);

  useEffect(() => {
    if (window.ethereum) {
      setHasMask(true);
    }
  }, []);

  return (
    <Dialog
      title={<h2>Select Wallet</h2>}
      visible={wallet?.selectWalletDialogVisible}
      onClose={onClose}
      footer={false}
      className={styles.dialog}
      height="400px"
    >
      <div className={styles.content} onClick={onBtnClick}>
        <div className={styles.item}>
          <Icon type="icon-metamask" size="xl" />
          <span className={styles.button}>
            Meta Mask
          </span>
        </div>
      </div>
    </Dialog>
  );
};

export default SelectWalletDialog;
