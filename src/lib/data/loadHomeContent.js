import { csv } from 'd3-fetch';

const homeContentURL =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDAmoF1opW-e2FGAU9l_aqHfgtw5qpSfVLNiuGPn2M0dr6XQRG_dl5QzPcAL_Ns5fMvPLvv_p0GE30/pub?gid=0&single=true&output=csv';

export async function getHomeContent() {
	try {
		const res = await csv(homeContentURL);
		const home = res.map((row, index) => ({
			id: index,
			title: row.title ? row.title : false,
			author_one: row.author_one ? row.author_one : false,
			author_two: row.author_two ? row.author_two : false,
			author_three: row.author_three ? row.author_three : false,
			published_date: row.published_date ? row.published_date : false,
      img_url: row.img_url ? row.img_url : false,
      img_alt: row.img_alt ? row.img_alt : false,
			intro_content: row.intro_content ? row.intro_content : false,
			how_to: row.how_to ? row.how_to : false
		}));

		return home;
	} catch (error) {
		console.error('Could not load home data. ', error);
	}
}
