import { fetchNews, useRemoteData } from "./Remote";
import './News.css';

export default function News() {
    const infos = useRemoteData(fetchNews);
    if (infos === null) {
        return <div>Loading news...</div>
    }
    return (
        <div className="content-box" id="news-box">
            Aktualności
            {infos.map(info => <div className="box-row">
                <h3>{info.title}</h3>
                <div className="info-box">
                    {info.text}
                </div>
            </div>)}
        </div>
    );
}