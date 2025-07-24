import React from "react";
import TableComponent from '../../Table/table'

const MyTable = () => {
  return (
    <TableComponent
      headers={["Actions Planned for Rejection"]}
      rows={[
        "Red Bin Analysis",
        "Re-Training of Operators",
        "Top 5 defects Analysis",
         ]}
    />
  );
};

export default MyTable;
