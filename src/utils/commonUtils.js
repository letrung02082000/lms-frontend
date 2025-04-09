const convertToDateTime = (_date, hasTime, hyphen = ' ', format = 'en-GB') => {
    let date = new Date(_date);
    return `${date?.toLocaleDateString('en-GB')}${hasTime ? `${hyphen}${date?.toLocaleTimeString(format)}` : ''}`
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB').format(value || 0);
}

const formatPhoneNumber = (value) => {
    if (!value) return '';
    if (value?.slice(0, 2) === '84') {
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

const getYoutubeId = (url = '') => {
    const regex = /(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

const getVietnamDate = (date) => new Date(date).toLocaleString('sv-SE', {
    timeZone: 'Asia/Ho_Chi_Minh'
}).replaceAll('/', '-').split(' ')[0]; // YYYY-MM-DD format

const parseQuestionHTML = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const questionId = doc.querySelector('.que')?.id;
    const questionText = doc.querySelector('.qtext')?.innerText.trim();

    const answers = Array.from(doc.querySelectorAll('.answer > div')).map((div, index) => {
        const input = div.querySelector('input[type="radio"]');
        const label = div.querySelector('p')?.innerText || div.innerText;

        return {
            id: input?.id,
            value: input?.value,
            name: input?.name,
            label: label.trim(),
        };
    });

    return {
        id: questionId,
        text: questionText,
        answers,
    };
}

export { convertToDateTime, formatCurrency, copyText, formatPhoneNumber, profileMsg, blobToBase64, getVietnamDate, getYoutubeId, parseQuestionHTML }
