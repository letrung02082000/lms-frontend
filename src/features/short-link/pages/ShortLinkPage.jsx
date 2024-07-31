import shortLinkApi from 'api/shortLinkApi';
import Loading from 'components/Loading';
import { PATH } from 'constants/path';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ShortLinkPage() {
  const short = useParams().shortLink;
  const navigate = useNavigate();
  useEffect(() => {
    shortLinkApi
      .getShortLink(short)
      .then((res) => {
        if (res?.data?.url) {
          window.location.href = res?.data?.url;
        } else {
          navigate(PATH.NOT_FOUND);
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
