import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
    }
  }
`;

export const GET_CAMPAIGNS = gql`
  query GetCampaigns {
    campaigns {
      id
      title
      start_date
      schedule_time
      status

      # pull in any existing A/B config for the list view
      ab_config {
        variationA
        variationB
        splitA
        winnerMetric
      }
    }
  }
`;

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign(
    $title: String!
    $start_date: String!
    $schedule_time: String
    $status: String!
    $ab_config: ABConfigInput
  ) {
    createCampaign(
      title: $title
      start_date: $start_date
      schedule_time: $schedule_time
      status: $status
      ab_config: $ab_config
    ) {
      id
      title
      start_date
      schedule_time
      status
      ab_config {
        variationA
        variationB
        splitA
        winnerMetric
      }
    }
  }
`;

export const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign(
    $id: ID!
    $title: String
    $start_date: String
    $schedule_time: String
    $status: String!
    $abConfig: ABConfigInput
  ) {
    updateCampaign(
      id: $id
      title: $title
      start_date: $start_date
      schedule_time: $schedule_time
      status: $status
      ab_config: $abConfig
    ) {
      id
      title
      start_date
      schedule_time
      status

      # return updated A/B config
      ab_config {
        variationA
        variationB
        splitA
        winnerMetric
      }
    }
  }
`;

export const DELETE_CAMPAIGN = gql`
  mutation DeleteCampaign($id: ID!) {
    deleteCampaign(id: $id)
  }
`;

export const GET_CAMPAIGN = gql`
  query GetCampaign($id: ID!) {
    campaign(id: $id) {
      id
      title
      description
      start_date
      end_date
      schedule_time
      status
      created_at
      updated_at

      # bring back the A/B settings for detail view
      ab_config {
        variationA
        variationB
        splitA
        winnerMetric
      }
    }
  }
`;

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

export const DUPLICATE_CAMPAIGN = gql`
  mutation DuplicateCampaign($id: ID!) {
    duplicateCampaign(id: $id) {
      id
      title
      start_date
      status
      ab_config {
        variationA
        variationB
        splitA
        winnerMetric
      }
    }
  }
`
export const DISPATCH_SCHEDULED = gql`
  mutation DispatchScheduledCampaigns {
    dispatchScheduledCampaigns
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
