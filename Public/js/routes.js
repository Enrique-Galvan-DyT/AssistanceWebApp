const localApi = "https://localhost:44336/api/"
const remoteApi = "https://localhost:44336/api/"

const env = localApi;

//Users
const post_login_Route = env + "Users"
const post_verifyUser_Route = env + "verifyUserData?token="
//Assistance
const post_all_assistances_Route = env + "Assistances?token="
const post_new_assistances_Route = env + "Assistances/AddAssistance?token="
const post_assistances_Route = env + "Assistances?token="
const post_user_all_assistances_Route = env +"Assistances/AllUserAssistance?token="
const post_user_today_assistances_Route = env +"Assistances/AllTodayUserAssistance?token="
//Schedule
const post_search_user_schedule = env + "Schedules/GetUserSchedule?token="

