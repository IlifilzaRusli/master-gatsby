import { useEffect, useState } from "react";

const GRAPHQL_ENDPOINT =
  "https://94wyodxw.api.sanity.io/v1/graphql/production/default";

const gql = String.raw;

const deets = `
      name
      _id
      image {
        asset {
          url
          metadata {
            lqip
          }
        }
      }
  `;

export default function useLatestData() {
  // hot slices
  const [hotSlices, setHotSlices] = useState();
  // slicemasters
  const [slicemasters, setSlicemasters] = useState();
  // Use a side effect to fetcht he data from the graphql endpoint
  useEffect(function () {
    // when the component loads, fetch the data
    fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: gql`
            query {
              StoreSettings(id: "downtown") {
                name
                slicemasters {
                  ${deets}
                }
                hotSlices {
                  ${deets}
                }
              }
            }
          `,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // TODO: checl for errors
        // set the data to state
        setHotSlices(res.data.StoreSettings.hotSlices);
        setSlicemasters(res.data.StoreSettings.slicemasters);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return {
    hotSlices,
    slicemasters,
  };
}
