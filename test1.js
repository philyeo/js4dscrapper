/**
 * Web scraper for toto 4d
 */

 const puppeteer = require('puppeteer');
 const random_useragent = require('random-useragent');
 const { test_url } = require('./config');
 const fs = require('fs');
 
 async function scrapeProduct() {
   // console.log("hello");
   try {
   // Open Browser  
   // const browser = await puppeteer.launch({ headless: false }); 
   const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser'});

   // const browser = await puppeteer.launch();  
   const page = await browser.newPage();
   // await page.screenshot({path: 'example.png'});
   // Setup brower
   await page.setDefaultTimeout(10000);
   await page.setViewport({ width: 1200, height: 800 });
   await page.setUserAgent(random_useragent.getRandom());
 
    
   // Get data from website
   await page.goto(test_url);

  const data = await page.evaluate(() => {
      let root_url = "https://www.sportstoto.com.my/";
      const results = {};
      const drawDetails = Array.from(document.querySelectorAll('div#popup_container * span.txt_black6')).map(e => e.innerText);

      results["drawDate"] = drawDetails[0].split(',')[0];
      results["drawNo"] = drawDetails[1];

      const gameTypes = Array.from(document.querySelectorAll('div#popup_container * div.col-sm-6 * td.txt_white5')).map(e => e.innerText.replace(/\s/g, ""));

      const gameType1 = gameTypes[0];  //toto4d
      results[gameType1] = {}; //toto4d


      const toto4Dtop3Results = Array.from(document.querySelectorAll('div#popup_container * tr.txt_black2')[0].querySelectorAll('td')).map(e => e.innerText);

      results[gameType1]["firstPrize"] = toto4Dtop3Results[0];
      results[gameType1]["secondPrize"] = toto4Dtop3Results[1];
      results[gameType1]["thirdPrize"] = toto4Dtop3Results[2];

      results[gameType1]["SpecialPrize"] = Array.from(document.querySelectorAll('div#popup_container * div.col-sm-6 > table > tbody > tr > td > table > tbody')[1].querySelectorAll('td')).map(e => e.innerText).filter(k => k % 1 === 0).filter(k => k.length > 1);

      results[gameType1]["ConsolationPrize"] = Array.from(document.querySelectorAll('div#popup_container * div.col-sm-6 > table > tbody > tr > td > table > tbody')[1].querySelectorAll('td')).map(e => e.innerText).filter(k => k % 1 === 0).filter(k => k.length > 1);
       
      const gameType2 = gameTypes[1];  //toto4djackpot
      results[gameType2] = {}; //toto4djackpot

      const toto4djackpot_raw  = Array.from(document.querySelectorAll('div#popup_container * div.col-sm-6 > table > tbody > tr > td > table > tbody')[3].querySelectorAll('td')).map(e => e.innerText);
  
      toto4djackpot_raw.pop();
      results[gameType2][toto4djackpot_raw.shift().replace(/\s/g, "")] = toto4djackpot_raw.shift().replace(/\s/g, "");
      const jackpot2amt = toto4djackpot_raw.pop().replace(/\s/g, "");
      results[gameType2][toto4djackpot_raw.pop().replace(/\s/g, "")] = jackpot2amt;
      results[gameType2]["Numbers"] = toto4djackpot_raw;

      const otherGameTypeLabels = Array.from(document.querySelectorAll('div#popup_container * div.row > div.col-sm-6 * td.txt_white6')).map(e => e.innerText);
     
      const gameType3 = gameTypes[2];  //toto4dzodiac
      results[gameType3] = {}; //toto4dzodiac
   
      results[gameType3]["Zodiac"] = root_url.concat(document.querySelector('#popup_container > div > div > div:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(1) > td.txt_black2.txt_left > span > img').getAttribute('src'));

      results[gameType3]["firstPrize"] = document.querySelector('#popup_container > div > div > div:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(1) > td:nth-child(2)').innerText;
  
      results[gameType3]["secondPrize"] = document.querySelector('#popup_container > div > div > div:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(2) > td.txt_black2').innerText;
  
      results[gameType3]["thirdPrize"] = document.querySelector('#popup_container > div > div > div:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(3) > td.txt_black2').innerText;
  
      results[gameType3]["fourthPrize"] = document.querySelector('#popup_container > div > div > div:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(4) > td.txt_black2').innerText;

      results[gameType3]["fifthPrize"] = document.querySelector('#popup_container > div > div > div:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(5) > td.txt_black2').innerText;
  
      results[gameType3]["sixthPrize"] = document.querySelector('#popup_container > div > div > div:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(6) > td.txt_black2').innerText;

      const gameType4 = otherGameTypeLabels[0].replace('\n', '_').replace(/\s/g, "_"); // supremetoto
      results[gameType4] = {}; //supremetoto

      results[gameType4]["Jackpot"] = document.querySelector('#popup_container > div > div > div:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(2) > td.txt_red1').innerText;

      results[gameType4]["Numbers"] = Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(1) > td.txt_black2')).map(e => e.innerText).toString().split('\n').map(i => i.trim())[0];

      const gameType5 = otherGameTypeLabels[1].replace('\n', '_').replace(/\s/g, "_"); //powertoto
      results[gameType5] = {}; //powertoto     

      results[gameType5]["Jackpot"] = document.querySelector('#popup_container > div > div > div:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(2) > td.txt_red1').innerText;
    
      results[gameType5]["Numbers"] = Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(1) > td.txt_black2')).map(e => e.innerText).toString().split('\n').map(i => i.trim())[0];

      const gameType6 = otherGameTypeLabels[2].replace('\n', '_').replace(/\s/g, "_"); //startoto
      results[gameType6] = {}; //startoto

      results[gameType6]["Jackpot1"] = document.querySelector('#popup_container > div > div > div:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(2) > td.txt_red1').innerText;
  
      results[gameType6]["Jackpot2"] = document.querySelector('#popup_container > div > div > div:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(3) > td.txt_red1').innerText;
  
      results[gameType6]["Numbers"] = Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td.txt_black2')).map(e => e.innerText).toString().split('\n').map(i => i.trim())[0];

      const gameType7 = gameTypes[3];  //toto5d
      results[gameType7] = {}; //toto5d
    
      results[gameType7]["firstPrize"] = Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(6) > tbody > tr:nth-child(1) > td.txt_black4')).map(n => n.innerText);
                                            
      results[gameType7]["secondPrize"] = Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(6) > tbody > tr:nth-child(2) > td.txt_black4')).map(n => n.innerText);

      results[gameType7]["thirdPrize"] = Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(6) > tbody > tr:nth-child(3) > td.txt_black4')).map(n => n.innerText);
                   
      const gameType8 = gameTypes[4];  //toto6d
      results[gameType8] = {}; //toto6d
    
      results[gameType8]["firstPrize"] = document.querySelector('#popup_container > div > div > div:nth-child(2) > table:nth-child(7) > tbody > tr:nth-child(1) > td.txt_black4').innerText;
                                            
      results[gameType8]["secondPrize"] = Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(7) > tbody > tr:nth-child(2) > td.txt_black4')).map(e => e.innerText);

      results[gameType8]["thirdPrize"] = Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(7) > tbody > tr:nth-child(3) > td.txt_black4')).map(e => e.innerText);

      results[gameType8]["fourthPrize"] = Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(7) > tbody > tr:nth-child(4) > td.txt_black4')).map(e => e.innerText);

      results[gameType8]["fifthPrize"] = Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(7) > tbody > tr:nth-child(5) > td.txt_black4')).map(e => e.innerText);
      
      return results;

  });
 
  //  console.log(data);
   const outData = JSON.stringify(data);
   fs.writeFile('out.json', outData, function(err, result) {
     if (err) console.log('error', err);
   });
 
   await browser.close();
 
   }catch(error) {
     console.log(error);
     process.exit(1);
   }
 }
 
 scrapeProduct();