
interface InnParameters {
    inns: Inn[];
}

interface Inn {
    displayName: string;
    id: string;
    rooms: Room[];
}

interface Room {
    name: string;
    price: number;
    description: string;
    func: string;
    args: string[];
}