import Actions from "../holidayActions";

export const holidayTableColumn = (currentPage, rowsPerPage) => [
  {
    name: "#",
    selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
    sortable: false,
    width: "60px",
  },    
  {
    name: "Holiday Name",
    width: "300px",
    selector: (row) => row.name,
    sortable: true,
    cell: (row) => <div className="truncate-text">{row.name}</div>,
  },
  {
    name: "Start Date",
    selector: (row) => row.start_date,
    sortable: true,
  },
  {
    name: "End Date",
    selector: (row) => row.end_date,
    sortable: true,
  },
  {
    name: "Actions",
    ignoreRowClick: true,
    allowOverflow: true,
    cell: (row) => (
      <div className="d-flex">
        <Actions row={row}/>
      </div>
    ),
  },
];
