// Bot pour ajouter de la liquity a une pool uniswap fork
// created by cyril Maranber 30/08/21
//version V0.1
// This bot is free to use at your own risk, please just let me know if there is any bug @Antfrasier github.
const { ethers } = require('ethers');

const prompt = require('prompt-sync')();

// uni/sushiswap ABIs
const UniswapV2Pair = require('./abis/IUniswapV2Pair.json');
const UniswapV2Factory = require('./abis/IUniswapV2Factory.json');
const UniswapV2Router02 = require('./abis/IUniswapV2Router02.json');
const IERC20 = require('./abis/IERC20.json')


const privateKey = "YOUR_Private_Key"
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:9545'); //local ganache_cli
const wallet = new ethers.Wallet(privateKey, provider);

function getStuff () {
  console.clear();
  const FactoryAdd = prompt('Factory Address : ');
  const RouterAdd = prompt('Router Address : ');
  const token0Add = prompt('Token0 Adresse ? ');
  const token1Add = prompt('Token1 Adresse ? ');
  var amount0 = prompt('Token0 Amount ? ');
  amount0 = ethers.utils.parseEther(amount0);
  var amount1 = prompt('Token1 Amount ? ');
  amount1 = ethers.utils.parseEther(amount1);
  runAdd(FactoryAdd, RouterAdd, token0Add, token1Add, amount0, amount1 );
}

const runAdd = async (FactoryAdd, RouterAdd, token0Add, token1Add, amount0, amount1) => {
  const factory = new ethers.Contract (
    FactoryAdd,
    UniswapV2Factory.abi,
    wallet
  );
  const router = new ethers.Contract (
    RouterAdd,
    UniswapV2Router02.abi,
    wallet
  );
  const token0 = new ethers.Contract (
    token0Add,
    IERC20.abi,
    wallet
  );
  const token1 = new ethers.Contract (
    token1Add,
    IERC20.abi,
    wallet
  );

  const pairAdd = await factory.getPair(token0Add, token1Add);
  if (pairAdd != 0 ){
      console.log('This pair already exist !');
    }
  else {
    const tx = await factory.createPair(token0Add, token1Add);
    console.log(tx);
    await tx.wait();
    pairAdd = await factory.getPair(token0Add, token1Add);
    }

  //sould approve the contract to spend your money !

const approve0 = await token0.approve (router.address, amount0);
console.log(approve0);
await approve0.wait();
const approve1 = await token1.approve (router.address, amount1);
console.log(approve1);
await approve1.wait();
// function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity); <- Prototype from the smart contract
  const tx2 = await router.addLiquidity (token0Add,token1Add,amount0,amount1,amount0 * 0.95, amount1 * 0.95, pairAdd, 6000000000); //attention big numbres
  console.log(tx2);
  await tx2.wait();


  console.log(`Token0 Address : ${token0Add}`);
  console.log(`Token1 Address : ${token1Add}`);
  console.log(`Token0 Amount : ${amount0}`);
  console.log(`Token0 Address : ${amount1}`);
}

getStuff();
