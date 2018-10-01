import React from 'react';

import SIDES from '../game/Sides';
import PIECES from '../game/Pieces';

import ChessTile from './ChessTile';
import VictoryModal from './VictoryModal';

import './ChessBoard.css';

export default class ChessBoard extends React.Component {
    constructor(props) {
        super(props);

        let width = 8;
        let height = 8;
        let board = this.setupBoard(width, height);

        this.state = {
            board: board,
            width: width,
            height: height,
            turn: SIDES.WHITE,
            selected: null,
            captures: {
                0: {},
                1: {}
            },
            victor: null
        }
    }

    setupBoard = (width, height) => {
        let board = [];

        for (let y = 0; y < height; y++) {
            board[y] = [];
            for (let x = 0; x < width; x++) {
                board[y][x] = null;
            }
        }

        /* Setup pieces */

        /* Pawns*/
        for(let x = 0; x < width; x++) {
            board[1][x] = {
                type: PIECES.PAWN,
                side: SIDES.BLACK
            }
            board[6][x] = {
                type: PIECES.PAWN,
                side: SIDES.WHITE
            }
        }

        /* Rooks */
        board[0][0] = {
            type: PIECES.ROOK,
            side: SIDES.BLACK
        }
        board[0][7] = {
            type: PIECES.ROOK,
            side: SIDES.BLACK
        }
        board[7][0] = {
            type: PIECES.ROOK,
            side: SIDES.WHITE
        }
        board[7][7] = {
            type: PIECES.ROOK,
            side: SIDES.WHITE
        }

        /* Knights */
        board[0][1] = {
            type: PIECES.KNIGHT,
            side: SIDES.BLACK
        }
        board[0][6] = {
            type: PIECES.KNIGHT,
            side: SIDES.BLACK
        }
        board[7][1] = {
            type: PIECES.KNIGHT,
            side: SIDES.WHITE
        }
        board[7][6] = {
            type: PIECES.KNIGHT,
            side: SIDES.WHITE
        }

        /* Bishops */
        board[0][2] = {
            type: PIECES.BISHOP,
            side: SIDES.BLACK
        }
        board[0][5] = {
            type: PIECES.BISHOP,
            side: SIDES.BLACK
        }
        board[7][2] = {
            type: PIECES.BISHOP,
            side: SIDES.WHITE
        }
        board[7][5] = {
            type: PIECES.BISHOP,
            side: SIDES.WHITE
        }

        /* Queens */
        board[0][3] = {
            type: PIECES.QUEEN,
            side: SIDES.BLACK
        }
        board[7][3] = {
            type: PIECES.QUEEN,
            side: SIDES.WHITE
        }

        /* Kings */
        board[0][4] = {
            type: PIECES.KING,
            side: SIDES.BLACK
        }
        board[7][4] = {
            type: PIECES.KING,
            side: SIDES.WHITE
        }

        return board;
    }

    canSelectedPieceMoveTo = (position) => {
        let select = this.state.selected;
        if (select !== null) {
            let selectedPiece = this.state.board[select.y][select.x];
            if (selectedPiece !== null && selectedPiece.side === this.state.turn) {
                if (selectedPiece.type.canMove(select, position, selectedPiece.side, this.state.board, selectedPiece.hasMoved !== undefined)) {
                    let targetPiece = this.state.board[position.y][position.x];
                    if (targetPiece === null || targetPiece.side !== selectedPiece.side) {
                        if (selectedPiece.type.canHop) return true; // Knights don't care about unit collisions
                        let directionVector = {x: Math.sign(position.x - select.x), y: Math.sign(position.y - select.y)};
                        let x = select.x + directionVector.x, y = select.y + directionVector.y; // Start one tile away from our original position
                        while(x !== position.x || y !== position.y) { // Keep going until we're one tile away from our target position
                            if (this.state.board[y][x] !== null) { // If there's something in the way
                                return false;
                            }
                            x += directionVector.x;
                            y += directionVector.y;
                        }
                        return true;
                    }
                }
            }
        }
        return false;
    }

    clickTile = (position) => {
        let select = this.state.selected;
        if (this.canSelectedPieceMoveTo(position)) {
            let selectedPiece = this.state.board[select.y][select.x];
            let targetPiece = this.state.board[position.y][position.x];
            if (targetPiece === null || targetPiece.side !== selectedPiece.side) {
                selectedPiece.hasMoved = true;
                let board = this.state.board;
                let captures = this.state.captures;
                if (targetPiece !== null) {
                    let capturedAmount = captures[selectedPiece.side][targetPiece.type.name];
                    captures[selectedPiece.side][targetPiece.type.name] = capturedAmount ? capturedAmount + 1 : 1;
                }
                board[position.y][position.x] = selectedPiece;
                board[select.y][select.x] = null;
                let turn = (this.state.turn === SIDES.WHITE) ? SIDES.BLACK : SIDES.WHITE;
                this.setState({board: board, turn: turn, selected: null});
                return;
            }
        }
        this.setState({selected: position})
    }

    createBoard = () => {
        let renderBoard = [];
        for (let y = 0; y < this.state.height; y++) {
            let children = [];
            for (let x = 0; x < this.state.width; x++) {
                let canMove = false;
                let piece = this.state.board[y][x];
                if (this.canSelectedPieceMoveTo({x: x, y: y})) {
                    canMove = true;
                }
                children.push(
                <ChessTile
                    x = { x }
                    y = { y }
                    piece = { piece }
                    onClick = { this.clickTile }
                    selected = { (this.state.selected !== null && x === this.state.selected.x && y === this.state.selected.y) }
                    canMove = { canMove }
                />);
            }
            renderBoard.push(<div className='chessRow'>{children}</div>);
        }
        return renderBoard;
    }

    startOver = () => {
        let board = this.setupBoard(this.state.width, this.state.height);
        this.setState({board: board, captures: {0: {}, 1: {}}, turn: SIDES.WHITE});
    }

    render() {
        return (
            <div className='game'>
                <div className='chessUI'>
                <p className='turnCounter'>Turn: {this.state.turn ? 'Black' : 'White'}</p>
                <p className='captureCounter'>
                    <div className='captureTitle'>White Captures:</div>
                    {
                        Object.keys(this.state.captures[SIDES.WHITE]).map((type) => {
                            return <span>{type} x{this.state.captures[SIDES.WHITE][type]} </span>;
                        })
                    }
                    <div className='captureTitle'>Black Captures:</div>
                    {
                        Object.keys(this.state.captures[SIDES.BLACK]).map((type) => {
                            return <span>{type} x{this.state.captures[SIDES.BLACK][type]} </span>;
                        })
                    }
                </p>
                </div>
                <div className='chessBoard'>
                    <VictoryModal victor = {null} onClick = {this.startOver} />
                    {this.createBoard()}
                </div>
            </div>
        )
    }
}