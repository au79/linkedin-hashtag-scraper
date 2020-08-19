var express = require('express');
var router = express.Router();

const cookie = require('../cookie');

const title = 'LinkedIn Scraper Login Form';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: title, message: 'Log in to LinkedIn, then copy the `li_at` cookie value into this form.' });
});

router.post('/', async function(req, res, next) {

  let page;
  try {
    page = await req.app.locals.browser.newPage();
  } catch(error) {
    res.render('index', { title: title, message: 'Failed to open new browser page: ' + error });
    return;
  }
  
  try {
    await page.setCookie(cookie(req.body.cookie));
    await page.goto('https://www.linkedin.com/')
    await page.waitForSelector('.profile-rail-card');
    await page.close();

    console.log('LOGGED IN');

    req.app.locals.cookie = req.body.cookie;
    
    res.redirect('/search');
    
  } catch(error) {
    await page.close();
    res.render('index', { title: title, message: 'Login error.  Try again.' });
  }
  
  
});

module.exports = router;
