export const formatCurrency = (value) => {
    // Format: 1 000,00 MZN
    if (value === undefined || value === null) return '0,00 MZN';

    // Convert to number if string
    const number = typeof value === 'string' ? parseFloat(value) : value;

    // Separate integer and decimal parts
    const parts = number.toFixed(2).split('.');

    // Add space as thousands separator
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    // Join with comma and append MZN
    return `${parts.join(',')}MZN`;
};
