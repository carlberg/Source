// Copyright 2011 Google

/**
 * @license
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * JS for the editor page.
 *
 * @author Chris Broadfoot (cbro@google.com)
 */

/*
 var PARAMS = parseParams();
 var SRCFILE = unescape(PARAMS.overlay);
 var OUTFILE = 'out.png';
 */
/*
 window.onload = function() {
 var zoom = parseInt(PARAMS.z, 10);
 var div = document.getElementById('map');
 var map = new google.maps.Map(div, {
 center: new google.maps.LatLng(PARAMS.lat, PARAMS.lng),
 zoom: zoom,
 mapTypeId: 'roadmap'
 });

 var img = new Image();
 img.src = SRCFILE;
 img.onload = setupOverlay.bind(this, img, map);
 };*/

/**
 * Adds an editable overlay to the map.
 * 
 * @param {Image}
 *            img
 * @param {google.maps.Map}
 *            map
 */
function setupOverlay(img, map) {
	// sometimes the image hasn't actually loaded
	if (!img.height) {
		setTimeout(setupOverlay.bind(this, img, map), 50);
		return;
	}

	var overlay = new overlaytiler.AffineOverlay(img);
	overlay.setMap(map);
	this.overlay = overlay;

	var opacity = new overlaytiler.OpacityControl(overlay);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(opacity
			.getElement());

	var gdalCommand = document.createElement('pre');
	gdalCommand.id = 'gdal-command';
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(gdalCommand);

	/**
	 * Displays image x/y vs map lat/long
	 */
	google.maps.event.addListener(overlay, 'change', function() {
		gdalCommand.innerText = getTabData();
	});
}

function parseParams() {
	var result = {};
	var params = window.location.search.substring(1).split('&');
	for (var i = 0, param; param = params[i]; i++) {
		var parts = param.split('=');
		result[parts[0]] = parts[1];
	}
	return result;
}

function basename(file) {
	var parts = file.split('/');
	return parts[parts.length - 1];
}

/*******************************************************************************
 * Returns location information for all dots as MapInfo TAB format
 * 
 * @param overlay
 * @param img
 * @returns {String}
 */
function getTabData() {

	var overlay = this.overlay;
	if (overlay != null) {
		var img = this.overlay.img_;

		var dots = overlay.getDotLatLngs();

		var fourth = overlay.getVirtualDotLngLat();

		var cmd = [];
		cmd.push('(' + getSign(dots[0].lng()) + dots[0].lng() + ','
				+ getSign(dots[0].lat()) + dots[0].lat()
				+ ')(0,0) Label \"Top Left\"\r\n');
		cmd.push('(' + getSign(dots[1].lng()) + dots[1].lng() + ','
				+ getSign(dots[1].lat()) + dots[1].lat() + ')(' + img.width
				+ ',0) Label \"Top Right\"\r\n');
		cmd.push('(' + getSign(fourth.lng()) + fourth.lng() + ','
				+ getSign(fourth.lat()) + fourth.lat() + ')(0,' + img.height
				+ ') Label \"Bottom Left\"\r\n');
		cmd.push('(' + getSign(dots[2].lng()) + dots[2].lng() + ','
				+ getSign(dots[2].lat()) + dots[2].lat() + ')(' + img.width
				+ ',' + img.height + ') Label \"Bottom Right\"\r\n');

		var string = cmd.join('');

		var tabHeader = "!table\r\n!version300\r\n!charset WindowsLatin1\r\n\r\n";
		tabHeader += 'Definition Table\r\nFile \"' + basename(img.src)
				+ '\"\r\n';
		tabHeader += 'Type \"RASTER\"\r\n';
		var tabLocation = string;
		var tabCoordSys = 'CoordSys Earth Projection 1, 104\r\nUnits "degree"';
		var tab = tabHeader + tabLocation + tabCoordSys;
		return tab;
	}
	return '';
}

/*******************************************************************************
 * Returns the sign (positive or negative) of a number as string
 * 
 * @param number
 * @returns {String}
 */
function getSign(number) {
	if (number >= 0) {
		return "+";
	}
	return "-";
}

function getFileName() {
	return basename(this.overlay.img_.src).split(".")[0] + ".tab";
}
