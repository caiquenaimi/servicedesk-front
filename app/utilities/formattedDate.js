const format = (date) => {
    if(date) {
        const separatting = date.split('T');
        const formatted = separatting[0].split('-').reverse().join('/');
        return formatted;
    } else {
        return '--';
    }
}

export default format;