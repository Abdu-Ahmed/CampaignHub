import { gql } from '@apollo/client';

export const GET_CAMPAIGNS = gql`
  query GetCampaigns {
    campaigns {
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
      ab_config {
        variationA
        variationB
        splitA
        winnerMetric
      }
    }
  }
`;