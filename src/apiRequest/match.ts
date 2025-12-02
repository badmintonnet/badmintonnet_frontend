import http from "@/lib/http";
import {
  BracketTreeResponseType,
  GenerateBracketResponseType,
} from "@/schemaValidations/match";

const matchApiRequest = {
  generateBracket: (categoryId: string) =>
    http.post<GenerateBracketResponseType>(
      `/bracket/${categoryId}/generate-bracket`
    ),

  getBracketTree: (categoryId: string) =>
    http.get<BracketTreeResponseType>(`/bracket/${categoryId}/bracket-tree`),
};

export default matchApiRequest;
