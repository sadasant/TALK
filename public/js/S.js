// © sadasant.com

S = {}

~function(D, E, X, U) {

	// Storage
	S.s = window.localStorage || {}

	// Header
	S.h = { "Content-Type" : "application/x-www-form-urlencoded" }

	// DOM Query
	S.q = function(s) { return D.querySelectorAll(s) }

	// Type
	S.t = function(o) {
		return o !== U && o !== null &&
			Object.prototype.toString.call(o).slice(8, -1)
	}

	// To URL
	S.url = function(o) {
		var r = [], k
		for (k in o) r[r.length] = E(k) + '=' + E(o[k])
		return r.join('&')
	}

	// Flush Storage
	S.flush = function(k) {
		if (k) delete S.s[k]
		else for (k in S.s) delete S.s[k]
	}

	// AJAX
	S.ajax = function(t, u, h, d, f, x) {
		x = X ? new X : new ActiveXObject('Microsoft.XMLHTTP')
		x.onreadystatechange = function() {
			x.readyState === 4 && f &&
				f(x.status < 300, x.responseText, x)
		}
		x.open(t, u, true)
		if (h || (d && (h = S.h)))
			for (k in h) x.setRequestHeader(k, h[k])
		x.send(S.t(d) === 'Object' ? S.url(d) : d)
		return x
	}

}(document, encodeURIComponent, XMLHttpRequest)
