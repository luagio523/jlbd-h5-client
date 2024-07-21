import { Cache } from "../../core/cache/Cache";
import RoleProxy from "./RoleProxy";

export default class RoleCache extends Cache{
    public static cacheInterval: number = 1000 * 60 ; // 24 hours

    private proxy:RoleProxy
    constructor(proxy:RoleProxy) {
        super()
        this.proxy = proxy
    }
    protected recover(data: any): void {
        this.proxy.updateRole(data)
    }
    protected getData() {
        return this.proxy.getRole()
    }
    public getKey(): string {
        return this.proxy.name;
    }
}