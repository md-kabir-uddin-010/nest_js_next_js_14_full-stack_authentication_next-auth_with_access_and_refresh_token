import { jwtDecode } from "jwt-decode";

function isExpired(token: string): boolean {
  const expirationDate: any = token && jwtDecode(token).exp;
  const currentDate = new Date().getTime() / 1000;
  return currentDate >= expirationDate;
}

export default isExpired;
