export function clone(obj:any){
   return Object.assign({}, obj)
}

export function copy(obj:any){
   return clone(obj)
}