import { BrowserWindow, ipcMain } from "electron";
import axios from 'axios';
import { parse } from 'node-html-parser';
const { Server, MasterServer } = require('@fabricio-191/valve-server-query');

var geoIP = require('offline-geo-from-ip');

export function initAppEvents(app: Electron.App, win: BrowserWindow) {
	ipcMain.handle("parse-ip-list", (event, url: string): Promise<Array<string>> => {
		return new Promise((resolve) => {
			let result: Array<string> = [];

			//get HTML data from url
			axios.get(url).then((response) => {

				//parse ip:port address
				const regex = /([\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}):([\d]{1,5})/gm;
				let ips = response.data.match(regex) || [];

				//remove duplicates
				ips = ips.filter((currentValue: string, index: number, arr: string) => (
					arr.indexOf(currentValue) === index
				));

				resolve(ips);
			}).catch((error) => {
				resolve([]);
			});
		});
	});

	ipcMain.handle("parse-pagination-links", (event, url: string): Promise<Array<string>> => {
		return new Promise((resolve) => {
			let result: Array<string> = [];
			axios.get(url).then((response) => {
				const domain = new URL(url).host;

				const paginationClasses = [
					".pagination",
					".pager",
					".paging",
					".pagenav",
					".page-links",
					".page-navigation",
					".pagination-wrapper",
					".uk-pagination",
					".pagination-container",
					".pagination-list",
					".page-numbers",
					".page-item",
					".page-link",
					".pages",
					".nav-pages",
					".nav-pagination",
					".paginate",
					".pager-nav",
					".pagination-bar",
					".pager-links",
					".pagination-controls",
					".comments-pagination",
					".item_text_aligncenter"
				];

				//trying to find pagination block
				const root = parse(response.data);
				let urlTemplate = undefined;
				let pagesCount = 0;
				let isFound = false;
				paginationClasses.forEach((className) => {
					if (!isFound) {
						const paginationBlock = root.querySelector(`${className}`);
						if (paginationBlock !== null) {
							//make url template for pagination links
							//trying to find first link
							urlTemplate = paginationBlock.querySelectorAll("a[href*='/']")[0]?.getAttribute("href") || undefined;

							//if the first link is not found, trying to find next link, and don't check it for a correct href, because usually it's not a "previous" link, but a good pagination link
							if (typeof urlTemplate === "undefined") {
								urlTemplate = paginationBlock.querySelectorAll("a")[1]?.getAttribute("href") || undefined;
							}

							//replace the last number with {pageNumber}
							urlTemplate = domain + "/" + urlTemplate?.replace(/\d+(?![^]*\d)/, "{pageNumber}");
							urlTemplate = "https://" + urlTemplate?.replaceAll("//", "/");

							//now trying to find pages count
							const links = paginationBlock.querySelectorAll("a");
							for (let i = 0; i < links.length; i++) {
								let lastLink = links[i];
								let linkCount = Math.max(parseInt(lastLink.innerText), Number(lastLink.innerText.match(/\d+(?![^]*\d)/)?.[0]));
								if (lastLink !== undefined && linkCount > pagesCount) {
									pagesCount = linkCount;
								}
							}

							isFound = true;
						}
					}
				});

				if (urlTemplate == undefined || pagesCount == undefined) {
					resolve([url]);
				} else {
					for (let i = 1; i <= pagesCount; i++) {
						//@ts-ignore
						result.push(urlTemplate.replace("{pageNumber}", i.toString()));
					}

					resolve(result);
				}
			}).catch(() => {
				resolve([]);
			});
		});
	});

	ipcMain.handle("get-cs16-server-info", async (event, ip: string): Promise<any> => {
		let serverAddress = ip.split(":");
		try {
			const server = await Server({
				ip: serverAddress[0],
				port: parseInt(serverAddress[1], 10) || 27015,
				timeout: 3000,
			});
			const info = await server.getInfo();
			const countryInfo = await geoIP.allData(serverAddress[0]);

			return {
				name: info.name,
				address: info.address,
				game: info.game,
				players_num: info.players.online,
				players_max: info.players.max,
				bots_num: info.players.bots,
				secure: info.VAC,
				password: info.visibility != "public",
				map: info.map,
				folder: info.folder,
				ping: server.lastPing,
				country_code: countryInfo.code?.country,
				country_name: countryInfo.country
			};
		} catch (error) {
			return null;
		}
	});

	ipcMain.handle("get-ip-geolocation", (event, ip: string): Promise<any> => {
		return geoIP.allData(ip);
	});

	ipcMain.handle("get-cs16-master-server-ips", async (event, address: string): Promise<Array<string>> => {
		try {
			let serverAddress = address.split(":");
	
			let ip = serverAddress[0];
			let port = parseInt(serverAddress[1]) || 27011;
	
			const data = await MasterServer({
				ip: ip,
				port: port,
				quantity: 'all',
				timeout: 3000,
				region: 'OTHER'
			});
	
			return data;
		} catch (error) {
			return [];
		}
	});
}