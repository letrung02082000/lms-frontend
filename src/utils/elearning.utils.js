function groupByUserCourseModule(data) {
    const grouped = {};

    data.forEach(item => {
        const userId = item.userid;
        const courseId = item.courseid;
        const module = item.itemmodule;

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

        if (!grouped[userId].courses[courseId].modules[module]) {
            grouped[userId].courses[courseId].modules[module] = [];
        }

        grouped[userId].courses[courseId].modules[module].push({
            itemname: item.itemname,
            svname: item.svname,
            finalgrade: item.finalgrade,
            gradepass: item.gradepass,
            grademin: item.grademin,
            grademax: item.grademax,
            duration: item.duration,
            quizsumgrades: item.quizsumgrades,
            quiztimelimit: item.quiztimelimit,
        });
    });

    return grouped;
}

export { groupByUserCourseModule };
