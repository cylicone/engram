
import { writable } from 'svelte/store';

const initialValue = (() => {
	if (typeof localStorage !== 'undefined') {
		const saved = localStorage.getItem('darkMode');
		if (saved !== null) return saved === 'true';
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
	return false;
})();

export const darkMode = writable<boolean>(initialValue);

darkMode.subscribe((value) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('darkMode', value.toString());
		document.documentElement.classList.toggle('dark', value);
	}
});
