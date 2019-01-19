//Syrategy using DEMA MACD and RSI :)

// Let's create our own strategy
var strat = {};

// Prepare everything our strat needs
strat.init = function() {

}

function avgOfArr(arr){
  return (arr.reduce((a,b)=>{
          return a+b
        },0))/arr.length;
}

var boughtAt = 0;
var canBuy = false;

// variables for tradingview's RSI 
var arrGain = [];
var arrLoss = [];
var prevCandleClose = 0;
var firstRS = false;
var avgGain = 0;
var avgLoss = 0;
var prevAvgGain = undefined;
var prevAvgLoss = undefined;
var rs = undefined;
var rsi = undefined;
//
strat.check = function(candle) {
  //console.log(this.talibIndicators);

  //TradingView's RSI calculation
  //console.log('prevCandleClose: '+ prevCandleClose);
  if (prevCandleClose > 0) {
    if (candle.close>prevCandleClose) {
      //console.log('here1: '+candle.close);
      arrGain.push(Math.round((candle.close - prevCandleClose) * 10000) / 10000 );
      arrLoss.push(0);
    }else{
      //console.log('here2: '+candle.close);
      arrLoss.push(Math.round((prevCandleClose - candle.close) * 10000) / 10000 );
      arrGain.push(0);
    }
    //console.log('arrGain: '+arrGain);
    //console.log(arrGain.length);
    //console.log('arrLoss: '+arrLoss);
    //console.log(arrLoss.length);
    //console.log('diff: '+ (candle.close - prevCandleClose));
    if (firstRS == true) {
      //console.log('RS');
      if (arrGain.length == 14 && arrLoss.length == 14) {
        avgGain = prevAvgGain+ ((arrGain[13] - prevAvgGain)/14);
        avgLoss = prevAvgLoss+ ((arrLoss[13] - prevAvgLoss)/14);
        rs = avgGain/avgLoss;
        rsi = 100 - (100/(1+rs));
        console.log('rs: '+ rs);
        console.log('rsi: '+ rsi);
        //console.log('avgGain: '+ avgGain);
        //console.log('avgLoss: '+ avgLoss);
        prevAvgGain = avgGain;
        prevAvgLoss = avgLoss;
        //firstRS = true;
        //console.log(rsi);
        arrLoss.shift();
        arrGain.shift();
      }
    }else{
      //console.log('No first RS');
      if (arrGain.length == 14 && arrLoss.length == 14) {
        //console.log('first RS');
        avgGain = avgOfArr(arrGain);
        avgLoss = avgOfArr(arrLoss);
        //console.log('avgGain: '+ avgGain);
        //console.log('avgLoss: '+ avgLoss);
        rs = avgGain/avgLoss;
        rsi = 100 - (100/(1+rs));
        //console.log(rsi);
        console.log('rs: '+ rs);
        console.log('rsi: '+ rsi);
        prevAvgGain = avgGain;
        prevAvgLoss = avgLoss;
        //console.log('avgGain: '+ avgGain);
        //console.log('avgLoss: '+ avgLoss);
        firstRS = true;
        arrLoss.shift();
        arrGain.shift();
      }
    }
    prevCandleClose = candle.close;
  }else{
    //console.log('here');
    prevCandleClose = candle.close;
    //console.log('first candle close: '+ candle.close);
  }
//TradingView's RSI code END

if (rsi<30) {
  canBuy = true;
}

if (rsi >40&& boughtAt == 0&& canBuy == true) {
  this.advice('long');
  boughtAt = candle.high;
}else if (boughtAt>0&&candle.close>boughtAt*1.005) {
  this.advice('close');
  boughtAt = 0;
  canBuy=false;
}else if (boughtAt>0 && candle.close<boughtAt*0.95) { 
  this.advice('short');
  boughtAt = 0;
  canBuy=false;
}

if (boughtAt>0&&rsi>70) {
  this.advice('short');
  //boughtAt = 0;
  canBuy=false;
}
// Uncomment above for applying SL of 2%

}


module.exports = strat;