<template>
	<div class="workspace-content inner-padding-left inner-padding-bottom inner-padding-right">
		<v-row dense>
			<v-col cols="auto">
				<v-btn @click="isParsing ? stopParsing() : startParsing()">
					{{ isParsing ? 'Stop scanning' : 'Update list' }}
				</v-btn>
			</v-col>
			<v-col cols="auto">
				<v-btn @click="refreshList" :disabled="isParsing">
					Refresh
				</v-btn>
			</v-col>
		</v-row>

		<ag-grid-vue
			:rowData="serversData"
			:columnDefs="serversDefs"
			:defaultColDef="defaultColDef"
			:theme="serversTheme"
			:suppressScrollOnNewData="true"
			class="servers-table">
		</ag-grid-vue>

		<div class="status-bar">
			<div class="status-bar__left">
				<span>
					{{ isParsing ? parserStatus : "Parsing stopped" }}
				</span>
			</div>
			<div class="status-bar__right">
				<span>
					Queue pages: {{ queueInfo.pages }}
				</span>
				<span>
					Queue IPs: {{ queueInfo.ips }}
				</span>
				<span>
					Queue servers: {{ queueInfo.servers }}
				</span>
				<span>
					Servers count: {{ serversData.length }}
				</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
.servers-table {
	height: calc(100% - 75px);
	margin-top: 10px;
}

.servers-table:deep() .ag-root-wrapper {
	border-radius: var(--base-radius);
}

.status-bar {
	height: 30px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: rgb(var(--v-theme-surface));
	border-top: rgba(var(--v-theme-border), 1) 1px solid;
	position: absolute;
	bottom: 0px;
	left: 0px;
	padding: 0px var(--workspace-inner-padding);
	z-index: 9;
	font-size: 12px;
}

.status-bar span, .status-bar__left {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.status-bar__left, .status-bar__right {
	display: flex;
	gap: 10px;
	align-items: center;
}
</style>

<script>
import { AgGridVue } from "ag-grid-vue3";
import PQueue from "p-queue";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import {
	themeBalham,
	colorSchemeDark
} from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const game_type = "cstrike";
const initConcurrency = 200;
var parseQueue, ipsQueue, serversQueue;

export default {
	data() {
		return {
			queueInfo: {
				pending: {
					pages: 0,
					ips: 0,
					servers: 0
				},
				size: {
					pages: 0,
					ips: 0,
					servers: 0
				}
			},
			isParsing: false,
			parserStatus: "Not started",
			//parse input data
			parseData: {
				web: [
					"https://tsarvar.com/ru/servers/counter-strike-1.6",
					"https://wargm.ru/servers/counter-strike-1-6",
					"https://ip-games.ru/game/cs16",
					"https://www.gs4u.net/ru/cs16/",
					"https://gamingservers.ru/cs16/",
					"https://servera-cs.com/",
					"https://playmon.ru/counterstrike",
					"https://cs-ms-monitoring.ru/all-servers/",
					"https://servers-monitoring.ru/servera-cs/",
					"https://monwave.ru/cs16/servers",
					"https://cs-booster.ru/monitoring/",
					"https://cs2go.ru/servers/cs16",
					"https://servera-cs16.ru/",
					"https://servers-monitoring.ru/",
					"https://www.csboost.eu/cs-boost-counter-strike-1-6-servers.php"

				],
				master_servers: [
					"hl2master.steampowered.com:27011",
					"ms.valvemon.ru:27010",
					"94.77.163.191:27010",
				],
			},

			//ag-grid
			serversTheme: themeBalham
				.withPart(colorSchemeDark),
			defaultColDef: {
				sortable: true,
				resizable: true,
				autoSizeStrategy: {
					type: "fitGridWidth",
				},
			},
			serversDefs: [
				{
					field: "secure",
					headerName: "🛡️",
					width: 34,
					minWidth: 34,
					maxWidth: 34,
					cellClass: "text-center",
					lockPosition: 'left',
					valueGetter: (params) => {
						if (params.data.secure) {
							return "🛡️";
						}
					}
				},
				{
					field: "password",
					headerName: "🔒",
					width: 34,
					minWidth: 34,
					maxWidth: 34,
					cellClass: "text-center",
					lockPosition: 'left',
					valueGetter: (params) => {
						if (params.data.password) {
							return "🔒";
						}
					}
				},
				{
					field: "name",
					headerName: "Name",
					lockPosition: 'left',
					minWidth: 150,
					width: 300,
					filter: 'agTextColumnFilter',
				},
				{
					field: "address",
					headerName: "Address",
					lockPosition: 'left',
					minWidth: 150,
					flex: 1,
					filter: 'agTextColumnFilter',
				},
				{
					field: "country_name",
					headerName: "Country",
					lockPosition: 'left',
					minWidth: 150,
					flex: 1,
					cellRenderer: (params) => {
						if (params.data.country_name) {
							return `<span class="fi fi-${params.data.country_code.toLowerCase()}"></span> ${params.data.country_name}`;
						} else {
							return "Unknown";
						}
					},
					filter: 'agTextColumnFilter',
				},
				{
					field: "game",
					headerName: "Game",
					lockPosition: 'left',
					minWidth: 150,
					width: 250,
					flex: 1,
					filter: 'agTextColumnFilter',
				},
				{
					headerName: "Players",
					valueGetter: (params) => {
						if (params.data.bots_num == 0) {
							return `${params.data.players_num} / ${params.data.players_max}`;
						} else {
							return `${params.data.players_num} / ${params.data.players_max} (${params.data.bots_num} bots)`;
						}
					},
					comparator: (valueA, valueB, nodeA, nodeB) => {
						return (nodeA.data.players_num + nodeA.data.bots_num) - (nodeB.data.players_num + nodeB.data.bots_num);
					},
					lockPosition: 'left',
					minWidth: 150,
					flex: 1,
				},
				{
					field: "map",
					headerName: "Map",
					lockPosition: 'left',
					minWidth: 150,
					flex: 1,
					filter: 'agTextColumnFilter',
				},
				{
					field: "ping",
					headerName: "Ping",
					lockPosition: 'left',
					minWidth: 100,
					flex: 1,
				},
			],
			serversData: [],
		};
	},
	methods: {
		initQueues() {
			//first queue (page parsing and getting pagination pages)
			if (typeof parseQueue !== "object") {
				parseQueue = new PQueue({
					concurrency: initConcurrency,
					autoStart: false
				});

				parseQueue.on('next', () => {
					this.queueInfo.pending.pages = parseQueue.pending;
					this.queueInfo.size.pages = parseQueue.size;
				});

				parseQueue.on('add', () => {
					this.queueInfo.pages = parseQueue.pending;
					this.queueInfo.size.pages = parseQueue.size;
				});
			} else {
				parseQueue.pause();
				parseQueue.clear();
			}

			//second queue (IP parsing)
			if(typeof ipsQueue !== "object") {
				ipsQueue = new PQueue({
					concurrency: initConcurrency,
					autoStart: false
				});

				ipsQueue.on('next', () => {
					this.queueInfo.ips = ipsQueue.pending;
					this.queueInfo.size.ips = ipsQueue.size;
				});

				ipsQueue.on('add', () => {
					this.queueInfo.ips = ipsQueue.pending;
					this.queueInfo.size.ips = ipsQueue.size;
				});
			} else {
				ipsQueue.pause();
				ipsQueue.clear();
			}

			//third queue (server parsing)
			if(typeof serversQueue !== "object") {
				serversQueue = new PQueue({
					concurrency: initConcurrency,
					autoStart: false
				});

				serversQueue.on('next', () => {
					this.queueInfo.servers = serversQueue.pending;
					this.queueInfo.size.servers = serversQueue.size;
				});

				serversQueue.on('add', () => {
					this.queueInfo.servers = serversQueue.pending;
					this.queueInfo.size.servers = serversQueue.size;
				});

				serversQueue.onIdle().then(() => {
					console.log("Parsing complete!");
				});
			} else {
				serversQueue.pause();
				serversQueue.clear();
			}
		},
		
		//full refresh of server's list. Clears current list and gets new IP addresses and server's information
		startParsing() {
			//init
			console.log("Parsing servers...");
			this.parserStatus = "Parsing servers...";
			this.isParsing = true;
			this.serversData = []; //clear current list

			//parsing monitorings (first queue)
			console.log("Getting data from monitorings...");
			this.parserStatus = "Getting data from monitorings...";
			this.parseData.web.forEach((url) => {
				parseQueue.add(() => {
					return window.application.parsePaginationLinks(url).then((pagesData) => {
						console.log(`Parsed pages from ${url}`);
						this.parserStatus = `Parsed pages from ${url}`;

						console.log(`Pages count: ${pagesData.length}`);
						console.log("Parsing IPs...");

						//parsing IPs (second queue)
						pagesData.forEach((page) => {
							ipsQueue.add(() => {
								return window.application.parseIPList(page).then((ips) => {
									console.log(`Parsed IPs from ${page}`);
									this.parserStatus = `Parsed IPs from ${page}`;

									ips.forEach((ip) => {
										serversQueue.add(() => {
											return new Promise((resolve) => {
												const exist = this.serversData.find(
													(item) => {
														item.address.split(":")[0] === ip.split(":")[0];
													}
												);

												if (!exist) {
													//get server's info (third queue)
													window.application.getCS16ServerInfo(ip.split(":")[0]).then((serverData) => {
														if (serverData.raw) {
															console.log(serverData);
															console.log(`Received server's ${ip} info:`, serverData);
															if (serverData.raw.folder == game_type) {
																console.log(`Server ${ip} added to the list.`);
																this.parserStatus = `Server ${ip} added to the list.`;

																//geolocation api
																window.application.getIPGeolocation(ip.split(":")[0]).then((countryInfo) => {
																	this.serversData.push(
																		{
																			name: serverData.name,
																			address: ip,
																			game: serverData.raw.game,
																			players_num: serverData.numplayers,
																			players_max: serverData.maxplayers,
																			bots_num: serverData.raw.numbots,
																			ping: serverData.ping,
																			secure: serverData.secure,
																			password: serverData.password,
																			map: serverData.map,
																			country_code: countryInfo.code?.country,
																			country_name: countryInfo.country
																		}
																	);
																});
															}
														} else {
															console.log(`Server ${ip} is offline.`);
															this.parserStatus = `Server ${ip} is offline.`;
														}
														resolve();
													});
												}
											});
										});
									});
								});
							});
						});
					});
				});
			});

			parseQueue.start();
			ipsQueue.start();
			serversQueue.start();
		},

		refreshList() {
			console.log("Refreshing list (in development)...");
			this.parserStatus = "Refreshing list (in development)...";
			this.isParsing = true;
			
			// this.serversData.forEach((row) => {
			// 	serversQueue.add(() => {
			// 		return new Promise((resolve) => {
			// 			const exist = this.serversData.find(
			// 				(item) => {
			// 					item.address.split(":")[0] === row.ip.split(":")[0];
			// 				}
			// 			);

			// 			if (!exist) {
			// 				//get server's info (third queue)
			// 				window.application.getCS16ServerInfo(row.ip.split(":")[0]).then((serverData) => {
			// 					if (serverData.raw) {
			// 						console.log(`Received server's ${row.ip} info:`, serverData);
			// 						if (serverData.raw.folder == game_type) {
			// 							console.log(`Server ${row.ip} added to the list.`);
			// 							this.parserStatus = `Server ${row.ip} added to the list.`;

			// 							this.serversData.push(
			// 								{
			// 									name: serverData.name,
			// 									address: row.ip,
			// 									game: serverData.raw.game,
			// 									players: serverData.numplayers,
			// 									players_max: serverData.maxplayers,
			// 									map: serverData.map,
			// 								}
			// 							);
			// 						}
			// 					} else {
			// 						console.log(`Server ${row.ip} is offline.`);
			// 						this.parserStatus = `Server ${row.ip} is offline.`;
			// 					}
			// 					resolve();
			// 				});
			// 			}
			// 		});
			// 	});
			// });
			// serversQueue.start();
		},

		stopParsing() {
			this.isParsing = false;
			parseQueue.pause();
			parseQueue.clear();

			ipsQueue.pause();
			ipsQueue.clear();

			serversQueue.pause();
			serversQueue.clear();
		},
	},
	mounted() {
		this.initQueues();
		this.startParsing();
	},
	components: {
		AgGridVue,
	},
};
</script>
