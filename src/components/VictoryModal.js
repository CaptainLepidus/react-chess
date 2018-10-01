import React from 'react';

import './VictoryModal.css';

export default class VictoryModal extends React.Component {

    startOver = () => {
        this.props.onClick();
    }

    render() {
        let victor = this.props.victor;
        let className = ['victoryModal'];
        if (victor === null) {
            className.push('inactive');
        }
        return (
            <div className = { className.join(' ') }>
                <div className = 'startOver' onClick={this.startOver}>
                    Start Over
                </div>
            </div>
        )
    }
}