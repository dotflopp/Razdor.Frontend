export interface ICollection<T> extends Iterable<T>{
    get length() : number;
}

export class ArrayCollection<T> implements ICollection<T>{
    private source: Array<T>
    
    constructor(array: Array<T>){
        this.source = array
    }
    
    get length(): number {
        return this.source.length
    }
    
    [Symbol.iterator](): Iterator<T, any, undefined> {
        return this.source[Symbol.iterator]()
    }
}   