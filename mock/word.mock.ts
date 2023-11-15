import { defineMock } from "vite-plugin-mock-dev-server";
import { WordReviewPeekVo } from "../src/components/Dicts/common";

export default defineMock([
  {
    url: "/api/dicts/:dictId/words/:wordId/review",
    method: "GET",
    status: 200,
    enabled: true,
    type: "json",
    body: (_request) => {
      const hard = Math.floor(Math.random() * 10 + 1);
      const good = Math.floor(hard + Math.random() * 7);
      const easy = Math.floor(good + Math.random() * 14);
      return {
        hard,
        good,
        easy,
      } as WordReviewPeekVo;
    },
  },
]);
