import { gql } from '@apollo/client';

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
`;

export const DISPATCH_SCHEDULED = gql`
  mutation DispatchScheduledCampaigns {
    dispatchScheduledCampaigns
  }
`;