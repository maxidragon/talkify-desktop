import Cookies from "js-cookie";

export default function getUser() {
    const user = Cookies.get('user_info');
    if(user)
        return JSON.parse(user);
    console.log('NO COOKIES!');
    return {};
}