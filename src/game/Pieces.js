import SIDES from './Sides';

import BlackPawn from '../icons/bp.svg';
import WhitePawn from '../icons/wp.svg';
import WhiteKnight from '../icons/wn.svg';
import BlackKnight from '../icons/bn.svg';
import WhiteBishop from '../icons/wb.svg';
import BlackBishop from '../icons/bb.svg';
import WhiteRook from '../icons/wr.svg';
import BlackRook from '../icons/br.svg';
import WhiteQueen from '../icons/wq.svg';
import BlackQueen from '../icons/bq.svg';
import WhiteKing from '../icons/wk.svg';
import BlackKing from '../icons/bk.svg';

/** 
 * PIECES
 * id: a numerical id for saving purposes
 * canMove(VECTOR location, VECTOR destination, SIDE side, ARRAY[][] pieces): returns whether the piece can move from the location to the destination if the piece is on the given side
 */

const PIECES = {
    PAWN: {
        id: 0,
        name: 'Pawn',
        canMove: (location, destination, side, pieces) => {
            let targetPiece = pieces[destination.y][destination.x];
            let moveCount = pieces[location.y][location.x].moveCount || 0;
            let deltaX = Math.abs(destination.x - location.x);
            if (deltaX > 1 ) return false;
            if (side === SIDES.WHITE) {
                if (moveCount === 0 && destination.y === location.y - 2 && deltaX === 0) return true; // Move two squares if haven't moved
                if (destination.y === location.y - 1) {
                    if (deltaX === 0 && targetPiece === null) return true;
                    if (deltaX === 1 && targetPiece !== null) return true;
                }
            } else {
                if (moveCount === 0 && destination.y === location.y + 2 && destination.x === location.x) return true;
                if (destination.y === location.y + 1) {
                    if (deltaX === 0 && targetPiece === null) return true;
                    if (deltaX === 1 && targetPiece !== null) return true;
                }
            }
            return false;
        },
        canHop: false,
        icons: {
            0: WhitePawn,
            1: BlackPawn
        }
    },
    KNIGHT: {
        id: 1,
        name: 'Knight',
        canMove: (location, destination, side, pieces) => {
            let deltaX = Math.abs(destination.x - location.x);
            let deltaY = Math.abs(destination.y - location.y);
            if ((deltaX === 2 && deltaY === 1) || (deltaY === 2 && deltaX === 1)) return true;
            return false;
        },
        canHop: true,
        icons: {
            0: WhiteKnight,
            1: BlackKnight
        }
    },
    BISHOP: {
        id: 2,
        name: 'Bishop',
        canMove: (location, destination, side, pieces) => {
            let deltaX = Math.abs(destination.x - location.x);
            let deltaY = Math.abs(destination.y - location.y);
            if (deltaX === deltaY) return true;
            return false;
        },
        canHop: false,
        icons: {
            0: WhiteBishop,
            1: BlackBishop
        }
    },
    ROOK: {
        id: 3,
        name: 'Rook',
        canMove: (location, destination, side, pieces) => {
            let deltaX = Math.abs(destination.x - location.x);
            let deltaY = Math.abs(destination.y - location.y);
            if (deltaX === 0 || deltaY === 0) return true;
            return false;
        },
        canHop: false,
        icons: {
            0: WhiteRook,
            1: BlackRook
        }
    },
    QUEEN: {
        id: 4,
        name: 'Queen',
        canMove: (location, destination, side, pieces) => {
            let deltaX = Math.abs(destination.x - location.x);
            let deltaY = Math.abs(destination.y - location.y);
            if (deltaX === 0 || deltaY === 0 || deltaX === deltaY) return true;
            return false;
        },
        canHop: false,
        icons: {
            0: WhiteQueen,
            1: BlackQueen
        }
    },
    KING: {
        id: 5,
        name: 'King',
        canMove: (location, destination, side, pieces) => {
            let deltaX = Math.abs(destination.x - location.x);
            let deltaY = Math.abs(destination.y - location.y);
            if (deltaX <= 1 && deltaY <= 1) return true;
            return false;
        },
        canHop: false,
        icons: {
            0: WhiteKing,
            1: BlackKing
        }
    }
}

export default PIECES;