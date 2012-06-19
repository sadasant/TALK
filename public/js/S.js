// sadasant.com/license

S = {}

// Storage
S.s = window.localStorage || {}

// DOM Query
S.q = function(s) {
  return (s = document.querySelectorAll(s)).length > 1 ? s : s[0]
}

// Type
S.t = function(o, u) {
  return o === u || o === null ? o : Object.prototype.toString.call(o).slice(8, -1)
}

// Object To URL
S.u = function(o) {
  var r = [], k
  for (k in o) r[r.length] = encodeURIComponent(k) + '=' + encodeURIComponent(o[k])
  return r.join('&')
}

// Wipe Storage
S.wipe = function(k) {
  if (k) delete S.s[k]
  else for (k in S.s) delete S.s[k]
}

// AJAX
S.req = function(t, u, h, d, f, x) {
  x = new XMLHttpRequest
  x.onreadystatechange = function() {
    x.readyState === 4 && f && f(x.status < 300, x.responseText, x)
  }
  x.open(t, u, true)
  if (h || (d && (h = { "Content-Type": "application/x-www-form-urlencoded" })))
    for (k in h) x.setRequestHeader(k, h[k])
  x.send(S.t(d) === 'Object' ? S.u(d) : d)
  return x
}
