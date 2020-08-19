var express = require('express');
var router = express.Router();
const qs = require('querystring');
const cookie = require('../cookie');
const util = require('util');

const title = 'LinkedIn Scraper Search Form';

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("GET /search");

  if( req.app.locals.cookie === undefined ) {
    console.log('No cookie defined.');
    res.redirect('/');
  } else {
    res.render('search', { title: title });
  }
});

router.post('/', async function(req, res, next) {

  if( req.app.locals.cookie === undefined ) {
    console.log('No cookie defined.');
    res.redirect('/');
  } else {
    console.log("POST /search");
    let page;
    try {
      page = await req.app.locals.browser.newPage();
    } catch(error) {
      res.render('search', { title: title, message: 'Failed to open new browser page: ' + error });
      return;
    }

    try {
      await page.setCookie(cookie(req.app.locals.cookie));
      await page.goto(
        'https://www.linkedin.com/search/results/all/?origin=GLOBAL_SEARCH_HEADER&keywords=%23' + qs.escape(req.body.hashtag),
        {
          waitUntil: 'load'
        }
      );

      console.log('LOADED');

      let resultCount = await page.$('h3.search-results__total');
      if( resultCount === null ) {
        resultCount = 0
      } else {
        resultCount = await resultCount.getProperty('innerText');
        resultCount = await resultCount.jsonValue();
        resultCount = resultCount.split(' ')[1];
      }
      
      let followerCount = await page.$('p.search-result__truncate');
      if( followerCount === null ) {
        followerCount = 0;
      } else {
        followerCount = await followerCount.getProperty('innerText');
        followerCount = await followerCount.jsonValue();
        followerCount = followerCount.toString().split(' ')[0];
      }

      const message = '#' + req.body.hashtag + ' has ' + resultCount + ' results and ' + followerCount + ' followers.';

      await page.close();
      
      res.render('search', { title: title, message: message });
      
    } catch(error) {
      await page.close();
      res.render('search', { title: title, message: error });
    }
  }

});

module.exports = router;
