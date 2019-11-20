import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { find, identity, groupBy } from "lodash-es";

const relativeMetrics = {
  config: { from: "loading", color: "red" },
  script: { from: "config", color: "yellow" },
  connect: { from: "connecting", color: "blue" },
  render: { from: "rendering", color: "green" },
  render2: { from: "rendering2", color: "green" },
  render3: { from: "rendering3", color: "green" }
};

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { width: 100 };
  }

  componentDidMount() {
    window.addEventListener("mousewheel", e => {
      this.setState({
        width: this.state.width * (e.wheelDelta < 0 ? 0.9 : 1.1)
      });
    });
  }

  render() {
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
      const absoluteTimeline = timeline.map(info => ({
        ...info,
        value: getAbsoluteValue(timeline, info)
      }));

      absoluteTimeline.sort((a, b) => a.value - b.value);
      timelineList.push(absoluteTimeline);

      // get the running max value from the last metric on each sorted timeline
      maxValue = Math.max(
        maxValue,
        absoluteTimeline[absoluteTimeline.length - 1].value
      );
    });

    // sort the list of timelines by first appearing metric for each timeline.
    // This is the order we will render the timeline view from top to bottom,
    // so that each line represents a single experience's timeline.
    timelineList.sort((a, b) => a[0].value - b[0].value);

    // log debug info
    console.log("max = " + maxValue);
    console.log(JSON.stringify(timelineList, null, 4));

    return (
      <div className="App" style={{ width: `${this.state.width}%` }}>
        {timelineList.map((timeline, index) =>
          renderExperienceTimeline(timeline, maxValue, index)
        )}
      </div>
    );
  }
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
          renderTimelineInfo(experienceTimeline, info, maxValue, index)
        )}
      </div>
    </div>
  );
}

function renderTimelineInfo(timeline, info, maxValue, index) {
  // we only want to deal with the relative metrics - absolute ones don't matter, and
  // are only used for calculating from/to deltas
  const relativeInfo = relativeMetrics[info.metric];
  if (!relativeInfo) {
    return null;
  }

  const fromValue = find(timeline, info2 => info2.metric === relativeInfo.from)
    .value;
  const leftPercent = relativeWidthPercent(fromValue, maxValue);

  const widthValue = info.value - fromValue;
  const widthPercent = relativeWidthPercent(widthValue, maxValue);

  return (
    <div
      key={index}
      title={`${info.metric} - ${widthValue} ms`}
      style={{
        //display: "inline-block",
        position: "absolute",
        height: "100%",
        background: relativeInfo.color,
        left: leftPercent + "%",
        width: widthPercent + "%",
        overflow: "hidden",
        border: "1px solid " + relativeInfo.color,
        textAlign: "left"
      }}
    >
      {info.metric}
    </div>
  );
}

function relativeWidthPercent(value, maxValue) {
  return (Math.round((value / maxValue) * 1000) / 1000) * 100;
}

function getAbsoluteValue(timeline, info) {
  const relativeInfo = relativeMetrics[info.metric];

  // if metric is a relative one, we need to continue adding the
  // delta to the parent 'from' aboslute
  if (relativeInfo) {
    var antecedentInfo = find(
      timeline,
      info => info.metric === relativeInfo.from
    );
    return info.value + getAbsoluteValue(timeline, antecedentInfo);
  }

  // if it's not in relative lookup, that means we've found the absolute value
  return info.value;
}

function getPerfData() {
  return {
    TTPV: 93,
    "entryPoint-connecting": 94.07000005012378,
    "BingImageData-loading": 94.45000003324822,
    "BingImageData-config": 6.920000014360994,
    "BingImageData-script": 1.8649999983608723,
    "EdgeHeader-loading": 108.9600000414066,
    "PivotContent-loading": 109.70500000985339,
    "EdgeHeader-config": 6.624999979976565,
    "EdgeHeader-script": 1.7099999822676182,
    "EdgeHeader-connecting": 118.03000001236796,
    "SearchBoxEdge-loading": 118.86500002583489,
    "TopSitesEdge-loading": 119.3900000071153,
    "PivotsNav-loading": 119.92000002646819,
    "PoweredbyLegend-loading": 120.45000004582107,
    "PivotContent-config": 12.110000010579824,
    "PivotContent-script": 0.645000021904707,
    "PivotContent-connecting": 123.13500000163913,
    "PivotContent-connected": 123.76500002574176,
    "PivotContent-connect": 0.6300000241026282,
    "SearchBoxEdge-config": 7.775000005494803,
    "SearchBoxEdge-script": 0.45499997213482857,
    "SearchBoxEdge-connecting": 127.81999999424443,
    "SearchBoxEdge-connected": 128.400000045076,
    "SearchBoxEdge-connect": 0.5800000508315861,
    "TopSitesEdge-config": 10.609999997541308,
    "PivotsNav-config": 10.67499996861443,
    "PivotsNav-script": 0.0350000336766243,
    "PivotsNav-connecting": 131.21500000124797,
    "PoweredbyLegend-config": 11.599999968893826,
    "PoweredbyLegend-script": 0.2049999893642962,
    "PoweredbyLegend-connecting": 132.88500002818182,
    "PoweredbyLegend-connected": 133.46000004094094,
    "PoweredbyLegend-connect": 0.5750000127591193,
    "TopSitesEdge-script": 6.010000011883676,
    "TopSitesEdge-connecting": 136.65000000037253,
    "TopSitesEdge-connected": 139.34500003233552,
    "TopSitesEdge-connect": 2.6950000319629908,
    "PivotsNav-connected": 152.3049999959767,
    "PivotsNav-connect": 21.089999994728714,
    "EdgeHeader-connected": 152.6100000482984,
    "EdgeHeader-connect": 34.580000035930425,
    "entryPoint-connected": 152.99000003142282,
    "entryPoint-connect": 58.91999998129904,
    "entryPoint-rendering": 157.5550000416115,
    "EdgeHeader-rendering": 165.09500000393018,
    "SearchBoxEdge-rendering": 171.3549999985844,
    "TopSitesEdge-rendering": 181.43500003498048,
    "PivotsNav-rendering": 193.63500003237277,
    "PoweredbyLegend-rendering": 199.4200000190176,
    "PivotContent-rendering": 202.96500000404194,
    "SearchBoxEdge-render": 34.25500000594184,
    "TopSitesEdge-render": 24.29999999003485,
    "PivotsNav-render": 12.575000000651926,
    "PoweredbyLegend-render": 7.214999990537763,
    "EdgeHeader-render": 42.27000003447756,
    "PivotContent-render": 4.460000025574118,
    "entryPoint-render": 50.35999999381602,
    "River-connecting": 241.73000000882894,
    "ProactiveCanvas-loading": 266.26000000396743,
    "River-connected": 266.98499999474734,
    "River-connect": 25.254999985918403,
    "PivotContent-rendering2": 268.9799999934621,
    "River-rendering": 270.1700000325218,
    "River-render": 2.8099999763071537,
    "PivotContent-render2": 4.140000033657998,
    "ProactiveCanvas-config": 15.959999989718199,
    "ProactiveCanvas-script": 18.180000013671815,
    "ProactiveCanvas-connecting": 301.3300000457093,
    "ProactiveCanvas-connected": 302.1900000167079,
    "ProactiveCanvas-connect": 0.859999970998615,
    "River-rendering2": 379.6650000149384,
    "River-render2": 2.1600000327453017,
    "Infopane-loading": 382.28000001981854,
    "ContentPreview-loading": 765.2400000370108,
    "Infopane-config": 5.475000012665987,
    "ContentPreview-config": 168.9149999874644,
    "ContentPreview-script": 10.249999992083758,
    "ContentPreview-connecting": 906.6400000010617,
    "ContentPreview-connected": 910.0500000058673,
    "ContentPreview-connect": 3.4100000048056245,
    "Infopane-script": 31.405000016093254,
    "Infopane-connecting": 420.0800000107847,
    "ComplexContentPreview-loading": 723.2050000457093,
    "Infopane-connected": 421.36999999638647,
    "Infopane-connect": 1.289999985601753,
    "NativeAd-loading": 800.4350000410341,
    "ComplexContentPreview-config": 31.56999999191612,
    "NativeAd-config": 210.3149999747984,
    "ComplexContentPreview-script": 3.9949999772943556,
    "ComplexContentPreview-connecting": 760.1100000320002,
    "ComplexContentPreview-connected": 761.205000046175,
    "ComplexContentPreview-connect": 1.0950000141747296,
    "NativeAd-script": 0.11500000255182385,
    "NativeAd-connecting": 929.3650000472553,
    "NativeAd-connected": 930.0900000380352,
    "NativeAd-connect": 0.7249999907799065,
    "River-rendering3": 468.90999999595806,
    "River-render3": 0.7350000087171793,
    "Infopane-rendering": 473.63000002224,
    "ComplexContentPreview-rendering": 1162.8350000246428,
    "ProactiveCanvas-rendering": 494.63500001002103,
    "ContentPreview-rendering": 1168.2550000259653,
    "NativeAd-rendering": 1158.8250000495464,
    "ComplexContentPreview-render": 19.07999999821186,
    "Infopane-render": 35.220000019762665,
    "ProactiveCanvas-render": 14.840000018011779,
    "ContentPreview-render": 14.619999972637743,
    "NativeAd-render": 22.264999977778643,
    "ContentPreview-rendering2": 1396.645000029821,
    "ContentPreview-render2": 7.039999996777624,
    "ComplexContentPreview-rendering2": 1389.560000039637,
    "ComplexContentPreview-render2": 4.064999986439943,
    "PageSettings-loading": 704.7550000133924,
    "ShowFeed-loading": 705.2900000126101,
    "OneFooter-loading": 705.6400000001304,
    "FeedbackLink-loading": 705.965000030119,
    "CardAction-loading": 706.2900000018999,
    "UserProfileDisplay-loading": 706.6450000274926,
    "SearchHistoryEdge-loading": 707.1050000376999,
    "BreakingNews-loading": 707.5450000120327,
    "WeatherCard-loading": 713.9400000451133,
    "SportsCard-loading": 714.2750000348315,
    "MoneyCard-loading": 714.6050000446849,
    "SpotlightPreview-loading": 717.1500000404194,
    "NativeAd-rendering2": 1095.6550000119023,
    "NativeAd-render2": 1.185000000987202,
    "TopSitesEdge-rendering2": 730.0900000263937,
    "TopSitesEdge-render2": 10.170000023208559,
    timeToFirstByte: 7,
    timeToOnLoad: 78,
    htmlCached: 0,
    vendorsJSCached: 1,
    microsoftJSCached: 1,
    commonJSCached: 1,
    experienceJSCached: 1,
    rtt: 0,
    downlink: 10,
    hardwareConcurrency: 8,
    "ConfigFetch.river": 78,
    "ConfigFetch.contentpreview": 7,
    "ConfigCache.All": 22,
    "ConfigFetch.All": 247,
    "TTVR.SearchBoxCommon": 224,
    "TTVR.TopSitesEdge": 227,
    "TTVR.RiverFirstSection": 548,
    "TTVR.InfoPane": 703,
    "TTVR.River": 703,
    TTVR: 703,
    "TTF.SearchBox": 206,
    TTF: 206,
    TFPR: 703,
    "PageSettings-config": 122.40500003099442,
    "PivotsNav-rendering2": 836.7100000032224,
    "PivotsNav-render2": 2.210000006016344,
    "ShowFeed-config": 135.19499998074025,
    "OneFooter-config": 135.64500003121793,
    "FeedbackLink-config": 136.2000000081025,
    "CardAction-config": 136.65000000037253,
    "UserProfileDisplay-config": 136.93500001681969,
    "SearchHistoryEdge-config": 137.89999997243285,
    "SearchHistoryEdge-script": 0.4199999966658652,
    "SearchHistoryEdge-connecting": 846.6500000213273,
    "SearchHistoryEdge-connected": 847.1750000026077,
    "SearchHistoryEdge-connect": 0.5249999812804163,
    "BreakingNews-config": 140.19000000553206,
    "NativeAd-rendering3": 863.6100000003353,
    "NativeAd-render3": 16.41500002006069,
    "WeatherCard-config": 169.22499996144325,
    "SportsCard-config": 169.72499998519197,
    "MoneyCard-config": 169.95499999029562,
    "SpotlightPreview-config": 209.22999997856095,
    "PageSettings-script": 120.29499997152016,
    "PageSettings-connecting": 948.3950000139885,
    "PageSettings-connected": 948.9199999952689,
    "PageSettings-connect": 0.5249999812804163,
    "ShowFeed-script": 109.33500004466623,
    "ShowFeed-connecting": 950.5550000467338,
    "ShowFeed-connected": 951.05000003241,
    "ShowFeed-connect": 0.4949999856762588,
    "PivotsNav-rendering3": 955.0950000411831,
    "PivotsNav-render3": 17.02500000828877,
    "OneFooter-script": 132.22500000847504,
    "OneFooter-connecting": 974.3800000287592,
    "OneFooter-connected": 975.3900000359863,
    "OneFooter-connect": 1.0100000072270632,
    "CardAction-script": 133.99500004015863,
    "CardAction-connecting": 977.6399999973364,
    "CardAction-connected": 977.8999999980442,
    "CardAction-connect": 0.26000000070780516,
    "SportsCard-script": 97.0450000022538,
    "SportsCard-connecting": 981.7900000489317,
    "SportsCard-connected": 983.6900000227615,
    "SportsCard-connect": 1.8999999738298357,
    "FeedbackLink-script": 146.7049999628216,
    "FeedbackLink-connecting": 989.9500000174157,
    "FeedbackLink-connected": 990.3100000228733,
    "FeedbackLink-connect": 0.3600000054575503,
    "entryPoint-rendering2": 992.690000042785,
    "PageSettings-rendering": 995.664999994915,
    "ShowFeed-rendering": 998.9899999927729,
    "OneFooter-rendering": 1001.0800000163727,
    "FeedbackLink-rendering": 1004.0600000065751,
    "CardAction-rendering": 1016.3400000310503,
    "PageSettings-render": 23.26000004541129,
    "ShowFeed-render": 20.380000001750886,
    "OneFooter-render": 18.725000030826777,
    "FeedbackLink-render": 16.135000041686,
    "CardAction-render": 4.4849999831058085,
    "entryPoint-render2": 28.25999999186024,
    "UserProfileDisplay-script": 178.27499995473772,
    "UserProfileDisplay-connecting": 1022.6050000055693,
    "UserProfileDisplay-connected": 1023.0699999956414,
    "UserProfileDisplay-connect": 0.46499999007210135,
    "BreakingNews-script": 175.79000000841916,
    "BreakingNews-connecting": 1024.1650000098161,
    "BreakingNews-connected": 1025.4050000221469,
    "BreakingNews-connect": 1.2400000123307109,
    "EdgeHeader-rendering2": 1027.0550000132062,
    "UserProfileDisplay-rendering": 1028.344999998808,
    "SearchHistoryEdge-rendering": 1031.89000004204,
    "BreakingNews-rendering": 1036.0100000398234,
    "UserProfileDisplay-render": 10.285000025760382,
    "SearchHistoryEdge-render": 7.199999992735684,
    "BreakingNews-render": 3.49499995354563,
    "EdgeHeader-render2": 12.515000009443611,
    "WeatherCard-script": 158.6700000334531,
    "WeatherCard-connecting": 1042.665000015404,
    "WeatherCard-connected": 1046.2000000406988,
    "WeatherCard-connect": 3.535000025294721,
    "MoneyCard-script": 162.2450000140816,
    "MoneyCard-connecting": 1047.5250000017695,
    "MoneyCard-connected": 1049.6400000411086,
    "MoneyCard-connect": 2.1150000393390656,
    "ProactiveCanvas-rendering2": 1050.6100000347942,
    "WeatherCard-rendering": 1052.190000016708,
    "SportsCard-rendering": 1055.0900000380352,
    "MoneyCard-rendering": 1057.5650000246242,
    "WeatherCard-render": 13.144999975338578,
    "SportsCard-render": 10.719999962020665,
    "MoneyCard-render": 8.719999983441085,
    "ProactiveCanvas-render2": 15.774999978020787,
    "SpotlightPreview-script": 151.18500002427027,
    "SpotlightPreview-connecting": 1078.3999999985099,
    "SpotlightPreview-connected": 1080.1050000009127,
    "SpotlightPreview-connect": 1.7050000024028122,
    "Infopane-rendering2": 1082.9399999929592,
    "SpotlightPreview-rendering": 1128.450000018347,
    "SpotlightPreview-render": 47.190000012051314,
    "Infopane-render2": 100.15500005101785,
    "Infopane-rendering3": 1185.4700000258163,
    "Infopane-render3": 13.709999970160425,
    "BreakingNews-rendering2": 1230.0950000062585,
    "BreakingNews-render2": 0.640000042039901,
    "WeatherCard-rendering2": 1233.5150000290014,
    "WeatherCard-render2": 9.429999976418912,
    "MoneyCard-rendering2": 1249.820000026375,
    "MoneyCard-render2": 1.820000004954636,
    "MoneyCard-rendering3": 1252.9700000304729,
    "MoneyCard-render3": 1.4949999749660492,
    "SpotlightPreview-rendering2": 1362.3050000169314,
    "SpotlightPreview-render2": 3.165000001899898,
    "OneFooter-rendering2": 1478.1400000210851,
    "OneFooter-render2": 2.1800000104121864,
    "SportsCard-rendering2": 1580.3750000195578,
    "SportsCard-render2": 10.494999994989485
  };
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
