
import DataTable from "react-data-table-component";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRetentionAlerts } from "../../../redux/slices/retentionAlertSlice";

const data = [
  { id: 1, customer: "CUST002", lastActive: "2025-08-15", daysInactive: 25 },
  { id: 2, customer: "CUST003", lastActive: "2025-07-30", daysInactive: 40 },
];

const columns = [
  { name: "Customer ID", selector: row => row.customer },
  { name: "Last Active", selector: row => row.lastActive },
  { name: "Days Inactive", selector: row => row.daysInactive },
  {
    name: "Alert",
    cell: () => <span className="text-red-600 font-semibold">Send Alert</span>,
  },
];

const RetentionAlerts = () => {


  const dispatch = useDispatch();
  const { alerts, loading, error } = useSelector((state) => state.retention);

  useEffect(() => {
    dispatch(fetchRetentionAlerts());
  }, [dispatch]);

  
  return (
    <div className="p-2 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-amber-600">
        Retention Alerts
      </h2>
      <DataTable columns={columns} data={data} pagination striped />
    </div>
  );
};

export default RetentionAlerts;
