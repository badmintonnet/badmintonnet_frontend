import http from "@/lib/http";
import {
  RankingResponseType,
  RankingScopeType,
} from "@/schemaValidations/ranking.schema";

type RankingQuery = {
  scope?: RankingScopeType;
  area?: string;
  province?: string;
  ward?: string;
  club?: string;
  page?: number;
  size?: number;
};

const buildRankingQuery = (query: RankingQuery = {}) => {
  const params = new URLSearchParams();

  if (query.scope) params.set("scope", query.scope);
  if (query.area) params.set("area", query.area);
  if (query.province) params.set("province", query.province);
  if (query.ward) params.set("ward", query.ward);
  if (query.club) params.set("club", query.club);
  if (query.page !== undefined) params.set("page", query.page.toString());
  if (query.size !== undefined) params.set("size", query.size.toString());

  const search = params.toString();
  return search ? `?${search}` : "";
};

const rankingApiRequest = {
  getRankings: (query: RankingQuery = {}, token = "") =>
    http.get<RankingResponseType>(`/rankings${buildRankingQuery(query)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    }),
};

export default rankingApiRequest;
