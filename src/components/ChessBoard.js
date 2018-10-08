import React from 'react';

import SIDES from '../game/Sides';
import PIECES from '../game/Pieces';

import ChessTile from './ChessTile';
import VictoryModal from './VictoryModal';

import './ChessBoard.css';

export default class ChessBoard extends React.Component {
    constructor(props) {
        super(props);

        let width = 8, height = 8; // standard chess board size
        let board = setupBoard(width, height);

        this.state = {
            board: board,
            width: width,
            height: height,
            turn: SIDES.WHITE,
            selected: null,
            captures: {
                [SIDES.WHTIE]: {},
                [SIDES.BLACK]: {}
            },
            victor: null
        }
    }

    canPieceMoveTo = (location, targetPosition) => {
        if (location !== null) {
            let selectedPiece = this.state.board[location.y][location.x];
            if (selectedPiece !== null && selectedPiece.side === this.state.turn) { // If we have a piece selected && that piece is the right color
                if (selectedPiece.type.canMove(location, targetPosition, selectedPiece.side, this.state.board ) ) { // Check movement rules for that piece
                    let targetPiece = this.state.board[targetPosition.y][targetPosition.x];
                    if (targetPiece === null || targetPiece.side !== selectedPiece.side) { // We can land either in an empty space or in the space of an enemy piece
                        if (selectedPiece.type.canHop) return true; // Knights don't care about unit collisions
                        let directionVector = {x: Math.sign(targetPosition.x - location.x), y: Math.sign(targetPosition.y - location.y)};
                        let x = location.x + directionVector.x, y = location.y + directionVector.y; // Start one tile away from our original position
                        while(x !== targetPosition.x || y !== targetPosition.y) { // Keep going until we're one tile away from our target position
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

    canSelectedPieceMoveTo = (position) => {
        return this.canPieceMoveTo(this.state.selected, position);
    }

    clickTile = (position) => {
        let select = this.state.selected;
        if (this.canSelectedPieceMoveTo(position)) {
            let selectedPiece = this.state.board[select.y][select.x];
            let targetPiece = this.state.board[position.y][position.x];
            if (targetPiece === null || targetPiece.side !== selectedPiece.side) {
                selectedPiece.moveCount = selectedPiece.moveCount ? selectedPiece.moveCount + 1: 1;
                let board = this.state.board;
                let captures = this.state.captures;
                if (targetPiece !== null) {
                    let capturedAmount = captures[selectedPiece.side][targetPiece.type.name];
                    captures[selectedPiece.side][targetPiece.type.name] = capturedAmount ? capturedAmount + 1 : 1; // increase the capture count
                }
                board[position.y][position.x] = selectedPiece;
                board[select.y][select.x] = null;
                let turn = (this.state.turn === SIDES.WHITE) ? SIDES.BLACK : SIDES.WHITE;
                this.setState({board: board, turn: turn, selected: null});
                return; // We don't want to select the tile after we have just moved there
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

    createCapturedPieces = (pieceType, pieceCount, pieceColor) => {
        let pieces = [];
        for(let i = 0; i < pieceCount; i++) {
            pieces.push(<img className = 'capturedPiece' src={pieceType.icons[pieceColor]} alt={pieceType.name}/>);
        }
        return pieces;
    }

    startOver = () => {
        let board = setupBoard(this.state.width, this.state.height);
        this.setState({board: board, captures: {0: {}, 1: {}}, turn: SIDES.WHITE});
    }

    isInCheck = () => {
        let checkState = {
            [SIDES.WHITE]: false,
            [SIDES.BLACK]: false
        }
        let blackKing = null, whiteKing = null;
        for(let y = 0; y < this.state.height; y++) {
            for(let x = 0; x < this.state.width; x++) {
                let piece = this.state.board[y][x];
                if (piece !== null && piece.type === PIECES.KING) {
                    if (piece.side === SIDES.WHITE) {
                        whiteKing = {x: x, y: y};
                    } else {
                        blackKing = {x: x, y: y};
                    }
                }
            }
        }
        for(let y = 0; y < this.state.height; y++) {
            for(let x = 0; x < this.state.width; x++) {
                let piece = this.state.board[y][x];
                if (piece !== null) {
                    if (piece.side === SIDES.WHITE && this.canPieceMoveTo({x:x , y: y}, blackKing)) {
                        checkState[SIDES.BLACK] = true;
                    }
                    if (piece.side === SIDES.BLACK && this.canPieveMoveTo({x: x, y: y}, whiteKing)) {
                        checkState[SIDES.WHITE] = true;
                    }
                }
            }
        }
        return checkState;
    }

    render() {
        return (
            <div className='game'>
                <div className='chessUI'>
                <p className='turnCounter'>Turn: {this.state.turn ? 'Black' : 'White'}</p>
                <p className='captureCounter'>
                    <div className='captureSide'>
                    <div className='captureTitle'>White Captures</div>
                    {
                        Object.keys(this.state.captures[SIDES.WHITE]).map((type) => {
                            return <span>{this.createCapturedPieces(PIECES[type.toUpperCase()], this.state.captures[SIDES.WHITE][type], SIDES.BLACK)}</span>;
                        })
                    }
                    </div>
                    <div className='captureSide'>
                        <div className='captureTitle'>Black Captures</div>
                        {
                            Object.keys(this.state.captures[SIDES.BLACK]).map((type) => {
                                return <span>{this.createCapturedPieces(PIECES[type.toUpperCase()], this.state.captures[SIDES.BLACK][type], SIDES.WHITE)}</span>;
                            })
                        }
                    </div>
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


/**
 * Fills a board with given width and height
 * Will produce weird results for anything other than 8x8
 */
const setupBoard = (width, height) => {
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