const puppeteer = require('puppeteer');
const path = require("path");
const chai = require('chai');
const expect = chai.expect;


const game = path.resolve(__dirname, "../src/index.html");
let state = null;
let page = null;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCurrentState = function() {
  return window.game.state.current
};


describe("Tests the Phaser game and it's states.", function() {

  it ("Can open browser?", function() {
    return new Promise(async (resolve) => {
      const browser = await puppeteer.launch({ headless: false });
      const pages = await browser.pages();
      page = pages[0];
      return resolve();
    });
  }).timeout(5000);

  it("Can navigate to game?", function() {
    return new Promise(async (resolve) => {
      page.goto(`file://${game}`);
      return resolve();
    });
  }).timeout(5000);

  it("Is initial state menu?", function() {
    return new Promise(async (resolve) => {
      await delay(1000);
      state = await page.evaluate(getCurrentState);
      resolve();
    })
      .then(() => {
        expect(state).to.equal("Menu");
      })
  }).timeout(5000);

  it("Can state change to playing?", function() {
    return new Promise(async (resolve) => {
      await delay(1000);
      await page.keyboard.press('Space');
      await delay(2000);
      state = await page.evaluate(getCurrentState);
      resolve();
    })
      .then(() => {
        expect(state).to.equal("Playing");
      });
  }).timeout(5000);

});