import { Vec2 } from 'cc';
import { Area, AreaType } from '../area/Area';
import { ECSEntity } from '../ecs/ECSEntity';

export class AreaManager {
    areas: Area[];
    currentArea: Area | null;

    constructor() {
        this.areas = [];
        this.currentArea = null;
    }

    addArea(area: Area) {
        this.areas.push(area);
    }

    getAreaAtPoint(point: Vec2): Area | null {
        for (const area of this.areas) {
            if (area.isPointInside(point)) {
                return area;
            }
        }
        return null;
    }

    handleAreaTransition(player: ECSEntity, newArea: Area | null) {
        if (this.currentArea === newArea) return;

        if (this.currentArea) {
            this.currentArea.onExit(player);
        }

        if (newArea) {
            newArea.onEnter(player);
        }

        this.currentArea = newArea;

        // Handle area type specific logic
        if (newArea) {
            switch (newArea.type) {
                case AreaType.SAFE:
                    console.log('Entered Safe Zone');
                    // Implement safe zone logic
                    break;
                case AreaType.COMBAT:
                    console.log('Entered Combat Zone');
                    // Implement combat zone logic
                    break;
                case AreaType.NEUTRAL:
                    console.log('Entered Neutral Zone');
                    // Implement neutral zone logic
                    break;
            }
        }
    }
}
