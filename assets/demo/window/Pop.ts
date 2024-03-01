/*
 * @Author: dgflash
 * @Date: 2022-11-11 17:35:03
 * @LastEditors: dgflash
 * @LastEditTime: 2022-11-11 17:46:47
 */
import { Component, _decorator } from 'cc';
import { oops } from '../../script/core/Oops';

const { ccclass, property } = _decorator;

@ccclass('Pop')
export class Pop extends Component {
    onAdded(args: any) {
        console.log(args);
    }


    start() {

    }

    update(deltaTime: number) {

    }

    onClose() {
        oops.gui.removeByNode(this.node);
    }
}


