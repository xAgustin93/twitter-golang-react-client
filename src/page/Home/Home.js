import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import BasicLayout from "../../layout/BasicLayout";
import ListTweets from "../../components/ListTweets";
import { getTweetsFollowersApi } from "../../api/tweet";

import "./Home.scss";

export default function Home(props) {
  const { setRefreshCheckLogin } = props;
  const [tweets, setTweets] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingTweets, setLoadingTweets] = useState(false);

  useEffect(() => {
    getTweetsFollowersApi(page).then((response) => {
      if (!tweets) {
        setTweets(formatModel(response));
      } else {
        if (!response) {
          setLoadingTweets(0);
        } else {
          const data = formatModel(response);
          setTweets([...tweets, ...data]);
          setLoadingTweets(false);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const moreData = () => {
    setLoadingTweets(true);
    setPage(page + 1);
  };

  return (
    <BasicLayout className="home" setRefreshCheckLogin={setRefreshCheckLogin}>
      <div className="home__title">
        <h2>Inicio</h2>
      </div>
      {tweets && <ListTweets tweets={tweets} />}
      <Button onClick={moreData} className="load-more">
        {!loadingTweets ? (
          loadingTweets !== 0 && "Obtener más Tweets"
        ) : (
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        )}
      </Button>
    </BasicLayout>
  );
}

function formatModel(tweets) {
  const tweetsTemp = [];
  tweets.forEach((tweet) => {
    tweetsTemp.push({
      _id: tweet._id,
      userId: tweet.userRelationId,
      mensaje: tweet.Tweet.mensaje,
      fecha: tweet.Tweet.fecha,
    });
  });
  return tweetsTemp;
}
