
const texts = {
    gameChooserHeader: 'Choose game to begin:',
    tournamentChooser: 'Tournament Game',
    settingsModalTitle: 'You can edit your settings:',
    regularChooser: 'Regular Game',
    tournamentChooserInfo: 'Play tournament game - you will play 3 games in a row and the winner will eb the one with the highest score',
    regularChooserInfo: 'Play regular TAKI game',
    CantPullTitle: 'Cn\'t pull card right now.',
    CantPullDesc: 'Cn\'t pull card right now, you probably have card choices before you pull new card',
    CantPullDescTaki: 'Cn\'t pull card during a TAKI move on.',
    CantPullDescNotPlayer: 'Cn\'t pull card not in your turn',
    totalMoves: 'Total moves:',
    colorDialogTitle: 'Please choose color:',
};

export const getText = textKey => {
    return texts[textKey] || textKey;
};
const getPartTime = time => (time < 10 ? '0' : '') + time.toString();

export const toTimeString = seconds => {
    const timeSecs = parseInt(seconds % 60),
          timeMins = parseInt(seconds / 60);

    return getPartTime(timeMins) + ':' + getPartTime(timeSecs);
};