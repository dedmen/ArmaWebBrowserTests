import { A3API } from './A3API';
import './Radar.scss';
//import blipAudio from './assets/sonar-ping-95840.wav';

const RadarFullRotationTime = 4000; // milliseconds, must match $rotationSpeed in Radar.scss

class RadarBlip {
    position: [number, number] = [0,0];
    element: HTMLLIElement;
    textElement: HTMLSpanElement;

    constructor() {
        var list = document.getElementById('radarContent') as HTMLUListElement;

        var newElement = document.createElement('li');
        this.element = list.insertAdjacentElement(`beforeend`, newElement) as HTMLLIElement;

        var textElement = document.createElement('span');
        this.textElement = this.element.insertAdjacentElement(`beforeend`, textElement) as HTMLLIElement;

        this.element.addEventListener(`animationiteration`, (ev) => {
            
            // When this runs, we should make a blip sound

            //var snd = document.getElementById('radarSound') as HTMLAudioElement;
            //snd.fastSeek(0);
            //snd.play();
        });

        // https://codepen.io/bramus/pen/xxaLXeJ Synchronized Animation Timeline
        this.element.getAnimations().forEach((anim) => {
            // Set to 0. Syncs everything, but delay only applied during first few ticks
            anim.startTime = 0;
        });
    }

    Remove()
    {
        this.element.remove();
    }

    private PointDistance(p1: [number, number], p2: [number, number]){
        var a = p1[0] - p2[0];
        var b = p1[1] - p2[1];

        return Math.sqrt( a*a + b*b );
    }

    SetText(text: string)
    {
        this.textElement.textContent = text;
    }

    SetClass(arg0: string) {
        this.element.className = arg0;
    }

    UpdatePosition(panelGameCoordinates: [number, number, number, number /*Top left, Bottom right*/]) {



        if (
                this.PointDistance(this.position, [
                    panelGameCoordinates[0] + ((panelGameCoordinates[2] - panelGameCoordinates[0]) / 2),
                    panelGameCoordinates[1] + ((panelGameCoordinates[3] - panelGameCoordinates[1]) / 2),
                ])
                > (panelGameCoordinates[2] - panelGameCoordinates[0]) / 2
                //// Top left of TL
                //this.position[0] < panelGameCoordinates[0] ||
                //this.position[1] < panelGameCoordinates[1] ||
                //// Bottom right of BR
                //this.position[0] > panelGameCoordinates[2] ||
                //this.position[1] > panelGameCoordinates[3]
            )
        {
            // Outside of visible scene
            this.element.style.visibility = "hidden";
            return;
        }

        // The panel area in game coordinate size
        var panelSize = [
            panelGameCoordinates[2] - panelGameCoordinates[0],
            panelGameCoordinates[3] - panelGameCoordinates[1]
        ];

        // Relative to top left of the panel
        var positionFromTopLeft = [
            this.position[0] - panelGameCoordinates[0],
            this.position[1] - panelGameCoordinates[1]
        ];

        var relativePositionPercent = [
            positionFromTopLeft[0] / panelSize[0],
            positionFromTopLeft[1] / panelSize[1]
        ];

        // position: relative;
        //  left: 40px;


        this.element.style.visibility = "";
        this.element.style.left = `${relativePositionPercent[0]*100}%`;
        this.element.style.top = `${relativePositionPercent[1]*100}%`;

        // var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
        var angleDeg = Math.atan2(relativePositionPercent[1] - 0.5, relativePositionPercent[0] - 0.5) * 180 / Math.PI;
        angleDeg -= 90;
        while (angleDeg < 0) // No negative
            angleDeg += 360;
        var timeTillAngle = angleDeg * RadarFullRotationTime/360; // Degrees * timePerDegree

        this.element.style.animationDelay = `${timeTillAngle}ms`;
        //console.log(angleDeg, timeTillAngle);
    }
}



type BlipUpdate = [
    string, // hash id
    number, // X
    number, // Y
    string, // Text
    string // class
]



export class Radar {

    private static blips : Map<string, RadarBlip> = new Map<string, RadarBlip>();
    private static panelGameCoordinates: [number, number, number, number /*Top left, Bottom right*/] = [0,0, 1024, 1024];


    static Init() {
        document.getElementById('topCenterSpecial')?.insertAdjacentHTML(
            'afterbegin',
            `
            <div class="panel" id="radarPanel">
                <div class="scanner" id="radarScanner"></div>
                <ul class="something" id="radarContent">
                </ul>
            </div>

            
            `); // <audio id="radarSound" autoplay src="${blipAudio}" />

        // https://codepen.io/bramus/pen/xxaLXeJ Synchronized Animation Timeline
        document.getElementById('radarScanner')?.getAnimations().forEach((anim) => {
            // Set to 0. Syncs everything, but delay only applied during first few ticks
            anim.startTime = 0;
        });


        Radar.AddBlip("a", [0, 512]);
        Radar.AddBlip("b", [512, 0]);
        Radar.AddBlip("c", [512, 1024]);
        Radar.AddBlip("d", [1024, 512]);
        Radar.AddBlip("e", [512, 512]);
        Radar.AddBlip("f", [128, 128]);
        Radar.AddBlip("g", [128, 412]);
        Radar.AddBlip("h", [844, 666]);

        Radar.SetPanelGameCoordinates([0,0,2048,2048]);
    }

    static AddBlip(name: string, position:[number, number]) : RadarBlip
    {
        var blip = new RadarBlip();
        blip.position = position;
        blip.UpdatePosition(Radar.panelGameCoordinates);

        Radar.blips.set(name, blip);

        return blip;
    }

    static UpdateBlips(blips: Array<BlipUpdate>)
    {
        // Delete all blips that are not in this array

        var updatedBlipKeys = blips.map(x => x[0]);
        var toRemove = [...Radar.blips.keys()].filter(x => !updatedBlipKeys.includes(x));
        toRemove.forEach(x => {Radar.blips.get(x)?.Remove(); Radar.blips.delete(x);});
        
        blips.forEach(blip => {

            var blipEntry = Radar.blips.get(blip[0]);
            if (blipEntry)
            {
                blipEntry.position = [blip[1], blip[2]];
                blipEntry.UpdatePosition(Radar.panelGameCoordinates);
            }
            else
            {
                blipEntry = Radar.AddBlip(blip[0], [blip[1], blip[2]]);
            }

            blipEntry.SetText(blip[3]);
            blipEntry.SetClass(blip[4]);
        });
    }

    static ClearBlips()
    {
        Radar.blips.forEach(x => x.Remove());
        Radar.blips.clear();
    }

    static SetPanelGameCoordinates(panelGameCoordinates: [number, number, number, number /*Top left, Bottom right*/])
    {
        Radar.panelGameCoordinates = panelGameCoordinates;
        Radar.blips.forEach(x => x.UpdatePosition(Radar.panelGameCoordinates));

        Radar.UpdatePanelDistanceLines(Radar.panelGameCoordinates);
    }

    static UpdatePanelDistanceLines(panelGameCoordinates: [number, number, number, number /*Top left, Bottom right*/])
    {
        // Add 10m distance lines, based on actual size on game coordinates


        var panel = document.getElementById('radarPanel') as HTMLDivElement;

        // We calculate the width (We assume game panel coordinates are aspect ratio of 1) in game coordinates,
        // and then we see how many 100m lines we have and how far they are from the edge

        var gameWidth = panelGameCoordinates[2] - panelGameCoordinates[0];
        gameWidth *= 0.5; // The lines go around on all sides

        var linesStyle: Array<string> = [];

        // We are going from the center outwards.
        var panelDistCenterToEdge = panel?.clientWidth / 2;
        var gameDistCenterToEdge = gameWidth;

        var gameToPanel = panelDistCenterToEdge / gameWidth; // Ratio to convert ingame distance in meters, into panel pixels
        var distanceAccum = 100 * gameToPanel;
        var step = 1;

        while (gameWidth > 100)
        {
            // We walk from inside out, but the coordinates of the lines are distance from outside
            if (step % 5 == 0){
                linesStyle.push(`inset 0 0 0 ${panelDistCenterToEdge - distanceAccum - 1}px #222, inset 0 0 0 ${panelDistCenterToEdge - distanceAccum}px rgba(255, 0, 0, 0.2)`);
            } else {
                linesStyle.push(`inset 0 0 0 ${panelDistCenterToEdge - distanceAccum - 1}px #222, inset 0 0 0 ${panelDistCenterToEdge - distanceAccum}px rgba(0, 255, 0, 0.2)`);
            }
        
            gameWidth -= 100;
            distanceAccum += 100 * gameToPanel;
            step++;
        }

        var styleText = linesStyle.reverse().join(",\n");
        //console.log(linesStyle, styleText);
        
        panel.style.boxShadow = styleText;
    }
}
