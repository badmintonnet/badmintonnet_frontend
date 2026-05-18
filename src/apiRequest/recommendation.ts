import http from "@/lib/http";
import { PersonalizedRecommendationResponseType } from "@/schemaValidations/recommendation.schema";

const recommendationApiRequest = {
  getPersonalizedRecommendations: (top = 4, accessToken = "") =>
    http.get<PersonalizedRecommendationResponseType>(
      `/recommendations?top=${top}`,
      {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        cache: "no-store",
      },
    ),
};

export default recommendationApiRequest;
