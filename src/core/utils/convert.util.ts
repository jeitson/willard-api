const processContent = (template, data) => {
	return template.replaceAll(/{{(.*?)}}/g, (match, p1) => data[p1.trim()]);
}

export { processContent };
