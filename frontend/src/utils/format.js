export const formatCurrency = (value) => {
    // Force number just in case string comes in
    const num = Number(value);
    if (isNaN(num)) return '0,00 MZN';

    return new Intl.NumberFormat('pt-MZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    })
        .format(num)
        .replace(/\s/g, ' ') // Ensure non-breaking spaces become normal spaces
        .replace(/\./g, ' ') // Some browsers might use dots for thousand separators in pt-MZ, force space
        .replace(/,/, '#')   // Temporarily hold comma
        .replace(/\./g, ' ') // Replace potential dots if any slipped through (though pt-MZ usually uses nbsp)
        .replace(/#/g, ',')  // Restore comma
        + ' MZN';
};
