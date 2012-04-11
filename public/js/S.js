// S.js
// © Daniel R. http://sadasant.com/
~function (W, D, E, U) {

	var MS = ['Msxml2', 'Msxml3', 'Microsoft'],
	H = { "Content-Type": "application/x-www-form-urlencoded" }

	// S
	W.S = { s: W.localStorage || {} }

	// DOM Query
	S.q = function(s) { return D.querySelectorAll(s) }

	// Is type
	S.is = function(t, o) {
		return o !== U && o !== null
		&& Object.prototype.toString.call(o)[8] === t
	}

	// To URL
	S.url = function(o) {
		var r = [], k
		for (k in o) r[r.length] = E(k) + '=' + E(o[k])
		return r.join('&')
	}

	// Flush localStorage
	S.flush = function(k) {
		if (k) delete S.s[k]
		else for (k in S.s) delete S.s[k]
	}

	// new XHR
	S.xhr = function(X, i) {
		for (i = 0; i < 4; i++) try {
			return i
			? new ActiveXObject(MS[i] + '.XMLHTTP') // MSIE
			: new XMLHttpRequest // W3C
		} catch(e) {}
	}

	// AJAX
	S.ajax = function(t, u, h, d, f, X) {
		X = S.xhr()
		X.onreadystatechange = function() {
			X.readyState === 4 && f && f(X.status < 300, X.responseText, X)
		}
		X.open(t, u, true)
		if (h || (d && (h = H)))
			for (k in h) X.setRequestHeader(k, h[k])
		X.send(S.is('O', d) ? S.url(d) : d)
		return X
	}

}(window, document, encodeURIComponent)
