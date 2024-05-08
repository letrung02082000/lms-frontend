import shortLinkApi from 'api/shortLinkApi';
import Loading from 'components/Loading';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ShortLinkPage() {
  const short = useParams().shortLink;
  console.log(short);
  useEffect(() => {
    shortLinkApi
      .getShortLink(short)
      .then((res) => {
        if (res?.data?.url) {
          window.location.href = res?.data?.url;
        } else {
          window.location.href = window.location.origin + '/404';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <React.Fragment>
      <Loading />
    </React.Fragment>
  );
}

export default ShortLinkPage;
