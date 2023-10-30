/**
 * @returns {Promise<import('../../audits/storage').StoragePage[]>}
 */
async function getLHPages() {
	const res = await fetch("/lighthouse-reports/report.json");
	const lhrPages = await res.json();
	return lhrPages;
}

let performanceList = document.querySelector('ul')

getLHPages().then((pages) => {
	pages.forEach((page) => {
		let li = document.createElement("li")
		let a = document.createElement("a");
		a.href = `/lighthouse-reports/${page.reportUrl}`;
		a.innerText = `${page.fileName} | ${page.device} | Performance: ${page.lh.performance} | Accessibility: ${page.lh.accessibility} | SEO: ${page.lh.seo} | Best Practices: ${page.lh.bestPractices}`;
		a.classList.add('text-white')
		a.classList.add('text-lg')
		a.classList.add('hover:text-slate-200')
		a.classList.add('hover:underline')
		li.appendChild(a)
		performanceList.appendChild(li);
	});
});
