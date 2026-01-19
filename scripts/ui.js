export class DropDownMenu
{
	constructor(posx, posy, choiceList)
	{
		this.posx = posx;
		this.posy = posy;
		this.choiceList = choiceList;

		const ui = document.getElementById('ui');
	}

	draw(width = 300)
	{
		const ddMenu = document.createElement('div');
		let x = 0;
		let y = 0;

		if (this.posy > window.screen.availHeight - this.choiceList.length * 30) y = window.screen.availHeight - this.choiceList.length * 30;
		else {y = this.posy - 40}
		
		if (this.posx > window.screen.availWidth - width) x = window.screen.availWidth - width;
		else {x = this.posx - 10}

		ddMenu.style.width = width;
		//ddMenu.style.height = this.choiceList.length * 30;
		ddMenu.style.left = x + "px";
		ddMenu.style.top = y + "px";
		ddMenu.className = "drop-down-menu";
		ddMenu.id = "open-drop-down-menu";

		this.choiceList.forEach((element) => {
			let c = document.createElement('div');
			c.className = "drop-down-menu-item";
			c.id = element;
			c.innerHTML = element;
			ddMenu.appendChild(c);
		})

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
