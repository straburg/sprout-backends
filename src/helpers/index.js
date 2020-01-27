module.exports = {
    successResponse: (message = null, data = null) => {
        return {
            status: "success",
            data,
            message
        }
    },
    errorResponse: (message = null) => {
        return {
            status: "error",
            message
        }
    },
    today: (day, add = true) => {
        let todayDate = new Date();
        add ? todayDate.setDate(todayDate.getDate() + day) :
            todayDate.setDate(todayDate.getDate() - day);
        return todayDate.toISOString();
    }
}