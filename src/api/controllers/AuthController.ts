import { superFetch } from "./superfetch/superFetch";
import {
  Register,
  RegisterResponse,
  registerResponseSchema,
} from "@/types/api/register";
import { Login, LoginResponse, loginResponseSchema } from "@/types/api/login";
import { getDefaultStore } from "jotai";
import { userAtom } from "@/lib/atoms/user";

const store = getDefaultStore();
export default class AuthController {
  static async register(data: Register): Promise<RegisterResponse> {
    try {
      const res = await superFetch<Register, RegisterResponse, "register">({
        options: {
          method: "POST",
        },
        route: "register",
        routeParams: [],
        responseSchema: registerResponseSchema,
        payload: data,
      });

      localStorage.setItem("token", res.token);
      store.set(userAtom, res.user);

      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async login(data: Login): Promise<LoginResponse> {
    try {
      const res = await superFetch<Login, LoginResponse, "login">({
        options: {
          method: "POST",
        },
        route: "login",
        routeParams: [],
        responseSchema: loginResponseSchema,
        payload: data,
      });

      localStorage.setItem("token", res.token);
      store.set(userAtom, res.user);

      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
