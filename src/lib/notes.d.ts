class Keyboard {
	meta: KeyboardMetadata;
	keys: Key[];
}
class KeyboardMetadata {
	author: string;
	name: string;
}
export class Key {
	color: string;
	labels: string[];
	textColor: Array<string | undefined>;
	textSize: Array<number | undefined>;        //igngoree
	default: { textColor: string; textSize: number };

	x: number;
	y: number;
	width: number;
	height: number;

	x2: number;
	y2: number;
	width2: number;             //w2
	height2: number;            //h2

    rotation_x: number;         //rotation origin x
	rotation_y: number;         ///rotation origin y
	rotation_angle: number;     // r

	decal: boolean;
	ghost: boolean;
	stepped: boolean;
	nub: boolean;               // homing   

	profile: string;            // uniform or sculpted OR chiclet
}
