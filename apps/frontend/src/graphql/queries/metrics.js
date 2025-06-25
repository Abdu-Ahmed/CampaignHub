import { gql } from '@apollo/client';

export const GET_CAMPAIGN_METRICS = gql`
  query GetCampaignMetrics($id: ID!) {
    campaignMetrics(id: $id) {
      impressions
      clicks
      conversions
      ctr
      conversionRate
    }
  }
`;

export const GET_CAMPAIGN_DAILY_METRICS = gql`
  query GetCampaignDailyMetrics(
    $campaignId: ID!
    $from: String!
    $to: String!
  ) {
    dailyMetrics(campaignId: $campaignId, from: $from, to: $to) {
      date
      impressions
      clicks
      conversions
      ctr
      conversionRate
    }
  }
`;