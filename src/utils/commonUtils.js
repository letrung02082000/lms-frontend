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
    // Lấy ID câu hỏi (từ thẻ div id="question-XXX")
    const questionWrapper = doc.querySelector('[id^="question-"]');
    const questionId = questionWrapper?.id?.split('-')[1] || null;

    // Lấy nội dung câu hỏi
    const questionTextElement = doc.querySelector('.qtext');
    const questionText = questionTextElement?.innerHTML?.trim() || '';

    // Lấy danh sách đáp án
    const answerElements = doc.querySelectorAll('.answer .d-flex');
    const allInputElements = doc.querySelectorAll('input[type="radio"]');

    const answers = Array.from(answerElements).map((el, idx) => {
        const input = allInputElements[idx];
        const label = el.innerText.trim();
        const value = input?.value || '';
        const checked = input?.checked || false;
        return { label, value, checked };
    });

    const feedbackElement = doc.querySelector('.generalfeedback');
    const feedback = feedbackElement?.innerHTML?.trim() || '';

    // Trả về đối tượng tương thích React component
    return {
        id: questionId,
        text: questionText,
        answers: answers,
        feedback: feedback,
    };
};

const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return "0 giây";

    const m = Math.floor(seconds / 60);
    const h = Math.floor(m / 60);
    const s = seconds % 60;

    if (h > 0) return `${h} giờ ${m % 60} phút ${s} giây`;
    if (m > 0) return `${m} phút ${s} giây`;
    if (s > 0) return `${s} giây`;
    
    return "0 giây";
};

function countModulesByType(sections) {
    const moduleCount = {};

    if (!Array.isArray(sections) || sections.length === 0) {
        return moduleCount;
    }

    sections?.forEach(section => {
        section.modules?.forEach(module => {
            const type = module.modname;
            moduleCount[type] = (moduleCount[type] || 0) + 1;
        });
    });

    return moduleCount;
}

export { convertToDateTime, formatCurrency, copyText, formatPhoneNumber, profileMsg, blobToBase64, getVietnamDate, getYoutubeId, parseQuestionHTML, formatTime, countModulesByType }
