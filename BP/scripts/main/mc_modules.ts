export let DebugUtilities: typeof import('@minecraft/debug-utilities') | undefined;

(() => {
	import('@minecraft/debug-utilities').then(module => {
		DebugUtilities = module;
	});
})()