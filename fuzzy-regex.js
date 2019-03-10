class FuzzyRegExp {

    constructor(pattern, fuzzines = 100, flags = '') {
        new RegExp(pattern, flags); // validation

        let escaped = false,
            noncapture = false,
            square = false,
            curly = false;

        const tokens = [], changePoints = [], tree = [];

        for (let i = 0; i < pattern.length; i++) {
            if (escaped = !escaped && pattern[i - 1] == '\\') {
                if (tokens.length) {
                    tokens[tokens.length - 1] += pattern[i];
                } else {
                    tokens.push(pattern[i]);
                }
            } else {
                if (pattern[i] == '(') {
                    noncapture = pattern[i + 1] == '?';

                } else if (pattern[i] == '[') {
                    square = true;
                    tokens.push('');

                } else if (pattern[i] == ']') {
                    square = false;

                } else if (!square) {

	                if (pattern[i] == '{') {
	                    curly = true;
	                    tokens.push('');

	                } else if (pattern[i] == '}') {
	                    curly = false;

	                } else if (!noncapture && !curly) {
	                    changePoints.push(tokens.length);
	                }
                }

                if (square || curly || pattern[i] == ']' || pattern[i] == '}') {
                    tokens[tokens.length - 1] += pattern[i];
                } else {
                    tokens.push(pattern[i]);
                }
            }
        }

        this.flags = flags;
        this.tree = [pattern];

        if (changePoints.length && fuzzines < 100) {
            tree.push(tokens);

            const length = Math.round(changePoints.length * fuzzines / 100);
            for (let i = 0; i < length; i++) {
                tree.map(array => tree.push(...this.fuzzyfy(array)));
            }

            this.tree = tree.map(node => `(?:${node.join('')})`);
        }
    }

    fuzzyfy(array) {
        const arrays = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i].match(/^([\.\?\*\+\(\)\{\}\[\]]|\{.+\})$/)) continue;
            const copy = [...array];
            copy[i] = '.?';
            arrays.push(copy);
        }
        return arrays;
    }

    unwrap() {
        return new RegExp(`(?:${this.tree}`);
    }

    match(string) {
        for (let branch of this.tree) {
            let match = string.match(new RegExp(branch, this.flags));
            if (match) return match;
        }

        return null;
    }

    replace(string, replacement) {
        for (let branch of this.tree) {
            let match = string.match(new RegExp(branch, this.flags));
            if (match) {
                return string.replace(branch, replacement);
            }
        }
        return string;
    }
}
