import { actions_pt } from "./objects/actions.js";
import { iCommandYouTo } from "./objects/actions.js";

export class DropDownMenu
{
	constructor(posx, posy, choiceList)
	{
		this.posx = posx;
		this.posy = posy;
		this.choiceList = choiceList;
	}

	draw(width = 300)
	{
		const ddMenu = document.createElement('div');
		ddMenu.className = 'drop-down-menu';
		ddMenu.id = 'open-drop-down-menu';
		ddMenu.style.width = `${width}px`;

		let x = this.posx;
		let y = this.posy;

		if (x > 1920 - width)
			x = 1920 - width;

		if (y > 1080 - this.choiceList.length * 30)
			y = 1080 - this.choiceList.length * 30;

		ddMenu.style.left = `${x}px`;
		ddMenu.style.top  = `${y}px`;

		this.choiceList.forEach((el, idx) => {
			const item = document.createElement('div');
			item.className = 'drop-down-menu-item';
			item.id = `dd-choice-${idx}`;
			item.innerHTML = actions_pt[el];
			item.onclick = () => {
				ddMenu.remove();
				iCommandYouTo(el);
			};
			ddMenu.appendChild(item);
		});

			ui.appendChild(ddMenu);
		}

	destroy()
	{
		document.getElementById('open-drop-down-menu').remove();
	}
}

export class PopUpWindow
{
	constructor(name, width, height)
	{
		this.name = name;
		this.width = width;
		this.height = height;
		this.html = "";
	}

	draw()
	{
		// deleta qualquer outra janela aberta antes
		if (document.contains(document.getElementById('window-popup')))
			document.getElementById('window-popup').remove();
		
		const windowPopUp = document.createElement('div');
		const windowHeader = document.createElement('div');
		const windowClose = document.createElement('div');
		const windowContent = document.createElement('div');
		
		windowPopUp.className = 'ui-layer';
		windowPopUp.id = 'window-popup';
		windowPopUp.style.width = this.width*30;
		windowPopUp.style.height= this.height*30;
		windowPopUp.style.right = ((60-this.width)/2)*30 + 30;
		windowPopUp.style.bottom = ((32-this.height)/2)*30 - 930;
		
		windowHeader.className = 'ui-header texto';
		windowHeader.innerHTML = this.name;
		windowHeader.style.width = 'auto';
	
		windowClose.className = 'expand-minimize-button close-button';
		windowClose.style.top = '0px';
		windowClose.style.right = '0px';
		windowClose.innerHTML = '🞫';
		windowClose.onclick = function() {windowPopUp.remove()}

		windowContent.className = 'texto';
		windowContent.style.padding = '10px 10px 0 10px';
		windowContent.innerHTML = this.html;

		document.getElementById('ui').appendChild(windowPopUp);
		windowPopUp.appendChild(windowHeader);
		windowPopUp.appendChild(windowClose);
		windowPopUp.appendChild(windowContent);
	}
}

export function screenToCanvas(event) {
    const wrapper = document.querySelector('.wrapper');
    const rect = wrapper.getBoundingClientRect();

    const scaleX = 1920 / rect.width;
    const scaleY = 1080 / rect.height;

    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top)  * scaleY
    };
}