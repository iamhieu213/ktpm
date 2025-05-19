import Row from "../../../components/Row";
import Heading from "../../../components/Heading";
import StatisticsTable from "../../../features/statistics/StatisticsTable";
import { useState } from "react";

export default function Apartments() {
   const [keyword, setKeyword] = useState('');
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Statistics</Heading>
      </Row>
      <StatisticsTable keyword={keyword}/>
    </>
  );
}