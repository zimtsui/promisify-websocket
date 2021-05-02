interface Animal {
}
interface Dog extends Animal {
}
interface Cat extends Animal {
}
declare let f1: (x: Animal) => void;
declare let f2: (x: Dog) => void;
declare let f3: (x: Cat) => void;
