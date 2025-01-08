//("MyHudLayer" call BIS_fnc_rscLayer) cutRsc ["HudOverlayUI", "PLAIN"]; // Add our Display to the HUD
//
//private _ctrl = ((GHUDOverlay#0) displayCtrl 1337);
//
//_ctrl ctrlAddEventHandler ["JSDialog", {
//	params ["_control", "_isConfirmDialog", "_message"];
//
//	// Insert message as text into the page, by assembling Javascript code to insert a new element and set its text.
//	_control ctrlWebBrowserAction ["ExecJS", format ["const eSpan = document.createElement('span'); eSpan.textContent = 'Script says %1!'; document.body.appendChild(eSpan);", _message]];
//
//	true; // We need to tell it that we handled the "dialog", by returning true or false.
//}];


_ctrl ctrlWebBrowserAction ["OpenDevConsole"]; // Can open developer console here
_ctrl ctrlWebBrowserAction ["LoadFile", "indexArma.html"]; // Instead of using url= in description.ext, we could also load the file here, that way we can open dev console before the page is loaded

player addAction ["OpenOfflineVersion", {
	_display = findDisplay 46;

	_display = _display createDisplay "RscBrowserOffline"; 
	private _ctrl = (_display displayCtrl 1337);

	_ctrl ctrlWebBrowserAction ["OpenDevConsole"]; // Can open developer console here
	_ctrl ctrlWebBrowserAction ["LoadFile", "indexArma.html"]; // Instead of using url= in description.ext, we could also load the file here, that way we can open dev console before the page is loaded
}];

player addAction ["OpenDevelopementVersion", {
	_display = findDisplay 46;

	_display = _display createDisplay "RscBrowserOnline"; 
	private _ctrl = (_display displayCtrl 1337);

	_ctrl ctrlWebBrowserAction ["OpenDevConsole"]; // Can open developer console here
	[_ctrl] spawn {
		params ["_ctrl"];
		Sleep 1;
		_ctrl ctrlSetUrl "http://localhost:5245/"; // Instead of using url= in description.ext, we could also load the file here, that way we can open dev console before the page is loaded
	};
	
}];