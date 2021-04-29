import React, { useEffect, useState } from "react";
import { Heading, View, Content, Link } from "@adobe/react-spectrum";
import { Statistic, Card, Row, Col, Typography, Skeleton } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import CountUp from "react-countup";
import { createTableFromRawData } from "./helpers";
import actionWebInvoke from "../utils";
import actions from "../config.json";

const { Title } = Typography;

const Dashboard = (props) => {
  const [lastYearSameWeek, setlastYearSameWeek] = useState(null);
  const [lastWeek, setLastWeek] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dData, setDdata] = useState([]);

  useEffect(() => {
    getDashData();
  }, []);

  useEffect(() => {
    if (lastWeek && lastYearSameWeek) {
      const dataToShow = createTableFromRawData(lastYearSameWeek, lastWeek);
      setDdata(dataToShow);
    }
  }, [lastWeek, lastYearSameWeek]);
  /*
  Move fetch API logic, separate the UI
 */

  async function getDashData() {
    let view_id = "<GA_VIEW_ID>";
    let basic_report = {
      reportRequests: [
        {
          viewId: view_id,
          dateRanges: [],
          metrics: [],
          dimensions: [],
        },
      ],
    };
    /*
      Update Dimensions, Metrics and Date range to create the payload for API
      for both Adobe & Google Analytics. 
      Ideally done dynamically via UI
    */
    const gAparams = {
      gaPayLoad: basic_report,
    };
    const aAparams = {
      aaPayLoad: {
        query: ""
      },
    };

    try {
      // invoke backend action
      let headers = {};
      if (props.ims.token && !headers.authorization) {
        headers.authorization = `Bearer ${props.ims.token}`;
      }
      if (props.ims.org && !headers["x-gw-ims-org-id"]) {
        headers["x-gw-ims-org-id"] = props.ims.org;
      }
      setLoading(true);
      // destructure by source
      const [gaData, aaData] = await Promise.all([
        actionWebInvoke(actions["googleAnalytics"], headers, gAparams),
        actionWebInvoke(actions["adobeAnalytics"], headers, aAparams),
      ]);
      const lastFYSameWeek = await gaData;
      const lastWeek = await aaData;

      if (lastFYSameWeek && lastWeek) {
        const aaTotals = lastWeek.summaryData.totals;
        const gaTotals = lastFYSameWeek[0].data.totals[0].values;
        setlastYearSameWeek(gaTotals);
        setLastWeek(aaTotals);
        setLoading(false);
      }
    } catch (e) {
      // log and store any error message
      const formattedResult = `time: ${Date.now()} ms\n` + e.message;
      console.error(e);
      setLoading(false);
      setError(formattedResult);
    }
  }

  return (
    <div>
      <Card
        title={
          "Key Performance Indicators (YOY Comparison: FY20 From GA & FY21 from Adobe Analytics"
        }
      >
        <Skeleton loading={loading} active={true}>
          <Row gutter={16}>
            {dData
              ? dData.map((item) => (
                  <Col span={4} key={item.metricName}>
                    <Card title={item.metricName}>
                      <Statistic
                        title={
                          <Title level={3}>
                            <CountUp
                              prefix={item.metricPrefix}
                              separator=","
                              preserveValue={true}
                              end={item.metricValue}
                              duration={3}
                            />
                          </Title>
                        }
                        value={item.metricChange}
                        precision={2}
                        valueStyle={
                          item.metricStatus === "up"
                            ? {
                                color: "#3f8600",
                                fontSize: "12px",
                              }
                            : {
                                color: "#cf1322",
                                fontSize: "12px",
                              }
                        }
                        prefix={
                          item.metricStatus === "up" ? (
                            <ArrowUpOutlined />
                          ) : (
                            <ArrowDownOutlined />
                          )
                        }
                        suffix="%"
                      />
                    </Card>
                  </Col>
                ))
              : ""}
          </Row>
        </Skeleton>
      </Card>
    </div>
  );
};

export default Dashboard;
