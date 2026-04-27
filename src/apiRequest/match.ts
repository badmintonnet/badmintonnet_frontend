import http from "@/lib/http";
import {
  BracketTreeResponseType,
  GenerateBracketResponseType,
  UpdateMatchResultBodyType,
} from "@/schemaValidations/match";

const matchApiRequest = {
  generateBracket: (categoryId: string) =>
    http.post<GenerateBracketResponseType>(
      `/bracket/${categoryId}/generate-bracket`,
    ),

  getBracketTree: (categoryId: string) =>
    http.get<BracketTreeResponseType>(`/bracket/${categoryId}/bracket-tree`),

  updateMatchResult: (matchId: string, body: UpdateMatchResultBodyType) =>
    http.post(`/bracket/match/${matchId}/update-result`, body),
};

export default matchApiRequest;
