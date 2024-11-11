

DED_fnc_GetTrackerUI = {
	_ctrl = (GKillTracker#0) displayCtrl 1337;
	_ctrl;
};

DED_fnc_OnKilled = {
	params ["_unit", "_killer", "_instigator", "_useEffects"];


	private _weaponImage = getText (configFile >> "CfgWeapons" >> (currentWeapon player) >> "picture");

	//private _imageB64 = controlNull ctrlWebBrowserAction ["ToBase64", _weaponImage];

	// static OnKill(weaponTexture: string, killerName: string, killedName: string)
	// String.raw protects our backslashes in the filepath
	private _command = format ["KillTracker.OnKill(String.raw`%1`, `%2`, `%3`)", _weaponImage, name _killer, name _unit];

	(call DED_fnc_GetTrackerUI) ctrlWebBrowserAction ["ExecJS", _command];
};

addMissionEventHandler ["EntityKilled", DED_fnc_OnKilled];

("DEDmyLayer" call BIS_fnc_rscLayer) cutRsc ["KillTrackerUI", "PLAIN"];

hint "waiting";

[] spawn {
	Sleep 0.5;
	hint "loaded!";
	private _ctrl = (call DED_fnc_GetTrackerUI);

	_ctrl ctrlWebBrowserAction ["OpenDevConsole"];
	_ctrl ctrlWebBrowserAction ["LoadFile", "index.html"];
}
