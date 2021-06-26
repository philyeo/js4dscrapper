/**
 * Web scraper for toto 4d
 */

const puppeteer = require('puppeteer');
const random_useragent = require('random-useragent');
const { url } = require('./config');
const fs = require('fs');

async function scrapeProduct() {
  // console.log("hello");
  try {
  // Open Browser  
  // const browser = await puppeteer.launch({ headless: false });  
  const browser = await puppeteer.launch();  
  const page = await browser.newPage();
  // await page.screenshot({path: 'example.png'});
  // Setup brower
  await page.setDefaultTimeout(10000);
  await page.setViewport({ width: 1200, height: 800 });
  await page.setUserAgent(random_useragent.getRandom());

  const data = {};

  // Get data from website
  const drawDate_selector = 'span.dataDD > font > b';
  const drawNo_selector = 'span.dataDD > b > font';
  const gameType1_selector = 'span.tit4D > font';
  const firstPrize_selector = 'span.dataResultA > b > font';
  const secondPrize_xpath = '(//*[@class="dataResultA"])[2]/font/b';
  const thirdPrize_xpath = '(//*[@class="dataResultA"])[3]/font/b';
  await page.goto(url);
  await page.waitForSelector(drawDate_selector);
  data["drawDate"] = await page.$eval(drawDate_selector, e => e.innerText.split(':')[1].trim());
  data["drawNo"] = await page.$eval(drawNo_selector, e => e.innerText.split('.')[1].trim());

  const gameTypes = await page.evaluate(() => 
                          Array.from(document.querySelectorAll('span.tit4D > font')).map(n => n.innerText.replace(/\s/g, ""))
                      )  
  
  // const gameType1 = await page.$eval(gameType1_selector, e => e.innerText.trim().replace(/\s/g, ""));
  const gameType1 = gameTypes[0];  //toto4d
  data[gameType1] = {}; //toto4d

  data[gameType1]["firstPrize"] = await page.$eval(firstPrize_selector, e => e.innerText.trim());
  const [secondP] = await page.$x(secondPrize_xpath);
  data[gameType1]["secondPrize"] = await (await secondP.getProperty('textContent')).jsonValue();
  const [thirdP] = await page.$x(thirdPrize_xpath);
  data[gameType1]["thridPrize"] = await (await thirdP.getProperty('textContent')).jsonValue();  
  data[gameType1]["specialPrize"] = await page.evaluate(() => 
                  Array.from(document.querySelector('body > div > center > table > tbody > tr:nth-child(5) > td > table:nth-child(2) > tbody').getElementsByTagName('font')).map(n => n.innerText).filter(k => k % 1 === 0).filter(k => k.length > 1));

  data[gameType1]["consolationPrize"] = await page.evaluate(() => 
                  Array.from(document.querySelector('body > div > center > table > tbody > tr:nth-child(5) > td > table:nth-child(3) > tbody').getElementsByTagName('font')).map(n => n.innerText).filter(k => k % 1 === 0).filter(k => k.length > 1));

  const gameType2 = gameTypes[1]


  const gameType3 = gameTypes[2] //toto5d
  data[gameType3] = {} //toto5d
  
  data[gameType3]["firstPrize"] = await page.evaluate(() => 
                                      Array.from(document.querySelectorAll('body > div > center > table >   tbody > tr:nth-child(14) > td > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr > td')).map(n => n.innerText).join('').replace(/\s/g, '')
                                    );

  data[gameType3]["secondPrize"] = await page.evaluate(() => 
                                      Array.from(document.querySelectorAll('body > div > center > table > tbody > tr:nth-child(14) > td > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr > td')).map(n => n.innerText).join('').replace(/\s/g, '')
                                    );     
                              
  data[gameType3]["thirdPrize"] = await page.evaluate(() => 
                                      Array.from(document.querySelectorAll('body > div > center > table > tbody > tr:nth-child(14) > td > table:nth-child(3) > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr > td')).map(n => n.innerText).join('').replace(/\s/g, '')
                                    );                                     
  
  data[gameType3]["fourthPrize"] = await page.evaluate(() => 
                                        Array.from(document.querySelectorAll('body > div > center > table > tbody > tr:nth-child(14) > td > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(5) > table > tbody > tr > td')).map(n => n.innerText).join('').replace(/\s/g, '')
                                      );  

  
  data[gameType3]["fifthPrize"] = await page.evaluate(() => 
                                        Array.from(document.querySelectorAll('body > div > center > table > tbody > tr:nth-child(14) > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(4) > table > tbody > tr > td')).map(n => n.innerText).join('').replace(/\s/g, '')
                                      );  

  data[gameType3]["sixthPrize"] = await page.evaluate(() => 
                                        Array.from(document.querySelectorAll('body > div > center > table > tbody > tr:nth-child(14) > td > table:nth-child(3) > tbody > tr:nth-child(3) > td:nth-child(4) > table > tbody > tr > td')).map(n => n.innerText).join('').replace(/\s/g, '')
                                      );  


  const gameType4 = gameTypes[3] //toto6d
  data[gameType4] = {} //toto6d

  data[gameType4]["firstPrize"] = await page.evaluate(() => 
                                        Array.from(document.querySelectorAll('body > div > center > table > tbody > tr:nth-child(14) > td > table:nth-child(4) > tbody > tr:nth-child(1) > td:nth-child(3) > div > table > tbody > tr > td > div > center > table > tbody > tr > td')).map(n => n.innerText).join('').replace(/\s/g, '')
                                      );  
  
  data[gameType4]["secondPrize"] = (await page.evaluate(() => 
                                            Array.from(document.querySelectorAll('body > div > center > table > tbody > tr:nth-child(14) > td > table:nth-child(4) > tbody > tr:nth-child(2)')).map(n => n.innerText.replaceAll('\t', '').replace('2nd', '').replace('\nor','').trimLeft('\n'))
                                          )
                                    ).toString().split('\n').map(i => i.trim());
  
  // data[gameType4]["secondPrize"] = game4_secondPrz.toString().split('\n').map(i => i.trim());

  data[gameType4]["thirdPrize"] = (await page.evaluate(() => 
                                            Array.from(document.querySelectorAll('body > div > center > table > tbody > tr:nth-child(14) > td > table:nth-child(4) > tbody > tr:nth-child(3)')).map(n => n.innerText.replaceAll('\t', '').replace('3rd', '').replace('\nor','').trimLeft('\n'))
                                          )
                                    ).toString().split('\n').map(i => i.trim());
                                    

  data[gameType4]["fourthPrize"] = (await page.evaluate(() => 
                                            Array.from(document.querySelectorAll('body > div > center > table > tbody > tr:nth-child(14) > td > table:nth-child(4) > tbody > tr:nth-child(4)')).map(n => n.innerText.replaceAll('\t', '').replace('4th', '').replace('\nor','').trimLeft('\n'))
                                          )
                                    ).toString().split('\n').map(i => i.trim());

  data[gameType4]["fifthPrize"] = (await page.evaluate(() => 
                                            Array.from(document.querySelectorAll('body > div > center > table > tbody > tr:nth-child(14) > td > table:nth-child(4) > tbody > tr:nth-child(5)')).map(n => n.innerText.replaceAll('\t', '').replace('5th', '').replace('\nor','').trimLeft('\n'))
                                          )
                                    ).toString().split('\n').map(i => i.trim());

  
  // console.log(data);
  // const json = JSON.parse(data);
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