import { A3API } from './A3API';
import './KillTracker.scss';
//import * as $ from 'jquery';
import crosshair_image from './assets/crosshair.svg';
//const crosshair_image = require('./assets/crosshair.svg') as string;

export class KillTracker {
  static async OnKill(weaponTexture: string, killerName: string, killedName: string) {
    this.AddRow(killerName, killedName, await A3API.RequestTexture(weaponTexture.substring(1), 512));

    console.log(weaponTexture, killerName, killedName);
    //A3API.RequestFile
  }

  static AddRow(killerName: string, killedName: string, weaponImage: string) {
    const killTrackerRow = document.createElement('div');
    killTrackerRow.classList.add('killTrackerRow');

    const ekillerName = document.createElement('span');
    ekillerName.textContent = killerName;

    const eWeaponImage = document.createElement('img');
    eWeaponImage.src = weaponImage;

    const eKilledName = document.createElement('span');
    eKilledName.textContent = killedName;

    killTrackerRow.appendChild(ekillerName);
    killTrackerRow.appendChild(eWeaponImage);
    killTrackerRow.appendChild(eKilledName);

    const app = document.querySelector('#app');
    app!.appendChild(killTrackerRow);

    // Stay for 4 seconds
    setTimeout(() => {
      killTrackerRow.remove();
    }, 4000);

    const ktRows = document.querySelectorAll('.killTrackerRow');
    if (ktRows.length > 4) {
      KillTracker.CreateRainbowTextPopup('M-M-M-MONSTER KILL!!');
    }
  }

  static RemoveRainbowTextPopup() {
    document.querySelectorAll('.c-rainbow').forEach((e) => e.remove());
  }

  static CreateRainbowTextPopup(text: string) {
    KillTracker.RemoveRainbowTextPopup();

    document.getElementById('topCenterSpecial')?.insertAdjacentHTML(
      'afterbegin',
      `
      <ul class="c-rainbow">
        <li class="c-rainbow__layer c-rainbow__layer--white">${text}</li>
        <li class="c-rainbow__layer c-rainbow__layer--orange">${text}</li>
        <li class="c-rainbow__layer c-rainbow__layer--red">${text}</li>
        <li class="c-rainbow__layer c-rainbow__layer--violet">${text}</li>
        <li class="c-rainbow__layer c-rainbow__layer--blue">${text}</li>
        <li class="c-rainbow__layer c-rainbow__layer--green">${text}</li>
        <li class="c-rainbow__layer c-rainbow__layer--yellow">${text}</li>
      </ul>
    `);

    setTimeout(KillTracker.RemoveRainbowTextPopup, 3000);
  }

  static Init() {
    KillTracker.AddRow('dedmen', 'DeadGuy', crosshair_image);
  }
}
