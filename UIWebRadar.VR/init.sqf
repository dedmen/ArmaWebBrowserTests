("MyHudLayer" call BIS_fnc_rscLayer) cutRsc ["HudOverlayUI", "PLAIN"]; // Add our Display to the HUD


ded_fnc_updateRadar = {
	private _ctrl = ((GHUDOverlay#0) displayCtrl 1337);

	private _radarRange = 512;

	private _towerPos = getPos RadarTower;
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
	private _blipInserts = _vehiclesInRadarArea apply {
		private _vPos = getPos _x;
		 _vPos resize 2;
		 format["['%1',%2,%3],", hashValue _x, _vPos#0, _vPos#1]
	};

	_ctrl ctrlWebBrowserAction ["ExecJS", "Radar.UpdateBlips([" + (_blipInserts joinString "") + "]);"];
};

[] spawn {
	Sleep 0.5; // Wait for the UI to be loaded, we cannot open developer console before its open
	private _ctrl = ((GHUDOverlay#0) displayCtrl 1337);

	_ctrl ctrlWebBrowserAction ["OpenDevConsole"]; // Can open developer console here
	_ctrl ctrlWebBrowserAction ["LoadFile", "index.html"]; // Instead of using url= in description.ext, we could also load the file here, that way we can open dev console before the page is loaded
	sleep 0.5;
	_ctrl ctrlWebBrowserAction ["ExecJS", "Radar.Init();"];
	[{call ded_fnc_updateRadar}, 0.2, []] call CBA_fnc_addPerFrameHandler;
}