import { fetchNews, useRemoteData } from "./Remote";

export default function News() {
    const infos = useRemoteData(fetchNews);
    if (infos === null) {
        return <div>Loading news...</div>
    }
    return (
        <div className="content-box">
            {infos.map(info => <div className="content-row">
                <h2>{info.title}</h2>
                {info.text}
            </div>)}
        </div>
    );
}