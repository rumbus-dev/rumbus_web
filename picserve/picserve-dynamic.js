document.addEventListener('DOMContentLoaded', () => {
	const storySection = document.querySelector('.ps-story');
	const steps = Array.from(document.querySelectorAll('.ps-step'));
	const storyText = document.getElementById('ps-story-text');
	const progress = document.getElementById('ps-progress-bar');
	const progressRoot = document.querySelector('.ps-progress');
	const heroMedia = document.querySelector('.ps-hero-media');
	// const deviceFrame = document.querySelector('.ps-device-frame');
	const revealItems = document.querySelectorAll('.reveal');
	const metricValues = document.querySelectorAll('.ps-metric-value');

	const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

	const updateStoryProgress = () => {
		if (!storySection || !steps.length || !storyText || !progress) {
			return;
		}

		const rect = storySection.getBoundingClientRect();
		const viewportHeight = window.innerHeight || 1;
		const maxScrollable = Math.max(rect.height - viewportHeight, 1);
		const traveled = clamp(-rect.top, 0, maxScrollable);
		const ratio = traveled / maxScrollable;
		const percent = Math.round(ratio * 100);
		const stepIndex = clamp(Math.floor(ratio * steps.length), 0, steps.length - 1);

		steps.forEach((step, index) => {
			const isActive = index === stepIndex;
			step.classList.toggle('is-active', isActive);
			if (isActive) {
				const text = step.getAttribute('data-text');
				if (text) {
					storyText.textContent = text;
				}
			}
		});

		progress.style.width = `${percent}%`;
		progressRoot?.setAttribute('aria-valuenow', String(percent));
	};

	const updateHeroParallax = () => {
		if (!heroMedia || !deviceFrame) {
			return;
		}

		const rect = heroMedia.getBoundingClientRect();
		const viewportHeight = window.innerHeight || 1;
		const centerOffset = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
		const y = clamp(-centerOffset * 30, -30, 30);
		const rotate = clamp(-8 + centerOffset * 8, -14, -2);

		heroMedia.style.transform = `translate3d(0, ${y * 0.6}px, 0)`;
		// deviceFrame.style.transform = `rotate(${rotate}deg) translate3d(0, ${-y}px, 0)`;
	};

	const intersectionObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
				}
			});
		},
		{ threshold: 0.22 }
	);

	revealItems.forEach((item) => intersectionObserver.observe(item));

	const animateValue = (element, target) => {
		const duration = 1000;
		const start = performance.now();

		const tick = (now) => {
			const elapsed = now - start;
			const progressRate = clamp(elapsed / duration, 0, 1);
			const eased = 1 - Math.pow(1 - progressRate, 3);
			const value = Math.round(target * eased);
			element.textContent = `${value}`;

			if (progressRate < 1) {
				requestAnimationFrame(tick);
			} else {
				element.textContent = `${target}`;
			}
		};

		requestAnimationFrame(tick);
	};

	const metricObserver = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				const target = Number(entry.target.getAttribute('data-target'));
				if (!Number.isFinite(target)) {
					observer.unobserve(entry.target);
					return;
				}

				animateValue(entry.target, target);
				observer.unobserve(entry.target);
			});
		},
		{ threshold: 0.55 }
	);

	metricValues.forEach((metric) => metricObserver.observe(metric));

	let ticking = false;
	const onScroll = () => {
		if (ticking) {
			return;
		}

		ticking = true;
		window.requestAnimationFrame(() => {
			updateStoryProgress();
			updateHeroParallax();
			ticking = false;
		});
	};

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll);

	onScroll();
});
