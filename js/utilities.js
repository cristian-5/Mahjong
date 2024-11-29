
Array.prototype.chunks = function(n) {
	if (!this.length) return [];
	return [ this.slice(0, n) ].concat(this.slice(n).chunk(n));
};

Array.prototype.empty = function() { return !this.length; };

Set.prototype.bulkAdd = function(A) {
	for (const a of A) this.add(a);
};
Set.prototype.every = function(predicate) {
	for (const value of this) if (!predicate(value)) return false;
	return true;
};
Set.prototype.some = function(predicate) {
	for (const value of this) if (predicate(value)) return true;
	return false;
};
Set.prototype.filter = function(predicate) {
	const filtered = new Set();
	for (const value of this) if (predicate(value)) filtered.add(value);
	return filtered;
};
Set.prototype.map = function(transform) {
	const mapped = new Set();
	for (const value of this) mapped.add(transform(value));
	return mapped;
};
Set.prototype.reduce = function(reducer, initial) {
	let accumulator = initial;
	for (const value of this) accumulator = reducer(accumulator, value);
	return accumulator;
};
Set.prototype.join = function(separator) {
	return Array.from(this).join(separator);
};

function markdown(tree) {
	if (typeof tree === "string") {
		return tree
			.replace(/(†|‡)/g, "<strong>$1</strong>")
			.replace(/\*(.*?)\*/g, "<b>$1</b>")
			.replace(/_(.*?)_/g, "<i>$1</i>");
	} else if (Array.isArray(tree)) {
		return tree.map(markdown);
	} else if (typeof tree === "object" && tree !== null) {
		const marked = {};
		for (const key in tree) marked[key] = markdown(tree[key]);
		return marked;
	}
	return tree;
}

const LANGUAGES = [["en", "English", "🇬🇧"], ["it", "Italiano", "🇮🇹"]];
