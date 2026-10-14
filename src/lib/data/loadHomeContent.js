import { csv } from 'd3-fetch';

const homeContentURL =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDAmoF1opW-e2FGAU9l_aqHfgtw5qpSfVLNiuGPn2M0dr6XQRG_dl5QzPcAL_Ns5fMvPLvv_p0GE30/pub?gid=0&single=true&output=csv';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	dateStyle: 'long',
	timeZone: 'UTC'
});

function formatDate(publishedDate) {
	if (!publishedDate) return null;
	const date = new Date(publishedDate);
	return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date);
}

export async function getHomeContent() {
	try {
		const res = await csv(homeContentURL);
		const home = res.map((row, index) => ({
			id: index,
			title: row.title ? row.title : false,
			authors: [row.author_one, row.author_two, row.author_three].filter(Boolean),
			published_date: row.published_date
				? {
						iso: row.published_date,
						label: formatDate(row.published_date)
					}
				: null,
			img_url: row.img_url ? row.img_url : false,
			img_alt: row.img_alt ? row.img_alt : false,
			intro: [row.intro, row.intro_two, row.intro_three].filter(Boolean),
			how_to: [row.how_to, row.how_to_two, row.how_to_three].filter(Boolean)
		}));

		return home;
	} catch (error) {
		console.error('Could not load home data. ', error);
	}
}
