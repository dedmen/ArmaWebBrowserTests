import { A3API } from "./A3API";
import "./KillTracker.css";
import * as $ from "jquery";
import crosshair_image from './assets/crosshair.svg';
//const crosshair_image = require('./assets/crosshair.svg') as string;

export class KillTracker {


    static async OnKill(weaponTexture: string, killerName: string, killedName: string)
    {

      this.AddRow(killerName, killedName, await A3API.RequestTexture(weaponTexture.substring(1), 512));

      console.log(weaponTexture, killerName, killedName);
        //A3API.RequestFile
    }
  
    static AddRow(killerName: string, killedName: string, weaponImage: string)
    {
      const killTrackerRow = document.createElement('div');
      killTrackerRow.classList.add("killTrackerRow");

      const ekillerName = document.createElement('span');
      ekillerName.textContent = killerName

      const eWeaponImage = document.createElement('img');
      eWeaponImage.src = weaponImage;

      const eKilledName = document.createElement('span');
      eKilledName.textContent = killedName;

      killTrackerRow.appendChild(ekillerName);
      killTrackerRow.appendChild(eWeaponImage);
      killTrackerRow.appendChild(eKilledName);

      const app = document.querySelector('#app'); 
      app!.appendChild(killTrackerRow);
    }

    static Init()
    {
      KillTracker.AddRow("dedmen", "DeadGuy", crosshair_image);
    }

}
