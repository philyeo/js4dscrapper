const puppeteer = require('puppeteer');
const random_useragent = require('random-useragent');
const { monthView_url } = require('./config');
const fs = require('fs');


async function getAllDrawNums(drawMth) {
  process.setMaxListeners(0);

  try {
  // Open Browser  
  // const browser = await puppeteer.launch({ headless: false }); 
  const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser'});
  const root_url = "https://www.sportstoto.com.my/";
  // const browser = await puppeteer.launch();  
  const page = await browser.newPage();
  // await page.screenshot({path: 'example.png'});
  // Setup brower
  await page.setDefaultTimeout(10000);
  await page.setViewport({ width: 1200, height: 800 });
  await page.setUserAgent(random_useragent.getRandom());

  // Get data from website
  await page.goto(drawMth);

  const drawNums = await page.evaluate(() => 
                                    Array.from(document.querySelectorAll('span.calendar_drawnumber')).map(e => e.innerText)
                            );

  await browser.close();
  drawNums.forEach(num => scrapeProduct(num))

  // console.log(drawNums);
  // const outData = JSON.stringify(data);
  // fs.writeFile('out.json', outData, function(err, result) {
  //   if (err) console.log('error', err);
  // });


  }catch(error) {
    console.log(error);
    process.exit(1);
  }
}

async function scrapeProduct(drawNum) {
  // console.log("hello");
  try {
  // Open Browser  
  // const browser = await puppeteer.launch({ headless: false }); 
  const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser'});
  const root_url = "https://www.sportstoto.com.my/";
  // const browser = await puppeteer.launch();  
  const page = await browser.newPage();
  // await page.screenshot({path: 'example.png'});
  // Setup brower
  await page.setDefaultTimeout(10000);
  await page.setViewport({ width: 1200, height: 800 });
  await page.setUserAgent(random_useragent.getRandom());

  const data = {};

  // Get data from website
  const finalUrl = 'https://www.sportstoto.com.my/popup_past_results.asp?drawNo=' + drawNum;
  await page.goto(finalUrl);
  // await page.waitForSelector(drawDetails_selector);
  const drawDetails = await page.evaluate(() => 
                                          Array.from(document.querySelectorAll('div#popup_container * span.txt_black6')).map(e => e.innerText)
                            );
  
  data["drawDate"] = drawDetails[0].split(',')[0];
  data["drawNo"] = drawDetails[1];

  // await page.waitForSelector(drawGameTypes_selector);
  const gameTypes = await page.evaluate(() => 
                                  Array.from(document.querySelectorAll('div#popup_container * div.col-sm-6 * td.txt_white5')).map(e => e.innerText.replace(/\s/g, ""))
                            );

  const gameType1 = gameTypes[0];  //toto4d
  data[gameType1] = {}; //toto4d
                                    
  // await page.waitForSelector(drawResultsTbl_selector);
  const toto4Dtop3Results = await page.evaluate(() => 
                                    Array.from(document.querySelectorAll('div#popup_container * tr.txt_black2')[0].querySelectorAll('td')).map(e => e.innerText)
                            );
  
  data[gameType1]["firstPrize"] = toto4Dtop3Results[0];
  data[gameType1]["secondPrize"] = toto4Dtop3Results[1];
  data[gameType1]["thirdPrize"] = toto4Dtop3Results[2];
    
  data[gameType1]["SpecialPrize"] = await page.evaluate(() => 
                                              Array.from(document.querySelectorAll('div#popup_container * div.col-sm-6 > table > tbody > tr > td > table > tbody')[1].querySelectorAll('td')).map(e => e.innerText).filter(k => k % 1 === 0).filter(k => k.length > 1)
                                      );
  
  data[gameType1]["ConsolationPrize"] = await page.evaluate(() => 
                                              Array.from(document.querySelectorAll('div#popup_container * div.col-sm-6 > table > tbody > tr > td > table > tbody')[1].querySelectorAll('td')).map(e => e.innerText).filter(k => k % 1 === 0).filter(k => k.length > 1)
                                      );

  const gameType2 = gameTypes[1];  //toto4djackpot
  data[gameType2] = {}; //toto4djackpot

  const toto4djackpot_raw  = await page.evaluate(() => 
                                            Array.from(document.querySelectorAll('div#popup_container * div.col-sm-6 > table > tbody > tr > td > table > tbody')[3].querySelectorAll('td')).map(e => e.innerText)
                                        );
  toto4djackpot_raw.pop();
  data[gameType2][toto4djackpot_raw.shift().replace(/\s/g, "")] = toto4djackpot_raw.shift().replace(/\s/g, "");
  const jackpot2amt = toto4djackpot_raw.pop().replace(/\s/g, "");
  data[gameType2][toto4djackpot_raw.pop().replace(/\s/g, "")] = jackpot2amt;
  data[gameType2]["Numbers"] = toto4djackpot_raw;

  const otherGameTypeLabels = await page.evaluate(() => 
                                            Array.from(document.querySelectorAll('div#popup_container * div.row > div.col-sm-6 * td.txt_white6')).map(e => e.innerText)
                                          );

  const gameType3 = gameTypes[2];  //toto4dzodiac
  data[gameType3] = {}; //toto4dzodiac
  data[gameType3]["Zodiac"] = root_url.concat(await page.evaluate(() => 
                                              document.querySelector('#popup_container > div > div > div:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(1) > td.txt_black2.txt_left > span > img').getAttribute('src'))
                                        );
  data[gameType3]["firstPrize"] = await page.evaluate(() => 
                                              document.querySelector('#popup_container > div > div > div:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(1) > td:nth-child(2)').innerText
                                          );
  data[gameType3]["secondPrize"] = await page.evaluate(() => 
                                              document.querySelector('#popup_container > div > div > div:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(2) > td.txt_black2').innerText
                                          );
  data[gameType3]["thirdPrize"] = await page.evaluate(() => 
                                              document.querySelector('#popup_container > div > div > div:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(3) > td.txt_black2').innerText
                                          );
  data[gameType3]["fourthPrize"] = await page.evaluate(() => 
                                              document.querySelector('#popup_container > div > div > div:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(4) > td.txt_black2').innerText
                                          );
  data[gameType3]["fifthPrize"] = await page.evaluate(() => 
                                              document.querySelector('#popup_container > div > div > div:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(5) > td.txt_black2').innerText
                                          );
  data[gameType3]["sixthPrize"] = await page.evaluate(() => 
                                              document.querySelector('#popup_container > div > div > div:nth-child(1) > table:nth-child(4) > tbody > tr:nth-child(6) > td.txt_black2').innerText
                                          );

  const gameType4 = otherGameTypeLabels[0].replace('\n', '_').replace(/\s/g, "_"); // supremetoto
  data[gameType4] = {}; //supremetoto
  data[gameType4]["Jackpot"] = await page.evaluate(() => 
                                            document.querySelector('#popup_container > div > div > div:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(2) > td.txt_red1').innerText
                                          );
  data[gameType4]["Numbers"] = await page.evaluate(() => 
                                            Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(1) > td.txt_black2')).map(e => e.innerText).toString().split('\n').map(i => i.trim())[0]
                                          );

  const gameType5 = otherGameTypeLabels[1].replace('\n', '_').replace(/\s/g, "_"); //powertoto
  data[gameType5] = {}; //powertoto
  data[gameType5]["Jackpot"] = await page.evaluate(() => 
                                            document.querySelector('#popup_container > div > div > div:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(2) > td.txt_red1').innerText
                                          );
  data[gameType5]["Numbers"] = await page.evaluate(() => 
                                              Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(1) > td.txt_black2')).map(e => e.innerText).toString().split('\n').map(i => i.trim())[0]
                                          );

  const gameType6 = otherGameTypeLabels[2].replace('\n', '_').replace(/\s/g, "_"); //startoto
  data[gameType6] = {}; //startoto
  data[gameType6]["Jackpot1"] = await page.evaluate(() => 
                                            document.querySelector('#popup_container > div > div > div:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(2) > td.txt_red1').innerText
                                        );
  data[gameType6]["Jackpot2"] = await page.evaluate(() => 
                                            document.querySelector('#popup_container > div > div > div:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(3) > td.txt_red1').innerText
                                        );
  data[gameType6]["Numbers"] = await page.evaluate(() => 
                                          Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td.txt_black2')).map(e => e.innerText).toString().split('\n').map(i => i.trim())[0]
                                  );                                   
                                     
  const gameType7 = gameTypes[3];  //toto5d
  data[gameType7] = {}; //toto5d

  data[gameType7]["firstPrize"] = (await page.evaluate(() => 
                                            Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(6) > tbody > tr:nth-child(1) > td.txt_black4')).map(n => n.innerText))
                                          );  
  data[gameType7]["secondPrize"] = (await page.evaluate(() => 
                                            Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(6) > tbody > tr:nth-child(2) > td.txt_black4')).map(n => n.innerText))
                                          );
  data[gameType7]["thirdPrize"] = (await page.evaluate(() => 
                                            Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(6) > tbody > tr:nth-child(3) > td.txt_black4')).map(n => n.innerText))
                                          );               
                                          
  const gameType8 = gameTypes[4];  //toto6d
  data[gameType8] = {}; //toto6d

  data[gameType8]["firstPrize"] = await page.evaluate(() => 
                                            document.querySelector('#popup_container > div > div > div:nth-child(2) > table:nth-child(7) > tbody > tr:nth-child(1) > td.txt_black4').innerText
                                        );
  data[gameType8]["secondPrize"] = (await page.evaluate(() => 
                                              Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(7) > tbody > tr:nth-child(2) > td.txt_black4')).map(e => e.innerText))
                                          );               
  data[gameType8]["thirdPrize"] = (await page.evaluate(() => 
                                            Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(7) > tbody > tr:nth-child(3) > td.txt_black4')).map(e => e.innerText))
                                          );                                           
  data[gameType8]["fourthPrize"] = (await page.evaluate(() => 
                                            Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(7) > tbody > tr:nth-child(4) > td.txt_black4')).map(e => e.innerText))
                                          );
  data[gameType8]["fifthPrize"] = (await page.evaluate(() => 
                                            Array.from(document.querySelectorAll('#popup_container > div > div > div:nth-child(2) > table:nth-child(7) > tbody > tr:nth-child(5) > td.txt_black4')).map(e => e.innerText))
                                          );                                             


  // console.log(data);
  const outData = JSON.stringify(data);
  fs.appendFile('out.json', outData, function(err, result) {
    if (err) console.log('error', err);
  });

  await browser.close();

  }catch(error) {
    console.log(error);
    process.exit(1);
  }
}

getAllDrawNums(monthView_url);

// async function getAllDrawNumbers() {
  //get all drawNo values in each results_past.asp page

  //returns all the drawNumbers within that month
  //Array.from(document.querySelectorAll('span.calendar_drawnumber')).map(e => e.innerText)

  //get the next months date
  //document.querySelector('#CalendarFrame > tbody > tr > td.calendar_right > a').getAttribute('href').split('=')[1]


// }


//startScrape(beginDate) //date format is m/d/yyyy //assumes end date is current date
//specify the begin and end date for scraping
//from start date as long as not endDate
// go to each month, 
//      for each month, call getAllDrawNumbers() function
//            for each drawNumbers in array of drawNumbers returned, call scapeProduct(drawNo)


// var startDate = "1/20"

// var d = new Date();
// var m = d.getMonth() + 1;
// var y = d.getFullYear().toString().substr(-2);
// d=startDate.split("/")
// counter = parseInt(d[0])
// for(var i=parseInt(d[1]);i<=parseInt(y);i++)
// {
//   for(var j=counter;j<=12;j++){
//     if(j>m && i==y){
//        continue
//     }
//     console.log(j+"/"+i)
//   }
//   counter = 1;
// }

