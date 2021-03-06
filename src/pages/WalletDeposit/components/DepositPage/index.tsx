import React, { useCallback, useState } from 'react';
import { history } from 'ice';
import { Button, Dialog, NumberPicker, List } from '@alifd/next';
import { ethers } from 'ethers';

import Icon from '@/components/Icon';
import CryptoItem from '@/pages/WalletDetail/components/CtyptoItem';
import Loading from '../Loading';

import styles from './index.module.scss';

import store from '@/store';
import { mount } from '.ice/render';

function WalletDeposit() {
  const [empty] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState<any>();
  const [loadingDeposit, setLoadingDeposit] = useState<boolean>(false);
  const [wallet1, action] = store.useModel('wallet');
  const [amount, setAmount] = useState('0.0');

  const [depositRadOnly, setReadOnly] = useState<boolean>(true);
  const [lockVisible, setLockVisible] = useState<boolean>(false);
  const [balance, setBalance] = useState('0.0');

  const [assetsList, setAssets] = useState([]);

  const [ethL1Balance, setEthL1Balance] = useState<any>();
  const [ethPrice, setEthPrice] = useState(0);
  const [ethUSD, setEthUSD] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);

  let eBalance = null;
  let ePrice = 0;

  const goBack = useCallback(() => {
    history.goBack();
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handleSelectToken = useCallback(() => {
    action.checkNetworkSupport().then((support) => {
      if (support) {
        setVisible(true);
        updateAssets();
      } else {
        action.setState({ errorNetworkVisible: true });
      }
    });

  }, []);

  const handleDoDeposit = useCallback(() => {
    const data = `${amount}`;
    setLoadingDeposit(true);

    try {
      const deposit = action.deposit(data);

      deposit.then((_deposit) => {
        // l2 server is unstable, judge l1 state to determin the trade was finished
        const finishWhileL1Success = true;
        if (finishWhileL1Success) {
          //   <Loading
          //   title="Deposit"
          //   description="Confirm the transaction to Deposit"
          //   icon="icon-loading"
          //   onView={onQueryDeposit}
          // />

          let gasPrice = ethers.BigNumber.from(0);

          let retry = 40;
          function retriveFun () {
            
            if (wallet1?.web3 && _deposit?.ethTx?.hash) {
              // 0x237e87d6834186f9908f20c61337f1f72773b457e2c298ceeee73f8dcf9dae6e
              const receipt = wallet1.web3.eth.getTransactionReceipt(_deposit.ethTx.hash);
              receipt.then((contract) => {
                if (contract?.status) {
                  const bgu = ethers.BigNumber.from(contract.gasUsed);
                  const fee = gasPrice.mul(bgu);
                  const depositResult = {
                    status: true,
                    // 0x237e87d6834186f9908f20c61337f1f72773b457e2c298ceeee73f8dcf9dae6e
                    txHash: _deposit.ethTx.hash,
                    // 0x264b100c3d4b5379eaafdc489208873d31462879
                    from: contract.from,
                    // 0xae4ef048f6329d3114c9c1e1520629ec736d3798
                    to: contract.to,
                    // 0x237e87d6834186f9908f20c61337f1f72773b457e2c298ceeee73f8dcf9dae6e
                    transactionHash: contract.transactionHash,
                    // 418563
                    cumulativeGasUsed: contract.cumulativeGasUsed,
                    // 154349
                    gasUsed: contract.gasUsed,
                    gasPrice: gasPrice.toString(),
                    fee: ethers.utils.formatEther(fee),
                    blockNumber: contract.blockNumber,
                  };
                  action.update({ depositContract: depositResult });
                  setLoadingDeposit(false);
                  history.push('/wallet/detail?t=2');
                  retry = 0;
                }
              });
            }

            if (retry >0) {
              retry --;
              setTimeout(retriveFun, 500);
            }
          };
          if (wallet1?.web3?.eth) {
            const promGasPrice = wallet1.web3.eth.getGasPrice();
            promGasPrice.then((val) => {
              // console.log('wallet1.web3.eth.getGasPrice', val);
              gasPrice = ethers.BigNumber.from(val);
              setTimeout(retriveFun, 200);
            });
          }
        } else if (_deposit?.awaitReceipt) {
          action.update({ depositContract: _deposit });
          // Await confirmation from the zkTube operator
          // Completes when a promise is issued to process the tx
          const receipt = _deposit.awaitReceipt();
          receipt.then((_receipt) => {
            // console.log('deposit, receipt', _receipt);
            history.push('/wallet/detail?t=2');
          });

          // // Await verification
          // // Completes when the tx reaches finality on Ethereum
          const verify = _deposit.awaitVerifyReceipt();
          verify.then((_verify) => {
          });
        }

        // const { receipt, verify } = { receipt: null, verify: null };
        // console.log('handleDoDeposit', _deposit, receipt, verify);
        // receipt.then((val) => {
        //   console.log('handleDoDeposit, receipt', val);
        // });
        // verify.then((val) => {
        //   console.log('handleDoDeposit, verify', val);
        // });
      });
    } catch (error) {
      const exceptionMsg = 'UserDeniedTransaction';
      wallet1.update({
        exceptionMsg,
      });
      // throw(exceptionMsg);
    }

  }, [amount, wallet1, action]);

  const onSelect = useCallback((crypto: any) => {
    setVisible(false);
    setReadOnly(false);
    setSelected(crypto.currency);

    setBalance(crypto.amount);
  }, [wallet1]);

  function formatBalance(currency, curBalance) {
    if (currency == 'ETH') {
      const wei = ethers.BigNumber.from(curBalance);
      return ethers.utils.formatEther(wei);
    } else {
      return curBalance;
    }
  }

  const refreshEthBalance = useCallback((wallet) => {
    action.checkNetworkSupport().then((networkSupport) => {
      if (networkSupport) {
        const promRefresh = action.refreshEthBalance();
        // let eBalance = ethL1Balance;
        // let ePrice = ethPrice;
        promRefresh.then((val) => {
          if (val) {
            val.ethL1Balance.then((val) => {
              setLoadingBalance(false);
              setEthL1Balance(val);
              eBalance = val;
              UIrefreshEthBalance(eBalance, ePrice);
            });
            val.ethPrice.then((val) => {
              setEthPrice(val);
              ePrice = val;
              UIrefreshEthBalance(eBalance, ePrice);
            });
          }
        }, [eBalance, ePrice]);
      } else {
        setVisible(false);
        action.setState({ errorNetworkVisible: false });
        // alert('Change network and Refresh page\nPlease switch your wallet\'s network from mainnet to rinkeby network for this DAPP');
      }
    });
  }, [wallet1, ethL1Balance, ethPrice]);

  // function UIrefreshEthBalance() {
  const UIrefreshEthBalance = useCallback(() => {
    if (eBalance != null) {
      const dataSource = [];
      const currency = 'ETH';
      const formatedBalance = formatBalance(currency, `${eBalance}`);
      dataSource.push({
        icon: 'icon-' + currency.toLowerCase(),
        currency,
        amount: formatedBalance,
        dollar: ePrice > 0 ? formatedBalance * ePrice : 0,
      });
      setAssets(dataSource);
    }
  }, [wallet1, eBalance, ePrice]);
  // }

  const updateAssets = useCallback(() => {
    try {
      const walletSigned = action.walletSigned();
      walletSigned.then((signed) => {
        if (signed) {
          refreshEthBalance(wallet1);
        } else {
          action.setState({ selectWalletDialogVisible : true });
          setLoadingBalance(true);
          const provider = action.refreshWallet();
          provider.then((wallet2) => {
            if (wallet2) {
              refreshEthBalance(wallet1);
            } else {
              handleClose();
            }
          });
        }
      });
    } catch (e) {
    }

  }, [wallet1]);

  const onSearch = (value: string) => {
    const _list = assetsList.filter((item: any) => {
      return item.currency.indexOf(value) > -1;
    });
    setAssets(_list);
  };

  const handleUnlock = useCallback(() => {
  }, []);

  const setAmountByWei = useCallback((wei) => {
    const _wei = ethers.BigNumber.from(wei);
    const eth = ethers.utils.formatEther(_wei);
    setAmount(eth);

  }, []);

  const onAmountChange = useCallback((_amount) => {
    if (_amount <= 0.0) {
      setAmount(_amount);
    } else if (typeof _amount == 'number') {
      const ethAmount = ethers.utils.parseEther(_amount.toString());
      if (ethAmount.gte(ethL1Balance)) {
        setAmount(ethers.utils.formatEther(ethL1Balance));
      } else {
        setAmount(_amount.toString());
      }
    } else {
    }
  }, [ethL1Balance]);

  const onException = useCallback((message) => {
  }, [wallet1]);

  return (
    <div className={styles.container}>
      {loadingDeposit ? (
        <Loading
          title="Deposit"
          description="Confirm the transaction in wallet"
          icon="icon-loading"
          onView={null}
        />
      ) : (
        <div className={styles.card}>
          <div className={styles.header}>
            <Icon type="icon-back" size="xl" onClick={goBack} style={{color:"white"}}/>
            <div className={styles.title}>Deposit</div>
            <div className={styles.extra} />
          </div>
          <div className={styles.formContainer}>
            <div className={styles.label}>Amount</div>
            <div className={styles.fieldContainer}>
              <NumberPicker
                size="large"
                className={styles.input}
                disabled={depositRadOnly}
                defaultValue={0}
                value={Number(amount)}
                min={0.0}
                step={0.001}
                precision={18}
                onChange={(_amount) => { onAmountChange(_amount); }}
              />
              {selected ? (
                <Button type="primary" className={styles.buttonSelected1} onClick={handleSelectToken}>
                  {selected}
                  <Icon type="icon-select" />
                </Button>
              ) : (
                <Button className={styles.button}  text size="medium" onClick={handleSelectToken}>
                  Select Token
                </Button>
              )}
            </div>
            {selected && (
              <>
                <div className={styles.balance}>
                  <span className={styles.text} >Balances: {balance}</span>
                  <Button
                    size="medium"
                    text
                    className={styles.button1}
                    onClick={() => {
                      setAmountByWei(ethL1Balance);
                    }}
                  >
                   <span style={{marginTop : "5px", marginLeft: "5px", marginBottom : "30px", color:"#6a61f1", fontSize : "16px", fontWeight : "bold"}}>MAX</span> 
                  </Button>
                </div>
                <Button size="medium" className={styles.deposit} disabled={Number(amount) <= 0.0} onClick={handleDoDeposit}>
                  Deposit
                </Button>

                {lockVisible && (
                  <>
                    <div>
                      <p className={styles.note}>
                        You should firstly unlock selected token in order to authorize deposits for USDT
                      </p>
                      <Button className={styles.unlock} onClick={handleUnlock}>
                        <Icon type="icon-unlock" />
                        Unlock
                      </Button>
                      <div className={styles.warning}>MetaMask Tx Signature: User denied transaction signature.</div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <Dialog
        title="Balances in L1Account"
        height="300px"
        footer={false}
        visible={visible}
        onClose={handleClose}
        className={styles.dialog}
        closeMode={['close', 'esc', 'mask']}
      >
        {/* <Input placeholder="Filter bannce in L1" className={styles.search} hasClear onChange={onSearch} /> */}
        <div className={styles.list} style={{cursor: "pointer"}}>
          <List
            size="medium"
            loading={loadingBalance}
            emptyContent="No tokens with balance were found!"
            dataSource={assetsList}
            renderItem={(item, i) => (
              <List.Item
                key={i}
                extra={item.money}
                title={item.title}
                
                media={
                  <CryptoItem 
                  icon={item.icon}
                  currency={item.currency}
                  amount={item.amount}
                  dollar={item.dollar}
                  onClick={() => onSelect(item)}
                  
                />}
              />
            )}
          />
        </div>
      </Dialog>
      <div>
        { wallet1.exceptionMsg && onException(wallet1.exceptionMsg) }
      </div>
    </div>
  );
}

export default WalletDeposit;
