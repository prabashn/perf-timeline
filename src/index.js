import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { maxBy, identity, groupBy } from "lodash-es";

const relativeMetrics = [
  "config",
  "script",
  "connect",
  "render",
  "render2",
  "render3"
];

function App() {
  const data = getPerfData();

  // create list of info objects with broken down name tokens, and metric value
  const timelineInfo = Object.keys(data)
    .map(key => {
      const [experience, metric] = key.split("-");
      if (experience && metric) {
        return {
          experience,
          metric,
          value: data[key]
        };
      }
      return null;
    })
    .filter(identity);

  // group info objects by experience name
  const timelineGroups = groupBy(timelineInfo, info => info.experience);

  // create a list of sub-timelines where each sub-timeline is sorted by metric value
  const timelineList = [];
  let maxValue = 0;

  Object.keys(timelineGroups).forEach(groupName => {
    // sort each timeline by metric value
    const timeline = timelineGroups[groupName];
    timeline.sort((a, b) => a.value - b.value);
    timelineList.push(timeline);

    // get the running max value from the last metric on each sorted timeline
    maxValue = Math.max(maxValue, timeline[timeline.length - 1].value);
  });

  // sort the list of timelines by first appearing metric for each timeline.
  // This is the order we will render the timeline view from top to bottom,
  // so that each line represents a single experience's timeline.
  timelineList.sort((a, b) => a[0].value - b[0].value);

  // log debug info
  console.log("max = " + maxValue);
  console.log(JSON.stringify(timelineList, null, 4));

  return (
    <div className="App">
      {timelineList.map((timeline, index) =>
        renderExperienceTimeline(timeline, maxValue, index)
      )}
    </div>
  );
}

function renderExperienceTimeline(experienceTimeline, maxValue, index) {
  return (
    <div>
      <label
        style={{
          display: "inline-block",
          width: "200px",
          textAlign: "right",
          marginRight: "10px"
        }}
      >
        {experienceTimeline[0].experience}
      </label>
      <div
        key={index}
        style={{
          display: "inline-block",
          width: "calc(95% - 200px)",
          border: "1px solid black",
          height: "20px",
          position: "relative"
        }}
      >
        {experienceTimeline.map((info, index) =>
          renderTimelineInfo(info, maxValue, index)
        )}
      </div>
    </div>
  );
}

function renderTimelineInfo(info, maxValue, index) {
  const percent = (Math.round((info.value / maxValue) * 1000) / 1000) * 100;
  return (
    <div
      key={index}
      style={{
        //display: "inline-block",
        position: "absolute",
        height: "100%",
        background: "red",
        left: percent + "%",
        width: "50px",
        overflow: "hidden",
        border: "1px solid white",
        textAlign: "left"
      }}
    >
      {info.metric}
    </div>
  );
}

function getPerfData() {
  return {
    TTPV: 641,
    "entryPoint-connecting": 642.7831,
    "BingImageData-loading": 643.6831,
    "BingImageData-config": 369.20000000000004,
    "BingImageData-script": 4.2999999999999545,
    "EdgeHeader-loading": 1021.8831,
    "PivotContent-loading": 1022.0831,
    "EdgeHeader-config": 0.7999999999999545,
    "PivotContent-config": 0.900000000000091,
    "PivotContent-script": 3.300000000000068,
    "PivotContent-connecting": 1027.2831,
    "PivotContent-connected": 1029.4831,
    "PivotContent-connect": 2.199999999999818,
    "EdgeHeader-script": 9.600000000000136,
    "EdgeHeader-connecting": 1033.4831,
    "SearchBoxEdge-loading": 1034.5831,
    "TopSitesEdge-loading": 1034.7831,
    "PivotsNav-loading": 1034.8831,
    "PoweredbyLegend-loading": 1035.0831,
    "SearchBoxEdge-config": 0.599999999999909,
    "TopSitesEdge-config": 0.599999999999909,
    "PivotsNav-config": 0.7999999999999545,
    "PoweredbyLegend-config": 0.7000000000000455,
    "SearchBoxEdge-script": 4.5,
    "PivotsNav-script": 4.900000000000091,
    "PoweredbyLegend-script": 5.399999999999864,
    "SearchBoxEdge-connecting": 1041.8831,
    "PivotsNav-connecting": 1042.2831,
    "PoweredbyLegend-connecting": 1042.6831,
    "PoweredbyLegend-connected": 1043.6831,
    "PoweredbyLegend-connect": 1,
    "SearchBoxEdge-connected": 1044.4831,
    "SearchBoxEdge-connect": 2.599999999999909,
    "TopSitesEdge-script": 20.09999999999991,
    "TopSitesEdge-connecting": 1056.6831,
    "TopSitesEdge-connected": 1061.0831,
    "TopSitesEdge-connect": 4.400000000000091,
    "PivotsNav-connected": 1078.5831,
    "PivotsNav-connect": 36.299999999999954,
    "River-connecting": 1090.3831,
    "EdgeHeader-connected": 1091.6831,
    "EdgeHeader-connect": 58.200000000000045,
    "entryPoint-connected": 1092.5831,
    "entryPoint-connect": 449.80000000000006,
    "SearchBoxEdge-render": 70.20000000000004,
    "TopSitesEdge-render": 54.90000000000009,
    "PivotsNav-render": 27.600000000000136,
    "PoweredbyLegend-render": 11.5,
    "EdgeHeader-render": 84.19999999999982,
    "PivotContent-render": 7,
    "entryPoint-render": 98.89999999999986,
    "ProactiveCanvas-loading": 1232.7831,
    "River-connected": 1233.3831,
    "River-connect": 143,
    "ProactiveCanvas-config": 0.7999999999999545,
    "River-render": 5.7999999999999545,
    "PivotContent-render2": 8,
    "River-render2": 1.2000000000000454,
    "Infopane-loading": 1268.2831,
    "ContentPreview-loading": 2053.3831,
    "Infopane-config": 1.5,
    "ContentPreview-config": 1.300000000000182,
    "ContentPreview-script": 36.399999999999636,
    "ContentPreview-connecting": 2095.1831,
    "ContentPreview-connected": 2100.5831,
    "ContentPreview-connect": 5.399999999999636,
    "ProactiveCanvas-script": 62.09999999999991,
    "ProactiveCanvas-connecting": 1296.3831,
    "ProactiveCanvas-connected": 1297.1831,
    "ProactiveCanvas-connect": 0.7999999999999545,
    "Infopane-script": 32.799999999999954,
    "Infopane-connecting": 1303.3831,
    "ComplexContentPreview-loading": 1508.6831,
    "Infopane-connected": 1304.3831,
    "Infopane-connect": 1,
    "ComplexContentPreview-config": 31.40000000000009,
    "NativeAd-loading": 2101.6831,
    "NativeAd-config": 0.6999999999998181,
    "ComplexContentPreview-script": 14.200000000000045,
    "ComplexContentPreview-connecting": 1559.3831,
    "ComplexContentPreview-connected": 1567.5831,
    "ComplexContentPreview-connect": 8.200000000000045,
    "NativeAd-script": 3.5,
    "NativeAd-connecting": 2107.3831,
    "NativeAd-connected": 2107.9831,
    "NativeAd-connect": 0.599999999999909,
    "River-render3": 0.6000000000001364,
    "ComplexContentPreview-render": 19.5,
    "Infopane-render": 26.200000000000045,
    "ContentPreview-render": 13.299999999999954,
    "ProactiveCanvas-render": 11.899999999999863,
    "NativeAd-render": 22,
    "ContentPreview-render2": 4.900000000000091,
    "ComplexContentPreview-render2": 3.2000000000000454,
    "PageSettings-loading": 1491.0831,
    "ShowFeed-loading": 1491.1831,
    "OneFooter-loading": 1491.2831,
    "FeedbackLink-loading": 1491.2831,
    "CardAction-loading": 1491.2831,
    "BingWebSSO-loading": 1491.6831,
    "UserProfileDisplay-loading": 1491.7831,
    "SearchHistoryEdge-loading": 1491.8831,
    "BreakingNews-loading": 1491.9831,
    "WeatherCard-loading": 1506.1831,
    "SportsCard-loading": 1506.3831,
    "TopSitesEdge-render2": 7.2000000000000455,
    timeToFirstByte: 587,
    timeToOnLoad: 587,
    hardwareConcurrency: 8,
    "ConfigCache.river": 0,
    "ConfigCache.contentpreview": 0,
    "ConfigCache.All": 86,
    "ConfigFetch.All": 1148,
    "SW.StartTime": 557,
    "SW.NavigationFetchTime": 0,
    "SW.NavigationCacheReadTime": -1,
    "TTVR.SearchBoxCommon": 1218,
    "TTVR.TopSitesEdge": 1222,
    "TTVR.RiverFirstSection": 1378,
    "TTVR.InfoPane": 1489,
    "TTVR.River": 1489,
    TTVR: 1489,
    "TTF.SearchBox": 1203,
    TTF: 1203,
    TFPR: 1489,
    "PageSettings-config": 44.59999999999991,
    "ShowFeed-config": 44.90000000000009,
    "OneFooter-config": 45.19999999999982,
    "FeedbackLink-config": 45.399999999999864,
    "CardAction-config": 45.799999999999954,
    "BingWebSSO-config": 45.700000000000045,
    "UserProfileDisplay-config": 46,
    "SearchHistoryEdge-config": 46.200000000000045,
    "BreakingNews-config": 46.200000000000045,
    "WeatherCard-config": 32.40000000000009,
    "SportsCard-config": 32.5,
    "SearchHistoryEdge-script": 4.899999999999864,
    "SearchHistoryEdge-connecting": 1557.3831,
    "SearchHistoryEdge-connected": 1562.2831,
    "SearchHistoryEdge-connect": 4.900000000000091,
    "Infopane-render2": 60.700000000000045,
    "Infopane-render3": 13.299999999999954,
    "NativeAd-render2": 6.800000000000182,
    "WW.Start": 46,
    "WW.getConfigTree-start": 48,
    "WW.getConfigTree-end": 85,
    "WW.AppAnonFetchStart": 86,
    "WW.AppAnonFetchEnd": 86,
    "WW.MyFeedFetchStart": 86,
    "WW.weatherpdpPdpFetchStart": 89,
    "WW.sportsteampdpPdpFetchStart": 89,
    "WW.sportsplayerpdpPdpFetchStart": 90,
    "WW.sportsleaguepdpPdpFetchStart": 90,
    "WW.moneypdpPdpFetchStart": 90,
    "WW.weatherpdpPDPFetchEnd": 162,
    "WW.moneypdpPDPFetchEnd": 238,
    "WW.sportsplayerpdpPDPFetchEnd": 301,
    "WW.sportsteampdpPDPFetchEnd": 329,
    "WW.sportsleaguepdpPDPFetchEnd": 357,
    "WW.AppAnonMessage": 665,
    "WW.MyFeedFetchEnd": 734,
    "WW.MyFeedMessage": 800,
    "PageSettings-script": 190.20000000000004,
    "PageSettings-connecting": 1727.7831,
    "PageSettings-connected": 1729.3831,
    "PageSettings-connect": 1.599999999999909,
    "ShowFeed-script": 197.20000000000004,
    "ShowFeed-connecting": 1734.9831,
    "ShowFeed-connected": 1735.6831,
    "ShowFeed-connect": 0.7000000000000455,
    "OneFooter-script": 202.30000000000018,
    "OneFooter-connecting": 1740.1831,
    "OneFooter-connected": 1740.9831,
    "OneFooter-connect": 0.7999999999999545,
    "FeedbackLink-script": 205.9000000000001,
    "FeedbackLink-connecting": 1744.0831,
    "FeedbackLink-connected": 1744.4831,
    "FeedbackLink-connect": 0.3999999999998636,
    "CardAction-script": 214.89999999999986,
    "CardAction-connecting": 1753.3831,
    "CardAction-connected": 1753.8831,
    "CardAction-connect": 0.5,
    "PageSettings-render": 52.700000000000045,
    "ShowFeed-render": 46,
    "OneFooter-render": 40.399999999999864,
    "FeedbackLink-render": 23,
    "CardAction-render": 9.599999999999909,
    "entryPoint-render2": 62.299999999999954,
    "BingWebSSO-script": 282.0999999999999,
    "BingWebSSO-connecting": 1821.5831,
    "BingWebSSO-connected": 1822.8831,
    "BingWebSSO-connect": 1.2999999999999545,
    "UserProfileDisplay-script": 286.5,
    "UserProfileDisplay-connecting": 1825.5831,
    "UserProfileDisplay-connected": 1826.4831,
    "UserProfileDisplay-connect": 0.8999999999998636,
    "BreakingNews-script": 289.5,
    "BreakingNews-connecting": 1828.8831,
    "BreakingNews-connected": 1830.6831,
    "BreakingNews-connect": 1.7999999999999545,
    "BingWebSSO-render": 18.5,
    "UserProfileDisplay-render": 17.399999999999863,
    "SearchHistoryEdge-render": 11.699999999999818,
    "BreakingNews-render": 8.100000000000136,
    "EdgeHeader-render2": 23.299999999999954,
    "WeatherCard-script": 328.89999999999986,
    "WeatherCard-connecting": 1868.9831,
    "WeatherCard-connected": 1871.9831,
    "WeatherCard-connect": 3,
    "SportsCard-script": 344.20000000000004,
    "SportsCard-connecting": 1885.0831,
    "SportsCard-connected": 1887.3831,
    "SportsCard-connect": 2.2999999999999545,
    "WeatherCard-render": 9.899999999999863,
    "SportsCard-render": 5.2999999999999545,
    "ProactiveCanvas-render2": 13.200000000000045,
    "BreakingNews-render2": 0.599999999999909,
    "SearchHistoryEdge-render2": 20.09999999999991,
    "UserProfileDisplay-render2": 2.1000000000001364,
    "EditorsChoicePromoCard-loading": 2101.5831,
    "EditorsChoicePromoCard-config": 0.8000000000001819,
    "EditorsChoicePromoCard-script": 25.5,
    "EditorsChoicePromoCard-connecting": 2129.0831,
    "EditorsChoicePromoCard-connected": 2129.5831,
    "EditorsChoicePromoCard-connect": 0.5,
    "WeatherCard-render2": 18.200000000000273,
    "WeatherCard-render3": 3.5,
    "OneFooter-render2": 2.400000000000091,
    "NativeAd-render3": 2.900000000000091,
    "SportsCard-render2": 8.099999999999909
  };
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
