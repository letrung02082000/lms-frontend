import { store } from "../../store";
import { updateUser, logoutUser } from "../../store/userSlice";

import AccountApi from "api/accountApi";

function checkLogin() {
  const userInfo = localStorage.getItem("user-info");
  const token = localStorage.getItem("user-jwt-tk");
  const refreshToken = localStorage.getItem("user-jwt-rftk");

  if (!token || !refreshToken) {
    store.dispatch(logoutUser());
  }

  if (token && refreshToken) {
    AccountApi.getProlfile(token)
      .then((res) => {
        const data = JSON.parse(userInfo);
        store.dispatch(updateUser({ isLoggedIn: true, data }));
      })
      .catch((error) => {
        AccountApi.refreshToken(refreshToken)
          .then((refreshRes) => {
            localStorage.setItem("user-jwt-tk", refreshRes.accessToken);
            const data = JSON.parse(userInfo);
            store.dispatch(updateUser({ isLoggedIn: true, data }));
          })
          .catch((error) => {
            store.dispatch(
              updateUser({
                isLoggedIn: false,
                data: { name: "", tel: "", zalo: "" },
              })
            );
            localStorage.removeItem("user-info");
            localStorage.removeItem("user-jwt-tk");
            localStorage.removeItem("user-jwt-rftk");
          });
      });
  } else {
    return false;
  }
}

export default checkLogin;
