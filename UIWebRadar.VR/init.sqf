ded_fnc_updateRadar = {
	params ["_ctrl"];

	private _radarRange = 2048;
	private _radarRangeIFF = 512; // Range at which we know whether friend or foe

	private _towerPos = getPosWorld RadarTower;
	private _towerHeight = _towerPos#2;
	_towerPos resize 2; // pos2D only

	// Update position of radio tower
	_ctrl ctrlWebBrowserAction ["ExecJS", format["Radar.SetPanelGameCoordinates([%1,%2,%3,%4]);",
		_towerPos#0 - _radarRange,
		_towerPos#1 + _radarRange,
		_towerPos#0 + _radarRange,
		_towerPos#1 - _radarRange
	]];

	// Update blips
	private _vehiclesInRadarArea = vehicles inAreaArray [_towerPos, _radarRange, _radarRange];
	_vehiclesInRadarArea = _vehiclesInRadarArea select {_x isKindOf "Air"};

	private _iffVehicles = _vehiclesInRadarArea inAreaArray [_towerPos, _radarRangeIFF, _radarRangeIFF];
	private _unknownVehicles = _vehiclesInRadarArea - _iffVehicles;

	private _blipInsertsIFF = _iffVehicles apply {
		private _vPos = getPosWorld _x;
		if (_vPos#2 < _towerHeight) then {continueWith ""};
		_vPos resize 2;
		private _isEnemy = (side player getFriend side _x) < 0.6;
		format[
			"['%1',%2,%3,'%4','%5'],", hashValue _x, _vPos#0, _vPos#1,
			if (_isEnemy) then [{getText (configOf _x >> "displayName")}, {groupId group _x}], 
			["friend", "enemy"] select _isEnemy
		]
	};

	private _blipInsertsUNK = _unknownVehicles apply {
		private _vPos = getPosWorld _x;
		if (_vPos#2 < _towerHeight) then {continueWith ""};
		_vPos resize 2;
		format["['%1',%2,%3,'%4',''],", hashValue _x, _vPos#0, _vPos#1, ""]
	};
	_ctrl ctrlWebBrowserAction ["ExecJS", "Radar.UpdateBlips([" + (_blipInsertsIFF joinString "") + (_blipInsertsUNK joinString "") + "]);"];
};

uiNamespace setVariable ["Ded_RadarTexDisplay", displayNull];

ded_fnc_createRadarUIOnTex = {
	[(_this#0)] spawn {
		params ["_display"];

		uiNamespace setVariable ["Ded_RadarTexDisplay", _display];

		private _ctrl = (_display displayCtrl 1337);
		_ctrl ctrlWebBrowserAction ["LoadFile", "index.html"]; // Instead of using url= in description.ext, we could also load the file here, that way we can open dev console before the page is loaded
		sleep 0.5; // Wait till its loaded

		//_ctrl ctrlWebBrowserAction ["OpenDevConsole"];
		_ctrl ctrlWebBrowserAction ["ExecJS", "Radar.Init();"];

		// Regularly update the radar
		private _p1 = [{_this call ded_fnc_updateRadar}, 0.2, _ctrl] call CBA_fnc_addPerFrameHandler;
		private _p2 = [{displayUpdate (_this#0)}, 0, _display] call CBA_fnc_addPerFrameHandler;

		_display setVariable ["ded_p1", _p1];
		_display setVariable ["ded_p2", _p2];

		_display displayAddEventHandler ["Unload", {
			params ["_display", "_exitCode"];
			[_display getVariable "ded_p1"] call CBA_fnc_removePerFrameHandler;
			[_display getVariable "ded_p2"] call CBA_fnc_removePerFrameHandler;
		}];
	}
};

GHUDOverlay = [displayNull];

ded_fnc_toggleRadarHUD = {
	if (!isNull (GHUDOverlay#0)) exitwith {
		(GHUDOverlay#0) closeDisplay 2;
	};

	("MyHudLayer" call BIS_fnc_rscLayer) cutRsc ["HudOverlayUI", "PLAIN", -1, true, false]; // Add our Display to the HUD
};

ded_fnc_onRadarHUDOpen = {
	GHUDOverlay = _this;

	private _display = _this#0;
	private _ctrl = (_display displayCtrl 1337);
	_ctrl ctrlWebBrowserAction ["OpenDevConsole"]; // Can open developer console here
	_ctrl ctrlWebBrowserAction ["LoadFile", "index.html"]; // Instead of using url= in description.ext, we could also load the file here, that way we can open dev console before the page is loaded

	// Wait for the browser to actually be loaded //#TODO eventhandler
	[{
		params ["_display"];
		private _ctrl = (_display displayCtrl 1337);

		_ctrl ctrlWebBrowserAction ["ExecJS", "Radar.Init();"];
		// Regular updating
		private _p1 = [{_this call ded_fnc_updateRadar}, 0.2, _ctrl] call CBA_fnc_addPerFrameHandler;
		_display setVariable ["ded_p1", _p1];

	}, _display, 0.2] call CBA_fnc_waitAndExecute;

	_display displayAddEventHandler ["Unload", {
		params ["_display", "_exitCode"];
		systemChat "UnloadHUD";
		[_display getVariable "ded_p1"] call CBA_fnc_removePerFrameHandler;
	}];
};

RadarLaptop addAction ["ToggleRadar", {

	private _disp = uiNamespace getVariable ["Ded_RadarTexDisplay", displayNull];

	// If some exist, close all (We only expect one device to be active ever)
	if (!isNull _disp) exitWith {

		_disp closeDisplay 1; // Close the display, should also clean up ui2texture

		// We will only process the close, after we do the next render update. So we keep the texture active until it actually unloads
		_disp displayAddEventHandler["Unload", {

			RadarLaptop setObjectTexture [1, ""];
			RadarTV setObjectTexture [0, ""];
		}];

		uiNamespace setVariable ["Ded_RadarTexDisplay", displayNull];
	};

	// Open it
	RadarLaptop setObjectTexture [1, "#(rgb,1024,1024,1)ui(RscRadarUI,abc)"];
	RadarTV setObjectTexture [0, "#(rgb,1024,1024,1)ui(RscRadarUI,abc)"];
}];

RadarLaptop addAction ["ToggleRadarHUD", {
	call ded_fnc_toggleRadarHUD;
}];




