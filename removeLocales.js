//removing unused locales from electron-builder release build
exports.default = async function (context) {
	var fs = require('fs');
	var localeDir = context.appOutDir + '/locales/';

	fs.readdir(localeDir, function (err, files) {
		//files is array of filenames (basename form)
		if (!(files && files.length)) return;
		for (var i = 0, len = files.length; i < len; i++) {
			var match = files[i].match(/en-US\.pak/);
			if (match === null) {
				fs.unlinkSync(localeDir + files[i]);
			}
		}
	});
}