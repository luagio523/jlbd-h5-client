import { _decorator } from "cc"
import BaseProxy from "../../mvc/BaseProxy"
import app from "../../App"
import { mvc } from "../../core/mvc/__private"
@mvc.component("RoleProxy")
export default class RoleProxy extends BaseProxy {
	public static NAME = "RoleProxy"

	private role: any = null
	onRegister(): void { 
		this.role = app.vm.register("role",{"sex":"male","name":"", "age":10})

		app.vm.bind("role",(data:any)=>{
			console.log("role",data.name,data.age)
		},true)

		console.log("RoleProxy onRegister")
	}

	public createRole(name: string): any {
		this.role.name = name
		return this.role
	}

	public updateRole(data: any): void {

	}

	public getRole(): any {
		console.log("getRole",this.role.name)
		return this.role	
	}
}
