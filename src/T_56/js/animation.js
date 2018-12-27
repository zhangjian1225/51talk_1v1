/*

	抛物线运动轨迹  d:运动目标
					t:接收目标
*/
window.funParabola = function(d, t, g,obj) {
	var i = {
		speed: obj.speed,
		curvature:obj.curvature,
		a:obj.a,
		progress: function() {},
		complete: function() {}
	};
	var p = {};
	g = g || {};
	for (var v in i) {
		p[v] = g[v] || i[v]
	}
	var u = {
		mark: function() {
			return this
		},
		position: function() {
			return this
		},
		move: function() {
			return this
		},
		init: function() {
			return this
		}
	};
	var e = "margin",
		r = document.createElement("div");
	if ("oninput" in r) {
		["", "ms", "webkit"].forEach(function(b) {
			var a = b + (b ? "T" : "t") + "ransform";
			if (a in r.style) {
				e = a
			}
		})
	}
	var s = p.curvature,
		q = 0,
		o = 0;
	var k = true;
	if (d && t && d.nodeType == 1 && t.nodeType == 1) {
		var n = {},
			j = {};
		var h = {},
			m = {};
		var f = {},
			l = {};
		u.mark = function() {
			if (k == false) {
				return this
			}
			if (typeof f.x == "undefined") {
				this.position()
			}
			d.setAttribute("data-center", [f.x, f.y].join());
			t.setAttribute("data-center", [l.x, l.y].join());
			return this
		};
		u.position = function() {
			if (k == false) {
				return this
			}
			var b = document.documentElement.scrollLeft || document.body.scrollLeft,
				a = document.documentElement.scrollTop || document.body.scrollTop;
			if (e == "margin") {
				d.style.marginLeft = d.style.marginTop = "0px"
			} else {
				d.style[e] = "translate(0, 0)"
			}
			n = d.getBoundingClientRect();
			j = t.getBoundingClientRect();
			h = {
				x: n.left/window.base + (n.right - n.left) / 2/window.base + b,
				y: n.top/window.base + (n.bottom - n.top) / 2/window.base + a
			};
			m = {
				x: j.left/window.base + (j.right - j.left) / 2/window.base + b,
				y: j.top /window.base+ (j.bottom - j.top) / 2/window.base + a
			};
			f = {
				x: 0,
				y: 0
			};
			l = {
				x: -1 * (h.x - m.x),
				y: -1 * (h.y - m.y)
			};
			q = (l.y - s * l.x * l.x) / l.x;
			// console.log(a,'aaa')
			// console.log(b,'bbb')
			// console.log(n,'nnn')
			// console.log(j,'jjj')
			// console.log(h,'hhh')
			// console.log(f,'fff')
			// console.log(l,'lll')
			// console.log(q,'qqq')
			// console.log(m,'mmm')
			// console.log(s,'sss')


			return this
		};
		u.move = function() {
			if (k == false) {
				return this
			}
			var a = 0,
				b = l.x > 0 ? 1 : -1;
			var c = function() {
				var z = 2 * s * a + q;
				a = a + b * Math.sqrt(p.speed / (z * z + 1));
				if ((b == 1 && a > l.x) || (b == -1 && a < l.x)) {
					a = l.x
				}
				var w = a,
					A = s * w * w + q * w;
				d.setAttribute("data-center", [Math.round(w), Math.round(A)].join());
				if (e == "margin") {
					d.style.marginLeft = w + "rem";
					d.style.marginTop = A + "rem"
				} else {
					d.style[e] = "translate(" + [w + "rem", A + "rem"].join() + ")"
				
					$(".options").eq(obj.parentIndex).find(".choose").eq(obj.chooseIndex).find(".chooseChild").css({
						transform:'scale(.29,.29)',
						transition:'all 1s',
						'transform-origin':'50% 50%',
						'font-size':0
					})

				}
				if (a !== l.x) {
					p.progress(w, A);
					window.requestAnimationFrame(c)
				} else {
					p.complete();
					k = true
					//console.log(obj.chooseIndex,'lll')
				}
			};
			window.requestAnimationFrame(c);
			k = false;
			return this
		};
		u.init = function() {
			this.position().mark().move()
		}
	}
	return u
};
(function() {
	var b = 0;
	var c = ["webkit", "moz"];
	for (var a = 0; a < c.length && !window.requestAnimationFrame; ++a) {
		window.requestAnimationFrame = window[c[a] + "RequestAnimationFrame"];
		window.cancelAnimationFrame = window[c[a] + "CancelAnimationFrame"] || window[c[a] + "CancelRequestAnimationFrame"]
	}
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(h, e) {
			var d = new Date().getTime();
			var f = Math.max(0, 16.7 - (d - b));
			var g = window.setTimeout(function() {
				h(d + f)
			}, f);
			b = d + f;
			return g
		}
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(d) {
			clearTimeout(d)
		}
	}
}());