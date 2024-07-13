const convertToDateTime = (_date, hasTime, hyphen = ' ', format = 'en-GB') => {
    let date = new Date(_date);
    return `${date?.toLocaleDateString('en-GB')}${hasTime ? `${hyphen}${date?.toLocaleTimeString(format)}` : ''}`
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB').format(value || 0);
}

const formatPhoneNumber = (value) => {
    if(value?.slice(0,2) === '84') {
        return value.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
    }
    
    return value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

const copyText = (value) => {
    return navigator.clipboard.writeText(value);
};

const profileMsg = (name) => {
    return `Xin chào ${name ? name : 'bạn'}!`;

}


export { convertToDateTime, formatCurrency, copyText, formatPhoneNumber, profileMsg }
