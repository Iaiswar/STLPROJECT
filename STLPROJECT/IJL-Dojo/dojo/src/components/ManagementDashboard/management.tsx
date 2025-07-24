import React, { useEffect } from "react";
import TrainingSummaryCard from "./Card/Cardprops";
import Training from "./Graphs/OprTraining-JoinedvsTrained/train";
import Plan from "./Graphs/NoOftrainingPlanvsActual/plan";
import Defects from "./Graphs/ManRelatedDefectsTrend/defects";
import DefectsRejected from "./Graphs/ManRelatedDefectsInternal/defectsRejected";
import MyTable from "./Graphs/ActionPlanned/mytable";
import PlanTwo from "./Graphs/NoOftrainingPlanvsActual2/plan2";
// import Nav from "../HomeNav/nav";

const Management: React.FC = () => {
  useEffect(() => {
        window.scrollTo(0, 0);
    } ,[location]);
  return (
    <>
      {/* <Nav /> */}
      <div className="w-full min-h-screen box-border bg-gray-50">
        <div className="w-full mx-auto flex flex-col">
          <div className="bg-black mb-4 md:mb-6">
            <h4 className="text-2xl md:text-3xl font-bold text-white py-5 text-center">
              Management Review Dashboard
            </h4>
          </div>

          <div className="flex flex-col lg:flex-row w-full gap-3 md:gap-4 px-2 sm:px-4">
            {/* Left column - Summary Cards */}
            <div className="w-full lg:w-[30%] xl:w-[25%] flex flex-col gap-3 md:gap-4">
              <div className="w-full">
                <TrainingSummaryCard
                  title="Training Summary"
                  getUrl="http://127.0.0.1:8000/current-month/training-data/"
                  cardColors={["#3498db", "#3498db", "#8e44ad", "#8e44ad"]}
                  subtopics={[
                    { dataKey: "new_operators_joined", displayText: "New Operators Joined" },
                    { dataKey: "new_operators_trained", displayText: "New Opr. Trained" },
                    { dataKey: "total_training_plans", displayText: "Total Trainings Plan" },
                    { dataKey: "total_trainings_actual", displayText: "Total Trainings Act" }
                  ]} />
              </div>
              <div className="w-full">
                <TrainingSummaryCard
                  title="Man Related Defects"
                  getUrl="http://127.0.0.1:8000/current-month/defects-data/"
                  cardColors={["#143555", "#143555", "#6c6714", "#6c6714", "#5d255d", "#5d255d"]}
                  subtopics={[
                    { dataKey: "total_defects_msil", displayText: "Total Defects at MSIL" },
                    { dataKey: "ctq_defects_msil", displayText: "CTQ Defects at MSIL" },
                    { dataKey: "total_defects_tier1", displayText: "Total Defects at Tier-1" },
                    { dataKey: "ctq_defects_tier1", displayText: "CTQ Defects at Tier-1" },
                    { dataKey: "total_internal_rejection", displayText: "Total Internal Rejection" },
                    { dataKey: "ctq_internal_rejection", displayText: "CTQ Internal Rejection" }
                  ]} />
              </div>
            </div>

            {/* Right column - Graphs */}
            <div className="w-full lg:w-[70%] xl:w-[75%] flex flex-col gap-3 md:gap-4">
              {/* First row of graphs */}
              <div className="flex flex-col sm:flex-row w-full gap-3 md:gap-4">
                <div className="flex-1 min-w-0 h-64 sm:h-56 shadow-lg rounded-lg overflow-hidden bg-white p-1">
                  <Training />
                </div>
                <div className="flex-1 min-w-0 h-64 sm:h-56 shadow-lg rounded-lg overflow-hidden bg-white p-1">
                  <Plan />
                </div>
              </div>

              {/* Second row of graphs */}
              <div className="flex flex-col sm:flex-row w-full gap-3 md:gap-4">
                <div className="flex-1 min-w-0 h-60 sm:h-52 shadow-lg rounded-lg overflow-hidden bg-white p-1">
                  <Defects />
                </div>
                <div className="flex-1 min-w-0 h-60 sm:h-52 shadow-lg rounded-lg overflow-hidden bg-white p-1">
                  <DefectsRejected />
                </div>
              </div>

              {/* Third row of graphs */}
              <div className="flex flex-col sm:flex-row w-full gap-3 md:gap-4">
                <div className="flex-1 min-w-0 h-auto shadow-lg rounded-lg overflow-hidden bg-white p-1">
                  <MyTable />
                </div>
                <div className="flex-1 min-w-0 h-auto shadow-lg rounded-lg overflow-hidden bg-white p-1">
                  <PlanTwo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Management;