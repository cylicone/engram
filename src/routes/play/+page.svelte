<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { darkMode } from '../../stores/theme';
	import { get } from 'svelte/store';

	interface Button {
		num: number;
		enabled: boolean;
	}
	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		color: string;
		life: number;
	}

	let currentNumber = 0;
	let hideNumbers = false;
	let displayButtons: (Button | null)[] = [];
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let particles: Particle[] = [];

	let startTime: number | null = null;
	let endTime: number | null = null;
	let elapsedTime = 0;
	let timerInterval: number;

	let showModal = false;
	let showLoseScreen = false;
	let showCountdown = true;
	let countdownNumber = 3;
	let gameStarted = false;

	function getRandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	function startTimer() {
		startTime = Date.now();
		timerInterval = setInterval(() => {
			elapsedTime = (Date.now() - (startTime || 0)) / 1000;
		}, 50);
	}

	function startCountdown() {
		showCountdown = true;
		countdownNumber = 3;
		gameStarted = false;

		const countdownInterval = setInterval(() => {
			countdownNumber--;
			if (countdownNumber <= 0) {
				clearInterval(countdownInterval);
				showCountdown = false;
				gameStarted = true;
				startTimer();
			}
		}, 1000);
	}

	function numberPressed(num: number): boolean {
		if (!gameStarted) return false;

		if (num === currentNumber + 1) {
			currentNumber = num;

			if (currentNumber >= 9) {
				endTime = Date.now();
				clearInterval(timerInterval);
				triggerConfetti();
				showModal = true;
			}

			hideNumbers = currentNumber > 0 && currentNumber < 9;
			return true;
		}
		return false;
	}

	function triggerConfetti() {
		for (let i = 0; i < 100; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: -10,
				vx: (Math.random() - 0.5) * 4,
				vy: Math.random() * 3 + 2,
				size: Math.random() * 6 + 4,
				color: `hsl(${Math.random() * 360}, 70%, 60%)`,
				life: 60 + Math.random() * 30
			});
		}
	}

	function updateParticles() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		particles = particles.filter((p) => p.life > 0);
		particles.forEach((p) => {
			p.x += p.vx;
			p.y += p.vy;
			p.vy += 0.05;
			p.life--;
			ctx.fillStyle = p.color;
			ctx.fillRect(p.x, p.y, p.size, p.size);
		});
		requestAnimationFrame(updateParticles);
	}

	function shuffle<T>(arr: T[]) {
		return arr.sort(() => Math.random() - 0.5);
	}

	function toggleDarkMode() {
		darkMode.update((val) => !val);
	}

	function generateButtons() {
		const unique = Array.from({ length: 9 }, (_, i) => ({ num: i + 1, enabled: true }));
		const pool = [...unique];
		const picked: (Button | null)[] = [];
		while (picked.length < unique.length) {
			const idx = getRandomInt(0, pool.length);
			picked.push(pool.splice(idx, 1)[0]);
		}
		while (picked.length < 15) picked.push(null);
		displayButtons = shuffle(picked);
	}

	async function resetGame() {
		clearInterval(timerInterval);
		currentNumber = 0;
		hideNumbers = false;
		startTime = null;
		endTime = null;
		elapsedTime = 0;
		showModal = false;
		showLoseScreen = false;
		gameStarted = false;

		generateButtons();
		await tick(); // ensure buttons are rendered before starting the countdown
		startCountdown();
	}

	function loseScreen() {
		clearInterval(timerInterval);
		currentNumber = 0;
		hideNumbers = false;
		startTime = null;
		endTime = null;
		elapsedTime = 0;
		showModal = false;
		showLoseScreen = true;
		gameStarted = false;
	}

	onMount(async () => {
		document.documentElement.classList.toggle('dark', get(darkMode));

		generateButtons();
		await tick(); // wait for button render
		startCountdown();

		ctx = canvas.getContext('2d')!;
		function resize() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
		window.addEventListener('resize', resize);
		resize();
		updateParticles();
	});
</script>

<canvas
	bind:this={canvas}
	style="position:fixed; top:0; left:0; pointer-events:none; z-index:9999"
/>

{#if showCountdown}
	<div
		class="fixed inset-0 z-40 flex items-center justify-center transition-colors duration-300 {$darkMode
			? 'bg-gray-900'
			: 'bg-white'}"
	>
		<div class="text-center">
			<div
				class="text-9xl font-bold mb-4 animate-pulse transition-colors duration-300 {$darkMode
					? 'text-white'
					: 'text-gray-800'}"
			>
				{countdownNumber > 0 ? countdownNumber : 'GO!'}
			</div>
			<div
				class="text-2xl font-semibold transition-colors duration-300 {$darkMode
					? 'text-gray-300'
					: 'text-gray-600'}"
			>
				{countdownNumber > 0 ? 'Get Ready...' : 'Find the numbers 1-9 in order!'}
			</div>
		</div>
	</div>
{/if}

<div
	class="min-h-screen transition-colors duration-300 {$darkMode ? 'bg-gray-900' : 'bg-white'}"
	class:opacity-0={showCountdown}
>
	<div class="flex justify-end p-4">
		<button
			on:click={toggleDarkMode}
			class="p-2 rounded-lg transition-colors duration-300 {$darkMode
				? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
				: 'bg-gray-100 text-gray-800 hover:bg-gray-200'}"
			title="Toggle dark mode"
		>
			{#if $darkMode}
				☀️
			{:else}
				🌙
			{/if}
		</button>
	</div>

	<div class="text-center text-2xl font-semibold pb-2 text-green-500 dark:text-green-500">
		Time: {elapsedTime.toFixed(2)}s
	</div>

	<div class="grid grid-cols-3 grid-rows-5 gap-2 w-full max-w-lg mx-auto px-4 pb-10">
		{#each displayButtons as btn, i (i)}
			<div class="aspect-square">
				{#if btn}
					<button
						class="w-full h-full text-8xl rounded-lg disabled:opacity-50 transition-colors duration-300 {$darkMode
							? 'bg-blue-600 hover:bg-blue-700 text-white'
							: 'bg-blue-500 hover:bg-blue-600 text-white'}"
						on:click={() => {
							if (numberPressed(btn.num)) {
								displayButtons[i] = { ...btn, enabled: false };
								displayButtons = [...displayButtons];
							} else {
								loseScreen();
							}
						}}
						disabled={!btn.enabled || !gameStarted}
					>
						{hideNumbers ? '?' : btn.num}
					</button>
				{:else}
					<button
						class="w-full h-full rounded-lg transition-colors duration-300 {$darkMode
							? 'bg-gray-700'
							: 'bg-gray-200'}"
						disabled
					></button>
				{/if}
			</div>
		{/each}
	</div>
</div>

{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-20 backdrop-blur-sm">
		<div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-md w-full text-center">
			<h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">🎉 Great job!</h2>
			<p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
				You completed the game in <strong>{elapsedTime.toFixed(2)} seconds</strong>.
			</p>
			<div class="flex flex-col gap-3">
				<button
					class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
					on:click={resetGame}
				>
					Play Again
				</button>
				<button class="text-sm text-gray-500 mt-2 underline" on:click={() => (showModal = false)}>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

{#if showLoseScreen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-80 backdrop-blur-sm">
		<div
			class="bg-red-50 dark:bg-red-900 border-2 border-red-500 p-6 rounded-2xl shadow-xl max-w-md w-full text-center"
		>
			<h2 class="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">💀 You Failed</h2>
			<p class="text-lg text-red-700 dark:text-red-300 mb-6">You lost the game!</p>
			<div class="flex flex-col gap-3">
				<button
					class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
					on:click={resetGame}
				>
					Try Again
				</button>
				<button
					class="text-sm text-red-500 dark:text-red-400 mt-2 underline hover:text-red-600"
					on:click={() => (showLoseScreen = false)}
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(html) {
		transition: background-color 0.3s ease;
	}
	.aspect-square {
		position: relative;
		width: 100%;
		padding-top: 100%;
	}
	.aspect-square > button {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
