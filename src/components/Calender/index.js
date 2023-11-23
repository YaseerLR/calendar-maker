import React, { useEffect, useState, useCallback } from "react";
import Gantt, {
  Tasks,
  Dependencies,
  Resources,
  ResourceAssignments,
  Column,
  Editing,
} from "devextreme-react/gantt";
import SelectBox from "devextreme-react/select-box";
import { tasks, dependencies, resources, resourceAssignments } from "./data.js";
import TaskTooltipTemplate from "./TaskTooltipTemplate.js";
import TaskProgressTooltipContentTemplate from "./TaskProgressTooltipContentTemplate.js";
import TaskTimeTooltipContentTemplate from "./TaskTimeTooltipContentTemplate.js";
import { useMarker } from "react-mark.js";

const scaleTypes = [
  "auto",
  "minutes",
  "hours",
  "days",
  "weeks",
  "months",
  "quarters",
  "years",
];

function Calender() {
  const { markerRef, marker } = useMarker();
  const [ganttConfig, setGanttConfig] = useState({
    scaleType: "months",
    taskTitlePosition: "outside",
    showResources: true,
    showDependencies: true,
    showCustomTaskTooltip: true,
    startDateRange: new Date(2021, 10, 1),
    endDateRange: new Date(2024, 5, 28),
  });
  const [searchText, setSearchText] = useState("");
  const [taskList, setTaskList] = useState(tasks);

  const tempObj = Object.assign(
    {},
    ...tasks.map((task) => ({
      [task.id]: { ...task },
    }))
  );

  function getParant(id) {
    if (!id) {
      return [];
    } else {
      if (tempObj[id].parentId) {
        return [...getParant(tempObj[id].parentId), tempObj[id]];
      } else {
        return [tempObj[id]];
      }
    }
  }

  // const mark = useCallback(() => {
  //   marker?.mark(searchText);
  // }, [marker, searchText]);

  // useEffect(() => {
  //   if (marker) {
  //     marker?.unmark();
  //     searchText && marker.mark(searchText);
  //   }
  // }, [marker, searchText]);

  useEffect(() => {
    if (searchText) {
      let filterData = [];
      tasks?.map((item) => {
        if (item.title.toLowerCase().includes(searchText.toLowerCase()) || item.start.toString().toLowerCase().includes(searchText.toLowerCase()) || item.end.toString().toLowerCase().includes(searchText.toLowerCase())) {
          filterData.push(item);
          if (item.parentId) {
            const _tempFilter = Object.assign(
              {},
              ...[...filterData, ...getParant(item.parentId)].map((task) => ({
                [task.id]: { ...task },
              }))
            );
            filterData = Object.values(_tempFilter);
          }
        }
      });
      setTaskList(filterData);
    } else {
      setTaskList(tasks);
    }
  }, [searchText]);

  return (
    <div id="form-demo">
      <div className="options">
        <div className="column">
          <div className="option">
            <div className="value">
              <SelectBox
                items={scaleTypes}
                value={ganttConfig.scaleType}
                onValueChanged={onScaleTypeChanged}
              />
            </div>
          </div>
        </div>
        <div className="column chart-search-wrapper">
          <input
            className="search"
            type="text"
            placeholder="search..."
            value={searchText}
            onChange={(e) => {
              // mark();
              setSearchText(e.target.value);
            }}
          />
        </div>
      </div>
      {/* ref={markerRef} */}
      <div className="widget-container" >
        <Gantt
          taskListWidth={500}
          height={700}
          taskTitlePosition={ganttConfig.taskTitlePosition}
          scaleType={ganttConfig.scaleType}
          showResources={ganttConfig.showResources}
          showDependencies={ganttConfig.showDependencies}
          taskTooltipContentRender={
            ganttConfig.showCustomTaskTooltip ? TaskTooltipTemplate : false
          }
          taskTimeTooltipContentRender={
            ganttConfig.showCustomTaskTooltip
              ? TaskTimeTooltipContentTemplate
              : false
          }
          taskProgressTooltipContentRender={
            ganttConfig.showCustomTaskTooltip
              ? TaskProgressTooltipContentTemplate
              : false
          }
          startDateRange={ganttConfig.startDateRange}
          endDateRange={ganttConfig.endDateRange}
        >
          <Tasks dataSource={taskList} />
          <Dependencies dataSource={dependencies} />
          <Resources dataSource={resources} />
          <ResourceAssignments dataSource={resourceAssignments} />

          <Column dataField="title" caption="Subject" width={300} />
          <Column dataField="start" caption="Start Date" />
          <Column dataField="end" caption="End Date" />

          <Editing enabled />
        </Gantt>
      </div>
    </div>
  );

  function onScaleTypeChanged(e) {
    setGanttConfig({
      ...ganttConfig,
      scaleType: e.value,
    });
  }
}
export default Calender;
