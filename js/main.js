
function tile(name, blanks) {
	const n = parseInt(name[1]);
	if (name === "##" || !name.startsWith('#'))
		return $('<div class="tile">').addClass(name)
		.attr("data-suit", name[0])
		.attr("data-" + (n ? "n" : "variant"), name[1].toUpperCase());
	if (Array.isArray(blanks)) return $(`<div class="tile empty">`).html(
		(blanks[n - 1] || "").replace(/\n/g, "<br>")
	);
	return $(`<div class="tile empty">`).html(
		Object.keys(blanks).map(l => `<span lang="${l}">${
			(blanks[l][n - 1] || "").replace(/\n/g, "<br>")
		}</span>`).join("")
	);
}

function idealize(name) { return name.replace(/\W+/g, '_').toLowerCase(); }

function hands(HANDS, id) {
	for (let hand of HANDS) {
		// draw hand:
		hand.id = idealize(hand.name.en || hand.name);
		const container = $(`<div id="${hand.id}" class="hand-container">`);
		const name_html = (typeof hand.name === "string" ? hand.name :
			Object.keys(hand.name).map(
			l => `<span lang="${l}">${hand.name[l]}</span>`
		).join(""));
		container.append($("<h2>").html(
			`${name_html}<span class="score">${hand.score}</span>`
		));
		if (hand.description) container.append($("<p>").html((
			typeof hand.description === "string" ? hand.description :
			Object.keys(hand.description).map(
				l => `<span lang="${l}">${hand.description[l]}</span>`
			).join("")
		)));
		const hand_html = $('<div class="hand">');
		const combos = hand.example.trim().split(/\s+/g);
		for (let i = 0; i < combos.length; i++) {
			const combo_html = $('<div class="combo">');
			const tiles = combos[i].match(/.{2}/g);	
			const tiles_html = $("<div>");
			for (const t of tiles) tiles_html.append(
				tile(t.replace("##", ""), hand.blanks)
			);
			combo_html.append(tiles_html);
			if (hand.info) combo_html.append($('<p class="info">').html(
				Array.isArray(hand.info) ? hand.info[i] :
				Object.keys(hand.info).map(
					l => `<span lang="${l}">${hand.info[l][i] || ""}</span>`
				).join("")
			));
			hand_html.append(combo_html);
		}
		container.append(hand_html);
		$(id).append(container);
		// initialize search keywords:
		hand.keywords = new Set();
		if (typeof hand.name === "string")
			hand.name.toLowerCase().split(/\W+/g);
		for (const key in hand.name) hand.keywords.bulkAdd(
			hand.name[key].toLowerCase().split(/\W+/g)
		);
		hand.types = information(hand.info);
	}
}

function information(info) {
	const types = new Set();
	const V = [ "wind", "dragon", "run", "kong", "pung", "pair", "chow" ];
	if (Array.isArray(info)) types.bulkAdd(info.map(
		combo => combo.toLowerCase().split(/\W+/g)
		.map(i => i.replace(/s$/, "")).filter(i => V.includes(i))
	)); else types.bulkAdd(Object.keys(info).map(
		key => info[key].map(i => i.toLowerCase().split(/\W+/g)).flat()
		.map(i => i.replace(/s$/, "")).filter(i => V.includes(i))
	).flat());
	return types;
}

function search() {
	const sort = $("#sort").attr("title");
	const text = $("#search").val().replace(/&/g, "and");
	const query = text.toLowerCase().split(/\W+/).filter(x => x.length > 1);
	const checks = {
		"wind":   $("#check-w").attr("state"),
		"dragon": $("#check-d").attr("state"),
		"run":    $("#check-r").attr("state"),
		"chow":   $("#check-c").attr("state"),
		"kong":   $("#check-4").attr("state"),
		"pung":   $("#check-3").attr("state"),
		"pair":   $("#check-2").attr("state"),
	};
	const  on_checks = Object.keys(checks).filter(k => checks[k] === "on");
	const off_checks = Object.keys(checks).filter(k => checks[k] === "off");
	let filtered = [];
	for (const hand of HANDS) {
		const joined = hand.keywords.join(" ");
		const points = query.reduce((p, q) => p + joined.includes(q), 0);
		if (!query.empty() && points == 0) continue;
		if (on_checks.every(c => hand.types.has(c)) &&
			off_checks.every(c => !hand.types.has(c)))
		filtered.push({ id: hand.id, points, score: hand.score });
	}
	const norm = x => 1 / x, invt = x => 1 - 1 / x;
	if (sort === "Ascending") filtered.sort(
		(a, b) => (b.points + norm(b.score)) - (a.points + norm(a.score))
	); else if (sort === "Descending") filtered.sort(
		(a, b) => (b.points + invt(b.score)) - (a.points + invt(a.score))
	);
	const hands = $(".hand-container");
	for (const hand of hands) {
		const found = filtered.findIndex(f => f.id === hand.id);
		if (found === -1) $(hand).hide();
		else $(hand).css("order", sort !== "Unordered" ? found : "0").show();
	}
}
