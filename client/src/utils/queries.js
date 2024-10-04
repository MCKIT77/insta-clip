import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  {
    user {
      name
      videos {
        _id
        uploadDate
        path
      }
    }
  }
`;

export const QUERY_VIDEO = gql`
  query getVideo($id: ID!) {
    video(_id: $id) {
      _id
      path
      uploadDate
    }
  }
`;
