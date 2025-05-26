<script lang="ts">
	import { onMount } from 'svelte';
	import { darkMode } from '../stores/theme';

	interface Particle {
		id: number;
		x: number;
		y: number;
		size: number;
		speed: number;
		color: string;
	}

	let particles: Particle[] = [];
	let animationFrame: number;

	function toggleDarkMode() {
		darkMode.update((val) => !val);
	}

	function generateParticles() {
		particles = Array.from({ length: 20 }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 4 + 2,
			speed: Math.random() * 0.5 + 0.2,
			color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
		}));
	}

	function animateParticles() {
		particles = particles.map((p) => ({
			...p,
			y: (p.y + p.speed) % 105
		}));
		animationFrame = requestAnimationFrame(animateParticles);
	}

	onMount(() => {
		generateParticles();
		animateParticles();

		return () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		};
	});
</script>

<svelte:head>
	<title>Engram - Memory Training Game</title>
	<meta
		name="description"
		content="Train your memory with Engram, a simple yet challenging cognitive training game."
	/>
</svelte:head>

<div
	class="min-h-screen transition-colors duration-500 {$darkMode
		? 'bg-gray-900 text-white'
		: 'bg-white text-gray-800'} relative overflow-hidden"
>
	<!-- Animated Background Particles -->
	<div class="fixed inset-0 pointer-events-none">
		{#each particles as particle (particle.id)}
			<div
				class="absolute rounded-full opacity-20"
				style="left: {particle.x}%; top: {particle.y}%; width: {particle.size}px; height: {particle.size}px; background-color: {particle.color}; transform: translate(-50%, -50%);"
			></div>
		{/each}
	</div>

	<!-- Navigation -->
	<nav class="flex justify-between items-center p-6 relative z-10">
		<div class="flex items-center space-x-3">
			<div class="w-8 h-8 {$darkMode ? 'text-blue-400' : 'text-blue-600'}">🧠</div>
			<h1 class="text-2xl font-bold">Engram</h1>
		</div>

		<button
			on:click={toggleDarkMode}
			class="p-3 rounded-xl transition-all duration-300 hover:scale-105 {$darkMode
				? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
				: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
			title="Toggle dark mode"
		>
			{#if $darkMode}
				☀️
			{:else}
				🌙
			{/if}
		</button>
	</nav>

	<!-- Hero Section -->
	<div class="text-center px-6 py-16 relative z-10">
		<div class="max-w-4xl mx-auto">
			<h2 class="text-6xl md:text-8xl font-bold mb-6 {$darkMode ? 'text-white' : 'text-gray-900'}">
				Train Your
				<span class="block {$darkMode ? 'text-blue-400' : 'text-blue-600'}"> Memory </span>
			</h2>

			<p
				class="text-xl md:text-2xl mb-12 {$darkMode
					? 'text-gray-300'
					: 'text-gray-600'} leading-relaxed"
			>
				Challenge yourself with Engram, a simple yet addictive memory training game. Improve your
				cognitive abilities while having fun.
			</p>

			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
				<button
					class="px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 {$darkMode
						? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
						: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25'}"
				>
					Start Playing
				</button>
			</div>
		</div>
	</div>

	<!-- Features Section -->
	<div class="px-6 py-16 relative z-10">
		<div class="max-w-6xl mx-auto">
			<h3 class="text-4xl font-bold text-center mb-16 {$darkMode ? 'text-white' : 'text-gray-900'}">
				Why Play Engram?
			</h3>

			<div class="grid md:grid-cols-3 gap-8">
				<div
					class="p-8 rounded-3xl transition-all duration-300 hover:scale-105 {$darkMode
						? 'bg-gray-800 hover:bg-gray-750'
						: 'bg-gray-50 hover:bg-gray-100'}"
				>
					<div class="text-5xl mb-6 {$darkMode ? 'text-yellow-400' : 'text-yellow-500'}">⚡</div>
					<h4 class="text-2xl font-bold mb-4">Quick & Engaging</h4>
					<p class="{$darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed">
						Short, easy, and quick to do. Games only take seconds to complete! A better way to spend
						a few minutes than doomscrolling.
					</p>
				</div>

				<div
					class="p-8 rounded-3xl transition-all duration-300 hover:scale-105 {$darkMode
						? 'bg-gray-800 hover:bg-gray-750'
						: 'bg-gray-50 hover:bg-gray-100'}"
				>
					<div class="text-5xl mb-6 {$darkMode ? 'text-green-400' : 'text-green-500'}">🎯</div>
					<h4 class="text-2xl font-bold mb-4">Precision Training</h4>
					<p class="{$darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed">
						Designed to improve working memory, attention span, and cognitive flexibility.
					</p>
				</div>

				<div
					class="p-8 rounded-3xl transition-all duration-300 hover:scale-105 {$darkMode
						? 'bg-gray-800 hover:bg-gray-750'
						: 'bg-gray-50 hover:bg-gray-100'}"
				>
					<div class="text-5xl mb-6 {$darkMode ? 'text-purple-400' : 'text-purple-500'}">🏆</div>
					<h4 class="text-2xl font-bold mb-4">Track Progress</h4>
					<p class="{$darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed">
						Monitor your improvement over time with statistics and personal best records (COMING
						SOON)
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Game Preview Section -->
	<div class="px-6 py-16 relative z-10">
		<div class="max-w-4xl mx-auto text-center">
			<h3 class="text-4xl font-bold mb-8 {$darkMode ? 'text-white' : 'text-gray-900'}">
				Simple Yet Challenging
			</h3>

			<p class="text-xl mb-12 {$darkMode ? 'text-gray-300' : 'text-gray-600'}">
				Remember the sequence, tap the numbers in order, and watch your memory skills improve with
				every game.
			</p>

			<!-- Mock Game Grid -->
			<div class="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-12">
				{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as num, i}
					<div class="aspect-square">
						<div
							class="w-full h-full rounded-2xl flex items-center justify-center text-4xl font-bold transition-all duration-300 {i <
							3
								? $darkMode
									? 'bg-blue-600 text-white'
									: 'bg-blue-500 text-white'
								: $darkMode
									? 'bg-gray-700 text-gray-400'
									: 'bg-gray-200 text-gray-500'}"
						>
							{i < 3 ? num : '?'}
						</div>
					</div>
				{/each}
			</div>

			<button
				class="px-12 py-6 text-xl font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 {$darkMode
					? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl'
					: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-2xl'}"
			>
				<a href="/play/"> Play Engram Now </a>
			</button>
		</div>
	</div>

	<!-- Footer -->
	<footer
		class="text-center py-12 border-t {$darkMode
			? 'border-gray-800 text-gray-400'
			: 'border-gray-200 text-gray-600'} relative z-10"
	>
		<div class="flex items-center justify-center space-x-2 mb-4">
			<div class="text-2xl {$darkMode ? 'text-blue-400' : 'text-blue-600'}">🧠</div>
			<span class="text-lg font-semibold">Engram</span>
		</div>
		<p>Train your brain. Challenge your memory. Unlock your potential.</p>
	</footer>
</div>

<style>
	:global(html) {
		transition: background-color 0.3s ease;
	}

	.aspect-square {
		position: relative;
		width: 100%;
		padding-top: 100%;
	}

	.aspect-square > div {
		position: absolute;
		top: 0;
		left: 0;
	}

	.bg-gray-750 {
		background-color: rgb(55, 65, 81);
	}
</style>
