import React, { useState, useCallback } from 'react';
import store from '@/store';
import { useMount } from 'ahooks';
import Item from '../TransactionItem';

import styles from './index.module.scss';

function Transactions() {
  const [wallet, action] = store.useModel('wallet');
  const [items, setItems] = useState([]);

  useMount(() => {
    getHistory();
  });

  const getHistory = useCallback(() => {
    try {
      const promHistory = action.history();

      promHistory.then((history) => {
        if (history) {
          const rows = [];
          Object.keys(history).forEach((i) => {
            rows.push(<Item key={i} data={history[i]} />);
          });
          setItems(rows);
        }

        action.refreshEthBalance();
        action.refreshL2Assets();
      });
    } catch (e) {

    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Transactions</div>
      <div className={styles.list}>
        { items }
      </div>
    </div>
  );
}

export default Transactions;
