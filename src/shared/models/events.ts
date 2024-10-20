export class NormalEvent<T extends (...args: any)  => void >{
    private _listeners: Set<T>

    constructor(){
        this._listeners = new Set<T>
    }

    invoke(...args: any){
        this._listeners.forEach((listener) => {
            listener.call(args)
        })
    }
    
    addListener(callback: T){
        this._listeners.add(callback)
    }
    
    removeListener(callback: T){
        this._listeners.delete(callback)
    }
}