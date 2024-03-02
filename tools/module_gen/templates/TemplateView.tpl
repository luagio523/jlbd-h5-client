 
import BaseView from "../../views/BaseView";
import { BaseWindow } from "../../views/BaseWindow";
import { ns } from "../../mvc/init"; 
import <%=module%>Model from "./<%=module%>Model";
/**
 * <%=Template%>View
 */
const {ccclass} = cc._decorator;@ccclass
export default class <%=Template%>View extends BaseView {

    protected get model():<%=module%>Model{
        return ns.models.<%=module2%>
    }

    protected onRegister(){
        this.initViewDef("<%=Template%>","<%=Template%>Win")
    }

    

    /**
     * 初始化ui
     */
    protected initUI(){
        //window类型
        new <%=Template%>Window(this.view).setAdapter(this).show()

        //panel类型时
        //new BasePanel(this.view).setAdapter(this).show()
        
    }

    /**
     * 初始化数据
     */
    protected initData(){
        
    }

    

    public onDestroy() {
        super.onDestroy()
    }
}

/**
class <%=Template%>Window extends BaseWindow {

    protected onShown(): void {
        super.onShown()
    }

}
**/