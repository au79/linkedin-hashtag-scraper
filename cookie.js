function getCookie(value) {
  return {
    name: 'li_at',
    value: value,
    domain: '.www.linkedin.com',
    path: '/',
    expires: 1629325751,
    httpOnly: true,
    secure: true
  };
}

module.exports = getCookie;
