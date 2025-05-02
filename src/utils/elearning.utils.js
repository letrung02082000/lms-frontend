// function groupUserGradeByCourseModule(data) {
//     const grouped = {};

//     data.forEach(item => {
//         const userId = item.userid;
//         const courseId = item.courseid;
//         const module = item.itemmodule;

//         if (!grouped[userId]) {
//             grouped[userId] = {
//                 username: item.username,
//                 name: `${item.firstname} ${item.lastname}`,
//                 email: item.email,
//                 courses: {}
//             };
//         }

//         if (!grouped[userId].courses[courseId]) {
//             grouped[userId].courses[courseId] = {
//                 courseid: courseId,
//                 coursename: item.coursename,
//                 modules: {}
//             };
//         }

//         if (module === 'supervideo' || module === 'quiz') {
//             if (!grouped[userId].courses[courseId].modules[module]) {
//                 grouped[userId].courses[courseId].modules[module] = [];
//             }

//             grouped[userId].courses[courseId].modules[module].push({
//                 itemname: item.itemname,
//                 svname: item.svname,
//                 finalgrade: item.finalgrade,
//                 gradepass: item.gradepass,
//                 grademin: item.grademin,
//                 grademax: item.grademax,
//                 duration: item.duration,
//                 quizsumgrades: item.quizsumgrades,
//                 quiztimelimit: item.quiztimelimit,
//                 mapa: item.mapa,
//             });
//         }
//     });

//     return grouped;
// }

function getWatchTimeByDay(timestamps, intervalTime = 5000, targetDate = null) {
    const watchByDay = {};

    timestamps.forEach(ts => {
        const date = new Date(ts).toISOString().split('T')[0];
        if (!watchByDay[date]) {
            watchByDay[date] = 0;
        }
        watchByDay[date]++;
    });

    if (targetDate) {
        const count = watchByDay[targetDate] || 0;
        return (count * intervalTime) / 1000; // in seconds
    }

    // Nếu không truyền ngày thì trả về tất cả
    const result = {};
    for (const day in watchByDay) {
        result[day] = (watchByDay[day] * intervalTime) / 1000;
    }

    return result;
}

// Hàm kiểm tra xem mốc thời gian có thuộc ngày targetDate hay không
function isValidDate(timestamp, targetDate) {
    const date = new Date(timestamp);
    const target = new Date(targetDate);

    // So sánh năm, tháng, ngày
    return date.getFullYear() === target.getFullYear() &&
        date.getMonth() === target.getMonth() &&
        date.getDate() === target.getDate();
}

// Hàm tính tổng thời gian học từ mảng mapa cho một ngày cụ thể
function calculateSupervideoLearningTime(mapa, targetDate, intervalTime) {
    let validTimestampsCount = 0;

    // Đếm số lượng mốc thời gian hợp lệ cho targetDate
    mapa.forEach(timestamp => {
        if (timestamp > 0 && isValidDate(timestamp, targetDate)) {
            validTimestampsCount += 1;
        }
    });

    // Tổng thời gian = số phần tử hợp lệ * intervalTime (tính bằng giây hoặc phút)
    return validTimestampsCount * intervalTime;
}

// Tính thời gian học cho các bài quiz (tương tự như phần trước)
function calculateQuizLearningTime(quiz, targetDate, elearningSetting, quizAttempts) {
    if (quiz.quiztimelimit && quiz.finalgrade >= quiz.gradepass && isValidDate(quiz.lastmodified * 1000, targetDate)) {
        return quiz.quiztimelimit;
    } else if (quiz.quiztimelimit === 0 && isValidDate(quiz.lastmodified * 1000, targetDate)) {
        const timeSpent =
        (quizAttempts?.[quiz?.cminstance]?.questionsAnswered || 0) *
        (elearningSetting?.timePerQuestionInMinute || 0) *
        60;
        return timeSpent;
    }
    return 0;
}

// Hàm tính tổng thời gian học cho một ngày (targetDate) từ supervideo và quiz
function calculateTotalLearningTimeForDate(
    { data, targetDate, intervalTime, elearningSetting, quizAttempts } // intervalTime tính bằng giây hoặc phút
) {
    let totalTime = 0;

    Object.values(data).forEach((module) => {
        if (module.modname === 'supervideo') {
            totalTime += calculateSupervideoLearningTime(module.mapa, targetDate, intervalTime);
        } else if (module.modname === 'quiz') {
            totalTime += calculateQuizLearningTime(module, targetDate, elearningSetting, quizAttempts);
        }
    })

    return totalTime;
}

const groupActivityReport = (sections) => {
    const modulesMap = {};

    sections.forEach(section => {
        section.modules.forEach(module => {
            modulesMap[module.id] = module;
        });
    });

    return modulesMap;
};

const groupUserGradeByCourseModule = (data) => {
    const grouped = {};

    data.forEach(item => {
        const userId = item.userid;
        const courseId = item.courseid;
        let moduleid = item.cmid;

        if (!grouped[userId]) {
            grouped[userId] = {
                username: item.username,
                name: `${item.firstname} ${item.lastname}`,
                email: item.email,
                courses: {}
            };
        }

        if (!grouped[userId].courses[courseId]) {
            grouped[userId].courses[courseId] = {
                courseid: courseId,
                coursename: item.coursename,
                modules: {}
            };
        }

        grouped[userId].courses[courseId].modules[moduleid] = {
            cmid: item.cmid,
            cminstance: item.cminstance,
            itemname: item.itemname,
            svname: item.svname,
            finalgrade: item.finalgrade,
            gradepass: item.gradepass,
            grademin: item.grademin,
            grademax: item.grademax,
            duration: item.duration,
            quizsumgrades: item.quizsumgrades,
            quiztimelimit: item.quiztimelimit,
            mapa: item.mapa,
            modname: item.itemmodule,
            lastmodified: item?.lastmodified,
        };
    });

    return grouped;
}

export { groupUserGradeByCourseModule, getWatchTimeByDay, calculateTotalLearningTimeForDate, calculateSupervideoLearningTime, calculateQuizLearningTime, groupActivityReport };
