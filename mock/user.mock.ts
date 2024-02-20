// SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { defineMock } from "vite-plugin-mock-dev-server";
import { UserVo } from "../src/store/userStore";

export default defineMock([
  {
    url: "/api/session",
    method: "POST",
    status: 200,
    enabled: true,
    type: "json",
    body({ body }) {
      const { username } = body;
      return {
        id: 1,
        username: username,
        email: "123@456.com",
        score: 0,
        role: 0,
      } as UserVo;
    },
  },
]);
