const TURNS = {
    LEFT: Symbol('LEFT'),
    STRAIGHT: Symbol('STRAIGHT'),
    RIGHT: Symbol('RIGHT')
};

const DIRECTIONS = {
    WEST: Symbol('WEST'),
    EAST: Symbol('EAST'),
    NORTH: Symbol('NORTH'),
    SOUTH: Symbol('SOUTH')
};

const MAP = {
    HORIZONTAL: '-',
    VERTICAL: '|',
    INTERSECTION: '+',
    CORNER_NW_SE: '/',
    CORNER_NE_SW: '\\',
    CART_NORTH: '^',
    CART_EAST: '>',
    CART_SOUTH: 'v',
    CART_WEST: '<'
};

const CART_DIRECTIONS = {
    [MAP.CART_NORTH]: DIRECTIONS.NORTH,
    [MAP.CART_EAST]: DIRECTIONS.EAST,
    [MAP.CART_SOUTH]: DIRECTIONS.SOUTH,
    [MAP.CART_WEST]: DIRECTIONS.WEST
};

const DIRECTIONS_TO_LEFT = {
    [DIRECTIONS.NORTH]: DIRECTIONS.WEST,
    [DIRECTIONS.EAST]: DIRECTIONS.NORTH,
    [DIRECTIONS.SOUTH]: DIRECTIONS.EAST,
    [DIRECTIONS.WEST]: DIRECTIONS.SOUTH,
};

const DIRECTIONS_TO_RIGHT = {
    [DIRECTIONS.NORTH]: DIRECTIONS.EAST,
    [DIRECTIONS.EAST]: DIRECTIONS.SOUTH,
    [DIRECTIONS.SOUTH]: DIRECTIONS.WEST,
    [DIRECTIONS.WEST]: DIRECTIONS.NORTH,
};

class Square {
    constructor({x, y, type}) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    setCart(cart) {
        if (this.cart) {
            this.crash = true;
            this.cart.crashed = true;
            cart.crashed = true;
        }
        if (cart.square) {
            cart.square.cart = null;
        }
        this.cart = cart;
        this.cart.square = this;
    }
}

class Cart {
    constructor() {
        this.nextTurnIndex = -1;        
    }

    getNextTurn() {
        const turns = [TURNS.LEFT, TURNS.STRAIGHT, TURNS.RIGHT];
        this.nextTurnIndex = ++this.nextTurnIndex % turns.length;
        return turns[this.nextTurnIndex];
    }

    moveHorizontal() {
        if (this.direction === DIRECTIONS.EAST) {
            this.square.right.setCart(this);
        }
        else if (this.direction === DIRECTIONS.WEST) {
            this.square.left.setCart(this);
        }
    }

    moveVertical() {
        if (this.direction === DIRECTIONS.SOUTH) {
            this.square.bottom.setCart(this);
        }
        else if (this.direction === DIRECTIONS.NORTH) {
            this.square.top.setCart(this);
        }
    }

    move() {
        if (this.square.type === MAP.HORIZONTAL) {
            this.moveHorizontal();
        }
        else if (this.square.type === MAP.VERTICAL) {
            this.moveVertical();
        }
        else if (this.square.type === MAP.INTERSECTION) {
            const turn = this.getNextTurn();
            if (turn === TURNS.LEFT) {
                this.direction = DIRECTIONS_TO_LEFT[this.direction];
            }
            else if (turn === TURNS.RIGHT) {
                this.direction = DIRECTIONS_TO_RIGHT[this.direction];
            }
            this.moveHorizontal();
            this.moveVertical();
        }
        else if (this.square.type === MAP.CORNER_NW_SE) {
            if ([DIRECTIONS.NORTH, DIRECTIONS.SOUTH].includes(this.direction)) {
                this.direction = DIRECTIONS_TO_RIGHT[this.direction];
                this.moveHorizontal();
            }
            else if ([DIRECTIONS.WEST, DIRECTIONS.EAST].includes(this.direction)) {
                this.direction = DIRECTIONS_TO_LEFT[this.direction];
                this.moveVertical();
            }
        }
        else if (this.square.type === MAP.CORNER_NE_SW) {
            if ([DIRECTIONS.NORTH, DIRECTIONS.SOUTH].includes(this.direction)) { 
                this.direction = DIRECTIONS_TO_LEFT[this.direction];
                this.moveHorizontal();
            }
            else if ([DIRECTIONS.WEST, DIRECTIONS.EAST].includes(this.direction)) {
                this.direction = DIRECTIONS_TO_RIGHT[this.direction];
                this.moveVertical();
            }
        }
    }
}

const buildMap = lines => lines.map(line => line.split(''));

const getSquareType = col => {
    let type;
    if ([MAP.CART_NORTH, MAP.CART_SOUTH].includes(col)) {
        type = MAP.VERTICAL;
    }
    else if ([MAP.CART_EAST, MAP.CART_WEST].includes(col)) {
        type = MAP.HORIZONTAL;
    } 
    else {
        type = col;
    }
    return type;
}

const getCartDirection = col => CART_DIRECTIONS[col];

const buildPath = map => {
    const carts = [];
    const squares = new Map();

    const n = map.length;
    for (let i = 0; i < n; i++) {
        const row = map[i];
        const m = row.length;
        for (let j = 0; j < m; j++) {
            const col = map[i][j];
            if (Object.values(MAP).includes(col)) {
                const square = new Square({
                    x: i, 
                    y: j,
                    type: getSquareType(col)
                });
                squares.set(`${i},${j}`, square);

                if ([MAP.CART_NORTH, MAP.CART_EAST, MAP.CART_SOUTH, MAP.CART_WEST].includes(col)) {
                    const cart = new Cart();
                    square.setCart(cart);

                    cart.direction = getCartDirection(col);
                    carts.push(cart);
                }

                const previousHorizontal = squares.get(`${i},${j-1}`);
                const previousVertical = squares.get(`${i-1},${j}`);
                if (square.type === MAP.HORIZONTAL) {
                    previousHorizontal.right = square;
                    square.left = previousHorizontal;
                }
                else if (square.type === MAP.VERTICAL) {
                    previousVertical.bottom = square;
                    square.top = previousVertical;
                }
                else if (square.type === MAP.INTERSECTION) {                    
                    previousHorizontal.right = square;
                    square.left = previousHorizontal;

                    previousVertical.bottom = square;
                    square.top = previousVertical;
                }
                else if (square.type === MAP.CORNER_NW_SE) {
                    if (previousHorizontal && previousHorizontal.type !== MAP.VERTICAL 
                        && previousVertical && previousVertical.type !== MAP.HORIZONTAL) { // SE
                        previousHorizontal.right = square;
                        square.left = previousHorizontal;

                        previousVertical.bottom = square;
                        square.top = previousVertical;
                    }
                }
                else if (square.type === MAP.CORNER_NE_SW) {
                    if (previousHorizontal && previousHorizontal.type !== MAP.VERTICAL) { // NE
                        previousHorizontal.right = square;
                        square.left = previousHorizontal;
                    }
                    else if (previousVertical && previousVertical.type !== MAP.HORIZONTAL) { // SW
                        previousVertical.bottom = square;
                        square.top = previousVertical;
                    }
                }
            }
        }
    }

    return { squares, carts };
};

module.exports = {
    buildMap,
    buildPath
};