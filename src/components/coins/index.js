import axios from "axios";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Spinner from "react-spinkit";
import { PER_PAGE } from "../constants";
import { wait } from "../../utils/app";

function Coins() {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(200);
    const [offset, setOffset] = useState(-PER_PAGE);

    const isEmptyCoins = !coins || coins.length === 0;

    const fetchCoins = async () => {
        setLoading(true);
        const newOffset = offset + PER_PAGE;

        const response = await axios
            .get("https://api.coincap.io/v2/assets", {
                params: {
                    limit: PER_PAGE,
                    offset: newOffset,
                },
            })
            .catch((err) => console.log("error ", err));

        await wait(2000);

        if (response && response.data) {
            const newCoins = [...coins, ...response.data.data];

            if (newCoins.length >= totalCount) {
                setHasMore(false);
            }

            setCoins(newCoins);

            console.log("Coins ", coins);

            setOffset(newOffset);
        }

        setLoading(false);
    };

    const getCoinImageUrl = (symbol) =>
        `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`;

    useEffect(() => {
        fetchCoins();
    }, []);
    return (
        <div>
            <InfiniteScroll
                pageStart={0}
                loadMore={fetchCoins}
                hasMore={hasMore}
                loader={
                    <Spinner
                        name="line-scale-pulse-out-rapid"
                        className="my-5"
                    />
                }
                threshold={350}
                style={{ width: "100%" }}
            >
                {!isEmptyCoins &&
                    coins.map((coin, idx) => (
                        <div
                            key={idx}
                            className="flex w-full h-20 bg-white px-5 border-b items-center"
                        >
                            <div className="w-20">{coin.rank}</div>
                            <div className="w-60 flex justify-center">
                                <img
                                    src={getCoinImageUrl(coin.symbol)}
                                    alt={coin.name}
                                    width="60px"
                                    height="60px"
                                />
                            </div>
                            <div className="w-40 flex justify-start">
                                {coin.name}
                            </div>
                            <div className="w-80">
                                {Number(coin.priceUsd).toFixed(2)}
                            </div>
                            <div className="w-80">
                                {Number(coin.marketCapUsd).toFixed(2)}
                            </div>
                        </div>
                    ))}
            </InfiniteScroll>
        </div>
    );
}

export default Coins;
