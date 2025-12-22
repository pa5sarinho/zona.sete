export class Map
{
    constructor(mapDocObject, gridSize)
    {
        this.mapDocObject = mapDocObject;
        this.gridSize = gridSize;
    }

    draw(width, height)
    {
        let grid_Xaxis = Math.floor(width/this.gridSize);
        let grid_Yaxis = Math.floor(height/this.gridSize);

        for (let y_index = 0; y_index < grid_Yaxis; y_index++)
        {
            const grid_row = document.createElement('div');
            grid_row.className = 'grid-row';
            
            for (let x_index = 0; x_index < grid_Xaxis; x_index++)
            {
                const grid = document.createElement('div');
                grid.className = 'grid-item';
                grid.style.height = this.gridSize + "px";
                grid.style.width = this.gridSize + "px";
                grid.id = `(${x_index}, ${y_index})`;
                grid_row.appendChild(grid);
            }
            this.mapDocObject.appendChild(grid_row);
        }
    }
}
