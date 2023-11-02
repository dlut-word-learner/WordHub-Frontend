import { defineMock } from "vite-plugin-mock-dev-server";
import { UserVo } from "../src/store/loginStore";
const user: UserVo = {
  id: 1,
  username: "testUser",
  email: "123@456.com",
  score: 0,
  role: 0,
};

export default defineMock([
  {
    url: "/api/session",
    method: "POST",
    status: 200,
    enabled: true,
    type: "json",
    response(req, res){
      const {username} = req.body;
      res.end(JSON.stringify({
        id: 1,
        username: username,
        email: "123@456.com",
        score: 0,
        role: 0
      } as UserVo))
    }
  },
]);
