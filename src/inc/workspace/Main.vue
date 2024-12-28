<template>
	<div class="workspace-content inner-padding-left inner-padding-bottom inner-padding-right">

		<ag-grid-vue
			:rowData="serversData"
			:columnDefs="serversDefs"
			:defaultColDef="defaultColDef"
			:theme="serversTheme"
			:suppressScrollOnNewData="true"
			class="servers-table">
		</ag-grid-vue>

		<v-row dense>
			<v-col cols="auto">
				<v-btn @click="isParsing ? stopParsing() : startParsing()">
					{{ isParsing ? 'Stop scanning' : 'Update list' }}
				</v-btn>
			</v-col>
		</v-row>

		<div class="status-bar">
			<div class="status-bar__left">
				<span>
					{{ isParsing ? parserStatus : "Parsing stopped" }}
				</span>
			</div>
			<div class="status-bar__right">
				<span>
					Web pages: {{ queueInfo.pending.webPages }} <span class="cursor-question" title="In queue">(<v-icon icon="mdi-human-queue" /> {{ queueInfo.size.webPages }})</span>
				</span>
				<span>
					Pages IPs: {{ queueInfo.pending.ips }} <span class="cursor-question" title="In queue">(<v-icon icon="mdi-human-queue" /> {{ queueInfo.size.ips }})</span>
				</span>
				<span>
					Master servers IPs: {{ queueInfo.pending.masterServers }} <span class="cursor-question" title="In queue">(<v-icon icon="mdi-human-queue" /> {{ queueInfo.size.masterServers }})</span>
				</span>
				<span>
					Servers info: {{ queueInfo.pending.servers }} <span class="cursor-question" title="In queue">(<v-icon icon="mdi-human-queue" /> {{ queueInfo.size.servers }})</span>
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
	margin-bottom: 10px;
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

.cursor-question {
	cursor: help;
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
const initConcurrency = 50;
var webPagesQueue, masterServersQueue, ipsQueue, serversQueue;

export default {
	data() {
		return {
			queueInfo: {
				pending: {
					webPages: 0,
					masterServers: 0,
					ips: 0,
					servers: 0
				},
				size: {
					webPages: 0,
					masterServers: 0,
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
					"https://www.csboost.eu/cs-boost-counter-strike-1-6-servers.php",
					"https://vm-boost.ru/",
					"https://cs-exes.ru/",
					"https://cs-booster.ru/"

				],
				masterServers: [
					"hl2master.steampowered.com:27011",
					"88.198.47.43:27010",
					"88.198.47.43:27012"
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
			//page parsing and getting pagination pages queue
			if (typeof webPagesQueue !== "object") {
				webPagesQueue = new PQueue({
					concurrency: initConcurrency,
					autoStart: false
				});

				webPagesQueue.on('next', () => {
					this.queueInfo.pending.webPages = webPagesQueue.pending;
					this.queueInfo.size.webPages = webPagesQueue.size;
				});

				webPagesQueue.on('add', () => {
					this.queueInfo.pending.webPages = webPagesQueue.pending;
					this.queueInfo.size.webPages = webPagesQueue.size;
				});
			}

			//master servers queue
			if (typeof masterServersQueue !== "object") {
				masterServersQueue = new PQueue({
					concurrency: initConcurrency,
					autoStart: false
				});

				masterServersQueue.on('next', () => {
					this.queueInfo.pending.masterServers = masterServersQueue.pending;
					this.queueInfo.size.masterServers = masterServersQueue.size;
				});

				masterServersQueue.on('add', () => {
					this.queueInfo.pending.masterServers = masterServersQueue.pending;
					this.queueInfo.size.masterServers = masterServersQueue.size;
				});
			}

			//ip parsing queue
			if(typeof ipsQueue !== "object") {
				ipsQueue = new PQueue({
					concurrency: initConcurrency,
					autoStart: false
				});

				ipsQueue.on('next', () => {
					this.queueInfo.pending,ips = ipsQueue.pending;
					this.queueInfo.size.ips = ipsQueue.size;
				});

				ipsQueue.on('add', () => {
					this.queueInfo.pending.ips = ipsQueue.pending;
					this.queueInfo.size.ips = ipsQueue.size;
				});
			}

			//server's info parsing queue
			if(typeof serversQueue !== "object") {
				serversQueue = new PQueue({
					concurrency: initConcurrency,
					autoStart: false
				});

				serversQueue.on('next', () => {
					this.queueInfo.pending.servers = serversQueue.pending;
					this.queueInfo.size.servers = serversQueue.size;
				});

				serversQueue.on('add', () => {
					this.queueInfo.pending.servers = serversQueue.pending;
					this.queueInfo.size.servers = serversQueue.size;
				});

				serversQueue.onIdle().then(() => {
					console.log("Parsing complete!");
				});
			}
		},
		
		//full refresh of server's list. Clears current list and gets new IP addresses and server's information
		startParsing() {
			//init
			this.initQueues();

			console.clear();
			console.log("Parsing servers...");
			this.parserStatus = "Parsing servers...";
			this.isParsing = true;
			this.serversData = []; //clear current list

			//parsing monitorings queue
			console.log("Getting data from monitorings...");
			this.parserStatus = "Getting data from monitorings...";
			this.parseData.web.forEach((url) => {
				webPagesQueue.add(() => {
					
					return window.application.parsePaginationLinks(url).then((pagesData) => {
						console.log(`Parsed pages from ${url}`);
						this.parserStatus = `Parsed pages from ${url}`;

						console.log(`Pages count: ${pagesData.length}`);

						//parsing IPs from pages and master servers queue
						pagesData.forEach((page) => {
							ipsQueue.add(() => {
								return window.application.parseIPList(page).then((ips) => {
									console.log(`Parsed IPs from ${page}`);
									this.parserStatus = `Parsed IPs from ${page}`;

									ips.forEach((ip) => {
										serversQueue.add(() => {
											return new Promise((resolve) => {
												const exist = false;

												if (!exist) {
													//get server's info queue
													window.application.getCS16ServerInfo(ip.split(":")[0]).then((serverData) => {
														if (serverData !== null) {
															console.log(`Received server's ${ip} info.`);
															if (serverData.folder == game_type) {
																console.log(`Server ${ip} added to the list.`);
																this.parserStatus = `Server ${ip} added to the list.`;

																this.serversData.push(
																	{
																		name: serverData.name,
																		address: serverData.address,
																		game: serverData.game,
																		players_num: serverData.players_num,
																		players_max: serverData.players_max,
																		bots_num: serverData.bots_num,
																		secure: serverData.secure,
																		password: serverData.visibility,
																		map: serverData.map,
																		ping: serverData.ping,
																		country_code: serverData.country_code,
																		country_name: serverData.country_name
																	}
																);
															}
														} else {
															console.log(`Server ${ip} is offline.`);
															this.parserStatus = `Server ${ip} is offline.`;
														}
														resolve();
													}).catch((error) => {
														console.log(`Can't get server's ${ip} info: ${error}`);
														this.parserStatus = `Can't get server's ${ip} info`;
													});
												}
											});
										});
									});
								}).catch((error) => {
									console.log(`Can't parse IPs from ${page}: ${error}`);
									this.parserStatus = `Can't parse IPs from ${page}`;
								});
							});
						});
					}).catch((error) => {
						console.log(`Can't parse pages from ${url}: ${error}`);
						this.parserStatus = `Can't parse pages from ${url}`;
					});
					
				});
			});

			//master servers queue
			console.log("Getting data from master servers...");
			this.parserStatus = "Getting data from master servers...";
			this.parseData.masterServers.forEach((address) => {
				masterServersQueue.add(() => {
					
					return window.application.getCS16MasterServerIPs(address).then((ips) => {
						console.log(`Received ips from master server ${address}`);
						this.parserStatus = `Received ips from master server ${address}`;
						console.log(`Servers count: ${ips.length}`);

						ips.forEach((ip) => {
							serversQueue.add(() => {
		
								
								return new Promise((resolve) => {
									const exist = false;

									if (!exist) {
										//get server's info queue
										window.application.getCS16ServerInfo(ip.split(":")[0]).then((serverData) => {
											if (serverData !== null) {
												console.log(`Received server's ${ip} info.`);
												if (serverData.folder == game_type) {
													console.log(`Server ${ip} added to the list.`);
													this.parserStatus = `Server ${ip} added to the list.`;

													this.serversData.push(
														{
															name: serverData.name,
															address: serverData.address,
															game: serverData.game,
															players_num: serverData.players_num,
															players_max: serverData.players_max,
															bots_num: serverData.bots_num,
															secure: serverData.secure,
															password: serverData.visibility,
															map: serverData.map,
															ping: serverData.ping,
															country_code: serverData.country_code,
															country_name: serverData.country_name
														}
													);
												}
											} else {
												console.log(`Server ${ip} is offline.`);
												this.parserStatus = `Server ${ip} is offline.`;
											}
											resolve();
										}).catch((error) => {
											console.log(`Can't get server's ${ip} info: ${error}`);
											this.parserStatus = `Can't get server's ${ip} info`;
										});
									}
								});
							});
						});
					}).catch((error) => {
						console.log(`Can't get ips from master server ${address}: ${error}`);
						this.parserStatus = `Can't get ips from master server ${address}`;
					});
				});
			});

			webPagesQueue.start();
			masterServersQueue.start();
			ipsQueue.start();
			serversQueue.start();
		},

		stopParsing() {
			this.isParsing = false;

			webPagesQueue.pause();
			masterServersQueue.pause();
			ipsQueue.pause();
			serversQueue.pause();

			webPagesQueue.clear();
			masterServersQueue.clear();
			ipsQueue.clear();
			serversQueue.clear();
		},
	},
	mounted() {
		this.startParsing();
	},
	components: {
		AgGridVue,
	},
};
</script>
