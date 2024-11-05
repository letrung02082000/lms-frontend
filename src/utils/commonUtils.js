const convertToDateTime = (_date, hasTime, hyphen = ' ', format = 'en-GB') => {
    let date = new Date(_date);
    return `${date?.toLocaleDateString('en-GB')}${hasTime ? `${hyphen}${date?.toLocaleTimeString(format)}` : ''}`
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB').format(value || 0);
}

const formatPhoneNumber = (value) => {
    if(!value) return '';
    if(value?.slice(0,2) === '84') {
        return value.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
    }
    
    return value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

const copyText = (value) => {
    return navigator.clipboard.writeText(value);
};

const profileMsg = (name) => {
    return `Xin chào bạn ${name || ''}`;

}

const blobToBase64 = (blob) => {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}


export { convertToDateTime, formatCurrency, copyText, formatPhoneNumber, profileMsg, blobToBase64 }
