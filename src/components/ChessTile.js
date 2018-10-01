import React from 'react';

import './ChessTile.css';

export default class ChessTile extends React.Component {

    handleClick = () => {
        this.props.onClick({x: this.props.x, y: this.props.y});
    }

    render() {
        let x = this.props.x, y = this.props.y, piece = this.props.piece, selected = this.props.selected, canMove = this.props.canMove;
        let classes = ['chessTile'];
        if ((x + y) % 2 === 0) classes.push('light'); else classes.push('dark');
        if (selected) classes.push('selected');
        if (canMove) classes.push('canMove');
        let inner = '';
        if (piece != null) { inner = <img className='pieceIcon' src={piece.type.icons[piece.side]} alt={piece.type.name}/> }
        return (
            <div className = {classes.join(' ')} onClick={this.handleClick}>{inner}</div>
        )
    }
}