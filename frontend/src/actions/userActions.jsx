import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_VERIFY_OTP_REQUEST,
  USER_VERIFY_OTP_SUCCESS,
  USER_VERIFY_OTP_FAIL,
  USER_RESEND_OTP_REQUEST,
  USER_RESEND_OTP_SUCCESS,
  USER_RESEND_OTP_FAIL,
  USER_SEND_PASSWORD_REQUEST,
  USER_SEND_PASSWORD_SUCCESS,
  USER_SEND_PASSWORD_FAIL,
  USER_NEW_PASSWORD_REQUEST,
  USER_NEW_PASSWORD_SUCCESS,
  USER_NEW_PASSWORD_FAIL,
  USER_CHANGE_PASSWORD_REQUEST,
  USER_CHANGE_PASSWORD_SUCCESS,
  USER_CHANGE_PASSWORD_FAIL,
} from "../constants/userConstants";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/login/",
      { username: email, password: password },
      config
    );
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
};

export const register = (username, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/register/",
      { username, email, password },
      config
    );

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    return null;
  }
};

export const verifyOTP = (userId, otp) => async (dispatch) => {
  try {
    dispatch({ type: USER_VERIFY_OTP_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/verify-otp/",
      { user_id: userId, otp: otp },
      config
    );

    dispatch({
      type: USER_VERIFY_OTP_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_VERIFY_OTP_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const resendOTP = (userId) => async (dispatch) => {
  try {
    dispatch({ type: USER_RESEND_OTP_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/resend-otp/",
      { user_id: userId },
      config
    );

    dispatch({
      type: USER_RESEND_OTP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("Error occurred during resendOTP:", error);
    dispatch({
      type: USER_RESEND_OTP_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const sendPasswordRequest = (usernameOrEmail) => async (dispatch) => {
  try {
    dispatch({ type: USER_SEND_PASSWORD_REQUEST });

    const response = await axios.post("/api/request-reset-email/", {
      username_or_email: usernameOrEmail, // Change to send username_or_email
      redirect_url: "http://localhost:5173/new-password/",
    });

    dispatch({
      type: USER_SEND_PASSWORD_SUCCESS,
      payload: response.data.success,
    });
  } catch (error) {
    const errorMessage =
      error.response && error.response.data.error
        ? error.response.data.error
        : "Unable to send password reset request";
    dispatch({
      type: USER_SEND_PASSWORD_FAIL,
      payload: errorMessage,
    });

    console.error("Error sending password reset request:", error);
  }
};


export const userNewPasswordSuccess = (data) => ({
  type: USER_NEW_PASSWORD_SUCCESS,
  payload: data,
});

export const userNewPasswordFail = (error) => ({
  type: USER_NEW_PASSWORD_FAIL,
  payload: error,
});

export const userNewPassword =
  (uidb64, token, password, password2) => async (dispatch) => {
    try {
      dispatch({ type: USER_NEW_PASSWORD_REQUEST });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await instance.patch(
        "api/password-reset-complete/",
        { uidb64, token, password, password2 },
        config
      );

      dispatch(userNewPasswordSuccess(data));
    } catch (error) {
      dispatch(userNewPasswordFail(error.message));
      throw error;
    }
  };

  export const changePassword = (oldPassword, newPassword) => async (dispatch) => {
    try {
      dispatch({ type: USER_CHANGE_PASSWORD_REQUEST });
  
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const accessToken = userInfo ? (userInfo.access || userInfo.token) : null;
  
      console.log("Access token:", accessToken); // Print access token to console
  
      if (!accessToken) {
        throw new Error('Access token not found');
      }
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
  
      const { data } = await instance.patch(
        "/api/change-password/",
        { old_password: oldPassword, new_password: newPassword },
        config
      );
  
      dispatch({ type: USER_CHANGE_PASSWORD_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: USER_CHANGE_PASSWORD_FAIL, payload: error.message });
      throw error;
    }
  };