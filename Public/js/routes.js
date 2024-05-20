const localApi = "https://localhost:44336/api/"
const remoteApi = "https://uttnwebhost.bsite.net/api/"
//const remoteApi_alter = "Ruta alterna remota en caso de que el primer servidor falle."

const env = remoteApi;

//Users
const post_login_Route = env + "Users"
const post_verifyUser_Route = env + "verifyUserData?token="
//Assistance
const post_all_assistances_Route = env + "Assistances?token="
const post_new_assistances_Route = env + "Assistances/AddAssistance?token="
const post_assistances_Route = env + "Assistances?token="
const post_user_all_assistances_Route = env +"Assistances/AllUserAssistance?token="
const post_user_today_assistances_Route = env +"Assistances/AllTodayUserAssistance?token="
const post_user_validate_assistances_Route = env +"Assistances/requestCheckAssistance?token="
const post_user_check_assistances_Route = env +"Assistances/checkAssistance?token="
//Schedule
const post_search_user_schedule_Route = env + "Schedules/GetUserSchedule?token="
//Locations
const post_all_locations_Route = env + "Locations/GetAllLocations?token="


